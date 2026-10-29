import type { IconName } from "@/lib/modules";

const PATHS: Record<IconName, string> = {
  home: "M3 11l9-8 9 8M5 10v10h5v-6h4v6h5V10",
  chart: "M5 20v-7M12 20V5M19 20v-11",
  users: "M16 20v-1.5a3.5 3.5 0 0 0-3.5-3.5h-5A3.5 3.5 0 0 0 4 18.5V20M10 11a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7M20 20v-1.5a3.5 3.5 0 0 0-2.6-3.4M15.5 4.2a3.5 3.5 0 0 1 0 6.6",
  flask: "M9 3h6M10 3v6.2L4.8 18a2 2 0 0 0 1.7 3h11a2 2 0 0 0 1.7-3L14 9.2V3M7.2 14h9.6",
  handshake: "M12 7.5 9.9 5.6a2.2 2.2 0 0 0-3 0L3 9.2l4 4.3M12 7.5l2.1-1.9a2.2 2.2 0 0 1 3 0L21 9.2l-4 4.3M12 7.5 9 10.3a1.7 1.7 0 0 0 2.3 2.4l1.2-1.1 3.2 3a1.6 1.6 0 0 1-2.2 2.3l-.6-.5a1.6 1.6 0 0 1-2.3 2.1l-3.5-3.2",
  mail: "M4 6h16v12H4zM4 7l8 6 8-6",
  inbox: "M4 13l2-7h12l2 7v5H4zM4 13h5l1 2h4l1-2h5",
  ticket: "M3 9V6h18v3a2.5 2.5 0 0 0 0 5v3H3v-3a2.5 2.5 0 0 0 0-5zM14 6v12",
  shield: "M12 3l7 3v5c0 4.5-3 8-7 10-4-2-7-5.5-7-10V6z",
  list: "M8 6h12M8 12h12M8 18h12M4 6h.01M4 12h.01M4 18h.01",
  image: "M4 5h16v14H4zM4 16l5-5 4 4 3-3 4 4M9 9.5h.01",
  chevron: "M9 6l6 6-6 6",
};

export default function Icon({ name, className }: { name: IconName; className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d={PATHS[name]} />
    </svg>
  );
}
