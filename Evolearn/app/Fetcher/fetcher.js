const fetcherWorker = new Worker("./Fetcher/fetcher-worker.js");
let jsonCallbacks = new Map();
let textCallbacks = new Map();

let jsonRequestIndex = 0;
let textRequestIndex = 0;

fetcherWorker.onmessage = (event) => {
  let responseData = event.data[0];
  let responseType = event.data[1];
  let requestIndex = event.data[2];

  switch (responseType) {
    case "json":
      let jsonCallback = jsonCallbacks.get(requestIndex);
      jsonCallbacks.delete(requestIndex);
      jsonCallback(responseData);
      break;
    case "text":
      let textCallback = textCallbacks.get(requestIndex);
      textCallbacks.delete(requestIndex);
      textCallback(responseData);
      break;
  }
};

function fetchJson(dataUrl, callback) {
  fetcherWorker.postMessage([dataUrl, "json", jsonRequestIndex]);
  jsonCallbacks.set(jsonRequestIndex, callback);
  jsonRequestIndex += 1;
}

function fetchText(dataUrl, callback) {
  fetcherWorker.postMessage([dataUrl, "text", textRequestIndex]);
  textCallbacks.set(textRequestIndex, callback);
  textRequestIndex += 1;
}

async function returnPlainJson(dataUrl) {
  let response = await fetch(dataUrl);

  if (!response.ok) {
    throw Error("Resource not found.");
  }
  response = await response.json();
  return response;
}

async function returnPlainText(dataUrl) {
  let response = await fetch(dataUrl);

  if (!response.ok) {
    throw Error("Resource not found.");
  }
  response = await response.text();
  return response;
}

function terminateFetcher() {
  fetcherWorker.terminate();
}

fetcherWorker.onerror = (error) => {
  throw Error(error);
};

export {
  fetchJson,
  returnPlainJson,
  fetchText,
  returnPlainText,
  terminateFetcher,
};
