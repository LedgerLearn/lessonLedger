# Achievement System - Quick Start Guide

## What's Included

✅ Animated achievement modal with smooth entrance/exit  
✅ Real-time WebSocket notifications  
✅ Multiple badge types (Milestone, Streak, Contributor)  
✅ NFT integration display  
✅ Social sharing functionality  
✅ Persistent achievements grid with animations  
✅ Development test buttons  

## How to Test

### Option 1: Using Test Buttons (Development)

1. Start the frontend: `npm run dev`
2. Navigate to `/dashboard`
3. Look for test buttons in the bottom-right corner
4. Click any button to trigger an achievement modal

### Option 2: Programmatically

```tsx
import { useAchievement } from '@/components/AchievementProvider';

function MyComponent() {
  const { showAchievement } = useAchievement();

  const triggerAchievement = () => {
    showAchievement({
      id: 'test-1',
      type: 'milestone',
      title: 'First Steps',
      description: 'Completed your first task!',
      nftId: 'optional-nft-id',
      earnedAt: new Date().toISOString(),
    });
  };

  return <button onClick={triggerAchievement}>Earn Achievement</button>;
}
```

### Option 3: WebSocket (Production)

The system automatically listens for WebSocket messages:

```json
{
  "type": "ACHIEVEMENT_EARNED",
  "data": {
    "id": "achievement-123",
    "type": "milestone",
    "title": "Achievement Title",
    "description": "Achievement description",
    "nftId": "optional-nft-id",
    "earnedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

## Badge Types

| Type | Icon | Color | Use Case |
|------|------|-------|----------|
| `milestone` | 🏆 Trophy | Yellow | Learning milestones |
| `streak` | ⚡ Zap | Orange | Daily streaks |
| `contributor` | 🏅 Award | Purple | Community contributions |

## Key Features

### 1. Modal Animations
- Bounce effect on badge icon
- Staggered slide-up for text
- Floating particles background
- Smooth fade transitions

### 2. NFT Support
- Displays "NFT Minted" badge
- "View NFT" button for blockchain verification
- Gradient glow effect

### 3. Social Sharing
- Native Web Share API on mobile
- Clipboard fallback on desktop
- Pre-formatted share text

### 4. Queue System
- Multiple achievements automatically queue
- One modal at a time
- Smooth transitions between achievements

## Responsive Design

✅ Mobile-optimized  
✅ Tablet-friendly  
✅ Desktop-enhanced  
✅ Touch-friendly buttons (min 44px)  

## Browser Support

✅ Chrome/Edge 90+  
✅ Firefox 88+  
✅ Safari 14+  
✅ Mobile browsers  

## Next Steps

1. **Backend Integration**: Implement WebSocket achievement notifications
2. **NFT Linking**: Connect "View NFT" to your blockchain explorer
3. **Analytics**: Track achievement unlocks
4. **Customization**: Add more badge types or modify colors

## Files to Review

- `frontend/components/AchievementModal.tsx` - Main modal component
- `frontend/components/AchievementProvider.tsx` - Context provider
- `frontend/lib/useAchievementNotification.ts` - WebSocket hook
- `frontend/ACHIEVEMENT_SYSTEM.md` - Full documentation

## Environment Setup

```env
NEXT_PUBLIC_WS_URL=ws://localhost:5000
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

## Questions?

See `ACHIEVEMENT_SYSTEM.md` for comprehensive documentation.
