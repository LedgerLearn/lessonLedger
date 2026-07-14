# Image Optimization Architecture

## System Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                      Image Optimization System                   │
└─────────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────────┐
│                         User Request                              │
│                              ↓                                    │
│                    ┌─────────────────┐                           │
│                    │  Next.js Image  │                           │
│                    │  Optimization   │                           │
│                    └─────────────────┘                           │
│                              ↓                                    │
│           ┌──────────────────┼──────────────────┐               │
│           ↓                  ↓                   ↓               │
│    ┌──────────┐      ┌──────────┐       ┌──────────┐           │
│    │   WebP   │      │   AVIF   │       │ Original │           │
│    │  Format  │      │  Format  │       │  Format  │           │
│    └──────────┘      └──────────┘       └──────────┘           │
│           ↓                  ↓                   ↓               │
│    ┌─────────────────────────────────────────────┐              │
│    │        Responsive Size Selection             │              │
│    │  (640, 750, 828, 1080, 1200, 1920, 2048, 3840)│            │
│    └─────────────────────────────────────────────┘              │
│                              ↓                                    │
│    ┌─────────────────────────────────────────────┐              │
│    │         Lazy Loading Decision                │              │
│    │    (Intersection Observer + Priority)        │              │
│    └─────────────────────────────────────────────┘              │
│                              ↓                                    │
│           ┌──────────────────┼──────────────────┐               │
│           ↓                  ↓                   ↓               │
│    ┌──────────┐      ┌──────────┐       ┌──────────┐           │
│    │ Priority │      │   Lazy   │       │  Error   │           │
│    │   Load   │      │   Load   │       │ Fallback │           │
│    └──────────┘      └──────────┘       └──────────┘           │
│                              ↓                                    │
│                    ┌─────────────────┐                           │
│                    │  Optimized Image│                           │
│                    │    Delivered    │                           │
│                    └─────────────────┘                           │
└──────────────────────────────────────────────────────────────────┘
```

## Component Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         Components Layer                         │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ┌─────────────────────┐         ┌──────────────────────┐      │
│  │  OptimizedImage     │         │   ImageGallery       │      │
│  │                     │         │                      │      │
│  │  - Lazy Loading     │         │  - Responsive Grid   │      │
│  │  - Blur Placeholder │         │  - Multiple Images   │      │
│  │  - Error Handling   │         │  - Lazy Loading      │      │
│  │  - Loading State    │         │  - Progress Tracking │      │
│  └─────────────────────┘         └──────────────────────┘      │
│            │                                 │                   │
│            └─────────────┬───────────────────┘                  │
│                          ↓                                       │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                          Hooks Layer                             │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ┌──────────────┐  ┌──────────────┐  ┌─────────────────────┐  │
│  │ useLazyLoad  │  │ useLazyImage │  │usePerformance       │  │
│  │              │  │              │  │Monitoring           │  │
│  │ - Observer   │  │ - Preload    │  │                     │  │
│  │ - Threshold  │  │ - Error      │  │ - LCP, FID, CLS     │  │
│  │ - Trigger    │  │ - State      │  │ - Network Info      │  │
│  └──────────────┘  └──────────────┘  └─────────────────────┘  │
│                                                                   │
│  ┌──────────────┐  ┌──────────────┐                            │
│  │useSlowNetwork│  │ useSaveData  │                            │
│  │              │  │              │                            │
│  │ - Detection  │  │ - Detection  │                            │
│  │ - Adaptation │  │ - Respect    │                            │
│  └──────────────┘  └──────────────┘                            │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                        Utilities Layer                           │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ┌──────────────────┐          ┌───────────────────────┐       │
│  │   imageUtils     │          │ placeholderGenerator  │       │
│  │                  │          │                       │       │
│  │ - Responsive     │          │ - Solid Color         │       │
│  │ - Validation     │          │ - Gradient            │       │
│  │ - Conversion     │          │ - Shimmer             │       │
│  │ - Dimensions     │          │ - Theme-aware         │       │
│  │ - Preload        │          │ - Custom Text         │       │
│  └──────────────────┘          └───────────────────────┘       │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                      Configuration Layer                         │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ┌──────────────────┐          ┌───────────────────────┐       │
│  │  next.config.js  │          │   Scripts             │       │
│  │                  │          │                       │       │
│  │ - Formats        │          │ - convert-to-webp.js  │       │
│  │ - Device Sizes   │          │ - Lighthouse tests    │       │
│  │ - Cache TTL      │          │                       │       │
│  │ - Quality        │          │                       │       │
│  └──────────────────┘          └───────────────────────┘       │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

## Data Flow

### Image Loading Sequence

```
1. Component Render
   ↓
2. Check if Priority
   ├─ Yes → Load Immediately
   └─ No  → Setup Intersection Observer
          ↓
3. Image Enters Viewport
   ↓
4. Show Blur Placeholder
   ↓
5. Request Image from Next.js
   ↓
6. Next.js Optimization Pipeline
   ├─ Check Cache
   ├─ Convert Format (WebP/AVIF)
   ├─ Resize for Device
   └─ Apply Quality Setting
   ↓
7. Return Optimized Image
   ↓
8. Load Image
   ├─ Success → Fade In
   └─ Error  → Show Fallback
   ↓
9. Image Displayed
```

### Network Adaptation Flow

```
1. Detect Network Connection
   ↓
2. Get Connection Type
   ├─ 4G/5G    → Use quality: 85%
   ├─ 3G       → Use quality: 75%
   ├─ 2G       → Use quality: 60%
   └─ Slow-2G  → Use quality: 60%
   ↓
3. Check Save Data Mode
   ├─ Enabled  → Reduce quality further
   └─ Disabled → Use default for connection
   ↓
4. Apply Quality Setting
   ↓
5. Load Image with Adapted Quality
```

## Performance Monitoring

### Core Web Vitals Tracking

```
┌──────────────────────────────────────────┐
│         Performance Observer             │
├──────────────────────────────────────────┤
│                                          │
│  ┌────────────────────────────────────┐ │
│  │ Largest Contentful Paint (LCP)     │ │
│  │ Target: < 2.5s                     │ │
│  │ - Tracks largest image load        │ │
│  └────────────────────────────────────┘ │
│                                          │
│  ┌────────────────────────────────────┐ │
│  │ First Input Delay (FID)            │ │
│  │ Target: < 100ms                    │ │
│  │ - Tracks interaction responsiveness│ │
│  └────────────────────────────────────┘ │
│                                          │
│  ┌────────────────────────────────────┐ │
│  │ Cumulative Layout Shift (CLS)      │ │
│  │ Target: < 0.1                      │ │
│  │ - Tracks visual stability          │ │
│  └────────────────────────────────────┘ │
│                                          │
└──────────────────────────────────────────┘
```

## Error Handling Flow

```
Image Load Attempt
   ↓
┌──────────────────┐
│   Load Image     │
└──────────────────┘
   │
   ├─ Success
   │  ↓
   │  ┌──────────────────┐
   │  │  Display Image   │
   │  └──────────────────┘
   │
   └─ Error
      ↓
      ┌──────────────────┐
      │ Trigger onError  │
      └──────────────────┘
      ↓
      ┌──────────────────┐
      │ Set Error State  │
      └──────────────────┘
      ↓
      ┌──────────────────┐
      │ Show Fallback UI │
      │ - Icon           │
      │ - Message        │
      └──────────────────┘
```

## Lazy Loading State Machine

```
┌─────────────┐
│   INITIAL   │
└─────────────┘
      ↓
┌─────────────┐
│  OBSERVING  │ ← Setup Intersection Observer
└─────────────┘
      ↓
┌─────────────┐
│ INTERSECTING│ ← Element enters viewport
└─────────────┘
      ↓
┌─────────────┐
│   LOADING   │ ← Show placeholder, start load
└─────────────┘
      ↓
┌─────────────┼─────