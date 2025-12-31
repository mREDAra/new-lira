import React from 'react';

const PatternBackground: React.FC = () => {
  return (
    <div className="fixed inset-0 z-0 pointer-events-none opacity-[0.03]" aria-hidden="true">
      <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="islamic-pattern" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M20 0L40 20L20 40L0 20Z" fill="none" stroke="#1B4D3E" strokeWidth="1"/>
            <circle cx="20" cy="20" r="5" fill="none" stroke="#1B4D3E" strokeWidth="1"/>
            <path d="M0 0L10 10M30 30L40 40M40 0L30 10M10 30L0 40" stroke="#1B4D3E" strokeWidth="1"/>
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#islamic-pattern)" />
      </svg>
    </div>
  );
};

export default PatternBackground;