import { createToast } from "../ToastManager/toast-manager.js";
import {
  lsg,
  stringToNode,
  stringToStyleSheetNode,
} from "../AuxiliaryScripts/utils.js";

class AskTeacherView extends HTMLElement {
  constructor() {
    super();
    this.documentTitle = "Ask the Teacher - He can help!";
    this.urlString = "?view=askTeacher";
    this.isConnectedToServer = false;
  }

  connectedCallback() {
    this.classList.add(
      "d-flex",
      "position-relative",
      "flex-column",
      "h-100",
      "align-content-center"
    );

    this.innerHTML = `
    <div class="accordion m-3" id="userProperties">
    <div class="accordion-item">
      <h2 class="accordion-header">
        <button
          class="accordion-button"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#collapseOne"
        >
          User Credentials
        </button>
      </h2>
      <div
        id="collapseOne"
        class="accordion-collapse collapse"
        data-bs-parent="#userProperties"
      >
        <div class="accordion-body">
          <div class="d-flex flex-column m-2">
            <div class="input-group mb-3">
              <span class="input-group-text" id="basic-addon1"
                ><span class="material-icons">badge</span></span
              >
              <input
                class="form-control"
                type="text"
                class="form-control"
                placeholder="User Name"
                name="user_name"
              />
            </div>
            <div class="input-group mb-3">
              <span class="input-group-text" id="basic-addon1"
                ><span class="material-icons">key</span></span
              >
              <input
                type="password"
                class="form-control"
                placeholder="Password"
                name="password_field"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <div class="messages_box d-flex flex-column">
  </div>

  <div class="messages_controls d-flex flex-column m-3 align-items-end align-self-center">
    <textarea
      style="width:100%; max-height: 10rem; min-height: 4rem;"
      id="chat_box"
      rows="1"
      placeholder="Enter you message here"
      maxlength=300
    ></textarea>
    <div class="mt-3">
    <button class="connect_to_server_button btn btn-primary float-left">Connect to Chat Server</button>
    <button class="send_message_button btn btn-primary">Send Message</button>
    <button class="clear_messages_button btn btn-primary">
    Clear Messages
    </button>
    </div>
  </div>
    `;

    this.appendChild(
      stringToStyleSheetNode(`
    .messages_box{
      width: 80%;
      height: 60vh;
      align-self: center;
      overflow: auto;
    }
    .messages_controls{
      width: 75vw;
    }
    `)
    );

    this.elements = {
      itemContainer: this.querySelector(".item_container"),
      userName: this.querySelector('[name="user_name"]'),
      password: this.querySelector('[name="password_field"]'),
      messagesBox: this.querySelector(".messages_box"),
      textField: this.querySelector("#chat_box"),
      connectToServerButton: this.querySelector(".connect_to_server_button"),
      sendMessageButton: this.querySelector(".send_message_button"),
      clearMessagesButton: this.querySelector(".clear_messages_button"),
    };

    this.elements.connectToServerButton.addEventListener(
      "click",
      this.connectToServer.bind(this)
    );

    this.elements.sendMessageButton.addEventListener(
      "click",
      this.sendMessageToTeacher.bind(this)
    );

    this.elements.clearMessagesButton.addEventListener(
      "click",
      this.clearMessages.bind(this)
    );

    this.initializeConnectionToChatServer();
  }
  // sendMessageToEveryone() {
  //   if (this.elements.textField.value !== "") {
  //     this.socket.emit("message_to_everyone", {
  //       message: this.elements.textField.value,
  //     });
  //     this.elements.textField.value = "";
  //   }
  // }

  sendMessageToTeacher() {
    if (this.elements.textField.value !== "") {
      this.socket.emit("message_to_teacher", {
        message: this.elements.textField.value,
        to: "adamidis",
      });
      this.elements.textField.value = "";
    }
  }

  renderMessage(message, scrollToEnd = false) {
    let direction =
      this.elements.userName.value === message.userName
        ? "align-self-start"
        : "align-self-end";
    let element = stringToNode(`
    <div class="message card border border-success m-3 ${direction}" style="max-width: 20rem">
    <span
      class="sender card-header d-flex justify-content-between flex-row flex-wrap"
      ><span>${message.userName}</span> <span>${message.dateStamp}</span> <span>${message.timeStamp}</span
    ></span>
    <p
      class="message_content card-body"
      style="max-width: fit-content; white-space: pre-line"
    >
      ${message.message}
    </p>
  </div>`);
    if (scrollToEnd) {
    }
    this.elements.messagesBox.appendChild(element);
  }

  renderGroupChatHistory(groupChatHistory) {
    groupChatHistory.forEach((message) => {
      this.renderMessage(message, true);
    });
    this.elements.messagesBox.children[
      this.elements.messagesBox.children.length - 1
    ];
  }

  clearMessages() {
    this.elements.messagesBox.replaceChildren();
  }

  connectToServer() {
    this.socket.auth = {
      userName: this.elements.userName.value,
      userType: "user",
    };
    this.socket.connect();
  }

  checkForTeacherConnected() {
    this.socket.emit("is_teacher_connected");
  }

  async initializeConnectionToChatServer() {
    // await import("../CdnFiles/socket.io.js");
    this.chatServerUrl = "http://localhost:3500";

    this.socket = io.connect(this.chatServerUrl, {
      autoConnect: false,
      reconnection: false,
    });

    this.socket.on("connect_error", (err) => {
      if (err.message === "invalid user") {
        createToast("error", "Invalid User Name or password");
      }
    });

    this.socket.on("message_from_teacher", (msg) => {
      this.renderMessage(msg);
    });

    this.socket.on("teacher_connected", () => {
      console.log("teacher connected");
      createToast("success", "Teacher Connected");
    });

    this.socket.on("teacher_disconnected", () => {
      console.log("teacher disconnected");
      createToast("warning", "Teacher Disconnected");
    });

    this.socket.on("teacher_is_connected", (isTeacherConnected) => {
      if (isTeacherConnected) {
        console.log("Teacher is currently connected");
      } else {
        console.log("Teacher is currently connected");
      }
      this.isTeacherConnected = isTeacherConnected;
    });

    this.socket.on("connect_successful", (groupChatHistory) => {
      this.isConnectedToServer = true;
      createToast("success", "Connected to Chat Server");
      this.renderGroupChatHistory(groupChatHistory);
      this.checkForTeacherConnected();
    });
  }

  // checkForSuccessfulConnection() {
  //   if (!this.isConnectedToServer) {
  //     setTimeout(this.connectToServer.bind(this), 500);
  //   } else {
  //     false;
  //   }
  // }

  disconnectedCallback() {
    console.log("Disconnecting from chat server");
    this.socket.destroy();
    this.socket.disconnect();
    this.socket = null;
  }
}

customElements.define("ask-the-teacher-view", AskTeacherView);

export { AskTeacherView };
