import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Phone, Video, Mic, MicOff, VideoOff, PhoneOff, Monitor, MoreVertical, Maximize2, Volume2, VolumeX } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CallModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: 'voice' | 'video';
  participant: {
    name: string;
    avatar: string;
  };
}

export function CallModal({ isOpen, onClose, type, participant }: CallModalProps) {
  const [callState, setCallState] = useState<'calling' | 'connected' | 'ended'>('calling');
  const [duration, setDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(type === 'voice');
  const [isSpeakerOn, setIsSpeakerOn] = useState(true);

  useEffect(() => {
    if (isOpen) {
      setCallState('calling');
      setDuration(0);
      
      // Simulate call connecting
      const connectTimer = setTimeout(() => {
        setCallState('connected');
      }, 2000);

      return () => clearTimeout(connectTimer);
    }
  }, [isOpen]);

  useEffect(() => {
    if (callState === 'connected') {
      const interval = setInterval(() => {
        setDuration(d => d + 1);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [callState]);

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleEndCall = () => {
    setCallState('ended');
    setTimeout(onClose, 500);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-background z-50 flex flex-col"
        >
          {/* Video Background (for video calls) */}
          {type === 'video' && !isVideoOff && (
            <div className="absolute inset-0 bg-gradient-to-br from-surface-1 to-surface-3">
              {/* Simulated video feed */}
              <div className="w-full h-full flex items-center justify-center">
                <img
                  src={participant.avatar}
                  alt={participant.name}
                  className="w-64 h-64 rounded-full object-cover opacity-20"
                />
              </div>
            </div>
          )}

          {/* Self video (picture-in-picture) */}
          {type === 'video' && !isVideoOff && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute top-4 right-4 w-32 h-44 bg-surface-2 rounded-xl overflow-hidden border border-border shadow-lg"
            >
              <div className="w-full h-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
                <span className="text-sm text-muted-foreground">You</span>
              </div>
            </motion.div>
          )}

          {/* Main Content */}
          <div className="flex-1 flex flex-col items-center justify-center relative z-10">
            {/* Participant Info */}
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="text-center"
            >
              <motion.div
                animate={callState === 'calling' ? { scale: [1, 1.1, 1] } : {}}
                transition={{ duration: 2, repeat: callState === 'calling' ? Infinity : 0 }}
                className="relative mb-6"
              >
                <img
                  src={participant.avatar}
                  alt={participant.name}
                  className="w-32 h-32 rounded-full object-cover mx-auto"
                />
                {callState === 'calling' && (
                  <motion.div
                    animate={{ scale: [1, 1.5], opacity: [0.5, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                    className="absolute inset-0 rounded-full border-2 border-primary"
                  />
                )}
              </motion.div>

              <h2 className="text-2xl font-semibold text-foreground mb-1">{participant.name}</h2>
              
              <p className={cn(
                'text-lg',
                callState === 'calling' && 'text-muted-foreground animate-pulse',
                callState === 'connected' && 'text-status-online',
                callState === 'ended' && 'text-destructive'
              )}>
                {callState === 'calling' && 'Calling...'}
                {callState === 'connected' && formatDuration(duration)}
                {callState === 'ended' && 'Call ended'}
              </p>
            </motion.div>
          </div>

          {/* Controls */}
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="relative z-10 p-8"
          >
            <div className="flex items-center justify-center gap-4">
              {/* Mute */}
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setIsMuted(!isMuted)}
                className={cn(
                  'p-4 rounded-full transition-colors',
                  isMuted ? 'bg-destructive text-destructive-foreground' : 'bg-surface-2 text-foreground hover:bg-surface-3'
                )}
              >
                {isMuted ? <MicOff className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
              </motion.button>

              {/* Video Toggle (for video calls) */}
              {type === 'video' && (
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setIsVideoOff(!isVideoOff)}
                  className={cn(
                    'p-4 rounded-full transition-colors',
                    isVideoOff ? 'bg-destructive text-destructive-foreground' : 'bg-surface-2 text-foreground hover:bg-surface-3'
                  )}
                >
                  {isVideoOff ? <VideoOff className="w-6 h-6" /> : <Video className="w-6 h-6" />}
                </motion.button>
              )}

              {/* End Call */}
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={handleEndCall}
                className="p-5 rounded-full bg-destructive text-destructive-foreground"
              >
                <PhoneOff className="w-7 h-7" />
              </motion.button>

              {/* Speaker */}
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setIsSpeakerOn(!isSpeakerOn)}
                className={cn(
                  'p-4 rounded-full transition-colors',
                  !isSpeakerOn ? 'bg-destructive text-destructive-foreground' : 'bg-surface-2 text-foreground hover:bg-surface-3'
                )}
              >
                {isSpeakerOn ? <Volume2 className="w-6 h-6" /> : <VolumeX className="w-6 h-6" />}
              </motion.button>

              {/* Screen Share (for video calls) */}
              {type === 'video' && (
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="p-4 rounded-full bg-surface-2 text-foreground hover:bg-surface-3 transition-colors"
                >
                  <Monitor className="w-6 h-6" />
                </motion.button>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
