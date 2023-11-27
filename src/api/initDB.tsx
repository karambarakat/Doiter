// import type { NoSerialize } from "@builder.io/qwik";
import type { NoSerialize, Signal } from "@builder.io/qwik";
import {
  createContextId,
  noSerialize,
  useContext,
  useContextProvider,
  useSignal,
  // useContextProvider,
  // useSignal,
  useVisibleTask$,
} from "@builder.io/qwik";
import workerDb from "./db.worker?worker";
import sql from "@sqlite.org/sqlite-wasm";
import type {
  BidirectionalFunction,
  ExecArgument,
  Messages,
} from "./db.worker";

function setUpWorker() {
  return new Promise<Worker | undefined>((res) => {
    const worker = new workerDb();
    worker.onmessage = (e) => {
      const message: Messages = e.data;
      if (message.type === "OpfsDb_not_found") {
        res(undefined);
      }
      if (message.type === "OpfsDb_found") {
        res(worker);
      }
    };
  });
}

function setUpBidirectional(worker: Worker) {
  const channel = new MessageChannel();

  worker.postMessage(
    {
      type: "TRANSFER_PORT",
    } as Messages,
    [channel.port2]
  );

  async function bidirectional(exec: ExecArgument) {
    // some how this has to be locked in case it is called twice
    channel.port1.postMessage({ type: "EXEC", exec } as Messages);

    const event = await new Promise<MessageEvent>((res) => {
      channel.port1.onmessage = (event: MessageEvent) => {
        res(event);
      };
    });

    return event.data;
  }

  return bidirectional as BidirectionalFunction;
}

async function setUpLocal() {
  const conn = await sql();
  const db = new conn.oo1.JsStorageDb("local");

  async function exec(exec: ExecArgument) {
    const result = db.exec({
      rowMode: "object",
      ...exec,
    } as any) as any as Promise<object>;

    return await result;
  }

  return exec;
}

type CC = {
  conn: "local" | "opfs" | "loading";
  exec: NoSerialize<BidirectionalFunction>;
};
const dbContext = createContextId<Signal<CC>>("db");
export const useDB = () => useContext(dbContext);

export function useInitDB() {
  const shared = useSignal<CC>({ conn: "loading", exec: undefined });

  useVisibleTask$(
    async () => {
      const worker = await setUpWorker();

      let exec;

      if (worker) {
        exec = setUpBidirectional(worker);
      } else {
        exec = await setUpLocal();
      }

      shared.value = {
        conn: worker ? "opfs" : "local",
        exec: noSerialize(exec),
      };

      shared.value.exec?.({
        sql: `
      CREATE TABLE IF NOT EXISTS todos (
        id INTEGER PRIMARY KEY,
        name TEXT NOT NULL,
        completed BOOLEAN NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
      `,
      });
    },
    { strategy: "document-ready" }
  );

  useContextProvider(dbContext, shared);
}
