import { s2t, t2s } from 'chinese-conv';

/**
 * 繁简体转换工具函数
 * 将输入的字符串转换为简体和繁体两种形式
 * @param text 输入的文本
 * @returns 包含简体和繁体两种形式的对象
 */
export function convertChineseText(text: string): { simplified: string; traditional: string } {
  // 转换为简体
  const simplified = t2s(text);
  // 转换为繁体
  const traditional = s2t(text);

  return {
    simplified,
    traditional,
  };
}

/**
 * 获取搜索用的查询字符串数组
 * 将输入的查询字符串转换为简体和繁体两种形式，用于搜索
 * @param query 原始查询字符串
 * @returns 包含简体和繁体两种形式的数组
 */
export function getSearchQueries(query: string): string[] {
  const { simplified, traditional } = convertChineseText(query);
  
  // 如果简体和繁体相同，则只返回一个
  if (simplified === traditional) {
    return [simplified];
  }
  
  // 返回简体和繁体两种形式
  return [simplified, traditional];
}