"use client";

import { useEffect } from "react";

export function RegisteredDeliveryCreatorNote() {
  useEffect(() => {
    let frame = 0;

    const sync = () => {
      window.cancelAnimationFrame(frame);
      frame = window.requestAnimationFrame(() => {
        const grid = document.querySelector<HTMLElement>('[data-intezaar-email-fields="true"]');
        if (!grid) return;

        const labels = grid.querySelectorAll<HTMLLabelElement>("label");
        const recipientLabel = labels[1];
        const recipientInput = recipientLabel?.querySelector<HTMLInputElement>('input[type="email"]');
        if (!recipientLabel || !recipientInput) return;

        const firstText = recipientLabel.firstChild;
        if (firstText?.nodeType === Node.TEXT_NODE) {
          firstText.textContent = "Recipient email (optional — registered delivery)";
        }
        recipientInput.placeholder = "Verifies the intended recipient";

        const existingNotes = Array.from(
          document.querySelectorAll<HTMLElement>('[data-registered-delivery-note="true"]'),
        );
        const existingNote = existingNotes[0];
        existingNotes.slice(1).forEach((note) => note.remove());
        if (existingNote) return;

        const note = document.createElement("p");
        note.dataset.registeredDeliveryNote = "true";
        note.className = "registered-delivery-creator-note";
        note.textContent = "Add the recipient’s email to make this a Registered Letter. They will need a one-time code before the sender details, letter or private media can be released. Leave it blank for ordinary private-link delivery.";
        grid.after(note);
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
