# Anti-Slop Guidelines (Active by Default)

You use **antislop** (Anti Slop: Rules for AI Coding Agents). It is a filter, not a style guide: it stops generic AI slop in generated UI, copy, mobile layouts, accessibility, and code, without prescribing aesthetics.
Mode is set to **during** mode as global preference (`antislop active: during (global preference)`). Always apply these rules automatically without requiring the user to load skills with `/skill`.

## Core Principles
1. **Purpose Test**: Every visual and copy decision must have an articulated reason. If the only reason is "it's the AI default" or "it looks techy", reject or rework it.
2. **Distinct Character**: If the logo and product name were swapped out, the design must still feel unique and tailored to the subject.
3. **Craftsmanship & Functional Completeness**: Every button, input, or interactive element must work or not exist. No non-functional decoration.
4. **Resilience**: Layouts must hold up across mobile, tablet, and desktop breakpoints without clipping, text collision, or horizontal overflow.

## Hard Bans & AI Slop Red Flags to Eliminate
- **NO Generic Gradients & Glow**: Avoid purple-to-blue, cyan-to-purple gradients, or glowing background orbs that scream "AI template".
- **NO Excessive Glassmorphism / Blur**: Do not stack blur across navbars, cards, modals, and sidebars simultaneously.
- **NO Uniform Pill-Shaped Radius**: Do not make every card, input, button, and badge an identical rounded pill.
- **NO Fake Content & Buzzwords**: Ban empty marketing jargon ("revolutionary", "seamless", "next-gen", "elevate", "cutting-edge"). Never invent fake statistics ("99.9% uptime", "10k+ users") or fake testimonials with AI avatars.
- **NO Copy-Paste Feature Grids**: Do not default to 3 identical feature cards with Lucide icons (sparkle, lightning, star). Vary rhythm and structure based on actual content.
- **NO Broken Mobile**: Always verify responsive behavior, tap target sizes (min 44x44px), and readable line lengths.
- **NO AI Code Comment Slop**: Never write redundant comments like `// import react`, `// button component`, `// handle click`.

## Skills Reference:
- Core filter: `C:/Users/dudis/.gemini/config/skills/antislop/SKILL.md`
- UI / visual: `C:/Users/dudis/.gemini/config/skills/antislop-ui/SKILL.md`
- Copy & text: `C:/Users/dudis/.gemini/config/skills/antislop-copywriting/SKILL.md`
- People / accessibility: `C:/Users/dudis/.gemini/config/skills/antislop-human/SKILL.md`
- Mobile / responsive: `C:/Users/dudis/.gemini/config/skills/antislop-layoutmobile/SKILL.md`
- Code comments: `C:/Users/dudis/.gemini/config/skills/antislop-code/SKILL.md`

---

# Taste-Skill Frontend Art Direction (Active by Default)

You use **Taste-Skill** (design-taste-frontend / taste-skill v2). Art direction for websites, interfaces, and frontends distilled from curated award-level sites.
Always apply these design standards automatically without requiring the user to invoke `/skill`.

## Core Art Direction Principles
1. **Idea from the Subject**:
   - The concept must come from what makes this specific project unique (its true materials, history, location, actual constraints, real user rituals) rather than a generic SaaS boilerplate.
   - Ground the design in real context. Inventory 8-12 specific things that belong to this subject and competitor sites lack.
2. **High-Craft Typography**:
   - Make deliberate typographic choices: strong editorial pairings, intentional hierarchy and scale, confident display headings.
   - Avoid generic browser fallbacks or thoughtless monospace defaults.
3. **Intentional Palettes & Substance**:
   - Choose cohesive, characterful color systems. Deep, nuanced tones over rainbow neon accents.
   - Substance over thin ornament: prefer larger purposeful typography, whole fields of color, and authentic imagery over decorative badges and divider lines.
4. **Content-Driven Section Blueprints**:
   - Build sections that serve claims and evidence. Avoid the predictable template sequence (hero -> logo cloud -> 3 identical cards -> FAQ -> CTA).
   - Use asymmetric, editorial, staggered, or purpose-built layouts matching the content.
5. **Real-World Inspection & Refinement**:
   - Scrutinize your output: look at spacing, line-heights, contrast, and visual rhythm.
   - Eliminate ornamental fluff that adds no informational value.

## Skills Reference:
- Default Art Direction (v2): `C:/Users/dudis/.gemini/config/skills/taste-skill/SKILL.md`
- Redesign Existing Projects: `C:/Users/dudis/.gemini/config/skills/redesign-skill/SKILL.md`
- Minimalist Direction: `C:/Users/dudis/.gemini/config/skills/minimalist-skill/SKILL.md`
- Brutalist Direction: `C:/Users/dudis/.gemini/config/skills/brutalist-skill/SKILL.md`
- Soft & High-End Visual Design: `C:/Users/dudis/.gemini/config/skills/soft-skill/SKILL.md`
- Brandkit: `C:/Users/dudis/.gemini/config/skills/brandkit/SKILL.md`
- Image to Code: `C:/Users/dudis/.gemini/config/skills/image-to-code-skill/SKILL.md`
