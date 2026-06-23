# Design Language: Coderthemes Design - Full-stack software, web design & development

> Extracted from `https://coderthemes.com` on June 4, 2026
> 295 elements analyzed

This document describes the complete design language of the website. It is structured for AI/LLM consumption — use it to faithfully recreate the visual design in any framework.

## Color Palette

### Primary Colors

| Role | Hex | RGB | HSL | Usage Count |
|------|-----|-----|-----|-------------|
| Primary | `#2f75d0` | rgb(47, 117, 208) | hsl(214, 63%, 50%) | 21 |
| Secondary | `#ff0000` | rgb(255, 0, 0) | hsl(0, 100%, 50%) | 12 |
| Accent | `#007bff` | rgb(0, 123, 255) | hsl(211, 100%, 50%) | 4 |

### Neutral Colors

| Hex | HSL | Usage Count |
|-----|-----|-------------|
| `#000000` | hsl(0, 0%, 0%) | 74 |
| `#ffffff` | hsl(0, 0%, 100%) | 51 |
| `#6c757d` | hsl(208, 7%, 46%) | 40 |
| `#96a6b7` | hsl(211, 19%, 65%) | 30 |
| `#7c8bad` | hsl(222, 23%, 58%) | 16 |
| `#444444` | hsl(0, 0%, 27%) | 10 |
| `#343a40` | hsl(210, 10%, 23%) | 7 |
| `#495057` | hsl(210, 9%, 31%) | 4 |
| `#edf0f3` | hsl(210, 20%, 94%) | 4 |
| `#c1c1c1` | hsl(0, 0%, 76%) | 1 |
| `#cccccc` | hsl(0, 0%, 80%) | 1 |

### Background Colors

Used on large-area elements: `#ffffff`, `#fafaff`, `#f8f9fa`, `#343a40`

### Text Colors

Text color palette: `#000000`, `#374760`, `#007bff`, `#444444`, `#6c757d`, `#ffffff`, `#2f75d0`, `#dc3545`, `#ffc107`, `#28a745`

### Full Color Inventory

| Hex | Contexts | Count |
|-----|----------|-------|
| `#374760` | text, border | 311 |
| `#000000` | text, border | 74 |
| `#ffffff` | background, text, border | 51 |
| `#6c757d` | text, border | 40 |
| `#96a6b7` | text, border | 30 |
| `#2f75d0` | background, border, text | 21 |
| `#7c8bad` | text, border | 16 |
| `#ff0000` | text, border | 12 |
| `#444444` | text, border | 10 |
| `#dc3545` | text, border | 8 |
| `#343a40` | text, border, background | 7 |
| `#007bff` | text, border | 4 |
| `#ffc107` | text, border | 4 |
| `#28a745` | text, border | 4 |
| `#17a2b8` | text, border | 4 |
| `#495057` | text | 4 |
| `#edf0f3` | border | 4 |
| `#c1c1c1` | border | 1 |
| `#cccccc` | border | 1 |

## Typography

### Font Families

- **hkgrotesk** — used for all (260 elements)

### Type Scale

| Size (px) | Size (rem) | Weight | Line Height | Letter Spacing | Used On |
|-----------|------------|--------|-------------|----------------|---------|
| 42px | 2.625rem | 500 | 56px | normal | h2 |
| 36px | 2.25rem | 400 | 54px | normal | i |
| 32px | 2rem | 500 | 38.4px | normal | h2 |
| 28px | 1.75rem | 400 | 42px | normal | i, h3, span |
| 20px | 1.25rem | 400 | 30px | normal | a, img, button, i |
| 16px | 1rem | 400 | 18.4px | normal | html, head, meta, title |
| 14px | 0.875rem | 400 | 21px | normal | input, textarea |
| 13px | 0.8125rem | 700 | 30px | 0.65px | a, i, div, button |

### Heading Scale

```css
h2 { font-size: 42px; font-weight: 500; line-height: 56px; }
h2 { font-size: 32px; font-weight: 500; line-height: 38.4px; }
h3 { font-size: 28px; font-weight: 400; line-height: 42px; }
h5 { font-size: 20px; font-weight: 400; line-height: 30px; }
h6 { font-size: 16px; font-weight: 400; line-height: 18.4px; }
```

### Body Text

```css
body { font-size: 16px; font-weight: 400; line-height: 18.4px; }
```

### Font Weights in Use

`400` (263x), `500` (24x), `700` (5x), `600` (3x)

## Spacing

**Base unit:** 2px

| Token | Value | Rem |
|-------|-------|-----|
| spacing-4 | 4px | 0.25rem |
| spacing-48 | 48px | 3rem |
| spacing-54 | 54px | 3.375rem |
| spacing-70 | 70px | 4.375rem |
| spacing-88 | 88px | 5.5rem |
| spacing-95 | 95px | 5.9375rem |
| spacing-150 | 150px | 9.375rem |
| spacing-190 | 190px | 11.875rem |
| spacing-200 | 200px | 12.5rem |
| spacing-210 | 210px | 13.125rem |
| spacing-230 | 230px | 14.375rem |
| spacing-308 | 308px | 19.25rem |

## Border Radii

| Label | Value | Count |
|-------|-------|-------|
| sm | 3px | 3 |
| full | 50px | 4 |

## Box Shadows

**sm** — blur: 3px
```css
box-shadow: rgba(0, 0, 0, 0.2) 2px 2px 3px 0px;
```

## CSS Custom Properties

### Colors

```css
--primary: #007bff;
--secondary: #6c757d;
```

### Spacing

```css
--font-family-monospace: SFMono-Regular,Menlo,Monaco,Consolas,"Liberation Mono","Courier New",monospace;
```

### Typography

```css
--font-family-sans-serif: -apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,"Noto Sans",sans-serif,"Apple Color Emoji","Segoe UI Emoji","Segoe UI Symbol","Noto Color Emoji";
```

### Other

```css
--light: #f8f9fa;
--yellow: #ffc107;
--indigo: #6610f2;
--green: #28a745;
--pink: #e83e8c;
--purple: #6f42c1;
--breakpoint-xs: 0;
--teal: #20c997;
--gray-dark: #343a40;
--breakpoint-md: 768px;
--breakpoint-sm: 576px;
--breakpoint-lg: 992px;
--blue: #007bff;
--white: #fff;
--danger: #dc3545;
--success: #28a745;
--gray: #6c757d;
--warning: #ffc107;
--red: #dc3545;
--info: #17a2b8;
--dark: #343a40;
--cyan: #17a2b8;
--breakpoint-xl: 1200px;
--orange: #fd7e14;
```

### Semantic

```css
success: [object Object];
warning: [object Object];
error: [object Object];
info: [object Object];
```

## Breakpoints

| Name | Value | Type |
|------|-------|------|
| xs | 369px | min-width |
| xs | 380px | max-width |
| sm | 576px | min-width |
| md | 768px | min-width |
| lg | 992px | min-width |
| 1200px | 1200px | min-width |

## Transitions & Animations

**Easing functions:** `[object Object]`, `[object Object]`

**Durations:** `0.15s`, `0.5s`, `0s`, `0.3s`

### Common Transitions

```css
transition: all;
transition: color 0.15s ease-in-out, background-color 0.15s ease-in-out, border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
transition: border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
transition: 0.5s;
transition: visibility 0s linear 0.3s, opacity 0.3s linear;
```

## Component Patterns

Detected UI component patterns and their most common styles:

### Buttons (3 instances)

```css
.button {
  background-color: rgb(47, 117, 208);
  color: rgb(255, 255, 255);
  font-size: 13px;
  font-weight: 600;
  padding-top: 14px;
  padding-right: 22px;
  border-radius: 4px;
}
```

### Cards (3 instances)

```css
.card {
  background-color: rgb(255, 255, 255);
  border-radius: 4px;
  padding-top: 24px;
  padding-right: 24px;
}
```

### Inputs (5 instances)

```css
.input {
  background-color: rgb(248, 249, 250);
  color: rgb(73, 80, 87);
  border-color: rgb(237, 240, 243);
  border-radius: 4px;
  font-size: 14px;
  padding-top: 6px;
  padding-right: 12px;
}
```

### Links (14 instances)

```css
.link {
  color: rgb(68, 68, 68);
  font-size: 16px;
  font-weight: 400;
}
```

### Navigation (15 instances)

```css
.navigatio {
  color: rgb(55, 71, 96);
  padding-top: 0px;
  padding-bottom: 0px;
  padding-left: 0px;
  padding-right: 0px;
  position: static;
}
```

### Footer (5 instances)

```css
.foote {
  background-color: rgb(52, 58, 64);
  color: rgb(150, 166, 183);
  padding-top: 0px;
  padding-bottom: 0px;
  font-size: 16px;
}
```

### Dropdowns (1 instances)

```css
.dropdown {
  border-radius: 0px;
  border-color: rgb(0, 0, 0);
  padding-top: 0px;
}
```

### Switches (1 instances)

```css
.switche {
  border-radius: 4px;
}
```

## Component Clusters

Reusable component instances grouped by DOM structure and style similarity:

### Button — 1 instance, 1 variant

**Variant 1** (1 instance)

```css
  background: rgb(47, 117, 208);
  color: rgb(255, 255, 255);
  padding: 14px 22px 14px 22px;
  border-radius: 4px;
  border: 1px 1px 2px solid rgb(47, 117, 208) rgb(47, 117, 208) rgba(0, 0, 0, 0.15);
  font-size: 13px;
  font-weight: 600;
```

### Card — 3 instances, 1 variant

**Variant 1** (3 instances)

```css
  background: rgb(255, 255, 255);
  color: rgb(55, 71, 96);
  padding: 24px 24px 24px 24px;
  border-radius: 4px;
  border: 0px none rgb(55, 71, 96);
  font-size: 16px;
  font-weight: 400;
```

### Input — 3 instances, 1 variant

**Variant 1** (3 instances)

```css
  background: rgb(248, 249, 250);
  color: rgb(73, 80, 87);
  padding: 6px 12px 6px 15px;
  border-radius: 4px;
  border: 1px solid rgb(237, 240, 243);
  font-size: 14px;
  font-weight: 400;
```

### Input — 1 instance, 1 variant

**Variant 1** (1 instance)

```css
  background: rgb(248, 249, 250);
  color: rgb(73, 80, 87);
  padding: 6px 12px 6px 15px;
  border-radius: 4px;
  border: 1px solid rgb(237, 240, 243);
  font-size: 14px;
  font-weight: 400;
```

### Button — 1 instance, 1 variant

**Variant 1** (1 instance)

```css
  background: rgb(47, 117, 208);
  color: rgb(255, 255, 255);
  padding: 14px 22px 14px 22px;
  border-radius: 4px;
  border: 1px 1px 2px solid rgb(47, 117, 208) rgb(47, 117, 208) rgba(0, 0, 0, 0.15);
  font-size: 13px;
  font-weight: 600;
```

## Layout System

**0 grid containers** and **21 flex containers** detected.

### Container Widths

| Max Width | Padding |
|-----------|---------|
| 1140px | 15px |
| 50% | 15px |
| 100% | 15px |
| 33.3333% | 15px |
| 83.3333% | 15px |

### Flex Patterns

| Direction/Wrap | Count |
|----------------|-------|
| row/nowrap | 4x |
| row/wrap | 14x |
| column/nowrap | 3x |

## Accessibility (WCAG 2.1)

**Overall Score: 100%** — 2 passing, 0 failing color pairs

### Passing Color Pairs

| Foreground | Background | Ratio | Level |
|------------|------------|-------|-------|
| `#ffffff` | `#2f75d0` | 4.59:1 | AA |

## Design System Score

**Overall: 92/100 (Grade: A)**

| Category | Score |
|----------|-------|
| Color Discipline | 92/100 |
| Typography Consistency | 90/100 |
| Spacing System | 100/100 |
| Shadow Consistency | 100/100 |
| Border Radius Consistency | 100/100 |
| Accessibility | 100/100 |
| CSS Tokenization | 100/100 |

**Strengths:** Tight, disciplined color palette, Consistent typography system, Well-defined spacing scale, Clean elevation system, Consistent border radii, Strong accessibility compliance, Good CSS variable tokenization

**Issues:**
- 1044 !important rules — prefer specificity over overrides
- 85% of CSS is unused — consider purging
- 4598 duplicate CSS declarations

## Z-Index Map

**3 unique z-index values** across 3 layers.

| Layer | Range | Elements |
|-------|-------|----------|
| modal | 2000000000,2000000000 | div, div, div.g.-.r.e.c.a.p.t.c.h.a.-.b.u.b.b.l.e.-.a.r.r.o.w |
| sticky | 10,10 | i.u.i.l. .u.i.l.-.c.l.a.p.p.e.r.-.b.o.a.r.d. .t.e.x.t.-.p.r.i.m.a.r.y, i.u.i.l. .u.i.l.-.m.o.b.i.l.e.-.a.n.d.r.o.i.d. .t.e.x.t.-.p.r.i.m.a.r.y, i.u.i.l. .u.i.l.-.b.r.o.w.s.e.r. .t.e.x.t.-.p.r.i.m.a.r.y |
| base | 1,1 | nav.n.a.v.b.a.r. .n.a.v.b.a.r.-.e.x.p.a.n.d.-.l.g. .n.a.v.b.a.r.-.c.u.s.t.o.m, div.a.n.i.m.a.t.i.o.n.-.e.f.f.e.c.t.-.1, div.a.n.i.m.a.t.i.o.n.-.e.f.f.e.c.t.-.2 |

**Issues:**
- [object Object]

## Image Style Patterns

| Pattern | Count | Key Styles |
|---------|-------|------------|
| thumbnail | 2 | objectFit: fill, borderRadius: 0px, shape: square |

**Aspect ratios:** 1:1 (2x)

## Motion Language

**Feel:** smooth · **Scroll-linked:** yes

### Duration Tokens

| name | value | ms |
|---|---|---|
| `xs` | `150ms` | 150 |
| `md` | `300ms` | 300 |
| `lg` | `500ms` | 500 |

### Easing Families

- **ease-in-out** (6 uses) — `ease`
- **linear** (1 uses) — `linear`

## Component Anatomy

### input — 4 instances


### card — 3 instances

**Slots:** heading, description

### button — 2 instances

**Slots:** label
**Variants:** primary
**Sizes:** lg

## Brand Voice

**Tone:** friendly · **Pronoun:** we→you · **Headings:** Title Case (tight)

### Top CTA Verbs

- **contact** (1)
- **submit** (1)

### Button Copy Patterns

- "contact us" (1×)
- "submit" (1×)

### Sample Headings

> We Design & Develop modern software and web applications
> Our Expertise
> Development Services
> About
> +
> +
> +
> Let's Talk Further

## Page Intent

**Type:** `landing` (confidence 0.75)
**Description:** Coderthemes design is a full-stack software, web design and development company focusing on providing the high quality software services.

## Section Roles

Reading order (top→bottom): nav → hero → content → content → content → hero → footer

| # | Role | Heading | Confidence |
|---|------|---------|------------|
| 0 | nav | — | 0.9 |
| 1 | hero | We Design & Develop modern software and web applications | 0.85 |
| 2 | content | Our Expertise | 0.3 |
| 3 | content | Development Services | 0.3 |
| 4 | content | About | 0.3 |
| 5 | hero | Let's Talk Further | 0.4 |
| 6 | footer | — | 0.95 |

## Material Language

**Label:** `flat` (confidence 0)

| Metric | Value |
|--------|-------|
| Avg saturation | 0.397 |
| Shadow profile | soft |
| Avg shadow blur | 0px |
| Max radius | 50px |
| backdrop-filter in use | no |
| Gradients | 0 |

## Imagery Style

**Label:** `icon-only` (confidence 0.6)
**Counts:** total 2, svg 1, icon 3, screenshot-like 0, photo-like 0
**Dominant aspect:** square-ish
**Radius profile on images:** square

## Component Library

**Detected:** `bootstrap` (confidence 0.8)

Evidence:
- bootstrap utility hits: 5

## Quick Start

To recreate this design in a new project:

1. **Install fonts:** Add `hkgrotesk` from Google Fonts or your font provider
2. **Import CSS variables:** Copy `variables.css` into your project
3. **Tailwind users:** Use the generated `tailwind.config.js` to extend your theme
4. **Design tokens:** Import `design-tokens.json` for tooling integration
