import { PageData } from '../types';

// 从 JSON 文件加载数据
export const loadInitialData = async (): Promise<PageData> => {
  try {
    const response = await fetch('/data.json');
    if (!response.ok) {
      throw new Error('Failed to load data');
    }
    return await response.json();
  } catch (error) {
    console.error('Error loading data:', error);
    // 返回默认数据作为后备
    return {
      podcastInfo: {
        title: "和 OpenBuild 许银聊 2025 年的 Web3 学习、成长路径",
        showName: "Web Worker No.82"
      },
      guests: [
        {
          id: "xinbao",
          name: "辛宝",
          role: "主播",
          description: "Web3 小白"
        },
        {
          id: "xuyin",
          name: "许银",
          role: "嘉宾",
          description: "OpenBuild Co-Funder"
        },
        {
          id: "smart",
          name: "Smart",
          role: "主播",
          description: "Web3 小白"
        }
      ]
    };
  }
};

// 为了向后兼容，保留同步版本的默认数据
export const initialData: PageData = {
  podcastInfo: {
    title: "和 OpenBuild 许银聊 2025 年的 Web3 学习、成长路径",
    showName: "Web Worker No.82"
  },
  guests: [
    {
      id: "xinbao",
      name: "辛宝",
      role: "主播",
      description: "Web3 小白"
    },
    {
      id: "xuyin",
      name: "许银",
      role: "嘉宾",
      description: "OpenBuild Co-Funder"
    },
    {
      id: "smart",
      name: "Smart",
      role: "主播",
      description: "Web3 小白"
    }
  ]
};