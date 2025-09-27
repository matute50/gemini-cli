'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';

const formatDate = (dateString) => {
  if (!dateString) return 'Fecha no disponible';
  const date = new Date(dateString);
  const options = { day: 'numeric', month: 'numeric', year: '2-digit' };
  try {
    return date.toLocaleDateString('es-ES', options);
  } catch (error) {
    return 'Fecha inválida';
  }
};

const MobileNewsCard = ({ newsItem }) => {
  if (!newsItem) return null;

  return (
    <Link href={`/noticia/${newsItem.slug}`} passHref>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full card card-blur shadow-md cursor-pointer overflow-hidden flex flex-col"
      >
        <div className="news-image-container relative aspect-[16/10]">
          <Image 
            loading="lazy"
            className="w-full h-full object-cover"
            alt={`Imagen de: ${newsItem.titulo}`}
            src={newsItem.imageUrl}
            fill
            sizes="(max-width: 640px) 100vw, 50vw"
          />
          <div className="absolute bottom-1 right-1 bg-black/60 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-sm">
            {formatDate(newsItem.fecha)}
          </div>
        </div>
        <div className="p-2 flex-grow">
          <h3 className="font-futura-bold text-sm text-card-foreground line-clamp-4 hover:text-primary transition-colors">
            {newsItem.titulo}
          </h3>
        </div>
      </motion.div>
    </Link>
  );
};


const MobileNewsGrid = ({ newsItems }) => {
  if (!newsItems || newsItems.length === 0) return null;

  return (
    <div className="mb-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {newsItems.map((item) => (
          item && <MobileNewsCard key={item.id} newsItem={item} />
        ))}
      </div>
    </div>
  );
};

export default MobileNewsGrid;