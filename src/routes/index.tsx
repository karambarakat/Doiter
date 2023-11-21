import type { DocumentHead } from "@builder.io/qwik-city";

import { $, component$, useStore } from "@builder.io/qwik";
import Container from "~/components/Container";
import Input from "~/components/Input";
import Todo from "~/components/Todo";
import { createTodo, getAllTodos } from "~/api/db";
import Sql from "~/components/Sql";

export default component$(() => {
  const vals = useStore({ list: getAllTodos() });

  return (
    <div>
      <Container>
        <Sql />
        <div q:slot="paper">
          <div>
            <form
              onSubmit$={(e, target) => {
                const data = Object.fromEntries(
                  new FormData(target).entries()
                ) as { name: string };

                createTodo({
                  ...data,
                  completed: false,
                });

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
            {vals.list.length === 0 && (
              <div class="text-center select-none text-gray-400 min-h-150px grid place-content-center">
                No Todos, Add Some
              </div>
            )}
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
