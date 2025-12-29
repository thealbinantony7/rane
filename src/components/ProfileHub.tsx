import { memo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Camera, Bell, Lock, Palette, HelpCircle, LogOut, ChevronRight, User, Moon, Sun, Shield, Smartphone } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/hooks/useAuth';

interface ProfileHubProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ProfileHub = memo(function ProfileHub({ isOpen, onClose }: ProfileHubProps) {
  const { user, signOut } = useAuth();
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const [isDark, setIsDark] = useState(true);

  const menuItems = [
    { id: 'account', icon: User, label: 'Account', description: 'Manage your profile details' },
    { id: 'privacy', icon: Shield, label: 'Privacy & Security', description: 'Control your data' },
    { id: 'notifications', icon: Bell, label: 'Notifications', description: 'Customize alerts' },
    { id: 'appearance', icon: Palette, label: 'Appearance', description: 'Theme & display' },
    { id: 'devices', icon: Smartphone, label: 'Devices', description: 'Manage sessions' },
    { id: 'help', icon: HelpCircle, label: 'Help & Support', description: 'Get assistance' },
  ];

  // Animated memoji frames
  const memojiFrames = ['😊', '😎', '🤗', '🥳', '😇'];
  const [memojiIndex, setMemojiIndex] = useState(0);

  const handleMemojiClick = () => {
    setMemojiIndex((prev) => (prev + 1) % memojiFrames.length);
  };

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
            className="fixed inset-0 bg-background/80 backdrop-blur-xl z-50"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: 'spring', stiffness: 400, damping: 30 }}
            className="fixed inset-4 md:inset-auto md:left-1/2 md:top-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:w-full md:max-w-lg md:max-h-[85vh] glass-panel rounded-2xl overflow-hidden z-50 flex flex-col"
          >
            {/* Header */}
            <div className="p-6 border-b border-border/50">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-display">Profile</h2>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={onClose}
                  className="p-2 rounded-lg hover:bg-surface-2 transition-colors"
                >
                  <X className="w-5 h-5 text-muted-foreground" />
                </motion.button>
              </div>
            </div>

            {/* Profile Section */}
            <div className="p-6 border-b border-border/50">
              <div className="flex items-center gap-4">
                {/* Animated Memoji Avatar */}
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleMemojiClick}
                  className="relative w-20 h-20 rounded-2xl bg-surface-2 flex items-center justify-center overflow-hidden border border-border/50 group"
                >
                  <motion.span
                    key={memojiIndex}
                    initial={{ scale: 0.5, opacity: 0, rotateY: -90 }}
                    animate={{ scale: 1, opacity: 1, rotateY: 0 }}
                    exit={{ scale: 0.5, opacity: 0, rotateY: 90 }}
                    transition={{ type: 'spring', stiffness: 500, damping: 25 }}
                    className="text-4xl"
                  >
                    {memojiFrames[memojiIndex]}
                  </motion.span>
                  <div className="absolute inset-0 bg-foreground/5 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <Camera className="w-5 h-5 text-foreground/70" />
                  </div>
                </motion.button>

                <div className="flex-1">
                  <h3 className="text-lg font-semibold">{user?.email?.split('@')[0] || 'User'}</h3>
                  <p className="text-sm text-muted-foreground">{user?.email || 'user@example.com'}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="px-2 py-0.5 rounded-full bg-surface-2 text-xs text-muted-foreground border border-border/30">
                      Premium
                    </span>
                    <span className="w-2 h-2 rounded-full bg-status-online" />
                    <span className="text-xs text-muted-foreground">Online</span>
                  </div>
                </div>
              </div>

              {/* Status Input */}
              <motion.button
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                className="w-full mt-4 p-3 rounded-xl bg-surface-2/50 border border-border/30 text-left text-sm text-muted-foreground hover:bg-surface-2/80 transition-colors"
              >
                ✨ Set a custom status...
              </motion.button>
            </div>

            {/* Menu Items */}
            <div className="flex-1 overflow-y-auto scrollbar-thin p-3">
              {menuItems.map((item, index) => (
                <motion.button
                  key={item.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  whileHover={{ x: 4, backgroundColor: 'hsl(var(--surface-2) / 0.8)' }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setActiveSection(item.id)}
                  className="w-full flex items-center gap-3 p-3 rounded-xl text-left transition-colors"
                >
                  <div className="w-10 h-10 rounded-lg bg-surface-2 flex items-center justify-center border border-border/30">
                    <item.icon className="w-5 h-5 text-muted-foreground" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">{item.label}</p>
                    <p className="text-xs text-muted-foreground">{item.description}</p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-muted-foreground" />
                </motion.button>
              ))}

              {/* Theme Toggle */}
              <motion.button
                whileHover={{ x: 4, backgroundColor: 'hsl(var(--surface-2) / 0.8)' }}
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  setIsDark(!isDark);
                  document.documentElement.classList.toggle('dark');
                }}
                className="w-full flex items-center gap-3 p-3 rounded-xl text-left transition-colors mt-2"
              >
                <div className="w-10 h-10 rounded-lg bg-surface-2 flex items-center justify-center border border-border/30">
                  {isDark ? <Moon className="w-5 h-5 text-muted-foreground" /> : <Sun className="w-5 h-5 text-muted-foreground" />}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Dark Mode</p>
                  <p className="text-xs text-muted-foreground">{isDark ? 'Currently enabled' : 'Currently disabled'}</p>
                </div>
                <div className={cn(
                  'w-11 h-6 rounded-full transition-colors relative',
                  isDark ? 'bg-foreground' : 'bg-surface-3'
                )}>
                  <motion.div
                    layout
                    className={cn(
                      'absolute top-1 w-4 h-4 rounded-full',
                      isDark ? 'right-1 bg-background' : 'left-1 bg-muted-foreground'
                    )}
                  />
                </div>
              </motion.button>
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-border/50">
              <motion.button
                whileHover={{ scale: 1.02, backgroundColor: 'hsl(0 0% 20%)' }}
                whileTap={{ scale: 0.98 }}
                onClick={() => signOut()}
                className="w-full flex items-center justify-center gap-2 p-3 rounded-xl bg-surface-2 text-destructive hover:text-destructive-foreground transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span className="text-sm font-medium">Sign Out</span>
              </motion.button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
});
