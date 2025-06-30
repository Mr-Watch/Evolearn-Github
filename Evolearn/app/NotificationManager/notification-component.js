import { createModal } from "../ModalManager/modal-manager.js";
import { stringToNode } from "../AuxiliaryScripts/utils.js";
import { removeNotification } from "./notification-manager.js";

class NotificationComponent extends HTMLElement {
  constructor({ title, message, hash, timeStamp, dateStamp }, unseen = false) {
    super();
    this.title = title;
    this.message = message;
    this.hash = hash;
    this.timeStamp = timeStamp;
    this.dateStamp = dateStamp;
    this.unseen = unseen;
  }

  connectedCallback() {
    this.classList.add("notification", "card", "m-3");
    this.role = "button";

    this.innerHTML = `
    <span
      class="card-header d-flex justify-content-between flex-row flex-wrap"
      ><span>${this.title}</span> <span>${this.dateStamp}</span> <span>${this.timeStamp}</span
    ></span>
    <p
      class="message card-body overflow-auto"
      style="white-space: pre-line; max-height: 10rem"
    >
      ${this.message}
    </p>
    <div class="card-footer">
    <button class="remove_notification btn btn-primary d-flex align-items-center float-end">Delete Notification <span class="material-icons ms-2">delete</span></button>
    </div>`;
    this.addEventListener("click", this.openModal.bind(this));
    this.querySelector(".remove_notification").addEventListener(
      "click",
      this.removeComponentNotification.bind(this)
    );

    if (this.unseen) {
      this.classList.add("border", "border-success");
    }
  }

  openModal() {
    createModal(
      this.title,
      stringToNode(`<div style="white-space: pre-line">${this.message}</div>`),
      undefined,
      undefined,
      undefined,
      true
    );
  }

  removeComponentNotification(e) {
    if (e !== undefined) {
      e.stopPropagation();
    }

    this.closest("notifications-view").notificationRemoved(this.hash);
    removeNotification(this.hash);
  }
}

customElements.define("notification-component", NotificationComponent);

export { NotificationComponent };
