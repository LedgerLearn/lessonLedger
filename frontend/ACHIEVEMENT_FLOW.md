# Achievement System Flow Diagram

## User Achievement Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                         USER ACTION                              │
│                  (Complete task, maintain streak, etc.)          │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                       BACKEND LOGIC                              │
│  • Validates achievement criteria                                │
│  • Creates achievement record in DB                              │
│  • Optionally mints NFT                                          │
└────────────────────────────┬────────────────────────────────────┘
                             │
                ┌────────────┴────────────┐
                │                         │
                ▼                         ▼
┌──────────────────────────┐  ┌──────────────────────────┐
│   WebSocket Message       │  │   Manual Trigger         │
│   (Real-time)            │  │   (Programmatic)         │
│                          │  │                          │
│  type: ACHIEVEMENT_EARNED │  │  showAchievement()      │
│  data: { achievement }   │  │  function call          │
└────────────┬─────────────┘  └─────────┬────────────────┘
             │                          │
             └──────────┬───────────────┘
                        │
                        ▼
┌─────────────────────────────────────────────────────────────────┐
│              useAchievementNotification Hook                     │
│  • Receives achievement data                                     │
│  • Adds to queue                                                 │
│  • Manages display state                                         │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                    Achievement Queue                             │
│  [Achievement 1] → [Achievement 2] → [Achievement 3]            │
│         ↓                                                        │
│    Shows one at a time                                           │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                    AchievementModal                              │
│                                                                  │
│  ┌────────────────────────────────────────────────────────┐    │
│  │  🎉 Animated Entrance (300ms)                          │    │
│  │  ┌──────────────────────────────────────────────┐     │    │
│  │  │         Floating Particles Background        │     │    │
│  │  │  ┌────────────────────────────────────┐     │     │    │
│  │  │  │     🏆 Badge Icon (Bounce)         │     │     │    │
│  │  │  │                                    │     │     │    │
│  │  │  │   Achievement Unlocked!            │     │     │    │
│  │  │  │   [Achievement Title]              │     │     │    │
│  │  │  │   [Description]                    │     │     │    │
│  │  │  │                                    │     │     │    │
│  │  │  │   💎 NFT Minted (if applicable)   │     │     │    │
│  │  │  │                                    │     │     │    │
│  │  │  │   [View NFT]  [Share]             │     │     │    │
│  │  │  └────────────────────────────────────┘     │     │    │
│  │  └──────────────────────────────────────────────┘     │    │
│  └────────────────────────────────────────────────────────┘    │
│                                                                  │
└────────────────┬────────────────────────────┬────────────────────┘
                 │                            │
                 ▼                            ▼
     ┌──────────────────┐        ┌──────────────────────┐
     │  User Closes     │        │  Auto-close after    │
     │  (X or backdrop) │        │  user interaction    │
     └─────────┬────────┘        └──────────┬───────────┘
               │                            │
               └──────────┬─────────────────┘
                          │
                          ▼
         ┌────────────────────────────────┐
         │  Next Achievement in Queue     │
         │  (if any)                      │
         └────────────────────────────────┘
```

## Component Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                          App Layout                              │
│  (app/layout.tsx)                                                │
│                                                                  │
│  ┌────────────────────────────────────────────────────────┐    │
│  │                    Providers                            │    │
│  │  (components/Providers.tsx)                            │    │
│  │                                                         │    │
│  │  ┌──────────────────────────────────────────────┐     │    │
│  │  │        AchievementProvider                   │     │    │
│  │  │  (components/AchievementProvider.tsx)       │     │    │
│  │  │                                              │     │    │
│  │  │  • useAchievementNotification hook          │     │    │
│  │  │  • Context: showAchievement, isConnected    │     │    │
│  │  │  • Renders AchievementModal                 │     │    │
│  │  │                                              │     │    │
│  │  │  ┌────────────────────────────────────┐    │     │    │
│  │  │  │    AchievementModal                │    │     │    │
│  │  │  │  (Portal to document.body)         │    │     │    │
│  │  │  └────────────────────────────────────┘    │     │    │
│  │  │                                              │     │    │
│  │  └──────────────────────────────────────────────┘     │    │
│  │                                                         │    │
│  │  ┌──────────────────────────────────────────────┐     │    │
│  │  │            Page Content                      │     │    │
│  │  │  • Dashboard                                │     │    │
│  │  │  • Achievements Page                        │     │    │
│  │  │  • etc.                                     │     │    │
│  │  └──────────────────────────────────────────────┘     │    │
│  │                                                         │    │
│  └─────────────────────────────────────────────────────────┘    │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

## Data Flow

```
┌─────────────────┐
│  WebSocket      │
│  Connection     │──────┐
└─────────────────┘      │
                         │ Message
┌─────────────────┐      │ type: ACHIEVEMENT_EARNED
│  Manual         │      │ data: Achievement
│  Trigger        │──────┤
└─────────────────┘      │
                         ▼
                ┌─────────────────────┐
                │  Achievement Queue  │
                │  [A1, A2, A3]      │
                └──────────┬──────────┘
                           │
                           ▼
                ┌─────────────────────┐
                │  Current            │
                │  Achievement        │
                │  State              │
                └──────────┬──────────┘
                           │
                           ▼
                ┌─────────────────────┐
                │  AchievementModal   │
                │  (Visible/Hidden)   │
                └─────────────────────┘
```

## State Management

```
useAchievementNotification
├── currentAchievement (Achievement | null)
│   └── Currently displayed achievement
├── achievementQueue (Achievement[])
│   └── Pending achievements to show
├── isShowing (boolean)
│   └── Modal visibility state
└── isConnected (boolean)
    └── WebSocket connection status

↓ Exposed via Context

useAchievement()
├── showAchievement(achievement)
│   └── Add achievement to queue
└── isConnected
    └── Connection status
```

## Animation Timeline

```
Modal Entrance (0ms - 500ms)
├── 0ms:   Backdrop fade in
├── 0ms:   Modal scale 0.75 → 1.0
├── 0ms:   Modal opacity 0 → 1
├── 100ms: Badge bounce starts
├── 200ms: Particles float animation starts
├── 300ms: Title slide-up animation
├── 400ms: Description slide-up animation
└── 500ms: Buttons slide-up animation

User Interaction
└── User clicks close or backdrop

Modal Exit (0ms - 300ms)
├── 0ms:   Backdrop fade out
├── 0ms:   Modal scale 1.0 → 0.75
├── 0ms:   Modal opacity 1 → 0
└── 300ms: Modal removed from DOM
           Next achievement (if any)
```

## Hook Dependencies

```
useAchievementNotification
└── useWebSocket
    ├── Connects to WS_URL
    ├── Authenticates with token
    ├── Listens for messages
    └── Auto-reconnect on disconnect

Dependencies:
├── token (from auth)
├── WS_URL (from env)
└── onMessage callback
    └── Filters ACHIEVEMENT_EARNED messages
```

## Integration Points

```
┌─────────────────────────────────────────────────────────────┐
│                        Frontend                              │
│                                                              │
│  ┌──────────────┐    ┌──────────────┐    ┌──────────────┐ │
│  │ Auth System  │───▶│ Achievement  │───▶│  WebSocket   │ │
│  │ (token)      │    │ Provider     │    │  Hook        │ │
│  └──────────────┘    └──────┬───────┘    └───────▲──────┘ │
│                             │                     │         │
│                             │                     │         │
│                             ▼                     │         │
│                      ┌──────────────┐            │         │
│                      │ Achievement  │            │         │
│                      │ Modal        │            │         │
│                      └──────────────┘            │         │
│                                                   │         │
└───────────────────────────────────────────────────┼─────────┘
                                                    │
                                          WebSocket │
                                          Connection│
                                                    │
┌───────────────────────────────────────────────────┼─────────┐
│                        Backend                    │         │
│                                                   │         │
│  ┌──────────────┐    ┌──────────────┐    ┌───────▼──────┐ │
│  │   Business   │───▶│  Achievement │───▶│   WebSocket  │ │
│  │   Logic      │    │  Service     │    │   Server     │ │
│  └──────────────┘    └──────────────┘    └──────────────┘ │
│        │                                                    │
│        ▼                                                    │
│  ┌──────────────┐    ┌──────────────┐                     │
│  │  Database    │    │  NFT Service │                     │
│  │  (Postgres)  │    │  (Blockchain)│                     │
│  └──────────────┘    └──────────────┘                     │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

## File Structure

```
frontend/
├── app/
│   ├── layout.tsx (Modified)
│   ├── dashboard/page.tsx (Modified)
│   └── globals.css (Modified - animations)
│
├── components/
│   ├── AchievementModal.tsx (NEW)
│   ├── AchievementProvider.tsx (NEW)
│   ├── AchievementTestButton.tsx (NEW)
│   ├── AchievementsGrid.tsx (Modified)
│   └── Providers.tsx (Modified)
│
├── lib/
│   └── useAchievementNotification.ts (NEW)
│
└── Documentation/
    ├── ACHIEVEMENT_SYSTEM.md (NEW)
    ├── ACHIEVEMENT_QUICK_START.md (NEW)
    └── ACHIEVEMENT_FLOW.md (NEW - this file)
```
