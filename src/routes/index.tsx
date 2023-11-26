import type { DocumentHead } from "@builder.io/qwik-city";

import { component$ } from "@builder.io/qwik";
import Container from "~/components/Container";
import { useQueryClient } from "~/api/db";
import Todos from "~/components/Todos";
import AddTodo from "~/components/AddTodo";
import { useInitDB } from "~/api/initDB";
import { DbIsNotReady } from "~/components/AppLoading";
import ManageWorkspace from "~/components/ManageWorkspace";

export default component$(() => {
  useQueryClient();
  useInitDB();

  return (
    <div>
      <Container>
        <div class="flex" q:slot="before">
          <ManageWorkspace />
        </div>
        <div q:slot="paper">
          <AddTodo />
          <DbIsNotReady>
            <Todos />
          </DbIsNotReady>
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
