"use client";

import { useRef, useState } from "react";

function slugify(label: string) {
  return label.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

/**
 * Drag-to-spin viewer. Pass multiple `frames` (real multi-angle photos) for a
 * true frame-cycling 360 spin. With a single frame, it falls back to a
 * perspective tilt driven by the drag — same gesture, honest about only
 * having one real angle until more photography is available.
 */
export default function Spin360Viewer({
  frames,
  alt,
}: {
  frames: string[];
  alt: string;
}) {
  const [frameIndex, setFrameIndex] = useState(0);
  const [tilt, setTilt] = useState(0);
  const [dragging, setDragging] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const dragStartX = useRef(0);
  const dragStartFrame = useRef(0);
  const dragStartTilt = useRef(0);

  const multiFrame = frames.length > 1;
  const src = multiFrame ? frames[frameIndex] : frames[0];
  const fallbackSrc = `https://picsum.photos/seed/${slugify(alt)}/1600/1000`;

  const onDragStart = (clientX: number) => {
    setDragging(true);
    dragStartX.current = clientX;
    dragStartFrame.current = frameIndex;
    dragStartTilt.current = tilt;
  };

  const onDragMove = (clientX: number) => {
    if (!dragging) return;
    const delta = clientX - dragStartX.current;
    if (multiFrame) {
      const framesPerPixel = 6;
      const steps = Math.round(delta / framesPerPixel);
      const next = (((dragStartFrame.current - steps) % frames.length) + frames.length) % frames.length;
      setFrameIndex(next);
    } else {
      const next = Math.max(-25, Math.min(25, dragStartTilt.current + delta / 6));
      setTilt(next);
    }
  };

  const onDragEnd = () => {
    setDragging(false);
    if (!multiFrame) setTilt(0);
  };

  return (
    <div
      className={`group relative aspect-[16/9] w-full select-none overflow-hidden rounded-2xl bg-mhero-fog ${
        dragging ? "cursor-grabbing" : "cursor-grab"
      }`}
      onMouseDown={(e) => onDragStart(e.clientX)}
      onMouseMove={(e) => onDragMove(e.clientX)}
      onMouseUp={onDragEnd}
      onMouseLeave={onDragEnd}
      onTouchStart={(e) => onDragStart(e.touches[0].clientX)}
      onTouchMove={(e) => onDragMove(e.touches[0].clientX)}
      onTouchEnd={onDragEnd}
      style={{ perspective: 1200 }}
    >
      <div
        className="absolute inset-0 transition-transform duration-300 ease-out"
        style={{ transform: `rotateY(${tilt}deg)`, transformStyle: "preserve-3d" }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={src || fallbackSrc}
          alt={alt}
          className="absolute inset-0 h-full w-full object-contain"
          draggable={false}
        />
      </div>

      {/* Expand */}
      <button
        onClick={() => setExpanded(true)}
        aria-label="Expand viewer"
        className="absolute end-4 top-4 flex h-9 w-9 items-center justify-center rounded-full border border-mhero-black/15 bg-white/80 text-mhero-black opacity-0 backdrop-blur-sm transition-opacity group-hover:opacity-100"
      >
        <ExpandIcon />
      </button>

      {/* Drag hint */}
      <div className="pointer-events-none absolute inset-x-0 bottom-4 flex justify-center">
        <span className="rounded-full bg-mhero-black/70 px-4 py-2 text-xs font-medium uppercase tracking-widest2 text-white opacity-0 backdrop-blur-sm transition-opacity group-hover:opacity-100">
          Drag to spin
        </span>
      </div>

      {expanded && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 p-6"
          onClick={() => setExpanded(false)}
        >
          <button
            aria-label="Close"
            className="absolute end-6 top-6 flex h-10 w-10 items-center justify-center rounded-full border border-white/30 text-white hover:border-white"
          >
            ✕
          </button>
          <div className="relative h-[80vh] w-full max-w-5xl">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={src || fallbackSrc}
              alt={alt}
              className="h-full w-full object-contain"
            />
          </div>
        </div>
      )}
    </div>
  );
}

function ExpandIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path
        d="M6 2H2v4M10 2h4v4M6 14H2v-4M10 14h4v-4"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
