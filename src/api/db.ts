import {
  $,
  createContextId,
  useContext,
  useContextProvider,
  useSignal,
  useStore,
  useTask$,
} from "@builder.io/qwik";
import { useDb } from "./initDB";

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

    client.getAllTodos = client.getAllTodos + (1 % 1000);
  });
};

export const useUpdateTodo = () => {
  const db = useDb();
  const client = useContext(clientX);

  return $((data: ITodo) => {
    if (!db.value) return;

    db.value.exec({
      sql: `UPDATE todos SET name = ?, completed = ? WHERE id = ?;`,
      bind: [data.name, data.completed, data.id] as any,
    });

    client.getAllTodos = (client.getAllTodos + 1) % 1000;
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

    const res = db.value.exec({
      sql: `SELECT * FROM todos ORDER BY created_at DESC;`,
      rowMode: "array",
    }) as unknown as any[];

    status.value = "success";

    const cols = ["id", "name", "completed", "created_at"];
    const parsed = res.map((row) => {
      const obj: any = {};
      cols.forEach((col, i) => {
        obj[col] = row[i];
      });
      return obj;
    });

    data.value = parsed as any;
  });

  return { status, data };
};
