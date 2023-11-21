import { Slot, component$ } from "@builder.io/qwik";

const Container = component$(() => {
  return (
    <div class=":uno: relative isolate">
      <div class=":uno:  top-0 w-full max-h-screen h-screen absolute z-1">
        <div class=":uno: h-200px bg-amber-200 " />
      </div>
      <div class=":uno: w-full absolute z-2">
        <div class=":uno: sm:mx-5 children:(w-full mx-auto max-w-640px mt-3) lt-height:(pt-20) height:(flex flex-col items-stretch) min-h-screen">
          <div>
            <Slot name="before" />
          </div>
          <div class=":uno: bg-white isolate p-3 sm:(shadow-xl rounded-lg) min-h-300px h-full flex-1">
            <Slot name="paper" />
          </div>
          <div>
            <Slot name="after" />
          </div>
        </div>
      </div>
    </div>
  );
});

export default Container;
