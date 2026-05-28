const note = document.querySelector(".contact-note");
const panel = document.querySelector(".contact-panel");
const closeButton = document.querySelector(".panel-close");
const currentPage = document.body.dataset.page;

function setPanel(open) {
  if (!note || !panel) return;
  note.setAttribute("aria-expanded", String(open));
  panel.classList.toggle("is-open", open);
  panel.setAttribute("aria-hidden", String(!open));
}

note?.addEventListener("click", () => {
  setPanel(note.getAttribute("aria-expanded") !== "true");
});

note?.addEventListener("keydown", (event) => {
  if (event.key !== "Enter" && event.key !== " ") return;
  event.preventDefault();
  setPanel(note.getAttribute("aria-expanded") !== "true");
});

closeButton?.addEventListener("click", () => setPanel(false));

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") setPanel(false);
});

function isCurrentNav(link) {
  return link.dataset.nav === currentPage;
}

document.querySelectorAll(".pill-nav a[data-nav]").forEach((link) => {
  if (isCurrentNav(link)) {
    link.setAttribute("aria-current", "page");
  }

  link.addEventListener("pointerdown", (event) => {
    if (!isCurrentNav(link)) return;
    event.preventDefault();
  });

  link.addEventListener("click", (event) => {
    if (!isCurrentNav(link)) return;
    event.preventDefault();
    link.blur();
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
});

const scrollScaleFrames = Array.from(document.querySelectorAll(".frame"));
let frameScaleTicking = false;

function updateFrameScale() {
  frameScaleTicking = false;

  scrollScaleFrames.forEach((frame) => {
    const end = frame.offsetTop || 1;
    const progress = Math.min(Math.max(window.scrollY / end, 0), 1);
    const scale = 0.8 + progress * 0.2;
    frame.style.setProperty("--frame-scale", scale.toFixed(4));
  });
}

function requestFrameScaleUpdate() {
  if (!scrollScaleFrames.length || frameScaleTicking) return;
  frameScaleTicking = true;
  requestAnimationFrame(updateFrameScale);
}

updateFrameScale();
window.addEventListener("scroll", requestFrameScaleUpdate, { passive: true });
window.addEventListener("resize", requestFrameScaleUpdate);

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.16 }
);

document.querySelectorAll(".reveal").forEach((element) => observer.observe(element));
