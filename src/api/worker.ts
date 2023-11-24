// @ts-check
import type { ExecOptions } from "@sqlite.org/sqlite-wasm";

type ExecArgument = string | ExecOptions;

export type Messages =
  | {
      type: "TRANSFER_PORT";
    }
  | {
      type: "LOAD";
    }
  | {
      type: "EXEC";
      exec: ExecArgument;
    };

export type { ExecArgument };

function bidirectional(input: Messages) {
  if (input.type === "EXEC") {
    return "**response " + input.exec;
  }
}

export type BidirectionalFunction = (input: ExecArgument) => Promise<string>;

postMessage({ type: "LOAD" } as Messages);
addEventListener("message", async (e) => {
  const receiving = e.data as Messages;

  if (receiving.type !== "TRANSFER_PORT") {
    return;
  }

  // setting up bidirectional communication

  e.ports[0].onmessage = function (event: MessageEvent) {
    const data = event.data;
    const response = bidirectional(data);
    e.ports[0].postMessage(response);
  };
});
