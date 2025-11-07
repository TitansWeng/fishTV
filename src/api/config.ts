export const API_CONFIG = {
  baseURL: '/youzhi/api.php',
  timeout: 10000,
};

export const VIDEO_SOURCES = {
  moyu: {
    name: '索尼雲',
    url: '/suoni/api.php'
  },
  feifan: {
    name: '非凡雲',
    url: '/ffzy5/api.php'
  },
  modu: {
    name: '魔都雲',
    url: '/modu/api.php'
  },
  youzhi: {
    name: '優質雲',
    url: '/youzhi/inc/apijson.php'
  },
  subocaiji: {
    name: '速播雲',
    url: '/suboc/api.php'
  },

};

export const setBaseURL = (url: string) => {
  API_CONFIG.baseURL = url;
}; 