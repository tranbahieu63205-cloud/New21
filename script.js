/* ==================================================
   HieuDev Portfolio v2
   script.js
================================================== */

"use strict";

const CONFIG = {
  name: "Trần Bá Hiếu",
  role: "Student & Developer",
  bio: "Yêu thích lập trình và thiết kế website.",
  socials: {
    facebook: "https://www.facebook.com/HjeuDepZaiii",
    tiktok: "https://www.tiktok.com/@hieudepzaii_63",
    telegram: "https://t.me/HjeuDepZaii63",
    instagram: "https://www.instagram.com/hjeudepzaiii"
  },
  gallery: [
    { src: "gallery-1.jpg", title: "Album 01", caption: "Khoảnh khắc đầu tiên trong album." },
    { src: "gallery-2.jpg", title: "Album 02", caption: "Một góc ảnh khác trong bộ sưu tập." },
    { src: "gallery-3.jpg", title: "Album 03", caption: "Ảnh thứ ba trong album của mình." }
  ],
  music: {
    title: "China Pipa x Gong Xi Thazh",
    artist: "Trần Bá Hiếu",
    file: "music.mp3",
    cover: "avatar.jpg"
  },
  donate: {
    bank: "MB Bank",
    owner: "TRAN BA HIEU",
    account: "123456789990",
    content: "HieuDev",
    qr: "qr-bank.jpg"
  }
};

const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => Array.from(root.querySelectorAll(selector));

document.addEventListener("DOMContentLoaded", () => {
  const body = document.body;
  const html = document.documentElement;

  const loader = $("#loader");
  const header = $(".site-header");
  const nav = $("#siteNav");
  const menuButton = $("#menuButton");
  const themeButton = $("#themeButton");
  const year = $("#year");
  const backToTop = $("#backToTop");
  const toast = $("#toast");

  const musicCover = $("#musicCover");
  const trackTitle = $("#trackTitle");
  const trackArtist = $("#trackArtist");
  const audio = $("#audio");
  const playBtn = $("#playBtn");
  const loopBtn = $("#loopBtn");
  const muteBtn = $("#muteBtn");
  const progress = $("#progress");
  const currentTime = $("#currentTime");
  const duration = $("#duration");
  const volume = $("#volume");
  const copyAccount = $("#copyAccount");
  const bankOwner = $("#bankOwner");
  const accountNumber = $("#accountNumber");

  const lightbox = $("#lightbox");
  const lightboxImage = $("#lightboxImage");
  const lightboxCaption = $("#lightboxCaption");
  const lightboxCounter = $("#lightboxCounter");
  const lightboxClose = $("#lightboxClose");
  const lightboxPrev = $("#lightboxPrev");
  const lightboxNext = $("#lightboxNext");
  const galleryGrid = $("#galleryGrid");

  const fadeInObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        fadeInObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  $$(".reveal").forEach((el) => fadeInObserver.observe(el));

  // Apply config data
  $$(".social-pill[data-social], .contact-card[data-social]").forEach((link) => {
    const key = link.dataset.social;
    if (CONFIG.socials[key]) link.href = CONFIG.socials[key];
  });

  if (musicCover) musicCover.src = CONFIG.music.cover;
  if (trackTitle) trackTitle.textContent = CONFIG.music.title;
  if (trackArtist) trackArtist.textContent = CONFIG.music.artist;
  if (audio) {
    audio.src = CONFIG.music.file;
    audio.load();
    audio.volume = Number(localStorage.getItem("hievdev-volume") || 0.8);
  }

  if (bankOwner) bankOwner.textContent = CONFIG.donate.owner;
  if (accountNumber) accountNumber.textContent = CONFIG.donate.account;
  const qrImg = $(".donate-qr img");
  if (qrImg) qrImg.src = CONFIG.donate.qr;

  if (year) year.textContent = String(new Date().getFullYear());

  // Gallery render
  const galleryMarkup = CONFIG.gallery.map((item, index) => `
    <button class="gallery-item reveal" type="button" data-index="${index}" aria-label="${item.title}">
      <img src="${item.src}" alt="${item.title}">
    </button>
  `).join("");

  if (galleryGrid) {
    galleryGrid.innerHTML = galleryMarkup;
    $$(".reveal", galleryGrid).forEach((el) => fadeInObserver.observe(el));
  }

  const galleryItems = $$(".gallery-item");
  let currentGalleryIndex = 0;

  function openLightbox(index) {
    currentGalleryIndex = index;
    const item = CONFIG.gallery[index];
    if (!item) return;
    lightboxImage.src = item.src;
    lightboxImage.alt = item.title;
    lightboxCaption.textContent = item.caption;
    lightboxCounter.textContent = `${index + 1} / ${CONFIG.gallery.length}`;
    lightbox.classList.add("is-open");
    lightbox.setAttribute("aria-hidden", "false");
    document.body.classList.add("no-scroll");
  }

  function closeLightbox() {
    lightbox.classList.remove("is-open");
    lightbox.setAttribute("aria-hidden", "true");
    document.body.classList.remove("no-scroll");
  }

  function nextImage() {
    currentGalleryIndex = (currentGalleryIndex + 1) % CONFIG.gallery.length;
    openLightbox(currentGalleryIndex);
  }

  function prevImage() {
    currentGalleryIndex = (currentGalleryIndex - 1 + CONFIG.gallery.length) % CONFIG.gallery.length;
    openLightbox(currentGalleryIndex);
  }

  galleryItems.forEach((item) => {
    item.addEventListener("click", () => openLightbox(Number(item.dataset.index)));
  });

  lightboxClose.addEventListener("click", closeLightbox);
  lightboxPrev.addEventListener("click", prevImage);
  lightboxNext.addEventListener("click", nextImage);
  lightbox.addEventListener("click", (e) => {
    if (e.target === lightbox) closeLightbox();
  });

  // Swipe
  let touchStartX = 0;
  let touchEndX = 0;
  lightbox.addEventListener("touchstart", (e) => {
    touchStartX = e.changedTouches[0].clientX;
  }, { passive: true });
  lightbox.addEventListener("touchend", (e) => {
    touchEndX = e.changedTouches[0].clientX;
    const delta = touchStartX - touchEndX;
    if (Math.abs(delta) > 50) {
      delta > 0 ? nextImage() : prevImage();
    }
  }, { passive: true });

  // Keyboard for lightbox & general hotkeys
  document.addEventListener("keydown", (e) => {
    if (lightbox.classList.contains("is-open")) {
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowRight") nextImage();
      if (e.key === "ArrowLeft") prevImage();
    }
    if (e.key === " " && document.activeElement.tagName !== "INPUT" && document.activeElement.tagName !== "BUTTON") {
      e.preventDefault();
      togglePlay();
    }
  });

  // Theme
  const savedTheme = localStorage.getItem("hievdev-theme") || "dark";
  function applyTheme(theme) {
    body.setAttribute("data-theme", theme);
    localStorage.setItem("hievdev-theme", theme);
    themeButton.setAttribute("aria-pressed", theme === "light" ? "true" : "false");
    themeButton.setAttribute("aria-label", theme === "light" ? "Chuyển sang giao diện tối" : "Chuyển sang giao diện sáng");
    html.style.colorScheme = theme;
  }
  applyTheme(savedTheme);

  themeButton.addEventListener("click", () => {
    const nextTheme = body.getAttribute("data-theme") === "light" ? "dark" : "light";
    applyTheme(nextTheme);
    showToast(nextTheme === "light" ? "Đã chuyển sang giao diện sáng" : "Đã chuyển sang giao diện tối");
  });

  // Menu
  function closeMenu() {
    nav.classList.remove("is-open");
    menuButton.setAttribute("aria-expanded", "false");
  }
  menuButton.addEventListener("click", () => {
    const opened = nav.classList.toggle("is-open");
    menuButton.setAttribute("aria-expanded", opened ? "true" : "false");
  });
  $$("#siteNav a").forEach((link) => link.addEventListener("click", () => {
    if (window.innerWidth <= 880) closeMenu();
  }));

  // Header scroll state / back to top
  function handleScrollUi() {
    const y = window.scrollY;
    header.classList.toggle("is-scrolled", y > 10);
    backToTop.classList.toggle("is-visible", y > 500);
  }
  window.addEventListener("scroll", handleScrollUi, { passive: true });
  handleScrollUi();

  backToTop.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  // Loader
  const hideLoader = () => {
    if (!loader) return;
    loader.classList.add("is-hidden");
    setTimeout(() => loader.remove(), 500);
  };
  window.addEventListener("load", () => setTimeout(hideLoader, 600));
  setTimeout(hideLoader, 2600);

  // Audio
  function formatTime(seconds) {
    if (!isFinite(seconds) || seconds < 0) return "00:00";
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  }

  function syncPlayUi(isPlaying) {
    playBtn.classList.toggle("is-playing", isPlaying);
    playBtn.setAttribute("aria-label", isPlaying ? "Tạm dừng nhạc" : "Phát nhạc");
    musicCover.classList.toggle("is-playing", isPlaying);
    if (isPlaying) {
      loopBtn.classList.toggle("is-active", audio.loop);
      muteBtn.classList.toggle("is-active", audio.muted);
    }
  }

  function togglePlay() {
    if (audio.paused) {
      audio.play().catch(() => {});
    } else {
      audio.pause();
    }
  }

  playBtn.addEventListener("click", togglePlay);

  loopBtn.addEventListener("click", () => {
    audio.loop = !audio.loop;
    loopBtn.classList.toggle("is-active", audio.loop);
    loopBtn.setAttribute("aria-pressed", audio.loop ? "true" : "false");
    showToast(audio.loop ? "Đã bật chế độ lặp" : "Đã tắt chế độ lặp");
  });

  muteBtn.addEventListener("click", () => {
    audio.muted = !audio.muted;
    muteBtn.classList.toggle("is-active", audio.muted);
    muteBtn.setAttribute("aria-pressed", audio.muted ? "true" : "false");
    muteBtn.setAttribute("aria-label", audio.muted ? "Bật tiếng" : "Tắt tiếng");
    showToast(audio.muted ? "Đã tắt tiếng" : "Đã bật tiếng");
  });

  audio.addEventListener("play", () => syncPlayUi(true));
  audio.addEventListener("pause", () => syncPlayUi(false));

  audio.addEventListener("loadedmetadata", () => {
    duration.textContent = formatTime(audio.duration);
  });

  audio.addEventListener("timeupdate", () => {
    if (!audio.duration) return;
    const percent = (audio.currentTime / audio.duration) * 100;
    progress.value = String(percent);
    currentTime.textContent = formatTime(audio.currentTime);
    duration.textContent = formatTime(audio.duration);
  });

  progress.addEventListener("input", () => {
    if (!audio.duration) return;
    audio.currentTime = (Number(progress.value) / 100) * audio.duration;
  });

  volume.addEventListener("input", () => {
    audio.volume = Number(volume.value);
    audio.muted = audio.volume === 0;
    muteBtn.classList.toggle("is-active", audio.muted);
    muteBtn.setAttribute("aria-pressed", audio.muted ? "true" : "false");
    muteBtn.setAttribute("aria-label", audio.muted ? "Bật tiếng" : "Tắt tiếng");
    localStorage.setItem("hievdev-volume", String(audio.volume));
  });

  const storedVolume = localStorage.getItem("hievdev-volume");
  if (storedVolume !== null) {
    audio.volume = Number(storedVolume);
  }
  volume.value = String(audio.volume);

  if (audio.volume === 0) {
    audio.muted = true;
    muteBtn.classList.add("is-active");
    muteBtn.setAttribute("aria-pressed", "true");
    muteBtn.setAttribute("aria-label", "Bật tiếng");
  }

  // Copy account
  copyAccount.addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText(CONFIG.donate.account);
      showToast("Đã sao chép số tài khoản");
    } catch {
      const temp = document.createElement("textarea");
      temp.value = CONFIG.donate.account;
      document.body.appendChild(temp);
      temp.select();
      document.execCommand("copy");
      temp.remove();
      showToast("Đã sao chép số tài khoản");
    }
  });

  // Smooth close menu on outside click (mobile)
  document.addEventListener("click", (e) => {
    if (window.innerWidth <= 880 && nav.classList.contains("is-open")) {
      const isNav = nav.contains(e.target);
      const isBtn = menuButton.contains(e.target);
      if (!isNav && !isBtn) closeMenu();
    }
  });

  // Toast
  let toastTimer;
  function showToast(message) {
    toast.textContent = message;
    toast.classList.add("is-show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove("is-show"), 2400);
  }

  // Initial UI sync
  syncPlayUi(false);

  // Store scroll position for reload consistency
  window.addEventListener("beforeunload", () => {
    localStorage.setItem("hievdev-scroll", String(window.scrollY));
  });
  const savedScroll = Number(localStorage.getItem("hievdev-scroll") || 0);
  if (savedScroll > 0) {
    window.scrollTo({ top: savedScroll, behavior: "auto" });
  }
});
