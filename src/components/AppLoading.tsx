import { Slot, component$ } from "@builder.io/qwik";
import { useDB, useInitDB } from "~/api/initDB";

export const DBProvider = component$(() => {
  useInitDB();
  const db = useDB();

  return (
    <>
      {!db.value.exec ? (
        <div class="w-full min-h-200px h-full grid place-items-center text-slate-300">
          <span>App Loading</span>
        </div>
      ) : (
        <Slot />
      )}
    </>
  );
});
