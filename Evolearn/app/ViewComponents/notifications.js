import {
  createLoadingScreen,
  removeLoadingScreen,
} from "../LoadingScreen/loading-screen-component.js";

import {
  removeItemOnIndex,
  stringToStyleSheetNode,
} from "../AuxiliaryScripts/utils.js";
import { NotificationComponent } from "../NotificationManager/notification-component.js";
import {
  appendUnseenNotifications,
  changeLatestNotificationHash,
  clearAllNotifications,
  getSeenNotifications,
  getUnseenNotifications,
  syncFetchAllNotifications,
} from "../NotificationManager/notification-manager.js";

class NotificationsView extends HTMLElement {
  constructor() {
    super();
    this.documentTitle = "Notifications - All the news are here";
    this.urlString = "?view=notifications";
  }

  connectedCallback() {
    createLoadingScreen(this);

    document.querySelector(".notification_badge").innerText = "";

    this.classList.add(
      "notifications",
      "container_item",
      "d-flex",
      "flex-column"
    );

    this.innerHTML += `
    <div class="content_container">
    <div class="container_item notifications_container d-flex flex-column align-items-center">
        <h3 class="m-3 no_notifications d-none text-center">There are no notifications to display</h3>
        <div class="anchor"></div>
        </div>
      </div>
      <footer
        class="d-flex flex-wrap align-items-center justify-content-between p-2 bg-body-secondary"
      >
        <button class="remove_all_button btn btn-primary d-flex align-content-center">
          <span>Remove All Notifications</span>
          <span class="material-icons ps-2"> delete_forever </span>
        </button>
        <button class="get_all_button btn btn-primary d-flex align-content-center">
          <span>Get All Notifications</span>
          <span class="material-icons ps-2"> file_download </span>
        </button>
      </footer>`;

    this.appendChild(
      stringToStyleSheetNode(`
        .notification {
            max-width: 35rem;
            width: 100%;
        }
    `)
    );

    this.elements = {
      noNotifications: this.querySelector(".no_notifications"),
      notificationContainer: this.querySelector(".notifications_container"),
      removeAllButton: this.querySelector(".remove_all_button"),
      getAllButton: this.querySelector(".get_all_button"),
    };

    this.elements.removeAllButton.addEventListener(
      "click",
      this.removeAllNotifications.bind(this)
    );

    this.elements.getAllButton.addEventListener(
      "click",
      this.getAllNotifications.bind(this)
    );

    this.notifications = getSeenNotifications();
    this.notificationElements = [];
    if (this.notifications.length !== 0) {
      this.notifications.forEach((notification) => {
        let temp = new NotificationComponent(notification);
        this.notificationElements.push(temp);
        this.elements.notificationContainer.insertBefore(
          temp,
          this.querySelector(".anchor").nextElementSibling
        );
      });
    }

    let unseenNotifications = getUnseenNotifications();
    if (unseenNotifications.length !== 0) {
      unseenNotifications.forEach((notification) => {
        let temp = new NotificationComponent(notification, true);
        this.notificationElements.push(temp);
        this.elements.notificationContainer.insertBefore(
          temp,
          this.querySelector(".anchor").nextElementSibling
        );
      });
      this.notifications = this.notifications.concat(unseenNotifications);
      appendUnseenNotifications();
      changeLatestNotificationHash(this.notifications.at(-1).hash);
    }

    if (this.notifications.length === 0) {
      this.elements.noNotifications.classList.remove("d-none");
    }

    removeLoadingScreen(this);
  }

  removeAllNotifications() {
    while (this.notificationElements.length !== 0) {
      this.notificationElements[0].removeComponentNotification();
    }
    clearAllNotifications();
    this.elements.noNotifications.classList.remove("d-none");
  }

  async getAllNotifications() {
    this.removeAllNotifications();
    this.notifications = await syncFetchAllNotifications();
    if (this.notifications.length !== 0) {
      this.notifications.forEach((notification) => {
        let temp = new NotificationComponent(notification);
        this.notificationElements.push(temp);
        this.elements.notificationContainer.insertBefore(
          temp,
          this.querySelector(".anchor").nextElementSibling
        );
      });
      changeLatestNotificationHash(this.notifications.at(-1).hash);
      this.elements.noNotifications.classList.add("d-none");
    }
  }

  notificationRemoved(hash) {
    let notificationIndex = this.notifications.findIndex(
      (notification) => notification.hash == hash
    );

    this.notificationElements[notificationIndex].remove();

    this.notifications = removeItemOnIndex(
      this.notifications,
      notificationIndex
    );
    this.notificationElements = removeItemOnIndex(
      this.notificationElements,
      notificationIndex
    );

    if (this.notifications.length === 0) {
      this.elements.noNotifications.classList.remove("d-none");
    }
  }

  updateNotifications() {
    let latestNotification = getSeenNotifications().at(-1);
    let latestNotificationElement = new NotificationComponent(
      latestNotification
    );

    this.notificationElements.push(latestNotificationElement);
    this.notifications.push(latestNotification);

    this.elements.notificationContainer.insertBefore(
      latestNotificationElement,
      this.querySelector(".anchor").nextElementSibling
    );
    this.elements.noNotifications.classList.add("d-none");
  }
}

customElements.define("notifications-view", NotificationsView);

export { NotificationsView };
