import React from 'react';
import { PageData } from '../types';
import { initialData } from '../data';

interface PodcastTemplateProps {
  data?: PageData;
}

const PodcastTemplate: React.FC<PodcastTemplateProps> = ({ data = initialData }) => {
  const { podcastInfo, guests } = data;

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
          
          <h1 className="text-5xl font-bold text-slate-100 mb-3 tracking-wide">
            {podcastInfo.title}
          </h1>
          <div className="text-lg text-amber-400 font-light tracking-widest">
            TECH FRONTIER DIALOGUE
          </div>
        </div>
      </div>

      {/* 视频展示区域 - 三列布局 */}
      <div className="grid grid-cols-3 gap-8 max-w-6xl mx-auto relative z-10">
        {guests.map((guest) => (
          <div key={guest.id} className="relative group">
            <div className="w-full aspect-[9/16] bg-slate-900 rounded-2xl border-3 border-emerald-400 overflow-hidden shadow-2xl relative">
              {/* 艺术装饰边框 */}
              <div className="absolute -top-1 -left-1 w-4 h-4 border-t-2 border-l-2 border-amber-400"></div>
              <div className="absolute -top-1 -right-1 w-4 h-4 border-t-2 border-r-2 border-amber-400"></div>
              <div className="absolute -bottom-1 -left-1 w-4 h-4 border-b-2 border-l-2 border-emerald-400"></div>
              <div className="absolute -bottom-1 -right-1 w-4 h-4 border-b-2 border-r-2 border-emerald-400"></div>
              
              <div className="w-full h-full flex items-center justify-center">
                <div className="text-center">
                  <div className="w-20 h-20 bg-emerald-400 rounded-full mx-auto mb-4 flex items-center justify-center">
                    <span className="text-2xl font-bold text-slate-900">
                      {guest.name.charAt(0)}
                    </span>
                  </div>
                  <p className="text-amber-300 text-sm">视频占位</p>
                </div>
              </div>
              
              {/* 现代风格人物信息 */}
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-slate-900 via-slate-800 to-transparent text-slate-100 p-4">
                <div className="text-lg font-bold text-emerald-400">{guest.name}</div>
                <div className="text-sm text-amber-300 font-light">{guest.role}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PodcastTemplate;