import {
  NoSerialize,
  Signal,
  createContextId,
  noSerialize,
  useContext,
  useContextProvider,
  useSignal,
  useVisibleTask$,
} from "@builder.io/qwik";
import sql from "@sqlite.org/sqlite-wasm";
import { Database } from "@sqlite.org/sqlite-wasm";

const dbContext = createContextId<Signal<NoSerialize<Database>>>("db");
export const useDb = () => useContext(dbContext);

export function useMakeDb() {
  const share = useSignal<NoSerialize<Database>>();

  useVisibleTask$(
    async () => {
      const conn1 = await sql();

      const db = new conn1.oo1.JsStorageDb("local");

      db.exec({
        sql: `
        CREATE TABLE IF NOT EXISTS todos (
          id INTEGER PRIMARY KEY,
          name TEXT NOT NULL,
          completed BOOLEAN NOT NULL,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
          );
        `,
      });

      share.value = noSerialize<Database>(db);
    },
    { strategy: "document-ready" }
  );

  useContextProvider(dbContext, share);
}

export function useWorkerDB() {
  const share = useSignal<NoSerialize<Database>>();

  useVisibleTask$(
    async () => {
      const conn1 = await sql();

      const db = new conn1.oo1.OpfsDb("file", "w");

      db.exec({
        sql: `
        CREATE TABLE IF NOT EXISTS todos (
          id INTEGER PRIMARY KEY,
          name TEXT NOT NULL,
          completed BOOLEAN NOT NULL,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
          );
        `,
      });

      share.value = noSerialize<Database>(db);
    },
    { strategy: "document-ready" }
  );

  useContextProvider(dbContext, share);
}
