import React, { useState, useRef } from 'react';
import { PageData } from '../types';
import { initialData } from '../data';
import { Play, Pause, FastForward } from 'lucide-react';

interface PodcastTemplateProps {
  data?: PageData;
}

interface VideoState {
  file: File | null;
  url: string | null;
}

const PodcastTemplate: React.FC<PodcastTemplateProps> = ({ data = initialData }) => {
  const { podcastInfo, guests } = data;
  
  // 视频状态管理
  const [videos, setVideos] = useState<VideoState[]>([
    { file: null, url: null },
    { file: null, url: null },
    { file: null, url: null }
  ]);
  const [isPlaying, setIsPlaying] = useState(false);
  
  // 视频引用
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([null, null, null]);
  const fileInputRefs = useRef<(HTMLInputElement | null)[]>([null, null, null]);
  
  // 处理视频文件选择
  const handleVideoSelect = (index: number, event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type.startsWith('video/')) {
      const url = URL.createObjectURL(file);
      setVideos(prev => {
        const newVideos = [...prev];
        // 清理之前的URL
        if (newVideos[index].url) {
          URL.revokeObjectURL(newVideos[index].url!);
        }
        newVideos[index] = { file, url };
        return newVideos;
      });
    }
  };
  
  // 点击视频区域触发文件选择
  const handleVideoClick = (index: number) => {
    if (!videos[index].file) {
      fileInputRefs.current[index]?.click();
    }
  };
  
  // 同步播放/暂停所有视频
  const togglePlayback = () => {
    const allVideos = videoRefs.current.filter(ref => ref !== null) as HTMLVideoElement[];
    
    if (isPlaying) {
      allVideos.forEach(video => video.pause());
    } else {
      allVideos.forEach(video => video.play().catch(console.error));
    }
    
    setIsPlaying(!isPlaying);
  };
  
  // 快进30秒
  const seekForward = () => {
    const allVideos = videoRefs.current.filter(ref => ref !== null) as HTMLVideoElement[];
    allVideos.forEach(video => {
      video.currentTime = Math.min(video.currentTime + 30, video.duration || 0);
    });
  };
  
  // 检查是否所有视频都已选择
  const allVideosSelected = videos.every(video => video.file !== null);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-800 via-slate-700 to-slate-600 relative overflow-hidden">
      {/* 现代艺术几何装饰 */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-16 left-16 w-40 h-40 border-2 border-amber-400 rounded-none rotate-45"></div>
        <div className="absolute top-32 right-24 w-32 h-32 bg-emerald-400 clip-path-triangle"></div>
        <div className="absolute bottom-40 left-1/3 w-48 h-2 bg-gradient-to-r from-amber-400 to-emerald-400"></div>
        <div className="absolute bottom-24 right-32 w-36 h-36 border-2 border-emerald-400 rounded-full"></div>
        <div className="absolute top-1/2 left-8 w-2 h-32 bg-amber-400 rotate-12"></div>
        <div className="absolute top-1/3 right-8 w-24 h-24 bg-gradient-to-br from-emerald-400 to-amber-400 rounded-lg rotate-45 opacity-60"></div>
      </div>
      
      {/* 现代艺术风格标题区域 */}
      <div className="relative z-10 text-center py-12">
        <div className="relative inline-block">
          {/* 装饰性线条框架 */}
          <div className="absolute -top-4 -left-8 w-16 h-1 bg-gradient-to-r from-amber-400 to-emerald-400"></div>
          <div className="absolute -bottom-4 -right-8 w-16 h-1 bg-gradient-to-r from-emerald-400 to-amber-400"></div>
          <div className="absolute -top-2 -right-4 w-1 h-8 bg-emerald-400"></div>
          <div className="absolute -bottom-2 -left-4 w-1 h-8 bg-amber-400"></div>
          
          <h1 className="text-4xl font-serif font-bold text-slate-100 mb-3 tracking-wide">
            {podcastInfo.title}
          </h1>
          <div className="text-xl text-amber-400 font-serif font-medium tracking-wider">Web Worker 播客</div>
        </div>
      </div>

      {/* 视频展示区域 - 三列布局 */}
      <div className="grid grid-cols-3 gap-8 max-w-6xl mx-auto relative z-10">
        {guests.map((guest, index) => (
          <div key={guest.id} className="relative group">
            {/* 隐藏的文件输入 */}
            <input
              ref={el => fileInputRefs.current[index] = el}
              type="file"
              accept="video/mp4,video/webm,video/ogg"
              onChange={(e) => handleVideoSelect(index, e)}
              className="hidden"
            />
            
            <div 
              className="w-full aspect-[9/16] bg-slate-900 rounded-2xl border-3 border-emerald-400 overflow-hidden shadow-2xl relative cursor-pointer hover:border-amber-400 transition-colors duration-300"
              onClick={() => handleVideoClick(index)}
            >
              {/* 艺术装饰边框 */}
              <div className="absolute -top-1 -left-1 w-4 h-4 border-t-2 border-l-2 border-amber-400"></div>
              <div className="absolute -top-1 -right-1 w-4 h-4 border-t-2 border-r-2 border-amber-400"></div>
              <div className="absolute -bottom-1 -left-1 w-4 h-4 border-b-2 border-l-2 border-emerald-400"></div>
              <div className="absolute -bottom-1 -right-1 w-4 h-4 border-b-2 border-r-2 border-emerald-400"></div>
              
              {videos[index].url ? (
                <video
                  ref={el => videoRefs.current[index] = el}
                  src={videos[index].url!}
                  className="w-full h-full object-cover"
                  playsInline
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-20 h-20 bg-emerald-400 rounded-full mx-auto mb-4 flex items-center justify-center">
                      <span className="text-2xl font-bold text-slate-900">
                        {guest.name.charAt(0)}
                      </span>
                    </div>
                    <p className="text-amber-300 text-sm">点击选择视频</p>
                  </div>
                </div>
              )}
              
              {/* 现代风格人物信息 */}
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-slate-900 via-slate-800 to-transparent text-slate-100 p-4">
                <div className="text-lg font-bold text-emerald-400">{guest.name}</div>
                <div className="text-sm text-amber-300 font-light">{guest.role}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {/* 播放控制按钮 - 当所有视频都选择后显示 */}
      {allVideosSelected && (
        <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-20">
          <div className="flex items-center space-x-4">
            {/* 播放/暂停按钮 */}
            <button
              onClick={togglePlayback}
              className="group bg-transparent hover:bg-slate-800/60 backdrop-blur-sm border-2 border-transparent hover:border-emerald-400 rounded-full p-4 transition-all duration-300 hover:scale-110"
            >
              {/* 默认完全透明的图标 */}
              <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="flex items-center space-x-3">
                  {isPlaying ? (
                    <>
                      <Pause className="w-6 h-6 text-emerald-400" />
                      <span className="text-emerald-400 font-medium">暂停</span>
                    </>
                  ) : (
                    <>
                      <Play className="w-6 h-6 text-emerald-400" />
                      <span className="text-emerald-400 font-medium">播放</span>
                    </>
                  )}
                </div>
              </div>
            </button>
            
            {/* 快进30秒按钮 */}
            <button
              onClick={seekForward}
              className="group bg-transparent hover:bg-slate-800/60 backdrop-blur-sm border-2 border-transparent hover:border-amber-400 rounded-full p-4 transition-all duration-300 hover:scale-110"
            >
              {/* 默认完全透明的图标 */}
              <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="flex items-center space-x-3">
                  <FastForward className="w-6 h-6 text-amber-400" />
                  <span className="text-amber-400 font-medium">+30s</span>
                </div>
              </div>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PodcastTemplate;