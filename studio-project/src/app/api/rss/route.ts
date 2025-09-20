import { NextResponse } from 'next/server';
import { supabase } from '../../../lib/supabaseClient';
import { NewsArticle } from '../../../types';

// Función para escapar caracteres especiales en XML
function escapeXml(unsafe: string): string {
    return unsafe.replace(/[<>&'"\\]/g, (c) => {
        switch (c) {
            case '<': return '&lt;';
            case '>': return '&gt;';
            case '&': return '&amp;';
            case "'": return '&apos;';
            case '"': return '&quot;';
            default: return c;
        }
    });
}

export async function GET() {
    const { data: articles, error } = await supabase
        .from('articles')
        .select('id, title, slug, description, created_at')
        .order('created_at', { ascending: false })
        .limit(20);

    if (error) {
        console.error('Error fetching articles for RSS feed:', error);
        return new NextResponse('Internal Server Error', { status: 500 });
    }

    const siteUrl = 'https://www.saladillovivo.com.ar';
    const feedUrl = `${siteUrl}/api/rss`;

    const itemsXml = articles
        .map((article: NewsArticle) => {
            if (!article.slug || !article.created_at) return '';
            const articleUrl = `${siteUrl}/noticia/${article.slug}`;
            return `
        <item>
          <title>${escapeXml(article.title)}</title>
          <link>${articleUrl}</link>
          <guid isPermaLink="false">${article.id}</guid>
          <pubDate>${new Date(article.created_at).toUTCString()}</pubDate>
          <description><![CDATA[${article.description || ''}]]></description>
        </item>`;
        })
        .join('');

    const xml = `<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Saladillo Vivo | Noticias</title>
    <link>${siteUrl}</link>
    <description>Últimas noticias de Saladillo Vivo.</description>
    <atom:link href="${feedUrl}" rel="self" type="application/rss+xml" />
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    ${itemsXml}
  </channel>
</rss>`;

    return new NextResponse(xml, {
        headers: {
            'Content-Type': 'application/xml; charset=utf-8',
        },
    });
}
