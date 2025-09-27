import {
  getArticles,
  getTickerTexts,
  getVideos,
  getInterviews,
  getActiveBanners,
  getActiveAds,
  getCalendarEvents,
} from "@/lib/data";
import HomePageClient from "@/components/HomePageClient";
import type { Metadata } from 'next';

// This function generates metadata on the server.
export async function generateMetadata(): Promise<Metadata> {
  const { mainFeaturedNews } = await getArticles();
 
  return {
    title: mainFeaturedNews?.meta_title || 'Saladillo Vivo - Noticias, Eventos y Cultura',
    description: mainFeaturedNews?.meta_description || 'Saladillo Vivo es el canal temático de noticias, eventos y cultura de Saladillo. Mirá streaming en vivo y contenido on demand las 24hs.',
    keywords: mainFeaturedNews?.meta_keywords || 'Saladillo, noticias, actualidad, vivo, streaming, eventos, cultura, HCD',
    openGraph: {
      title: mainFeaturedNews?.meta_title || 'Saladillo Vivo - Noticias y Actualidad',
      description: mainFeaturedNews?.meta_description || 'Saladillo Vivo es el canal temático de noticias, eventos y cultura de Saladillo.',
      images: [mainFeaturedNews?.imageUrl || 'https://www.saladillovivo.com.ar/default-og-image.png'],
      url: `https://www.saladillovivo.com.ar${mainFeaturedNews?.slug ? '/noticia/' + mainFeaturedNews.slug : ''}`,
      type: mainFeaturedNews ? 'article' : 'website',
    },
  };
}

// This is the main page component, rendered on the server.
export default async function Page() {
  // Fetch all data concurrently for performance.
  const [articles, tickerTexts, videos, interviews, banners, ads, events] = await Promise.all([
    getArticles(),
    getTickerTexts(),
    getVideos(),
    getInterviews(),
    getActiveBanners(),
    getActiveAds(),
    getCalendarEvents(),
  ]);

  const pageData = {
    articles,
    tickerTexts,
    videos,
    interviews,
    banners,
    ads,
    events,
  };

  // Pass the server-fetched data to the client component.
  return <HomePageClient data={pageData} />;
}