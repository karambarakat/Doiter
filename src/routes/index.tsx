import type { DocumentHead } from "@builder.io/qwik-city";

import { component$ } from "@builder.io/qwik";
import Container from "~/components/Container";
import { useMakeDb, useQueryClient } from "~/api/db";
import Todos from "~/components/Todos";
import AddTodo from "~/components/AddTodo";

export default component$(() => {
  useMakeDb();
  useQueryClient();

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
