import { returnPlainJson } from "../Fetcher/fetcher.js";
import { lsg, lss, removeItemOnIndex } from "../AuxiliaryScripts/utils.js";

initialize();

async function initialize() {
  let latestNotificationHash = lsg("LatestNotificationHash");

  if (latestNotificationHash === null) {
    let notifications = await fetchAllNotifications();
    lss("SeenNotifications", JSON.stringify(notifications));
    lss("UnseenNotifications", "[]");
    if(notifications.at(-1) !== undefined){
      lss("LatestNotificationHash", notifications.at(-1).hash);
    }
  } else {
    let unseenNotifications = await fetchUnseenNotifications(
      latestNotificationHash
    );
    lss("UnseenNotifications", JSON.stringify(unseenNotifications));

    if (unseenNotifications.length !== 0) {
      document.querySelector(
        ".notification_badge"
      ).innerText = `+${unseenNotifications.length}`;
    }
  }
}

async function fetchAllNotifications() {
  return returnPlainJson("/notifications");
}

async function syncFetchAllNotifications() {
  let notifications = await fetchAllNotifications();
  setSeenNotifications(notifications);
  return notifications;
}

async function fetchUnseenNotifications(hash) {
  return returnPlainJson(`/notifications/?hash=${hash}`);
}

function appendUnseenNotifications() {
  let seenNotifications = getSeenNotifications();
  let unseenNotifications = getUnseenNotifications();
  seenNotifications = seenNotifications.concat(unseenNotifications);

  lss("SeenNotifications", JSON.stringify(seenNotifications));
  lss("UnseenNotifications", "[]");
}

function addNotification(notification) {
  let seenNotifications = getSeenNotifications();
  seenNotifications = seenNotifications.concat(notification);
  lss("SeenNotifications", JSON.stringify(seenNotifications));
}

function changeLatestNotificationHash(hash) {
  lss("LatestNotificationHash", hash);
}

function removeNotification(hash) {
  let seenNotifications = getSeenNotifications();
  let notificationIndex = seenNotifications.findIndex(
    (notification) => notification.hash == hash
  );

  seenNotifications = removeItemOnIndex(seenNotifications, notificationIndex);
  lss("SeenNotifications", JSON.stringify(seenNotifications));
}

function clearAllNotifications() {
  lss("SeenNotifications", "[]");
  lss("UnseenNotifications", "[]");
}

function getSeenNotifications() {
  return JSON.parse(lsg("SeenNotifications"));
}

function setSeenNotifications(notifications) {
  lss("SeenNotifications", JSON.stringify(notifications));
}

function getUnseenNotifications() {
  return JSON.parse(lsg("UnseenNotifications"));
}

export {
  appendUnseenNotifications,
  changeLatestNotificationHash,
  addNotification,
  removeNotification,
  getSeenNotifications,
  getUnseenNotifications,
  clearAllNotifications,
  fetchAllNotifications,
  syncFetchAllNotifications,
};
