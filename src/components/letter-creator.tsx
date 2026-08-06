"use client";

import Link from "next/link";
import {
  CSSProperties,
  ChangeEvent,
  FormEvent,
  KeyboardEvent as ReactKeyboardEvent,
  PointerEvent as ReactPointerEvent,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { Navigation } from "@/components/navigation";

const MAX_LETTER_CHARS = 4000;
const MAX_MEDIA_ITEMS = 3;
const MAX_VIDEO_BYTES = 50 * 1024 * 1024;
const DRAFT_KEY = "intezaar:create-draft:v3";

const occasions = [
  "Just because",
  "Birthday",
  "Anniversary",
  "Farewell",
  "Apology",
  "Wedding",
  "Celebration",
];

const writingStarters = [
  { label: "Start warmly", text: "I have been wanting to tell you this for a while." },
  { label: "Remember a moment", text: "There is one small moment I still carry with me." },
  { label: "Say it honestly", text: "I should have said this more clearly before." },
  { label: "Look ahead", text: "What I hope for you from here is simple." },
];

type LetterFormat =
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

type FormatDefinition = {
  id: LetterFormat;
  name: string;
  description: string;
};

type PhotoFit = "cover" | "contain";

type PhotoItem = {
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

type PhotoPatch = Partial<
  Pick<PhotoItem, "caption" | "fit" | "zoom" | "cropX" | "cropY" | "x" | "y" | "width" | "aspectRatio" | "zIndex">
>;

type VoiceItem = { id: string; name: string; url: string; label: string };
type VideoItem = { id: string; name: string; url: string; caption: string; size: number };

type Draft = {
  sender: string;
  recipient: string;
  occasion: string;
  heading: string;
  letter: string;
  closing: string;
  format: LetterFormat;
  fromCity: string;
  toCity: string;
  arrivalDate: string;
  arrivalTime: string;
};

type SealState = "idle" | "sealing" | "sealed";
type PostState = "idle" | "posting" | "posted";

const formats: FormatDefinition[] = [
  { id: "classic", name: "Classic letter", description: "Warm paper for a personal letter." },
  { id: "minimal", name: "Minimal letter", description: "Clean and quiet with generous space." },
  { id: "typewriter", name: "Typewritten letter", description: "An archival typewriter treatment." },
  { id: "airmail", name: "Airmail letter", description: "Postal edging and route marks." },
  { id: "inland", name: "Inland letter", description: "Inspired by folded Indian inland mail." },
  { id: "postcard", name: "Postcard", description: "A compact postal card." },
  { id: "folded", name: "Folded card", description: "A cover and a message inside." },
  { id: "photo", name: "Photo letter", description: "A visual letter with free photo placement." },
  { id: "festival", name: "Celebration card", description: "Maroon and gold for special days." },
  { id: "telegram", name: "Digital telegram", description: "Short words with a heritage feel." },
];

const initialPlacements = [
  { x: 50, y: 28, width: 60 },
  { x: 30, y: 64, width: 38 },
  { x: 72, y: 75, width: 36 },
];

function clamp(value: number, minimum: number, maximum: number) {
  return Math.min(maximum, Math.max(minimum, value));
}

function toDateInput(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function futureDate(days: number) {
  const date = new Date();
  date.setHours(12, 0, 0, 0);
  date.setDate(date.getDate() + days);
  return toDateInput(date);
}

function daysUntil(dateValue: string) {
  if (!dateValue) return 5;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const arrival = new Date(`${dateValue}T12:00:00`);
  return clamp(Math.ceil((arrival.getTime() - today.getTime()) / 86_400_000), 1, 30);
}

function readableDate(dateValue: string) {
  if (!dateValue) return "Selected arrival date";
  return new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(`${dateValue}T12:00:00`));
}

function formatName(format: LetterFormat) {
  return formats.find((item) => item.id === format)?.name ?? "Classic letter";
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
  const reset = initialPlacements[index] ?? initialPlacements[0];

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

function LetterPreview({
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

export function LetterCreator() {
  const [step, setStep] = useState(1);
  const [created, setCreated] = useState(false);
  const [draftReady, setDraftReady] = useState(false);
  const [format, setFormat] = useState<LetterFormat>("classic");
  const [sender, setSender] = useState("");
  const [recipient, setRecipient] = useState("Ananya");
  const [occasion, setOccasion] = useState("Just because");
  const [heading, setHeading] = useState("");
  const [letter, setLetter] = useState("");
  const [closing, setClosing] = useState("");
  const [fromCity, setFromCity] = useState("Delhi");
  const [toCity, setToCity] = useState("Kochi");
  const [arrivalDate, setArrivalDate] = useState(() => futureDate(5));
  const [arrivalTime, setArrivalTime] = useState("20:00");
  const [photos, setPhotos] = useState<PhotoItem[]>([]);
  const [voices, setVoices] = useState<VoiceItem[]>([]);
  const [videos, setVideos] = useState<VideoItem[]>([]);
  const [mediaError, setMediaError] = useState("");
  const [sealState, setSealState] = useState<SealState>("idle");
  const [sealStatus, setSealStatus] = useState("Ready to seal");
  const [postState, setPostState] = useState<PostState>("idle");
  const [postStatus, setPostStatus] = useState("Ready for the post box");
  const [copied, setCopied] = useState(false);
  const timers = useRef<number[]>([]);
  const objectUrls = useRef(new Set<string>());

  const journeyDays = daysUntil(arrivalDate);
  const mediaCount = photos.length + voices.length + videos.length;
  const mediaSlotsLeft = Math.max(0, MAX_MEDIA_ITEMS - mediaCount);
  const wordCount = letter.trim() ? letter.trim().split(/\s+/).length : 0;
  const canContinue = sender.trim().length > 0 && recipient.trim().length > 0 && letter.trim().length >= 20;
  const currentStep = created ? 6 : step;
  const progress = ["Write", "Personalise", "Arrival", "Seal", "Post", "Share"];
  const minArrival = futureDate(1);
  const maxArrival = futureDate(30);

  const recommendedFormats = useMemo<LetterFormat[]>(() => {
    if (letter.length > 1200) return ["classic", "minimal", "typewriter"];
    if (occasion !== "Just because") return ["festival", "folded", "classic"];
    return ["classic", "photo", "airmail"];
  }, [letter.length, occasion]);

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(DRAFT_KEY);
      if (saved) {
        const draft = JSON.parse(saved) as Partial<Draft>;
        if (typeof draft.sender === "string") setSender(draft.sender);
        if (typeof draft.recipient === "string") setRecipient(draft.recipient);
        if (typeof draft.occasion === "string") setOccasion(draft.occasion);
        if (typeof draft.heading === "string") setHeading(draft.heading);
        if (typeof draft.letter === "string") setLetter(draft.letter);
        if (typeof draft.closing === "string") setClosing(draft.closing);
        if (formats.some((item) => item.id === draft.format)) setFormat(draft.format as LetterFormat);
        if (typeof draft.fromCity === "string") setFromCity(draft.fromCity);
        if (typeof draft.toCity === "string") setToCity(draft.toCity);
        if (typeof draft.arrivalDate === "string") setArrivalDate(draft.arrivalDate);
        if (typeof draft.arrivalTime === "string") setArrivalTime(draft.arrivalTime);
      }
    } catch {
      window.localStorage.removeItem(DRAFT_KEY);
    } finally {
      setDraftReady(true);
    }
  }, []);

  useEffect(() => {
    if (!draftReady) return;
    const draft: Draft = { sender, recipient, occasion, heading, letter, closing, format, fromCity, toCity, arrivalDate, arrivalTime };
    window.localStorage.setItem(DRAFT_KEY, JSON.stringify(draft));
  }, [draftReady, sender, recipient, occasion, heading, letter, closing, format, fromCity, toCity, arrivalDate, arrivalTime]);

  useEffect(() => () => {
    timers.current.forEach((timer) => window.clearTimeout(timer));
    objectUrls.current.forEach((url) => URL.revokeObjectURL(url));
  }, []);

  function later(delay: number, action: () => void) {
    const timer = window.setTimeout(action, delay);
    timers.current.push(timer);
  }

  function resetCeremony(targetStep: number) {
    if (targetStep < 4) {
      setSealState("idle");
      setSealStatus("Ready to seal");
    }
    if (targetStep < 5) {
      setPostState("idle");
      setPostStatus("Ready for the post box");
    }
    setStep(targetStep);
  }

  function insertStarter(text: string) {
    setLetter((current) => current.trim() ? `${current.trim()}\n\n${text}` : text);
  }

  function updatePhoto(id: string, patch: PhotoPatch) {
    setPhotos((current) => current.map((photo) => photo.id === id ? { ...photo, ...patch } : photo));
  }

  function addPhotos(event: ChangeEvent<HTMLInputElement>) {
    setMediaError("");
    const files = Array.from(event.target.files ?? []).slice(0, mediaSlotsLeft);
    const startingIndex = photos.length;
    const added = files.map((file, index): PhotoItem => {
      const id = crypto.randomUUID();
      const url = URL.createObjectURL(file);
      const placement = initialPlacements[startingIndex + index] ?? initialPlacements[0];
      objectUrls.current.add(url);
      const image = new Image();
      image.onload = () => updatePhoto(id, { aspectRatio: clamp(image.naturalWidth / Math.max(1, image.naturalHeight), .55, 1.9) });
      image.src = url;
      return { id, name: file.name, url, caption: "", fit: "cover", zoom: 1, cropX: 50, cropY: 50, x: placement.x, y: placement.y, width: placement.width, aspectRatio: 4 / 3, zIndex: startingIndex + index + 1 };
    });
    setPhotos((current) => [...current, ...added]);
    event.target.value = "";
  }

  function addVoices(event: ChangeEvent<HTMLInputElement>) {
    setMediaError("");
    const added = Array.from(event.target.files ?? []).slice(0, mediaSlotsLeft).map((file) => {
      const url = URL.createObjectURL(file);
      objectUrls.current.add(url);
      return { id: crypto.randomUUID(), name: file.name, url, label: "" };
    });
    setVoices((current) => [...current, ...added]);
    event.target.value = "";
  }

  function addVideo(event: ChangeEvent<HTMLInputElement>) {
    setMediaError("");
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;
    if (!mediaSlotsLeft) return setMediaError("Remove one media item before adding a video.");
    if (videos.length) return setMediaError("Only one video can be added to a letter.");
    if (!file.type.startsWith("video/")) return setMediaError("Choose a video file.");
    if (file.size > MAX_VIDEO_BYTES) return setMediaError("The video must be 50 MB or smaller.");
    const url = URL.createObjectURL(file);
    objectUrls.current.add(url);
    setVideos([{ id: crypto.randomUUID(), name: file.name, url, caption: "", size: file.size }]);
  }

  function removeMedia(kind: "photo" | "voice" | "video", id: string) {
    const remove = <T extends { id: string; url: string }>(items: T[]) => {
      const target = items.find((item) => item.id === id);
      if (target) {
        URL.revokeObjectURL(target.url);
        objectUrls.current.delete(target.url);
      }
      return items.filter((item) => item.id !== id);
    };
    if (kind === "photo") setPhotos(remove);
    if (kind === "voice") setVoices(remove);
    if (kind === "video") setVideos(remove);
  }

  function startSeal() {
    if (sealState !== "idle") return;
    setSealState("sealing");
    setSealStatus("Folding your letter…");
    later(750, () => setSealStatus("Closing the envelope…"));
    later(1500, () => setSealStatus("Pressing the wax seal…"));
    later(2350, () => {
      setSealState("sealed");
      setSealStatus("Your letter is sealed");
    });
  }

  function finishSeal() {
    setSealState("sealed");
    setSealStatus("Your letter is sealed");
  }

  function startPost() {
    if (postState !== "idle" || sealState !== "sealed") return;
    setPostState("posting");
    setPostStatus("Taking it to the post box…");
    later(850, () => setPostStatus("Posting your letter…"));
    later(1750, () => setPostStatus("Marking it for dispatch…"));
    later(2850, () => {
      setPostState("posted");
      setPostStatus("Your letter has been posted");
    });
  }

  function finishPost() {
    setPostState("posted");
    setPostStatus("Your letter has been posted");
  }

  const linkBase = `name=${encodeURIComponent(recipient)}&sender=${encodeURIComponent(sender)}&occasion=${encodeURIComponent(occasion)}&duration=${journeyDays}&from=${encodeURIComponent(fromCity)}&to=${encodeURIComponent(toCity)}&format=${format}&date=${encodeURIComponent(arrivalDate)}&time=${encodeURIComponent(arrivalTime)}`;
  const recipientLink = `/receive/demo?${linkBase}&day=1`;
  const arrivalLink = `/receive/demo?${linkBase}&day=${journeyDays}`;
  const publicShareUrl = `https://intezaar.vercel.app${recipientLink}`;

  async function copyShareLink() {
    await navigator.clipboard?.writeText(publicShareUrl);
    setCopied(true);
    later(1800, () => setCopied(false));
  }

  async function shareLetter() {
    if (navigator.share) {
      await navigator.share({ title: `A letter for ${recipient}`, text: "A private Intezaar letter has been posted for you.", url: publicShareUrl });
      return;
    }
    await copyShareLink();
  }

  const preview = <LetterPreview format={format} sender={sender} recipient={recipient} occasion={occasion} heading={heading} letter={letter} closing={closing} photos={photos} voices={voices} videos={videos} onUpdatePhoto={updatePhoto} onRemovePhoto={(id) => removeMedia("photo", id)} />;

  return (
    <main className="nostalgia-create creation-flow-v2 seal-post-flow">
      <Navigation />
      <section className="nostalgia-create-layout">
        <aside className="nostalgia-create-photo">
          <div className="postal-create-scene" aria-hidden="true"><div className="postal-create-rain" /><div className="postal-create-train" /><div className="postal-create-platform" /><div className="postal-create-box"><span className="postal-create-box-title"><small>डाक</small>INTEZAAR MAIL</span><span className="postal-create-box-slot">LETTERS</span><span className="postal-create-box-wave"><i /><i /><i /></span><span className="postal-create-box-time">NEXT COLLECTION<b>17:00</b></span></div><div className="postal-create-letters"><span className="postal-create-envelope" /><span className="postal-create-envelope" /><span className="postal-create-envelope" /><span className="postal-create-wax">I</span></div></div>
          <div className="postal-create-copy"><p className="nostalgia-eyebrow">Write. Seal. Post. Await.</p><h1>Turn a digital message into something truly sent.</h1><p>Write the letter, choose its arrival, seal the envelope and post it into the Intezaar box.</p></div>
        </aside>

        <div className="nostalgia-create-form-wrap creation-main">
          <nav className="creation-stepper" aria-label="Letter creation progress">
            {progress.map((label, index) => {
              const number = index + 1;
              return <button key={label} type="button" className={currentStep === number ? "active" : currentStep > number ? "complete" : ""} disabled={number > currentStep || created || sealState === "sealing" || postState === "posting"} onClick={() => number < currentStep && resetCeremony(number)}><span>{currentStep > number ? "✓" : number}</span><small>{label}</small></button>;
            })}
          </nav>

          {!created ? (
            <form className="nostalgia-form creation-form" onSubmit={(event: FormEvent<HTMLFormElement>) => event.preventDefault()}>
              {step === 1 ? <section className="nostalgia-form-section creation-panel creation-write-panel">
                <header className="creation-section-head"><div><span>Step 1 of 6</span><h2>Write your letter</h2><p>Say what you want them to receive when the letter arrives.</p></div><small>Draft saves on this device</small></header>
                <div className="nostalgia-form-grid"><label>From<input value={sender} onChange={(event) => setSender(event.target.value)} placeholder="Your name" /></label><label>To<input value={recipient} onChange={(event) => setRecipient(event.target.value)} placeholder="Their name" /></label></div>
                <div className="nostalgia-form-grid"><label>Occasion<select value={occasion} onChange={(event) => setOccasion(event.target.value)}>{occasions.map((item) => <option key={item}>{item}</option>)}</select></label><label>Opening<input value={heading} onChange={(event) => setHeading(event.target.value)} placeholder={`Dear ${recipient || "you"},`} /></label></div>
                <div className="writing-help"><strong>Need a starting line?</strong><div>{writingStarters.map((starter) => <button key={starter.label} type="button" onClick={() => insertStarter(starter.text)}>{starter.label}</button>)}</div></div>
                <label>Your letter<textarea value={letter} onChange={(event) => setLetter(event.target.value)} rows={15} maxLength={MAX_LETTER_CHARS} placeholder="Write what you want them to receive…" /></label>
                <div className="writing-counter"><span>{wordCount} words</span><span>{letter.length.toLocaleString()} / {MAX_LETTER_CHARS.toLocaleString()} characters</span></div>
                <label>Closing<input value={closing} onChange={(event) => setClosing(event.target.value)} placeholder={sender ? `With love, ${sender}` : "With love,"} /></label>
                <div className="nostalgia-form-actions"><button className="nostalgia-button nostalgia-button-primary" type="button" disabled={!canContinue} onClick={() => setStep(2)}>Continue to personalise</button></div>
              </section> : null}

              {step === 2 ? <section className="nostalgia-form-section creation-panel">
                <header className="creation-section-head"><div><span>Step 2 of 6</span><h2>Personalise it</h2><p>Choose the paper and place photos anywhere on the letter.</p></div><small>{mediaCount} of {MAX_MEDIA_ITEMS} media slots used</small></header>
                <section className="recommended-formats"><h3>Suggested for this letter</h3><div>{recommendedFormats.map((id) => { const item = formats.find((entry) => entry.id === id)!; return <button key={id} type="button" className={format === id ? "active" : ""} onClick={() => setFormat(id)}><span className={`format-miniature format-miniature-${id}`} aria-hidden="true"><i /><i /></span><strong>{item.name}</strong><small>{item.description}</small></button>; })}</div></section>
                <details className="format-library-disclosure"><summary>Browse all 10 letter formats <span>Optional</span></summary><div className="letter-format-grid">{formats.map((item) => <button key={item.id} type="button" className={format === item.id ? "active" : ""} onClick={() => setFormat(item.id)}><span className={`format-miniature format-miniature-${item.id}`} aria-hidden="true"><i /><i /></span><strong>{item.name}</strong><small>{item.description}</small></button>)}</div></details>
                <div className="creation-personalise-layout"><div className="compact-media-studio"><header><h3>Optional media</h3><p>Add up to three total items.</p></header><div className="media-choice-row"><label className={mediaSlotsLeft ? "" : "disabled"}>＋ Photo<input type="file" accept="image/*" multiple disabled={!mediaSlotsLeft} onChange={addPhotos} /></label><label className={mediaSlotsLeft ? "" : "disabled"}>＋ Voice<input type="file" accept="audio/*" multiple disabled={!mediaSlotsLeft} onChange={addVoices} /></label><label className={mediaSlotsLeft && !videos.length ? "" : "disabled"}>＋ Video<input type="file" accept="video/*" disabled={!mediaSlotsLeft || Boolean(videos.length)} onChange={addVideo} /></label></div>{mediaError ? <p className="media-error" role="alert">{mediaError}</p> : null}<div className="media-item-list compact-media-list">{photos.length ? <div className="photo-edit-inside-note"><strong>{photos.length} photo{photos.length === 1 ? "" : "s"} placed</strong><span>Drag them directly on the letter. Resize, zoom out, crop and caption below the preview.</span></div> : null}{voices.map((voice, index) => <article className="media-item media-item-audio" key={voice.id}><span className="media-audio-icon">▶</span><div><strong>Voice note {index + 1}</strong><input value={voice.label} onChange={(event) => setVoices((current) => current.map((item) => item.id === voice.id ? { ...item, label: event.target.value } : item))} placeholder="Editable title" /><audio controls src={voice.url} /></div><button type="button" onClick={() => removeMedia("voice", voice.id)}>Remove</button></article>)}{videos.map((video) => <article className="media-item media-item-video" key={video.id}><video controls playsInline src={video.url} /><div><strong>Video · {fileSize(video.size)}</strong><input value={video.caption} onChange={(event) => setVideos((current) => current.map((item) => item.id === video.id ? { ...item, caption: event.target.value } : item))} placeholder="Editable caption" /></div><button type="button" onClick={() => removeMedia("video", video.id)}>Remove</button></article>)}</div><p className="media-privacy-note">Media remains in this browser session until secure storage is connected.</p></div><details className="creation-preview-disclosure" open><summary>Preview what they will open</summary>{preview}</details></div>
                <div className="nostalgia-form-actions"><button className="nostalgia-button nostalgia-button-ghost" type="button" onClick={() => resetCeremony(1)}>Back to writing</button><button className="nostalgia-button nostalgia-button-primary" type="button" onClick={() => setStep(3)}>Choose arrival</button></div>
              </section> : null}

              {step === 3 ? <section className="nostalgia-form-section creation-panel">
                <header className="creation-section-head"><div><span>Step 3 of 6</span><h2>Choose when it should arrive</h2><p>The letter stays sealed until the date and time you choose.</p></div><small>Free during public beta</small></header>
                <div className="journey-duration-cards" role="group" aria-label="Quick arrival choices">{[3, 5, 7].map((days) => <button key={days} type="button" className={journeyDays === days ? "active" : ""} onClick={() => setArrivalDate(futureDate(days))}><strong>{days} days</strong><span>{days === 3 ? "A short wait" : days === 5 ? "A meaningful pause" : "A slower arrival"}</span></button>)}</div>
                <div className="arrival-postal-grid"><section className="arrival-card"><span>Arrival</span><h3>{readableDate(arrivalDate)}</h3><label>Arrival date<input type="date" min={minArrival} max={maxArrival} value={arrivalDate} onChange={(event) => setArrivalDate(event.target.value)} /></label><label>Opening time<input type="time" value={arrivalTime} onChange={(event) => setArrivalTime(event.target.value)} /></label><p>{recipient || "The recipient"} will see a sealed letter before this moment.</p></section><section className="arrival-card postal-route-card"><span>Postal route</span><h3>{fromCity || "Origin"} → {toCity || "Destination"}</h3><label>Posted from<input value={fromCity} onChange={(event) => setFromCity(event.target.value)} /></label><label>Arriving in<input value={toCity} onChange={(event) => setToCity(event.target.value)} /></label><p>The route is cinematic, not live postal or railway tracking.</p></section></div>
                <div className="final-review-strip"><div><small>From</small><strong>{sender}</strong></div><div><small>For</small><strong>{recipient}</strong></div><div><small>Arrival</small><strong>{readableDate(arrivalDate)}</strong></div><div><small>Opens</small><strong>{arrivalTime}</strong></div></div>
                <div className="nostalgia-form-actions"><button className="nostalgia-button nostalgia-button-ghost" type="button" onClick={() => resetCeremony(2)}>Back to personalise</button><button className="nostalgia-button nostalgia-button-primary" type="button" onClick={() => setStep(4)}>Continue to seal</button></div>
              </section> : null}

              {step === 4 ? <section className="nostalgia-form-section creation-panel ceremony-panel">
                <header className="creation-section-head"><div><span>Step 4 of 6</span><h2>Seal the letter</h2><p>This is the moment it stops being a draft and becomes something sent.</p></div><small>{formatName(format)}</small></header>
                <div className={`seal-stage seal-${sealState}`} aria-live="polite"><div className="seal-paper"><span>{heading || `Dear ${recipient},`}</span><i /><i /><i /></div><div className="seal-envelope"><span className="seal-envelope-back" /><span className="seal-envelope-flap" /><span className="seal-wax">I</span><strong>For {recipient}</strong></div><div className="ceremony-status"><span>{sealState === "sealed" ? "SEALED" : "INTEZAAR MAIL"}</span><strong>{sealStatus}</strong></div></div>
                <div className="ceremony-summary"><div><small>From</small><strong>{fromCity}</strong></div><div><small>To</small><strong>{toCity}</strong></div><div><small>Opens</small><strong>{readableDate(arrivalDate)} · {arrivalTime}</strong></div></div>
                <div className="nostalgia-form-actions">{sealState === "idle" ? <><button className="nostalgia-button nostalgia-button-ghost" type="button" onClick={() => resetCeremony(3)}>Go back and edit</button><button className="nostalgia-button nostalgia-button-primary" type="button" onClick={startSeal}>Seal the letter</button></> : null}{sealState === "sealing" ? <button className="nostalgia-button nostalgia-button-ghost" type="button" onClick={finishSeal}>Finish animation</button> : null}{sealState === "sealed" ? <><button className="nostalgia-button nostalgia-button-ghost" type="button" onClick={() => { setSealState("idle"); setSealStatus("Ready to seal"); }}>Unseal and edit</button><button className="nostalgia-button nostalgia-button-primary" type="button" onClick={() => setStep(5)}>Continue to the post box</button></> : null}</div>
              </section> : null}

              {step === 5 ? <section className="nostalgia-form-section creation-panel ceremony-panel post-panel">
                <header className="creation-section-head"><div><span>Step 5 of 6</span><h2>{postState === "posted" ? "Your letter has been posted" : "Post your letter"}</h2><p>{postState === "posted" ? "It will stay sealed until the moment you chose." : "Drop it into the Intezaar box and let the waiting begin."}</p></div><small>{fromCity.toUpperCase()} COLLECTION</small></header>
                <div className={`post-stage post-${postState}`} aria-live="polite"><div className="post-atmosphere"><span /><span /><span /></div><div className="posting-envelope"><span>For {recipient}</span><i>I</i></div><div className="intezaar-postbox"><strong><small>डाक</small>INTEZAAR MAIL</strong><span className="postbox-slot">LETTERS</span><span className="postbox-door"><i>POSTED</i></span><span className="postbox-base" /></div><div className="ceremony-status post-status"><span>{postState === "posted" ? "POSTED" : "FINAL COLLECTION"}</span><strong>{postStatus}</strong></div></div>
                <div className="ceremony-summary"><div><small>Posted from</small><strong>{fromCity}</strong></div><div><small>Going to</small><strong>{toCity}</strong></div><div><small>Arrives</small><strong>{readableDate(arrivalDate)} · {arrivalTime}</strong></div></div>
                <div className="nostalgia-form-actions">{postState === "idle" ? <><button className="nostalgia-button nostalgia-button-ghost" type="button" onClick={() => setStep(4)}>Back to sealed letter</button><button className="nostalgia-button nostalgia-button-primary" type="button" onClick={startPost}>Post the letter</button></> : null}{postState === "posting" ? <button className="nostalgia-button nostalgia-button-ghost" type="button" onClick={finishPost}>Finish animation</button> : null}{postState === "posted" ? <button className="nostalgia-button nostalgia-button-primary" type="button" onClick={() => { setCreated(true); window.scrollTo({ top: 0, behavior: "smooth" }); }}>Continue to share</button> : null}</div>
              </section> : null}
            </form>
          ) : <section className="nostalgia-create-success creation-share-panel posted-share-panel"><p className="nostalgia-eyebrow">Step 6 of 6 · Posted</p><h2>Your letter is on its way.</h2><p>Send the private link to {recipient}. They will see a sealed letter and its arrival date before they can open it.</p><div className="posted-stamp-card"><span>POSTED</span><strong>{fromCity} → {toCity}</strong><p>Opens {readableDate(arrivalDate)} at {arrivalTime}</p></div><div className="share-link-box"><span>Private recipient link</span><code>{publicShareUrl}</code><button type="button" onClick={copyShareLink}>{copied ? "Copied" : "Copy link"}</button></div><div className="nostalgia-success-actions"><button className="nostalgia-button nostalgia-button-primary" type="button" onClick={shareLetter}>Share letter link</button><Link href={recipientLink} className="nostalgia-button nostalgia-button-ghost">Preview recipient journey</Link><Link href={arrivalLink} className="nostalgia-button nostalgia-button-ghost">Preview arrival</Link><button className="nostalgia-button nostalgia-button-ghost" type="button" onClick={() => { setCreated(false); setPostState("posted"); setStep(5); }}>Back to posted letter</button></div><p className="prototype-transfer-note">Beta note: secure transfer of the sender’s actual letter and uploaded media still requires the private backend.</p></section>}
        </div>
      </section>
    </main>
  );
}
