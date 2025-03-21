import { useEffect } from 'react';

interface VideoProtectionProps {
  children: React.ReactNode;
}

const VideoProtection: React.FC<VideoProtectionProps> = ({ children }) => {
  useEffect(() => {
    // Disable right-click
    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
      return false;
    };

    // Disable keyboard shortcuts
    const handleKeyDown = (e: KeyboardEvent) => {
      // Prevent Ctrl+S, Ctrl+U, F12, etc.
      if (
        (e.ctrlKey && (e.key === 's' || e.key === 'S' || e.key === 'u' || e.key === 'U')) ||
        e.key === 'F12'
      ) {
        e.preventDefault();
        return false;
      }
    };

    // Disable drag for images and videos
    const handleDragStart = (e: DragEvent) => {
      const target = e.target as HTMLElement;
      if (target.tagName === 'IMG' || target.tagName === 'VIDEO') {
        e.preventDefault();
      }
    };

    // Add event listeners
    document.addEventListener('contextmenu', handleContextMenu);
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('dragstart', handleDragStart);

    // Clean up event listeners
    return () => {
      document.removeEventListener('contextmenu', handleContextMenu);
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('dragstart', handleDragStart);
    };
  }, []);

  return <>{children}</>;
};

// Custom Video component with download protection
interface SecureVideoProps {
  src: string;
  width?: string | number;
  height?: string | number;
  controls?: boolean;
  autoPlay?: boolean;
  muted?: boolean;
}

const SecureVideo: React.FC<SecureVideoProps> = ({
  src,
  width = '100%',
  height = 'auto',
  controls = true,
  autoPlay = false,
  muted = false,
}) => {
  return (
    <video
      src={src}
      width={width}
      height={height}
      controls={controls}
      autoPlay={autoPlay}
      muted={muted}
      controlsList="nodownload"
      disablePictureInPicture
      onContextMenu={(e) => e.preventDefault()}
      style={{ pointerEvents: 'auto' }}
    />
  );
};

export { VideoProtection, SecureVideo };