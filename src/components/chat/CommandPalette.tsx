import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, MessageCircle, Users, Hash, Settings, User, Moon, Sun, Plus, Sparkles } from 'lucide-react';
import { conversations, users } from '@/lib/mockData';
import { cn } from '@/lib/utils';
import { LinkUpLogo } from '@/components/LinkUpLogo';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectConversation: (conversationId: string) => void;
}

type CommandSection = {
  title: string;
  items: CommandItem[];
};

type CommandItem = {
  id: string;
  icon: React.ReactNode;
  title: string;
  subtitle?: string;
  action: () => void;
};

export function CommandPalette({ isOpen, onClose, onSelectConversation }: CommandPaletteProps) {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus();
      setQuery('');
      setSelectedIndex(0);
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex(prev => prev + 1);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex(prev => Math.max(0, prev - 1));
      } else if (e.key === 'Enter') {
        e.preventDefault();
        // Execute selected action
        const allItems = sections.flatMap(s => s.items);
        if (allItems[selectedIndex]) {
          allItems[selectedIndex].action();
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, selectedIndex]);

  const sections: CommandSection[] = [
    {
      title: 'Quick Actions',
      items: [
        {
          id: 'new-chat',
          icon: <Plus className="w-4 h-4" />,
          title: 'New conversation',
          subtitle: 'Start a new chat',
          action: () => {
            onClose();
          },
        },
        {
          id: 'ai-summary',
          icon: <Sparkles className="w-4 h-4" />,
          title: 'AI Summary',
          subtitle: 'Summarize unread messages',
          action: () => {
            onClose();
          },
        },
      ],
    },
    {
      title: 'Conversations',
      items: conversations
        .filter(c => c.name.toLowerCase().includes(query.toLowerCase()))
        .slice(0, 5)
        .map(conv => ({
          id: conv.id,
          icon: conv.type === 'channel' ? (
            <Hash className="w-4 h-4" />
          ) : conv.type === 'group' ? (
            <Users className="w-4 h-4" />
          ) : (
            <MessageCircle className="w-4 h-4" />
          ),
          title: conv.name,
          subtitle: conv.type === 'direct' ? '@' + conv.participants[0]?.username : `${conv.participants.length} members`,
          action: () => {
            onSelectConversation(conv.id);
            onClose();
          },
        })),
    },
    {
      title: 'People',
      items: users
        .filter(u => u.name.toLowerCase().includes(query.toLowerCase()))
        .slice(0, 3)
        .map(user => ({
          id: user.id,
          icon: <User className="w-4 h-4" />,
          title: user.name,
          subtitle: '@' + user.username,
          action: () => {
            onClose();
          },
        })),
    },
    {
      title: 'Settings',
      items: [
        {
          id: 'settings',
          icon: <Settings className="w-4 h-4" />,
          title: 'Settings',
          subtitle: 'Preferences and account',
          action: () => {
            onClose();
          },
        },
      ],
    },
  ];

  const filteredSections = sections
    .map(section => ({
      ...section,
      items: section.items.filter(
        item =>
          item.title.toLowerCase().includes(query.toLowerCase()) ||
          item.subtitle?.toLowerCase().includes(query.toLowerCase())
      ),
    }))
    .filter(section => section.items.length > 0);

  let globalIndex = 0;
  const allItems = filteredSections.flatMap(s => s.items);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50"
          />

          {/* Palette */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            transition={{ type: 'spring', stiffness: 500, damping: 30 }}
            className="fixed top-[20%] left-1/2 -translate-x-1/2 w-full max-w-lg bg-card border border-border rounded-2xl shadow-2xl overflow-hidden z-50"
          >
            {/* Search Input */}
            <div className="flex items-center gap-3 px-4 py-4 border-b border-border">
              <Search className="w-5 h-5 text-muted-foreground" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setSelectedIndex(0);
                }}
                placeholder="Search messages, people, channels..."
                className="flex-1 bg-transparent border-none outline-none text-foreground placeholder:text-muted-foreground text-lg"
              />
              <kbd className="hidden sm:inline-flex h-6 items-center gap-1 rounded border border-border bg-muted px-2 font-mono text-[11px] font-medium text-muted-foreground">
                ESC
              </kbd>
            </div>

            {/* Results */}
            <div className="max-h-[400px] overflow-y-auto scrollbar-thin py-2">
              {filteredSections.map((section) => (
                <div key={section.title} className="px-2 mb-2">
                  <p className="text-xs font-medium text-muted-foreground px-3 py-2 uppercase tracking-wider">
                    {section.title}
                  </p>
                  {section.items.map((item) => {
                    const itemIndex = globalIndex++;
                    const isSelected = itemIndex === selectedIndex;

                    return (
                      <motion.button
                        key={item.id}
                        onClick={item.action}
                        whileHover={{ backgroundColor: 'hsl(var(--surface-2))' }}
                        className={cn(
                          'w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors text-left',
                          isSelected && 'bg-surface-2'
                        )}
                      >
                        <div className="w-8 h-8 rounded-lg bg-surface-3 flex items-center justify-center text-muted-foreground">
                          {item.icon}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-foreground truncate">{item.title}</p>
                          {item.subtitle && (
                            <p className="text-sm text-muted-foreground truncate">{item.subtitle}</p>
                          )}
                        </div>
                      </motion.button>
                    );
                  })}
                </div>
              ))}

              {filteredSections.length === 0 && (
                <div className="py-12 text-center">
                  <p className="text-muted-foreground">No results found</p>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="px-4 py-3 border-t border-border bg-surface-1 flex items-center justify-between text-xs text-muted-foreground">
              <div className="flex items-center gap-4">
                <span className="flex items-center gap-1">
                  <kbd className="px-1.5 py-0.5 rounded bg-surface-3 font-mono">↑↓</kbd>
                  Navigate
                </span>
                <span className="flex items-center gap-1">
                  <kbd className="px-1.5 py-0.5 rounded bg-surface-3 font-mono">↵</kbd>
                  Select
                </span>
              </div>
              <LinkUpLogo size="sm" />
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
