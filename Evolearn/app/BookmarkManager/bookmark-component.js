import { createToast } from "../ToastManager/toast-manager.js";
import { saveBookmarkData, removeBookmarkData } from "./bookmark-manager.js";

class BookmarkComponent extends HTMLElement {
  constructor(bookmarkIndex, bookmarkDataObject, pageNumber, maxNumberOfPages) {
    super();
    this.bookmarkId = bookmarkDataObject.bookmarkId;
    this.bookmarkIndex = bookmarkIndex;
    this._title = bookmarkDataObject.title;
    this.creationDate = bookmarkDataObject.creationDate;
    this.bookmarkDataObject = bookmarkDataObject;
    this.pageNumber = parseInt(pageNumber);
    this.maxNumberOfPages = maxNumberOfPages;
  }

  connectedCallback() {
    this.classList.add("bookmark", "card", "m-3");
    this.innerHTML = `
    <div class="card-header d-flex align-items-center justify-content-between">
        Bookmark ${this.bookmarkIndex}<span role="button" class="fs-6" data-bs-toggle="tooltip_" data-bs-placement="top"
            data-bs-title="Creation Date">${this.creationDate}</span><span><span role="button"
            class="delete material-icons" data-bs-toggle="tooltip_" data-bs-placement="top"
            data-bs-title="Delete Bookmark">delete</span>
            </div>
            <div class="form-floating mb-3 m-2">
                <input type="text" class="title form-control" placeholder="" value="${this._title}">
                <label>Title</label>
            </div>
            
            <label class="form-check ps-3">
            Page Number
            </label>
            <div class="form-floating m-2">
                <input
                class="form-control pt-2"
                type="number"
                value="${this.pageNumber}"
                min="1"
                name="page_number"
                />
            </div>

            <button class="change_page_button btn btn-primary w-50 align-self-center mt-1 mb-2" type="button">
            <span class=" d-flex align-items-center justify-content-between">Go To Page<span
            class="material-icons">arrow_forward</span>
            </span>
            </button>
    `;

    this.elements = {
      title: this.querySelector(".title"),
      pageNumber: this.querySelector('[name="page_number"]'),
      changePageButton: this.querySelector(".change_page_button"),
      deleteButton: this.querySelector(".delete"),
    };

    this._saveChangeInTitle = this.saveChangeInTitle.bind(this);
    this.elements.title.addEventListener("change", this._saveChangeInTitle);

    this._saveChangeInPage = this.saveChangeInPage.bind(this);
    this.elements.pageNumber.addEventListener("change", this._saveChangeInPage);

    this._changePage = this.changePage.bind(this);
    this.elements.changePageButton.addEventListener("click", this._changePage);

    this._removeBookmark = this.removeBookmark.bind(this);
    this.elements.deleteButton.addEventListener("click", this._removeBookmark, {
      once: true,
    });
  }

  saveChangeInTitle() {
    this.bookmarkDataObject.title = this.elements.title.value;
    saveBookmarkData(this.bookmarkId, this.bookmarkDataObject);
  }

  saveChangeInPage() {
    if (
      parseInt(this.elements.pageNumber.value) >= 1 &&
      parseInt(this.elements.pageNumber.value) <= this.maxNumberOfPages
    ) {
      this.bookmarkDataObject.pageNumber = this.elements.pageNumber.value;
      this.pageNumber = parseInt(this.elements.pageNumber.value);
      saveBookmarkData(this.bookmarkId, this.bookmarkDataObject);
    } else {
      this.elements.pageNumber.value = this.pageNumber;
      createToast("warning", "The page number specified is not valid", true);
    }
  }

  removeBookmark() {
    removeBookmarkData(this.bookmarkId);
    this.disconnectedCallback();
  }

  disconnectedCallback() {
    try {
      this.closest(".bookmarks").removeBookmark(this.bookmarkIndex);
      this.remove();
    } catch (error) {
      console.log("Bookmark Component removed.");
    }
  }

  changePage() {
    this.closest("pdf-component").changePage(this.pageNumber);
  }
}

customElements.define("bookmark-component", BookmarkComponent);

export { BookmarkComponent };
