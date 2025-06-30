import { fetchJson, returnPlainJson } from "../Fetcher/fetcher.js";
import { createToast } from "../ToastManager/toast-manager.js";
import { closeView, updatePdfView } from "../AuxiliaryScripts/view-manager.js";

const pdfFilesRoot = "/ContentFiles/PdfContentFiles/PdfFiles/";
let pdfFileDefinitions = {};

async function updatePdfFileDefinitions() {
  try {
    pdfFileDefinitions = await returnPlainJson(
      `/ContentFiles/PdfContentFiles/pdf_definitions.json`
    );
    updatePdfView();
  } catch (error) {
    console.log(error);
  }
}

await updatePdfFileDefinitions();

function getSrcFromFileSelector(selector) {
  selector = "_" + selector;
  return `${pdfFilesRoot}${pdfFileDefinitions[selector].fileName}`;
}

function getPdfFileNameFromFileSelector(selector) {
  try {
    selector = "_" + selector;
    return `${pdfFileDefinitions[selector].selectorName}`;
  } catch (error) {
    createToast("error", "This pdf file does not exist", true);
    closeView();
    return;
  }
}

function getLinksFromFileSelector(selector, callback) {
  selector = "_" + selector;
  fetchJson(
    `${pdfFilesRoot}${pdfFileDefinitions[selector].fileName}`.replace(
      ".pdf",
      ".json"
    ),
    callback
  );
}

function getPdfFileList() {
  return pdfFileDefinitions;
}

export {
  updatePdfFileDefinitions,
  getSrcFromFileSelector,
  getLinksFromFileSelector,
  getPdfFileList,
  getPdfFileNameFromFileSelector,
};
