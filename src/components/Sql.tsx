import type { NoSerialize, Signal } from "@builder.io/qwik";
import {
  component$,
  createContextId,
  noSerialize,
  useContext,
  useContextProvider,
  useSignal,
  useVisibleTask$,
} from "@builder.io/qwik";
import type { Database } from "sql.js";
import sql from "sql.js";

const dbContext = createContextId<Signal<NoSerialize<Database>>>("db");
const useDb = () => useContext(dbContext);
// const db: { value: Database | undefined } = { value: undefined };

const Sql = component$(() => {
  const db = useSignal<NoSerialize<Database | undefined>>(undefined);
  useVisibleTask$(
    async () => {
      const worker = new Worker("/db.js");
      worker;
      // worker.
      // worker.postMessage({ action: "init" });
      const wasm = await fetch(
        "https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.8.0/sql-wasm.wasm"
      );
      const wasmBinary = await wasm.arrayBuffer();

      const conn = await sql({
        wasmBinary,
      });

      // db.value = noSerialize<Database>(new conn.Database());

      // if (!db.value) return;

      // db.value.run(`
      //   CREATE TABLE IF NOT EXISTS todos (
      //     id SERIAL PRIMARY KEY,
      //     name TEXT NOT NULL,
      //     completed BOOLEAN NOT NULL
      //   );
      // `);
      // db.value.run(`
      //   INSERT INTO todos (name, completed)
      //   VALUES ('Hello', false);
      // `);
      // db.value.run(`
      //   INSERT INTO todos (name, completed)
      //   VALUES ('Hello', false);
      // `);
    },
    { strategy: "document-ready" }
  );

  useContextProvider(dbContext, db);

  return (
    <div>
      <View />
      <Add />
      hllo
      {}
    </div>
  );
});

const View = component$(() => {
  const db = useDb();

  useVisibleTask$(({ track }) => {
    track(() => db.value);
    console.log("db", db.value);
  });
  return (
    <div>view: {JSON.stringify(db.value?.exec("SELECT * FROM todos"))}</div>
  );
  // return <div></div>;
});

const Add = component$(() => {
  return <div>Add</div>;
});

export default Sql;
