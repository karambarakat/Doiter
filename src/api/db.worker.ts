import type { ExecOptions } from "@sqlite.org/sqlite-wasm";
import sql from "@sqlite.org/sqlite-wasm";

export type BidirectionalFunction = (input: ExecArgument) => Promise<object>;
export type ExecArgument = Pick<ExecOptions, "bind" | "sql">;
export type Messages =
  | { type: "OpfsDb_not_found" }
  | { type: "OpfsDb_found" }
  | { type: "TRANSFER_PORT" }
  | { type: "LOAD" }
  | { type: "EXEC"; exec: ExecArgument };

async function main() {
  const con = await sql();

  if (!("OpfsDb" in con.oo1)) {
    postMessage({ type: "OpfsDb_not_found" } as Messages);
    return;
  }
  postMessage({ type: "OpfsDb_found" } as Messages);

  const db = new con.oo1.OpfsDb("/main.db", "c");

  function fn(input: ExecArgument) {
    const result = db.exec({
      rowMode: "object",
      ...input,
    } as any);

    return result as any as object;
  }

  addEventListener("message", async (e) => {
    const receiving = e.data as Messages;

    if (receiving.type !== "TRANSFER_PORT") {
      return;
    }

    // setting up bidirectional communication

    e.ports[0].onmessage = function (event: MessageEvent) {
      const data = event.data as Messages;

      if (data.type === "EXEC") {
        const response = fn(data.exec);
        e.ports[0].postMessage(response);
      }
    };
  });

  postMessage({ type: "OpfsDb_found" } as Messages);
}

main();
