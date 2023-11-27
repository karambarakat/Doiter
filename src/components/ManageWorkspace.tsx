import {
  $,
  component$,
  useComputed$,
  useSignal,
  useStylesScoped$,
} from "@builder.io/qwik";
import { IoCloudOffline } from "@qwikest/icons/ionicons";
import { FaSpinnerSolid, FaXSolid } from "@qwikest/icons/font-awesome";

// import "@qwikest/icons/font-awesome";
// import {} from "@qwikest/icons/";
import Modal from "./Modal";
import { useDB } from "~/api/initDB";
import { saveAs } from "file-saver";

const ManageWorkspace = component$(() => {
  const open = useSignal(false);

  const db = useDB();

  const cantImportOrExport = useComputed$(() => {
    return db.value.conn === "local" || db.value.conn === "loading";
  });

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

  const exportData = $(async () => {
    if (cantImportOrExport.value) return;

    const fileHandle = await window.navigator.storage.getDirectory();
    const file = await fileHandle.getFileHandle("main.db");
    const data = await file.getFile();
    const buffer = await data.arrayBuffer();
    const blob = new Blob([buffer], {
      type: "application/octet-stream",
    });

    saveAs(blob, "data.db");
  });

  const importData = $(async (event: any) => {
    if (cantImportOrExport.value) return;
    const submitted = event.target?.files?.[0];

    if (!submitted) {
      alert("No file selected");
      return;
    }

    const pfs_handle = await window.navigator.storage.getDirectory();

    const pfs_saveAs = await pfs_handle.getFileHandle("main.db", {
      create: true,
    });
    const pfs_write = await pfs_saveAs.createWritable();
    const blob = new Blob([submitted], {
      type: "application/text",
    });

    await pfs_write.write(blob);

    await pfs_write.close();

    alert("saved");
    window.location.reload();
  });

  const deleteData = $(async () => {
    if (cantImportOrExport.value) return;

    const pfs_handle = await window.navigator.storage.getDirectory();
    await pfs_handle.removeEntry("main.db");
    alert("deleted");
    window.location.reload();
    // const pfs_delete = await pfs_file.();
  });

  return (
    <div
      onClick$={() => {
        open.value = true;
      }}
      class={["button flex items-center gap-2 "]}
    >
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
          <div class="flex items-center px-4 pb-4">
            <p class="text-5 flex-1">Workspace Setting</p>
            <div
              aria-label="close the workspace setting"
              class="cursor-pointer"
              onClick$={() => {
                open.value = false;
              }}
            >
              <FaXSolid />
            </div>
          </div>
          <div class={divider} />
          <div class={[sec, disabled]}>
            <p class="text-red opacity-100">
              this feature is not available right now
            </p>
            <h2 class="font-600">Sync the workspace</h2>
            <p class={dim}>
              Sync the workspace with the cloud. This will make the workspace
              available on all your devices.
            </p>
          </div>
          <div
            class={[sec, cantImportOrExport.value && disabled]}
            onClick$={exportData}
          >
            {cantImportOrExport.value && (
              <p class={"text-red"}>there seems to be an error</p>
            )}
            <h2 class="font-600">Export the data</h2>
            <p class={dim}>
              Export the data in the workspace to a file. This will create a
              file that can be imported into another workspace.
            </p>
          </div>
          <label
            // class={sec}
            class={[sec, cantImportOrExport.value && disabled]}
          >
            {cantImportOrExport.value && (
              <p class={"text-red"}>there seems to be an error</p>
            )}

            <h2 class="font-600">Import a workspace</h2>
            <p class={dim}>
              Import the data from a file into the workspace. This will
              overwrite any data in the workspace.
            </p>
            <input
              class="bg-red hidden"
              type="file"
              id="fileInput"
              accept=".db"
              onChange$={importData}
            />
          </label>
          <div class={[sec]} onClick$={deleteData}>
            <p class={"text-red"}>
              this action is irreversible, please save your data locally first
            </p>

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

// const FileUpload = component$(() => {
//     return <label>
//         <input class type="file" />

//     </label>
// })

const divider = `:uno: min-h-1px bg-black`;
const sec = ":uno: hover:bg-slate-200 cursor-pointer select-none p-4";
const dim = ":uno: text-4 font-400 text-slate-700";
const disabled = ":uno: hover:(cursor-initial bg-slate-50) children:opacity-50";

export default ManageWorkspace;
