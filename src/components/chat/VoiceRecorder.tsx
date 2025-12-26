import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, Square, Send, Trash2, Play, Pause } from 'lucide-react';
import { cn } from '@/lib/utils';

interface VoiceRecorderProps {
  isOpen: boolean;
  onClose: () => void;
  onSend: (duration: number) => void;
}

export function VoiceRecorder({ isOpen, onClose, onSend }: VoiceRecorderProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [duration, setDuration] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasRecording, setHasRecording] = useState(false);
  const [waveform, setWaveform] = useState<number[]>([]);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isOpen) {
      startRecording();
    }
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isOpen]);

  const startRecording = () => {
    setIsRecording(true);
    setDuration(0);
    setWaveform([]);
    
    intervalRef.current = setInterval(() => {
      setDuration(d => d + 1);
      // Simulate waveform
      setWaveform(prev => [...prev.slice(-30), Math.random() * 0.8 + 0.2]);
    }, 100);
  };

  const stopRecording = () => {
    setIsRecording(false);
    setHasRecording(true);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
  };

  const handleSend = () => {
    onSend(duration / 10);
    handleCancel();
  };

  const handleCancel = () => {
    setIsRecording(false);
    setHasRecording(false);
    setDuration(0);
    setWaveform([]);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    onClose();
  };

  const formatDuration = (tenths: number) => {
    const seconds = Math.floor(tenths / 10);
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          className="absolute inset-x-0 bottom-0 p-4 bg-card border-t border-border"
        >
          <div className="flex items-center gap-4">
            {/* Cancel */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={handleCancel}
              className="p-3 rounded-full bg-destructive/10 text-destructive hover:bg-destructive/20 transition-colors"
            >
              <Trash2 className="w-5 h-5" />
            </motion.button>

            {/* Waveform / Recording indicator */}
            <div className="flex-1 flex items-center gap-2 px-4 py-3 bg-surface-2 rounded-2xl">
              {/* Recording indicator */}
              {isRecording && (
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 1, repeat: Infinity }}
                  className="w-3 h-3 rounded-full bg-destructive"
                />
              )}

              {/* Waveform visualization */}
              <div className="flex-1 flex items-center justify-center gap-0.5 h-8">
                {waveform.slice(-40).map((height, index) => (
                  <motion.div
                    key={index}
                    initial={{ height: 0 }}
                    animate={{ height: `${height * 100}%` }}
                    className="w-1 bg-primary rounded-full"
                    style={{ minHeight: 4 }}
                  />
                ))}
                {waveform.length === 0 && (
                  <p className="text-sm text-muted-foreground">
                    {hasRecording ? 'Recording ready' : 'Recording...'}
                  </p>
                )}
              </div>

              {/* Duration */}
              <span className="text-sm font-mono text-foreground min-w-[48px] text-right">
                {formatDuration(duration)}
              </span>
            </div>

            {/* Stop / Play / Send */}
            {isRecording ? (
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={stopRecording}
                className="p-3 rounded-full bg-destructive text-destructive-foreground"
              >
                <Square className="w-5 h-5" fill="currentColor" />
              </motion.button>
            ) : hasRecording ? (
              <div className="flex items-center gap-2">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="p-3 rounded-full bg-surface-3 text-foreground hover:bg-surface-2 transition-colors"
                >
                  {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={handleSend}
                  className="p-3 rounded-full bg-primary text-primary-foreground"
                >
                  <Send className="w-5 h-5" />
                </motion.button>
              </div>
            ) : null}
          </div>

          {/* Hint */}
          <p className="text-xs text-muted-foreground text-center mt-2">
            {isRecording ? 'Tap the red button to stop recording' : 'Send or discard your voice message'}
          </p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
