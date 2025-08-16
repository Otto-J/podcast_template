// 播客信息接口
export interface PodcastInfo {
  title: string;           // 播客标题
  showName: string;        // 节目名称
  logoUrl?: string;        // 节目Logo URL（可选）
}

// 嘉宾信息接口
export interface GuestInfo {
  id: string;              // 嘉宾唯一标识
  name: string;            // 嘉宾姓名
  role: string;            // 角色（主播/嘉宾）
  description: string;     // 角色描述
  videoPlaceholder?: string; // 视频占位图片URL（可选）
}

// 页面数据接口
export interface PageData {
  podcastInfo: PodcastInfo;
  guests: GuestInfo[];
}