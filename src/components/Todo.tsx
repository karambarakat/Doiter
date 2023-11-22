import {
  component$,
  useId,
  useSignal,
  useVisibleTask$,
} from "@builder.io/qwik";
import { BsTrash, BsPencil } from "@qwikest/icons/bootstrap";
import { useDeleteTodo, type ITodo, useUpdateTodo } from "~/api/db";

const Todo = component$(({ data }: { data: ITodo }) => {
  const hover = useSignal(false);
  const isEditing = useSignal(false);

  const del = useDeleteTodo();
  const update = useUpdateTodo();

  const ref = useSignal<HTMLInputElement>();

  const id = useId();

  useVisibleTask$(({ track }) => {
    track(() => isEditing.value);

    if (isEditing.value === true) {
      ref.value?.setSelectionRange(data.name.length, data.name.length);
      ref.value?.focus();
    }
  });

  return (
    <div
      class="hover:bg-slate-50 p-3"
      onFocus$={() => {
        hover.value = true;
      }}
      role="button"
      aria-labelledby={id + "name"}
      onKeyDown$={(e) => {
        if (e.key === "Enter") {
          update({ ...data, completed: !data.completed });
        }
      }}
      tabIndex={0}
    >
      <form
        tabIndex={-1}
        preventdefault:submit
        onSubmit$={(e, target) => {
          const input = new FormData(target).get("name");
          if (!input) throw new Error("no input of name");

          update({ ...data, name: input as string });
          isEditing.value = false;
        }}
        class="flex gap-3"
        style={!isEditing.value ? { display: "none" } : {}}
      >
        <input
          name="name"
          ref={ref}
          tabIndex={0}
          class="bg-transparent w-full"
          value={data.name}
        />
        <button class="text-blue">update</button>
      </form>

      <div
        onMouseOut$={() => (hover.value = false)}
        onMouseOver$={() => (hover.value = true)}
        onClick$={() => {
          update({ ...data, completed: !data.completed });
        }}
        class={["select-none cursor-pointer ", "flex items-center gap-2"]}
        style={isEditing.value ? { display: "none" } : {}}
        key={data.id}
      >
        <input
          tabIndex={-1}
          role="presentation"
          value={String(data.completed)}
          type="checkbox"
          style={{ cursor: "inherit" }}
          checked={data.completed}
          onClick$={() => {}}
          preventdefault:click
        />

        <span
          id={id + "name"}
          class={["truncate", data.completed && "line-through text-slate-400"]}
        >
          <span class="sr-only">Todo: </span>
          {data.name}
          <span class="sr-only">
            , {data.completed ? "completed" : "not completed"}, click to
            check/uncheck
          </span>
        </span>

        {hover.value && !isEditing.value && (
          <div
            class="flex gap-3 mx-3 self-stretch my--3 py-3"
            onClick$={(event) => {
              event.stopPropagation();
            }}
          >
            <div
              onKeyDown$={(e) => {
                if (e.key === "Enter") {
                  isEditing.value = true;
                }
              }}
              tabIndex={0}
              aria-label="edit the todo"
            >
              <BsPencil
                onClick$={() => {
                  isEditing.value = true;
                }}
                color="blue"
                class="hover:bg-slate-300 p-5px w-24px rounded h-24px"
              />
            </div>
            <div
              onKeyDown$={(e) => {
                if (e.key === "Enter") {
                  del(data.id);
                }
              }}
              tabIndex={0}
              aria-label="delete the todo"
            >
              <BsTrash
                onClick$={() => {
                  del(data.id);
                }}
                color="red"
                class="hover:bg-slate-300 p-5px w-24px rounded h-24px"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
});

export default Todo;
