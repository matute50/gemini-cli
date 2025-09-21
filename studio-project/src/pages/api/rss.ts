
import { NextApiRequest, NextApiResponse } from 'next';
import RSS from 'rss';
import { supabase } from '@/lib/supabaseClient';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const feed = new RSS({
      title: 'Últimas Noticias - Saladillo Vivo',
      description: 'Mantente al día con las últimas noticias y novedades de Saladillo Vivo.',
      feed_url: `${process.env.NEXT_PUBLIC_SITE_URL}/api/rss`,
      site_url: `${process.env.NEXT_PUBLIC_SITE_URL}`,
      language: 'es',
      pubDate: new Date(),
      ttl: 60,
    });

    const { data: articles, error } = await supabase
      .from('articles')
      .select('id, title, slug, description, updatedAt, createdAt')
      .order('createdAt', { ascending: false })
      .limit(20);

    if (error) {
      throw new Error(`Error al obtener artículos de Supabase: ${error.message}`);
    }

    if (!articles) {
      throw new Error('No se encontraron artículos.');
    }

    articles.forEach(article => {
      const url = `${process.env.NEXT_PUBLIC_SITE_URL}/noticia/${article.slug}`;
      feed.item({
        title: article.title,
        description: article.description || '',
        url: url,
        guid: article.id,
        date: new Date(article.updatedAt || article.createdAt),
        author: 'Saladillo Vivo',
      });
    });

    const xml = feed.xml({ indent: true });

    res.setHeader('Content-Type', 'application/xml');
    res.status(200).send(xml);

  } catch (e: any) {
    console.error('Error al generar el feed RSS:', e);
    res.status(500).send(`Error al generar el feed: ${e.message}`);
  }
}
