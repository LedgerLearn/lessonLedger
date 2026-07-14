# Enhanced Streak Counter Component

## Overview
The enhanced Streak Counter is a prominent, animated component that displays the user's current learning streak with real-time updates, visual feedback, and warning indicators.

## Features Implemented

### ✅ Current Streak Display (Prominent)
- Large, eye-catching display showing days in a row
- 5xl-7xl font size for maximum prominence
- Clear labeling with "Current Streak" heading
- Dynamic text showing singular/plural (day/days)

### ✅ Historical Best Streak
- Trophy icon (🏆) to denote achievement
- Separate section showing personal best
- Styled with border separator for clear distinction
- Always visible for motivation

### ✅ Fire Animation
- Animated fire emoji (🔥) when streak > 0
- Custom CSS keyframe animation with:
  - Vertical movement (translateY)
  - Rotation effects
  - 2-second loop, infinite duration
- Sleeping emoji (💤) when streak is 0
- Scale animation on real-time updates

### ✅ Warning Indicator
- Monitors time since last activity
- Shows warning banner when >20 hours since last task
- Yellow alert banner with pulse animation
- Message: "⚠️ Complete a task today to keep your streak!"
- Only displays when streak > 0

### ✅ Mobile-Friendly Display
- Responsive padding: `p-4 sm:p-6`
- Responsive font sizes: `text-5xl sm:text-6xl md:text-7xl`
- Responsive text: `text-xs sm:text-sm`
- Hidden "Live" text on mobile, only dot indicator
- Gradient background works on all screen sizes
- Proper overflow handling

### ✅ Real-Time Updates
- WebSocket integration via `useWebSocket` hook
- Listens for `streak_update` messages
- Updates UI immediately when streak changes
- Shows "Live" indicator when connected
- Green pulsing dot for connection status
- Triggers scale animation on updates

## Component Structure

```
StreakCard
├── Real-time indicator (top-right)
├── Warning banner (conditional, top)
├── Fire/Sleep emoji (animated)
├── Current streak heading
├── Streak count (prominent)
├── Days label
├── Best streak section
│   ├── Trophy icon
│   └── Best count
└── Motivational message
```

## Technical Implementation

### State Management
- `streak`: Current streak data from API
- `loading`: Loading state for initial fetch
- `isStreakAtRisk`: Calculated warning state
- `animate`: Temporary animation trigger

### Real-Time Updates
- WebSocket connection via custom hook
- Message type: `streak_update`
- Automatic reconnection handling
- Token-based authentication

### Warning System
- Checks every 60 seconds (interval)
- Calculates hours since `lastActiveAt`
- 20-hour threshold for warning
- Cleanup on unmount

### Animations
1. **Fire Animation** (CSS)
   - Custom `@keyframes fire`
   - Vertical bouncing with rotation
   - Applied via `animate-fire` class

2. **Update Animation** (React state)
   - Scale transform on WebSocket update
   - 1-second duration
   - Returns to normal scale

3. **Pulse Animation** (Tailwind)
   - Warning banner: `animate-pulse`
   - Live indicator dot: `animate-pulse`

## API Integration

### Endpoint Used
- `GET /api/streaks` - Fetch current streak data

### Expected Response
```typescript
{
  id: string;
  currentCount: number;
  maxCount: number;
  lastActiveAt: string; // ISO date string
}
```

### WebSocket Events
```typescript
{
  type: "streak_update",
  data: {
    id: string;
    currentCount: number;
    maxCount: number;
    lastActiveAt: string;
  }
}
```

## Usage

```tsx
import StreakCard from '@/components/StreakCard';

export default function DashboardPage() {
  return (
    <div>
      <StreakCard />
    </div>
  );
}
```

## Styling

### Colors
- Gradient: `from-orange-400 to-red-500`
- Warning: `bg-yellow-500` with `text-yellow-900`
- Live indicator: `bg-green-300`

### Responsive Breakpoints
- `sm:` 640px and up
- `md:` 768px and up
- `lg:` 1024px and up

## Testing

Comprehensive test suite in `__tests__/StreakCard.test.tsx` covers:
- Loading state
- Prominent current streak display
- Historical best streak display
- Fire animation when active
- Warning indicator logic
- Real-time WebSocket updates
- Mobile responsiveness
- Error handling

Run tests:
```bash
npm test StreakCard.test.tsx
```

## Accessibility

- Semantic HTML structure
- Proper heading hierarchy (h3)
- Sufficient color contrast ratios
- Responsive text sizing
- Clear visual indicators

## Browser Compatibility

- Modern browsers (Chrome, Firefox, Safari, Edge)
- CSS animations supported
- WebSocket API required
- Flexbox/Grid layout

## Performance

- Memoized calculations for warning state
- Interval cleanup on unmount
- Efficient re-renders with state management
- Lightweight animation (CSS-based)

## Future Enhancements

Potential improvements:
- Sound effects on streak milestones
- Confetti animation on new personal best
- Streak recovery grace period
- Share streak on social media
- Streak comparison with friends
- Weekly/monthly streak stats
