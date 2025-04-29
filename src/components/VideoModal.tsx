
import React, { useEffect, useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription
} from '@/components/ui/dialog';
import { X } from 'lucide-react';

interface VideoModalProps {
  isOpen: boolean;
  onClose: () => void;
  videoUrl?: string;
  videoType?: 'youtube' | 'mp4' | 'webm' | 'ogg' | 'external';
  title?: string;
  description?: string;
}

const VideoModal = ({ 
  isOpen, 
  onClose, 
  videoUrl = "https://www.youtube.com/embed/dQw4w9WgXcQ",
  videoType = 'youtube',
  title = "How Corporify It Works",
  description = "See how Corporify It transforms your casual communication into professional messages in seconds."
}: VideoModalProps) => {
  const [processedUrl, setProcessedUrl] = useState<string>(videoUrl);
  
  useEffect(() => {
    if (videoUrl) {
      // Handle direct dl.dropboxusercontent.com links
      if (videoUrl.includes('dl.dropboxusercontent.com')) {
        // Always ensure raw=1 parameter is present for Dropbox links
        const urlWithRaw = videoUrl.includes('raw=1') ? 
          videoUrl : 
          `${videoUrl}${videoUrl.includes('?') ? '&' : '?'}raw=1`;
        console.log("Processed Dropbox URL:", urlWithRaw);
        setProcessedUrl(urlWithRaw);
      } 
      // Handle normal www.dropbox.com links
      else if (videoUrl.includes('www.dropbox.com')) {
        // Replace www.dropbox.com with dl.dropboxusercontent.com and add raw=1
        const directUrl = videoUrl.replace('www.dropbox.com', 'dl.dropboxusercontent.com')
                                  .replace('?dl=0', '?raw=1')
                                  .replace('&dl=0', '&raw=1');
        console.log("Converted Dropbox URL:", directUrl);
        setProcessedUrl(directUrl);
      } 
      // Handle any other video URL
      else {
        setProcessedUrl(videoUrl);
      }
    }
  }, [videoUrl]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-4xl p-0 overflow-hidden">
        <DialogHeader className="p-4 flex flex-row items-center justify-between">
          <DialogTitle>{title}</DialogTitle>
          <button 
            onClick={onClose}
            className="rounded-full p-1 hover:bg-gray-200 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </DialogHeader>
        
        <div className="aspect-video w-full bg-black">
          {processedUrl && videoType === 'youtube' && (
            <iframe 
              src={processedUrl}
              className="w-full h-full"
              title="Product Demo Video"
              frameBorder="0"
              allowFullScreen
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            ></iframe>
          )}
          {processedUrl && (videoType === 'mp4' || videoType === 'webm' || videoType === 'ogg' || videoType === 'external') && (
            <video
              className="w-full h-full"
              title="Product Demo Video"
              controls
              autoPlay={false}
              playsInline
              preload="auto"
              onError={(e) => console.error("Video error:", e)}
            >
              <source 
                src={processedUrl} 
                type={videoType === 'external' ? 'video/mp4' : `video/${videoType}`} 
              />
              Your browser does not support the video tag.
            </video>
          )}
        </div>
        
        <DialogDescription className="p-4 text-center">
          {description}
        </DialogDescription>
      </DialogContent>
    </Dialog>
  );
};

export default VideoModal;
