import React from 'react';

const GlobalBackground = () => {
  return (
    <div className="background-video-container">
      <video
        autoPlay
        muted
        loop
        playsInline
        className="background-video"
      >
        <source src="/mixkit-fire-background-with-flames-moving-to-the-centre-3757-full-hd.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>
    </div>
  );
};

export default GlobalBackground;