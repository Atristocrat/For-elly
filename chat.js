
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

const MAX_PHOTO_SIZE = 500 * 1024;

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
          placeholder="Your gmail address Darling :>" required>

        <label for="ellyPassword">Password</label>
        <input id="ellyPassword" type="password"
          autocomplete="current-password"
          placeholder="Password my love (It's not I love you tristan)"
          required>

        <button type="submit" id="ellyLoginButton">
          Enter our corner ♡
        </button>
        <p id="ellyLoginError" class="elly-chat-error"
          aria-live="polite"></p>
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

      <div class="elly-camera-panel" id="ellyCameraPanel" hidden>
        <video id="ellyCameraVideo" autoplay muted playsinline></video>

        <img id="ellyCapturedPreview" alt="Your captured photo"
          hidden>

        <p id="ellyCameraStatus" aria-live="polite"></p>

        <div class="elly-camera-controls" id="ellyLiveControls">
          <button type="button" id="ellyCaptureButton">
            Take photo
          </button>
          <button type="button" id="ellySwitchCameraButton">
            Switch camera
          </button>
          <button type="button" id="ellyCloseCameraButton">
            Close
          </button>
        </div>

        <div class="elly-camera-controls" id="ellyPhotoControls" hidden>
          <button type="button" id="ellyRetakeButton">
            Retake
          </button>
          <button type="button" id="ellySendPhotoButton">
            Send photo ♡
          </button>
        </div>
      </div>

      <form id="ellyMessageForm" class="elly-chat-compose">
        <textarea id="ellyMessageInput" rows="2" maxlength="2000"
          placeholder="Write something..."></textarea>

        <div class="elly-chat-compose-bottom">
          <button type="button" id="ellyOpenCameraButton"
            class="elly-camera-open">
            ♡ Take a photo
          </button>

          <span>Up to 2,000 characters</span>

          <button type="submit" id="ellySendButton">
            Send ♡
          </button>
        </div>

        <p id="ellySendError" class="elly-chat-error"
          aria-live="polite"></p>
      </form>
    </div>

    <p class="elly-chat-footer">
      A little corner belonging to two people. ♡
    </p>
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

    .elly-chat-message-photo {
      display: block;
      width: 100%;
      max-width: 260px;
      max-height: 340px;
      object-fit: contain;
      border-radius: 10px;
      margin-top: 5px;
      background: var(--blue-light, #e8edf3);
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
      flex-wrap: wrap;
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

    .elly-camera-open {
      background: var(--blue-light, #e8edf3);
      color: var(--navy, #243b53);
    }

    .elly-camera-panel {
      margin: 16px 0;
      padding: 14px;
      background: var(--cream, #f8f6f0);
      border: 1px solid var(--border, #d6e0e9);
      border-radius: 14px;
      text-align: center;
    }

    .elly-camera-panel video,
    .elly-camera-panel > img {
      width: 100%;
      max-height: 380px;
      object-fit: contain;
      border-radius: 10px;
      background: #172536;
    }

    .elly-camera-panel p {
      color: var(--muted, #78899b);
      font-size: 12px;
    }

    .elly-camera-controls {
      display: flex;
      justify-content: center;
      flex-wrap: wrap;
      gap: 8px;
      margin-top: 12px;
    }

    #ellyCaptureButton,
    #ellySendPhotoButton {
      background: var(--navy, #243b53);
      color: white;
    }

    #ellySwitchCameraButton,
    #ellyCloseCameraButton,
    #ellyRetakeButton {
      background: var(--blue-light, #e8edf3);
      color: var(--navy, #243b53);
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

    [hidden] {
      display: none !important;
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

  const $ = (selector) => section.querySelector(selector);

  const loginPanel = $("#ellyChatLogin");
  const chatRoom = $("#ellyChatRoom");
  const loginForm = $("#ellyLoginForm");
  const messagesBox = $("#ellyMessages");
  const messageForm = $("#ellyMessageForm");
  const messageInput = $("#ellyMessageInput");

  const cameraPanel = $("#ellyCameraPanel");
  const cameraVideo = $("#ellyCameraVideo");
  const capturedPreview = $("#ellyCapturedPreview");
  const cameraStatus = $("#ellyCameraStatus");
  const liveControls = $("#ellyLiveControls");
  const photoControls = $("#ellyPhotoControls");

  let unsubscribeMessages = null;
  let cameraStream = null;
  let facingMode = "environment";
  let capturedPhoto = null;
  let capturedPhotoUrl = null;

  function showError(selector, message) {
    $(selector).textContent = message;
  }

  function stopCamera() {
    if (cameraStream) {
      cameraStream.getTracks().forEach((track) => track.stop());
      cameraStream = null;
    }

    cameraVideo.srcObject = null;
  }

  function clearCapturedPhoto() {
    capturedPhoto = null;

    if (capturedPhotoUrl) {
      URL.revokeObjectURL(capturedPhotoUrl);
      capturedPhotoUrl = null;
    }

    capturedPreview.removeAttribute("src");
    capturedPreview.hidden = true;
  }

  function closeCamera() {
    stopCamera();
    clearCapturedPhoto();
    cameraPanel.hidden = true;
    cameraStatus.textContent = "";
  }

  function showLogin() {
    stopCamera();
    closeCamera();

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
      showError("#ellyLoginError",
        "This account is not authorized.");
      return;
    }

    loginPanel.hidden = true;
    chatRoom.hidden = false;

    $("#ellySignedInAs").textContent = `Signed in as ${name}`;

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

          bubble.className =
            "elly-chat-message " +
            (message.senderUid === user.uid ? "mine" : "theirs");

          const sender = document.createElement("div");
          sender.className = "elly-chat-message-name";
          sender.textContent = message.senderName;

          bubble.appendChild(sender);

          if (message.photoData) {
            const photo = document.createElement("img");
            photo.className = "elly-chat-message-photo";
            photo.src = message.photoData;
            photo.alt = `Photo sent by ${message.senderName}`;
            photo.loading = "lazy";
            bubble.appendChild(photo);
          } else {
            const content = document.createElement("div");
            content.className = "elly-chat-message-text";
            content.textContent = message.text || "";
            bubble.appendChild(content);
          }

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

          bubble.appendChild(time);
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

  async function startCamera() {
    stopCamera();
    clearCapturedPhoto();

    cameraPanel.hidden = false;
    cameraVideo.hidden = false;
    liveControls.hidden = false;
    photoControls.hidden = true;

    cameraStatus.textContent = "Opening your camera...";

    try {
      cameraStream = await navigator.mediaDevices.getUserMedia({
        audio: false,
        video: {
          facingMode: { ideal: facingMode },
          width: { ideal: 1920 },
          height: { ideal: 1080 }
        }
      });

      cameraVideo.srcObject = cameraStream;
      await cameraVideo.play();

      cameraStatus.textContent =
        "Your camera is ready. Take your photo ♡";
    } catch (error) {
      console.error("Camera error:", error);

      cameraStatus.textContent =
        error.name === "NotAllowedError"
          ? "Camera permission was denied. Please allow camera access."
          : "Could not open your camera. Check your browser permissions.";

      stopCamera();
    }
  }

  function canvasToBlob(canvas, quality) {
    return new Promise((resolve, reject) => {
      canvas.toBlob(
        (blob) => {
          if (blob) resolve(blob);
          else reject(new Error("Photo compression failed."));
        },
        "image/jpeg",
        quality
      );
    });
  }

  async function compressPhoto(video) {
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");

    let width = video.videoWidth;
    let height = video.videoHeight;

    if (!width || !height) {
      throw new Error("The camera has not produced an image yet.");
    }

    const maxDimension = 1600;

    if (Math.max(width, height) > maxDimension) {
      const scale = maxDimension / Math.max(width, height);
      width = Math.round(width * scale);
      height = Math.round(height * scale);
    }

    for (let attempt = 0; attempt < 12; attempt++) {
      canvas.width = width;
      canvas.height = height;

      context.drawImage(video, 0, 0, width, height);

      for (const quality of [0.82, 0.72, 0.62, 0.52, 0.42]) {
        const blob = await canvasToBlob(canvas, quality);

        if (blob.size <= MAX_PHOTO_SIZE) {
          return blob;
        }
      }

      width = Math.round(width * 0.8);
      height = Math.round(height * 0.8);
    }

    throw new Error(
      "This photo could not be compressed below 500 KB. Please try again."
    );
  }

  function blobToDataUrl(blob) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = () => resolve(reader.result);
      reader.onerror = () => reject(new Error("Could not read the photo."));

      reader.readAsDataURL(blob);
    });
  }

  $("#ellyOpenCameraButton").addEventListener("click", async () => {
    if (!navigator.mediaDevices?.getUserMedia) {
      showError("#ellySendError",
        "Live camera access is not supported by this browser.");
      return;
    }

    showError("#ellySendError", "");
    await startCamera();
  });

  $("#ellyCaptureButton").addEventListener("click", async () => {
    const button = $("#ellyCaptureButton");

    if (!cameraStream) return;

    button.disabled = true;
    cameraStatus.textContent = "Compressing your photo...";

    try {
      const blob = await compressPhoto(cameraVideo);

      capturedPhoto = await blobToDataUrl(blob);

      if (capturedPhoto.length > 700000) {
        throw new Error("The compressed photo is too large to send.");
      }

      capturedPhotoUrl = URL.createObjectURL(blob);

      capturedPreview.src = capturedPhotoUrl;
      capturedPreview.hidden = false;
      cameraVideo.hidden = true;

      liveControls.hidden = true;
      photoControls.hidden = false;

      cameraStatus.textContent =
        `Ready to send! ${(blob.size / 1024).toFixed(0)} KB ♡`;

      stopCamera();
    } catch (error) {
      console.error(error);
      cameraStatus.textContent = error.message;
    } finally {
      button.disabled = false;
    }
  });

  $("#ellySwitchCameraButton").addEventListener("click", async () => {
    facingMode = facingMode === "environment" ? "user" : "environment";
    await startCamera();
  });

  $("#ellyCloseCameraButton").addEventListener("click", closeCamera);

  $("#ellyRetakeButton").addEventListener("click", async () => {
    await startCamera();
  });

  $("#ellySendPhotoButton").addEventListener("click", async () => {
    const user = auth.currentUser;
    const button = $("#ellySendPhotoButton");

    if (!user || !people[user.uid] || !capturedPhoto) return;

    button.disabled = true;
    button.textContent = "Sending...";

    cameraStatus.textContent = "Sending your photo...";

    try {
      await addDoc(collection(db, "messages"), {
        senderUid: user.uid,
        senderName: people[user.uid],
        photoData: capturedPhoto,
        createdAt: serverTimestamp()
      });

      closeCamera();
      showError("#ellySendError", "");
    } catch (error) {
      console.error("Photo sending error:", error);

      cameraStatus.textContent =
        "Photo could not be sent. Please check your connection and try again.";
    } finally {
      button.disabled = false;
      button.textContent = "Send photo ♡";
    }
  });

  loginForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const email = $("#ellyEmail").value.trim();
    const password = $("#ellyPassword").value;
    const button = $("#ellyLoginButton");

    button.disabled = true;
    button.textContent = "Signing in...";

    showError("#ellyLoginError", "");

    try {
      const result = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );

      if (!people[result.user.uid]) {
        await signOut(auth);
        throw new Error(
          "This account is not one of the two approved accounts."
        );
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

  $("#ellyLogoutButton").addEventListener("click", () => {
    closeCamera();
    signOut(auth);
  });

  messageForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const user = auth.currentUser;
    const text = messageInput.value.trim();
    const button = $("#ellySendButton");

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

      showError(
        "#ellySendError",
        "Your message could not be sent. Please try again."
      );
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

  window.addEventListener("pagehide", stopCamera);
}
