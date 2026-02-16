# Test Eyes Dashboard - 3 Minimalist Design Concepts

## Design 1: "Obsidian Pulse"

### Color Palette
- **Background**: `#0D0D0D` (near-black)
- **Surface/Cards**: `#1A1A1A` (elevated dark)
- **Primary Accent**: `#00FF88` (electric mint green)
- **Text Primary**: `#FFFFFF` (white)
- **Text Secondary**: `#666666` (muted gray)
- **Error/Failure**: `#FF3366` (only for failure indicators)

### Typography
- **Font Family**: Inter (or system-ui as fallback)
- **Headings**: Inter 600 (semi-bold), tracking -0.02em
- **Body/Table**: Inter 400 (regular), 14px
- **Numbers/Data**: JetBrains Mono, 13px

### Layout
- Single column layout, full-width tables
- 32px padding on container, 24px between sections
- Tables have no visible borders, use spacing and subtle dividers

### Key Visual Elements
- 2px `#00FF88` vertical bar on left of each card
- Horizontal duration bars in Slowest Tests section
- Row hover: Background shifts to `#222222`

### What Makes It Unique
Electric mint accent against deep black creates high contrast. Horizontal duration bars provide instant visual comparison.

---

## Design 2: "Carbon Grid"

### Color Palette
- **Background**: `#121212` (carbon black)
- **Surface/Cards**: `#1E1E1E` (elevated)
- **Grid Lines**: `#2A2A2A` (subtle structure)
- **Primary Accent**: `#4A9EFF` (soft blue)
- **Text Primary**: `#E5E5E5` (soft white)
- **Text Secondary**: `#808080` (medium gray)

### Typography
- **Font Family**: IBM Plex Sans + IBM Plex Mono
- **Section Headers**: uppercase, letter-spacing 0.08em
- **Numbers**: IBM Plex Mono, tabular-nums

### Layout
- Two-column grid: narrow left sidebar (240px), main content right
- CSS Grid with 24px gap
- Dotted borders for subtle structure

### Key Visual Elements
- Dotted borders create technical/blueprint feel
- Metric cards: Large numbers (32px) with small caps labels
- Progress underlines under test names

### What Makes It Unique
Technical, engineering-focused aesthetic. Sidebar with key metrics gives executive-summary at a glance.

---

## Design 3: "Void Minimal"

### Color Palette
- **Background**: `#000000` (pure black)
- **Text Primary**: `#FAFAFA` (near-white)
- **Text Secondary**: `#525252` (dark gray)
- **Dividers**: `#262626` (barely visible lines)

### Typography
- **Font Family**: Geist (Vercel's font) or SF Pro Display
- **Dashboard Title**: Light weight (300), 28px
- **Section Headers**: 11px, uppercase, letter-spacing 0.15em

### Layout
- Single column, centered content (max-width: 720px)
- No cards, no boxes - pure typography hierarchy
- 48px between sections, 24px between items

### Key Visual Elements
- No containers - content floats on pure black
- Dot leaders (`···`) connect test name to duration
- Inline meta on second line in secondary color

### What Makes It Unique
Radical minimalism - pure typography creates hierarchy. Reading-focused experience like a document.

---

## Recommendation

**Design 1 "Obsidian Pulse"** is recommended for Test Eyes because:
1. High contrast for data visibility
2. Accent color draws attention to important metrics
3. Familiar dashboard pattern, easy to scan
4. Duration bars make slow tests immediately obvious
