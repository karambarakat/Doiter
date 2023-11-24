import type { DocumentHead } from "@builder.io/qwik-city";

import { component$ } from "@builder.io/qwik";
import Container from "~/components/Container";
import { useQueryClient } from "~/api/db";
import Todos from "~/components/Todos";
import AddTodo from "~/components/AddTodo";
import { useWorker } from "~/api/initWorker";
import { useMakeDb, useWorkerDB } from "~/api/initDB";

export default component$(() => {
  useMakeDb();
  useQueryClient();
  useWorker();
  useWorkerDB();
  // const output = useWorker();

  return (
    <div>
      <Container>
        <div q:slot="paper">
          <AddTodo />
          <Todos />
        </div>
      </Container>
    </div>
  );
});

export const head: DocumentHead = {
  title: "Welcome to Doiter",
  meta: [
    {
      name: "description",
      content: "Doiter Simple Todo App",
    },
  ],
};
