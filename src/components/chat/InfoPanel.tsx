import { motion } from 'framer-motion';
import { X, Bell, BellOff, Pin, Trash2, Image, File, Link2, Users, Shield, Hash } from 'lucide-react';
import { Conversation, users } from '@/lib/mockData';
import { cn } from '@/lib/utils';

interface InfoPanelProps {
  conversation: Conversation;
  onClose: () => void;
}

export function InfoPanel({ conversation, onClose }: InfoPanelProps) {
  const participant = conversation.participants[0];

  const mediaItems = [
    { type: 'image', count: 24 },
    { type: 'file', count: 12 },
    { type: 'link', count: 8 },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      className="w-80 h-full bg-card border-l border-border flex flex-col"
    >
      {/* Header */}
      <div className="h-16 px-4 border-b border-border flex items-center justify-between">
        <h3 className="font-semibold text-foreground">Info</h3>
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={onClose}
          className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-surface-2 transition-colors"
        >
          <X className="w-5 h-5" />
        </motion.button>
      </div>

      <div className="flex-1 overflow-y-auto scrollbar-thin">
        {/* Profile Section */}
        <div className="p-6 text-center border-b border-border">
          {conversation.type === 'channel' ? (
            <div className="w-20 h-20 mx-auto rounded-full bg-surface-3 flex items-center justify-center mb-4">
              <Hash className="w-10 h-10 text-muted-foreground" />
            </div>
          ) : conversation.type === 'group' ? (
            <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center mb-4">
              <Users className="w-10 h-10 text-primary" />
            </div>
          ) : (
            <img
              src={participant?.avatar}
              alt={conversation.name}
              className="w-20 h-20 mx-auto rounded-full object-cover mb-4"
            />
          )}
          
          <h2 className="text-xl font-semibold text-foreground mb-1">{conversation.name}</h2>
          
          {conversation.type === 'direct' && participant && (
            <>
              <p className="text-sm text-muted-foreground mb-2">@{participant.username}</p>
              <span
                className={cn(
                  'inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium',
                  participant.status === 'online' && 'bg-status-online/10 text-status-online',
                  participant.status === 'away' && 'bg-status-away/10 text-status-away',
                  participant.status === 'offline' && 'bg-muted text-muted-foreground'
                )}
              >
                <span className={cn(
                  'w-2 h-2 rounded-full',
                  participant.status === 'online' && 'bg-status-online',
                  participant.status === 'away' && 'bg-status-away',
                  participant.status === 'offline' && 'bg-muted-foreground'
                )} />
                {participant.status === 'online' ? 'Online' : participant.lastSeen || 'Offline'}
              </span>
            </>
          )}

          {conversation.type !== 'direct' && (
            <p className="text-sm text-muted-foreground">
              {conversation.participants.length} {conversation.type === 'channel' ? 'subscribers' : 'members'}
            </p>
          )}
        </div>

        {/* Actions */}
        <div className="p-4 border-b border-border space-y-1">
          <motion.button
            whileHover={{ backgroundColor: 'hsl(var(--surface-2))' }}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-foreground transition-colors"
          >
            {conversation.isMuted ? <BellOff className="w-5 h-5" /> : <Bell className="w-5 h-5" />}
            <span>{conversation.isMuted ? 'Unmute' : 'Mute'} notifications</span>
          </motion.button>
          
          <motion.button
            whileHover={{ backgroundColor: 'hsl(var(--surface-2))' }}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-foreground transition-colors"
          >
            <Pin className="w-5 h-5" />
            <span>{conversation.isPinned ? 'Unpin' : 'Pin'} conversation</span>
          </motion.button>

          <motion.button
            whileHover={{ backgroundColor: 'hsl(var(--surface-2))' }}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-foreground transition-colors"
          >
            <Shield className="w-5 h-5" />
            <span>Encryption</span>
            <span className="ml-auto text-xs text-status-online font-medium">Active</span>
          </motion.button>
        </div>

        {/* Media */}
        <div className="p-4 border-b border-border">
          <h4 className="text-sm font-medium text-muted-foreground mb-3 uppercase tracking-wider">
            Shared Media
          </h4>
          <div className="space-y-1">
            {mediaItems.map(({ type, count }) => (
              <motion.button
                key={type}
                whileHover={{ backgroundColor: 'hsl(var(--surface-2))' }}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-foreground transition-colors"
              >
                {type === 'image' && <Image className="w-5 h-5" />}
                {type === 'file' && <File className="w-5 h-5" />}
                {type === 'link' && <Link2 className="w-5 h-5" />}
                <span className="capitalize">{type}s</span>
                <span className="ml-auto text-sm text-muted-foreground">{count}</span>
              </motion.button>
            ))}
          </div>
        </div>

        {/* Members (for groups) */}
        {conversation.type !== 'direct' && (
          <div className="p-4 border-b border-border">
            <h4 className="text-sm font-medium text-muted-foreground mb-3 uppercase tracking-wider">
              Members
            </h4>
            <div className="space-y-1">
              {conversation.participants.map(member => (
                <motion.button
                  key={member.id}
                  whileHover={{ backgroundColor: 'hsl(var(--surface-2))' }}
                  className="w-full flex items-center gap-3 px-4 py-2 rounded-lg transition-colors"
                >
                  <div className="relative">
                    <img
                      src={member.avatar}
                      alt={member.name}
                      className="w-8 h-8 rounded-full"
                    />
                    <span
                      className={cn(
                        'absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border-2 border-card',
                        member.status === 'online' && 'bg-status-online',
                        member.status === 'away' && 'bg-status-away',
                        member.status === 'offline' && 'bg-muted'
                      )}
                    />
                  </div>
                  <div className="text-left">
                    <p className="text-sm font-medium text-foreground">{member.name}</p>
                    <p className="text-xs text-muted-foreground">@{member.username}</p>
                  </div>
                </motion.button>
              ))}
            </div>
          </div>
        )}

        {/* Danger Zone */}
        <div className="p-4">
          <motion.button
            whileHover={{ backgroundColor: 'hsl(var(--destructive) / 0.1)' }}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-destructive transition-colors"
          >
            <Trash2 className="w-5 h-5" />
            <span>Delete conversation</span>
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}
