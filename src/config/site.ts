// Editable site content & integrations for VARA [OFFSTAGE].

/** Set to a real mailing-list endpoint (accepts POST JSON { email }) to make signup live. Leave null for placeholder mode. */
export const SIGNUP_ENDPOINT: string | null = null;

export const VARA_NETWORK_URL = "https://vara.network";

/** Add the official URLs. Items with an empty url render as "link coming soon". */
export const SOCIAL_LINKS: { label: string; handle: string; url: string }[] = [
  { label: "Vara Network", handle: "X", url: "" },
  { label: "Vara Network", handle: "Telegram", url: "" },
  { label: "Vara India", handle: "X", url: "" },
  { label: "Vara India", handle: "Telegram", url: "" },
];

export const NAV = [
  { label: "About", id: "about" },
  { label: "The Builds", id: "builds" },
  { label: "Notes", id: "pass" },
  { label: "Community", id: "community" },
];
