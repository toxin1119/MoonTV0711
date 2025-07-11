import { Converter } from 'opencc-js';

// 初始化转换器（配置繁简转换规则）
const t2sConverter = Converter({ from: 'hk', to: 'cn' }); // 繁体转简体
const s2tConverter = Converter({ from: 'cn', to: 'hk' }); // 简体转繁体

/**
 * 繁简体转换工具函数
 * @param text 输入的文本
 * @returns 包含简体和繁体两种形式的对象
 */
export function convertChineseText(text: string): {
  simplified: string;
  traditional: string;
} {
  return {
    simplified: t2sConverter(text), // 繁体转简体
    traditional: s2tConverter(text), // 简体转繁体
  };
}

/**
 * 获取搜索用的查询字符串数组
 * @param query 原始查询字符串
 * @returns 包含简体和繁体两种形式的数组
 */
export function getSearchQueries(query: string): string[] {
  const { simplified, traditional } = convertChineseText(query);
  return simplified === traditional ? [simplified] : [simplified, traditional];
}
