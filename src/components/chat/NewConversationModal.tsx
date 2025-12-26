import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Users, Hash, MessageSquare, Search, Check, Plus } from 'lucide-react';
import { users } from '@/lib/mockData';
import { cn } from '@/lib/utils';

interface NewConversationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (type: 'direct' | 'group' | 'channel', data: any) => void;
}

type ConversationType = 'direct' | 'group' | 'channel';

export function NewConversationModal({ isOpen, onClose, onCreate }: NewConversationModalProps) {
  const [type, setType] = useState<ConversationType>('direct');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [groupName, setGroupName] = useState('');
  const [channelName, setChannelName] = useState('');
  const [isPrivate, setIsPrivate] = useState(false);

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.username.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const toggleUser = (userId: string) => {
    if (type === 'direct') {
      setSelectedUsers([userId]);
    } else {
      setSelectedUsers(prev =>
        prev.includes(userId)
          ? prev.filter(id => id !== userId)
          : [...prev, userId]
      );
    }
  };

  const handleCreate = () => {
    if (type === 'direct' && selectedUsers.length === 1) {
      onCreate('direct', { userId: selectedUsers[0] });
    } else if (type === 'group' && selectedUsers.length > 0 && groupName) {
      onCreate('group', { name: groupName, userIds: selectedUsers });
    } else if (type === 'channel' && channelName) {
      onCreate('channel', { name: channelName, isPrivate });
    }
    onClose();
    resetForm();
  };

  const resetForm = () => {
    setType('direct');
    setSearchQuery('');
    setSelectedUsers([]);
    setGroupName('');
    setChannelName('');
    setIsPrivate(false);
  };

  const canCreate = 
    (type === 'direct' && selectedUsers.length === 1) ||
    (type === 'group' && selectedUsers.length > 0 && groupName.trim()) ||
    (type === 'channel' && channelName.trim());

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-card border border-border rounded-2xl shadow-2xl z-50 overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-border">
              <h3 className="text-lg font-semibold text-foreground">New Conversation</h3>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={onClose}
                className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-surface-2 transition-colors"
              >
                <X className="w-5 h-5" />
              </motion.button>
            </div>

            {/* Type Selector */}
            <div className="flex p-2 gap-1 border-b border-border">
              {[
                { id: 'direct' as const, label: 'Direct', icon: MessageSquare },
                { id: 'group' as const, label: 'Group', icon: Users },
                { id: 'channel' as const, label: 'Channel', icon: Hash },
              ].map(({ id, label, icon: Icon }) => (
                <motion.button
                  key={id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    setType(id);
                    setSelectedUsers([]);
                  }}
                  className={cn(
                    'flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg transition-colors',
                    type === id
                      ? 'bg-primary text-primary-foreground'
                      : 'text-muted-foreground hover:bg-surface-2'
                  )}
                >
                  <Icon className="w-4 h-4" />
                  <span className="text-sm font-medium">{label}</span>
                </motion.button>
              ))}
            </div>

            <div className="p-4 space-y-4 max-h-[400px] overflow-y-auto scrollbar-thin">
              {/* Group/Channel Name */}
              {type === 'group' && (
                <div>
                  <label className="text-sm font-medium text-foreground mb-1.5 block">Group Name</label>
                  <input
                    type="text"
                    value={groupName}
                    onChange={(e) => setGroupName(e.target.value)}
                    placeholder="Enter group name..."
                    className="w-full px-4 py-2.5 bg-surface-2 rounded-lg border border-border focus:border-primary focus:outline-none transition-colors text-foreground placeholder:text-muted-foreground"
                  />
                </div>
              )}

              {type === 'channel' && (
                <>
                  <div>
                    <label className="text-sm font-medium text-foreground mb-1.5 block">Channel Name</label>
                    <div className="flex items-center gap-2">
                      <span className="text-muted-foreground">#</span>
                      <input
                        type="text"
                        value={channelName}
                        onChange={(e) => setChannelName(e.target.value.toLowerCase().replace(/\s/g, '-'))}
                        placeholder="channel-name"
                        className="flex-1 px-4 py-2.5 bg-surface-2 rounded-lg border border-border focus:border-primary focus:outline-none transition-colors text-foreground placeholder:text-muted-foreground"
                      />
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-surface-2 rounded-lg">
                    <span className="text-foreground">Private Channel</span>
                    <motion.button
                      whileTap={{ scale: 0.9 }}
                      onClick={() => setIsPrivate(!isPrivate)}
                      className={cn(
                        'w-12 h-7 rounded-full p-1 transition-colors',
                        isPrivate ? 'bg-primary' : 'bg-surface-3'
                      )}
                    >
                      <motion.div
                        animate={{ x: isPrivate ? 20 : 0 }}
                        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                        className="w-5 h-5 rounded-full bg-white shadow-sm"
                      />
                    </motion.button>
                  </div>
                </>
              )}

              {/* User Search (for direct and group) */}
              {type !== 'channel' && (
                <>
                  <div className="flex items-center gap-2 px-3 py-2.5 bg-surface-2 rounded-lg">
                    <Search className="w-4 h-4 text-muted-foreground" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search users..."
                      className="flex-1 bg-transparent border-none outline-none text-foreground placeholder:text-muted-foreground"
                    />
                  </div>

                  {/* Selected Users */}
                  {selectedUsers.length > 0 && type === 'group' && (
                    <div className="flex flex-wrap gap-2">
                      {selectedUsers.map(userId => {
                        const user = users.find(u => u.id === userId);
                        return user ? (
                          <motion.span
                            key={userId}
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="flex items-center gap-2 px-3 py-1.5 bg-primary/10 text-primary rounded-full text-sm"
                          >
                            {user.name}
                            <button onClick={() => toggleUser(userId)} className="hover:bg-primary/20 rounded-full p-0.5">
                              <X className="w-3 h-3" />
                            </button>
                          </motion.span>
                        ) : null;
                      })}
                    </div>
                  )}

                  {/* User List */}
                  <div className="space-y-1">
                    {filteredUsers.map(user => (
                      <motion.button
                        key={user.id}
                        whileHover={{ backgroundColor: 'hsl(var(--surface-2))' }}
                        onClick={() => toggleUser(user.id)}
                        className={cn(
                          'w-full flex items-center gap-3 p-3 rounded-lg transition-colors',
                          selectedUsers.includes(user.id) && 'bg-primary/10'
                        )}
                      >
                        <div className="relative">
                          <img src={user.avatar} alt={user.name} className="w-10 h-10 rounded-full" />
                          <span
                            className={cn(
                              'absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-card',
                              user.status === 'online' && 'bg-status-online',
                              user.status === 'away' && 'bg-status-away',
                              user.status === 'offline' && 'bg-muted'
                            )}
                          />
                        </div>
                        <div className="flex-1 text-left">
                          <p className="font-medium text-foreground">{user.name}</p>
                          <p className="text-sm text-muted-foreground">@{user.username}</p>
                        </div>
                        {selectedUsers.includes(user.id) && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="w-6 h-6 rounded-full bg-primary flex items-center justify-center"
                          >
                            <Check className="w-4 h-4 text-primary-foreground" />
                          </motion.div>
                        )}
                      </motion.button>
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* Footer */}
            <div className="flex items-center justify-end gap-2 p-4 border-t border-border bg-surface-1">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={onClose}
                className="px-4 py-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-surface-2 transition-colors"
              >
                Cancel
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleCreate}
                disabled={!canCreate}
                className={cn(
                  'flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors',
                  canCreate
                    ? 'bg-primary text-primary-foreground hover:bg-primary/90'
                    : 'bg-muted text-muted-foreground cursor-not-allowed'
                )}
              >
                <Plus className="w-4 h-4" />
                Create
              </motion.button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
