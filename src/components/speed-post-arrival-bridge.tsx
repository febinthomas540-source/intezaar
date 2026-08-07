"use client";

import { useEffect } from "react";

const MIN_SPEED_POST_MS = 12 * 60 * 60 * 1000;

function pad(value: number) {
  return String(value).padStart(2, "0");
}

function localDateValue(date: Date) {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

function localTimeValue(date: Date) {
  return `${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

function setNativeValue(input: HTMLInputElement, value: string) {
  const setter = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value")?.set;
  setter?.call(input, value);
  input.dispatchEvent(new Event("input", { bubbles: true }));
  input.dispatchEvent(new Event("change", { bubbles: true }));
}

function selectedMoment(dateInput: HTMLInputElement, timeInput: HTMLInputElement) {
  if (!dateInput.value || !timeInput.value) return Number.NaN;
  return new Date(`${dateInput.value}T${timeInput.value}:00`).getTime();
}

export function SpeedPostArrivalBridge() {
  useEffect(() => {
    let frame = 0;

    const sync = () => {
      window.cancelAnimationFrame(frame);
      frame = window.requestAnimationFrame(() => {
        const group = document.querySelector<HTMLElement>(".journey-duration-cards");
        if (!group) return;

        const dateInput = document.querySelector<HTMLInputElement>('.arrival-card input[type="date"]');
        const timeInput = document.querySelector<HTMLInputElement>('.arrival-card input[type="time"]');
        if (!dateInput || !timeInput) return;

        dateInput.min = localDateValue(new Date());

        if (!group.querySelector('[data-speed-post="12"]')) {
          const makeChoice = (hours: number, title: string, subtitle: string) => {
            const button = document.createElement("button");
            button.type = "button";
            button.className = "speed-post-choice";
            button.dataset.speedPost = String(hours);
            button.innerHTML = `<strong>${title}</strong><span>${subtitle}</span>`;
            button.addEventListener("click", () => {
              const target = new Date(Date.now() + hours * 60 * 60 * 1000);
              setNativeValue(dateInput, localDateValue(target));
              setNativeValue(timeInput, localTimeValue(target));
              group.querySelectorAll("button").forEach((item) => item.classList.remove("active"));
              button.classList.add("active");
              validate();
            });
            return button;
          };

          const twelveHour = makeChoice(12, "12 hours", "Speed Post");
          const nextDay = makeChoice(24, "Next day", "Priority arrival");
          group.prepend(nextDay);
          group.prepend(twelveHour);
        }

        let note = document.querySelector<HTMLElement>('[data-speed-post-note="true"]');
        if (!note) {
          note = document.createElement("p");
          note.dataset.speedPostNote = "true";
          note.className = "speed-post-note";
          note.textContent = "Speed Post can arrive from 12 hours. Ordinary Intezaar journeys can take 3, 5 or 7 days.";
          group.after(note);
        }

        const continueButton = Array.from(document.querySelectorAll<HTMLButtonElement>("button"))
          .find((button) => button.textContent?.trim() === "Continue to seal");

        function validate() {
          const timestamp = selectedMoment(dateInput, timeInput);
          const valid = Number.isFinite(timestamp) && timestamp >= Date.now() + MIN_SPEED_POST_MS;
          if (continueButton) continueButton.disabled = !valid;
          if (note) {
            note.dataset.invalid = String(!valid);
            note.textContent = valid
              ? "Speed Post can arrive from 12 hours. Ordinary Intezaar journeys can take 3, 5 or 7 days."
              : "Choose an arrival at least 12 hours from now.";
          }
        }

        if (!dateInput.dataset.speedPostBound) {
          dateInput.dataset.speedPostBound = "true";
          dateInput.addEventListener("input", validate);
          dateInput.addEventListener("change", validate);
        }
        if (!timeInput.dataset.speedPostBound) {
          timeInput.dataset.speedPostBound = "true";
          timeInput.addEventListener("input", validate);
          timeInput.addEventListener("change", validate);
        }

        validate();
      });
    };

    const observer = new MutationObserver(sync);
    observer.observe(document.body, { childList: true, subtree: true });
    sync();

    return () => {
      observer.disconnect();
      window.cancelAnimationFrame(frame);
    };
  }, []);

  return null;
}
