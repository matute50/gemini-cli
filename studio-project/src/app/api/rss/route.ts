import { NextResponse } from 'next/server';
import RSS from 'rss';

export async function GET() {
  const feed = new RSS({
    title: 'Saladillo Vivo | Noticias',
    description: 'Últimas noticias de Saladillo Vivo.',
    feed_url: 'https://www.saladillovivo.com.ar/api/rss',
    site_url: 'https://www.saladillovivo.com.ar',
  });

  feed.item({
    title:  'Artículo de prueba',
    description: 'Este es un artículo de prueba para depurar el feed RSS.',
    url: 'https://www.saladillovivo.com.ar',
    guid: 'test-guid-12345',
    date: new Date(),
  });

  const xml = feed.xml({ indent: true });

  return new NextResponse(xml, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
    },
  });
}