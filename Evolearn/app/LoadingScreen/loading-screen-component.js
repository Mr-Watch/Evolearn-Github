import { stringToStyleSheetNode } from "../AuxiliaryScripts/utils.js";

class LoadingScreen extends HTMLElement {
  constructor(drawOver = false) {
    super();
    this.drawOver = drawOver;
  }

  connectedCallback() {
    this.classList.add("loading-screen");
    this.innerHTML = `
      <div class="spinner-grow"></div>
      <div class="spinner-border"></div>
     `;

     if(this.drawOver){
      this.zIndex = 100000;
     }else{
      this.zIndex = 0;
     }

    this.appendChild(
      stringToStyleSheetNode(`
      .loading-screen {
        position: absolute;
        z-index: ${this.zIndex};
        width: 100%;
        height: 100%;
        background-color: var(--bs-body-bg);
        display: flex;
        justify-content: center;
        align-items: center;
        animation: fade-in 0.5s ease-in;
      }
      
      .fade-out {
        animation: fade-out 0.5s ease-in ;
        animation-fill-mode: forwards;
      }
      
      .loading-screen > div {
        position: absolute;
        z-index: 1;
        width: 5rem;
        height: 5rem;
        background-color: var(--bs-border-color-translucent);
      }
      
      @keyframes fade-in {
        0% {
          opacity: 0;
        }
        100% {
          opacity: 1;
        }
      }
      
      @keyframes fade-out {
        0% {
          opacity: 1;
        }
        100% {
          opacity: 0;
        }
      }`)
    );
  }

  close() {
    this.classList.add("fade-out");
    setTimeout(() => this.remove(), 600);
  }
}

customElements.define("loading-screen-component", LoadingScreen);

function createLoadingScreen(targetElement) {
  let loadingScreen = document.createElement("loading-screen-component");
  targetElement.appendChild(loadingScreen);
}

function removeLoadingScreen(targetElement) {
  targetElement.querySelector("loading-screen-component").close();
}

export { createLoadingScreen, removeLoadingScreen };
