---
name: Vitalis-360 Clinical Intelligence
colors:
  surface: '#101415'
  surface-dim: '#101415'
  surface-bright: '#363a3b'
  surface-container-lowest: '#0b0f10'
  surface-container-low: '#191c1e'
  surface-container: '#1d2022'
  surface-container-high: '#272a2c'
  surface-container-highest: '#323537'
  on-surface: '#e0e3e5'
  on-surface-variant: '#bbcabf'
  inverse-surface: '#e0e3e5'
  inverse-on-surface: '#2d3133'
  outline: '#86948a'
  outline-variant: '#3c4a42'
  surface-tint: '#4edea3'
  primary: '#4edea3'
  on-primary: '#003824'
  primary-container: '#10b981'
  on-primary-container: '#00422b'
  inverse-primary: '#006c49'
  secondary: '#bec6e0'
  on-secondary: '#283044'
  secondary-container: '#3f465c'
  on-secondary-container: '#adb4ce'
  tertiary: '#adc6ff'
  on-tertiary: '#002e6a'
  tertiary-container: '#71a1ff'
  on-tertiary-container: '#00367a'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#6ffbbe'
  primary-fixed-dim: '#4edea3'
  on-primary-fixed: '#002113'
  on-primary-fixed-variant: '#005236'
  secondary-fixed: '#dae2fd'
  secondary-fixed-dim: '#bec6e0'
  on-secondary-fixed: '#131b2e'
  on-secondary-fixed-variant: '#3f465c'
  tertiary-fixed: '#d8e2ff'
  tertiary-fixed-dim: '#adc6ff'
  on-tertiary-fixed: '#001a42'
  on-tertiary-fixed-variant: '#004395'
  background: '#101415'
  on-background: '#e0e3e5'
  surface-variant: '#323537'
typography:
  display-lg:
    fontFamily: Inter
    fontSize: 48px
    fontWeight: '600'
    lineHeight: 56px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Inter
    fontSize: 32px
    fontWeight: '600'
    lineHeight: 40px
    letterSpacing: -0.01em
  headline-lg-mobile:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  title-md:
    fontFamily: Inter
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  label-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '500'
    lineHeight: 20px
    letterSpacing: 0.01em
  label-sm:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  unit: 4px
  gutter: 24px
  margin-desktop: 40px
  margin-mobile: 16px
  card-padding: 24px
  stack-gap: 16px
---

## Brand & Style

This design system is built for a premium AI healthcare sentinel, balancing high-tech precision with deep clinical empathy. The aesthetic follows a **Corporate / Modern** direction with a focus on high-performance data visualization and human-centric clarity. 

The personality is authoritative yet non-alarmist—functioning as a calm, watchful guardian rather than a source of stress. The UI evokes a sense of "clinical futurism" through deep obsidian surfaces, vibrant biological-status indicators, and exceptionally crisp typography. Every element is designed to minimize cognitive load while ensuring critical medical data is instantly legible and actionable.

## Colors

The palette is anchored in a sophisticated dark-mode architecture to reduce eye strain for clinicians in varied lighting environments. 

- **Primary (Emerald Green):** Reserved for "Healthy" status, successful AI validation, and primary action calls. It symbolizes stability.
- **Secondary (Deep Slate):** The foundational canvas, providing a deep, non-distracting background.
- **Surface & Surface-Light:** Used for containment and interaction feedback, creating clear hierarchical separation between global navigation and data modules.
- **Semantic Colors:** Critical (Red) and Warning (Amber) are used sparingly to ensure "alert fatigue" is avoided. Blue is used exclusively for navigation and information-rich badges.

## Typography

The typography utilizes **Inter** for its exceptional legibility in data-dense interfaces. A strict contrast between SemiBold weights for headings and Regular weights for body text ensures a clear information hierarchy.

- **Headlines:** Use tight letter-spacing to feel modern and authoritative.
- **Labels:** Small labels use medium/bold weights to ensure readability at small scales, particularly for medical units and timestamps.
- **Mobile Scaling:** Large displays scale down by approximately 25% for mobile screens to maintain screen real estate for charts and vitals.

## Layout & Spacing

This design system employs a **Fluid Grid** model with a 12-column structure on desktop and a 4-column structure on mobile. 

- **Generous Whitespace:** To maintain a "non-alarmist" atmosphere, elements are given significant breathing room (24px default gutters).
- **Responsive Behavior:** On desktop, the layout utilizes side-panels for global navigation and patient lists. On mobile, these collapse into a bottom navigation bar and drawer system.
- **Safe Zones:** High-priority vitals are always anchored to the top of the viewport or card group to ensure they are the first elements scanned.

## Elevation & Depth

Hierarchy is established through **Tonal Layering** and **Low-Contrast Outlines** rather than heavy shadows.

- **Base Layer:** Deep Slate (#0F172A).
- **Content Layer:** Surface (#1E293B) with a subtle 1px border (#334155).
- **Active Layer:** Elements that require immediate focus use a very soft, diffused ambient shadow (0px 8px 24px rgba(0,0,0,0.4)) and a primary-colored glow if they represent a healthy, active state.
- **Interactions:** Hover states shift background color from Surface to Surface-Light, providing immediate tactile feedback without changing the elevation height.

## Shapes

The design system uses a **Rounded** (0.5rem) aesthetic. This choice softens the clinical nature of the product, making the AI feel more approachable and "human-in-the-loop."

- **Cards:** Use `rounded-lg` (1rem) to create a friendly, containerized feel for complex datasets.
- **Status Pills:** Use `rounded-full` (Pill-shaped) for status indicators like "Stable" or "At Risk" to distinguish them from interactive buttons.
- **Selection Controls:** Checkboxes and radio buttons retain the standard 4px rounding to feel professional.

## Components

- **Buttons:** Primary buttons are Emerald Green with white text. Secondary buttons are outlined in Surface-Light. All buttons feature a 0.2s transition on hover.
- **Health Chips:** Status indicators for vitals. They must include both a color-coded dot and text (e.g., Green dot + "Normal") to ensure accessibility for colorblind users.
- **Clinical Cards:** The core unit of the UI. They should have a consistent header (Icon + Title + Action) and a padded body area for charts or data grids.
- **Validation Icons:** High-contrast Ticks (Emerald) and Crosses (Critical) are used for "Human-in-the-loop" verification steps.
- **Input Fields:** Filled style with Surface-Light background. The active state is indicated by a 2px Emerald Green bottom border or ring.
- **Vitals Monitor:** A specialized component featuring a large-scale numerical value, a trend sparkline (using Primary/Warning/Critical colors), and a unit label.