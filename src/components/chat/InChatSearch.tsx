import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, ChevronUp, ChevronDown, Calendar, User, Image, File, Link2 } from 'lucide-react';
import { Message, users, currentUser } from '@/lib/mockData';
import { cn } from '@/lib/utils';

interface InChatSearchProps {
  isOpen: boolean;
  onClose: () => void;
  messages: Message[];
  onNavigateToMessage: (messageId: string) => void;
}

type FilterType = 'all' | 'text' | 'media' | 'links' | 'files';

export function InChatSearch({ isOpen, onClose, messages, onNavigateToMessage }: InChatSearchProps) {
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState<FilterType>('all');
  const [results, setResults] = useState<Message[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus();
      setQuery('');
      setResults([]);
      setCurrentIndex(0);
    }
  }, [isOpen]);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    const searchResults = messages.filter(msg => {
      const matchesQuery = msg.content.toLowerCase().includes(query.toLowerCase());
      
      if (!matchesQuery) return false;
      
      switch (filter) {
        case 'media':
          return msg.content.includes('[Voice message') || msg.content.includes('[Attached');
        case 'links':
          return msg.content.includes('http');
        case 'files':
          return msg.content.includes('[Attached');
        default:
          return true;
      }
    });

    setResults(searchResults);
    setCurrentIndex(0);
    
    if (searchResults.length > 0) {
      onNavigateToMessage(searchResults[0].id);
    }
  }, [query, filter, messages]);

  const navigatePrev = () => {
    if (results.length === 0) return;
    const newIndex = currentIndex > 0 ? currentIndex - 1 : results.length - 1;
    setCurrentIndex(newIndex);
    onNavigateToMessage(results[newIndex].id);
  };

  const navigateNext = () => {
    if (results.length === 0) return;
    const newIndex = currentIndex < results.length - 1 ? currentIndex + 1 : 0;
    setCurrentIndex(newIndex);
    onNavigateToMessage(results[newIndex].id);
  };

  const getSender = (senderId: string) => {
    return senderId === currentUser.id ? currentUser : users.find(u => u.id === senderId);
  };

  const filters: { id: FilterType; label: string; icon: any }[] = [
    { id: 'all', label: 'All', icon: Search },
    { id: 'media', label: 'Media', icon: Image },
    { id: 'files', label: 'Files', icon: File },
    { id: 'links', label: 'Links', icon: Link2 },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="absolute top-16 left-0 right-0 z-20 bg-card border-b border-border shadow-lg"
        >
          <div className="p-4">
            {/* Search Input */}
            <div className="flex items-center gap-2 mb-3">
              <div className="flex-1 flex items-center gap-2 px-4 py-2.5 bg-surface-2 rounded-lg">
                <Search className="w-4 h-4 text-muted-foreground" />
                <input
                  ref={inputRef}
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search in conversation..."
                  className="flex-1 bg-transparent border-none outline-none text-foreground placeholder:text-muted-foreground"
                />
                {query && (
                  <button onClick={() => setQuery('')} className="text-muted-foreground hover:text-foreground">
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
              
              {/* Navigation */}
              {results.length > 0 && (
                <div className="flex items-center gap-1">
                  <span className="text-sm text-muted-foreground px-2">
                    {currentIndex + 1} / {results.length}
                  </span>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={navigatePrev}
                    className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-surface-2 transition-colors"
                  >
                    <ChevronUp className="w-4 h-4" />
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={navigateNext}
                    className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-surface-2 transition-colors"
                  >
                    <ChevronDown className="w-4 h-4" />
                  </motion.button>
                </div>
              )}
              
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={onClose}
                className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-surface-2 transition-colors"
              >
                <X className="w-5 h-5" />
              </motion.button>
            </div>

            {/* Filters */}
            <div className="flex items-center gap-1">
              {filters.map(({ id, label, icon: Icon }) => (
                <motion.button
                  key={id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setFilter(id)}
                  className={cn(
                    'flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-colors',
                    filter === id
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-surface-2 text-muted-foreground hover:text-foreground'
                  )}
                >
                  <Icon className="w-3.5 h-3.5" />
                  {label}
                </motion.button>
              ))}
            </div>
          </div>

          {/* Results Preview */}
          {query && results.length > 0 && (
            <div className="border-t border-border max-h-64 overflow-y-auto scrollbar-thin">
              {results.slice(0, 5).map((msg, index) => {
                const sender = getSender(msg.senderId);
                return (
                  <motion.button
                    key={msg.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    onClick={() => {
                      setCurrentIndex(index);
                      onNavigateToMessage(msg.id);
                    }}
                    className={cn(
                      'w-full flex items-start gap-3 p-3 hover:bg-surface-2 transition-colors text-left',
                      currentIndex === index && 'bg-primary/10'
                    )}
                  >
                    <img src={sender?.avatar} alt="" className="w-8 h-8 rounded-full flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className="text-sm font-medium text-foreground">{sender?.name}</span>
                        <span className="text-xs text-muted-foreground">
                          {msg.timestamp.toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground truncate">
                        {highlightMatch(msg.content, query)}
                      </p>
                    </div>
                  </motion.button>
                );
              })}
            </div>
          )}

          {query && results.length === 0 && (
            <div className="p-6 text-center border-t border-border">
              <p className="text-muted-foreground">No messages found</p>
            </div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function highlightMatch(text: string, query: string) {
  const parts = text.split(new RegExp(`(${query})`, 'gi'));
  return parts.map((part, index) =>
    part.toLowerCase() === query.toLowerCase() ? (
      <span key={index} className="bg-primary/30 text-foreground">{part}</span>
    ) : (
      part
    )
  );
}
