# Third-party skills

This repo vendors Agent Skills from the following upstream projects. License
files are kept under `.claude/skills/_vendor/<project>/LICENSE`.

- **taste-skill** — https://github.com/leonxlnx/taste-skill (MIT)
  Installed as: `design-taste-frontend`, `design-taste-frontend-v1`, `gpt-taste`,
  `image-to-code`, `imagegen-frontend-web`, `imagegen-frontend-mobile`,
  `brandkit`, `redesign-existing-projects`, `high-end-visual-design`,
  `full-output-enforcement`, `minimalist-ui`, `industrial-brutalist-ui`,
  `stitch-design-taste`.

- **impeccable** — https://github.com/pbakaus/impeccable (Apache 2.0)
  Installed as: `impeccable` skill, `impeccable-*` agents under
  `.claude/agents/`, and the design-detector hooks in `.claude/settings.json`.

# MCP servers

- **higgsfield** — `https://mcp.higgsfield.ai/mcp` (configured in `.mcp.json`).
  Remote HTTP MCP server, OAuth-protected. On first use, Claude Code will
  prompt you to authenticate with your Higgsfield account — no API key needed.
