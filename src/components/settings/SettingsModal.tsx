import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, User, Bell, Shield, Palette, Moon, Sun, Monitor, 
  Globe, Lock, Eye, EyeOff, Volume2, VolumeX, Vibrate,
  MessageSquare, Users, Hash, Trash2, Download, LogOut, ChevronRight
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { currentUser } from '@/lib/mockData';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type SettingsTab = 'profile' | 'privacy' | 'notifications' | 'appearance' | 'storage';

const themeColors = [
  { name: 'Blue', value: 'blue', color: 'hsl(217, 91%, 60%)' },
  { name: 'Purple', value: 'purple', color: 'hsl(262, 83%, 58%)' },
  { name: 'Green', value: 'green', color: 'hsl(142, 76%, 45%)' },
  { name: 'Orange', value: 'orange', color: 'hsl(38, 92%, 50%)' },
  { name: 'Pink', value: 'pink', color: 'hsl(330, 80%, 60%)' },
  { name: 'Cyan', value: 'cyan', color: 'hsl(190, 90%, 50%)' },
];

export function SettingsModal({ isOpen, onClose }: SettingsModalProps) {
  const [activeTab, setActiveTab] = useState<SettingsTab>('profile');
  const [theme, setTheme] = useState<'dark' | 'light' | 'system'>('dark');
  const [accentColor, setAccentColor] = useState('blue');
  const [readReceipts, setReadReceipts] = useState(true);
  const [onlineStatus, setOnlineStatus] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [vibrationEnabled, setVibrationEnabled] = useState(true);
  const [desktopNotifications, setDesktopNotifications] = useState(true);

  const tabs = [
    { id: 'profile' as const, label: 'Profile', icon: User },
    { id: 'privacy' as const, label: 'Privacy', icon: Shield },
    { id: 'notifications' as const, label: 'Notifications', icon: Bell },
    { id: 'appearance' as const, label: 'Appearance', icon: Palette },
    { id: 'storage' as const, label: 'Storage', icon: Download },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'profile':
        return (
          <div className="space-y-6">
            {/* Avatar */}
            <div className="flex items-center gap-4">
              <div className="relative">
                <img
                  src={currentUser.avatar}
                  alt={currentUser.name}
                  className="w-20 h-20 rounded-full"
                />
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="absolute bottom-0 right-0 p-1.5 rounded-full bg-primary text-primary-foreground"
                >
                  <User className="w-3 h-3" />
                </motion.button>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-foreground">{currentUser.name}</h3>
                <p className="text-sm text-muted-foreground">@{currentUser.username}</p>
              </div>
            </div>

            {/* Profile Fields */}
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-foreground mb-1.5 block">Display Name</label>
                <input
                  type="text"
                  defaultValue={currentUser.name}
                  className="w-full px-4 py-2.5 bg-surface-2 rounded-lg border border-border focus:border-primary focus:outline-none transition-colors text-foreground"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-foreground mb-1.5 block">Username</label>
                <input
                  type="text"
                  defaultValue={currentUser.username}
                  className="w-full px-4 py-2.5 bg-surface-2 rounded-lg border border-border focus:border-primary focus:outline-none transition-colors text-foreground"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-foreground mb-1.5 block">Bio</label>
                <textarea
                  rows={3}
                  placeholder="Tell us about yourself..."
                  className="w-full px-4 py-2.5 bg-surface-2 rounded-lg border border-border focus:border-primary focus:outline-none transition-colors resize-none text-foreground placeholder:text-muted-foreground"
                />
              </div>
            </div>
          </div>
        );

      case 'privacy':
        return (
          <div className="space-y-4">
            <SettingToggle
              icon={Eye}
              title="Read Receipts"
              description="Let others know when you've read their messages"
              enabled={readReceipts}
              onToggle={() => setReadReceipts(!readReceipts)}
            />
            <SettingToggle
              icon={Globe}
              title="Online Status"
              description="Show when you're online"
              enabled={onlineStatus}
              onToggle={() => setOnlineStatus(!onlineStatus)}
            />
            <div className="pt-4 border-t border-border">
              <h4 className="text-sm font-medium text-foreground mb-3">Who can message me</h4>
              <div className="space-y-2">
                {['Everyone', 'Contacts only', 'Nobody'].map(option => (
                  <label key={option} className="flex items-center gap-3 p-3 rounded-lg hover:bg-surface-2 cursor-pointer transition-colors">
                    <input type="radio" name="message-privacy" defaultChecked={option === 'Everyone'} className="accent-primary" />
                    <span className="text-foreground">{option}</span>
                  </label>
                ))}
              </div>
            </div>
            <div className="pt-4 border-t border-border">
              <motion.button
                whileHover={{ backgroundColor: 'hsl(var(--destructive) / 0.1)' }}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-destructive transition-colors"
              >
                <Lock className="w-5 h-5" />
                <span>Blocked Users</span>
                <ChevronRight className="w-5 h-5 ml-auto" />
              </motion.button>
            </div>
          </div>
        );

      case 'notifications':
        return (
          <div className="space-y-4">
            <SettingToggle
              icon={Bell}
              title="Desktop Notifications"
              description="Show notifications on your desktop"
              enabled={desktopNotifications}
              onToggle={() => setDesktopNotifications(!desktopNotifications)}
            />
            <SettingToggle
              icon={Volume2}
              title="Sound"
              description="Play sound for new messages"
              enabled={soundEnabled}
              onToggle={() => setSoundEnabled(!soundEnabled)}
            />
            <SettingToggle
              icon={Vibrate}
              title="Vibration"
              description="Vibrate for new messages"
              enabled={vibrationEnabled}
              onToggle={() => setVibrationEnabled(!vibrationEnabled)}
            />
            <div className="pt-4 border-t border-border">
              <h4 className="text-sm font-medium text-foreground mb-3">Notification Categories</h4>
              <div className="space-y-2">
                <NotificationCategory icon={MessageSquare} title="Direct Messages" />
                <NotificationCategory icon={Users} title="Group Chats" />
                <NotificationCategory icon={Hash} title="Channels" />
              </div>
            </div>
          </div>
        );

      case 'appearance':
        return (
          <div className="space-y-6">
            {/* Theme */}
            <div>
              <h4 className="text-sm font-medium text-foreground mb-3">Theme</h4>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'light' as const, label: 'Light', icon: Sun },
                  { id: 'dark' as const, label: 'Dark', icon: Moon },
                  { id: 'system' as const, label: 'System', icon: Monitor },
                ].map(({ id, label, icon: Icon }) => (
                  <motion.button
                    key={id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setTheme(id)}
                    className={cn(
                      'flex flex-col items-center gap-2 p-4 rounded-xl border transition-colors',
                      theme === id
                        ? 'border-primary bg-primary/10'
                        : 'border-border hover:border-primary/50'
                    )}
                  >
                    <Icon className={cn('w-6 h-6', theme === id ? 'text-primary' : 'text-muted-foreground')} />
                    <span className={cn('text-sm', theme === id ? 'text-primary font-medium' : 'text-foreground')}>
                      {label}
                    </span>
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Accent Color */}
            <div>
              <h4 className="text-sm font-medium text-foreground mb-3">Accent Color</h4>
              <div className="flex items-center gap-2">
                {themeColors.map(color => (
                  <motion.button
                    key={color.value}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setAccentColor(color.value)}
                    className={cn(
                      'w-10 h-10 rounded-full transition-all',
                      accentColor === color.value && 'ring-2 ring-offset-2 ring-offset-card ring-primary'
                    )}
                    style={{ backgroundColor: color.color }}
                    title={color.name}
                  />
                ))}
              </div>
            </div>

            {/* Chat Bubbles Preview */}
            <div>
              <h4 className="text-sm font-medium text-foreground mb-3">Preview</h4>
              <div className="p-4 bg-surface-2 rounded-xl space-y-2">
                <div className="flex justify-start">
                  <div className="px-4 py-2 bg-message-other rounded-2xl rounded-bl-md text-sm">
                    Hey, how's it going?
                  </div>
                </div>
                <div className="flex justify-end">
                  <div className="px-4 py-2 bg-message-own text-primary-foreground rounded-2xl rounded-br-md text-sm">
                    Pretty good! Working on a project.
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 'storage':
        return (
          <div className="space-y-4">
            {/* Storage Usage */}
            <div className="p-4 bg-surface-2 rounded-xl">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm text-muted-foreground">Storage Used</span>
                <span className="text-sm font-medium text-foreground">2.4 GB / 5 GB</span>
              </div>
              <div className="h-2 bg-surface-3 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: '48%' }}
                  transition={{ duration: 0.5 }}
                  className="h-full bg-primary rounded-full"
                />
              </div>
            </div>

            {/* Storage Breakdown */}
            <div className="space-y-2">
              <StorageItem label="Photos" size="1.2 GB" percentage={50} />
              <StorageItem label="Videos" size="800 MB" percentage={33} />
              <StorageItem label="Documents" size="400 MB" percentage={17} />
            </div>

            <div className="pt-4 border-t border-border space-y-2">
              <motion.button
                whileHover={{ backgroundColor: 'hsl(var(--surface-2))' }}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-foreground transition-colors"
              >
                <Download className="w-5 h-5 text-muted-foreground" />
                <span>Export Data</span>
                <ChevronRight className="w-5 h-5 ml-auto text-muted-foreground" />
              </motion.button>
              <motion.button
                whileHover={{ backgroundColor: 'hsl(var(--destructive) / 0.1)' }}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-destructive transition-colors"
              >
                <Trash2 className="w-5 h-5" />
                <span>Clear Cache</span>
              </motion.button>
            </div>
          </div>
        );
    }
  };

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
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl max-h-[85vh] bg-card border border-border rounded-2xl shadow-2xl z-50 overflow-hidden flex"
          >
            {/* Sidebar */}
            <div className="w-56 bg-surface-1 border-r border-border p-4 flex flex-col">
              <h2 className="text-lg font-semibold text-foreground mb-4 px-2">Settings</h2>
              <nav className="space-y-1 flex-1">
                {tabs.map(tab => {
                  const Icon = tab.icon;
                  return (
                    <motion.button
                      key={tab.id}
                      whileHover={{ backgroundColor: 'hsl(var(--surface-2))' }}
                      onClick={() => setActiveTab(tab.id)}
                      className={cn(
                        'w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors text-left',
                        activeTab === tab.id && 'bg-primary/10 text-primary'
                      )}
                    >
                      <Icon className={cn('w-5 h-5', activeTab !== tab.id && 'text-muted-foreground')} />
                      <span className={activeTab === tab.id ? 'font-medium' : 'text-foreground'}>{tab.label}</span>
                    </motion.button>
                  );
                })}
              </nav>
              <motion.button
                whileHover={{ backgroundColor: 'hsl(var(--destructive) / 0.1)' }}
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-destructive transition-colors"
              >
                <LogOut className="w-5 h-5" />
                <span>Log Out</span>
              </motion.button>
            </div>

            {/* Content */}
            <div className="flex-1 flex flex-col">
              <div className="flex items-center justify-between p-4 border-b border-border">
                <h3 className="text-lg font-semibold text-foreground">
                  {tabs.find(t => t.id === activeTab)?.label}
                </h3>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={onClose}
                  className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-surface-2 transition-colors"
                >
                  <X className="w-5 h-5" />
                </motion.button>
              </div>
              <div className="flex-1 overflow-y-auto scrollbar-thin p-6">
                {renderContent()}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

function SettingToggle({ icon: Icon, title, description, enabled, onToggle }: {
  icon: any;
  title: string;
  description: string;
  enabled: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="flex items-center justify-between p-4 bg-surface-2 rounded-xl">
      <div className="flex items-center gap-3">
        <Icon className="w-5 h-5 text-muted-foreground" />
        <div>
          <p className="font-medium text-foreground">{title}</p>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
      </div>
      <motion.button
        whileTap={{ scale: 0.9 }}
        onClick={onToggle}
        className={cn(
          'w-12 h-7 rounded-full p-1 transition-colors',
          enabled ? 'bg-primary' : 'bg-surface-3'
        )}
      >
        <motion.div
          animate={{ x: enabled ? 20 : 0 }}
          transition={{ type: 'spring', stiffness: 500, damping: 30 }}
          className="w-5 h-5 rounded-full bg-white shadow-sm"
        />
      </motion.button>
    </div>
  );
}

function NotificationCategory({ icon: Icon, title }: { icon: any; title: string }) {
  return (
    <motion.button
      whileHover={{ backgroundColor: 'hsl(var(--surface-2))' }}
      className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-foreground transition-colors"
    >
      <Icon className="w-5 h-5 text-muted-foreground" />
      <span className="flex-1 text-left">{title}</span>
      <ChevronRight className="w-5 h-5 text-muted-foreground" />
    </motion.button>
  );
}

function StorageItem({ label, size, percentage }: { label: string; size: string; percentage: number }) {
  return (
    <div className="flex items-center gap-3 p-3 bg-surface-2 rounded-xl">
      <div className="flex-1">
        <div className="flex items-center justify-between mb-1">
          <span className="text-sm font-medium text-foreground">{label}</span>
          <span className="text-xs text-muted-foreground">{size}</span>
        </div>
        <div className="h-1.5 bg-surface-3 rounded-full overflow-hidden">
          <div
            className="h-full bg-primary rounded-full"
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>
    </div>
  );
}
