# Toast Notification System

## Overview
A complete toast notification system that displays temporary alerts for user actions like task creation, updates, and deletions.

## Features
✅ Toast notifications for task events  
✅ Auto-dismiss after 5 seconds  
✅ Manual dismiss option with close button  
✅ Different styles for success/error/info  
✅ Stacking of multiple notifications  
✅ Positioned to avoid overlapping critical content  
✅ Smooth slide-in animation  
✅ Dark mode support  
✅ Accessibility compliant (ARIA labels)  
✅ Mobile responsive  

## Components

### 1. Toast Component (`components/Toast.tsx`)
Individual toast notification with:
- Three types: `success`, `error`, `info`
- Auto-dismiss timer (default 5 seconds)
- Manual dismiss button
- Corresponding icons (CheckCircle, XCircle, Info)
- Color-coded styling for each type

### 2. ToastProvider (`components/ToastProvider.tsx`)
Context provider that manages toast state:
- `addToast(message, type, duration?)` - Add a new toast
- `removeToast(id)` - Remove a specific toast
- Automatic ID generation
- Toast container rendering

### 3. ToastContainer
Displays all active toasts in a fixed position:
- Fixed top-right positioning
- Stacks vertically with spacing
- Z-index of 9999 to stay on top
- Max width constraint for mobile

## Usage

### Basic Usage
```tsx
import { useToast } from '@/components/ToastProvider';

function MyComponent() {
  const { addToast } = useToast();

  const handleAction = () => {
    addToast('Task completed!', 'success');
  };

  return <button onClick={handleAction}>Complete</button>;
}
```

### Toast Types
```tsx
// Success notification
addToast('Task created successfully', 'success');

// Error notification
addToast('Failed to delete task', 'error');

// Info notification
addToast('Task updated', 'info');
```

### Custom Duration
```tsx
// Toast dismisses after 10 seconds instead of default 5
addToast('Important message', 'info', 10000);
```

### Multiple Toasts
The system automatically stacks multiple toasts:
```tsx
addToast('First message', 'info');
addToast('Second message', 'success');
addToast('Third message', 'error');
// All three will stack vertically
```

## Integration Points

### TaskList Component
- ✅ Task completed/reopened
- ✅ Task deleted
- ✅ Task update errors
- ✅ WebSocket real-time updates

### CreateTaskForm Component
- ✅ Task created successfully
- ✅ Task creation errors

## Styling

### Color Schemes
- **Success**: Green background with green border and icon
- **Error**: Red background with red border and icon
- **Info**: Blue background with blue border and icon

### Dark Mode
All toast styles automatically adapt to dark mode with:
- Adjusted background opacity
- Appropriate text colors
- Consistent border colors

### Animations
- **Slide-in-right**: Smooth entrance from right side (0.3s)
- **Auto-dismiss**: Fades out after duration

## Accessibility

- `role="alert"` for screen reader announcements
- `aria-live="polite"` for non-intrusive notifications
- `aria-label` on dismiss buttons
- Keyboard accessible dismiss buttons
- Sufficient color contrast ratios

## Positioning

Toasts are positioned at:
- **Desktop**: Top-right corner, 1rem from edges
- **Mobile**: Top-right, responsive max-width
- **Z-index**: 9999 (above modals and other content)
- **Stacking**: Vertical with 0.75rem gap

## Testing

Use the `ToastTestButton` component to test all toast functionality:
```tsx
import ToastTestButton from '@/components/ToastTestButton';

// In any page
<ToastTestButton />
```

This provides buttons to:
- Test success toasts
- Test error toasts
- Test info toasts
- Test multiple stacked toasts

## Technical Details

### State Management
- Uses React Context API for global state
- Each toast has a unique ID based on timestamp + random number
- Toasts stored in array state

### Auto-dismiss Implementation
- `useEffect` hook with timer in each ToastItem
- Timer cleared on component unmount
- Customizable duration per toast

### Performance
- Minimal re-renders using useCallback
- Efficient array operations for toast management
- CSS animations (no JS animation loops)

## Future Enhancements

Possible improvements:
- Toast positioning options (top-left, bottom-right, etc.)
- Progress bar showing remaining time
- Action buttons in toasts
- Toast queuing with max visible limit
- Sound effects for notifications
- Persistent toasts (no auto-dismiss)
