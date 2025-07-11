import { NextResponse } from 'next/server';

import { getAvailableApiSites, getCacheTime } from '@/lib/config';
import { searchFromApi } from '@/lib/downstream';
import { getSearchQueries } from '@/lib/chineseConv';

export const runtime = 'edge';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q');

  if (!query) {
    const cacheTime = getCacheTime();
    return NextResponse.json(
      { results: [] },
      {
        headers: {
          'Cache-Control': `public, max-age=${cacheTime}`,
        },
      }
    );
  }

  // 获取简体和繁体两种形式的查询字符串
  const searchQueries = getSearchQueries(query);
  const apiSites = getAvailableApiSites();
  
  // 存储所有搜索结果的Promise
  const allSearchPromises: Promise<any[]>[] = [];
  
  // 对每个API站点，使用所有查询字符串进行搜索
  for (const site of apiSites) {
    for (const searchQuery of searchQueries) {
      allSearchPromises.push(searchFromApi(site, searchQuery));
    }
  }

  try {
    const results = await Promise.all(allSearchPromises);
    const flattenedResults = results.flat();
    
    // 去重：根据id和source组合去重
    const uniqueResults = flattenedResults.reduce((acc: any[], current: any) => {
      const isDuplicate = acc.some(item => 
        item.id === current.id && item.source === current.source
      );
      
      if (!isDuplicate) {
        acc.push(current);
      }
      
      return acc;
    }, []);
    
    const cacheTime = getCacheTime();

    return NextResponse.json(
      { results: uniqueResults },
      {
        headers: {
          'Cache-Control': `public, max-age=${cacheTime}`,
        },
      }
    );
  } catch (error) {
    console.error('搜索错误:', error);
    return NextResponse.json({ error: '搜索失败' }, { status: 500 });
  }
}