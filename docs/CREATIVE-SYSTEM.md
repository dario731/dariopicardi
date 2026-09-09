# Creative system

## Concept — “The Route”

One continuous line runs through the site: from Calabria, through the markets where the career was built, to Miami. It is the signature interaction on the homepage (a route line that draws as the reader scrolls through six chapters) and the structure of the Global Career page (a timeline tied to a world map whose arcs converge on Miami). Everything else is typography, photography, rules and space.

The narrative progression is fixed and appears in the same order everywhere:
Italian Roots → Merchant Instinct → Academic Discipline → Global Executive → Miami → Entrepreneurship & Investment → BIZ & STYLE → Business, Wealth & Lifestyle → Family, Purpose & Legacy.

## Palette (`src/styles/tokens.css`)

| Token | Value | Use |
|---|---|---|
| `--notte` | `#0c0b0a` | Near-black ground (hero, framework, closing bands) |
| `--avorio` | `#f4eee3` | Warm ivory ground (reading sections) |
| `--lino` | `#ebe3d4` | Raised ivory surface |
| `--bronzo` / `--bronzo-2` | `#a5834f` / `#c4a575` | Bronze — hairlines, markers, route line, focus. Never a fill. |
| `--tirreno` | `#1e4c63` | Mediterranean blue — only in the map's water glow |
| `--sabbia`, `--pietra`, `--fumo`, `--calce`, `--grafite` | — | Muted text and rules per ground |

Three grounds alternate down every page (`.g-ivory`, `.g-lino`, `.g-notte`). Colour never carries meaning alone.

## Typography

- **Newsreader Variable** (opsz + wght, self-hosted) — every statement, title, pull quote, number and name. Weight 380 for display, italic for emphasis inside titles (`<em>` in copy strings).
- **Inter Variable** — body, interface, eyebrows, numerals in tables.
- Scale: `--fs-display` (hero) → `--fs-1` (page/chapter) → `--fs-2` (section) → `--fs-3` (statement) → lede → body → small → eyebrow. All `clamp()`-based; mobile is designed, not compressed (`--fs-display` bottoms at 2.75rem).

## Motion

- Reveal on entry (opacity + 18px) via one IntersectionObserver; masked image reveal (`.mask`).
- **Route line** (home): SVG stroke-dashoffset driven by scroll progress; markers fill as the line passes.
- **Map arcs** (career): draw once on entry; hover/focus highlights a place, tooltip on desktop, list on all devices.
- **Framework** (home): accessible tabs that cycle every 3.8s until the reader interacts.
- Count-up on stats keeps the final value in the DOM.
- View transitions (fade) between pages.
- Every animation is disabled under `prefers-reduced-motion`; no information is conveyed only by motion.

## Photography rules

Authentic only. Warm, low-saturation grade (`.media--warm`) or monochrome (`.media--mono`). No stock, no skyline video, no staged handshake. Every missing photograph renders a labelled placeholder with a manifest ID (see CHECKLISTS.md → Asset replacement). Family photographs are never published without approval.

## Component inventory

| Area | Components |
|---|---|
| Layout | `Header`, `Footer`, `Seo`, `ConsentBanner`, `BaseLayout` |
| Editorial | `EditorialHero`, `Statement`, `Stats`, `PullQuote`, `ImageNarrative`, `CtaBand`, `Breadcrumbs`, `LegalPage` |
| Home | `Hero`, `Journey` (route line), `Instinct`, `GlobalStrip`, `Framework`, `BizStyleIntro`, `Personal` |
| Career | `Timeline`, `GlobalMap`, `Organizations` |
| Perspectives | `Index` (categories, search, pagination, empty state), `ArticleCard`, `Share`, `AuthorCard` |
| Connect | `ContactForm` |
| UI | `Title` (line breaks + italics from copy strings), `Arrow` |

## Voice

Executive, precise, human, globally minded, confident but never arrogant. Verified facts only. The banned-phrase list from the brief is enforced by `npm run lint`.
