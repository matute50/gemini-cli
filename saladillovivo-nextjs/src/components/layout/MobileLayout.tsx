'use client';

import React, { useState, useMemo } from 'react';
import MobileNewsGrid from './MobileNewsGrid';
import BannerSection from './BannerSection';
import AdsSection from './AdsSection';
import VideoSection from './VideoSection';
import DemandCarouselBlock from './DemandCarouselBlock';

const MobileLayout = ({ data, openModal, isMobile }) => {
  const { articles, banners, ads, videos } = data;
  const { mainFeaturedNews, secondaryFeaturedNews1, secondaryFeaturedNews2, otherNews } = articles;

  const allNewsForMobile = useMemo(() => {
    const newsArr = [];
    if (mainFeaturedNews) newsArr.push(mainFeaturedNews);
    if (secondaryFeaturedNews1) newsArr.push(secondaryFeaturedNews1);
    if (secondaryFeaturedNews2) newsArr.push(secondaryFeaturedNews2);
    return [...newsArr, ...otherNews];
  }, [mainFeaturedNews, secondaryFeaturedNews1, secondaryFeaturedNews2, otherNews]);

  // Simplified category logic for mobile
  const categoryMap = {
    "Últimas Noticias": videos.filter(v => v.categoria === 'Noticias'),
    "Sembrando Futuro": videos.filter(v => v.categoria === 'SEMBRANDO FUTURO'),
    "Hacelo Corto": videos.filter(v => v.categoria === 'cortos'),
    "Lo que Fuimos": videos.filter(v => v.categoria === 'historia'),
    "Saladillo Canta": videos.filter(v => v.categoria === 'clips'),
  };

  const selectableCategories = Object.keys(categoryMap);
  const [categoryIndex, setCategoryIndex] = useState(0);

  const handleCategoryChange = (direction) => {
    setCategoryIndex(prevIndex => (prevIndex + direction + selectableCategories.length) % selectableCategories.length);
  };

  const selectedCategoryTitle = selectableCategories[categoryIndex];
  const selectedCategoryVideos = categoryMap[selectedCategoryTitle];

  return (
    <>
      <VideoSection isMobileFixed={true} isMobile={isMobile} />
      <main className="w-full pt-[calc(var(--player-height-mobile)+var(--header-height))]">
        <div className="flex flex-col gap-2">
          
          <section className="flex flex-col items-center pt-2" aria-label="Carrusel de categorías on demand">
            <DemandCarouselBlock 
              title={selectedCategoryTitle}
              videos={selectedCategoryVideos}
              isLoading={false}
              onCategoryChange={handleCategoryChange}
              isMobile={true}
              carouselId={`demand-mobile`}
            />
          </section>

          <section aria-label="Banner publicitario principal" className="px-2">
            <BannerSection
              activeBanners={banners}
              isLoadingBanners={false}
              className="w-full"
              isMobile={isMobile}
            />
          </section>

          <section aria-label="Grilla de noticias" className="px-2">
            <MobileNewsGrid
              newsItems={allNewsForMobile}
              openModal={openModal}
            />
          </section>

          <aside aria-label="Anuncios secundarios" className="px-2">
            <AdsSection
              activeAds={ads}
              adsLoading={false}
              isMobile={isMobile}
            />
          </aside>
        </div>
      </main>
    </>
  );
};

export default MobileLayout;
