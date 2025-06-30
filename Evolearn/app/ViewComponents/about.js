import { fetchJson } from "../Fetcher/fetcher.js";
import { openWindow, stringToNode, stringToStyleSheetNode } from "../AuxiliaryScripts/utils.js";

class AboutView extends HTMLElement {
  constructor() {
    super();
    this.documentTitle = "About - How the 'cake' was made";
    this.urlString = "?view=about"
    this.technologies = {};
    this.observer = {};
    fetchJson(
      "../ViewComponents/about.json",
      this.renderTechnologies.bind(this)
    );
  }

  renderTechnologies(data) {
    this.connectedCallback();
    for (let technology of data) {
      this.appendToHtml(technology);
    }

    this.technologies = this.querySelectorAll(".technology");
    this.observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("show");
        }
      });
    });

    this.technologies.forEach((el) => this.observer.observe(el));
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
    <h1 class="m-4">About Evolearn</h1>
    <img src="./Images/favicon.svg" width="15%" alt="logo">
    <h3 class="m-4" style="text-align: center;">Every single technology that was used to make this application possible is listed right here<br>
    The descriptions used came from wikipedia or the website of the technology were applicable</h3>
    `;

    this.appendChild(
      stringToStyleSheetNode(`
    .left{
      opacity: 0;
      filter: blur(10px);
      transform: translateX(-100%);
      transition:all 1.5s;
    }

    .right{
      opacity: 0;
      filter: blur(10px);
      transform: translateX(100%);
      transition:all 1.5s;
    }

    .show {
      opacity: 1;
      filter: blur(0);
      transform: translateX(0);
    }
    `)
    );
  }

  appendToHtml(obj) {
    let technology = stringToNode(`
    <div
    class="${obj.direction} technology w-75 m-5 p-3 text-center bg-body-tertiary rounded-3 border border-black"
  >
    <img
      class="m-2"
      src="${obj.img}"
      width="15%"
      alt=""
    />
    <h1 class="text-body-emphasis">${obj.title}</h1>
    <p class="col-lg-8 mx-auto fs-5 text-muted">
      ${obj.description}
    </p>
    <div class="d-inline-flex gap-2 mb-5">
      <button
        class="website_button d-inline-flex align-items-center btn btn-primary btn-lg px-4 rounded-pill"
        type="button"
      >
        Go to website <span class="material-icons ps-2">link</span>
      </button>
      <button
        class="license_button d-inline-flex align-items-center btn btn-outline-secondary btn-lg px-4 rounded-pill"
        type="button"
      >
        Open License <span class="material-icons ps-2">feed</span>
      </button>
    </div>
  </div>`);

    technology
      .querySelector(".website_button")
      .addEventListener("click", () => {
        openWindow(obj.url);
      });
    if(obj.license !== undefined){
      technology
        .querySelector(".license_button")
        .addEventListener("click", () => {
          openWindow(obj.license);
        });
    }else{
      technology.querySelector('.license_button').classList.add('d-none')
    }

    this.appendChild(technology);
  }
}

customElements.define("about-view", AboutView);

export { AboutView };
