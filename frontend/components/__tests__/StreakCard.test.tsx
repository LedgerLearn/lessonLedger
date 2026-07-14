import { render, screen, waitFor, act } from '@testing-library/react';
import StreakCard from '../StreakCard';
import { api } from '@/lib/api';
import { useWebSocket } from '@/lib/useWebSocket';

// Mock dependencies
jest.mock('@/lib/api');
jest.mock('@/lib/useWebSocket');
jest.mock('../skeletons', () => ({
  SkeletonStreak: () => <div>Loading...</div>,
}));

const mockApi = api as jest.Mocked<typeof api>;
const mockUseWebSocket = useWebSocket as jest.MockedFunction<typeof useWebSocket>;

describe('StreakCard', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
    
    // Mock localStorage
    Object.defineProperty(window, 'localStorage', {
      value: {
        getItem: jest.fn(() => 'mock-token'),
        setItem: jest.fn(),
        removeItem: jest.fn(),
      },
      writable: true,
    });

    // Default WebSocket mock
    mockUseWebSocket.mockReturnValue({
      isConnected: true,
      connectionError: null,
      sendMessage: jest.fn(),
      disconnect: jest.fn(),
      reconnect: jest.fn(),
    });
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('displays loading skeleton initially', () => {
    mockApi.getStreak.mockResolvedValue({ data: undefined });
    
    render(<StreakCard />);
    
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('displays current streak prominently', async () => {
    const mockStreak = {
      id: '1',
      currentCount: 5,
      maxCount: 10,
      lastActiveAt: new Date().toISOString(),
    };

    mockApi.getStreak.mockResolvedValue({ data: mockStreak });

    render(<StreakCard />);

    await waitFor(() => {
      expect(screen.getByText('5')).toBeInTheDocument();
      expect(screen.getByText('days in a row')).toBeInTheDocument();
      expect(screen.getByText('Current Streak')).toBeInTheDocument();
    });
  });

  it('displays historical best streak', async () => {
    const mockStreak = {
      id: '1',
      currentCount: 5,
      maxCount: 15,
      lastActiveAt: new Date().toISOString(),
    };

    mockApi.getStreak.mockResolvedValue({ data: mockStreak });

    render(<StreakCard />);

    await waitFor(() => {
      expect(screen.getByText('15')).toBeInTheDocument();
      expect(screen.getByText('Personal Best')).toBeInTheDocument();
    });
  });

  it('shows fire animation when streak > 0', async () => {
    const mockStreak = {
      id: '1',
      currentCount: 3,
      maxCount: 10,
      lastActiveAt: new Date().toISOString(),
    };

    mockApi.getStreak.mockResolvedValue({ data: mockStreak });

    render(<StreakCard />);

    await waitFor(() => {
      const fireEmoji = screen.getByText('🔥');
      expect(fireEmoji).toBeInTheDocument();
      expect(fireEmoji.className).toContain('animate-fire');
    });
  });

  it('shows sleeping emoji when streak is 0', async () => {
    const mockStreak = {
      id: '1',
      currentCount: 0,
      maxCount: 10,
      lastActiveAt: new Date().toISOString(),
    };

    mockApi.getStreak.mockResolvedValue({ data: mockStreak });

    render(<StreakCard />);

    await waitFor(() => {
      expect(screen.getByText('💤')).toBeInTheDocument();
      expect(screen.getByText('No Active Streak')).toBeInTheDocument();
    });
  });

  it('shows warning indicator when streak is about to break', async () => {
    const twentyOneHoursAgo = new Date();
    twentyOneHoursAgo.setHours(twentyOneHoursAgo.getHours() - 21);

    const mockStreak = {
      id: '1',
      currentCount: 5,
      maxCount: 10,
      lastActiveAt: twentyOneHoursAgo.toISOString(),
    };

    mockApi.getStreak.mockResolvedValue({ data: mockStreak });

    render(<StreakCard />);

    await waitFor(() => {
      expect(screen.getByText(/Complete a task today to keep your streak/i)).toBeInTheDocument();
      expect(screen.getByText('⚠️')).toBeInTheDocument();
    });
  });

  it('does not show warning when last active was recent', async () => {
    const mockStreak = {
      id: '1',
      currentCount: 5,
      maxCount: 10,
      lastActiveAt: new Date().toISOString(),
    };

    mockApi.getStreak.mockResolvedValue({ data: mockStreak });

    render(<StreakCard />);

    await waitFor(() => {
      expect(screen.queryByText(/Complete a task today to keep your streak/i)).not.toBeInTheDocument();
    });
  });

  it('displays real-time live indicator when connected', async () => {
    mockUseWebSocket.mockReturnValue({
      isConnected: true,
      connectionError: null,
      sendMessage: jest.fn(),
      disconnect: jest.fn(),
      reconnect: jest.fn(),
    });

    const mockStreak = {
      id: '1',
      currentCount: 5,
      maxCount: 10,
      lastActiveAt: new Date().toISOString(),
    };

    mockApi.getStreak.mockResolvedValue({ data: mockStreak });

    render(<StreakCard />);

    await waitFor(() => {
      expect(screen.getByText('Live')).toBeInTheDocument();
    });
  });

  it('updates streak in real-time via WebSocket', async () => {
    let onMessageCallback: ((message: any) => void) | undefined;

    mockUseWebSocket.mockImplementation(({ onMessage }) => {
      onMessageCallback = onMessage;
      return {
        isConnected: true,
        connectionError: null,
        sendMessage: jest.fn(),
        disconnect: jest.fn(),
        reconnect: jest.fn(),
      };
    });

    const initialStreak = {
      id: '1',
      currentCount: 5,
      maxCount: 10,
      lastActiveAt: new Date().toISOString(),
    };

    mockApi.getStreak.mockResolvedValue({ data: initialStreak });

    render(<StreakCard />);

    await waitFor(() => {
      expect(screen.getByText('5')).toBeInTheDocument();
    });

    // Simulate WebSocket message
    const updatedStreak = {
      id: '1',
      currentCount: 6,
      maxCount: 10,
      lastActiveAt: new Date().toISOString(),
    };

    act(() => {
      onMessageCallback?.({
        type: 'streak_update',
        data: updatedStreak,
      });
    });

    await waitFor(() => {
      expect(screen.getByText('6')).toBeInTheDocument();
    });
  });

  it('is mobile-friendly with responsive classes', async () => {
    const mockStreak = {
      id: '1',
      currentCount: 5,
      maxCount: 10,
      lastActiveAt: new Date().toISOString(),
    };

    mockApi.getStreak.mockResolvedValue({ data: mockStreak });

    const { container } = render(<StreakCard />);

    await waitFor(() => {
      const card = container.querySelector('.p-4.sm\\:p-6');
      expect(card).toBeInTheDocument();
    });
  });

  it('handles API errors gracefully', async () => {
    mockApi.getStreak.mockResolvedValue({ error: 'Failed to fetch streak' });

    render(<StreakCard />);

    await waitFor(() => {
      // Should show 0 streak when API fails
      expect(screen.getByText('0')).toBeInTheDocument();
    });
  });
});
