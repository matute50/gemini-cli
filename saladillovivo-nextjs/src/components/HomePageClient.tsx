'use client';

import React, { useState, useEffect } from 'react';
import DesktopLayout from './layout/DesktopLayout';
import MobileLayout from './layout/MobileLayout';
// import NewsDetailModal from './NewsDetailModal'; // Will be created later
import { AnimatePresence } from 'framer-motion';

const useIsMobile = () => {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 1024); // Use 1024px as the breakpoint for desktop layout
    };
    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);
  return isMobile;
};

const HomePageClient = ({ data }) => {
  const isMobile = useIsMobile();
  const [hasMounted, setHasMounted] = useState(false);
  const [selectedNews, setSelectedNews] = useState(null);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  const openModal = (noticia) => setSelectedNews(noticia);
  const closeModal = () => setSelectedNews(null);

  // Placeholder for NewsDetailModal until it's migrated
  const NewsDetailModal = ({ newsItem, onClose }) => {
    if (!newsItem) return null;
    return (
      <div style={{position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.8)', zIndex: 1000, color: 'white', overflowY: 'auto'}} onClick={onClose}>
        <div style={{padding: '2rem', margin: '2rem', background: '#111'}} onClick={e => e.stopPropagation()}>
          <h1>{newsItem.titulo}</h1>
          <p>{newsItem.contenido}</p>
          <button onClick={onClose}>Cerrar</button>
        </div>
      </div>
    )
  }

  if (!hasMounted) {
    return null; // Return null on first render to avoid hydration mismatch
  }

  if (isMobile) {
    return (
      <>
        <MobileLayout data={data} openModal={openModal} isMobile={isMobile} />
        <AnimatePresence>
          {selectedNews && (
            <NewsDetailModal newsItem={selectedNews} onClose={closeModal} />
          )}
        </AnimatePresence>
      </>
    );
  }

  return (
    <>
      <DesktopLayout data={data} openModal={openModal} isMobile={isMobile} />
      <AnimatePresence>
        {selectedNews && (
          <NewsDetailModal newsItem={selectedNews} onClose={closeModal} />
        )}
      </AnimatePresence>
    </>
  );
};

export default HomePageClient;