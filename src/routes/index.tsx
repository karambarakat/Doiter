import type { DocumentHead } from "@builder.io/qwik-city";

import { component$ } from "@builder.io/qwik";
import Container from "~/components/Container";
import { useQueryClient } from "~/api/db";
import Todos from "~/components/Todos";
import AddTodo from "~/components/AddTodo";
import { DBProvider } from "~/components/AppLoading";
// import { DBProvider } from "~/api/initDB";

export default component$(() => {
  useQueryClient();
  // useInitDB();

  return (
    <div>
      <Container>
        {/* <div q:slot="paper"> */}
        <DBProvider q:slot="paper">
          <AddTodo />
          <Todos />
        </DBProvider>
        {/* </div> */}
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
