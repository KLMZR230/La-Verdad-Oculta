'use client';

import { useEffect, useRef } from 'react';

export default function HeroVideo() {
    const videoRef = useRef<HTMLVideoElement>(null);

    useEffect(() => {
        const video = videoRef.current;
        if (!video) return;

        // Force play on mount - this is needed for mobile browsers
        const playVideo = async () => {
            try {
                // Reset video to beginning
                video.currentTime = 0;

                // Ensure muted (required for autoplay on mobile)
                video.muted = true;

                // Try to play immediately
                await video.play();
            } catch (error) {
                console.log('Autoplay failed, trying again:', error);

                // If first attempt fails, try again after a short delay
                setTimeout(async () => {
                    try {
                        video.muted = true;
                        await video.play();
                    } catch (e) {
                        console.log('Second autoplay attempt failed:', e);
                    }
                }, 100);
            }
        };

        // Play when metadata is loaded
        video.addEventListener('loadedmetadata', playVideo);

        // Also try to play immediately
        playVideo();

        // Handle visibility change (when tab becomes active again)
        const handleVisibilityChange = () => {
            if (document.visibilityState === 'visible' && video.paused) {
                video.play().catch(() => { });
            }
        };

        document.addEventListener('visibilitychange', handleVisibilityChange);

        return () => {
            video.removeEventListener('loadedmetadata', playVideo);
            document.removeEventListener('visibilitychange', handleVisibilityChange);
        };
    }, []);

    return (
        <video
            ref={videoRef}
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            className="absolute inset-0 h-full w-full object-cover z-0"
            style={{
                // Hide default controls/play button
                WebkitAppearance: 'none',
            }}
            // Additional attributes for mobile autoplay
            disablePictureInPicture
            disableRemotePlayback
        >
            <source
                src="https://pub-0c024c9a5a7a439aa0319b5140a52857.r2.dev/compressed_Static_camera_shot_202601201549_c7syl.mp4"
                type="video/mp4"
            />
        </video>
    );
}
