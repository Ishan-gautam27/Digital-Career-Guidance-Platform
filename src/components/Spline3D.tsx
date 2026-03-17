import React, { useEffect, useRef } from 'react';

interface Spline3DProps {
  url?: string;
  className?: string;
  style?: React.CSSProperties;
}

export function Spline3D({ 
  url = "https://prod.spline.design/pRgYRfe4Shmknq-s/scene.splinecode",
  className = "",
  style = {}
}: Spline3DProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const scriptLoadedRef = useRef<boolean>(false);

  useEffect(() => {
    const loadSplineScript = () => {
      return new Promise<void>((resolve, reject) => {
        // Check if script is already loaded
        if (scriptLoadedRef.current || document.querySelector('script[src*="spline-viewer"]')) {
          resolve();
          return;
        }

        const script = document.createElement('script');
        script.type = 'module';
        script.src = 'https://unpkg.com/@splinetool/viewer@1.10.77/build/spline-viewer.js';
        script.onload = () => {
          scriptLoadedRef.current = true;
          resolve();
        };
        script.onerror = () => reject(new Error('Failed to load Spline script'));
        
        document.head.appendChild(script);
      });
    };

    const initializeSpline = async () => {
      try {
        await loadSplineScript();
        
        if (containerRef.current) {
          // Clear any existing content
          containerRef.current.innerHTML = '';
          
          // Create spline-viewer element
          const splineViewer = document.createElement('spline-viewer');
          splineViewer.setAttribute('url', url);
          splineViewer.style.width = '100%';
          splineViewer.style.height = '100%';
          splineViewer.style.border = 'none';
          
          containerRef.current.appendChild(splineViewer);
        }
      } catch (error) {
        console.error('Failed to initialize Spline:', error);
        // Fallback: show a placeholder
        if (containerRef.current) {
          containerRef.current.innerHTML = `
            <div style="
              width: 100%; 
              height: 100%; 
              display: flex; 
              align-items: center; 
              justify-content: center; 
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              color: white;
              font-size: 18px;
              text-align: center;
              border-radius: 10px;
            ">
              <div>
                <div style="font-size: 24px; margin-bottom: 8px;">🚀</div>
                <div>3D Experience Loading...</div>
              </div>
            </div>
          `;
        }
      }
    };

    initializeSpline();

    // Cleanup function
    return () => {
      if (containerRef.current) {
        containerRef.current.innerHTML = '';
      }
    };
  }, [url]);

  const defaultStyle = {
    width: '100%',
    height: '400px',
    overflow: 'hidden',
    ...style
  };

  return (
    <div 
      ref={containerRef}
      className={`spline-container ${className}`}
      style={defaultStyle}
    />
  );
}