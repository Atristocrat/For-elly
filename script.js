
/* ==================================
   FOR ELLY, WITH LOVE
   Interactive experience
================================== */

// 1. OPENING SCREEN

const openButton = document.getElementById("openButton");
const opening = document.getElementById("opening");
const mainContent = document.getElementById("mainContent");

openButton.addEventListener("click", () => {
      const backgroundMusic = document.getElementById("backgroundMusic");

  backgroundMusic.volume = 0.35;

  backgroundMusic.play().catch(error => {
    console.log("Music could not start:", error);
  });
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


// 2. FLOATING ROSE PETALS

function startPetals() {
  const petalContainer = document.createElement("div");
  petalContainer.className = "petal-container";
  document.body.appendChild(petalContainer);

  const reducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  if (reducedMotion) return;

  function createPetal() {
    const petal = document.createElement("span");
    petal.className = "petal";
    petal.textContent = Math.random() > 0.5 ? "✿" : "❀";
    petal.style.left = Math.random() * 100 + "vw";
    petal.style.animationDuration = (7 + Math.random() * 8) + "s";
    petal.style.fontSize = (12 + Math.random() * 12) + "px";
    petal.style.opacity = (0.25 + Math.random() * 0.4);

    petalContainer.appendChild(petal);

    setTimeout(() => {
      petal.remove();
    }, 16000);
  }

  setInterval(createPetal, 1000);
}


// 3. SCROLL REVEAL ANIMATIONS

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

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.15
  });

  revealElements.forEach(element => {
    observer.observe(element);
  });

} else {
  revealElements.forEach(element => {
    element.classList.add("visible");
  });
}


// 4. INTERACTIVE REASONS

const reasonCards = document.querySelectorAll(".reason-card");
const reasonMessage = document.getElementById("reasonMessage");

reasonCards.forEach(card => {
  card.addEventListener("click", () => {
    const message = card.dataset.message;

    reasonMessage.style.opacity = "0";

    setTimeout(() => {
      reasonMessage.textContent = message;
      reasonMessage.style.opacity = "1";
    }, 200);
  });
});


// 5. SMOOTH SCROLLING

document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener("click", event => {
    const target = document.querySelector(
      link.getAttribute("href")
    );

    if (target) {
      event.preventDefault();

      target.scrollIntoView({
        behavior: "smooth"
      });
    }
  });
});


// 6. PHOTO LIGHTBOX

const galleryPhotos = Array.from(
  document.querySelectorAll(".photo-card img")
);

let currentPhotoIndex = 0;

// Create the lightbox

const lightbox = document.createElement("div");
lightbox.className = "lightbox";
lightbox.setAttribute("role", "dialog");
lightbox.setAttribute("aria-modal", "true");
lightbox.setAttribute("aria-label", "Photo gallery");

lightbox.innerHTML = `
  <button class="lightbox-close" aria-label="Close photo viewer">&times;</button>

  <button class="lightbox-prev" aria-label="Previous photo">&#10094;</button>

  <div class="lightbox-content">
    <img class="lightbox-image" src="" alt="">
    <p class="lightbox-caption"></p>
    <span class="lightbox-counter"></span>
  </div>

  <button class="lightbox-next" aria-label="Next photo">&#10095;</button>
`;

document.body.appendChild(lightbox);

const lightboxImage = lightbox.querySelector(".lightbox-image");
const lightboxCaption = lightbox.querySelector(".lightbox-caption");
const lightboxCounter = lightbox.querySelector(".lightbox-counter");

const closeButton = lightbox.querySelector(".lightbox-close");
const previousButton = lightbox.querySelector(".lightbox-prev");
const nextButton = lightbox.querySelector(".lightbox-next");

function showPhoto(index) {
  currentPhotoIndex =
    (index + galleryPhotos.length) % galleryPhotos.length;

  const photo = galleryPhotos[currentPhotoIndex];
  const caption = photo.closest(".photo-card").querySelector("figcaption");

  lightboxImage.src = photo.src;
  lightboxImage.alt = photo.alt;
  lightboxCaption.textContent = caption.textContent;
  lightboxCounter.textContent =
    `${currentPhotoIndex + 1} / ${galleryPhotos.length}`;
}

function openLightbox(index) {
  showPhoto(index);
  lightbox.classList.add("active");
  document.body.style.overflow = "hidden";
  closeButton.focus();
}

function closeLightbox() {
  lightbox.classList.remove("active");
  document.body.style.overflow = "";
}

galleryPhotos.forEach((photo, index) => {
  photo.style.cursor = "zoom-in";
  photo.tabIndex = 0;
  photo.setAttribute("role", "button");
  photo.setAttribute("aria-label", "Open photo " + (index + 1));

  photo.addEventListener("click", () => {
    openLightbox(index);
  });

  photo.addEventListener("keydown", event => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      openLightbox(index);
    }
  });
});

previousButton.addEventListener("click", () => {
  showPhoto(currentPhotoIndex - 1);
});

nextButton.addEventListener("click", () => {
  showPhoto(currentPhotoIndex + 1);
});

closeButton.addEventListener("click", closeLightbox);

// Close when clicking outside the photograph

lightbox.addEventListener("click", event => {
  if (event.target === lightbox) {
    closeLightbox();
  }
});

// Keyboard controls

document.addEventListener("keydown", event => {
  if (!lightbox.classList.contains("active")) return;

  if (event.key === "Escape") {
    closeLightbox();
  }

  if (event.key === "ArrowLeft") {
    showPhoto(currentPhotoIndex - 1);
  }

  if (event.key === "ArrowRight") {
    showPhoto(currentPhotoIndex + 1);
  }
});

console.log("A little world for Elly is ready. ♡");


/* ==================================
   7. SECRET ENVELOPE
================================== */

const envelopeButton = document.getElementById("envelopeButton");
const secretLetter = document.getElementById("secretLetter");

envelopeButton.addEventListener("click", () => {

  envelopeButton.classList.add("opened");

  setTimeout(() => {

    secretLetter.classList.remove("hidden");

    secretLetter.scrollIntoView({
      behavior: "smooth",
      block: "center"
    });

  }, 650);

});


// =========================
// MUSIC PLAYER CONTROLS
// =========================

const music = document.getElementById("backgroundMusic");
const musicToggle = document.getElementById("musicToggle");
const vinylRecord = document.getElementById("vinylRecord");
const musicProgress = document.getElementById("musicProgress");
const currentTimeDisplay = document.getElementById("currentTime");
const durationDisplay = document.getElementById("duration");

// Format seconds into minutes and seconds
function formatMusicTime(seconds) {
  if (!Number.isFinite(seconds)) return "0:00";

  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);

  return `${minutes}:${String(remainingSeconds).padStart(2, "0")}`;
}

// Play and pause
musicToggle.addEventListener("click", () => {
  if (music.paused) {
    music.play().catch(error => {
      console.log("Music could not play:", error);
    });
  } else {
    music.pause();
  }
});

// Update button and vinyl appearance
music.addEventListener("play", () => {
  musicToggle.textContent = "❚❚ Pause";
  vinylRecord.classList.add("playing");
});

music.addEventListener("pause", () => {
  musicToggle.textContent = "▶ Play ♡";
  vinylRecord.classList.remove("playing");
});

// Show song duration
music.addEventListener("loadedmetadata", () => {
  durationDisplay.textContent = formatMusicTime(music.duration);
});

// Update progress bar and current time
music.addEventListener("timeupdate", () => {
  if (Number.isFinite(music.duration) && music.duration > 0) {
    musicProgress.value = (music.currentTime / music.duration) * 100;
  }

  currentTimeDisplay.textContent = formatMusicTime(music.currentTime);
});

// Allow dragging the progress bar
musicProgress.addEventListener("input", () => {
  if (Number.isFinite(music.duration) && music.duration > 0) {
    music.currentTime = (musicProgress.value / 100) * music.duration;
  }
});

// Reset when the song ends
music.addEventListener("ended", () => {
  musicProgress.value = 0;
  currentTimeDisplay.textContent = "0:00";
});


// =========================
// SYNCHRONIZED FLOATING LYRICS
// =========================

const floatingLyrics = document.getElementById("floatingLyrics");
const lyricText = document.getElementById("lyricText");

// Original placeholder lines.
// Replace these with your own original messages and timestamps.

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
  { time: 154.97, text: "When you're around, it's already alright" },
  { time: 158.06, text: "Already alright, like a radio" },
  { time: 161.02, text: "I'm tunin' into you (I'm tunin' into you)" },
  { time: 164.21, text: "You're turnin' me on (you're turnin' me on)" },
  { time: 169.25, text: "You make me feel like I could dance all night" },
  { time: 172.44, text: "Already all night, like a live wire" },
  { time: 175.68, text: "I'm always louder with you (I'm always louder with you)" },
  { time: 178.95, text: "Keep turnin' me on (keep turnin' me on)" },
  { time: 184.09, text: "When you're around, it's already alright" },
  { time: 186.92, text: "Already alright, like a radio" },
  { time: 190.18, text: "I'm tunin' into you (I'm tunin' into you)" },
  { time: 193.23, text: "You're turnin' me on (you're turnin' me)" }
];


let activeLyricIndex = -1;

function updateFloatingLyrics() {
  if (!music || !floatingLyrics || !lyricText) return;

  if (music.paused || music.ended) {
    floatingLyrics.classList.remove("visible");
    activeLyricIndex = -1;
    return;
  }

  const currentSongTime = music.currentTime;

  let nextIndex = -1;

  for (let i = 0; i < lyricCues.length; i++) {
    if (currentSongTime >= lyricCues[i].time) {
      nextIndex = i;
    } else {
      break;
    }
  }

  if (nextIndex !== activeLyricIndex) {
    activeLyricIndex = nextIndex;

    if (nextIndex === -1) {
      floatingLyrics.classList.remove("visible");
      return;
    }

    floatingLyrics.classList.remove("visible");

    setTimeout(() => {
      if (
        !music.paused &&
        activeLyricIndex === nextIndex
      ) {
        lyricText.textContent = lyricCues[nextIndex].text;
        floatingLyrics.classList.add("visible");
      }
    }, 350);
  }
}

music.addEventListener("timeupdate", updateFloatingLyrics);
music.addEventListener("play", updateFloatingLyrics);
music.addEventListener("pause", updateFloatingLyrics);
music.addEventListener("seeked", updateFloatingLyrics);


/* ==========================================
   INTERACTIVE SPIDER LILY GARDEN
========================================== */

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

/* FLOWER INTERACTIONS */

function openLilyFlower(flower) {
  const index = Number(flower.dataset.flower);

  if (openedFlowers.has(index)) {
    flowerMessageText.textContent = flowerMessages[index];
    return;
  }

  openedFlowers.add(index);
  flower.classList.add("bloomed");

  flowerMessageText.textContent = flowerMessages[index];

  if (gardenDots[index]) {
    gardenDots[index].classList.add("active");
  }

  if (openedFlowers.size === 3) {
    gardenFinalMessage.classList.remove("hidden");
  }
}

lilyFlowers.forEach((flower) => {
  flower.addEventListener("click", () => {
    openLilyFlower(flower);
  });

  flower.addEventListener("keydown", (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      openLilyFlower(flower);
    }
  });
});

/* DRAG TO ROTATE */

if (lilyGarden) {
  let dragging = false;
  let previousX = 0;
  let rotationY = 0;
  let rotationX = 5;

  lilyGarden.addEventListener("pointerdown", (event) => {
    dragging = true;
    previousX = event.clientX;
    lilyGarden.classList.add("dragging");
  });

  document.addEventListener("pointermove", (event) => {
    if (!dragging) return;

    const movementX = event.clientX - previousX;

    rotationY += movementX * 0.65;
    rotationY = Math.max(-50, Math.min(50, rotationY));

    lilyGarden.style.transform =
      `rotateX(${rotationX}deg) rotateY(${rotationY}deg)`;

    previousX = event.clientX;
  });

  document.addEventListener("pointerup", () => {
    dragging = false;
    lilyGarden.classList.remove("dragging");
  });

  document.addEventListener("pointercancel", () => {
    dragging = false;
    lilyGarden.classList.remove("dragging");
  });
}
