import {
  NoSerialize,
  noSerialize,
  useSignal,
  useVisibleTask$,
} from "@builder.io/qwik";

import workerUrl from "./worker?worker";
import { BidirectionalFunction, ExecArgument, Messages } from "./worker";

export function useWorker() {
  const execSignal = useSignal<NoSerialize<BidirectionalFunction>>();
  useVisibleTask$(async () => {
    const exec = await setBidirectionalWithWorker();

    execSignal.value = noSerialize(exec);
  });
}

function workerInit() {
  return new Promise<Worker>((res) => {
    const worker = new workerUrl();
    worker.onmessage = (event: MessageEvent) => {
      const data: Messages = event.data;
      if (data.type === "LOAD") {
        res(worker);
      }
    };
  });
}

async function setBidirectionalWithWorker() {
  if (typeof window === "undefined")
    throw new Error("initialize worker only in browser");

  const worker = await workerInit();

  const channel = new MessageChannel();

  worker.postMessage(
    {
      type: "TRANSFER_PORT",
    },
    [channel.port2]
  );

  async function bidirectional(exec: ExecArgument) {
    channel.port1.postMessage({ type: "EXEC", exec } as Messages);

    const event = await new Promise<MessageEvent>((res) => {
      channel.port1.onmessage = (event: MessageEvent) => {
        res(event);

        // clean up
        channel.port1.onmessage = null;
      };
    });

    return event.data;
  }

  return bidirectional as BidirectionalFunction;
}
