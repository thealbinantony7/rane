import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronRight, Pin, VolumeX, Volume2, Bell, BellOff, Trash2, Archive, Flag, Copy } from 'lucide-react';
import { cn } from '@/lib/utils';

interface MessageContextMenuProps {
  isOpen: boolean;
  position: { x: number; y: number };
  onClose: () => void;
  onAction: (action: string) => void;
  isOwnMessage: boolean;
}

export function MessageContextMenu({ isOpen, position, onClose, onAction, isOwnMessage }: MessageContextMenuProps) {
  const actions = [
    { id: 'reply', label: 'Reply', icon: ChevronRight },
    { id: 'copy', label: 'Copy Text', icon: Copy },
    { id: 'pin', label: 'Pin Message', icon: Pin },
    { id: 'forward', label: 'Forward', icon: ChevronRight },
    ...(isOwnMessage ? [
      { id: 'edit', label: 'Edit', icon: ChevronRight },
      { id: 'delete', label: 'Delete', icon: Trash2, destructive: true },
    ] : [
      { id: 'report', label: 'Report', icon: Flag, destructive: true },
    ]),
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <div className="fixed inset-0 z-50" onClick={onClose} />
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            style={{ left: position.x, top: position.y }}
            className="fixed z-50 bg-card border border-border rounded-xl shadow-2xl overflow-hidden min-w-[180px]"
          >
            {actions.map((action, index) => (
              <motion.button
                key={action.id}
                whileHover={{ backgroundColor: action.destructive ? 'hsl(var(--destructive) / 0.1)' : 'hsl(var(--surface-2))' }}
                onClick={() => {
                  onAction(action.id);
                  onClose();
                }}
                className={cn(
                  'w-full flex items-center gap-3 px-4 py-2.5 transition-colors text-left',
                  action.destructive ? 'text-destructive' : 'text-foreground',
                  index !== actions.length - 1 && 'border-b border-border'
                )}
              >
                <action.icon className="w-4 h-4" />
                <span className="text-sm">{action.label}</span>
              </motion.button>
            ))}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

interface ConversationActionsMenuProps {
  isOpen: boolean;
  onClose: () => void;
  onAction: (action: string) => void;
  isPinned: boolean;
  isMuted: boolean;
}

export function ConversationActionsMenu({ isOpen, onClose, onAction, isPinned, isMuted }: ConversationActionsMenuProps) {
  const actions = [
    { id: 'pin', label: isPinned ? 'Unpin' : 'Pin', icon: Pin },
    { id: 'mute', label: isMuted ? 'Unmute' : 'Mute', icon: isMuted ? Volume2 : VolumeX },
    { id: 'archive', label: 'Archive', icon: Archive },
    { id: 'delete', label: 'Delete', icon: Trash2, destructive: true },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-50"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: -10 }}
            className="absolute right-0 top-full mt-2 z-50 bg-card border border-border rounded-xl shadow-2xl overflow-hidden min-w-[180px]"
          >
            {actions.map((action, index) => (
              <motion.button
                key={action.id}
                whileHover={{ backgroundColor: action.destructive ? 'hsl(var(--destructive) / 0.1)' : 'hsl(var(--surface-2))' }}
                onClick={() => {
                  onAction(action.id);
                  onClose();
                }}
                className={cn(
                  'w-full flex items-center gap-3 px-4 py-2.5 transition-colors text-left',
                  action.destructive ? 'text-destructive' : 'text-foreground'
                )}
              >
                <action.icon className="w-4 h-4" />
                <span className="text-sm">{action.label}</span>
              </motion.button>
            ))}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
