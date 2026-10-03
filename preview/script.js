// 1) Deploy the Apps Script code from apps-script.gs as a Web App.
// 2) Paste the /exec URL below.
const APPS_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbw9PUaCDs-UB8hl4BO6n-b7s0Ec_L1V4mhp87Dso8KGhT5I7lik25WEo1xZZ6YjnZ8t/exec";

const form = document.getElementById("rsvpForm");
const statusEl = document.getElementById("formStatus");
const attendingFields = document.getElementById("attendingFields");
const guestCount = document.getElementById("guestCount");
const guestNameFields = document.getElementById("guestNameFields");
const guestNames = document.getElementById("guestNames");

function setAttendanceFields() {
  const value = document.querySelector('input[name="attendance"]:checked')?.value;
  const isAttending = value !== "Ոչ";
  attendingFields.classList.toggle("hidden", !isAttending);
  guestCount.required = isAttending;
  document.querySelectorAll(".guest-name-input").forEach((input) => {
    input.required = isAttending;
  });
}

document.querySelectorAll('input[name="attendance"]').forEach((radio) => {
  radio.addEventListener("change", setAttendanceFields);
});

function clampCount(value) {
  return Math.max(1, Math.min(10, Number(value) || 1));
}

function renderGuestNameFields() {
  const totalGuests = clampCount(guestCount.value);
  const extraGuests = totalGuests - 1;
  const currentValues = Array.from(document.querySelectorAll(".guest-name-input")).map((input) => input.value);

  guestNameFields.innerHTML = "";

  for (let i = 0; i < extraGuests; i += 1) {
    const field = document.createElement("div");
    field.className = "field";

    const label = document.createElement("label");
    label.htmlFor = `guestName${i + 1}`;
    label.textContent = `Ուղեկցող հյուր ${i + 1} — Անուն, ազգանուն *`;

    const input = document.createElement("input");
    input.id = `guestName${i + 1}`;
    input.type = "text";
    input.className = "guest-name-input";
    input.autocomplete = "name";
    input.placeholder = "Օր.՝ Արամ Սարգսյան";
    input.value = currentValues[i] || "";
    input.required = document.querySelector('input[name="attendance"]:checked')?.value !== "Ոչ";

    field.append(label, input);
    guestNameFields.appendChild(field);
  }
}

function syncGuestNamesValue() {
  guestNames.value = Array.from(document.querySelectorAll(".guest-name-input"))
    .map((input) => input.value.trim())
    .filter(Boolean)
    .join("\n");
}

document.getElementById("minusGuest").addEventListener("click", () => {
  guestCount.value = clampCount(Number(guestCount.value) - 1);
  renderGuestNameFields();
});

document.getElementById("plusGuest").addEventListener("click", () => {
  guestCount.value = clampCount(Number(guestCount.value) + 1);
  renderGuestNameFields();
});

guestCount.addEventListener("change", () => {
  guestCount.value = clampCount(guestCount.value);
  renderGuestNameFields();
});

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  statusEl.className = "form-status";

  if (APPS_SCRIPT_URL.includes("PASTE_YOUR")) {
    statusEl.textContent = "Կայքը պատրաստ է։ RSVP-ն աշխատեցնելու համար script.js-ում ավելացրեք Apps Script Web App URL-ը։";
    statusEl.classList.add("error");
    return;
  }

  const submitButton = form.querySelector('button[type="submit"]');
  submitButton.disabled = true;
  submitButton.textContent = "Ուղարկվում է…";

  syncGuestNamesValue();
  const formData = new FormData(form);
  if (formData.get("attendance") === "Ոչ") {
    formData.set("guestCount", "0");
    formData.set("guestNames", "");
  }

  try {
    // Apps Script web apps often behave more reliably with URL-encoded POSTs.
    const body = new URLSearchParams();
    for (const [key, value] of formData.entries()) body.append(key, value);

    await fetch(APPS_SCRIPT_URL, {
      method: "POST",
      mode: "no-cors",
      headers: { "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8" },
      body
    });

    form.reset();
    guestCount.value = 1;
    renderGuestNameFields();
    setAttendanceFields();
    statusEl.textContent = "Շնորհակալություն 🤍 Ձեր պատասխանը ընդունված է։";
    statusEl.classList.add("success");
  } catch (error) {
    console.error(error);
    statusEl.textContent = "Չհաջողվեց ուղարկել։ Խնդրում ենք փորձել կրկին։";
    statusEl.classList.add("error");
  } finally {
    submitButton.disabled = false;
    submitButton.textContent = "Ուղարկել պատասխանը";
  }
});


// Wedding countdown — ceremony begins 01.11.2026 at 15:00 in Yerevan.
const weddingDate = new Date("2026-11-01T15:00:00+04:00");
const countdownDays = document.getElementById("countdownDays");
const countdownHours = document.getElementById("countdownHours");
const countdownMinutes = document.getElementById("countdownMinutes");
const countdownSeconds = document.getElementById("countdownSeconds");

function updateCountdown() {
  if (!countdownDays) return;

  const remaining = Math.max(0, weddingDate.getTime() - Date.now());
  const days = Math.floor(remaining / 86400000);
  const hours = Math.floor((remaining % 86400000) / 3600000);
  const minutes = Math.floor((remaining % 3600000) / 60000);
  const seconds = Math.floor((remaining % 60000) / 1000);

  countdownDays.textContent = String(days).padStart(2, "0");
  countdownHours.textContent = String(hours).padStart(2, "0");
  countdownMinutes.textContent = String(minutes).padStart(2, "0");
  countdownSeconds.textContent = String(seconds).padStart(2, "0");
}

updateCountdown();
setInterval(updateCountdown, 1000);

// Subtle reveal animation
const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("visible");
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));
renderGuestNameFields();
setAttendanceFields();
