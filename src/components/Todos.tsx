import { component$ } from "@builder.io/qwik";
import Todo from "./Todo";
import { useGetAllTodos } from "~/api/db";

const info = `:uno: 
  text-gray-400 min-h-150px
  text-center grid place-content-center`;

const Todos = component$(() => {
  const todos = useGetAllTodos();

  if (!todos || todos.status.value === "pending") {
    return (
      <div aria-role="presentation" class={info}>
        Loading ...
      </div>
    );
  }

  return (
    <div class="flex flex-col gap-3 my-3">
      {todos.data.value.length === 0 && (
        <div aria-role="presentation" class={info}>
          No Todos, Add Some
        </div>
      )}
      {todos.data.value.map((e) => {
        return <Todo key={e.id} data={e} />;
      })}
    </div>
  );
});

export default Todos;
