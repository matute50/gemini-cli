
import { NextResponse } from 'next/server';
import RSS from 'rss';
import { supabase } from '@/lib/supabaseClient'; // Reutilizamos el cliente de Supabase existente

// Configuración para que la ruta se ejecute dinámicamente y no se cachee
export const dynamic = 'force-dynamic';

export async function GET() {
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

    // 1. Obtener los últimos artículos de Supabase
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

    // 2. Añadir cada artículo como un item al feed
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

    // 3. Generar el XML
    const xml = feed.xml({ indent: true });

    // 4. Devolver la respuesta con el content-type correcto
    return new NextResponse(xml, {
      status: 200,
      headers: {
        'Content-Type': 'application/xml',
      },
    });

  } catch (e: any) {
    console.error('Error al generar el feed RSS:', e);
    return new NextResponse(`Error al generar el feed: ${e.message}`,
      {
        status: 500,
      }
    );
  }
}
