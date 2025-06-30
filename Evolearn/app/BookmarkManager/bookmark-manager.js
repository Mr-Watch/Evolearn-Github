import { lss, lsg, lsr } from "../AuxiliaryScripts/utils.js";

function getBookmarkIds(id) {
  let bookmarkData = lsg(id);
  if (bookmarkData === null || bookmarkData.split(",").length === 1) {
    lss(id, JSON.stringify({ currentIdIndex: 0 }));
    return { currentIdIndex: 0 };
  } else {
    return JSON.parse(bookmarkData);
  }
}

function createBookmark(id,pageNumber) {
  let newBookmarksData = getBookmarkIds(id);
  let newBookmarkId = `${id}-${newBookmarksData.currentIdIndex}`;
  let bookmark = {
    bookmarkId: newBookmarkId,
    title: "",
    pageNumber: pageNumber,
    creationDate: new Date().toDateString()
  };
  newBookmarksData.currentIdIndex += 1;
  newBookmarksData[newBookmarkId] = newBookmarkId;
  lss(newBookmarkId, JSON.stringify(bookmark));
  lss(id, JSON.stringify(newBookmarksData));
  return bookmark;
}

function loadBookmarkData(bookmarkId) {
  let bookmarkData = lsg(bookmarkId);
  if (bookmarkData === null) {
    throw Error(`No bookmark was found with id ${bookmarkId}.`);
  }
  return JSON.parse(bookmarkData);
}

function saveBookmarkData(bookmarkId, data) {
  if (/[b]-[0-9]*-[0-9]*(-b|)/g.test(bookmarkId) && data !== undefined) {
    lss(bookmarkId, JSON.stringify(data));
  } else {
    throw Error("The format of bookmarkId is incorrect or no data was provided.");
  }
}

function removeBookmarkData(bookmarkId) {
  if (/[b]-[0-9]*-[0-9]*/g.test(bookmarkId)) {
    lsr(bookmarkId);
    lsr(`${bookmarkId}-b`);
    let tmpBookmarkId = reduceBookmarkId(bookmarkId);
    let newBookmarkIds = getBookmarkIds(tmpBookmarkId);
    delete newBookmarkIds[bookmarkId];
    tmpBookmarkId = reduceBookmarkId(bookmarkId);
    lss(tmpBookmarkId, JSON.stringify(newBookmarkIds));
  } else {
    throw Error("The format of bookmarkId is incorrect.");
  }
}

function reduceBookmarkId(bookmarkId) {
  let tmpBookmarkId = bookmarkId.split("-");
  tmpBookmarkId.pop();
  tmpBookmarkId = tmpBookmarkId.join("-");
  return tmpBookmarkId;
}

export { getBookmarkIds, loadBookmarkData, createBookmark, removeBookmarkData, saveBookmarkData };
