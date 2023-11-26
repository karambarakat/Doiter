import type { Signal } from "@builder.io/qwik";
import { Slot, component$, useSignal, useVisibleTask$ } from "@builder.io/qwik";

function setStyles(
  target: Signal<HTMLElement | undefined>,
  styles: Record<string, string>
) {
  Object.entries(styles).map((entry) => {
    target.value?.style.setProperty(entry[0], entry[1]);
  });
}

const useAnimation = ({
  state,
  ref,
  inverse,
  start,
  active,
  done,
}: {
  state: Signal<boolean>;
  inverse?: boolean;
  ref: Signal<HTMLElement | undefined>;
  start?: Record<string, string>;
  active?: Record<string, string>;
  done?: Record<string, string>;
}) => {
  useVisibleTask$(({ track, cleanup }) => {
    function doneFn() {
      done && setStyles(ref, done);
    }

    track(() => state.value);
    if (!ref.value) return;

    if (state.value !== inverse && (start || active)) {
      start && setStyles(ref, start);
      const raf = requestAnimationFrame(() => {
        active && setStyles(ref, active);
      });
      cleanup(() => cancelAnimationFrame(raf));

      ref.value.addEventListener("transitionend", doneFn);
      cleanup(() => ref.value?.removeEventListener("transitionend", doneFn));
    }
  });

  return { ref };
};

const Modal = component$(({ signal }: { signal: Signal<boolean> }) => {
  const ref = useSignal<HTMLElement>();
  useVisibleTask$(({ track }) => {
    track(() => ref.value);
    if (!ref.value) return;
    // ref.value.style.removeProperty("display");
    document.body.appendChild(ref.value);
  });

  const content = useSignal<HTMLElement>();

  useAnimation({
    ref: content,
    state: signal,
    start: { opacity: "0", transform: "translateY(-5px)" },
    active: { opacity: "1", transform: "translateY(0px)" },
  });

  const bg = useSignal<HTMLElement>();

  useAnimation({
    ref: bg,
    state: signal,
    start: { opacity: "0", display: "block" },
    active: { opacity: "1" },
  });

  return (
    <div
      style={{ display: signal.value ? "block" : "none" }}
      class="absolute inset-0 z-1"
      ref={ref}
    >
      <div
        onClick$={() => {
          signal.value = false;
        }}
        ref={bg}
        class="absolute inset-0 bg-black/40 opacity-0 transition duration-400ms"
      ></div>
      <div class="grid place-content-center pt-50px">
        <div
          ref={content}
          class={["z-2 transition duration-400ms opacity-0 translate-y--5px"]}
        >
          <Slot />
        </div>
      </div>
    </div>
  );
});

export default Modal;
