import React from 'react';
import { Play } from 'lucide-react';

interface VideoPlayerProps {
  url: string;
  title?: string;
  className?: string;
}

export function VideoPlayer({ url, title, className = "" }: VideoPlayerProps) {
  const getEmbedUrl = (url: string) => {
    if (url.includes('youtube.com/watch?v=')) {
      const videoId = url.split('v=')[1]?.split('&')[0];
      return `https://www.youtube.com/embed/${videoId}`;
    }
    if (url.includes('youtu.be/')) {
      const videoId = url.split('youtu.be/')[1]?.split('?')[0];
      return `https://www.youtube.com/embed/${videoId}`;
    }
    return url;
  };

  return (
    <div className={`relative bg-gray-900 rounded-lg overflow-hidden ${className}`}>
      <div className="aspect-video">
        <iframe
          src={getEmbedUrl(url)}
          title={title || 'Video'}
          className="w-full h-full"
          allowFullScreen
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        />
      </div>
      {title && (
        <div className="p-3 bg-gray-800 text-white">
          <div className="flex items-center gap-2">
            <Play className="w-4 h-4" />
            <span className="text-sm font-medium">{title}</span>
          </div>
        </div>
      )}
    </div>
  );
}