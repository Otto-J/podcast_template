import React, { useState, useRef, useEffect } from 'react';
import { PageData } from '../types';
import { initialData, loadInitialData } from '../data';
import { Play, Pause, FastForward, Edit3, X, Save } from 'lucide-react';

interface PodcastTemplateProps {
  data?: PageData;
}

interface VideoState {
  file: File | null;
  url: string | null;
}

const PodcastTemplate: React.FC<PodcastTemplateProps> = ({ data }) => {
  const [pageData, setPageData] = useState<PageData>(data || initialData);
  const [isLoading, setIsLoading] = useState(!data);
  const { podcastInfo, guests } = pageData;
  
  // 加载数据
  useEffect(() => {
    if (!data) {
      loadInitialData()
        .then(loadedData => {
          setPageData(loadedData);
          setIsLoading(false);
        })
        .catch(error => {
          console.error('Failed to load data:', error);
          setPageData(initialData);
          setIsLoading(false);
        });
    }
  }, [data]);
  
  // 视频状态管理
  const [videos, setVideos] = useState<VideoState[]>([
    { file: null, url: null },
    { file: null, url: null },
    { file: null, url: null }
  ]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editData, setEditData] = useState<PageData>(pageData);
  
  // 当pageData更新时，同步更新editData
  useEffect(() => {
    setEditData(pageData);
  }, [pageData]);
  
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
  
  // 打开编辑模态框
  const openEditModal = () => {
    setEditData(pageData);
    setShowEditModal(true);
  };
  
  // 关闭编辑模态框
  const closeEditModal = () => {
    setShowEditModal(false);
  };
  
  // 保存编辑数据
  const saveEditData = async () => {
    try {
      // 更新页面数据
      setPageData({
        podcastInfo: editData.podcastInfo,
        guests: editData.guests
      });
      
      // 更新JSON文件
      const response = await fetch('/data.json', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          podcastInfo: editData.podcastInfo,
          guests: editData.guests
        })
      });
      
      if (!response.ok) {
        console.warn('无法更新JSON文件，但页面数据已更新');
      }
    } catch (error) {
      console.warn('保存到JSON文件失败，但页面数据已更新:', error);
    }
    
    // 关闭模态框
    setShowEditModal(false);
  };
  
  // 处理表单输入变化
  const handleInputChange = (field: string, value: string, guestIndex?: number) => {
    setEditData(prev => {
      if (guestIndex !== undefined) {
        const newGuests = [...prev.guests];
        newGuests[guestIndex] = { ...newGuests[guestIndex], [field]: value };
        return { ...prev, guests: newGuests };
      } else {
        return {
          ...prev,
          podcastInfo: { ...prev.podcastInfo, [field]: value }
        };
      }
    });
  };

  // 如果正在加载数据，显示加载指示器
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-800 via-slate-700 to-slate-600 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-emerald-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-100 text-lg" style={{fontFamily: 'DingTalk-JinBuTi, serif'}}>加载播客数据中...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-emerald-900/20 to-slate-900 text-white relative overflow-hidden">
      {/* 主题色装饰背景 */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-10 w-96 h-96 bg-emerald-400 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-80 h-80 bg-emerald-500 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-emerald-300 rounded-full blur-3xl"></div>
      </div>
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
          
          <h1 className="text-4xl font-bold text-slate-100 mb-3 tracking-wide" style={{fontFamily: 'DingTalk-JinBuTi, serif'}}>
            {pageData.podcastInfo.title}
          </h1>
          <div className="text-xl font-medium tracking-wider" style={{fontFamily: 'DingTalk-JinBuTi, serif', color: '#34CC85'}}>{pageData.podcastInfo.showName}</div>
        </div>
      </div>

      {/* 视频展示区域 - 三列布局 */}
      <div className="grid grid-cols-3 gap-8 max-w-6xl mx-auto relative z-10">
        {pageData.guests.map((guest, index) => (
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
                <div className="text-lg font-bold text-emerald-400" style={{fontFamily: 'DingTalk-JinBuTi, serif'}}>{guest.name}</div>
                <div className="text-sm font-light text-white" style={{fontFamily: 'DingTalk-JinBuTi, serif'}}>{guest.description}</div>
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
              className="group bg-transparent hover:bg-slate-800/60 backdrop-blur-sm border-2 border-transparent hover:border-emerald-400 rounded-full p-4 hover:scale-110"
            >
              {/* 默认完全透明的图标 */}
              <div className="opacity-0 group-hover:opacity-100">
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
              className="group bg-transparent hover:bg-slate-800/60 backdrop-blur-sm border-2 border-transparent hover:border-amber-400 rounded-full p-4 hover:scale-110"
            >
              {/* 默认完全透明的图标 */}
              <div className="opacity-0 group-hover:opacity-100">
                <div className="flex items-center space-x-3">
                  <FastForward className="w-6 h-6 text-amber-400" />
                  <span className="text-amber-400 font-medium">+30s</span>
                </div>
              </div>
            </button>
            
            {/* 编辑按钮 */}
            <button
              onClick={openEditModal}
              className="group bg-transparent hover:bg-slate-800/60 backdrop-blur-sm border-2 border-transparent hover:border-blue-400 rounded-full p-4 hover:scale-110"
            >
              {/* 默认完全透明的图标 */}
              <div className="opacity-0 group-hover:opacity-100">
                <div className="flex items-center space-x-3">
                  <Edit3 className="w-6 h-6 text-blue-400" />
                  <span className="text-blue-400 font-medium">编辑</span>
                </div>
              </div>
            </button>
          </div>
        </div>
      )}
      
      {/* 编辑模态框 */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-800 rounded-2xl border-2 border-emerald-400 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            {/* 模态框头部 */}
            <div className="flex items-center justify-between p-6 border-b border-slate-700">
              <h2 className="text-2xl font-bold text-slate-100" style={{fontFamily: 'DingTalk-JinBuTi, serif'}}>
                编辑播客信息
              </h2>
              <button
                onClick={closeEditModal}
                className="text-slate-400 hover:text-slate-100 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            {/* 模态框内容 */}
            <div className="p-6 space-y-6">
              {/* 播客标题 */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  播客标题
                </label>
                <input
                  type="text"
                  value={editData.podcastInfo.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-slate-100 focus:border-emerald-400 focus:outline-none transition-colors"
                  style={{fontFamily: 'DingTalk-JinBuTi, serif'}}
                />
              </div>
              
              {/* 节目名称 */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  节目名称
                </label>
                <input
                  type="text"
                  value={editData.podcastInfo.showName}
                  onChange={(e) => handleInputChange('showName', e.target.value)}
                  className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-slate-100 focus:border-emerald-400 focus:outline-none transition-colors"
                  style={{fontFamily: 'DingTalk-JinBuTi, serif'}}
                />
              </div>
              
              {/* 嘉宾信息 */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-slate-200" style={{fontFamily: 'DingTalk-JinBuTi, serif'}}>
                  嘉宾信息
                </h3>
                {editData.guests.map((guest, index) => (
                  <div key={guest.id} className="bg-slate-700/50 rounded-lg p-4 space-y-3">
                    <h4 className="text-md font-medium text-emerald-400">
                      嘉宾 {index + 1}
                    </h4>
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-1">
                        姓名
                      </label>
                      <input
                        type="text"
                        value={guest.name}
                        onChange={(e) => handleInputChange('name', e.target.value, index)}
                        className="w-full px-3 py-2 bg-slate-600 border border-slate-500 rounded text-slate-100 focus:border-emerald-400 focus:outline-none transition-colors mb-3"
                        style={{fontFamily: 'DingTalk-JinBuTi, serif'}}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-1">
                        介绍（包含职位和个人简介）
                      </label>
                      <textarea
                        value={guest.description}
                        onChange={(e) => handleInputChange('description', e.target.value, index)}
                        rows={4}
                        placeholder="请输入嘉宾的职位和个人介绍..."
                        className="w-full px-3 py-2 bg-slate-600 border border-slate-500 rounded text-slate-100 focus:border-emerald-400 focus:outline-none transition-colors resize-none"
                        style={{fontFamily: 'DingTalk-JinBuTi, serif'}}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* 模态框底部 */}
            <div className="flex items-center justify-end space-x-4 p-6 border-t border-slate-700">
              <button
                onClick={closeEditModal}
                className="px-6 py-2 text-slate-400 hover:text-slate-100 transition-colors"
              >
                取消
              </button>
              <button
                onClick={saveEditData}
                className="flex items-center space-x-2 px-6 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors"
              >
                <Save className="w-4 h-4" />
                <span>保存</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PodcastTemplate;