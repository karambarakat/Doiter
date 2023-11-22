export type ITodo = { name: string; completed: boolean; id: number };

const clientX = createContextId<Record<string, any>>("store");
export const useQueryClient = () => {
  const store = useStore<Record<string, number>>({});

  useContextProvider(clientX, store);
};

export const useCreateTodo = () => {
  const db = useDb();
  const client = useContext(clientX);

  return $((data: { name: string; completed: boolean }) => {
    if (!db.value) return;

    const st = db.value.prepare(`
      INSERT INTO todos (name, completed)
      VALUES (?, ?);
    `);

    st.bind([data.name, data.completed] as any);

    st.step();

    st.free();

    client.getAllTodos = client.getAllTodos + (1 % 1000);
  });
};

export const useUpdateTodo = () => {
  const db = useDb();
  const client = useContext(clientX);

  return $((data: ITodo) => {
    if (!db.value) return;

    const st = db.value.prepare(`
      UPDATE todos SET name = ?, completed = ?
      WHERE id = ?;
    `);

    st.bind([data.name, data.completed, data.id] as any);

    st.step();

    st.free();

    client.getAllTodos = client.getAllTodos + (1 % 1000);
  });
};

export const useDeleteTodo = () => {
  const db = useDb();
  const client = useContext(clientX);

  return $((id: number) => {
    if (!db.value) return;

    const st = db.value.prepare(`
      DELETE FROM todos
      WHERE id = ?;
    `);

    st.bind([id] as any);

    st.step();

    st.free();

    client.getAllTodos = client.getAllTodos + (1 % 1000);
  });
};

export const useGetAllTodos = () => {
  const db = useDb();

  const client = useContext(clientX);

  useTask$(() => {
    client.getAllTodos = 0;
  });

  const status = useSignal<"pending" | "success" | "error">("pending");

  const data = useSignal<ITodo[]>([]);

  useTask$(async ({ track }) => {
    track(() => db.value);
    track(() => client.getAllTodos);
    if (!db.value) return;

    const stm = db.value.exec(`SELECT * FROM todos ORDER BY created_at DESC;`);

    status.value = "success";

    if (!stm[0]) {
      data.value = [];
      return;
    }

    data.value = parse<{ id: string; name: string; completed: boolean }>(
      stm[0]
    ) as any;
  });

  return { status, data };
};

import type { NoSerialize, Signal } from "@builder.io/qwik";
import {
  $,
  createContextId,
  noSerialize,
  useContext,
  useContextProvider,
  useSignal,
  useStore,
  useTask$,
  useVisibleTask$,
} from "@builder.io/qwik";
import type { Database } from "sql.js";
import sqlInit from "sql.js";

const dbContext = createContextId<Signal<NoSerialize<Database>>>("db");
export const useDb = () => useContext(dbContext);
export function useMakeDb() {
  const db = useSignal<NoSerialize<Database | undefined>>(undefined);
  useVisibleTask$(
    async () => {
      const wasm = await fetch(
        "https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.8.0/sql-wasm.wasm"
      );
      const wasmBinary = await wasm.arrayBuffer();

      const conn = await sqlInit({
        wasmBinary,
      });

      const value = new conn.Database();

      value.run(`
      CREATE TABLE IF NOT EXISTS todos (
        id INTEGER PRIMARY KEY,
        name TEXT NOT NULL,
        completed BOOLEAN NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
      `);

      value.run(`
        INSERT INTO todos (name, completed)
        VALUES ('INIT DB', false);
        `);
      value.run(`
        INSERT INTO todos (name, completed)
        VALUES ('INIT DB 2', true);
        `);

      db.value = noSerialize<Database>(value);
    },
    { strategy: "document-ready" }
  );

  useContextProvider(dbContext, db);
}

function parse<type = unknown>(stm: { columns: string[]; values: any[][] }) {
  const collumns = stm.columns;
  const res = stm.values.map((row) => {
    const obj: any = {};
    collumns.forEach((col, i) => {
      obj[col] = row[i];
    });
    return obj;
  });
  return res as type[];
}
