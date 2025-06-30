import { stringToNode, openWindow, stringToStyleSheetNode } from "../AuxiliaryScripts/utils.js";

class SpanLinksComponent extends HTMLSpanElement {
  constructor() {
    super();
    this.style.cursor = "pointer";
    this.style.position = "relative";
    this._createDropdown = (e) => this.createDropdown(e);
    this.addEventListener("click", this._createDropdown);
    this.changeView = window.parent.window.changeView
  }

  static closeDropdown() {
    let externalDropDown = document.querySelector(".span_links_dropdown");
    if (externalDropDown !== null) {
      Array.from(
        externalDropDown._this.dropDown.firstElementChild.children
      ).forEach((child) => {
        child.removeEventListener(
          "click",
          externalDropDown._this.actionFunctionMap.get(child.className)
        );
        externalDropDown._this.actionFunctionMap.delete(child.className);
        child.remove();
      });
      externalDropDown._this.dropDown.remove();
      externalDropDown._this.dropDown = null;
      externalDropDown._this.actionFunctionMap = null;
    }
  }

  createDropdown(event) {
    if (document.querySelector(".span_links_dropdown") !== null) {
      return;
    }
    event.stopPropagation();
    this.dropDown = stringToNode(`
    <div class="span_links_dropdown">
        <ul>
        </ul>
     </div>`);

    this.actionFunctionMap = new Map();
    let actionElements = new DocumentFragment();

    Object.entries(this.dataset).forEach((item) => {
      let tmpElement = null;
      switch (
        item[0]
          .split("")
          .toSpliced(item[0].length - 1)
          .join("")
      ) {
        case "wikipedia":
          tmpElement = this.createLiElement(item[0], () =>
            openWindow(`https://wikipedia.org/wiki/${item[1]}`)
          );
          tmpElement.textContent = `Search on Wikipedia : ${item[1]}`;
          actionElements.appendChild(tmpElement);
          break;
        case "exercise":
          tmpElement = this.createLiElement(item[0], () => this.changeView("exercise",item[1]));
          tmpElement.textContent = `Go to exercise : ${item[1]}`;
          actionElements.appendChild(tmpElement);
          break;
        case "quiz":
          tmpElement = this.createLiElement(item[0], () => this.changeView("quiz",item[1]));
          tmpElement.textContent = `Go to quiz : ${item[1]}`;
          actionElements.appendChild(tmpElement);
          break;
        case "url":
          tmpElement = this.createLiElement(item[0], () => openWindow(item[1]));
          tmpElement.textContent = `Go to website : ${item[1]}`;
          actionElements.appendChild(tmpElement);
          break;
      }
    });

    this.dropDown.firstElementChild.appendChild(actionElements);
    this.dropDown.appendChild(
      stringToStyleSheetNode(`
    .span_links_dropdown{
       z-index: 10000;
       font-family: arial;
       position: absolute;
       background-color: rgb(56, 56, 61);
       border-radius: 5px;
       width: fit-content;
       max-width: 35vw
     }
     .span_links_dropdown>ul{
       margin: 0px;
       list-style-type: none;
       padding: 2px;
     }
     .span_links_dropdown>ul>li{
       overflow: hidden;
       text-overflow: ellipsis;
       cursor: pointer;
       background-color: rgb(74, 74, 79);
       margin: 8px;
       padding: 5px;
       border-radius: 5px;
       color: white;
     }
     
     .span_links_dropdown>ul>li:hover{
       background-color: rgb(104, 104, 109) ;
     }`)
    );

    this.dropDown.style.top = event.clientY;
    this.dropDown.style.left = event.clientX;
    this.dropDown._this = this;
    document.body.appendChild(this.dropDown);
  }

  createLiElement(actionName, _function) {
    let liElement = document.createElement("li");
    liElement.classList.add(actionName);
    this.actionFunctionMap.set(actionName, _function);
    liElement.addEventListener("click", _function);
    return liElement;
  }
}

customElements.define("span-links-component", SpanLinksComponent, {
  extends: "span",
});

document.documentElement.addEventListener(
  "click",
  SpanLinksComponent.closeDropdown
);

export { SpanLinksComponent };
