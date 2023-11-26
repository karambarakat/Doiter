import { component$, useSignal, useStylesScoped$ } from "@builder.io/qwik";
import { IoCloudOffline } from "@qwikest/icons/ionicons";
import { FaSpinnerSolid } from "@qwikest/icons/font-awesome";
// import "@qwikest/icons/font-awesome";
// import {} from "@qwikest/icons/";
import Modal from "./Modal";
import { useDB } from "~/api/initDB";
import { saveAs } from "file-saver";

const ManageWorkspace = component$(() => {
  const open = useSignal(true);

  const db = useDB();

  useStylesScoped$(`
  .animate-spin {
      animation: spin 2s linear infinite;
    }
    @keyframes spin {
        from {
            transform: rotate(0deg);
          }
          to {
              transform: rotate(360deg);
          }
      }

  `);

  return (
    <div
      onClick$={() => {
        open.value = true;
      }}
      class={["button flex items-center gap-2 "]}
    >
      {/* <IoCloudOffline />{" "} */}
      {db.value.conn === "loading" ? (
        <>
          <FaSpinnerSolid class="animate-spin" />
          <span>Loading</span>
        </>
      ) : (
        (db.value.conn === "local" || db.value.conn === "opfs") && (
          <>
            <IoCloudOffline />
            <span>Local</span>
          </>
        )
      )}
      <Modal signal={open}>
        <div class="bg-white w-500px rounded-lg shadow-lg flex flex-col py-5">
          <p class="text-5 px-4 pb-4">Workspace Setting</p>
          <div class={divider} />
          <div class={[sec, "hover:(cursor-initial bg-slate-50) opacity-50"]}>
            <h2 class="font-600">Sync the workspace</h2>
            <p class={dim}>
              Sync the workspace with the cloud. This will make the workspace
              available on all your devices.
            </p>
          </div>
          <div
            class={sec}
            onClick$={async () => {
              const fileHandle = await window.navigator.storage.getDirectory();
              const file = await fileHandle.getFileHandle("main.db");
              const data = await file.getFile();
              const buffer = await data.arrayBuffer();
              const blob = new Blob([buffer], {
                type: "application/octet-stream",
              });

              saveAs(blob, "data.db");
            }}
          >
            <h2 class="font-600">Export the data</h2>
            <p class={dim}>
              Export the data in the workspace to a file. This will create a
              file that can be imported into another workspace.
            </p>
          </div>
          <div
            class={sec}
            onClick$={async () => {
              const input = document.getElementById(
                "fileInput"
              ) as HTMLInputElement;
              const inputFile = input.files?.[0];
              if (!inputFile) {
                alert("No file selected");
                return;
              }
              //   file.arrayBuffer
              const fileHandle = await window.navigator.storage.getDirectory();

              const file = await fileHandle.getFileHandle("main2.db");
              const writable = await file.createWritable();
              const blob = new Blob([inputFile], {
                type: "application/octet-stream",
              });
              await writable.write(blob);
            }}
          >
            <h2 class="font-600">Import the data</h2>
            <p class={dim}>
              Import the data from a file into the workspace. This will
              overwrite any data in the workspace.
            </p>
            <input type="file" id="fileInput" accept=".db" />
          </div>
          <div class={sec}>
            <h2 class="font-600">Delete the workspace</h2>
            <p class={dim}>
              Delete the workspace from the cloud. This will delete the
              workspace from all your devices.
            </p>
          </div>
        </div>
      </Modal>
    </div>
  );
});

const divider = `min-h-1px bg-black`;
const sec = "hover:bg-slate-200 cursor-pointer select-none p-4";
const dim = "text-4 font-400 text-slate-700";

export default ManageWorkspace;
