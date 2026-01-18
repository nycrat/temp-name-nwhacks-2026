"use client";

import { getLiveClasses } from "@/lib/server";
import Home from "./home";
import { INITIAL_LIVE_CLASSES } from "@/lib/constants";
import { use } from "react";

export default async function HomePage() {
  const liveClasses = getLiveClasses();
  return <Home liveClasses={liveClasses} />
}
