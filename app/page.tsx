import { getLiveClasses } from "@/lib/server";
import Home from "./home";

export default async function HomePage() {
  const liveClasses = getLiveClasses();
  return <Home liveClasses={liveClasses} />;
}
