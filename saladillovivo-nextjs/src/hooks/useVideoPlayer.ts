
import { useState, useCallback, useRef, useEffect } from 'react';
import ReactPlayer from 'react-player'; // Necesitaremos instalar los tipos para esto: @types/react-player
import { usePlaybackLogic } from '@/hooks/usePlaybackLogic';
import { useCast } from '@/hooks/useCast';
import { MediaData } from '@/lib/types';

export const useVideoPlayer = () => {
  const playerRef = useRef<ReactPlayer>(null);
  const controlsTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const [currentMedia, setCurrentMedia] = useState<MediaData | null>(null);
  const [playingMedia, setPlayingMedia] = useState<MediaData | null>(null);
  const [playerStatus, setPlayerStatus] = useState('idle');
  const [showControls, setShowControls] = useState(false);
  
  const playbackLogic = usePlaybackLogic({
    setCurrentMedia,
    setPlayingMedia,
    setPlayerStatus,
  });

  useEffect(() => {
      if (!currentMedia) {
          // Lógica del placeholder. Asumimos que la clase 'dark' se gestiona en un nivel superior.
          const placeholderImage = document.documentElement.classList.contains('dark') 
              ? 'https://storage.googleapis.com/hostinger-horizons-assets-prod/77d159f1-0d45-4b01-ba42-c8ca9cbd0d70/4e1cb556338b8c5950a4d1d93339ecb7.png' 
              : 'https://storage.googleapis.com/hostinger-horizons-assets-prod/77d159f1-0d45-4b01-ba42-c8ca9cbd0d70/a56317586a1474ed88f117395632e85a.png';
          
          setCurrentMedia({
              url: placeholderImage,
              title: 'Saladillo Vivo',
              type: 'image',
              isUserSelected: false,
              category: 'placeholder'
          });
          setPlayerStatus('static_image');
      }
  }, [currentMedia]);

  const { isCastAvailable, handleCast } = useCast(currentMedia);

  const handleError = useCallback((e: any) => {
    console.warn("Player error:", e);
    setPlayerStatus('error');
  }, []);

  const handlePlayerReady = useCallback((player: ReactPlayer) => {
    // Lógica de HLS manejada por ReactPlayer
  }, []);

  const handleMouseEnterControls = useCallback(() => {
    if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
    setShowControls(true);
  }, []);

  const handleMouseLeaveControls = useCallback((fast = false) => {
    const timeout = fast ? 750 : 3000;
    controlsTimeoutRef.current = setTimeout(() => setShowControls(false), timeout);
  }, []);
  
  const handleTouchShowControls = useCallback(() => {
    setShowControls(true);
    if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
    controlsTimeoutRef.current = setTimeout(() => setShowControls(false), 3000);
  }, []);

  return {
    playerRef,
    currentMedia,
    playingMedia,
    playerStatus,
    ...playbackLogic,
    showControls,
    isCastAvailable,
    handlePlayerReady,
    handleError,
    handleMouseEnterControls,
    handleMouseLeaveControls,
    handleTouchShowControls,
    handleProgress: (state: { played: number; playedSeconds: number; loaded: number; loadedSeconds: number; }) => playbackLogic.setProgress(state.played),
    handleDuration: (d: number) => playbackLogic.setDuration(d),
    handleSeek: (value: number) => {
      if (playerRef.current && currentMedia?.type === 'video' && value < playbackLogic.progress) {
        playerRef.current.seekTo(value, 'fraction');
      }
    },
    handleCast,
  };
};
