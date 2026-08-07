"use client";

import { useEffect } from "react";
import styles from "./recipient-postage-stamp.module.css";

export function RecipientPostageStamp() {
  useEffect(() => {
    const decorate = () => {
      const envelopes = document.querySelectorAll<HTMLElement>(
        '[class*="invitationEnvelope"], [class*="arrivedEnvelope"]',
      );

      envelopes.forEach((envelope) => {
        if (envelope.querySelector('[data-intezaar-stamp="true"]')) return;

        const wrapper = document.createElement("span");
        wrapper.dataset.intezaarStamp = "true";
        wrapper.className = styles.postage;
        wrapper.setAttribute("aria-hidden", "true");
        wrapper.innerHTML = `
          <span class="${styles.stamp}">
            <span class="${styles.name}">INTEZAAR</span>
            <span class="${styles.value}">₹1</span>
            <span class="${styles.train}">♜</span>
            <span class="${styles.rail}"></span>
            <span class="${styles.caption}">BY RAIL · DIGITAL MAIL</span>
          </span>
          <span class="${styles.cancel}">
            <span>INTEZAAR</span>
            <i></i><i></i><i></i>
          </span>
        `;
        envelope.appendChild(wrapper);
      });
    };

    decorate();
    const observer = new MutationObserver(decorate);
    observer.observe(document.body, { childList: true, subtree: true });
    return () => observer.disconnect();
  }, []);

  return null;
}
