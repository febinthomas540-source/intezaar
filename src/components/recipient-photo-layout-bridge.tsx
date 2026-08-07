"use client";

import { useEffect } from "react";

type PhotoLayout = {
  fit: "cover" | "contain";
  zoom: number;
  cropX: number;
  cropY: number;
  x: number;
  y: number;
  width: number;
  aspectRatio: number;
  zIndex: number;
};

type PositionedPhoto = {
  id: string;
  name: string;
  caption: string;
  photoLayout?: PhotoLayout;
};

type Props = {
  photos: PositionedPhoto[];
};

function fallbackLayout(index: number): PhotoLayout {
  const placements = [
    { x: 50, y: 28, width: 60 },
    { x: 30, y: 64, width: 38 },
    { x: 72, y: 75, width: 36 },
  ];
  const placement = placements[index] || placements[0];
  return {
    fit: "cover",
    zoom: 1,
    cropX: 50,
    cropY: 50,
    x: placement.x,
    y: placement.y,
    width: placement.width,
    aspectRatio: 4 / 3,
    zIndex: index + 1,
  };
}

function clearSourceMarkers(root: ParentNode = document) {
  root.querySelectorAll<HTMLElement>("[data-intezaar-source-photo='true']").forEach((figure) => {
    figure.style.removeProperty("display");
    figure.removeAttribute("aria-hidden");
    delete figure.dataset.intezaarSourcePhoto;
  });
}

export function RecipientPhotoLayoutBridge({ photos }: Props) {
  useEffect(() => {
    if (!photos.length) return;

    let frame = 0;
    let lastSignature = "";
    let currentArticle: HTMLElement | null = null;
    let currentStage: HTMLElement | null = null;

    const removeStage = () => {
      if (currentArticle) delete currentArticle.dataset.intezaarPositionedPhotos;
      currentStage?.remove();
      clearSourceMarkers();
      currentArticle = null;
      currentStage = null;
      lastSignature = "";
    };

    const sync = () => {
      window.cancelAnimationFrame(frame);
      frame = window.requestAnimationFrame(() => {
        const mediaSection = document.querySelector<HTMLElement>(
          'section[aria-label="Private media inside this letter"]',
        );
        const article = mediaSection?.closest<HTMLElement>("article") || null;
        const sourceFigures = mediaSection
          ? Array.from(mediaSection.querySelectorAll<HTMLElement>("figure")).filter((figure) =>
              Boolean(figure.querySelector("img")),
            )
          : [];

        if (!article || sourceFigures.length < photos.length) {
          if (currentStage && !currentStage.isConnected) removeStage();
          return;
        }

        if (currentArticle && currentArticle !== article) removeStage();

        const sources = sourceFigures.slice(0, photos.length).map((figure) => {
          const image = figure.querySelector<HTMLImageElement>("img");
          return {
            figure,
            image,
            src: image?.currentSrc || image?.src || "",
          };
        });
        if (sources.some((source) => !source.image || !source.src)) return;

        const signature = JSON.stringify([
          ...sources.map((source) => source.src),
          ...photos.map((photo) => [photo.id, photo.caption, photo.photoLayout]),
        ]);

        sources.forEach(({ figure }) => {
          figure.dataset.intezaarSourcePhoto = "true";
          figure.setAttribute("aria-hidden", "true");
          figure.style.display = "none";
        });

        if (signature === lastSignature && currentStage?.isConnected) return;

        let stage = article.querySelector<HTMLElement>("[data-intezaar-positioned-photo-stage='true']");
        if (!stage) {
          stage = document.createElement("div");
          stage.dataset.intezaarPositionedPhotoStage = "true";
          stage.setAttribute("aria-label", "Positioned photographs inside this letter");
          article.append(stage);
        }

        stage.replaceChildren();

        photos.forEach((photo, index) => {
          const source = sources[index];
          if (!source?.image) return;
          const layout = photo.photoLayout || fallbackLayout(index);

          const figure = document.createElement("figure");
          figure.dataset.intezaarPositionedPhoto = photo.id;
          figure.style.left = `${layout.x}%`;
          figure.style.top = `${layout.y}%`;
          figure.style.width = `${layout.width}%`;
          figure.style.zIndex = String(20 + layout.zIndex);

          const frameElement = document.createElement("div");
          frameElement.style.aspectRatio = String(layout.aspectRatio);

          const image = source.image.cloneNode(true) as HTMLImageElement;
          image.alt = photo.caption || photo.name;
          image.style.objectFit = layout.fit;
          image.style.objectPosition = `${layout.cropX}% ${layout.cropY}%`;
          image.style.transform = `scale(${layout.zoom})`;
          image.style.transformOrigin = `${layout.cropX}% ${layout.cropY}%`;
          image.draggable = false;
          frameElement.append(image);
          figure.append(frameElement);

          if (photo.caption) {
            const caption = document.createElement("figcaption");
            caption.textContent = photo.caption;
            figure.append(caption);
          }

          stage?.append(figure);
        });

        article.dataset.intezaarPositionedPhotos = "true";
        currentArticle = article;
        currentStage = stage;
        lastSignature = signature;
      });
    };

    const observer = new MutationObserver(sync);
    observer.observe(document.body, { childList: true, subtree: true });
    sync();

    return () => {
      observer.disconnect();
      window.cancelAnimationFrame(frame);
      removeStage();
    };
  }, [photos]);

  return null;
}
