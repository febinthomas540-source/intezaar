"use client";

import { useEffect } from "react";

const MIN_SPEED_POST_MS = 12 * 60 * 60 * 1000;
const MINUTE_MS = 60 * 1000;

function pad(value: number) {
  return String(value).padStart(2, "0");
}

function localDateValue(date: Date) {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

function localTimeValue(date: Date) {
  return `${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

function safePresetMoment(hours: number) {
  // The native time input stores minute precision. Rounding a true +12h moment
  // down to HH:MM can accidentally make it a few seconds too early for the
  // server-side 12-hour minimum. Round up and keep one extra minute of margin.
  const minimum = Date.now() + hours * 60 * 60 * 1000;
  return new Date(Math.ceil(minimum / MINUTE_MS) * MINUTE_MS + MINUTE_MS);
}

function setNativeValue(input: HTMLInputElement, value: string) {
  const descriptor = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value");
  if (descriptor?.set) descriptor.set.call(input, value);
  else input.value = value;
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
        const dateInput = document.querySelector<HTMLInputElement>('.arrival-card input[type="date"]');
        const timeInput = document.querySelector<HTMLInputElement>('.arrival-card input[type="time"]');
        if (!group || !dateInput || !timeInput) return;

        dateInput.min = localDateValue(new Date());

        let note = document.querySelector<HTMLParagraphElement>('[data-speed-post-note="true"]');
        if (!note) {
          note = document.createElement("p");
          note.dataset.speedPostNote = "true";
          note.className = "speed-post-note";
          group.after(note);
        }
        const noteElement = note;

        const clearSpeedPostActive = () => {
          group.querySelectorAll<HTMLButtonElement>("button[data-speed-post]").forEach((button) => {
            button.classList.remove("active");
          });
        };

        const validate = () => {
          const timestamp = selectedMoment(dateInput, timeInput);
          const valid = Number.isFinite(timestamp) && timestamp >= Date.now() + MIN_SPEED_POST_MS;
          const continueButton = Array.from(document.querySelectorAll<HTMLButtonElement>("button"))
            .find((button) => button.textContent?.trim() === "Continue to seal");
          if (continueButton) continueButton.disabled = !valid;
          noteElement.dataset.invalid = String(!valid);
          noteElement.textContent = valid
            ? "Speed Post can arrive from 12 hours. Ordinary Intezaar journeys can take 3, 5 or 7 days."
            : "Choose an arrival at least 12 hours from now.";
        };

        const addChoice = (hours: number, title: string, subtitle: string) => {
          if (group.querySelector(`[data-speed-post="${hours}"]`)) return;
          const button = document.createElement("button");
          button.type = "button";
          button.className = "speed-post-choice";
          button.dataset.speedPost = String(hours);

          const strong = document.createElement("strong");
          strong.textContent = title;
          const span = document.createElement("span");
          span.textContent = subtitle;
          button.append(strong, span);

          button.addEventListener("click", () => {
            const target = safePresetMoment(hours);
            setNativeValue(dateInput, localDateValue(target));
            setNativeValue(timeInput, localTimeValue(target));
            group.querySelectorAll("button").forEach((item) => item.classList.remove("active"));
            button.classList.add("active");
            validate();
          });

          group.prepend(button);
        };

        addChoice(24, "Next day", "Priority arrival");
        addChoice(12, "12 hours", "Speed Post");

        group.querySelectorAll<HTMLButtonElement>("button:not([data-speed-post])").forEach((button) => {
          if (button.dataset.speedPostOrdinaryBound) return;
          button.dataset.speedPostOrdinaryBound = "true";
          button.addEventListener("click", () => {
            clearSpeedPostActive();
            validate();
          });
        });

        if (!dateInput.dataset.speedPostBound) {
          dateInput.dataset.speedPostBound = "true";
          const handleManualArrivalChange = () => {
            clearSpeedPostActive();
            validate();
          };
          dateInput.addEventListener("input", handleManualArrivalChange);
          dateInput.addEventListener("change", handleManualArrivalChange);
        }
        if (!timeInput.dataset.speedPostBound) {
          timeInput.dataset.speedPostBound = "true";
          const handleManualArrivalChange = () => {
            clearSpeedPostActive();
            validate();
          };
          timeInput.addEventListener("input", handleManualArrivalChange);
          timeInput.addEventListener("change", handleManualArrivalChange);
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
