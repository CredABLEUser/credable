"use client";

import { useEffect, useRef } from "react";
import { markProgress } from "@/lib/actions/school";

export function LessonViewTracker({ pathwayId, lessonId, alreadyStarted }: { pathwayId: string; lessonId: string; alreadyStarted: boolean }) {
  const fired = useRef(false);
  useEffect(() => {
    if (fired.current || alreadyStarted) return;
    fired.current = true;
    markProgress(pathwayId, lessonId, "in_progress");
  }, [pathwayId, lessonId, alreadyStarted]);
  return null;
}
