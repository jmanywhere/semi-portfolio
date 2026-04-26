export type ProjectDomain = "blockchain" | "backend" | "frontend";

export type Project = {
  id: string;
  domain: ProjectDomain;
  tags: string[];
  links?: Array<{
    labelKey: string;
    href: string;
    localizedPath?: string;
  }>;
};

export const projects: Project[] = [
  {
    id: "payments",
    domain: "blockchain",
    tags: ["Blockchain", "Solana", "EVM", "Node.js", "AWS"],
    links: [
      {
        labelKey: "landing",
        href: "https://vudy.app",
      },
      {
        labelKey: "app",
        href: "https://vudy.app",
        localizedPath: "login",
      },
      {
        labelKey: "previous",
        href: "https://vudy.me/login",
      },
    ],
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
