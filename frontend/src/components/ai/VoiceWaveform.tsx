import React from 'react';

interface VoiceWaveformProps {
  isActive: boolean;
  isSpeaking: boolean;
  color?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const VoiceWaveform: React.FC<VoiceWaveformProps> = ({
  isActive,
  isSpeaking,
  color = 'amber',
  size = 'md',
}) => {
  const heights = [35, 65, 95, 45, 80, 100, 70, 50, 85, 40, 60, 90, 45, 75, 30];

  const barCount = size === 'sm' ? 7 : size === 'lg' ? 15 : 11;
  const activeBars = heights.slice(0, barCount);

  return (
    <div className="flex items-center justify-center gap-1 h-8 px-2">
      {activeBars.map((baseHeight, idx) => {
        const animationDelay = `${(idx * 0.1).toFixed(2)}s`;
        const animationDuration = isSpeaking ? '0.6s' : isActive ? '0.9s' : '2s';

        return (
          <span
            key={idx}
            className={`inline-block rounded-full transition-all ${
              color === 'red'
                ? 'bg-red-500 shadow-sm shadow-red-500/50'
                : color === 'emerald'
                ? 'bg-emerald-400 shadow-sm shadow-emerald-400/50'
                : 'bg-gradient-to-t from-amber-500 via-rose-500 to-amber-300 shadow-sm shadow-amber-500/50'
            }`}
            style={{
              width: size === 'sm' ? '2.5px' : '3.5px',
              height: isActive || isSpeaking ? `${baseHeight}%` : '20%',
              minHeight: '4px',
              animation:
                isActive || isSpeaking
                  ? `pulseBar ${animationDuration} ease-in-out infinite alternate`
                  : 'none',
              animationDelay,
            }}
          />
        );
      })}

      <style>{`
        @keyframes pulseBar {
          0% {
            transform: scaleY(0.25);
            opacity: 0.5;
          }
          50% {
            transform: scaleY(1);
            opacity: 1;
          }
          100% {
            transform: scaleY(0.4);
            opacity: 0.7;
          }
        }
      `}</style>
    </div>
  );
};

export default VoiceWaveform;
