export interface User {
  id: string;
  name: string;
  username: string;
  avatar: string;
  status: 'online' | 'away' | 'offline';
  lastSeen?: string;
}

export interface Message {
  id: string;
  content: string;
  senderId: string;
  timestamp: Date;
  reactions?: { emoji: string; count: number }[];
  replyTo?: string;
  isRead?: boolean;
  isBookmarked?: boolean;
  selfDestruct?: number;
}

export interface Conversation {
  id: string;
  type: 'direct' | 'group' | 'channel';
  name: string;
  avatar?: string;
  participants: User[];
  lastMessage?: Message;
  unreadCount: number;
  isPinned?: boolean;
  isMuted?: boolean;
}

export const currentUser: User = {
  id: 'me',
  name: 'You',
  username: 'user',
  avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=me',
  status: 'online',
};

export const users: User[] = [
  {
    id: '1',
    name: 'Alex Chen',
    username: 'alexchen',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=alex',
    status: 'online',
  },
  {
    id: '2',
    name: 'Sarah Miller',
    username: 'sarahmiller',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=sarah',
    status: 'away',
    lastSeen: '5 minutes ago',
  },
  {
    id: '3',
    name: 'Jordan Lee',
    username: 'jordanlee',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=jordan',
    status: 'offline',
    lastSeen: '2 hours ago',
  },
  {
    id: '4',
    name: 'Maya Patel',
    username: 'mayapatel',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=maya',
    status: 'online',
  },
  {
    id: '5',
    name: 'Chris Wong',
    username: 'chriswong',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=chris',
    status: 'online',
  },
];

export const conversations: Conversation[] = [
  {
    id: 'conv-1',
    type: 'direct',
    name: 'Alex Chen',
    participants: [users[0]],
    lastMessage: {
      id: 'm1',
      content: 'Hey! Did you see the new design specs?',
      senderId: '1',
      timestamp: new Date(Date.now() - 1000 * 60 * 2),
    },
    unreadCount: 2,
    isPinned: true,
  },
  {
    id: 'conv-2',
    type: 'group',
    name: 'Design Team',
    avatar: 'https://api.dicebear.com/7.x/shapes/svg?seed=design',
    participants: [users[0], users[1], users[3]],
    lastMessage: {
      id: 'm2',
      content: 'The mockups are ready for review 🎨',
      senderId: '2',
      timestamp: new Date(Date.now() - 1000 * 60 * 15),
    },
    unreadCount: 0,
    isPinned: true,
  },
  {
    id: 'conv-3',
    type: 'direct',
    name: 'Sarah Miller',
    participants: [users[1]],
    lastMessage: {
      id: 'm3',
      content: 'Thanks for the help earlier!',
      senderId: 'me',
      timestamp: new Date(Date.now() - 1000 * 60 * 45),
    },
    unreadCount: 0,
  },
  {
    id: 'conv-4',
    type: 'channel',
    name: 'announcements',
    avatar: 'https://api.dicebear.com/7.x/shapes/svg?seed=announce',
    participants: users,
    lastMessage: {
      id: 'm4',
      content: 'New features launching next week! 🚀',
      senderId: '4',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2),
    },
    unreadCount: 1,
  },
  {
    id: 'conv-5',
    type: 'direct',
    name: 'Jordan Lee',
    participants: [users[2]],
    lastMessage: {
      id: 'm5',
      content: 'Let me know when you\'re free to call',
      senderId: '3',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5),
    },
    unreadCount: 0,
  },
  {
    id: 'conv-6',
    type: 'group',
    name: 'Engineering',
    avatar: 'https://api.dicebear.com/7.x/shapes/svg?seed=eng',
    participants: [users[2], users[4]],
    lastMessage: {
      id: 'm6',
      content: 'PR merged! ✅',
      senderId: '5',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24),
    },
    unreadCount: 0,
    isMuted: true,
  },
];

export const messagesData: Record<string, Message[]> = {
  'conv-1': [
    {
      id: 'msg-1',
      content: 'Hey there! 👋',
      senderId: 'me',
      timestamp: new Date(Date.now() - 1000 * 60 * 30),
      isRead: true,
    },
    {
      id: 'msg-2',
      content: 'Hi! How are you doing?',
      senderId: '1',
      timestamp: new Date(Date.now() - 1000 * 60 * 28),
      isRead: true,
    },
    {
      id: 'msg-3',
      content: 'Pretty good! Just working on the new messaging app design.',
      senderId: 'me',
      timestamp: new Date(Date.now() - 1000 * 60 * 25),
      isRead: true,
    },
    {
      id: 'msg-4',
      content: 'That sounds exciting! Can\'t wait to see it.',
      senderId: '1',
      timestamp: new Date(Date.now() - 1000 * 60 * 20),
      reactions: [{ emoji: '🔥', count: 1 }],
      isRead: true,
    },
    {
      id: 'msg-5',
      content: 'I\'ve been thinking about the UI flow. We need something really clean and intuitive.',
      senderId: 'me',
      timestamp: new Date(Date.now() - 1000 * 60 * 15),
      isRead: true,
    },
    {
      id: 'msg-6',
      content: 'Absolutely. Users are tired of cluttered interfaces. We should aim for that Apple-level polish.',
      senderId: '1',
      timestamp: new Date(Date.now() - 1000 * 60 * 10),
      isRead: true,
    },
    {
      id: 'msg-7',
      content: 'Hey! Did you see the new design specs?',
      senderId: '1',
      timestamp: new Date(Date.now() - 1000 * 60 * 2),
      isRead: false,
    },
  ],
  'conv-2': [
    {
      id: 'msg-g1',
      content: 'Team, I just uploaded the latest wireframes to Figma.',
      senderId: '2',
      timestamp: new Date(Date.now() - 1000 * 60 * 60),
      isRead: true,
    },
    {
      id: 'msg-g2',
      content: 'Nice! I\'ll take a look right now.',
      senderId: '1',
      timestamp: new Date(Date.now() - 1000 * 60 * 55),
      isRead: true,
    },
    {
      id: 'msg-g3',
      content: 'The color palette looks amazing 🎨',
      senderId: '4',
      timestamp: new Date(Date.now() - 1000 * 60 * 45),
      reactions: [{ emoji: '❤️', count: 2 }, { emoji: '👍', count: 1 }],
      isRead: true,
    },
    {
      id: 'msg-g4',
      content: 'The mockups are ready for review 🎨',
      senderId: '2',
      timestamp: new Date(Date.now() - 1000 * 60 * 15),
      isRead: true,
    },
  ],
};

export function formatTimestamp(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffMins < 1) return 'now';
  if (diffMins < 60) return `${diffMins}m`;
  if (diffHours < 24) return `${diffHours}h`;
  if (diffDays < 7) return `${diffDays}d`;
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

export function formatMessageTime(date: Date): string {
  return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
}
