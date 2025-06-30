import { getThemePreference } from "../../SettingsManagers/theme-settings-manager.js";
import { arrayShuffle, getRandomInteger } from "../../AuxiliaryScripts/utils.js";

class TspVisualization extends HTMLElement {
  constructor(aspectRatio = 1) {
    super();
    this.aspectRatio = aspectRatio;
    this.townsCoordinates = [];
    this.totalDistance = 0;
  }

  connectedCallback() {
    this.innerHTML = `<canvas class="tsp_canvas" style="width:100%; border: solid 0px black"></canvas>`;
    this.canvas = this.querySelector(".tsp_canvas");
    this.canvas.style.height = this.canvas.width * this.aspectRatio;
    this.canvas.width = this.canvas.width * 2.5;
    this.canvas.height = this.canvas.height * 2.5;
    this.ctx = this.canvas.getContext("2d");
  }

  connectTwoPoints(point1, point2) {
    this.ctx.moveTo(point1.x, point1.y);
    this.ctx.lineTo(point2.x, point2.y);
    if (getThemePreference() === "dark") {
      this.ctx.strokeStyle = "white";
    } else {
      this.ctx.strokeStyle = "black";
    }
    this.ctx.stroke();
  }

  clearCanvas() {
    this.totalDistance = 0;
    this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
  }

  clearPath() {
    this.clearCanvas();
    this.generateNewTspCanvas(undefined, true);
  }

  drawPath(pointArray) {
    this.clearPath();
    for (let index = 0; index < pointArray.length; index++) {
      try {
        this.connectTwoPoints(
          this.townsCoordinates[pointArray[index]],
          this.townsCoordinates[pointArray[index + 1]]
        );

        this.totalDistance += this.pointsDistance(
          this.townsCoordinates[pointArray[index]],
          this.townsCoordinates[pointArray[index + 1]]
        );
        index += 1;
        this.connectTwoPoints(
          this.townsCoordinates[pointArray[index + 1]],
          this.townsCoordinates[pointArray[index]]
        );
        this.totalDistance += this.pointsDistance(
          this.townsCoordinates[pointArray[index + 1]],
          this.townsCoordinates[pointArray[index]]
        );
      } catch (error) {
        this.connectTwoPoints(
          this.townsCoordinates[pointArray[index]],
          this.townsCoordinates[pointArray[0]]
        );
        this.totalDistance += this.pointsDistance(
          this.townsCoordinates[pointArray[index]],
          this.townsCoordinates[pointArray[0]]
        );
      }
    }
  }

  pointsDistance(point1, point2) {
    let firstPart = Math.pow(point2.x - point1.x, 2);
    let secondPart = Math.pow(point2.y - point1.y, 2);
    return Math.sqrt(firstPart + secondPart);
  }

  generateRandomPath(pathLength) {
    pathLength = parseInt(pathLength)
    let path = new Array(pathLength);
    for (let index = 0; index < path.length; index++) {
      path[index] = index;
    }
    return arrayShuffle(path);
  }

  drawCircle(x, y) {
    if (getThemePreference() === "dark") {
      this.ctx.strokeStyle = "white";
    } else {
      this.ctx.strokeStyle = "black";
    }
    this.ctx.beginPath();
    this.ctx.arc(x, y, 4, 0, 2 * Math.PI, false);
    this.ctx.fillStyle = "blue";
    this.ctx.fill();
    this.ctx.stroke();
    this.ctx.closePath();
  }

  drawText(text, x, y) {
    if (getThemePreference() === "dark") {
      this.ctx.fillStyle = "black";
      this.ctx.strokeStyle = "white";
    } else {
      this.ctx.fillStyle = "white";
      this.ctx.strokeStyle = "black";
    }
    this.ctx.font = "12px Arial";
    this.ctx.fillText(text, x - 5, y - 10);
    this.ctx.strokeText(text, x - 5, y - 10);
    this.ctx.fill();
    this.ctx.stroke();
    this.ctx.closePath();
  }

  generateNewTspCanvas(numberOfTowns, override = false) {
    this.clearCanvas();
    if (!override) {
      this.townsCoordinates = [];
    } else {
      numberOfTowns = this.townsCoordinates.length;
    }
    let x;
    let y;

    for (let index = 0; index < numberOfTowns; index++) {
      this.ctx.beginPath();
      if (!override) {
        x = getRandomInteger(20, this.canvas.width - 20);
        y = getRandomInteger(20, this.canvas.height - 20);
        this.townsCoordinates.push({ x: x, y: y });
      } else {
        x = this.townsCoordinates[index].x;
        y = this.townsCoordinates[index].y;
      }
      this.drawText(index, x - 5, y - 5);
      this.drawCircle(x, y);
    }
  }
}

customElements.define("tsp-visualization", TspVisualization);

export { TspVisualization };
