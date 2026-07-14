# Achievement Badge System

## Overview
The Achievement Badge System provides animated, modal-based notifications when users earn achievements, with support for different badge types, NFT integration, and social sharing capabilities.

## Features

### ✅ Achievement Modal on Completion
- Displays a beautiful modal when an achievement is earned
- Automatically triggered via WebSocket real-time notifications
- Can also be manually triggered programmatically

### ✅ Smooth Animations
- **Bounce effect** on the badge icon
- **Slide-up animation** for text elements with staggered delays
- **Floating particles** (confetti-like) effect in the background
- **Fade and scale** entrance/exit transitions
- **Shimmer effect** on achievement cards in the grid view

### ✅ Achievement Display
- Shows achievement name, description, and type-specific icon
- Different icons for different badge types:
  - 🏆 **Milestone** (Trophy) - Yellow gradient
  - 🔥 **Streak** (Zap) - Orange gradient  
  - 👥 **Contributor** (Award) - Purple gradient

### ✅ NFT Integration
- Displays "NFT Minted" badge for blockchain-verified achievements
- "View NFT" button to open NFT details in a new tab
- Visual glow effect for NFT badges

### ✅ Social Sharing
- Share button with Web Share API integration
- Fallback to clipboard copy for unsupported browsers
- Pre-formatted share text with achievement details

### ✅ Persistent Display
- Achievements page shows all earned achievements
- Enhanced grid view with hover effects
- Animated entrance for each card
- Responsive layout for all screen sizes

### ✅ Multiple Badge Type Support
- Milestone achievements (learning milestones)
- Streak achievements (daily study streaks)
- Contributor achievements (community contributions)
- Extensible for future badge types

## Architecture

### Components

#### `AchievementModal.tsx`
Main modal component that displays the achievement notification with animations.

**Props:**
- `achievement: Achievement | null` - The achievement to display
- `onClose: () => void` - Callback when modal is closed
- `onShare?: (achievement: Achievement) => void` - Optional share handler

**Features:**
- Portal-based rendering (rendered at document.body)
- Backdrop blur effect
- Animated entrance/exit transitions
- Responsive design
- Prevents body scroll when open

#### `AchievementProvider.tsx`
Context provider that manages achievement notifications globally.

**Exports:**
- `AchievementProvider` - Wrap your app with this
- `useAchievement()` - Hook to access achievement functions

**Functions:**
- `showAchievement(achievement)` - Manually trigger an achievement modal
- `isConnected` - WebSocket connection status

#### `AchievementsGrid.tsx`
Grid display of all earned achievements with animations.

**Features:**
- Staggered entrance animations
- Hover effects (scale, shimmer)
- NFT badge glow effect
- Responsive grid layout

#### `AchievementTestButton.tsx`
Development-only component for testing achievement modals.

**Usage:** Only renders in development mode.

### Hooks

#### `useAchievementNotification.ts`
Custom hook that manages achievement queue and WebSocket integration.

**Features:**
- Connects to WebSocket for real-time notifications
- Queues multiple achievements
- Shows one achievement at a time
- Handles share functionality

**Returns:**
- `currentAchievement` - Currently displayed achievement
- `handleClose` - Close handler
- `handleShare` - Share handler
- `showAchievement` - Manual trigger function
- `isConnected` - Connection status

## Usage

### Setup

1. The `AchievementProvider` is already integrated in `Providers.tsx`
2. WebSocket notifications are automatically connected when user is authenticated
3. No additional setup required!

### Manual Trigger

```tsx
import { useAchievement } from '@/components/AchievementProvider';

function MyComponent() {
  const { showAchievement } = useAchievement();

  const handleTaskComplete = async () => {
    // ... complete task logic
    
    // Trigger achievement manually
    showAchievement({
      id: 'achievement-123',
      type: 'milestone',
      title: 'First Task Complete!',
      description: 'You completed your first learning task',
      nftId: 'nft-456', // optional
      earnedAt: new Date().toISOString(),
    });
  };

  return <button onClick={handleTaskComplete}>Complete Task</button>;
}
```

### WebSocket Integration

The backend should emit achievements through WebSocket:

```typescript
// Backend example
ws.send(JSON.stringify({
  type: 'ACHIEVEMENT_EARNED',
  data: {
    id: 'achievement-123',
    type: 'milestone',
    title: 'First Task Complete!',
    description: 'You completed your first learning task',
    nftId: 'nft-456',
    earnedAt: new Date().toISOString(),
  }
}));
```

### Testing

In development mode, test buttons appear at the bottom-right of the dashboard:
- Click any button to see the achievement modal in action
- Test all three badge types (Milestone, Streak, Contributor)
- Test NFT integration

## Animations

### CSS Keyframes (in `globals.css`)

1. **bounce-slow** - Gentle bounce for the badge icon
2. **slide-up** - Upward slide with fade-in for text
3. **float** - Floating particles effect
4. **shimmer** - Shimmer effect for card hover states

### Tailwind Classes

- `animate-bounce-slow` - Apply slow bounce
- `animate-slide-up` - Apply slide-up with fade
- `animate-float` - Apply floating effect
- `animate-shimmer` - Apply shimmer effect

## Customization

### Adding New Badge Types

1. Update the `Achievement` interface if needed
2. Add new icon case in `getIcon()` function
3. Add new gradient in `getGradient()` / `getBadgeColor()` functions

```tsx
case 'custom':
  return <CustomIcon className="w-16 h-16 text-green-500" />;
```

### Styling

All gradients and colors are defined using Tailwind classes:
- Milestone: `from-yellow-400 to-yellow-600`
- Streak: `from-orange-400 to-red-500`
- Contributor: `from-purple-400 to-pink-500`

Modify these in the component files to match your brand.

## Browser Support

- ✅ Modern browsers (Chrome, Firefox, Safari, Edge)
- ✅ Mobile responsive
- ✅ Web Share API with clipboard fallback
- ✅ Portal API for modal rendering

## Performance

- Animations use CSS transforms (GPU accelerated)
- Portal rendering prevents layout thrashing
- Queue system prevents modal spam
- Lazy loading with code splitting

## Accessibility

- ✅ Keyboard navigation (ESC to close)
- ✅ Focus management
- ✅ ARIA labels on buttons
- ✅ Semantic HTML
- ⚠️ Screen reader announcements (to be added)

## Future Enhancements

- [ ] Sound effects on achievement unlock
- [ ] More animation variations
- [ ] Achievement preview before earning
- [ ] Progress bars for multi-step achievements
- [ ] Leaderboard integration
- [ ] Achievement categories/filters
- [ ] Screen reader announcements

## Environment Variables

```env
NEXT_PUBLIC_WS_URL=ws://localhost:5000
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

## Files Modified/Created

### Created
- `frontend/components/AchievementModal.tsx`
- `frontend/components/AchievementProvider.tsx`
- `frontend/components/AchievementTestButton.tsx`
- `frontend/lib/useAchievementNotification.ts`
- `frontend/ACHIEVEMENT_SYSTEM.md`

### Modified
- `frontend/components/Providers.tsx` - Added AchievementProvider
- `frontend/components/AchievementsGrid.tsx` - Enhanced animations
- `frontend/app/dashboard/page.tsx` - Added test buttons
- `frontend/app/globals.css` - Added animation keyframes

## Testing Checklist

- [ ] Achievement modal appears on trigger
- [ ] Animations play smoothly
- [ ] Icon matches badge type
- [ ] NFT badge displays correctly
- [ ] Share button works
- [ ] View NFT button works
- [ ] Modal closes properly
- [ ] Multiple achievements queue correctly
- [ ] Responsive on mobile
- [ ] Works with dark mode
- [ ] WebSocket connection stable
- [ ] Grid view animations work
- [ ] Hover effects active
