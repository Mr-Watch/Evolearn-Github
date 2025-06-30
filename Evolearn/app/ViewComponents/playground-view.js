class PlaygroundView extends HTMLElement {
  constructor() {
    super();
    this.documentTitle = "Playground - Time to see the big picture...";
    this.urlString = "?view=playgroundView"
  }

  connectedCallback() {
    this.classList.add(
      "d-flex",
      "position-relative",
      "flex-column",
      "h-100",
      "align-items-center",
      "align-content-center"
    );

    this.innerHTML = `
      <h1 class="m-4">Playground</h1>
      <h3 class="m-4" style="text-align: center;">Here you can see how evolutionary algorithms work with visual examples that you can configure to your liking</h3>
      <div class="item_container d-flex flex-row flex-wrap justify-content-center"></div>
      `;

    this.elements = {
      itemContainer: this.querySelector(".item_container"),
    };
  }
}

customElements.define("playground-view", PlaygroundView);

export { PlaygroundView };
