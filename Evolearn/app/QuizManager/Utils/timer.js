import { pad } from "../../AuxiliaryScripts/utils.js";
import { createToast } from "../../ToastManager/toast-manager.js";

class Timer {
  constructor(
    minutes = 0,
    notifyUser = false,
    element,
    callback,
    language = "en"
  ) {
    this.language = language;
    this.languageDefinitions = {
      el: {
        halfWay: "Έχει περάσει το μισό του διαθέσιμου χρόνου",
        oneMinute: "Σας έχει απομένει ένα λεπτό",
      },
      en: {
        halfWay: "Half of the available time has elapsed",
        oneMinute: "You have one minute remaining",
      },
    };
    if (element === undefined) {
      throw TypeError("You need to pass an element for the timer to use.");
    } else if (callback === undefined) {
      throw TypeError(
        "You need to pass a callback function for the timer to use."
      );
    } else {
      this.element = element;
      this.callback = callback;
    }

    this.minutes = minutes - 1;
    this.minutesHalf = minutes % 2;
    this.secondsHalf = 30;

    if (this.minutesHalf === 0) {
      this.minutesHalf = minutes / 2;
      this.secondsHalf = 0;
    }

    this.notifyUser = notifyUser;
    this.seconds = 59;
  }

  changeLanguage(language) {
    this.language = language;
  }

  starTimer() {
    this.tick();
    this.timerInterval = setInterval(this.tick.bind(this), 1000);
  }

  clearTimer() {
    clearInterval(this.timerInterval);
    this.element.classList.remove("flash_timer");
  }

  tick() {
    if (this.minutes === 0 && this.seconds === 0) {
      clearInterval(this.timerInterval);
      this.element.classList.remove("flash_timer");
      this.callback();
      return;
    }

    if (
      this.minutes === this.minutesHalf &&
      this.seconds === this.secondsHalf &&
      this.notifyUser
    ) {
      createToast(
        "info",
        this.languageDefinitions[this.language].halfWay,
        true
      );
    }

    if (
      this.minutes + 1 === 1 &&
      (this.seconds === 0 || this.seconds === 59) &&
      this.notifyUser
    ) {
      createToast(
        "warning",
        this.languageDefinitions[this.language].oneMinute,
        true
      );
      this.element.classList.add("flash_timer");
    }

    if (this.seconds === 0) {
      this.seconds = 59;
      this.minutes -= 1;
      this.updateElement();
    } else {
      this.seconds -= 1;
      this.updateElement();
    }
  }

  updateElement() {
    this.element.innerText = `${pad(this.minutes, 2)} : ${pad(
      this.seconds,
      2
    )}`;
  }
}

export { Timer };
