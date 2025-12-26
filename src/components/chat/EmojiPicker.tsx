import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Clock, Smile, Heart, ThumbsUp, Flame, Star, PartyPopper } from 'lucide-react';
import { cn } from '@/lib/utils';

interface EmojiPickerProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (emoji: string) => void;
  position?: 'top' | 'bottom';
}

const emojiCategories = [
  {
    name: 'Recent',
    icon: Clock,
    emojis: ['👍', '❤️', '😂', '🔥', '👏', '😊'],
  },
  {
    name: 'Smileys',
    icon: Smile,
    emojis: ['😀', '😃', '😄', '😁', '😅', '😂', '🤣', '😊', '😇', '🙂', '😉', '😍', '🥰', '😘', '😋', '😎', '🤩', '🥳', '😏', '😌', '😔', '😢', '😭', '😤', '😠', '🤔', '🤨', '😐', '😑', '🙄', '😴', '🤮'],
  },
  {
    name: 'Gestures',
    icon: ThumbsUp,
    emojis: ['👍', '👎', '👊', '✊', '🤛', '🤜', '👏', '🙌', '👐', '🤲', '🤝', '🙏', '✌️', '🤞', '🤟', '🤘', '👌', '🤌', '🤏', '👈', '👉', '👆', '👇', '☝️', '✋', '🤚', '🖐️', '🖖', '👋', '🤙', '💪'],
  },
  {
    name: 'Hearts',
    icon: Heart,
    emojis: ['❤️', '🧡', '💛', '💚', '💙', '💜', '🖤', '🤍', '🤎', '💔', '❣️', '💕', '💞', '💓', '💗', '💖', '💘', '💝', '💟', '♥️'],
  },
  {
    name: 'Fire',
    icon: Flame,
    emojis: ['🔥', '⭐', '✨', '💫', '🌟', '💥', '💢', '💦', '💨', '🕳️', '💣', '💬', '👁️‍🗨️', '🗨️', '🗯️', '💭', '💤', '🎉', '🎊', '🎈', '🎁', '🏆', '🥇', '🥈', '🥉', '🏅', '🎖️', '🎗️'],
  },
  {
    name: 'Objects',
    icon: Star,
    emojis: ['💻', '🖥️', '📱', '📲', '⌨️', '🖱️', '💾', '💿', '📀', '🎮', '🕹️', '📷', '📸', '📹', '🎥', '📽️', '🎬', '📺', '📻', '🎙️', '🎚️', '🎛️', '🧭', '⏱️', '⏲️', '⏰', '🕰️', '💡', '🔦', '🏮'],
  },
  {
    name: 'Celebration',
    icon: PartyPopper,
    emojis: ['🎉', '🎊', '🎈', '🎁', '🎀', '🎗️', '🎟️', '🎫', '🎖️', '🏆', '🏅', '🥇', '🥈', '🥉', '⚽', '🏀', '🏈', '⚾', '🥎', '🎾', '🏐', '🏉', '🥏', '🎱', '🪀', '🏓', '🏸', '🏒', '🏑', '🥍'],
  },
];

export function EmojiPicker({ isOpen, onClose, onSelect, position = 'top' }: EmojiPickerProps) {
  const [activeCategory, setActiveCategory] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');

  const handleEmojiClick = (emoji: string) => {
    onSelect(emoji);
    onClose();
  };

  const filteredEmojis = searchQuery
    ? emojiCategories.flatMap(c => c.emojis).filter(e => e.includes(searchQuery))
    : emojiCategories[activeCategory].emojis;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-40"
            onClick={onClose}
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: position === 'top' ? 10 : -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: position === 'top' ? 10 : -10 }}
            className={cn(
              'absolute z-50 w-80 bg-card border border-border rounded-xl shadow-2xl overflow-hidden',
              position === 'top' ? 'bottom-full mb-2' : 'top-full mt-2'
            )}
          >
            {/* Search */}
            <div className="p-3 border-b border-border">
              <div className="flex items-center gap-2 px-3 py-2 bg-surface-2 rounded-lg">
                <Search className="w-4 h-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search emoji..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="flex-1 bg-transparent border-none outline-none text-sm text-foreground placeholder:text-muted-foreground"
                />
              </div>
            </div>

            {/* Category Tabs */}
            {!searchQuery && (
              <div className="flex items-center gap-1 p-2 border-b border-border overflow-x-auto scrollbar-thin">
                {emojiCategories.map((category, index) => {
                  const Icon = category.icon;
                  return (
                    <motion.button
                      key={category.name}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => setActiveCategory(index)}
                      className={cn(
                        'p-2 rounded-lg transition-colors',
                        activeCategory === index
                          ? 'bg-primary text-primary-foreground'
                          : 'text-muted-foreground hover:bg-surface-2'
                      )}
                      title={category.name}
                    >
                      <Icon className="w-4 h-4" />
                    </motion.button>
                  );
                })}
              </div>
            )}

            {/* Emoji Grid */}
            <div className="p-3 max-h-60 overflow-y-auto scrollbar-thin">
              {!searchQuery && (
                <p className="text-xs font-medium text-muted-foreground mb-2 uppercase tracking-wider">
                  {emojiCategories[activeCategory].name}
                </p>
              )}
              <div className="grid grid-cols-8 gap-1">
                {filteredEmojis.map((emoji, index) => (
                  <motion.button
                    key={`${emoji}-${index}`}
                    whileHover={{ scale: 1.2 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => handleEmojiClick(emoji)}
                    className="w-8 h-8 flex items-center justify-center text-xl rounded-lg hover:bg-surface-2 transition-colors"
                  >
                    {emoji}
                  </motion.button>
                ))}
              </div>

              {filteredEmojis.length === 0 && (
                <p className="text-center text-muted-foreground py-4 text-sm">
                  No emojis found
                </p>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
