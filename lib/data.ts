export type ProjectDomain = "blockchain" | "backend" | "frontend";

export type Project = {
  id: string;
  domain: ProjectDomain;
  tags: string[];
};

export const projects: Project[] = [
  {
    id: "payments",
    domain: "blockchain",
    tags: ["Blockchain", "Solana", "EVM", "Node.js", "AWS"],
  },
  {
    id: "platform",
    domain: "backend",
    tags: ["TypeScript", "AWS", "Node.js", "API Design"],
  },
  {
    id: "onboarding",
    domain: "frontend",
    tags: ["React", "Next.js", "TypeScript", "Performance"],
  },
];

export type EngExp = {
  id: string;
};

export const engineeringExperience: EngExp[] = [
  { id: "vudy" },
  { id: "u3tech" },
  { id: "udevhouse" },
  { id: "freelance" },
  { id: "anywhere" },
];

export type EarlierExp = {
  id: string;
};

export const earlierExperience: EarlierExp[] = [
  { id: "barista" },
  { id: "avionics" },
  { id: "audio" },
  { id: "autoshop" },
  { id: "tourism" },
];

export const siteLinks = {
  email: "josmfernandez@gmail.com",
  github: "https://github.com/jmanywhere",
  linkedin: "https://www.linkedin.com/in/semiinvader",
};
