
import React from 'react';
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
  videoType?: 'youtube' | 'mp4';
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
          {videoUrl && videoType === 'youtube' && (
            <iframe 
              src={videoUrl}
              className="w-full h-full"
              title="Product Demo Video"
              frameBorder="0"
              allowFullScreen
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            ></iframe>
          )}
          {videoUrl && videoType === 'mp4' && (
            <video
              src={videoUrl}
              className="w-full h-full"
              title="Product Demo Video"
              controls
              autoPlay
              playsInline
            >
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
