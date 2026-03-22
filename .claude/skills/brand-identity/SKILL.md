---
name: brand-identity
description: "Use when someone asks to analyze brand identity, extract brand guidelines, match a client's brand, get brand colors/fonts from a website, or build a brand reference from a URL or document."
argument-hint: <website-url-or-file-path> [project-name]
---

## What This Skill Does

Extracts a client's complete visual brand identity from their website or brand guidelines document. Produces two output files:

1. **`brand-identity.md`** — Comprehensive reference doc (colors, typography, components, signature patterns, layout)
2. **`brand-kit.css`** — Ready-to-use CSS file with @font-face, CSS variables, and reusable component classes

The outputs are used when building HTML deliverables (case studies, landing pages, audits, strategies) that need to match the client's brand.

**Output location:** `projects/[project]/reference/`

---

## Steps

### Step 1: Determine Input Type and Project

Parse the argument:
- If it's a URL (starts with `http`), this is a **website analysis**
- If it's a file path (ends in `.pdf`, `.png`, `.jpg`, `.pptx`, etc.), this is a **document analysis**
- If a second argument is provided, use it as the project name
- If no project name, ask the user which project this is for (list `projects/` folders)

### Step 2A: Website Analysis (URL provided)

Use Chrome DevTools MCP to extract brand identity from a live website. Run all extractions across **at least 2 pages** (homepage + one inner page like a case study, about, or services page) to capture the full visual language.

**2A.1 — Navigate and capture homepage**
- Navigate to the URL using `mcp__chrome-devtools__navigate_page`
- Take a screenshot of the above-fold area → save to `projects/[project]/reference/screenshots/brand-homepage.png`
- Scroll down and take 1-2 more screenshots of key sections (mid-page, footer CTA)

**2A.2 — Extract CSS variables, computed styles, and colors**

Run this comprehensive extraction script via `mcp__chrome-devtools__evaluate_script`:

```javascript
() => {
  const body = document.body;
  const cs = getComputedStyle(body);

  const getStyles = (el, label) => {
    if (!el) return { label, found: false };
    const s = getComputedStyle(el);
    return {
      label, found: true,
      fontFamily: s.fontFamily, fontSize: s.fontSize, fontWeight: s.fontWeight,
      lineHeight: s.lineHeight, letterSpacing: s.letterSpacing, color: s.color,
      backgroundColor: s.backgroundColor, textTransform: s.textTransform,
      fontStyle: s.fontStyle, borderRadius: s.borderRadius, padding: s.padding
    };
  };

  // CSS custom properties from :root
  const cssVars = {};
  for (const sheet of document.styleSheets) {
    try {
      for (const rule of sheet.cssRules) {
        if (rule.selectorText === ':root') {
          for (const prop of rule.style) {
            if (prop.startsWith('--')) cssVars[prop] = rule.style.getPropertyValue(prop).trim();
          }
        }
      }
    } catch(e) {}
  }

  // All unique colors grouped by type
  const colors = new Map();
  document.querySelectorAll('*').forEach(el => {
    const s = getComputedStyle(el);
    const add = (c, type) => {
      if (c && c !== 'rgba(0, 0, 0, 0)' && c !== 'transparent') {
        const key = c + '|' + type;
        colors.set(key, (colors.get(key) || 0) + 1);
      }
    };
    add(s.color, 'text');
    add(s.backgroundColor, 'bg');
    add(s.borderColor, 'border');
  });
  const topColors = [...colors.entries()]
    .sort((a, b) => b[1] - a[1]).slice(0, 30)
    .map(([key, count]) => { const [color, type] = key.split('|'); return { color, type, count }; });

  // Button variants
  const btns = document.querySelectorAll('button, a[class*="btn"], a[class*="button"], a[class*="cta"], a[class*="Button"], [class*="btn"]');
  const buttonStyles = [...btns].filter(b => b.textContent.trim().length > 0).slice(0, 6).map(btn => {
    const s = getComputedStyle(btn);
    return {
      text: btn.textContent.trim().substring(0, 30),
      bg: s.backgroundColor, color: s.color, border: s.border,
      borderRadius: s.borderRadius, padding: s.padding,
      fontWeight: s.fontWeight, fontSize: s.fontSize, fontFamily: s.fontFamily
    };
  });

  // Styled links (CTA links)
  const styledLinks = [...document.querySelectorAll('a')].filter(a => {
    const s = getComputedStyle(a);
    return s.backgroundColor !== 'rgba(0, 0, 0, 0)' && a.textContent.trim().length > 0;
  }).slice(0, 6).map(a => {
    const s = getComputedStyle(a);
    return {
      text: a.textContent.trim().substring(0, 30),
      bg: s.backgroundColor, color: s.color, border: s.border,
      borderRadius: s.borderRadius, fontWeight: s.fontWeight, fontSize: s.fontSize
    };
  });

  // Fixed/sticky elements (nav)
  const fixedEls = [...document.querySelectorAll('*')].filter(el => {
    const s = getComputedStyle(el);
    return (s.position === 'fixed' || s.position === 'sticky') && el.offsetHeight > 30 && el.offsetHeight < 200;
  }).slice(0, 3).map(el => {
    const s = getComputedStyle(el);
    return {
      tag: el.tagName, className: el.className.toString().substring(0, 60),
      height: s.height, bg: s.backgroundColor,
      backdropFilter: s.backdropFilter || s.webkitBackdropFilter,
      position: s.position, zIndex: s.zIndex
    };
  });

  // Large section backgrounds
  const sectionBgs = [];
  document.querySelectorAll('*').forEach(el => {
    const s = getComputedStyle(el);
    if (el.offsetHeight > 200 && el.offsetWidth > 600 && s.backgroundColor !== 'rgba(0, 0, 0, 0)') {
      const bg = s.backgroundColor;
      if (!sectionBgs.find(x => x.bg === bg)) sectionBgs.push({ bg, borderRadius: s.borderRadius, height: el.offsetHeight });
    }
  });

  // Container widths
  const containers = [];
  document.querySelectorAll('[class*="container"], [class*="wrapper"], [class*="artboard"]').forEach(el => {
    const w = el.offsetWidth;
    if (w > 400 && !containers.find(c => c.width === w)) {
      containers.push({ width: w, maxWidth: getComputedStyle(el).maxWidth });
    }
  });

  return {
    body: { fontFamily: cs.fontFamily, color: cs.color, bg: cs.backgroundColor, fontSize: cs.fontSize, lineHeight: cs.lineHeight },
    h1: getStyles(document.querySelector('h1'), 'h1'),
    h2: getStyles(document.querySelector('h2'), 'h2'),
    h3: getStyles(document.querySelector('h3'), 'h3'),
    p: getStyles(document.querySelector('p'), 'p'),
    cssVars, topColors, buttonStyles, styledLinks, fixedEls,
    sectionBgs: sectionBgs.slice(0, 10),
    containers: containers.slice(0, 5)
  };
}
```

**2A.3 — Extract font usage and unique typography patterns**

Run a second script to find all distinct text style combinations:

```javascript
() => {
  const styles = new Map();
  document.querySelectorAll('*').forEach(el => {
    const s = getComputedStyle(el);
    const text = el.textContent.trim();
    if (text.length > 5 && text.length < 200 && parseFloat(s.fontSize) >= 14 && el.children.length === 0) {
      const key = `${s.fontSize}-${s.fontWeight}-${s.color}-${s.fontStyle}`;
      if (!styles.has(key)) {
        styles.set(key, {
          text: text.substring(0, 60),
          fontFamily: s.fontFamily, fontSize: s.fontSize, fontWeight: s.fontWeight,
          lineHeight: s.lineHeight, color: s.color, fontStyle: s.fontStyle,
          letterSpacing: s.letterSpacing
        });
      }
    }
  });
  return [...styles.values()].slice(0, 25);
}
```

**2A.4 — Capture inner page**

Look for links to case studies, about, or services pages. Navigate to 1 inner page and:
- Take screenshots (above-fold + scrolled)
- Run the same extraction scripts
- Note any patterns not visible on the homepage (dark sections, different heading sizes, card styles)

**2A.5 — Extract card and component patterns**

```javascript
() => {
  const cards = [];
  document.querySelectorAll('*').forEach(el => {
    const s = getComputedStyle(el);
    const br = parseInt(s.borderRadius);
    if (br >= 8 && el.offsetHeight > 50 && el.offsetWidth > 100 && cards.length < 10) {
      cards.push({
        bg: s.backgroundColor, borderRadius: s.borderRadius,
        border: s.border, boxShadow: s.boxShadow,
        padding: s.padding, height: el.offsetHeight, width: el.offsetWidth
      });
    }
  });
  // Deduplicate by bg + borderRadius
  const unique = [];
  const seen = new Set();
  cards.forEach(c => {
    const key = `${c.bg}-${c.borderRadius}`;
    if (!seen.has(key)) { seen.add(key); unique.push(c); }
  });
  return unique;
}
```

**2A.6 — Stylesheet-level extraction**

`getComputedStyle` cannot see gradients, hover states, breakpoints, @font-face URLs, or @keyframes. This script reads raw CSS rule text directly from all linked stylesheets.

```javascript
() => {
  const r = { gradients:[], hoverStates:[], mediaQueries:[], fontFaces:[], keyframes:[], transitions:[], cssVarsAll:{} };
  for (const sheet of document.styleSheets) {
    try {
      for (const rule of sheet.cssRules) {
        if (rule.style) {
          const bg = rule.style.backgroundImage || rule.style.background || '';
          if (bg.includes('gradient')) r.gradients.push({ selector: rule.selectorText, gradient: bg });
          const t = rule.style.transition;
          if (t) r.transitions.push({ selector: rule.selectorText, transition: t });
          for (const prop of rule.style) {
            if (prop.startsWith('--')) r.cssVarsAll[prop] = rule.style.getPropertyValue(prop).trim();
          }
        }
        if (rule.selectorText && /:(hover|focus|active)/.test(rule.selectorText) && rule.style) {
          const styles = {};
          for (const prop of rule.style) styles[prop] = rule.style.getPropertyValue(prop);
          if (Object.keys(styles).length) r.hoverStates.push({ selector: rule.selectorText, styles });
        }
        if (rule.type === CSSRule.MEDIA_RULE) r.mediaQueries.push({ condition: rule.conditionText, rulesCount: rule.cssRules?.length||0 });
        if (rule.type === CSSRule.FONT_FACE_RULE) r.fontFaces.push({ family: rule.style.fontFamily, weight: rule.style.fontWeight, style: rule.style.fontStyle, src: rule.style.src });
        if (rule.type === CSSRule.KEYFRAMES_RULE) r.keyframes.push({ name: rule.name, text: rule.cssText.substring(0,300) });
      }
    } catch(e) {}
  }
  return r;
}
```

**⚠️ CORS fallback — run this if `fontFaces` came back empty:**

Cross-origin stylesheets (CDN subdomains, external hosts) block `cssRules` access silently. The `try/catch` swallows the SecurityError and `fontFaces` returns `[]` even though custom fonts ARE loading.

When `fontFaces` is empty after running 2A.6:

1. Get all stylesheet URLs:
```javascript
() => [...document.styleSheets].map(s => s.href).filter(Boolean)
```

2. Also enumerate actually-loaded fonts via `document.fonts`:
```javascript
() => {
  const fonts = [];
  document.fonts.forEach(f => fonts.push({ family: f.family, weight: f.weight, style: f.style, status: f.status }));
  return fonts.filter(f => f.status === 'loaded');
}
```

3. Use **`WebFetch`** on each stylesheet URL (not `fetch()` from within the page — that also fails on CORS). Search for `@font-face` in the result. The WebFetch tool bypasses browser CORS restrictions and can read the raw CSS text.

4. From the WebFetch result, extract the exact `font-family`, `font-weight`, `font-style`, and `src: url(...)` values for every `@font-face` block found.

**2A.7 — Shadow, border-radius, and border system**

Aggregates all unique values by frequency across the entire DOM. The most-used values reveal the design system's actual scale (sm/md/lg tokens), not just individual component values.

```javascript
() => {
  const shadows=new Map(), borderRadii=new Map(), borders=new Map(), gaps=new Map();
  document.querySelectorAll('*').forEach(el => {
    const s = getComputedStyle(el);
    if (s.boxShadow && s.boxShadow !== 'none') shadows.set(s.boxShadow, (shadows.get(s.boxShadow)||0)+1);
    if (s.borderRadius && s.borderRadius !== '0px') borderRadii.set(s.borderRadius, (borderRadii.get(s.borderRadius)||0)+1);
    if (s.gap && s.gap !== 'normal' && s.gap !== '0px') gaps.set(s.gap, (gaps.get(s.gap)||0)+1);
    if (s.borderTopWidth !== '0px' && s.borderTopColor !== 'rgba(0, 0, 0, 0)') {
      const k = `${s.borderTopWidth} ${s.borderTopStyle} ${s.borderTopColor}`;
      borders.set(k, (borders.get(k)||0)+1);
    }
  });
  const top = m => [...m.entries()].sort((a,b)=>b[1]-a[1]).slice(0,10).map(([v,c])=>({value:v,count:c}));
  return { shadows: top(shadows), borderRadii: top(borderRadii), borders: top(borders), gaps: top(gaps) };
}
```

**2A.8 — Asset inventory**

Captures logo image src, inline SVG marks, favicon URL, and background image URLs. These are the files needed to recreate the visual identity in a new context.

```javascript
() => {
  const logoCandidates = [];
  document.querySelectorAll('header img, nav img, [class*="logo"] img, [id*="logo"] img').forEach(img => {
    logoCandidates.push({ src: img.src, alt: img.alt, width: img.offsetWidth, height: img.offsetHeight });
  });
  const svgLogos = [];
  document.querySelectorAll('header svg, nav svg, [class*="logo"] svg, [id*="logo"] svg').forEach(svg => {
    svgLogos.push({ width: svg.offsetWidth, height: svg.offsetHeight, outerHTML: svg.outerHTML.substring(0,800) });
  });
  const bgImages = new Set();
  document.querySelectorAll('*').forEach(el => {
    const bg = getComputedStyle(el).backgroundImage;
    if (bg && bg !== 'none' && !bg.includes('gradient')) {
      const m = bg.match(/url\(["']?([^"')]+)["']?\)/);
      if (m) bgImages.add(m[1]);
    }
  });
  const favicon = document.querySelector('link[rel="icon"], link[rel="shortcut icon"]');
  return { logoCandidates: logoCandidates.slice(0,5), svgLogos: svgLogos.slice(0,3), bgImages:[...bgImages].slice(0,10), favicon: favicon?.href||null };
}
```

**2A.9 — Layout and grid system**

Extracts section vertical padding rhythm and all unique flexbox/grid layout patterns. The padding rhythm reveals the brand's spatial generosity (tight vs airy). Grid patterns reveal their column conventions.

```javascript
() => {
  const sectionPaddings=new Map(), grids=[], seen=new Set();
  document.querySelectorAll('section, [class*="section"], main > div, main > article').forEach(el => {
    const s=getComputedStyle(el), pt=parseInt(s.paddingTop), pb=parseInt(s.paddingBottom);
    if (pt>20||pb>20) { const k=`${pt}px/${pb}px`; sectionPaddings.set(k,(sectionPaddings.get(k)||0)+1); }
  });
  document.querySelectorAll('*').forEach(el => {
    const s=getComputedStyle(el);
    if ((s.display==='grid'||s.display==='flex') && el.children.length>1) {
      const k=`${s.display}-${s.gridTemplateColumns}-${s.gap}`;
      if (!seen.has(k)) { seen.add(k); grids.push({ display:s.display, columns:s.gridTemplateColumns||'n/a', gap:s.gap, flexWrap:s.flexWrap, childCount:el.children.length }); }
    }
  });
  return {
    sectionPaddings:[...sectionPaddings.entries()].sort((a,b)=>b[1]-a[1]).slice(0,8).map(([v,c])=>({value:v,count:c})),
    grids: grids.slice(0,15)
  };
}
```

### Step 2B: Document Analysis (file provided)

- Read the file using the Read tool (supports PDF, PNG, JPG)
- For PDFs: Read page by page (max 20 pages per request), focusing on pages with color swatches, typography specs, logo usage, and component examples
- For images: Analyze the visual elements directly
- Extract all specified colors (hex codes), font names, weights, and sizes
- Note any spacing rules, grid systems, or component patterns

---

### Step 3: Identify Signature Patterns

Before writing the reference, analyze the extracted data for **signature patterns** — the unique design moves that make this brand recognizable. Look for:

- **Typography patterns**: Weight contrast extremes? Italic accent words? Mixed weights in headlines?
- **Color patterns**: One dominant background color? Dark/light mode sections? Accent color usage rules?
- **Layout patterns**: Full-bleed vs contained sections? Rounded dark blocks? Alternating backgrounds?
- **Component patterns**: Unique button styles? Card treatments? Glassmorphism? Distinctive nav?

Document each pattern with a name, description, and specific CSS values. These are what make a brand-matched deliverable look authentic vs generic.

---

### Step 4: Compile Brand Identity Reference

Create `projects/[project]/reference/brand-identity.md` with this structure:

```markdown
# Brand Identity — [Client Name]

> **Source:** [URL or file path]
> **Extracted:** [date]
> **Font files:** [path if custom fonts were provided]
> **Logo:** [path if logo file exists]

---

## Colors

### Primary Palette

| Role | Name | Hex | RGB | Usage |
|------|------|-----|-----|-------|
| [role] | [name] | #XXXXXX | rgb(X,X,X) | [where it's used] |

### Secondary Palette

| Role | Name | Hex | RGB | Usage |
|------|------|-----|-----|-------|
| [role] | [name] | #XXXXXX | rgb(X,X,X) | [where it's used] |

---

## Typography

### Font Family

- **Primary:** [font stack]
- **Source:** [Google Fonts / custom / Adobe Fonts]
- **Files:** [path to font files, if applicable]
- **Closest Google Fonts alternative:** [suggestion if custom font]

### Type Scale

| Element | Weight | Size | Line Height | Color | Notes |
|---------|--------|------|-------------|-------|-------|
| Hero H1 | [wt] | [px] | [lh] | [hex] | |
| Section H2 | [wt] | [px] | [lh] | [hex] | |
| H3 | [wt] | [px] | [lh] | [hex] | |
| Body | [wt] | [px] | [lh] | [hex] | |
| Nav links | [wt] | [px] | [lh] | [hex] | |
| Labels | [wt] | [px] | [lh] | [hex] | |

### Weight Usage Pattern

| Weight | Name | Usage |
|--------|------|-------|
| [wt] | [name] | [where] |

---

## Signature Patterns

[Number and name each pattern. Describe what makes it unique and the exact CSS values needed to replicate it.]

### 1. [Pattern Name]
[Description + values]

### 2. [Pattern Name]
[Description + values]

---

## Components

### Buttons
| Variant | Background | Border | Text Color | Weight | Radius | Usage |
|---------|-----------|--------|------------|--------|--------|-------|

### Cards
[Describe card styles with exact values]

### Callouts
[Describe callout/highlight styles]

### Navigation
[Describe nav pattern: position, height, background, link styles, CTA button]

### Section Backgrounds
[Describe the alternating background pattern with exact colors]

### Dark/Light Modes
[If the site has both dark and light sections, document each with colors and usage]

---

## Layout

- **Container max-width:** [value]
- **Section padding:** [value]
- **Paragraph gap:** [value]
- **Background alternation pattern:** [describe]

---

## Spacing & Rhythm

- **Base unit:** [Xpx — infer from most common gap/padding increments]
- **Scale:** [X / X / X / X / X / X]
- **Section vertical padding:** [X top / X bottom]
- **Component internal padding:** [X]
- **Grid / flex gap:** [X desktop, X mobile]

---

## Shadow System

| Token | Value | Usage |
|-------|-------|-------|
| none | — | flat elements |
| sm | [value] | cards on light bg |
| md | [value] | modals, dropdowns |
| lg | [value] | hero elements |

(If brand uses no shadows: "None — flat design, no shadows.")

---

## Gradients

| Name | CSS | Usage |
|------|-----|-------|
| [name] | `linear-gradient(...)` | [where used] |

(If no gradients: "None — brand uses flat color fills only.")

---

## Motion & Animation

- **Default transition:** [e.g. `all 0.25s ease`]
- **Button hover easing:** [value or "none"]
- **Notable animations:** [list @keyframe names + what they do, or "none"]
- **Scroll-triggered elements:** yes/no

---

## Assets

- **Logo (light bg):** [URL or "inline SVG — see screenshots"]
- **Logo (dark bg):** [URL or n/a]
- **Favicon:** [URL]
- **Background patterns/images:** [list or "none"]

---

## Hover States

| Element | Property | Default | Hover |
|---------|----------|---------|-------|
| Primary button | background | #XXXX | #XXXX |
| Card | transform | none | translateY(-Xpx) |
| Nav link | color | #XXXX | #XXXX |
| [add all interactive elements found] | | | |

---

## Breakpoints

| Name | Condition | Key changes |
|------|-----------|-------------|
| tablet | max-width: [Xpx] | [what collapses/changes] |
| mobile | max-width: [Xpx] | [font sizes, stack layout] |

---

## Logo

- **File:** [path]
- **Colors:** [list]
- **Usage notes:** [describe variants — on light bg, on dark bg, mark only vs full]

---

## Font Files

[If custom fonts: list available weights, paths, and which are actually used on the site]

| File | Weight | Used On Site |
|------|--------|-------------|

**Minimum required for brand accuracy:** [list essential weights]

---

## Visual References

Screenshots in `projects/[project]/reference/screenshots/`:
- [list each screenshot with description]

---

## Notes

- [Platform the site is built on, if detectable]
- [Any patterns that deviate from standard web conventions]
- [Warnings about colors or patterns that shouldn't be overused]
- [Things to watch out for when implementing]

---

## Recreation Brief

> This section is a compact, self-contained brief. Feed it into any prompt to recreate the brand visually — without needing the full reference doc.

**Colors:**
- Primary bg: #XXXX | Body text: #XXXX | Accent/CTA: #XXXX
- Dark section bg: #XXXX | Dark section text: #XXXX
- [continue all semantic roles with hex values]

**Typography:**
- Font: `'FontName', Arial, sans-serif`
- H1: Xpx / weight X / line-height X
- H2: Xpx / weight X / line-height X
- Body: Xpx / weight X / line-height X / color #XXXX
- Labels: Xpx / weight X / [uppercase yes/no]

**Spacing:**
- Base unit: Xpx. Section padding: Xpx vertical. Component padding: Xpx. Gap: Xpx.

**Borders & Radius:**
- Radius scale: Xpx (small/tags) / Xpx (cards) / Xpx (buttons) / [full if used]
- Borders: [none / 1px solid #XXXX / 2px solid #XXXX]

**Shadows:**
- Cards: `[exact value]` | Modals: `[exact value]` | (or "none — flat design")

**Gradients:**
- [paste exact CSS value(s)] | (or "none — flat fills only")

**Motion:**
- Default transition: `[value]`. Button hover: `[value]`. (or "none")

**Signature Patterns:**
1. [Name]: [1-sentence description] → `[key CSS to replicate it]`
2. [Name]: [1-sentence description] → `[key CSS to replicate it]`
3. [Name]: [1-sentence description] → `[key CSS to replicate it]`

**Component Recipes (paste-ready CSS):**

*Primary button:*
```css
background: #XXXX; color: #XXXX; border-radius: Xpx; padding: Xpx Xpx;
font-weight: X; font-size: Xpx; border: [value]; transition: [value];
/* hover */ background: #XXXX;
```

*Card:*
```css
background: #XXXX; border-radius: Xpx; padding: Xpx; box-shadow: [value]; border: [value];
/* hover */ transform: translateY(-Xpx); box-shadow: [value];
```

*Dark section:*
```css
background: #XXXX; color: #XXXX; padding: Xpx 0;
```

*Nav:*
```css
background: #XXXX; height: Xpx; position: [sticky/fixed];
/* link */ color: #XXXX; /* link hover */ color: #XXXX;
```

*Footer:*
```css
background: #XXXX; color: #XXXX; padding: Xpx;
```
```

---

### Step 5: Build Brand Kit CSS

Create `projects/[project]/reference/brand-kit.css` containing:

**5.1 — @font-face declarations**
- If font files exist in the project's reference folder, write `@font-face` rules pointing to them
- Include only the weights actually used on the site
- Use `font-display: swap` for performance

**5.2 — CSS custom properties**
```css
:root {
  /* Colors — use --[prefix]-[role] naming */
  --[prefix]-dark: #XXXXXX;
  --[prefix]-primary-bg: #XXXXXX;
  --[prefix]-cta: #XXXXXX;
  --[prefix]-accent: #XXXXXX;
  /* ... all colors from the palette */

  /* Font */
  --[prefix]-font: '[Font]', [fallback], sans-serif;

  /* Layout */
  --[prefix]-container: [max-width];
  --[prefix]-radius-sm: Xpx;
  --[prefix]-radius-md: Xpx;
  --[prefix]-radius-lg: Xpx;
  --[prefix]-nav-height: Xpx;
}
```

Use a 2-3 letter prefix derived from the client name (e.g., `sm` for Socialmind, `ph` for Pure Harmony).

**5.3 — Base styles**
- Reset, html/body, font-smoothing
- Container classes

**5.4 — Typography classes**
- h1–h4 default styles
- `.accent` class for the signature accent pattern (if applicable)
- `.lead`, `.body-light`, `.label` utility classes

**5.5 — Section classes**
- `.section-white`, `.section-[color]`, `.section-dark` with appropriate text color overrides

**5.6 — Component classes**
- Button variants: `.btn-primary`, `.btn-cta`, `.btn-dark`, `.btn-nav`
- Cards: `.card`, `.card-dark`, `.card-bordered`
- Stat cards: `.stat-card`, `.stat-number`, `.stat-label`
- Callouts: `.callout`, `.callout-[color]`
- Testimonials: `.testimonial`, `.attribution`
- Checklists: `.checklist-item`, `.checklist-icon`, `.checklist-text`
- Nav: `.nav`, `.nav-inner`, `.nav-logo`, `.nav-links`
- Footer CTA: `.footer-cta`

**5.7 — Utility classes**
- Text color: `.text-dark`, `.text-white`, `.text-[accent]`
- Background: `.bg-[color]`
- Spacing: `.mb-X`, `.mt-X`

**5.8 — Responsive breakpoints**
- Scale down headings, padding, and components for tablet/mobile
- Use the actual breakpoints extracted in Step 2A.6 (not assumed values)

**5.9 — Hover states**
Every interactive component class (`.btn-primary`, `.card`, `.nav a`, `.checklist-item`) must include a `:hover` rule with the values from the Hover States table.

**5.10 — Transitions**
Every interactive component class must include a `transition` property. Use the value from the Motion section; fall back to `all 0.2s ease` only if none found.

**5.11 — Gradient utilities**
For each gradient in the Gradient Catalog, add a class:
```css
.gradient-[name] { background: [gradient CSS]; }
```
If no gradients, skip this section.

**5.12 — Shadow utilities**
```css
.shadow-sm { box-shadow: [sm value]; }
.shadow-md { box-shadow: [md value]; }
.shadow-lg { box-shadow: [lg value]; }
```
If brand uses no shadows, skip this section.

**5.13 — File header comment block**
Add at the very top of the CSS file:
```css
/*
 * Brand Kit — [Client Name]
 * Source: [URL]
 * Extracted: [date]
 *
 * Primary bg: #XXXX | Text: #XXXX | Accent: #XXXX
 * Font: [FontName] | Radius: Xpx (cards) / Xpx (buttons)
 * Shadows: [yes/no] | Gradients: [yes/no] | Motion: [transition value]
 */
```

---

### Step 6: Build Test Page (Optional but Recommended)

Create `projects/[project]/reference/brand-test.html` — a single-page showcase of all brand components:
- Color swatches
- Typography scale with heading examples
- Signature pattern demos
- All button variants
- Card and component examples
- Dark section example
- Footer CTA example

Open it in Chrome via `mcp__chrome-devtools__navigate_page` so the user can review it visually.

---

### Step 7: Font File Handling

If the primary font is NOT a Google Font, follow this sequence — try each step before escalating to the next:

**Step 7A — Try to download directly from the CDN**

If `@font-face` src URLs were found (either from 2A.6 or the WebFetch fallback), the font files are likely publicly accessible. Download them with `curl`:

```bash
mkdir -p projects/[project]/reference/fonts
curl -sL "[woff2-url]" -o projects/[project]/reference/fonts/[font-name]-[weight].woff2
# Repeat for each weight file
```

Verify file sizes are non-zero (`ls -la`). If files download successfully (>5KB), use them directly — no need to ask the user.

**Step 7B — Audit exactly which weight files exist**

This is critical. A font may be named with weight 300/400/700 in CSS but only have ONE actual file. Using weight values without matching files causes the browser to synthesize bold/thin, which looks wrong.

After downloading, **count the files**. If a font has only one file:
- Use `font-weight: normal` for ALL declarations of that font in brand-kit.css
- Do NOT assign weight 300, 500, 700, 900 — these will all render identically from the single file but signal incorrect intent
- Document in brand-identity.md: "Single-weight font — only `normal` weight available"

If multiple weights exist, map each file to its correct weight value.

**Step 7C — If CDN download fails, ask the user**

Only if Step 7A fails (files redirect, return HTML, or CDN blocks direct download):
- Note the font name and suggest the closest Google Fonts alternative
- Ask: "The font [name] is custom — can you get the .woff2 files from the client's web team?"
- If files are provided: save to `reference/fonts/`, write `@font-face` rules
- If not available: use the Google Fonts substitute in `brand-kit.css`, note it's an approximation

**Step 7D — Update @font-face declarations in brand-kit.css**

Write `@font-face` rules with:
- Paths **relative to the CSS file location** (`fonts/[filename].woff2`)
- Only the weights that have actual files
- `font-display: swap`
- Remove any Google Fonts `@import` if real fonts are now available

---

### Step 8: Verify

- Read the generated `brand-identity.md` — ensure all hex values are present
- Open `brand-test.html` in Chrome (if created) and compare against screenshots
- Cross-reference key colors and fonts against the live site
- Flag any uncertain values in the Notes section

### Step 9: Report

Tell the user:
- Where files were saved (list all output files)
- Summary: number of colors, font family, key signature patterns identified
- Any values that need manual verification
- Font status: custom font available or using approximation
- If test page was created, it's open in Chrome for review

---

## Notes

- This skill extracts **visual identity only** — not brand voice, messaging, or tone
- Always convert RGB/HSL to hex in the final output for consistency
- If a website uses a custom/paid font, note the font name AND suggest the closest free (Google Fonts) approximation
- For websites with multiple distinct sections (different color schemes per section), document ALL variations in the dark/light modes section
- Screenshots should be saved to `projects/[project]/reference/screenshots/` — create the directory if it doesn't exist
- If Chrome DevTools MCP is not available, fall back to `WebFetch` for basic extraction and ask the user to provide screenshots manually
- Do NOT guess colors from screenshots alone when CSS extraction is possible — always prefer computed styles
- The CSS variable prefix should be consistent across all files for a project
- `brand-kit.css` paths are relative to the reference folder — when deploying to reports/, font paths may need updating

### Font accuracy rules (learned from battle testing)

**Single-weight fonts**: Many brand fonts ship with only one weight file. If there's only one `@font-face` src URL for a family, use `font-weight: normal` everywhere for that font in brand-kit.css. Do NOT assign 300/700/900 — the browser will synthesize them from the single file and the result looks wrong (artificially thin or artificially bold).

**`font-weight: normal` vs number**: When computed styles return `lineHeight: "normal"` and `letterSpacing: "normal"` for a custom font, record them as `normal` — not as pixel values. These values come from the font's own internal metrics. Google Font substitutes will look wrong because they have different intrinsic metrics, which is the main reason substitute fonts feel "off" even at the correct size.

**Cross-origin stylesheet CORS**: Sites that serve CSS from a CDN subdomain (e.g. cdn.example.com while the page is on example.com) will have their `cssRules` blocked by CORS. The `try/catch` in script 2A.6 silently swallows this — `fontFaces`, `hoverStates`, and `gradients` all return empty. Always cross-check with the `document.fonts` API and WebFetch fallback (see 2A.6 CORS fallback section).

**Download over asking**: If @font-face src URLs are found (whether from cssRules or WebFetch), try `curl` downloading them before asking the user. Brand fonts on a company's own CDN are almost always publicly accessible. Only escalate to asking the user if the download fails.
