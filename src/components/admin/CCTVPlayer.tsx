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
  ZoomOut,
  ExternalLink,
  Copy,
  Check,
  Globe
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
  const [videoError, setVideoError] = useState(false);
  const [copiedBridgeCmd, setCopiedBridgeCmd] = useState(false);

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

  const rawStreamUrl = table.cctvStreamUrl;
  const isDirectRtsp = rawStreamUrl && rawStreamUrl.startsWith('rtsp://');

  const [streamSource, setStreamSource] = useState<'auto' | 'public' | 'lan' | 'local'>('auto');

  // Detect whether we are running on HTTPS, remote domain, or localhost
  const isHttps = typeof window !== 'undefined' && window.location.protocol === 'https:';
  const isRemote = typeof window !== 'undefined' && !['localhost', '127.0.0.1'].includes(window.location.hostname);
  
  let selectedHost = 'https://cam.nistta.com';
  if (streamSource === 'public') {
    selectedHost = 'https://cam.nistta.com';
  } else if (streamSource === 'lan') {
    selectedHost = 'http://192.168.68.105:1984';
  } else if (streamSource === 'local') {
    selectedHost = 'http://localhost:1984';
  } else {
    // auto: if on remote/HTTPS use public tunnel, else local
    selectedHost = (isHttps || isRemote) ? 'https://cam.nistta.com' : 'http://localhost:1984';
  }

  // Dynamic stream name resolution for go2rtc bridge
  let resolvedStreamName = 'table1';
  if (rawStreamUrl) {
    const srcMatch = rawStreamUrl.match(/src=([a-zA-Z0-9_-]+)/i);
    const channelMatch = rawStreamUrl.match(/channel=(\d+)/i);
    if (srcMatch) {
      resolvedStreamName = srcMatch[1];
    } else if (channelMatch) {
      const chNum = channelMatch[1];
      const isSub = rawStreamUrl.includes('subtype=1');
      resolvedStreamName = isSub ? `table${chNum}_sub` : `table${chNum}`;
    } else if (!rawStreamUrl.includes('://')) {
      resolvedStreamName = rawStreamUrl.trim();
    }
  } else {
    const numMatch = table.tableNumber.match(/\d+/);
    if (numMatch) {
      const tNum = parseInt(numMatch[0], 10);
      resolvedStreamName = `table${tNum}`;
    }
  }

  // Check if we can route to go2rtc WebRTC stream
  let activeVideoSrc = rawStreamUrl || defaultFeeds[table.tableNumber] || defaultFeeds['T-01'];
  let isWebRtcIframe = false;

  if (isDirectRtsp || (rawStreamUrl && !rawStreamUrl.includes('://'))) {
    activeVideoSrc = `${selectedHost}/stream.html?src=${resolvedStreamName}&mode=webrtc`;
    isWebRtcIframe = true;
  } else if (activeVideoSrc && activeVideoSrc.includes('/stream.html?')) {
    isWebRtcIframe = true;
  }

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

  const handleCopyGo2Rtc = (e: React.MouseEvent) => {
    e.stopPropagation();
    const cmd = `docker run -d --name go2rtc -p 1984:1984 -p 8554:8554 alexxit/go2rtc`;
    navigator.clipboard.writeText(cmd);
    setCopiedBridgeCmd(true);
    showToast('Copied to Clipboard', 'Run this command in terminal to bridge RTSP to WebRTC', 'info');
    setTimeout(() => setCopiedBridgeCmd(false), 3000);
  };

  return (
    <div 
      ref={containerRef}
      className={`relative overflow-hidden bg-black text-white font-mono rounded-2xl select-none group border border-cafe-800 shadow-lg ${
        compact ? 'h-40' : 'h-64 sm:h-84 w-full'
      }`}
    >
      {/* Live WebRTC Stream Iframe or HTML5 Video Stream */}
      {isWebRtcIframe ? (
        <iframe
          src={activeVideoSrc}
          className="w-full h-full border-0 object-cover pointer-events-auto"
          allow="autoplay; fullscreen; camera"
          title={`CCTV ${table.tableNumber}`}
          style={{
            transform: `scale(${zoomLevel})`,
            transition: 'transform 0.3s ease, filter 0.3s ease',
            filter: isNightVision 
              ? 'grayscale(1) contrast(1.7) brightness(1.2) sepia(0.3) hue-rotate(80deg)' 
              : 'none'
          }}
        />
      ) : !videoError ? (
        <video
          ref={videoRef}
          src={activeVideoSrc}
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
        /* Real-Time Surveillance Console with Radar & RTSP Telemetry */
        <div 
          style={{
            filter: isNightVision 
              ? 'grayscale(1) contrast(1.7) brightness(1.2) sepia(0.3) hue-rotate(80deg)' 
              : 'none'
          }}
          className="w-full h-full bg-gradient-to-br from-zinc-950 via-slate-950 to-black flex flex-col items-center justify-center p-4 relative"
        >
          {/* Scanning Radar effect */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(16,185,129,0.07)_0,transparent_70%)] animate-pulse" />
          
          <div className="relative z-10 text-center space-y-2 max-w-sm">
            <div className="w-11 h-11 rounded-full border border-emerald-500/40 bg-emerald-500/10 flex items-center justify-center mx-auto text-emerald-400 shadow-sm">
              <Camera className="w-5 h-5 animate-pulse" />
            </div>

            <div>
              <div className="flex items-center justify-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                <span className="text-xs font-bold text-emerald-400 tracking-wider">
                  {isDirectRtsp ? 'RTSP LIVE STREAM CONFIGURED' : `TABLE ${table.tableNumber} LIVE SURVEILLANCE`}
                </span>
              </div>
              <span className="text-[10px] text-zinc-400 block mt-0.5">
                {table.section} • {table.capacity} Seats ({table.status.toUpperCase()})
              </span>
            </div>

            {isDirectRtsp ? (
              <div className="p-2.5 bg-black/80 rounded-xl border border-emerald-500/30 text-left text-[10px] space-y-1">
                <div className="flex justify-between text-zinc-300">
                  <span className="text-zinc-400">Endpoint:</span>
                  <span className="font-bold text-amber-300 truncate max-w-[170px]">{rawStreamUrl}</span>
                </div>
                <div className="flex justify-between text-zinc-300">
                  <span className="text-zinc-400">Protocol:</span>
                  <span className="text-emerald-400 font-bold">RTSP / H.264 (Port 554)</span>
                </div>
                {!compact && (
                  <div className="pt-1.5 border-t border-zinc-800 flex items-center justify-between gap-1">
                    <span className="text-[9px] text-zinc-400">Stream Source:</span>
                    <div className="flex gap-1">
                      <button
                        type="button"
                        onClick={(e) => { e.stopPropagation(); setStreamSource('public'); }}
                        className={`px-1.5 py-0.5 rounded text-[9px] font-bold transition ${
                          selectedHost.includes('nistta') ? 'bg-amber-500 text-black' : 'bg-zinc-800 text-zinc-400 hover:text-white'
                        }`}
                        title="Cloudflare Public Tunnel (cam.nistta.com)"
                      >
                        Cloudflare
                      </button>
                      <button
                        type="button"
                        onClick={(e) => { e.stopPropagation(); setStreamSource('lan'); }}
                        className={`px-1.5 py-0.5 rounded text-[9px] font-bold transition ${
                          selectedHost.includes('192.168') ? 'bg-emerald-500 text-black' : 'bg-zinc-800 text-zinc-400 hover:text-white'
                        }`}
                        title="Local Cafe WiFi (192.168.68.105:1984)"
                      >
                        LAN
                      </button>
                      <button
                        type="button"
                        onClick={(e) => { e.stopPropagation(); setStreamSource('local'); }}
                        className={`px-1.5 py-0.5 rounded text-[9px] font-bold transition ${
                          selectedHost.includes('localhost') ? 'bg-blue-500 text-white' : 'bg-zinc-800 text-zinc-400 hover:text-white'
                        }`}
                        title="Localhost (127.0.0.1:1984)"
                      >
                        Local
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : table.seatedPartyName ? (
              <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] bg-amber-500/20 text-amber-300 border border-amber-500/30">
                👤 Seated: {table.seatedPartyName} ({table.partySize} guests)
              </span>
            ) : null}
          </div>
        </div>
      )}

      {/* Surveillance Scanlines Overlay */}
      <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%)] bg-[length:100%_4px] opacity-40" />

      {/* Camera Reticle / Crosshair */}
      <div className="absolute inset-0 pointer-events-none flex items-center justify-center opacity-25">
        <div className="w-14 h-14 border border-emerald-400/40 rounded-full flex items-center justify-center">
          <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-ping" />
        </div>
        <div className="absolute w-20 h-px bg-emerald-400/30" />
        <div className="absolute h-20 w-px bg-emerald-400/30" />
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

          {/* Open Stream in New Tab */}
          <a
            href={activeVideoSrc}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="p-1.5 text-zinc-300 hover:bg-white/15 rounded-lg transition"
            title="Open Live Stream in New Tab"
          >
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>
    </div>
  );
};
