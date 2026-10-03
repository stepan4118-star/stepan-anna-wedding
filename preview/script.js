// 1) Deploy the Apps Script code from apps-script.gs as a Web App.
// 2) Paste the /exec URL below.
const APPS_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbw9PUaCDs-UB8hl4BO6n-b7s0Ec_L1V4mhp87Dso8KGhT5I7lik25WEo1xZZ6YjnZ8t/exec";

const form = document.getElementById("rsvpForm");
const statusEl = document.getElementById("formStatus");
const attendingFields = document.getElementById("attendingFields");
const guestCount = document.getElementById("guestCount");

function setAttendanceFields() {
  const value = document.querySelector('input[name="attendance"]:checked')?.value;
  attendingFields.classList.toggle("hidden", value === "Ոչ");
  guestCount.required = value !== "Ոչ";
}

document.querySelectorAll('input[name="attendance"]').forEach((radio) => {
  radio.addEventListener("change", setAttendanceFields);
});

function clampCount(value) {
  return Math.max(1, Math.min(10, Number(value) || 1));
}

document.getElementById("minusGuest").addEventListener("click", () => {
  guestCount.value = clampCount(Number(guestCount.value) - 1);
});

document.getElementById("plusGuest").addEventListener("click", () => {
  guestCount.value = clampCount(Number(guestCount.value) + 1);
});

guestCount.addEventListener("change", () => {
  guestCount.value = clampCount(guestCount.value);
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
setAttendanceFields();
