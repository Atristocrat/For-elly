
import {
  auth,
  db,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  collection,
  addDoc,
  query,
  orderBy,
  onSnapshot,
  serverTimestamp
} from "./firebase.js";

const ELLY_UID = "HofH5L2EnsbPwUYSfXDE76R896M2";
const TRISTAN_UID = "m2GOAVLckwadrLytnKnjLcpI1lt2";

const people = {
  [ELLY_UID]: "Elly",
  [TRISTAN_UID]: "Tristan"
};

const letter = document.querySelector("#letter");

if (!letter) {
  console.error("The love letter section (#letter) was not found.");
} else {
  const section = document.createElement("section");
  section.id = "ourLittleCorner";
  section.className = "elly-chat-section";

  section.innerHTML = `
    <div class="elly-chat-heading">
      <span class="elly-chat-eyebrow">A LITTLE SPACE FOR US</span>
      <h2>Our Little Corner ♡</h2>
      <p>A place for your thoughts, stories, and little conversations.</p>
    </div>

    <div id="ellyChatLogin" class="elly-chat-panel">
      <h3>Welcome back ♡</h3>
      <p>Sign in to enter your little corner.</p>

      <form id="ellyLoginForm">
        <label for="ellyEmail">Email address</label>
        <input id="ellyEmail" type="email" autocomplete="username"
          placeholder="Your Firebase account email" required>

        <label for="ellyPassword">Password</label>
        <input id="ellyPassword" type="password"
          autocomplete="current-password" placeholder="Your password" required>

        <button type="submit" id="ellyLoginButton">Enter our corner ♡</button>
        <p id="ellyLoginError" class="elly-chat-error" aria-live="polite"></p>
      </form>
    </div>

    <div id="ellyChatRoom" class="elly-chat-panel" hidden>
      <div class="elly-chat-topbar">
        <div>
          <h3>Our conversation ♡</h3>
          <p id="ellySignedInAs"></p>
        </div>
        <button type="button" id="ellyLogoutButton"
          class="elly-chat-logout">Log out</button>
      </div>

      <div id="ellyMessages" class="elly-chat-messages"
        aria-live="polite">
        <p class="elly-chat-empty">Loading your messages...</p>
      </div>

      <form id="ellyMessageForm" class="elly-chat-compose">
        <textarea id="ellyMessageInput" rows="2" maxlength="2000"
          placeholder="Write something..." required></textarea>
        <div class="elly-chat-compose-bottom">
          <span>Up to 2,000 characters</span>
          <button type="submit" id="ellySendButton">Send ♡</button>
        </div>
        <p id="ellySendError" class="elly-chat-error"
          aria-live="polite"></p>
      </form>
    </div>

    <p class="elly-chat-footer">A little corner belonging to two people. ♡</p>
  `;

  letter.insertAdjacentElement("afterend", section);

  const style = document.createElement("style");
  style.textContent = `
    .elly-chat-section {
      width: min(760px, calc(100% - 36px));
      margin: 70px auto;
      color: var(--navy, #243b53);
    }

    .elly-chat-heading {
      text-align: center;
      margin-bottom: 28px;
    }

    .elly-chat-eyebrow {
      font-size: 10px;
      letter-spacing: 3px;
      color: var(--blue, #526f8c);
    }

    .elly-chat-heading h2 {
      font-family: "Playfair Display", Georgia, serif;
      font-size: clamp(27px, 5vw, 38px);
      margin: 10px 0;
      color: var(--navy, #243b53);
    }

    .elly-chat-heading p,
    .elly-chat-panel > p {
      color: var(--muted, #78899b);
      font-size: 14px;
      line-height: 1.7;
    }

    .elly-chat-panel {
      background: var(--white, #fffefa);
      border: 1px solid var(--border, #d6e0e9);
      border-radius: 18px;
      padding: clamp(18px, 4vw, 30px);
      box-shadow: 0 12px 35px rgba(36, 59, 83, 0.08);
    }

    .elly-chat-panel h3 {
      font-family: "Playfair Display", Georgia, serif;
      font-size: 22px;
      margin: 0 0 8px;
    }

    .elly-chat-panel label {
      display: block;
      margin: 18px 0 7px;
      font-size: 13px;
      color: var(--blue-dark, #385675);
    }

    .elly-chat-panel input,
    .elly-chat-compose textarea {
      width: 100%;
      box-sizing: border-box;
      border: 1px solid var(--border, #d6e0e9);
      background: var(--cream, #f8f6f0);
      color: var(--navy, #243b53);
      border-radius: 10px;
      padding: 13px 14px;
      font: inherit;
      font-size: 14px;
      outline: none;
    }

    .elly-chat-panel input:focus,
    .elly-chat-compose textarea:focus {
      border-color: var(--blue, #526f8c);
    }

    .elly-chat-panel button {
      cursor: pointer;
      border: 0;
      border-radius: 10px;
      padding: 12px 18px;
      font: inherit;
      font-size: 13px;
      transition: opacity 0.2s ease;
    }

    .elly-chat-panel button:disabled {
      opacity: 0.55;
      cursor: wait;
    }

    #ellyLoginButton {
      width: 100%;
      margin-top: 20px;
      background: var(--navy, #243b53);
      color: white;
    }

    .elly-chat-topbar {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 12px;
      padding-bottom: 18px;
      border-bottom: 1px solid var(--border, #d6e0e9);
    }

    .elly-chat-topbar p {
      color: var(--muted, #78899b);
      font-size: 12px;
      margin: 5px 0 0;
    }

    .elly-chat-logout {
      background: var(--blue-light, #e8edf3);
      color: var(--navy, #243b53);
    }

    .elly-chat-messages {
      height: 360px;
      overflow-y: auto;
      padding: 20px 2px;
      display: flex;
      flex-direction: column;
      gap: 14px;
      scroll-behavior: smooth;
    }

    .elly-chat-empty {
      text-align: center;
      color: var(--muted, #78899b);
      font-size: 13px;
      margin: auto;
    }

    .elly-chat-message {
      max-width: 82%;
      padding: 12px 15px;
      border-radius: 14px;
      overflow-wrap: anywhere;
    }

    .elly-chat-message.mine {
      align-self: flex-end;
      background: var(--blue-light, #e8edf3);
      border-bottom-right-radius: 4px;
    }

    .elly-chat-message.theirs {
      align-self: flex-start;
      background: var(--cream, #f8f6f0);
      border: 1px solid var(--border, #d6e0e9);
      border-bottom-left-radius: 4px;
    }

    .elly-chat-message-name {
      font-size: 11px;
      font-weight: 700;
      color: var(--blue-dark, #385675);
      margin-bottom: 5px;
    }

    .elly-chat-message-text {
      white-space: pre-wrap;
      font-size: 14px;
      line-height: 1.6;
      color: var(--navy, #243b53);
    }

    .elly-chat-message-time {
      font-size: 10px;
      color: var(--muted, #78899b);
      margin-top: 7px;
      text-align: right;
    }

    .elly-chat-compose {
      border-top: 1px solid var(--border, #d6e0e9);
      padding-top: 17px;
    }

    .elly-chat-compose textarea {
      resize: vertical;
      min-height: 65px;
    }

    .elly-chat-compose-bottom {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 10px;
      margin-top: 10px;
    }

    .elly-chat-compose-bottom span {
      font-size: 10px;
      color: var(--muted, #78899b);
    }

    #ellySendButton {
      background: var(--navy, #243b53);
      color: white;
    }

    .elly-chat-error {
      color: #b83f48;
      font-size: 12px;
      line-height: 1.5;
    }

    .elly-chat-footer {
      text-align: center;
      color: var(--muted, #78899b);
      font-family: "Playfair Display", Georgia, serif;
      font-size: 14px;
      margin-top: 22px;
    }

    @media (max-width: 600px) {
      .elly-chat-section {
        margin: 45px auto;
      }

      .elly-chat-messages {
        height: 320px;
      }

      .elly-chat-message {
        max-width: 90%;
      }
    }
  `;

  document.head.appendChild(style);

  const loginPanel = document.querySelector("#ellyChatLogin");
  const chatRoom = document.querySelector("#ellyChatRoom");
  const loginForm = document.querySelector("#ellyLoginForm");
  const messagesBox = document.querySelector("#ellyMessages");
  const messageForm = document.querySelector("#ellyMessageForm");
  const messageInput = document.querySelector("#ellyMessageInput");

  let unsubscribeMessages = null;

  function showError(id, message) {
    document.querySelector(id).textContent = message;
  }

  function showLogin() {
    if (unsubscribeMessages) {
      unsubscribeMessages();
      unsubscribeMessages = null;
    }

    loginPanel.hidden = false;
    chatRoom.hidden = true;
    messagesBox.replaceChildren();
  }

  function showChat(user) {
    const name = people[user.uid];

    if (!name) {
      signOut(auth);
      showError("#ellyLoginError", "This account is not authorized.");
      return;
    }

    loginPanel.hidden = true;
    chatRoom.hidden = false;
    document.querySelector("#ellySignedInAs").textContent =
      `Signed in as ${name}`;

    loadMessages(user);
  }

  function loadMessages(user) {
    if (unsubscribeMessages) unsubscribeMessages();

    messagesBox.replaceChildren();

    const messagesQuery = query(
      collection(db, "messages"),
      orderBy("createdAt", "asc")
    );

    unsubscribeMessages = onSnapshot(
      messagesQuery,
      (snapshot) => {
        messagesBox.replaceChildren();

        if (snapshot.empty) {
          const empty = document.createElement("p");
          empty.className = "elly-chat-empty";
          empty.textContent = "Your conversation starts here. ♡";
          messagesBox.appendChild(empty);
          return;
        }

        snapshot.forEach((messageDoc) => {
          const message = messageDoc.data();

          const bubble = document.createElement("article");
          bubble.className = "elly-chat-message " +
            (message.senderUid === user.uid ? "mine" : "theirs");

          const sender = document.createElement("div");
          sender.className = "elly-chat-message-name";
          sender.textContent = message.senderName;

          const content = document.createElement("div");
          content.className = "elly-chat-message-text";
          content.textContent = message.text;

          const time = document.createElement("div");
          time.className = "elly-chat-message-time";

          if (message.createdAt) {
            time.textContent = message.createdAt.toDate().toLocaleString(
              undefined,
              {
                month: "short",
                day: "numeric",
                hour: "numeric",
                minute: "2-digit"
              }
            );
          } else {
            time.textContent = "Sending...";
          }

          bubble.append(sender, content, time);
          messagesBox.appendChild(bubble);
        });

        messagesBox.scrollTop = messagesBox.scrollHeight;
      },
      (error) => {
        console.error("Message loading error:", error);
        messagesBox.textContent =
          "Unable to load messages. Please try signing in again.";
      }
    );
  }

  loginForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const email = document.querySelector("#ellyEmail").value.trim();
    const password = document.querySelector("#ellyPassword").value;
    const button = document.querySelector("#ellyLoginButton");

    button.disabled = true;
    button.textContent = "Signing in...";
    showError("#ellyLoginError", "");

    try {
      const result = await signInWithEmailAndPassword(auth, email, password);

      if (!people[result.user.uid]) {
        await signOut(auth);
        throw new Error("This account is not one of the two approved accounts.");
      }
    } catch (error) {
      console.error(error);
      showError(
        "#ellyLoginError",
        error.code === "auth/invalid-credential"
          ? "Incorrect email or password. Please try again."
          : error.message
      );
    } finally {
      button.disabled = false;
      button.textContent = "Enter our corner ♡";
    }
  });

  document.querySelector("#ellyLogoutButton").addEventListener(
    "click",
    () => signOut(auth)
  );

  messageForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const user = auth.currentUser;
    const text = messageInput.value.trim();
    const button = document.querySelector("#ellySendButton");

    if (!user || !people[user.uid] || !text) return;

    button.disabled = true;
    showError("#ellySendError", "");

    try {
      await addDoc(collection(db, "messages"), {
        senderUid: user.uid,
        senderName: people[user.uid],
        text,
        createdAt: serverTimestamp()
      });

      messageInput.value = "";
    } catch (error) {
      console.error(error);
      showError("#ellySendError", "Your message could not be sent. Please try again.");
    } finally {
      button.disabled = false;
    }
  });

  onAuthStateChanged(auth, (user) => {
    if (user && people[user.uid]) {
      showChat(user);
    } else {
      showLogin();
    }
  });
}
