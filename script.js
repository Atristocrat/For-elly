
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
{ time: 28.93, text: "I'm findin' ways to articulate the feeling I'm goin' through" },
  { time: 33.75, text: "I just can't say I don't love you (yeah)" },
  { time: 38.80, text: "'Cause I love you, yeah" },
  { time: 43.21, text: "It's hard for me to communicate the thoughts that I hold" },
  { time: 47.14, text: "But tonight, I'm gon' let you know" },
  { time: 49.80, text: "Let me tell the truth" },
  { time: 52.74, text: "Baby, let me tell the truth, yeah" },
  { time: 57.02, text: "You know what I'm thinkin', see it in your eyes" },
  { time: 60.67, text: "You hate that you want me, hate it when you cry" },
  { time: 64.21, text: "You're scared to be lonely, especially in the night" },
  { time: 67.83, text: "I'm scared that I'll miss you, happens every time" },
  { time: 71.32, text: "I don't want this feelin', I can't afford love" },
  { time: 75.03, text: "I try to find a reason to pull us apart" },
  { time: 78.51, text: "It ain't workin' 'cause you're perfect" },
  { time: 80.45, text: "And I know that you're worth it" },
  { time: 82.38, text: "I can't walk away, (oh)" },
  { time: 85.90, text: "Even though we're going through it" },
  { time: 89.38, text: "And it makes you feel alone" },
  { time: 91.78, text: "Just know that I would die for you" },
  { time: 95.75, text: "Baby, I would die for you, yeah" },
  { time: 100.04, text: "The distance and the time between us" },
  { time: 103.79, text: "It'll never change my mind" },
  { time: 106.24, text: "'Cause baby, I would die for you" },
  { time: 110.01, text: "Baby, I would die for you, yeah" },
  { time: 114.69, text: "I'm finding ways to manipulate the feelin' you're going through" },
  { time: 119.55, text: "But baby-girl, I'm not blaming you" },
  { time: 124.72, text: "Just don't blame me too, yeah" },
  { time: 129.22, text: "'Cause I can't take this pain forever" },
  { time: 132.74, text: "And you won't find no one that's better" },
  { time: 135.88, text: "'Cause I'm right for you, babe" },
  { time: 138.95, text: "I think I'm right for you, babe" },
  { time: 142.98, text: "You know what I'm thinking, see it in your eyes" },
  { time: 146.64, text: "You hate that you want me, hate it when you cry" },
  { time: 150.24, text: "It ain't workin' 'cause you're perfect" },
  { time: 152.30, text: "And I know that you're worth it" },
  { time: 153.89, text: "I can't walk away" },
  { time: 157.46, text: "Even though we're going through it" },
  { time: 160.94, text: "And it makes you feel alone" },
  { time: 163.31, text: "Just know that I would die for you" },
  { time: 167.33, text: "Baby, I would die for you, yeah" },
  { time: 171.56, text: "The distance and the time between us" },
  { time: 175.15, text: "It'll never change my mind" },
  { time: 177.75, text: "'Cause baby, I would die for you" },
  { time: 181.70, text: "Baby, I would die for you, yeah" },
  { time: 186.06, text: "I would die for you, I would lie for you" },
  { time: 189.50, text: "Keep it real with you, I would kill for you, my baby" },
  { time: 196.59, text: "I'm just sayin', yeah" },
  { time: 200.36, text: "I would die for you, I would lie for you" },
  { time: 203.88, text: "Keep it real with you, I would kill for you, my baby" },
  { time: 210.67, text: "Na, na, na, na, na, na, na, na" },
  { time: 215.02, text: "Even though we're going through it" },
  { time: 218.32, text: "And it makes you feel alone" },
  { time: 220.87, text: "Just know that I would die for you" },
  { time: 224.76, text: "Baby, I would die for you, yeah" },
  { time: 229.04, text: "The distance and the time between us" },
  { time: 232.46, text: "It'll never change my mind" },
  { time: 235.11, text: "'Cause baby, I would die for you" },
  { time: 239.06, text: "Baby, I would die for you, yeah" },
  { time: 243.58, text: "Die for you" },
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
