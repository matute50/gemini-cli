
import { NextResponse } from 'next/server';
import RSS from 'rss';
import { supabase } from '../../../lib/supabaseClient';
import { NewsArticle } from '../../../types';

export async function GET() {
  const feed = new RSS({
    title: 'Saladillo Vivo | Noticias',
    description: 'Últimas noticias de Saladillo Vivo.',
    feed_url: 'https://www.saladillovivo.com.ar/api/rss',
    site_url: 'https://www.saladillovivo.com.ar',
    language: 'es',
  });

  const { data: articles, error } = await supabase
    .from('articles')
    .select('id, title, slug, description, created_at')
    .order('created_at', { ascending: false })
    .limit(20);

  if (error) {
    console.error('Error fetching articles for RSS feed:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }

  articles.forEach((article: NewsArticle) => {
    // Asegurarse de que el slug existe para no generar URLs inválidas
    if (article.slug) {
      feed.item({
        title: article.title,
        description: article.description || '',
        url: `https://www.saladillovivo.com.ar/noticia/${article.slug}`, // Asumiendo esta estructura de URL
        guid: article.id!,
        date: article.created_at!,
      });
    }
  });

  const xml = feed.xml({ indent: true });

  return new NextResponse(xml, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
    },
  });
}
