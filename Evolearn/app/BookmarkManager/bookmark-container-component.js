import { BookmarkComponent } from "./bookmark-component.js";
import {
  createBookmark,
  getBookmarkIds,
  loadBookmarkData,
} from "./bookmark-manager.js";
import { stringToStyleSheetNode } from "../AuxiliaryScripts/utils.js";

class BookmarkContainerComponent extends HTMLElement {
  constructor(bookmarkContainerId, maxNumberOfPages) {
    super();
    this.bookmarkContainerId = bookmarkContainerId;
    this.maxNumberOfPages = maxNumberOfPages;
  }

  connectedCallback() {
    this.classList.add("bookmarks", "container_item", "align-items-center");
    this.innerHTML = `
    <div class="bookmarks_base d-flex flex-row flex-wrap justify-content-center">
      <div class="add_bookmark position-relative text-center text-muted bg-body border rounded-3 m-3">
      <h1 class="m-4">Add New Bookmark</h1>
      <p class="mb-4">
        You can add as many bookmarks as you like. <br>
        Just make sure you don't go crazy with them!
      </p>
      <button class="btn btn-primary px-5 mb-5" type="button">
        <span class=" d-flex align-items-center justify-content-between">Add Bookmark <span
                class="material-icons">add</span>
        </span>
      </button>
    </div>
    </div>
    `;

    this.appendChild(
      stringToStyleSheetNode(`
      .bookmark {
          max-width: 25rem;
          width: 100%;
          max-height: 30rem;
      }

      .add_bookmark {
          max-width: 25rem;
          width: 100%;
          max-height: 30rem;
      }
      `)
    );

    this.elements = {
      bookmarksBase: this.querySelector(".bookmarks_base"),
      addBookmarkButton: this.querySelector(".add_bookmark"),
    };

    this.bookmarkIds = getBookmarkIds(this.bookmarkContainerId);
    this.bookmarksArray = [];

    this.bookmarkIdsLength = Object.keys(this.bookmarkIds).length;

    if (this.bookmarkIdsLength !== 1) {
      for (let index = 0; index < this.bookmarkIdsLength - 1; index++) {
        let bookmarkData = loadBookmarkData(
          Object.entries(this.bookmarkIds)[index + 1][1]
        );
        this.bookmarksArray.push(
          new BookmarkComponent(
            index + 1,
            bookmarkData,
            bookmarkData.pageNumber,
            this.maxNumberOfPages
          )
        );
      }
    }

    this.bookmarksArray.forEach((bookmark) => {
      this.elements.bookmarksBase.appendChild(bookmark);
    });
    this.refreshToolTips();

    this._createNewBookmark = this.createNewBookmark.bind(this);
    this.elements.addBookmarkButton.addEventListener(
      "click",
      this._createNewBookmark
    );
  }

  createNewBookmark() {
    let tmpIndex = this.bookmarksArray.push(
      new BookmarkComponent(
        this.bookmarksArray.length + 1,
        createBookmark(
          this.bookmarkContainerId,
          this.closest("pdf-component").pageNumber
        ),
        this.closest("pdf-component").pageNumber,
        this.maxNumberOfPages
      )
    );
    this.elements.bookmarksBase.appendChild(this.bookmarksArray[tmpIndex - 1]);
    this.refreshToolTips();
  }

  removeBookmark(bookmarkIndex) {
    if (this.bookmarksArray.length === 1) {
      this.bookmarksArray = [];
    } else {
      this.bookmarksArray = this.bookmarksArray.splice(bookmarkIndex - 1, 1);
    }
    document.querySelector(".tooltip").remove();
  }

  refreshToolTips() {
    this.elements.tooltipTriggerList = [];
    this.elements.tooltipTriggerEl = [];
    this.elements.tooltipTriggerList = this.querySelectorAll(
      '[data-bs-toggle="tooltip_"]'
    );
    this.elements.tooltipTriggerEl = [...this.elements.tooltipTriggerList].map(
      (tooltipTriggerEl) => new bootstrap.Tooltip(tooltipTriggerEl)
    );
  }

  disconnectedCallback() {}
}

customElements.define(
  "bookmark-container-component",
  BookmarkContainerComponent
);

export { BookmarkContainerComponent };
