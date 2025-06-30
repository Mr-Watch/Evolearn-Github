export function getRandomInteger(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function getRandomReal(min, max) {
  return Math.random() * (max - min) + min;
}

export function getArrayMiddleIndex(array) {
  let middle_index = 0;

  if (array.length % 2 !== 0) {
    middle_index = (array.length - 1) / 2;
  } else {
    middle_index = [array.length / 2];
  }

  return middle_index;
}

export function arrayShuffle(array) {
  let current_index = array.length;
  let random_index = 0;

  while (current_index !== 0) {
    random_index = Math.floor(Math.random() * current_index);
    current_index--;
    [array[current_index], array[random_index]] = [
      array[random_index],
      array[current_index],
    ];
  }

  return array;
}

export function lsg(key) {
  return window.localStorage.getItem(key);
}

export function lss(key, value) {
  window.localStorage.setItem(key, value);
}

export function lsr(key) {
  window.localStorage.removeItem(key);
}

export function arrayEquals(a, b) {
  return (
    Array.isArray(a) &&
    Array.isArray(b) &&
    a.length === b.length &&
    a.every((val, index) => val === b[index])
  );
}

export function stringToNode(nodeString) {
  let doc = new DOMParser().parseFromString(nodeString, "text/html");
  return doc.body.firstChild;
}

export function stringToStyleSheetNode(styleSheetString) {
  let styleSheetNode = document.createElement("style");
  styleSheetNode.innerHTML = styleSheetString;
  return styleSheetNode;
}

export function openWindow(url) {
  window.open(
    url,
    "_black",
    `titlebar=no,
    menubar=no,
    status=no,
    toolbar=no,
    top=0,
    left=0,
    width=${window.screen.availWidth},
    height=${window.screen.availHeight}`
  );
}

export function roundToTwoDecimals(number) {
  return Math.round((number + Number.EPSILON) * 100) / 100;
}

export function roundToNDecimals(number, n) {
  return (
    Math.round((number + Number.EPSILON) * Math.pow(10, n)) / Math.pow(10, n)
  );
}

export function pad(num, size) {
  var s = "000000000" + num;
  return s.substring(s.length - size);
}

export function insertAtIndex(str, substring, index) {
  return str.slice(0, index) + substring + str.slice(index);
}

export function getOccurrence(array, value) {
  return array.filter((v) => v === value).length;
}

export function elementIsVisibleInViewport(el, partiallyVisible = false) {
  const { top, left, bottom, right } = el.getBoundingClientRect();
  const { innerHeight, innerWidth } = window;
  return partiallyVisible
    ? ((top > 0 && top < innerHeight) ||
        (bottom > 0 && bottom < innerHeight)) &&
        ((left > 0 && left < innerWidth) || (right > 0 && right < innerWidth))
    : top >= 0 && left >= 0 && bottom <= innerHeight && right <= innerWidth;
}

export function valueBetween(value, lowerBound, upperBound) {
  if (value >= lowerBound && value <= upperBound) {
    return true;
  }
  return false;
}

export function removeEmptyStringsFromArray(array) {
  let arrayCopy = array;
  if (array.includes("")) {
    array.forEach((item, index) => {
      if (item === "") {
        arrayCopy.splice(index, 1);
      }
    });
  } else {
    return arrayCopy;
  }
  return arrayCopy;
}

export function removeItemOnIndex(array, index) {
  if (index > -1) {
    array.splice(index, 1);
  }
  return array;
}

export function countOccurrence(array, value) {
  let counter = 0;
  if (array === null) {
    return counter;
  }
  for (let index = 0; index < array.length; index++) {
    if (array[index] === value) {
      counter += 1;
    }
  }
  return counter;
}

export function returnIndexOfValue(array, property, value) {
  return array.findIndex((element) => {
    try {
      return element[property] == value;
    } catch (error) {
      return false;
    }
  });
}

export function removeItemOnValue(array, value) {
  return removeItemOnIndex(
    array,
    array.findIndex((element) => element === value)
  );
}

export function cloneCanvas(oldCanvas) {
  let newCanvas = document.createElement("canvas");
  let context = newCanvas.getContext("2d");
  newCanvas.width = oldCanvas.width;
  newCanvas.height = oldCanvas.height;
  context.drawImage(oldCanvas, 0, 0);
  return newCanvas;
}
