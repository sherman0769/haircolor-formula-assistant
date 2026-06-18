"use client";

import { useEffect, useRef } from "react";
import { track } from "@vercel/analytics";
import { APP_VERSION } from "@/lib/app-meta";

export function HomeVisitTracker() {
  const tracked = useRef(false);

  useEffect(() => {
    if (tracked.current) {
      return;
    }

    tracked.current = true;
    track("Homepage view", {
      version: APP_VERSION,
      release: "free-beta",
    });
  }, []);

  return null;
}
