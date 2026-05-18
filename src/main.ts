/// <reference types="vite/client" />

/**
 * @license
 * The MIT License (MIT)
 *
 * Copyright (c) 2025 David Padgett/Summit Street Technologies.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 *
 * @file
 * The main module wires up DOM interactions for the Summit Street Technologies
 * static website.
 */

import "./app.css";

import { startContentCycle } from "@summitstreet/svelte-ui-sdk";
import {
  composeEmail,
  decodeString,
  downloadFile,
} from "@summitstreet/web-app-sdk-ts";

// Constants.

const navigationBarLinkIdPrefix = "navigation-bar-link-";
const outcomes = ["Envisioned.", "Realized.", "Delivered."];
const sectionDescriptors = [
  { id: "main" },
  { id: "software-development-services" },
  { id: "technology-consulting" },
  { id: "it-services" },
  { id: "about" },
  { id: "contact" },
];

// Decode obfuscated contact values.

const key = [
  import.meta.env.VITE_KEY_1,
  import.meta.env.VITE_KEY_2,
  import.meta.env.VITE_KEY_3,
].join("");
const principalEmailAddress = decodeString(
  import.meta.env.VITE_PRINCIPAL_EMAIL_ADDRESS,
  key
);
const infoEmailAddress = decodeString(
  import.meta.env.VITE_INFO_EMAIL_ADDRESS,
  key
);
const vCard = decodeString(import.meta.env.VITE_INFO_VCARD, key).replace(
  /^"|"$/g,
  ""
);

// Outcome text cycler.

const outcomeSpan = document.querySelector<HTMLSpanElement>(".content-cycler");
const firstOutcome = outcomes[0];
if (outcomeSpan !== null && firstOutcome !== undefined) {
  outcomeSpan.textContent = firstOutcome;
}

startContentCycle({
  count: outcomes.length,
  interval: 2500,
  transition: 400,
  onHide: () => {
    outcomeSpan?.classList.add("hidden");
  },
  onAdvance: (i) => {
    const outcome = outcomes[i];
    if (outcomeSpan !== null && outcome !== undefined) {
      outcomeSpan.textContent = outcome;
    }
  },
  onShow: () => {
    outcomeSpan?.classList.remove("hidden");
  },
});

// Profile email button.

document.getElementById("profile-email")?.addEventListener("click", () => {
  composeEmail(principalEmailAddress);
});

// Contact send button.

document.getElementById("contact-send")?.addEventListener("click", () => {
  const validationDiv = document.getElementById("contact-validation");
  validationDiv?.classList.remove("visible");
  const name =
    (
      document.getElementById("contact-name") as HTMLInputElement | null
    )?.value.trim() ?? "";
  const location =
    (
      document.getElementById("contact-location") as HTMLInputElement | null
    )?.value.trim() ?? "";
  const phone =
    (
      document.getElementById("contact-phone-number") as HTMLInputElement | null
    )?.value.trim() ?? "";
  if (name.length === 0 || location.length === 0 || phone.length === 0) {
    validationDiv?.classList.add("visible");
    return;
  }

  const subject = `Inquiry from: '${name}' [summitstreet.tech#contact]`;
  const body = new Map<string, string>([
    ["Name", name],
    ["Location", location],
    ["Phone Number", phone],
    [
      "",
      "\nEvery engagement starts with a conversation — share your technology challenges, questions, or goals.",
    ],
  ]);
  composeEmail(infoEmailAddress, subject, body);
});

// vCard download button.

document.getElementById("download-vcard")?.addEventListener("click", () => {
  downloadFile("summit-street.vcf", vCard, "text/vcard;charset=utf-8");
});

// Back-to-top button.

document.getElementById("top-of-page")?.addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: "instant" });
});

// Scroll and resize handling.

const debounce = (func: () => void, delay: number): (() => void) => {
  let timeoutId: number | undefined;
  return () => {
    window.clearTimeout(timeoutId);
    timeoutId = window.setTimeout(() => func(), delay);
  };
};

const setMainWindowHeight = () => {
  const mainElement = document.querySelector<HTMLElement>(".main");
  if (mainElement !== null) {
    mainElement.style.height = sectionDescriptors.length * 100 + "vh";
  }
};

const updateSectionStyle = () => {
  const minimumScrollDistance = 75;
  const scaleCoefficient = 0.05;
  const translateYCoefficient = 100;
  const blurCoefficient = 25;
  const opacityCoefficient = 1.2;
  const scrollPos = Math.floor(window.scrollY);
  const viewportHeight = window.innerHeight;
  sectionDescriptors.forEach((sectionContent, sectionIndex) => {
    const sectionElement = document.getElementById(sectionContent.id);
    if (sectionElement !== null) {
      const sectionStart = sectionIndex * viewportHeight;
      const scrollDistanceInSection = scrollPos - sectionStart;
      if (scrollDistanceInSection > minimumScrollDistance) {
        const progress = Math.min(scrollDistanceInSection / viewportHeight, 1);
        sectionElement.style.transform = `scale(${1 - progress * scaleCoefficient}) translateY(-${progress * translateYCoefficient}px)`;
        sectionElement.style.filter = `blur(${progress * blurCoefficient}px)`;
        sectionElement.style.opacity = `${Math.max(0, 1 - progress * opacityCoefficient)}`;
        sectionElement.style.pointerEvents = "none";
      } else {
        sectionElement.style.transform = "scale(1) translateY(0)";
        sectionElement.style.filter = "blur(0px)";
        sectionElement.style.opacity = "1";
        sectionElement.style.pointerEvents = "auto";
      }
      sectionElement.style.zIndex = `${sectionDescriptors.length - sectionIndex}`;
    }
  });
  document
    .getElementById("top-of-page")
    ?.classList.toggle("visible", window.scrollY > window.innerHeight * 0.5);
};

setMainWindowHeight();

const debouncedResize = debounce(() => {
  setMainWindowHeight();
  updateSectionStyle();
}, 150);

window.addEventListener("resize", debouncedResize);

window.addEventListener(
  "scroll",
  (() => {
    let isTicking = false;
    return () => {
      if (!isTicking) {
        window.requestAnimationFrame(() => {
          updateSectionStyle();
          isTicking = false;
        });
        isTicking = true;
      }
    };
  })()
);

// Navigation bar link buttons.

document
  .querySelectorAll<HTMLButtonElement>(".navigation-bar-links button")
  .forEach((button) => {
    button.addEventListener("click", () => {
      const sectionId = button.id.startsWith(navigationBarLinkIdPrefix)
        ? button.id.slice(navigationBarLinkIdPrefix.length)
        : null;
      if (sectionId === null) {
        return;
      }
      const sectionIndex = sectionDescriptors.findIndex(
        (s) => s.id === sectionId
      );
      if (sectionIndex !== -1) {
        window.scrollTo({
          top: sectionIndex * window.innerHeight,
          behavior: "instant",
        });
        updateSectionStyle();
      }
    });
  });
