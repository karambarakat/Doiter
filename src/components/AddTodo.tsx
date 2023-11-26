import { component$ } from "@builder.io/qwik";
import { useCreateTodo } from "~/api/db";
import Input from "./Input";

const AddTodo = component$(() => {
  const createTodo = useCreateTodo();

  return (
    <div class="relative">
      {!createTodo && (
        <div class="absolute cursor-progress inset-0 bg-white/50"></div>
      )}
      <form
        onSubmit$={(e, target) => {
          const data = Object.fromEntries(new FormData(target).entries()) as {
            name: string;
          };

          createTodo?.({ ...data, completed: false });

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
  );
});

export default AddTodo;
