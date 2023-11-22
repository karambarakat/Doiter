import { Slot, component$ } from "@builder.io/qwik";
import { useMakeDb } from "~/api/db";

const Sql = component$(() => {
  useMakeDb();

  return <Slot />;
});

export default Sql;
