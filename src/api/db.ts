import {
  $,
  createContextId,
  useContext,
  useContextProvider,
  useSignal,
  useStore,
  useTask$,
} from "@builder.io/qwik";
// import { useDB } from "./initDB";
import { useDB } from "./initDB";

export type ITodo = { name: string; completed: boolean; id: number };

const clientX = createContextId<Record<string, any>>("store");
export const useQueryClient = () => {
  const store = useStore<Record<string, number>>({});

  useContextProvider(clientX, store);
};

export const useCreateTodo = () => {
  const db = useDB();

  const client = useContext(clientX);

  return $(async (data: { name: string; completed: boolean }) => {
    if (!db.value.exec) return;

    await db.value.exec({
      sql: `
        INSERT INTO todos (name, completed)
        VALUES (?, ?);
        `,
      bind: [data.name, data.completed] as any,
    });

    client.getAllTodos = client.getAllTodos + (1 % 1000);
  });
};

export const useUpdateTodo = () => {
  const db = useDB();
  const client = useContext(clientX);

  return $(async (data: ITodo) => {
    if (!db.value.exec) return;

    await db.value.exec({
      sql: `UPDATE todos SET name = ?, completed = ? WHERE id = ?;`,
      bind: [data.name, data.completed, data.id] as any,
    });

    client.getAllTodos = (client.getAllTodos + 1) % 1000;
  });
};

export const useDeleteTodo = () => {
  const db = useDB();
  if (!db.value.exec) return;

  const client = useContext(clientX);

  return $(async (id: number) => {
    if (!db.value.exec) return;

    await db.value.exec({
      sql: `
      DELETE FROM todos
      WHERE id = ?;
    `,
      bind: [id] as any,
    });

    client.getAllTodos = client.getAllTodos + (1 % 1000);
  });
};

export const useGetAllTodos = () => {
  const db = useDB();
  if (!db.value.exec) return;

  const client = useContext(clientX);

  useTask$(() => {
    client.getAllTodos = 0;
  });

  const status = useSignal<"pending" | "success" | "error">("pending");

  const data = useSignal<ITodo[]>([]);

  useTask$(async ({ track }) => {
    track(() => db.value);
    track(() => client.getAllTodos);
    if (!db.value.exec) return;

    const res = await db.value.exec({
      sql: `SELECT * FROM todos ORDER BY created_at DESC;`,
    });

    // console.log(res, db.value);

    status.value = "success";

    data.value = res as any;
  });

  return { status, data };
};
