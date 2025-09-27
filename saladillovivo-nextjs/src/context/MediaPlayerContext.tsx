'use client';

import React, { createContext, useContext, useRef } from 'react';

// This is a more complete placeholder context to allow UI components to render without a fully functional player.

const defaultState = {
  playerRef: { current: null },
  currentMedia: null,
  playerStatus: 'idle', // 'idle', 'loading', 'playing', 'paused', 'error'
  isPlaying: false,
  volume: 1,
  isMuted: true,
  unmute: () => console.log("unmute called"),
  showControls: false,
  progress: 0,
  duration: 0,
  videoOpacity: 1,
  isCastAvailable: false,
  handlePlayerReady: () => console.log("player ready"),
  handleError: () => console.log("player error"),
  togglePlayPause: () => console.log("togglePlayPause called"),
  toggleMute: () => console.log("toggleMute called"),
  handleVolumeChange: (value) => console.log("volume change", value),
  handleMouseEnterControls: () => console.log("mouse enter controls"),
  handleMouseLeaveControls: (fast) => console.log("mouse leave controls", { fast }),
  handleTouchShowControls: () => console.log("touch show controls"),
  handleProgress: (p) => console.log("progress", p),
  handleDuration: (d) => console.log("duration", d),
  handleSeek: (value) => console.log("seek", value),
  handleCast: () => console.log("cast called"),
  handlePlay: () => console.log("play called"),
  handlePause: () => console.log("pause called"),
  handleEnded: () => console.log("ended called"),
  playingMedia: null,
  playUserSelectedVideo: (video, category) => console.log('Playing video:', video, 'from', category),
  playLiveStream: (streamStatus) => console.log('Playing live stream:', streamStatus),
  streamStatus: { isActive: false, isLoaded: true, nombre: 'En Vivo', imagen: '' },
};

const PlaceholderMediaPlayerContext = createContext(defaultState);

export const useMediaPlayer = () => useContext(PlaceholderMediaPlayerContext);

export const MediaPlayerProvider = ({ children }) => {
  const playerRef = useRef(null);
  // In a real implementation, state would be managed here.
  const value = {
    ...defaultState,
    playerRef,
  };

  return (
    <PlaceholderMediaPlayerContext.Provider value={value}>
      {children}
    </PlaceholderMediaPlayerContext.Provider>
  );
};
