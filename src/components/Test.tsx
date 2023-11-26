import type { Signal } from "@builder.io/qwik";
import { component$, useSignal, useVisibleTask$ } from "@builder.io/qwik";

const useAnimateHeight = (signal: Signal<any>) => {
  const ref = useSignal<HTMLElement>();

  const height = useSignal(0);

  useVisibleTask$(() => {
    height.value = ref.value?.scrollHeight || 0;
  });

  useVisibleTask$(({ track }) => {
    track(() => signal.value);

    function end() {
      ref.value?.style.removeProperty("height");
      ref.value?.style.removeProperty("transition");
      height.value = ref.value?.scrollHeight || 0;
    }

    function cancel() {
      ref.value?.style.removeProperty("transition");
      ref.value?.style.setProperty("height", `${height.value}px`);
      requestAnimationFrame(() => {
        ref.value?.style.removeProperty("height");
        height.value = ref.value?.scrollHeight || 0;
      });
    }

    const newHeight = ref.value?.scrollHeight || 0;
    if (newHeight === height.value) return;

    ref.value?.style.setProperty("height", `${height.value}px`);
    ref.value?.style.setProperty("transition", `height 0.5s ease-in-out`);
    requestAnimationFrame(() => {
      ref.value?.style.setProperty("height", newHeight + "px");
    });
    ref.value?.addEventListener("transitionend", end);
    ref.value?.addEventListener("transitioncancel", cancel);
  });

  return ref;
};

const Test = component$(() => {
  const open = useSignal(false);
  const ref = useAnimateHeight(open);

  return (
    <div
      ref={ref}
      class="duration-500"
      onClick$={() => {
        open.value = !open.value;
      }}
    >
      {Array.from({ length: open.value ? 4 : 14 }).map((_, i) => {
        return (
          <div class="" key={i}>
            lorem
          </div>
        );
      })}
    </div>
  );
});
export default Test;
