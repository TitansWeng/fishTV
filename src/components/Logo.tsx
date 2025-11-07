import React from 'react';

const Logo = () => {
  return (
    <div className="flex items-center">
      <img
        src="/img.png"
        alt="泰坦ＴＶ"
        className="w-8 h-8 mr-2"
      />
      <span className="text-xl font-bold freeok-logo">泰坦ＴＶ</span>
    </div>
  );
};

export default Logo;
