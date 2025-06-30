onmessage = async (event) => {
  let dataUrl = event.data[0];
  let response = await fetch(dataUrl);
  let responseType = event.data[1];

  if (!response.ok) {
    console.log('fetcher-error')
    postMessage([{ error: "Resource Not Found" }, responseType, event.data[2]]);
    return;
  }

  let processedResponse;
  try {
    switch (responseType) {
      case "json":
        processedResponse = await response.json();
        break;
      case "text":
        processedResponse = await response.text();
        break;
    }

    postMessage([processedResponse, responseType, event.data[2]]);
  } catch (error) {
    console.log('fetcher-error')
    postMessage([{ error: "Resource Not Found" }, responseType, event.data[2]]);
  }
};
