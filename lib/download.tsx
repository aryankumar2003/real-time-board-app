// utils/download.ts
import { RefObject, ReactNode } from 'react';

interface DownloadButtonProps {
  svgRef: RefObject<SVGSVGElement | null>;
  fileName?: string;
  format?: 'svg' | 'png' | 'json';
  className?: string;
  children?: ReactNode;
}

const downloadFile = (blob: Blob, fileName: string) => {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

const downloadUtils = {
  svg: (svg: SVGSVGElement, fileName: string) => {
    try {
      // Clone the SVG and its styles
      const clone = svg.cloneNode(true) as SVGSVGElement;
      
      // Add computed styles
      const computedStyle = window.getComputedStyle(svg);
      clone.style.backgroundColor = computedStyle.backgroundColor;
      
      // Add CSS variables
      const styles = document.createElement('style');
      styles.textContent = `
        :root {
          --color-border: ${getComputedStyle(document.documentElement).getPropertyValue('--color-border')};
          --background: ${getComputedStyle(document.documentElement).getPropertyValue('--background')};
        }
      `;
      clone.insertBefore(styles, clone.firstChild);

      // Ensure viewBox is set
      if (!clone.getAttribute('viewBox')) {
        const bounds = svg.getBoundingClientRect();
        clone.setAttribute('viewBox', `0 0 ${bounds.width} ${bounds.height}`);
      }

      // Convert to string with XML declaration
      const serializer = new XMLSerializer();
      const svgString = '<?xml version="1.0" encoding="UTF-8" standalone="no"?>\n' +
        serializer.serializeToString(clone);
      
      const blob = new Blob([svgString], { type: 'image/svg+xml' });
      downloadFile(blob, `${fileName}.svg`);
    } catch (error) {
      console.error('Error downloading SVG:', error);
    }
  },

  png: async (svg: SVGSVGElement, fileName: string) => {
    try {
      // Get dimensions
      const bounds = svg.getBoundingClientRect();
      const width = bounds.width;
      const height = bounds.height;

      // Create canvas
      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');

      if (!ctx) {
        throw new Error('Canvas context not available');
      }

      // Clone SVG and add necessary styles
      const clone = svg.cloneNode(true) as SVGSVGElement;
      const computedStyle = window.getComputedStyle(svg);
      
      // Add CSS variables and background
      const styles = document.createElement('style');
      styles.textContent = `
        :root {
          --color-border: ${getComputedStyle(document.documentElement).getPropertyValue('--color-border')};
          --background: ${getComputedStyle(document.documentElement).getPropertyValue('--background')};
        }
      `;
      clone.insertBefore(styles, clone.firstChild);
      
      // Ensure viewBox is set
      if (!clone.getAttribute('viewBox')) {
        clone.setAttribute('viewBox', `0 0 ${width} ${height}`);
      }

      // Convert SVG to data URL
      const serializer = new XMLSerializer();
      const svgString = '<?xml version="1.0" encoding="UTF-8" standalone="no"?>\n' +
        serializer.serializeToString(clone);
      
      // Create a Blob from the SVG string
      const svgBlob = new Blob([svgString], { type: 'image/svg+xml' });
      const url = URL.createObjectURL(svgBlob);

      // Create image and draw to canvas
      const img = new Image();
      await new Promise((resolve, reject) => {
        img.onload = resolve;
        img.onerror = reject;
        img.src = url;
      });

      // Draw background first
      ctx.fillStyle = computedStyle.backgroundColor;
      ctx.fillRect(0, 0, width, height);
      
      // Draw SVG
      ctx.drawImage(img, 0, 0);

      // Convert to PNG and download
      canvas.toBlob((blob) => {
        if (blob) {
          downloadFile(blob, `${fileName}.png`);
        }
      }, 'image/png');

      // Cleanup
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading PNG:', error);
    }
  },

  json: (svg: SVGSVGElement, fileName: string) => {
    try {
      const data = {
        width: svg.clientWidth,
        height: svg.clientHeight,
        viewBox: svg.getAttribute('viewBox'),
        content: svg.innerHTML,
        style: svg.getAttribute('style'),
        class: svg.getAttribute('class'),
        computedStyle: window.getComputedStyle(svg),
        cssVariables: {
          colorBorder: getComputedStyle(document.documentElement).getPropertyValue('--color-border'),
          background: getComputedStyle(document.documentElement).getPropertyValue('--background'),
        }
      };

      const jsonString = JSON.stringify(data, null, 2);
      const blob = new Blob([jsonString], { type: 'application/json' });
      downloadFile(blob, `${fileName}.json`);
    } catch (error) {
      console.error('Error downloading JSON:', error);
    }
  }
};

// Rest of the DownloadButton component remains the same
export const DownloadButton = ({
  svgRef,
  fileName = 'canvas',
  format = 'svg',
  className,
  children,
}: DownloadButtonProps) => {
  const handleDownload = async () => {
    const svg = svgRef.current;
    if (!svg) return;

    switch (format) {
      case 'svg':
        downloadUtils.svg(svg, fileName);
        break;
      case 'png':
        await downloadUtils.png(svg, fileName);
        break;
      case 'json':
        downloadUtils.json(svg, fileName);
        break;
    }
  };

  return (
    <button
      onClick={handleDownload}
      className={className}
      type="button"
    >
      {children || `Download ${format.toUpperCase()}`}
    </button>
  );
};

export const download = downloadUtils;