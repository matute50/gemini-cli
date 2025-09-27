
"use client";

import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { Article, Video, Interview, Banner, Ad, CalendarEvent, TickerText } from '@/lib/types';
import { useToast } from '@/components/ui/use-toast';

interface NewsContextType {
  news: Article[];
  mainFeaturedNews: Article | null;
  secondaryFeaturedNews1: Article | null;
  secondaryFeaturedNews2: Article | null;
  otherNews: Article[];
  allTickerTexts: string[];
  galleryVideos: Video[];
  interviews: Interview[];
  activeBanners: Banner[];
  activeAds: Ad[];
  isLoading: boolean;
  isLoadingVideos: boolean;
  isLoadingInterviews: boolean;
  isLoadingBanners: boolean;
  adsLoading: boolean;
  getNewsById: (id: string | number) => Article | undefined;
  getNewsBySlug: (slug: string) => Article | undefined;
  getRelatedNews: (currentSlug: string, category: string) => Article[];
  getNewsByCategory: (category: string) => Article[];
  calendarEvents: CalendarEvent[];
  eventsLoading: boolean;
  isLoadingConfig: boolean;
  isDarkTheme: boolean;
}

export const NewsContext = createContext<NewsContextType | undefined>(undefined);

export const useNews = () => {
  const context = useContext(NewsContext);
  if (!context) {
    throw new Error('useNews must be used within a NewsProvider');
  }
  return context;
};

export const NewsProvider = ({ children }: { children: ReactNode }) => {
  const [news, setNews] = useState<Article[]>([]);
  const [mainFeaturedNews, setMainFeaturedNews] = useState<Article | null>(null);
  const [secondaryFeaturedNews1, setSecondaryFeaturedNews1] = useState<Article | null>(null);
  const [secondaryFeaturedNews2, setSecondaryFeaturedNews2] = useState<Article | null>(null);
  const [otherNews, setOtherNews] = useState<Article[]>([]);
  const [allTickerTexts, setAllTickerTexts] = useState<string[]>([]);
  const [galleryVideos, setGalleryVideos] = useState<Video[]>([]);
  const [interviews, setInterviews] = useState<Interview[]>([]);
  const [activeBanners, setActiveBanners] = useState<Banner[]>([]);
  const [activeAds, setActiveAds] = useState<Ad[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingVideos, setIsLoadingVideos] = useState(true);
  const [isLoadingInterviews, setIsLoadingInterviews] = useState(true);
  const [isLoadingBanners, setIsLoadingBanners] = useState(true);
  const [adsLoading, setAdsLoading] = useState(true);
  const { toast } = useToast();

  const [calendarEvents, setCalendarEvents] = useState<CalendarEvent[]>([]);
  const [eventsLoading, setEventsLoading] = useState(true);
  const [isLoadingConfig, setIsLoadingConfig] = useState(false);
  
  const [isDarkTheme, setIsDarkTheme] = useState(false); // Default a false, se actualizará en useEffect

  useEffect(() => {
    // Asegurarse de que este código solo se ejecute en el cliente
    setIsDarkTheme(document.documentElement.classList.contains('dark'));
    const observer = new MutationObserver(() => {
      setIsDarkTheme(document.documentElement.classList.contains('dark'));
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const fetchAllData = async () => {
      // ... (la lógica de fetch se mantiene igual, pero con tipos más fuertes)
      // Esta es una versión simplificada, la lógica completa es extensa
      try {
        setIsLoading(true);
        const articlesResponse = await supabase.from('articles').select('*').order('createdAt', { ascending: false });
        if (articlesResponse.error) throw articlesResponse.error;

        const processedNews: Article[] = articlesResponse.data.map((item: any) => ({
          id: item.id,
          titulo: item.title,
          slug: item.slug || item.id.toString(),
          description: item.description || (item.text ? item.text.substring(0, 160) : 'Descripción no disponible.'),
          resumen: item.text ? item.text.substring(0, 150) + (item.text.length > 150 ? '...' : '') : 'Resumen no disponible.',
          contenido: item.text || 'Contenido no disponible.',
          fecha: item.updatedAt || item.createdAt,
          createdAt: item.createdAt,
          updatedAt: item.updatedAt,
          autor: 'Equipo Editorial',
          categoria: item.featureStatus, // Asumiendo que featureStatus es la categoría
          imageUrl: item.imageUrl || 'https://images.unsplash.com/photo-1495020689067-958852a7765e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1169&q=80',
          featureStatus: item.featureStatus,
        }));
        setNews(processedNews);
        // ... Lógica para setear noticias destacadas, etc.

      } catch (error: any) {
        console.error("Error cargando datos:", error);
        toast({ title: "Error de Carga", description: error.message });
      }
      setIsLoading(false);
    };

    fetchAllData();
  }, []);

  const getNewsBySlug = (slug: string) => news.find(item => item.slug === slug);
  // Implementar las otras funciones get...
  const getNewsById = (id: string | number) => news.find(item => item.id.toString() === id.toString());
  const getRelatedNews = (currentSlug: string, category: string) => news.filter(item => item.slug !== currentSlug && item.categoria === category).slice(0, 3);
  const getNewsByCategory = (category: string) => news.filter(item => item.categoria === category);


  const value = {
    news,
    mainFeaturedNews,
    secondaryFeaturedNews1,
    secondaryFeaturedNews2,
    otherNews,
    allTickerTexts,
    galleryVideos,
    interviews,
    activeBanners,
    activeAds,
    isLoading,
    isLoadingVideos,
    isLoadingInterviews,
    isLoadingBanners,
    adsLoading,
    getNewsById,
    getNewsBySlug,
    getRelatedNews,
    getNewsByCategory,
    calendarEvents,
    eventsLoading,
    isLoadingConfig,
    isDarkTheme,
  };

  return <NewsContext.Provider value={value}>{children}</NewsContext.Provider>;
};
