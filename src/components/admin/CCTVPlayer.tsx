import React, { useState, useEffect, useRef } from 'react';
import { Table } from '../../types';
import { 
  Camera, 
  Video, 
  Radio, 
  Eye, 
  Volume2, 
  VolumeX, 
  Maximize2, 
  Minimize2, 
  Download, 
  RefreshCw, 
  Sliders, 
  Moon, 
  Sun,
  ShieldCheck,
  AlertCircle,
  Zap,
  ZoomIn,
  ZoomOut
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface CCTVPlayerProps {
  table: Table;
  compact?: boolean;
  onOpenTableDetails?: () => void;
}

export const CCTVPlayer: React.FC<CCTVPlayerProps> = ({ table, compact = false, onOpenTableDetails }) => {
  const { showToast } = useApp();
  const [currentTime, setCurrentTime] = useState<string>('');
  const [isMuted, setIsMuted] = useState(true);
  const [isNightVision, setIsNightVision] = useState(false);
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [streamHealth, setStreamHealth] = useState<'optimal' | 'buffering'>('optimal');
  const [videoError, setVideoError] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Default Surveillance Feeds per table
  const defaultFeeds: Record<string, string> = {
    'T-01': 'https://assets.mixkit.co/videos/preview/mixkit-people-having-a-conversation-in-a-coffee-shop-43253-large.mp4',
    'T-02': 'https://assets.mixkit.co/videos/preview/mixkit-top-view-of-a-table-in-a-cafe-43258-large.mp4',
    'T-03': 'https://assets.mixkit.co/videos/preview/mixkit-coffee-shop-interior-with-people-enjoying-their-beverages-43254-large.mp4',
    'T-04': 'https://assets.mixkit.co/videos/preview/mixkit-friends-talking-in-a-cafe-table-42358-large.mp4',
    'T-05': 'https://assets.mixkit.co/videos/preview/mixkit-top-view-of-a-table-in-a-cafe-43258-large.mp4',
    'T-07': 'https://assets.mixkit.co/videos/preview/mixkit-coffee-shop-interior-with-people-enjoying-their-beverages-43254-large.mp4',
    'T-09': 'https://assets.mixkit.co/videos/preview/mixkit-people-having-a-conversation-in-a-coffee-shop-43253-large.mp4',
  };

  const streamUrl = table.cctvStreamUrl || defaultFeeds[table.tableNumber] || 'https://assets.mixkit.co/videos/preview/mixkit-coffee-shop-interior-with-people-enjoying-their-beverages-43254-large.mp4';
  const cameraId = table.cctvCameraId || `CAM-${table.tableNumber.replace(/[^a-zA-Z0-9]/g, '')}`;

  // Live timestamp clock ticker
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const yr = now.getFullYear();
      const mo = String(now.getMonth() + 1).padStart(2, '0');
      const da = String(now.getDate()).padStart(2, '0');
      const hr = String(now.getHours()).padStart(2, '0');
      const mi = String(now.getMinutes()).padStart(2, '0');
      const se = String(now.getSeconds()).padStart(2, '0');
      const ms = String(Math.floor(now.getMilliseconds() / 10)).padStart(2, '0');
      setCurrentTime(`${yr}-${mo}-${da} ${hr}:${mi}:${se}.${ms}`);
    };

    updateTime();
    const timer = setInterval(updateTime, 50);
    return () => clearInterval(timer);
  }, []);

  const handleTakeSnapshot = (e: React.MouseEvent) => {
    e.stopPropagation();
    showToast(
      'CCTV Snapshot Recorded',
      `Surveillance frame for Table ${table.tableNumber} (${cameraId}) saved to audit log`,
      'success'
    );
  };

  const handleToggleFullscreen = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!containerRef.current) return;

    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(() => {});
      setIsFullscreen(false);
    }
  };

  return (
    <div 
      ref={containerRef}
      className={`relative overflow-hidden bg-black text-white font-mono rounded-2xl select-none group border border-cafe-800 shadow-lg ${
        compact ? 'h-40' : 'h-64 sm:h-80 w-full'
      }`}
    >
      {/* Real HTML5 Live Video Stream with Fallback */}
      {!videoError ? (
        <video
          ref={videoRef}
          src={streamUrl}
          autoPlay
          loop
          muted={isMuted}
          playsInline
          onError={() => setVideoError(true)}
          style={{
            transform: `scale(${zoomLevel})`,
            transition: 'transform 0.3s ease, filter 0.3s ease',
            filter: isNightVision 
              ? 'grayscale(1) contrast(1.7) brightness(1.2) sepia(0.3) hue-rotate(80deg)' 
              : 'none'
          }}
          className="w-full h-full object-cover"
        />
      ) : (
        /* Dynamic SVG Surveillance Canvas Fallback */
        <div 
          style={{
            filter: isNightVision 
              ? 'grayscale(1) contrast(1.7) brightness(1.2) sepia(0.3) hue-rotate(80deg)' 
              : 'none'
          }}
          className="w-full h-full bg-gradient-to-br from-slate-900 via-zinc-900 to-black flex flex-col items-center justify-center p-4 relative"
        >
          {/* Subtle Scanning Radar effect */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(34,197,94,0.08)_0,transparent_70%)] animate-pulse" />
          
          <div className="relative z-10 text-center space-y-2">
            <div className="w-12 h-12 rounded-full border border-emerald-500/30 bg-emerald-500/10 flex items-center justify-center mx-auto text-emerald-400">
              <Camera className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <span className="text-xs font-bold text-emerald-400 tracking-wider block">
                TABLE {table.tableNumber} LIVE RADAR
              </span>
              <span className="text-[10px] text-zinc-400 block mt-0.5">
                {table.section} • {table.capacity} Seats ({table.status.toUpperCase()})
              </span>
            </div>
            {table.seatedPartyName && (
              <span className="inline-block px-2 py-0.5 rounded-full text-[10px] bg-amber-500/20 text-amber-300 border border-amber-500/30">
                Seated: {table.seatedPartyName} ({table.partySize} guests)
              </span>
            )}
          </div>
        </div>
      )}

      {/* Surveillance Scanlines Overlay */}
      <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%)] bg-[length:100%_4px] opacity-40" />

      {/* Camera Reticle / Crosshair */}
      <div className="absolute inset-0 pointer-events-none flex items-center justify-center opacity-30">
        <div className="w-16 h-16 border border-emerald-400/40 rounded-full flex items-center justify-center">
          <div className="w-2 h-2 bg-emerald-400 rounded-full animate-ping" />
        </div>
        <div className="absolute w-24 h-px bg-emerald-400/30" />
        <div className="absolute h-24 w-px bg-emerald-400/30" />
      </div>

      {/* TOP HUD: Camera ID, Table Number, REC indicator, Time */}
      <div className="absolute top-2.5 left-2.5 right-2.5 flex items-start justify-between pointer-events-none text-[11px] drop-shadow-md z-10">
        <div className="space-y-0.5">
          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-red-600/90 text-white font-bold text-[10px] tracking-widest shadow-xs">
              <span className="w-2 h-2 rounded-full bg-white animate-pulse" /> REC
            </span>
            <span className="bg-black/70 backdrop-blur-md px-2 py-0.5 rounded text-amber-300 font-bold border border-white/10">
              {cameraId} // T-{table.tableNumber}
            </span>
            <span className="bg-black/70 backdrop-blur-md px-1.5 py-0.5 rounded text-[10px] text-zinc-300 border border-white/10 hidden sm:inline">
              {table.section}
            </span>
          </div>

          <div className="text-[10px] text-emerald-400 font-bold bg-black/60 backdrop-blur-sm px-1.5 py-0.5 rounded inline-block">
            {currentTime}
          </div>
        </div>

        {/* Stream Health & Status */}
        <div className="text-right space-y-0.5">
          <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold border ${
            table.status === 'occupied' 
              ? 'bg-amber-500/80 text-black border-amber-300' 
              : table.status === 'available'
              ? 'bg-emerald-600/80 text-white border-emerald-400'
              : 'bg-blue-600/80 text-white border-blue-400'
          }`}>
            {table.status.toUpperCase()}
          </span>
          <div className="text-[9px] text-zinc-400 bg-black/60 px-1 rounded block">
            1080p@30fps • 4.6 Mbps
          </div>
        </div>
      </div>

      {/* BOTTOM HUD: Quick Controls */}
      <div className="absolute bottom-2.5 left-2.5 right-2.5 flex items-center justify-between text-xs z-20">
        {/* Seated Info Pill */}
        <div className="bg-black/80 backdrop-blur-md px-2.5 py-1 rounded-xl border border-white/10 text-[10px] text-zinc-200 truncate max-w-[55%]">
          {table.seatedPartyName ? (
            <span className="truncate block font-semibold text-amber-300">
              👤 {table.seatedPartyName} ({table.partySize || table.capacity} pax)
            </span>
          ) : (
            <span className="text-emerald-400 font-medium">✓ Table Free for Seating</span>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-1.5 bg-black/80 backdrop-blur-md p-1 rounded-xl border border-white/10">
          {/* Night Vision / IR Toggle */}
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); setIsNightVision(!isNightVision); }}
            className={`p-1.5 rounded-lg transition ${
              isNightVision ? 'bg-emerald-500 text-black font-bold' : 'text-zinc-300 hover:bg-white/15'
            }`}
            title="Toggle Night Vision / Infrared Mode"
          >
            <Moon className="w-3.5 h-3.5" />
          </button>

          {/* Zoom Toggle */}
          <button
            type="button"
            onClick={(e) => { 
              e.stopPropagation(); 
              setZoomLevel(prev => prev === 1 ? 1.5 : prev === 1.5 ? 2 : 1); 
            }}
            className="p-1.5 text-zinc-300 hover:bg-white/15 rounded-lg transition"
            title="Toggle Digital Zoom (1x / 1.5x / 2x)"
          >
            <ZoomIn className="w-3.5 h-3.5" />
          </button>

          {/* Audio Mute/Unmute */}
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); setIsMuted(!isMuted); }}
            className="p-1.5 text-zinc-300 hover:bg-white/15 rounded-lg transition"
            title={isMuted ? 'Unmute Audio' : 'Mute Audio'}
          >
            {isMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5 text-amber-400" />}
          </button>

          {/* Snapshot Button */}
          <button
            type="button"
            onClick={handleTakeSnapshot}
            className="p-1.5 text-zinc-300 hover:bg-white/15 rounded-lg transition"
            title="Capture & Save CCTV Frame"
          >
            <Download className="w-3.5 h-3.5" />
          </button>

          {/* Fullscreen */}
          <button
            type="button"
            onClick={handleToggleFullscreen}
            className="p-1.5 text-zinc-300 hover:bg-white/15 rounded-lg transition"
            title="Toggle Fullscreen"
          >
            {isFullscreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>
    </div>
  );
};
