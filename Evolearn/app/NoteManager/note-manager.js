import { fetchJson } from "../Fetcher/fetcher.js";
import { lss, lsg, lsr } from "../AuxiliaryScripts/utils.js";

let pdfFileIds = JSON.parse(lsg("PdfFileIds"));
let exerciseIds = JSON.parse(lsg("ExerciseIds"));

if (pdfFileIds === null) {
  lss("PdfFileIds", JSON.stringify([]));
  pdfFileIds = [];
}

if (exerciseIds === null) {
  lss("ExerciseIds", JSON.stringify([]));
  exerciseIds = [];
}

function updateIds() {
  pdfFileIds = JSON.parse(lsg("PdfFileIds"));
  exerciseIds = JSON.parse(lsg("ExerciseIds"));
}

function getNoteIds(id) {
  let notesData = lsg(id);
  if (notesData === null) {
    lss(id, JSON.stringify({ currentIdIndex: 0 }));
    return { currentIdIndex: 0 };
  } else {
    if (
      pdfFileIds.findIndex(
        (element) => element === id.slice(1).replace("-", "_")
      ) === -1
    ) {
      pdfFileIds.push(id.slice(1).replace("-", "_"));
      lss("PdfFileIds", JSON.stringify(pdfFileIds));
    }
    if (
      exerciseIds.findIndex(
        (element) => element === id.slice(1).replace("-", "_")
      ) === -1
    ) {
      exerciseIds.push(id.slice(1).replace("-", "_"));
      lss("ExerciseIds", JSON.stringify(exerciseIds));
    }
    return JSON.parse(notesData);
  }
}

function createNote(id) {
  let newNotesData = getNoteIds(id);
  let newNoteId = `${id}-${newNotesData.currentIdIndex}`;
  let note = {
    noteId: newNoteId,
    title: "",
    description: "",
    externalNoteId: newNoteId + "-n",
    creationDate: new Date().toDateString(),
    lastModificationDate: new Date().toUTCString(),
  };
  newNotesData.currentIdIndex += 1;
  newNotesData[newNoteId] = newNoteId;
  lss(newNoteId, JSON.stringify(note));
  lss(id, JSON.stringify(newNotesData));
  lss(`${newNoteId}-n`, JSON.stringify(""));
  return note;
}

function loadNoteData(noteId) {
  let noteData = lsg(noteId);
  if (noteData === null) {
    throw Error(`No note was found with id ${noteId}.`);
  }
  return JSON.parse(noteData);
}

function saveNoteData(noteId, data) {
  if (/[teph]-[0-9]*-[0-9]*(-n|)/g.test(noteId) && data !== undefined) {
    lss(noteId, JSON.stringify(data));
  } else {
    throw Error("The format of noteId is incorrect or no data was provided.");
  }
}

function removeNoteData(noteId) {
  if (/[teph]-[0-9]*-[0-9]*/g.test(noteId)) {
    lsr(noteId);
    lsr(`${noteId}-n`);
    let tmpNoteId = reduceNoteId(noteId);
    let newNoteIds = getNoteIds(tmpNoteId);
    delete newNoteIds[noteId];
    tmpNoteId = reduceNoteId(noteId);
    if (Object.values(newNoteIds).length === 1) {
      lsr(tmpNoteId);
      if (tmpNoteId.startsWith("p")) {
        lss("PdfFileIds", JSON.stringify([]));
        pdfFileIds = [];
      } else if (tmpNoteId.startsWith("e")) {
        lss("ExerciseIds", JSON.stringify([]));
        exerciseIds = [];
      }
    } else {
      lss(tmpNoteId, JSON.stringify(newNoteIds));
    }
  } else {
    throw Error("The format of noteId is incorrect.");
  }
}

function reduceNoteId(noteId) {
  let tmpNoteId = noteId.split("-");
  tmpNoteId.pop();
  tmpNoteId = tmpNoteId.join("-");
  return tmpNoteId;
}

function getTeacherNotes(selector, callback) {
  switch (selector.charAt()) {
    case "p":
      fetchJson(
        `/ContentFiles/NoteContentFiles/PdfNotes/pdf_notes_${selector.slice(
          2
        )}.json`,
        callback
      );
      break;
    case "e":
      fetchJson(
        `/ContentFiles/NoteContentFiles/ExerciseNotes/exercise_notes_${selector.slice(
          2
        )}.json`,
        callback
      );
      break;
    default:
      throw Error("Invalid note id");
  }
}

export {
  getNoteIds,
  loadNoteData,
  createNote,
  removeNoteData,
  saveNoteData,
  getTeacherNotes,
  updateIds,
};
