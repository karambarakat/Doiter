import { component$, useVisibleTask$ } from "@builder.io/qwik";
import Todo from "./Todo";
import { useGetAllTodos } from "~/api/db";

const info = `:uno: 
  text-gray-400 min-h-150px
  text-center grid place-content-center`;

const Todos = component$(() => {
  const vals = useGetAllTodos();

  if (vals.status.value === "pending") {
    return (
      <div aria-role="presentation" class={info}>
        Loading ...
      </div>
    );
  }

  useVisibleTask$(() => {
    console.log("todos", vals.data.value);
  });

  return (
    <div class="flex flex-col gap-3 my-3">
      {vals.data.value.length === 0 && (
        <div aria-role="presentation" class={info}>
          No Todos, Add Some
        </div>
      )}
      {vals.data.value.map((e) => {
        return <Todo key={e.id} data={e} />;
      })}
    </div>
  );
});

export default Todos;
