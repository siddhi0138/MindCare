import { useEffect, useRef, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Mic, MicOff, Video as VideoIcon, VideoOff, PhoneOff } from 'lucide-react';

interface VideoCallDialogProps {
  therapistName: string;
  open: boolean;
  onClose: () => void;
}

const formatElapsed = (seconds: number) => {
  const m = Math.floor(seconds / 60).toString().padStart(2, '0');
  const s = (seconds % 60).toString().padStart(2, '0');
  return `${m}:${s}`;
};

// A simulated video call UI — there is no real WebRTC/media connection here, no camera or
// microphone is ever accessed. This exists so a "video session" appointment has something to
// actually click into, without pretending to be a real video-calling product.
const VideoCallDialog = ({ therapistName, open, onClose }: VideoCallDialogProps) => {
  const [connected, setConnected] = useState(false);
  const [micOn, setMicOn] = useState(true);
  const [cameraOn, setCameraOn] = useState(true);
  const [elapsed, setElapsed] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (!open) {
      setConnected(false);
      setElapsed(0);
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }

    const connectTimeout = setTimeout(() => setConnected(true), 1500);
    return () => clearTimeout(connectTimeout);
  }, [open]);

  useEffect(() => {
    if (!connected) return;
    timerRef.current = setInterval(() => setElapsed((s) => s + 1), 1000);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [connected]);

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>Video Session with {therapistName}</span>
            <span className="text-xs font-normal text-muted-foreground">Simulated — no real call</span>
          </DialogTitle>
        </DialogHeader>

        <div className="relative bg-black rounded-lg aspect-video flex items-center justify-center overflow-hidden">
          {cameraOn ? (
            <Avatar className="h-24 w-24">
              <AvatarFallback className="text-2xl bg-primary/20">{therapistName.charAt(0)}</AvatarFallback>
            </Avatar>
          ) : (
            <VideoOff className="h-10 w-10 text-white/40" />
          )}

          <div className="absolute top-3 left-3 text-white text-sm bg-black/40 rounded px-2 py-1">
            {connected ? formatElapsed(elapsed) : 'Connecting...'}
          </div>
          {!connected && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/60">
              <div className="h-8 w-8 border-2 border-white border-t-transparent rounded-full animate-spin" />
            </div>
          )}
        </div>

        <div className="flex items-center justify-center gap-3 pt-2">
          <Button
            variant={micOn ? 'outline' : 'destructive'}
            size="icon"
            className="rounded-full h-11 w-11"
            onClick={() => setMicOn((v) => !v)}
          >
            {micOn ? <Mic size={18} /> : <MicOff size={18} />}
          </Button>
          <Button
            variant={cameraOn ? 'outline' : 'destructive'}
            size="icon"
            className="rounded-full h-11 w-11"
            onClick={() => setCameraOn((v) => !v)}
          >
            {cameraOn ? <VideoIcon size={18} /> : <VideoOff size={18} />}
          </Button>
          <Button
            variant="destructive"
            size="icon"
            className="rounded-full h-11 w-11"
            onClick={onClose}
          >
            <PhoneOff size={18} />
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default VideoCallDialog;
