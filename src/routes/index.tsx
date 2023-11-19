import type { DocumentHead } from "@builder.io/qwik-city";

import { $, component$, useStore } from "@builder.io/qwik";
import Container from "~/components/Container";
import Input from "~/components/Input";
import Todo from "~/components/Todo";
import type { TodoType } from "~/components/Todo";
import { v4 } from "uuid";

export default component$(() => {
  const vals = useStore<{ list: TodoType[] }>({
    list: [
      {
        id: "1",
        name: "hello worldhello worldhello worldhello worldhello worldhello worldhello worldhello worldhello worldhello worldhello world",
        completed: true,
      },
      { id: "2", name: "hello world", completed: true },
      { id: "3", name: "hello world", completed: false },
      { id: "4", name: "hello world", completed: true },
    ],
  });
  return (
    <div>
      <Container>
        <div q:slot="paper">
          <div>
            <form
              onSubmit$={(e, target) => {
                const data = Object.fromEntries(new FormData(target).entries());
                vals.list.unshift({
                  id: v4(),
                  completed: false,
                  ...data,
                } as any);
                target.reset();
                const elem = target.querySelector(
                  '[name="name"]'
                ) as HTMLInputElement;
                elem.focus();
              }}
              preventdefault:submit
            >
              <Input>
                <input name="name" q:slot="input" placeholder="Add New Todo" />
                <div q:slot="left">
                  <button type="submit">Add</button>
                </div>
              </Input>
            </form>
          </div>
          <div class="flex flex-col gap-3 my-3">
            {vals.list.map((e) => {
              return (
                <Todo
                  key={e.id}
                  data={e}
                  del={$((id: string) => {
                    vals.list = vals.list.filter((e) => e.id !== id);
                  })}
                />
              );
            })}
          </div>
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
