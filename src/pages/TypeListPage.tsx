import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import ContentCard from '../components/ContentCard';
import SkeletonCard from '../components/SkeletonCard';
import { getVideoList } from '../api/video';
import { Video } from '../api/types';

// 定義類型映射
const TYPE_MAP: { [key: string]: { id: number; title: string } } = {
  movies: { id: 6, title: '電影' },
  tv: { id: 13, title: '電視劇' },
  anime: { id: 60, title: '動漫' },
  variety: { id: 38, title: '綜藝' },
  short: { id: 27, title: '短劇' }
};

// 定義電影子分類映射
const MOVIE_SUB_TYPES = [
  { id: 6, name: '劇情片' },
  { id: 7, name: '動作片' },
  { id: 8, name: '冒險片' },
  { id: 26, name: '動畫電影' },
  { id: 10, name: '喜劇片' },
  { id: 11, name: '奇幻片' },
  { id: 12, name: '恐怖片' },
  { id: 20, name: '懸疑片' },
  { id: 21, name: '驚悚片' },
  { id: 22, name: '災難片' },
  { id: 23, name: '愛情片' },
  { id: 24, name: '犯罪片' },
  { id: 25, name: '科幻片' },

];

// 定義電視劇子分類映射
const TV_SUB_TYPES = [
  { id: 13, name: '國產劇' },
  { id: 14, name: '港劇' },
  { id: 15, name: '韓劇' },
  { id: 16, name: '日劇' },
  { id: 28, name: '泰劇' },
  { id: 29, name: '台劇' },
  { id: 30, name: '歐美劇' },
  { id: 31, name: '新馬劇' },
  { id: 32, name: '其他劇' }
];

// 定義動漫子分類映射
const ANIME_SUB_TYPES = [
  { id: 60, name: '國產動漫' },
  { id: 57, name: '歐美動漫' },
  { id: 58, name: '日本動漫' },
  { id: 59, name: '韓國動漫' },
  { id: 61, name: '港台動漫' },
  { id: 62, name: '新馬泰動漫' },
  { id: 63, name: '其它動漫' }
];

// 定義綜藝子分類映射
const VARIETY_SUB_TYPES = [
  { id: 38, name: '國產綜藝' },
  { id: 39, name: '港台綜藝' },
  { id: 40, name: '韓國綜藝' },
  { id: 41, name: '日本綜藝' },
  { id: 42, name: '歐美綜藝' },
  { id: 43, name: '新馬泰綜藝' },
  { id: 44, name: '其他綜藝' }
];

// 定義短劇子分類映射
const SHORT_SUB_TYPES = [
  { id: 47, name: '逆襲短劇' },
  { id: 45, name: '古裝短劇' },
  { id: 46, name: '虐戀短劇' },
  { id: 48, name: '懸疑短劇' },
  { id: 49, name: '神豪短劇' },
  { id: 50, name: '重生短劇' },
  { id: 51, name: '覆仇短劇' },
  { id: 52, name: '穿越短劇' },
  { id: 53, name: '甜寵短劇' },
  { id: 54, name: '強者短劇' },
  { id: 55, name: '萌寶短劇' },
  { id: 56, name: '其它短劇' },
];

interface TypeListPageProps {
  type: string;
}

const TypeListPage: React.FC<TypeListPageProps> = ({ type }) => {
  const navigate = useNavigate();
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [selectedMovieType, setSelectedMovieType] = useState(6); // 默认选中剧情片
  const [selectedTvType, setSelectedTvType] = useState(13); // 默认选中国产剧
  const [selectedAnimeType, setSelectedAnimeType] = useState(60); // 默认选中欧美动漫
  const [selectedVarietyType, setSelectedVarietyType] = useState(38); // 默认选中国产综艺
  const [selectedShortType, setSelectedShortType] = useState(47); // 默认选中古装短剧
  const observer = useRef<IntersectionObserver | null>(null);
  const lastVideoElementRef = useCallback((node: HTMLDivElement | null) => {
    if (loading) return;
    if (observer.current) observer.current.disconnect();
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        setPage(prevPage => prevPage + 1);
      }
    });
    if (node) observer.current.observe(node);
  }, [loading, hasMore]);

  useEffect(() => {
    const fetchVideos = async () => {
      if (!type || !TYPE_MAP[type]) return;
      
      setLoading(true);
      try {
        const response = await getVideoList({
          ac: 'videolist',
          t: type === 'movies' ? selectedMovieType : 
             type === 'tv' ? selectedTvType :
             type === 'anime' ? selectedAnimeType :
             type === 'variety' ? selectedVarietyType :
             type === 'short' ? selectedShortType :
             TYPE_MAP[type].id,
          pg: page,
          pagesize: 24,
        });
        
        setVideos(prevVideos => [...prevVideos, ...response.list]);
        setTotalPages(response.pagecount);
        setHasMore(page < response.pagecount);
      } catch (error) {
        console.error('获取视频列表失败:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchVideos();
  }, [type, page, selectedMovieType, selectedTvType, selectedAnimeType, selectedVarietyType, selectedShortType]);

  if (!type || !TYPE_MAP[type]) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <div className="text-center py-12">
            <p className="text-gray-500">无效的类型</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        {/* <h1 className="text-2xl font-bold mb-6">{TYPE_MAP[type].title}</h1> */}
        
        {type === 'movies' && (
          <div className="mb-6">
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 xl:grid-cols-10 gap-2">
              {MOVIE_SUB_TYPES.map(subType => (
                <button
                  key={subType.id}
                  onClick={() => {
                    setSelectedMovieType(subType.id);
                    setPage(1);
                    setVideos([]);
                  }}
                  className={`px-2 py-1.5 rounded-full text-xs sm:text-sm whitespace-nowrap transition-all duration-200 ${
                    selectedMovieType === subType.id
                      ? 'bg-primary text-white shadow-sm'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {subType.name}
                </button>
              ))}
            </div>
          </div>
        )}
        
        {type === 'tv' && (
          <div className="mb-6">
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 xl:grid-cols-10 gap-2">
              {TV_SUB_TYPES.map(subType => (
                <button
                  key={subType.id}
                  onClick={() => {
                    setSelectedTvType(subType.id);
                    setPage(1);
                    setVideos([]);
                  }}
                  className={`px-2 py-1.5 rounded-full text-xs sm:text-sm whitespace-nowrap transition-all duration-200 ${
                    selectedTvType === subType.id
                      ? 'bg-primary text-white shadow-sm'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {subType.name}
                </button>
              ))}
            </div>
          </div>
        )}
        
        {type === 'anime' && (
          <div className="mb-6">
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 xl:grid-cols-10 gap-2">
              {ANIME_SUB_TYPES.map(subType => (
                <button
                  key={subType.id}
                  onClick={() => {
                    setSelectedAnimeType(subType.id);
                    setPage(1);
                    setVideos([]);
                  }}
                  className={`px-2 py-1.5 rounded-full text-xs sm:text-sm whitespace-nowrap transition-all duration-200 ${
                    selectedAnimeType === subType.id
                      ? 'bg-primary text-white shadow-sm'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {subType.name}
                </button>
              ))}
            </div>
          </div>
        )}
        
        {type === 'variety' && (
          <div className="mb-6">
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 xl:grid-cols-10 gap-2">
              {VARIETY_SUB_TYPES.map(subType => (
                <button
                  key={subType.id}
                  onClick={() => {
                    setSelectedVarietyType(subType.id);
                    setPage(1);
                    setVideos([]);
                  }}
                  className={`px-2 py-1.5 rounded-full text-xs sm:text-sm whitespace-nowrap transition-all duration-200 ${
                    selectedVarietyType === subType.id
                      ? 'bg-primary text-white shadow-sm'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {subType.name}
                </button>
              ))}
            </div>
          </div>
        )}
        
        {type === 'short' && (
          <div className="mb-6">
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 xl:grid-cols-10 gap-2">
              {SHORT_SUB_TYPES.map(subType => (
                <button
                  key={subType.id}
                  onClick={() => {
                    setSelectedShortType(subType.id);
                    setPage(1);
                    setVideos([]);
                  }}
                  className={`px-2 py-1.5 rounded-full text-xs sm:text-sm whitespace-nowrap transition-all duration-200 ${
                    selectedShortType === subType.id
                      ? 'bg-primary text-white shadow-sm'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {subType.name}
                </button>
              ))}
            </div>
          </div>
        )}
        
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {loading && videos.length === 0 ? (
            // 初始加载时显示骨架屏
            Array.from({ length: 12 }).map((_, index) => (
              <SkeletonCard key={index} />
            ))
          ) : videos.length > 0 ? (
            // 显示视频列表
            videos.map((item, index) => (
              <div
                key={item.vod_id}
                ref={index === videos.length - 1 ? lastVideoElementRef : null}
              >
                <ContentCard
                  id={item.vod_id}
                  title={item.vod_name}
                  imageUrl={item.vod_pic}
                  rating={typeof item.vod_score === 'number' ? item.vod_score.toFixed(1) : undefined}
                  episodeCount={item.vod_play_url ? item.vod_play_url.split('#').length.toString() : undefined}
                />
              </div>
            ))
          ) : (
            // 没有数据时显示提示
            <div className="col-span-full text-center py-12">
              <p className="text-gray-500">暂无数据</p>
            </div>
          )}
        </div>
        
        {loading && videos.length > 0 && (
          <div className="flex justify-center items-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default TypeListPage;