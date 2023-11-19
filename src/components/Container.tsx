import { Slot, component$ } from "@builder.io/qwik";

const Container = component$(() => {
  return (
    <div class=":uno: relative isolate">
      <div class=":uno: bg-amber-200 top-0 w-full max-h-screen h-200px absolute z--1"></div>

      <div class=":uno: w-full isolate">
        <div class=":uno: sm:mx-5 children:(w-full mx-auto max-w-640px mt-3) lt-height:(pt-20) height:(flex flex-col items-stretch) min-h-screen">
          <div>
            <Slot name="before" />
          </div>
          <div class=":uno: bg-white p-3 sm:(shadow-xl rounded-lg) min-h-300px h-full flex-1">
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
