# Skeleton Loading Components

Reusable skeleton loading screens that improve perceived performance while data is being fetched.

## Features

- ✅ Match layout of actual content
- ✅ Smooth, professional animations
- ✅ Disappear when data loads
- ✅ Work on slow network connections
- ✅ Accessible to screen readers (ARIA labels)

## Components

### SkeletonDashboard
Full dashboard skeleton that mimics the complete dashboard layout including header, charts, tasks, and achievements.

**Usage:**
```tsx
if (loading) return <SkeletonDashboard />
```

### SkeletonStreak
Skeleton for the streak card with gradient background matching the actual component.

### SkeletonChart
Skeleton for chart components with animated bars.

### SkeletonTaskList
Skeleton for task list showing 3 placeholder tasks.

### SkeletonAchievements
Skeleton for achievements section showing 3 placeholder items.

### SkeletonCard
Generic card skeleton for custom use cases.

### SkeletonText
Flexible text skeleton with configurable number of lines.

**Props:**
- `lines` (optional): Number of lines to display (default: 1)
- `className` (optional): Additional CSS classes

## Accessibility

All skeleton components include:
- `role="status"` attribute
- `aria-label` describing what's loading
- Proper semantic HTML structure

## Styling

- Uses Tailwind's `animate-pulse` utility
- Dark mode support with `dark:` variants
- Responsive design matching actual components
- Smooth transitions between loading and loaded states

## Implementation

The skeletons are integrated into:
- Dashboard page (`/dashboard`)
- StreakCard component
- TaskList component
- AchievementsGrid component

Each component handles its own loading state and renders the appropriate skeleton.
