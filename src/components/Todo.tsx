import type { QRL } from "@builder.io/qwik";
import { component$, useSignal, useVisibleTask$ } from "@builder.io/qwik";
import { BsTrash, BsPencil } from "@qwikest/icons/bootstrap";

export type TodoType = { name: string; completed: boolean; id: string };

const Todo = component$(
  ({ data, del }: { data: TodoType; del: QRL<(id: string) => void> }) => {
    const hover = useSignal(false);
    const isEditing = useSignal(false);

    const ref = useSignal<HTMLInputElement>();
    useVisibleTask$(({ track }) => {
      track(() => isEditing.value);
      console.log({ ref });

      if (isEditing.value === true) {
        ref.value?.setSelectionRange(data.name.length, data.name.length);
        ref.value?.focus();
      }
    });

    return (
      <div class="hover:bg-slate-50 p-3 ">
        <form
          preventdefault:submit
          onSubmit$={(e, target) => {
            const input = new FormData(target).get("name");
            if (!input) throw new Error("no input of name");

            data.name = input as string;
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
            data.completed = !data.completed;
          }}
          class={["select-none cursor-pointer ", "flex items-center gap-2"]}
          style={
            //{ textDecoration: "stire" }
            isEditing.value ? { display: "none" } : {}
          }
          key={data.id}
        >
          <input
            type="checkbox"
            style={{ cursor: "inherit" }}
            checked={data.completed}
          />

          <span
            class={[
              "truncate",
              data.completed && "line-through text-slate-400",
            ]}
          >
            {data.name}
          </span>

          {hover.value && !isEditing.value && (
            <div
              class="flex gap-3 mx-3 self-stretch my--3 py-3"
              onClick$={(event) => {
                event.stopPropagation();
              }}
            >
              <BsPencil
                onClick$={() => {
                  isEditing.value = true;
                }}
                color="blue"
                class="hover:bg-slate-300 p-5px w-24px rounded h-24px"
              />
              <BsTrash
                onClick$={() => {
                  del(data.id);
                }}
                color="red"
                class="hover:bg-slate-300 p-5px w-24px rounded h-24px"
              />
            </div>
          )}
        </div>
      </div>
    );
  }
);

export default Todo;
