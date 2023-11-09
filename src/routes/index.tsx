import type { DocumentHead } from "@builder.io/qwik-city";

import { component$ } from "@builder.io/qwik";
import Container from "~/components/Container";

export default component$(() => {
  return (
    <div>
      <Container>
        <div q:slot="paper">
          <div>
            <input placeholder="enter new todo" />
            <button>Add</button>
          </div>
        </div>
      </Container>
    </div>
  );
});

export const head: DocumentHead = {
  title: "Welcome to Qwik",
  meta: [
    {
      name: "description",
      content: "Qwik site description",
    },
  ],
};
