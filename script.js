
/* =========================================
   FOR ELLY, WITH LOVE
   Clean Interactive Experience
========================================= */


/* =========================================
   1. OPENING SCREEN
========================================= */

const openButton = document.getElementById("openButton");
const opening = document.getElementById("opening");
const mainContent = document.getElementById("mainContent");
const music = document.getElementById("backgroundMusic");

let websiteOpened = false;

if (openButton && opening && mainContent) {
  openButton.addEventListener("click", () => {
    if (websiteOpened) return;
    websiteOpened = true;

    if (music) {
      music.volume = 0.35;
      music.play().catch(error => {
        console.warn("Music could not start:", error);
      });
    }

    opening.style.opacity = "0";

    setTimeout(() => {
      opening.classList.add("hidden");
      mainContent.classList.remove("hidden");

      window.scrollTo({
        top: 0,
        behavior: "smooth"
      });

      startPetals();
    }, 800);
  });
}


/* =========================================
   2. FLOATING FLOWER PETALS
========================================= */

let petalsStarted = false;

function startPetals() {
  if (petalsStarted) return;
  petalsStarted = true;

  const container = document.createElement("div");
  container.className = "petal-container";
  document.body.appendChild(container);

  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    return;
  }

  function createPetal() {
    const petal = document.createElement("span");

    petal.className = "petal";
    petal.textContent = Math.random() > 0.5 ? "✿" : "❀";
    petal.style.left = Math.random() * 100 + "vw";
    petal.style.animationDuration = (7 + Math.random() * 8) + "s";
    petal.style.fontSize = (12 + Math.random() * 12) + "px";
    petal.style.opacity = 0.25 + Math.random() * 0.4;

    container.appendChild(petal);

    setTimeout(() => petal.remove(), 16000);
  }

  setInterval(createPetal, 1000);
}


/* =========================================
   3. SCROLL REVEAL
========================================= */

const revealElements = document.querySelectorAll(
  ".letter-card, .photo-card, .reason-card, .music-card"
);

const reducedMotion = window.matchMedia(
  "(prefers-reduced-motion: reduce)"
).matches;

if ("IntersectionObserver" in window && !reducedMotion) {
  revealElements.forEach(element => {
    element.classList.add("reveal");
  });

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  revealElements.forEach(element => observer.observe(element));
} else {
  revealElements.forEach(element => element.classList.add("visible"));
}


/* =========================================
   4. INTERACTIVE REASONS
========================================= */

const reasonCards = document.querySelectorAll(".reason-card");
const reasonMessage = document.getElementById("reasonMessage");

reasonCards.forEach(card => {
  card.addEventListener("click", () => {
    if (!reasonMessage) return;

    reasonMessage.style.opacity = "0";

    setTimeout(() => {
      reasonMessage.textContent = card.dataset.message || "";
      reasonMessage.style.opacity = "1";
    }, 200);
  });
});


/* =========================================
   5. SMOOTH SCROLLING
========================================= */

document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener("click", event => {
    const href = link.getAttribute("href");

    if (!href || href === "#") {
      event.preventDefault();
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    const target = document.querySelector(href);

    if (target) {
      event.preventDefault();
      target.scrollIntoView({ behavior: "smooth" });
    }
  });
});


/* =========================================
   6. SECRET ENVELOPE
========================================= */

const envelopeButton = document.getElementById("envelopeButton");
const secretLetter = document.getElementById("secretLetter");

if (envelopeButton && secretLetter) {
  envelopeButton.addEventListener("click", () => {
    if (envelopeButton.classList.contains("opened")) return;

    envelopeButton.classList.add("opened");

    setTimeout(() => {
      secretLetter.classList.remove("hidden");

      secretLetter.scrollIntoView({
        behavior: "smooth",
        block: "center"
      });
    }, 650);
  });
}


/* =========================================
   7. MUSIC PLAYER
========================================= */

const musicToggle = document.getElementById("musicToggle");
const vinylRecord = document.getElementById("vinylRecord");
const musicProgress = document.getElementById("musicProgress");
const currentTimeDisplay = document.getElementById("currentTime");
const durationDisplay = document.getElementById("duration");

function formatMusicTime(seconds) {
  if (!Number.isFinite(seconds)) return "0:00";

  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);

  return `${minutes}:${String(remainingSeconds).padStart(2, "0")}`;
}

if (music && musicToggle) {
  musicToggle.addEventListener("click", () => {
    if (music.paused) {
      music.play().catch(error => {
        console.warn("Music could not play:", error);
      });
    } else {
      music.pause();
    }
  });

  music.addEventListener("play", () => {
    musicToggle.textContent = "❚❚ Pause";
    vinylRecord?.classList.add("playing");
  });

  music.addEventListener("pause", () => {
    musicToggle.textContent = "▶ Play ♡";
    vinylRecord?.classList.remove("playing");
  });

  music.addEventListener("loadedmetadata", () => {
    if (durationDisplay) {
      durationDisplay.textContent = formatMusicTime(music.duration);
    }
  });

  music.addEventListener("timeupdate", () => {
    if (musicProgress && music.duration > 0) {
      musicProgress.value = (music.currentTime / music.duration) * 100;
    }

    if (currentTimeDisplay) {
      currentTimeDisplay.textContent = formatMusicTime(music.currentTime);
    }
  });

  music.addEventListener("ended", () => {
    if (musicProgress) musicProgress.value = 0;
    if (currentTimeDisplay) currentTimeDisplay.textContent = "0:00";
  });
}

if (music && musicProgress) {
  musicProgress.addEventListener("input", () => {
    if (music.duration > 0) {
      music.currentTime = (musicProgress.value / 100) * music.duration;
    }
  });
}

/* =========================================
   8. SONG LYRICS
========================================= */

const lyricCues = [
  { time: 9.53, text: "I wake up exhausted, even in the morning" },
  { time: 13.25, text: "Like I'm made out of decaf, I'm barely runnin'" },
  { time: 17.02, text: "Oh, and I hate parties, it's just too many bodies" },
  { time: 20.37, text: "I don't like small talk, I'm always leavin' early" },
  { time: 24.20, text: "Then I met you and my eyes changed" },
  { time: 27.99, text: "And now you're in my eye range, I'm gunnin' for you" },
  { time: 31.25, text: "You changed my heart in a big way" },
  { time: 34.99, text: "Now every day's a celebration and I wanna say" },
  { time: 38.59, text: "When you're around, it's already alright" },
  { time: 41.65, text: "Already alright, like a radio" },
  { time: 44.74, text: "I'm tunin' into you (I'm tunin' into you)" },
  { time: 48.14, text: "You're turnin' me on (you're turnin' me on)" },
  { time: 53.34, text: "And I'm my own person, not like I need protection" },
  { time: 56.74, text: "It's just that I wanna change and go in your direction" },
  { time: 60.38, text: "God, you're a laser beam, you're all my teen dreams" },
  { time: 64.04, text: "And if I knew you in school, you'd be too cool for me" },
  { time: 67.81, text: "Then I met you and my eyes changed" },
  { time: 71.57, text: "And now you're in my eye range, I'm gunnin' for you" },
  { time: 75.02, text: "You changed my heart in a big way" },
  { time: 78.52, text: "Now every day's a celebration and I wanna say" },
  { time: 82.24, text: "When you're around, it's already alright" },
  { time: 85.26, text: "Already alright, like a radio" },
  { time: 88.37, text: "I'm tunin' into you (I'm tunin' into you)" },
  { time: 91.69, text: "You're turnin' me on (you're turnin' me on)" },
  { time: 96.78, text: "You make me feel like I could dance all night" },
  { time: 99.72, text: "Already all night, like a live wire" },
  { time: 102.82, text: "I'm always louder with you (I'm always louder with you)" },
  { time: 106.18, text: "Keep turnin' me on (keep turnin' me on)" },
  { time: 111.58, text: "Up, up, up, up" },
  { time: 113.40, text: "When I get down, when I get down, when I get" },
  { time: 118.80, text: "Up, up, up, up" },
  { time: 120.86, text: "When I get down, when I get down, when I (ow!)" },
  { time: 125.93, text: "When you're around, it's already alright" },
  { time: 128.86, text: "Already alright, like a radio" },
  { time: 131.92, text: "I'm tunin' into you (I'm tunin' into you)" },
  { time: 135.35, text: "You're turnin' me on (you're turnin' me on)" },
  { time: 140.36, text: "You make me feel like I could dance all night" },
  { time: 143.48, text: "Already all night, like a live wire" },
  { time: 146.57, text: "I'm always louder with you (I'm always louder with you)" },
  { time: 149.86, text: "Keep turnin' me on (keep turnin' me on)" },
  { time: 154.97, text: "When you're around, it's already alright (keep turnin' me up, up, keep turnin' me)" },
  { time: 158.06, text: "Already alright, like a radio (keep turnin' me up, up, keep turnin' me)" },
  { time: 161.02, text: "I'm tunin' into you (I'm tunin' into you)" },
  { time: 164.21, text: "You're turnin' me on (you're turnin' me on)" },
  { time: 169.25, text: "You make me feel like I could dance all night (keep turnin' me up, up, keep turnin' me)" },
  { time: 172.44, text: "Already all night, like a live wire (keep turnin' me up, up, keep turnin' me)" },
  { time: 175.68, text: "I'm always louder with you (I'm always louder with you)" },
  { time: 178.95, text: "Keep turnin' me on (keep turnin' me on)" },
  { time: 184.09, text: "When you're around, it's already alright" },
  { time: 186.92, text: "Already alright, like a radio" },
  { time: 190.18, text: "I'm tunin' into you (I'm tunin' into you)" },
  { time: 193.23, text: "You're turnin' me on (you're turnin' me)" }
];

/* =========================================
   9. FLOATING LYRICS OVERLAY
   Created entirely by JavaScript
========================================= */

const caption = document.createElement("div");
caption.id = "song-caption-overlay";
document.body.appendChild(caption);

const captionStyle = document.createElement("style");

captionStyle.textContent = `
  #song-caption-overlay {
    position: fixed !important;
    left: 50% !important;
    bottom: 9% !important;
    transform: translate(-50%, 18px) !important;
    width: min(88%, 650px) !important;
    box-sizing: border-box !important;
    padding: 16px 22px !important;
    z-index: 2147483647 !important;
    background: rgba(36, 59, 83, 0.96) !important;
    color: #fffefa !important;
    border: 1px solid rgba(255,255,255,.3) !important;
    border-radius: 16px !important;
    box-shadow: 0 8px 35px rgba(0,0,0,.2) !important;
    text-align: center !important;
    font-family: 'Playfair Display', Georgia, serif !important;
    font-size: clamp(17px, 3vw, 24px) !important;
    line-height: 1.5 !important;
    opacity: 0 !important;
    visibility: hidden !important;
    pointer-events: none !important;
    transition: opacity .4s ease, transform .4s ease !important;
  }

  #song-caption-overlay.show {
    opacity: 1 !important;
    visibility: visible !important;
    transform: translate(-50%, 0) !important;
  }

  @media (max-width: 600px) {
    #song-caption-overlay {
      bottom: 8% !important;
      width: 90% !important;
      padding: 12px 15px !important;
      font-size: 17px !important;
    }
  }
`;

document.head.appendChild(captionStyle);

let activeLyricIndex = -1;
let lyricTimeout = null;

function updateFloatingLyrics() {
  if (!music || music.paused || music.ended) {
    caption.classList.remove("show");
    return;
  }

  let nextIndex = -1;

  for (let i = 0; i < lyricCues.length; i++) {
    if (music.currentTime >= lyricCues[i].time) {
      nextIndex = i;
    } else {
      break;
    }
  }

  if (nextIndex === activeLyricIndex) return;

  activeLyricIndex = nextIndex;

  if (lyricTimeout) clearTimeout(lyricTimeout);

  if (nextIndex === -1) {
    caption.classList.remove("show");
    return;
  }

  caption.classList.remove("show");

  lyricTimeout = setTimeout(() => {
    if (!music.paused && activeLyricIndex === nextIndex) {
      caption.textContent = lyricCues[nextIndex].text;
      caption.classList.add("show");
    }
  }, 250);
}

if (music) {
  music.addEventListener("play", updateFloatingLyrics);
  music.addEventListener("timeupdate", updateFloatingLyrics);
  music.addEventListener("seeked", updateFloatingLyrics);

  music.addEventListener("pause", () => {
    caption.classList.remove("show");
  });

  music.addEventListener("ended", () => {
    caption.classList.remove("show");
    activeLyricIndex = -1;
  });
}


/* =========================================
   10. INTERACTIVE SPIDER LILY GARDEN
========================================= */

const lilyGarden = document.getElementById("lilyGarden");
const lilyFlowers = document.querySelectorAll(".lily-flower");
const flowerMessageText = document.getElementById("flowerMessageText");
const gardenDots = document.querySelectorAll(".garden-dot");
const gardenFinalMessage = document.getElementById("gardenFinalMessage");

const flowerMessages = [
  "Even on ordinary days, you have a way of making things feel a little more beautiful. ♡",
  "I hope you never forget how lovely you are, even on the days you don't feel that way.",
  "If I could give you flowers every day, I'd still find a reason to bring you one more."
];

const openedFlowers = new Set();

function openLilyFlower(flower) {
  const index = Number(flower.dataset.flower);

  if (!Number.isInteger(index) || !flowerMessages[index]) return;

  if (openedFlowers.has(index)) {
    if (flowerMessageText) {
      flowerMessageText.textContent = flowerMessages[index];
    }
    return;
  }

  openedFlowers.add(index);
  flower.classList.add("bloomed");

  if (flowerMessageText) {
    flowerMessageText.textContent = flowerMessages[index];
  }

  if (gardenDots[index]) {
    gardenDots[index].classList.add("active");
  }

  if (openedFlowers.size === 3 && gardenFinalMessage) {
    gardenFinalMessage.classList.remove("hidden");
  }
}

lilyFlowers.forEach(flower => {
  flower.addEventListener("click", () => openLilyFlower(flower));

  flower.addEventListener("keydown", event => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      openLilyFlower(flower);
    }
  });
});


/* =========================================
   11. DRAG TO ROTATE FLOWER GARDEN
========================================= */

if (lilyGarden) {
  let dragging = false;
  let previousX = 0;
  let rotationY = 0;
  const rotationX = 5;

  lilyGarden.addEventListener("pointerdown", event => {
    if (event.target.closest(".lily-flower")) return;

    dragging = true;
    previousX = event.clientX;
    lilyGarden.classList.add("dragging");
  });

  document.addEventListener("pointermove", event => {
    if (!dragging) return;

    const movementX = event.clientX - previousX;

    rotationY += movementX * 0.65;
    rotationY = Math.max(-50, Math.min(50, rotationY));

    lilyGarden.style.transform =
      `rotateX(${rotationX}deg) rotateY(${rotationY}deg)`;

    previousX = event.clientX;
  });

  function stopDragging() {
    dragging = false;
    lilyGarden.classList.remove("dragging");
  }

  document.addEventListener("pointerup", stopDragging);
  document.addEventListener("pointercancel", stopDragging);
}


console.log("A little world for Elly is ready. ♡");
