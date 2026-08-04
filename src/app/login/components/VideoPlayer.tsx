'use client';

import { useState, useRef, useEffect } from 'react';
import styles from './videoplayer.module.css';

const VIDEOS = [
  '/landing-page-video.mp4',
  '/video-2.mp4',
  '/video-3.mp4'
];

export default function VideoPlayer() {
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);

  const handleVideoEnded = () => {
    setCurrentVideoIndex((prev) => (prev + 1) % VIDEOS.length);
  };

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.load();
      videoRef.current.play().catch((err) => {
        console.warn("Autoplay transition was prevented:", err);
      });
    }
  }, [currentVideoIndex]);

  return (
    <div className={styles.container}>
      {/* Premium Desktop Monitor Frame */}
      <div className={styles.monitor}>
        <div className={styles.screen}>
          <video
            ref={videoRef}
            src={VIDEOS[currentVideoIndex]}
            className={styles.video}
            autoPlay
            muted
            playsInline
            onEnded={handleVideoEnded}
            controls={false}
          />
        </div>
      </div>
      {/* Monitor Base and Stand */}
      <div className={styles.monitorStand} />
      <div className={styles.monitorBase} />
    </div>
  );
}
