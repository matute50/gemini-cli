
import { useState, useEffect, useRef } from 'react';
import { MediaData } from '@/lib/types';

// Declaraciones de tipo para la API de Google Cast que existe en el objeto window
declare global {
  interface Window {
    cast: any;
    chrome: any;
    __onGCastApiAvailable: (isAvailable: boolean) => void;
  }
}

export const useCast = (currentMedia: MediaData | null) => {
  const [isCastAvailable, setIsCastAvailable] = useState(false);
  const castSession = useRef<any>(null);

  useEffect(() => {
    const initializeCastApi = () => {
      if (window.cast && window.cast.framework && window.chrome && window.chrome.cast) {
        const context = window.cast.framework.CastContext.getInstance();
        context.setOptions({
          receiverApplicationId: window.chrome.cast.media.DEFAULT_MEDIA_RECEIVER_APP_ID,
          autoJoinPolicy: window.chrome.cast.AutoJoinPolicy.ORIGIN_SCOPED,
        });

        const castStateChanged = (event: any) => {
          const castState = event.castState;
          setIsCastAvailable(
            castState === window.cast.framework.CastState.NOT_CONNECTED ||
            castState === window.cast.framework.CastState.CONNECTING ||
            castState === window.cast.framework.CastState.CONNECTED
          );
        };
        context.addEventListener(window.cast.framework.CastContextEventType.CAST_STATE_CHANGED, castStateChanged);
        const currentCastState = context.getCastState();
        setIsCastAvailable(
          currentCastState === window.cast.framework.CastState.NOT_CONNECTED ||
          currentCastState === window.cast.framework.CastState.CONNECTING ||
          currentCastState === window.cast.framework.CastState.CONNECTED
        );
      }
    };

    if (window.cast) {
      initializeCastApi();
    } else {
      window.__onGCastApiAvailable = (isAvailable) => {
        if (isAvailable) {
          initializeCastApi();
        }
      };
    }
  }, []);

  const handleCast = () => {
    if (!currentMedia || !currentMedia.url) return;

    const castContext = window.cast.framework.CastContext.getInstance();
    castContext.requestSession().then((session: any) => {
      castSession.current = session;

      let mediaInfo;
      let contentType;

      if (currentMedia.type === 'video' && currentMedia.url.includes('youtube.com')) {
        contentType = 'video/youtube';
        mediaInfo = new window.chrome.cast.media.MediaInfo(currentMedia.url, contentType);
      } else if (currentMedia.type === 'stream') {
        contentType = 'application/x-mpegURL';
        mediaInfo = new window.chrome.cast.media.MediaInfo(currentMedia.url, contentType);
      } else {
        contentType = 'video/mp4';
        mediaInfo = new window.chrome.cast.media.MediaInfo(currentMedia.url, contentType);
      }
      
      mediaInfo.metadata = new window.chrome.cast.media.GenericMediaMetadata();
      mediaInfo.metadata.metadataType = window.chrome.cast.media.MetadataType.GENERIC;
      mediaInfo.metadata.title = currentMedia.title || "Saladillo Vivo";
      
      const request = new window.chrome.cast.media.LoadRequest(mediaInfo);
      session.loadMedia(request).then(
        () => { console.log('Media loaded successfully on Chromecast'); },
        (errorCode: any) => { console.error('Error loading media on Chromecast: ', errorCode); }
      );
    }).catch((error: any) => {
      console.error('Cast Error: ' + JSON.stringify(error));
    });
  };

  return { isCastAvailable, handleCast };
};
