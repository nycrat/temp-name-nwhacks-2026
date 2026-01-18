"use client";

import Home from "./home";
import { NowProvider } from "@/components/NowProvider";

export default function HomePage() {
  // const liveClasses = getLiveClasses(new Date());
  return (
    <NowProvider>
      <Home />
    </NowProvider>
  );
}
