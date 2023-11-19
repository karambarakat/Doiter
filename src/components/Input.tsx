import { Slot, component$, useStylesScoped$ } from "@builder.io/qwik";
import { colors } from "@unocss/preset-mini";

const Input = component$(() => {
  useStylesScoped$(
    `:global(input) { 
        &:focus-visible {
          outline: none;
        }
        background: ${colors.slate[50]}
  
      }`
  );

  return (
    <div
      class=":uno:
          flex p-3 gap-3
          bg-slate-50 rounded-md
          focus-within:(outline outline-amber outline-1px )
          "
    >
      <div class=":uno: flex-1 my--3 children:(w-full h-full)">
        <Slot name="input" />
      </div>
      <div class=":uno: right-3 top-0 bottom-0 flex items-center">
        <Slot name="left" />
      </div>
    </div>
  );
});

export default Input;
