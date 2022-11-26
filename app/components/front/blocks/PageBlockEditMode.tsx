import { useSearchParams } from "@remix-run/react";
import { useState } from "react";
import { PageBlockDto } from "~/application/dtos/marketing/PageBlockDto";
import ButtonSecondary from "~/components/ui/buttons/ButtonSecondary";
import Modal from "~/components/ui/modals/Modal";
import OpenErrorModal from "~/components/ui/modals/OpenErrorModal";
import OpenSuccessModal from "~/components/ui/modals/OpenSuccessModal";
import PageBlockUtils from "~/utils/pages/PageBlockUtils";
import TemplateEditor from "./TemplateEditor";

type MessageDto = {
  success?: { title: string; message: string };
  error?: { title: string; message: string };
};
export default function PageBlockEditMode({ items, onSetBlocks }: { items: PageBlockDto[]; onSetBlocks: (items: PageBlockDto[]) => void }) {
  const [searchParams, setSearchParams] = useSearchParams();
  const [settingTemplate, setSettingTemplate] = useState(false);
  const [message, setMessage] = useState<MessageDto>();

  function isEditMode() {
    return searchParams.get("editMode") !== "false";
  }
  function toggleEditMode() {
    if (searchParams.get("editMode") === "false") {
      setSearchParams({ editMode: "true" });
    } else {
      setSearchParams({ editMode: "false" });
    }
  }

  function onDownload() {
    if (items.length === 0) {
      setMessage({ error: { title: "Error", message: "No blocks to download" } });
      return;
    }

    const jsonBlocks = PageBlockUtils.downloadBlocks(items);
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(jsonBlocks);
    const downloadAnchorNode = document.createElement("a");
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", `blocks.json`);
    document.body.appendChild(downloadAnchorNode); // required for firefox
    downloadAnchorNode.click();
    downloadAnchorNode.remove();

    setMessage({
      success: {
        title: "Blocks Downloaded",
        message: "Paste the blocks at app/utils/services/pages/defaultLandingPage.ts 'const blocks: PageBlockDto[] = [...'",
      },
    });
  }

  function onSetTemplate() {
    setSettingTemplate(true);
  }

  function onSelectedBlocks(items: PageBlockDto[]) {
    setSettingTemplate(false);
    onSetBlocks(items);
  }

  return (
    <div>
      {isEditMode() && (
        <div className="bg-gray-900 p-2 text-gray-50 dark:bg-gray-50 dark:text-gray-900">
          <div className="flex justify-center space-x-3">
            <a
              href="https://github.com/AlexandroMtzG/remix-page-blocks"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center space-x-2 rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-accent-700 shadow-sm hover:border-accent-300 hover:text-accent-900 focus:border-accent-300 focus:outline-none focus:ring-2 focus:ring-accent-500"
            >
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                <path
                  fillRule="evenodd"
                  d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                  clipRule="evenodd"
                />
              </svg>
            </a>
            <ButtonSecondary onClick={toggleEditMode}>
              <div>
                <span className="hidden sm:block">Exit Edit Mode</span>
                <span className="sm:hidden">Exit</span>
              </div>
            </ButtonSecondary>
            <ButtonSecondary onClick={onDownload}>
              <div>
                <span className="hidden sm:block">Download Blocks</span>
                <span className="sm:hidden">Download</span>
              </div>
            </ButtonSecondary>
            <ButtonSecondary onClick={onSetTemplate}>
              <div>
                <span className="hidden sm:block">Set Template</span>
                <span className="sm:hidden">Template</span>
              </div>
            </ButtonSecondary>
          </div>
        </div>
      )}

      <OpenSuccessModal
        title={message?.success?.title}
        description={message?.success?.message}
        open={!!message?.success}
        onClose={() => setMessage(undefined)}
      />

      <OpenErrorModal title={message?.error?.title} description={message?.error?.message} open={!!message?.error} onClose={() => setMessage(undefined)} />

      <Modal open={settingTemplate} setOpen={setSettingTemplate}>
        <div>
          <TemplateEditor items={items} onSelected={onSelectedBlocks} />
        </div>
      </Modal>
    </div>
  );
}
