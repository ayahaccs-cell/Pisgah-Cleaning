'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

/**
 * Video modal.
 *
 * Opens over a blurred dark backdrop, plays the supplied file with native
 * controls, and stops playback on every exit path: the close button, the
 * Escape key, and a tap on the backdrop.
 *
 * The frame adapts to the video's real aspect ratio, read once from
 * loadedmetadata. The supplied shift footage is 9:16, so a hard aspect-video
 * frame would have letterboxed it with heavy bars on both sides. This way a
 * portrait clip fills a portrait frame and a future landscape replacement fills
 * a landscape one, with no code change.
 *
 * Accessibility: labelled dialog, focus moved to the close button on open,
 * focus trapped inside the frame, focus returned to the trigger on close, and
 * the page behind is locked from scrolling.
 */

type Props = {
  open: boolean;
  onClose: () => void;
  src: string;
  poster?: string;
  title: string;
  closeLabel: string;
};

export function VideoModal({ open, onClose, src, poster, title, closeLabel }: Props) {
  const frameRef = useRef<HTMLDivElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const closeRef = useRef<HTMLButtonElement | null>(null);
  const returnFocusRef = useRef<HTMLElement | null>(null);

  /* Portrait until the file says otherwise. Matches the current asset, so the
     frame does not resize visibly once metadata arrives. */
  const [ratio, setRatio] = useState('9 / 16');

  const stopAndClose = useCallback(() => {
    const video = videoRef.current;
    if (video) {
      video.pause();
      video.currentTime = 0;
    }
    onClose();
  }, [onClose]);

  /* Remember what opened the modal so focus can go back there. */
  useEffect(() => {
    if (!open) return;
    returnFocusRef.current = document.activeElement as HTMLElement | null;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    closeRef.current?.focus();
    return () => {
      document.body.style.overflow = previousOverflow;
      returnFocusRef.current?.focus?.();
    };
  }, [open]);

  /* Escape closes. Tab is trapped inside the frame. */
  useEffect(() => {
    if (!open) return;
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        event.preventDefault();
        stopAndClose();
        return;
      }
      if (event.key !== 'Tab') return;
      const frame = frameRef.current;
      if (!frame) return;
      const focusable = frame.querySelectorAll<HTMLElement>(
        'button:not([disabled]), video, [tabindex]:not([tabindex="-1"])',
      );
      if (focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [open, stopAndClose]);

  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={title}
      onClick={stopAndClose}
      className="fixed inset-0 z-[300] flex items-center justify-center bg-black/85 p-4 backdrop-blur-md sm:p-6"
    >
      <div
        ref={frameRef}
        /* Stops a click on the frame from reaching the backdrop handler. */
        onClick={(event) => event.stopPropagation()}
        className="relative w-full max-w-4xl"
      >
        <button
          ref={closeRef}
          type="button"
          onClick={stopAndClose}
          aria-label={closeLabel}
          className="focus-ring-ink u-press tap absolute -top-2 end-0 z-10 flex h-11 w-11 -translate-y-full items-center justify-center rounded-full bg-white/10 text-xl leading-none text-white transition-colors duration-fast ease-feedback hover:bg-white/20 sm:h-12 sm:w-12"
        >
          <span aria-hidden="true">&#10005;</span>
        </button>

        <div
          className="video-frame overflow-hidden rounded-2xl bg-black shadow-diffuse-ink"
          style={{ aspectRatio: ratio }}
        >
          <video
            ref={videoRef}
            src={src}
            poster={poster}
            controls
            autoPlay
            playsInline
            preload="metadata"
            onLoadedMetadata={(event) => {
              const el = event.currentTarget;
              if (el.videoWidth > 0 && el.videoHeight > 0) {
                setRatio(`${el.videoWidth} / ${el.videoHeight}`);
              }
            }}
            className="h-full w-full object-contain"
          >
            {title}
          </video>
        </div>
      </div>
    </div>
  );
}

export default VideoModal;
