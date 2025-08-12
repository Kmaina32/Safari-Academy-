
'use client';

import React from 'react';

interface VideoPlayerProps {
    videoUrl?: string;
}

export function VideoPlayer({ videoUrl }: VideoPlayerProps) {
    if (!videoUrl) {
        return (
            <div className="w-full h-full flex items-center justify-center bg-muted">
                <p className="text-muted-foreground">No video for this lesson.</p>
            </div>
        );
    }

    const getYouTubeVideoId = (url: string) => {
        let videoId = '';
        const youtubeRegex = /^(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
        const match = url.match(youtubeRegex);
        if (match && match[1]) {
            videoId = match[1];
        }
        return videoId;
    };

    const videoId = getYouTubeVideoId(videoUrl);

    if (!videoId) {
        return (
             <div className="w-full h-full flex items-center justify-center bg-muted">
                <p className="text-destructive-foreground bg-destructive p-2 rounded-md">Invalid YouTube URL.</p>
            </div>
        )
    }

    const embedUrl = `https://www.youtube.com/embed/${videoId}`;

    return (
        <iframe
            className="w-full h-full"
            src={embedUrl}
            title="YouTube video player"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
        ></iframe>
    );
}
