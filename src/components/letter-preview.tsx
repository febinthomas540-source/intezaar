"use client";

import {
  CSSProperties,
  KeyboardEvent as ReactKeyboardEvent,
  PointerEvent as ReactPointerEvent,
  useEffect,
  useRef,
  useState,
} from "react";

export type LetterFormat =
  | "classic"
  | "minimal"
  | "typewriter"
  | "airmail"
  | "inland"
  | "postcard"
  | "folded"
  | "photo"
  | "festival"
  | "telegram";

export type PhotoFit = "cover" | "contain";

export type PhotoItem = {
  id: string;
  name: string;
  url: string;
  caption: string;
  fit: PhotoFit;
  zoom: number;
  cropX: number;
  cropY: number;
  x: number;
  y: number;
  width: number;
  aspectRatio: number;
  zIndex: number;
};

export type PhotoPatch = Partial<
  Pick<PhotoItem, "caption" | "fit" | "zoom" | "cropX" | "cropY" | "x" | "y" | "width" | "aspectRatio" | "zIndex">
>;

export type VoiceItem = { id: string; name: string; url: string; label: string };
export type VideoItem = { id: string; name: string; url: string; caption: string; size: number };

export const initialPhotoPlacements = [
  { x: 50, y: 28, width: 60 },
  { x: 30, y: 64, width: 38 },
  { x: 72, y: 75, width: 36 },
];

function clamp(value: number, minimum: number, maximum: number) {
  return Math.min(maximum, Math.max(minimum, value));
}

function formatName(format: LetterFormat) {
  const names: Record<LetterFormat, string> = {
    classic: "Classic letter",
    minimal: "Minimal letter",
    typewriter: "Typewritten letter",
    airmail: "Airmail letter",
    inland: "Inland letter",
    postcard: "Postcard",
    folded: "Folded card",
    photo: "Photo letter",
    festival: "Celebration card",
    telegram: "Digital telegram",
  };
  return names[format];
}

function formatMark(format: LetterFormat) {
  const marks: Record<LetterFormat, string> = {
    classic: "PRIVATE LETTER",
    minimal: "PRIVATE NOTE",
    typewriter: "TYPEWRITTEN LETTER",
    airmail: "BY AIR MAIL",
    inland: "INLAND LETTER",
    postcard: "POST CARD",
    folded: "FOLDED CARD",
    photo: "PHOTO LETTER",
    festival: "CELEBRATION MAIL",
    telegram: "DIGITAL TELEGRAM",
  };
  return marks[format];
}

function fileSize(bytes: number) {
  return `${(bytes / 1_048_576).toFixed(1)} MB`;
}

function imageStyle(photo: PhotoItem): CSSProperties {
  return {
    objectFit: photo.fit,
    objectPosition: `${photo.cropX}% ${photo.cropY}%`,
    transform: `scale(${photo.zoom})`,
    transformOrigin: `${photo.cropX}% ${photo.cropY}%`,
  };
}

function FreePhoto({
  photo,
  selected,
  paperRef,
  onSelect,
  onUpdate,
}: {
  photo: PhotoItem;
  selected: boolean;
  paperRef: { current: HTMLDivElement | null };
  onSelect: (id: string) => void;
  onUpdate: (id: string, patch: PhotoPatch) => void;
}) {
  const drag = useRef<{ pointerId: number; offsetX: number; offsetY: number } | null>(null);

  function startDrag(event: ReactPointerEvent<HTMLElement>) {
    if (event.pointerType === "mouse" && event.button !== 0) return;
    const bounds = paperRef.current?.getBoundingClientRect();
    if (!bounds) return;

    event.preventDefault();
    event.stopPropagation();
    onSelect(photo.id);

    drag.current = {
      pointerId: event.pointerId,
      offsetX: event.clientX - (bounds.left + (photo.x / 100) * bounds.width),
      offsetY: event.clientY - (bounds.top + (photo.y / 100) * bounds.height),
    };
    event.currentTarget.setPointerCapture(event.pointerId);
  }

  function moveDrag(event: ReactPointerEvent<HTMLElement>) {
    const state = drag.current;
    const bounds = paperRef.current?.getBoundingClientRect();
    if (!state || state.pointerId !== event.pointerId || !bounds) return;

    event.preventDefault();
    const frameWidth = (photo.width / 100) * bounds.width;
    const frameHeight = frameWidth / Math.max(.55, photo.aspectRatio);
    const halfWidth = (frameWidth / 2 / bounds.width) * 100;
    const halfHeight = (frameHeight / 2 / bounds.height) * 100;

    onUpdate(photo.id, {
      x: clamp(((event.clientX - state.offsetX - bounds.left) / bounds.width) * 100, halfWidth, 100 - halfWidth),
      y: clamp(((event.clientY - state.offsetY - bounds.top) / bounds.height) * 100, halfHeight, 100 - halfHeight),
    });
  }

  function stopDrag(event: ReactPointerEvent<HTMLElement>) {
    if (drag.current?.pointerId === event.pointerId) drag.current = null;
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
  }

  function nudge(event: ReactKeyboardEvent<HTMLElement>) {
    const amount = event.shiftKey ? 5 : 1;
    const patches: Record<string, PhotoPatch> = {
      ArrowLeft: { x: clamp(photo.x - amount, 0, 100) },
      ArrowRight: { x: clamp(photo.x + amount, 0, 100) },
      ArrowUp: { y: clamp(photo.y - amount, 0, 100) },
      ArrowDown: { y: clamp(photo.y + amount, 0, 100) },
    };
    if (!patches[event.key]) return;
    event.preventDefault();
    onSelect(photo.id);
    onUpdate(photo.id, patches[event.key]);
  }

  return (
    <figure
      className={`free-photo-item ${selected ? "selected" : ""}`}
      style={{ left: `${photo.x}%`, top: `${photo.y}%`, width: `${photo.width}%`, zIndex: photo.zIndex }}
      role="button"
      tabIndex={0}
      aria-label={`Photo ${selected ? "selected" : "not selected"}. Drag it anywhere on the letter.`}
      onPointerDown={startDrag}
      onPointerMove={moveDrag}
      onPointerUp={stopDrag}
      onPointerCancel={stopDrag}
      onKeyDown={nudge}
    >
      <div className="free-photo-frame" style={{ aspectRatio: photo.aspectRatio }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={photo.url} alt={photo.caption || photo.name} style={imageStyle(photo)} draggable={false} />
      </div>
      {photo.caption ? <figcaption>{photo.caption}</figcaption> : null}
    </figure>
  );
}

function PhotoSettings({
  photos,
  selectedId,
  onSelect,
  onUpdate,
  onRemove,
  onDone,
}: {
  photos: PhotoItem[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  onUpdate: (id: string, patch: PhotoPatch) => void;
  onRemove: (id: string) => void;
  onDone: () => void;
}) {
  if (!photos.length) return null;
  const selected = photos.find((photo) => photo.id === selectedId) ?? photos[0];
  const index = photos.findIndex((photo) => photo.id === selected.id);
  const reset = initialPhotoPlacements[index] ?? initialPhotoPlacements[0];

  return (
    <section className="free-photo-properties" aria-label="Selected photo settings">
      <header>
        <div><span>Photo placement</span><strong>Drag it anywhere on the letter</strong></div>
        <button type="button" onClick={onDone}>Done</button>
      </header>

      {photos.length > 1 ? (
        <div className="free-photo-selector" role="group" aria-label="Choose photo">
          {photos.map((photo, photoIndex) => (
            <button type="button" key={photo.id} className={photo.id === selected.id ? "active" : ""} onClick={() => onSelect(photo.id)}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={photo.url} alt="" />
              <span>Photo {photoIndex + 1}</span>
            </button>
          ))}
        </div>
      ) : null}

      <label className="free-photo-caption">Caption
        <input value={selected.caption} onChange={(event) => onUpdate(selected.id, { caption: event.target.value })} placeholder="Optional caption" />
      </label>

      <div className="free-photo-fit" role="group" aria-label="Photo fit">
        <button type="button" className={selected.fit === "cover" ? "active" : ""} onClick={() => onUpdate(selected.id, { fit: "cover" })}>Fill frame</button>
        <button type="button" className={selected.fit === "contain" ? "active" : ""} onClick={() => onUpdate(selected.id, { fit: "contain", zoom: 1 })}>Show whole photo</button>
      </div>

      <div className="free-photo-sliders">
        <label><span>Photo size</span><input type="range" min="20" max="88" step="1" value={selected.width} onChange={(event) => onUpdate(selected.id, { width: Number(event.target.value) })} /><output>{Math.round(selected.width)}%</output></label>
        <label><span>Zoom</span><input type="range" min="0.6" max="2.4" step="0.05" value={selected.zoom} onChange={(event) => onUpdate(selected.id, { zoom: Number(event.target.value) })} /><output>{Math.round(selected.zoom * 100)}%</output></label>
        <label><span>Crop left/right</span><input type="range" min="0" max="100" step="1" value={selected.cropX} onChange={(event) => onUpdate(selected.id, { cropX: Number(event.target.value) })} /><output>{Math.round(selected.cropX)}%</output></label>
        <label><span>Crop up/down</span><input type="range" min="0" max="100" step="1" value={selected.cropY} onChange={(event) => onUpdate(selected.id, { cropY: Number(event.target.value) })} /><output>{Math.round(selected.cropY)}%</output></label>
      </div>

      <div className="free-photo-actions">
        <button type="button" onClick={() => onUpdate(selected.id, { fit: "cover", zoom: 1, cropX: 50, cropY: 50, x: reset.x, y: reset.y, width: reset.width })}>Reset placement</button>
        <button type="button" className="danger" onClick={() => onRemove(selected.id)}>Remove photo</button>
      </div>
    </section>
  );
}

export function LetterPreview({
  format,
  sender,
  recipient,
  occasion,
  heading,
  letter,
  closing,
  photos,
  voices,
  videos,
  onUpdatePhoto,
  onRemovePhoto,
}: {
  format: LetterFormat;
  sender: string;
  recipient: string;
  occasion: string;
  heading: string;
  letter: string;
  closing: string;
  photos: PhotoItem[];
  voices: VoiceItem[];
  videos: VideoItem[];
  onUpdatePhoto: (id: string, patch: PhotoPatch) => void;
  onRemovePhoto: (id: string) => void;
}) {
  const [selectedPhotoId, setSelectedPhotoId] = useState<string | null>(null);
  const paperRef = useRef<HTMLDivElement | null>(null);
  const message = letter.trim() || "Your letter will appear here as you write.";

  useEffect(() => {
    if (!photos.length) {
      setSelectedPhotoId(null);
      return;
    }
    if (!selectedPhotoId || !photos.some((photo) => photo.id === selectedPhotoId)) {
      setSelectedPhotoId(photos[photos.length - 1].id);
    }
  }, [photos, selectedPhotoId]);

  function selectPhoto(id: string) {
    if (id !== selectedPhotoId) {
      onUpdatePhoto(id, { zIndex: Math.max(0, ...photos.map((photo) => photo.zIndex)) + 1 });
    }
    setSelectedPhotoId(id);
  }

  function removePhoto(id: string) {
    onRemovePhoto(id);
    const remaining = photos.filter((photo) => photo.id !== id);
    setSelectedPhotoId(remaining.length ? remaining[remaining.length - 1].id : null);
  }

  return (
    <article className={`letter-live-preview letter-format-${format}`} aria-label={`${formatName(format)} preview`}>
      <div className="letter-preview-toolbar"><span>Recipient preview</span><strong>{formatName(format)}</strong></div>
      {format === "folded" ? <div className="folded-cover"><small>{occasion}</small><h3>{heading || `For ${recipient || "someone special"}`}</h3><span>Open the card →</span></div> : null}
      {format === "festival" ? <div className="festival-cover"><small>Intezaar celebration mail</small><strong>{occasion}</strong><span>For {recipient || "someone special"}</span></div> : null}

      <div className="letter-preview-paper free-photo-canvas" ref={paperRef}>
        {format === "telegram" ? <div className="telegram-strip"><span>तार · TELEGRAM</span><strong>PRIORITY: PERSONAL</strong></div> : null}
        {format === "inland" ? <div className="inland-fold-guide" aria-hidden="true"><span>Fold here</span><i /><i /></div> : null}

        <header className="letter-preview-address">
          <div><small>From</small><strong>{sender || "Your name"}</strong></div>
          <div><small>To</small><strong>{recipient || "Their name"}</strong></div>
          <span className="letter-preview-postmark">INTEZAAR MAIL<br />POSTED WITH PATIENCE</span>
        </header>

        <div className="letter-preview-copy">
          <small>{occasion}</small>
          <h3>{heading.trim() || `Dear ${recipient || "you"},`}</h3>
          <p>{message}</p>
          <em>{closing.trim() || (sender ? `With love, ${sender}` : "Your closing")}</em>
        </div>

        {voices.length ? <div className="letter-preview-voices">{voices.map((voice) => <div key={voice.id}><span className="voice-play-mark">▶</span><p><strong>{voice.label || "A voice note inside this letter"}</strong><small>{voice.name}</small></p><audio controls src={voice.url} preload="metadata" /></div>)}</div> : null}
        {videos.length ? <div className="letter-preview-videos">{videos.map((video) => <figure key={video.id}><video controls playsInline preload="metadata" src={video.url} /><figcaption><strong>{video.caption || "A video inside this letter"}</strong><small>{video.name} · {fileSize(video.size)}</small></figcaption></figure>)}</div> : null}

        <footer><span>{formatMark(format)}</span><span>{photos.length + voices.length + videos.length} optional item{photos.length + voices.length + videos.length === 1 ? "" : "s"}</span></footer>

        {photos.length ? <div className="free-photo-stage" aria-label="Freely positioned photos">{photos.map((photo) => <FreePhoto key={photo.id} photo={photo} selected={selectedPhotoId === photo.id} paperRef={paperRef} onSelect={selectPhoto} onUpdate={onUpdatePhoto} />)}</div> : null}
      </div>

      <PhotoSettings photos={photos} selectedId={selectedPhotoId} onSelect={selectPhoto} onUpdate={onUpdatePhoto} onRemove={removePhoto} onDone={() => setSelectedPhotoId(null)} />
    </article>
  );
}
