import { component$, useVisibleTask$ } from "@builder.io/qwik";

export default component$(() => {
  useVisibleTask$(async () => {
    // console.log("FileSystem", debug);
    // val.value = debug;
  });
  //   return <div>FS : {val.value}</div>;
  return <div>FS</div>;
});
