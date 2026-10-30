import { useCallback, useEffect, useState } from "react";

/** Chrome/Edge/Android's install event (not in the TS DOM types). */
type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
};

const isStandalone = () =>
  window.matchMedia?.("(display-mode: standalone)").matches ||
  (navigator as Navigator & { standalone?: boolean }).standalone === true;

const isIos = () =>
  /iphone|ipad|ipod/i.test(navigator.userAgent) ||
  // iPadOS reports itself as a Mac with touch
  (navigator.userAgent.includes("Macintosh") && navigator.maxTouchPoints > 1);

/**
 * How this device can install the app:
 * - "prompt": the browser offers a native install dialog (Android/desktop Chrome, Edge)
 * - "ios": Safari has no prompt — show Share → Add to Home Screen instructions
 * - null: already installed, or the browser can't install it
 */
export const useInstallPrompt = () => {
  const [deferred, setDeferred] = useState<BeforeInstallPromptEvent | null>(null);
  const [installed, setInstalled] = useState(isStandalone);

  useEffect(() => {
    const onPrompt = (event: Event) => {
      event.preventDefault(); // show our own button instead of the mini-infobar
      setDeferred(event as BeforeInstallPromptEvent);
    };
    const onInstalled = () => {
      setInstalled(true);
      setDeferred(null);
    };
    window.addEventListener("beforeinstallprompt", onPrompt);
    window.addEventListener("appinstalled", onInstalled);
    return () => {
      window.removeEventListener("beforeinstallprompt", onPrompt);
      window.removeEventListener("appinstalled", onInstalled);
    };
  }, []);

  const install = useCallback(async () => {
    if (!deferred) return;
    await deferred.prompt();
    await deferred.userChoice;
    setDeferred(null);
  }, [deferred]);

  const mode = installed ? null : deferred ? "prompt" : isIos() ? "ios" : null;
  return { mode, install } as const;
};
