'use client';

export function MagicGlow({ isActive }: { isActive: boolean }) {
  if (!isActive) return null;

  return (
    <>
      <style jsx>{`
        @keyframes magicPulse {
          0% {
            opacity: 0;
            background-size: 0% 0%;
          }
          20% {
            opacity: 0.8;
            background-size: 50% 50%;
          }
          50% {
            opacity: 0.6;
            background-size: 150% 150%;
          }
          100% {
            opacity: 0;
            background-size: 300% 300%;
          }
        }

        @keyframes shimmer {
          0%, 100% {
            opacity: 0.2;
          }
          50% {
            opacity: 0.8;
          }
        }

        @keyframes colorShift {
          0% {
            filter: hue-rotate(0deg);
          }
          33% {
            filter: hue-rotate(20deg);
          }
          66% {
            filter: hue-rotate(-20deg);
          }
          100% {
            filter: hue-rotate(0deg);
          }
        }

        @keyframes grain {
          0%, 100% { transform: translate(0, 0); }
          10% { transform: translate(-2%, -2%); }
          20% { transform: translate(2%, 2%); }
          30% { transform: translate(-2%, 2%); }
          40% { transform: translate(2%, -2%); }
          50% { transform: translate(-1%, 1%); }
          60% { transform: translate(1%, -1%); }
          70% { transform: translate(-1%, -1%); }
          80% { transform: translate(1%, 1%); }
          90% { transform: translate(-1%, -2%); }
        }

        .magic-glow-container {
          position: fixed;
          inset: 0;
          pointer-events: none;
          z-index: 999999;
          animation: colorShift 3s ease-in-out forwards;
        }

        .magic-radial-glow {
          position: absolute;
          inset: 0;
          background: radial-gradient(
            circle at 0% 100%,
            rgba(59, 130, 246, 0.7) 0%,
            rgba(147, 51, 234, 0.6) 15%,
            rgba(236, 72, 153, 0.5) 30%,
            rgba(59, 130, 246, 0.4) 45%,
            transparent 60%
          );
          background-position: 0% 100%;
          background-repeat: no-repeat;
          background-size: 0% 0%;
          animation: magicPulse 3s cubic-bezier(0.22, 1, 0.36, 1) forwards;
        }

        .magic-grain {
          position: absolute;
          inset: 0;
          background-image: 
            radial-gradient(circle at 0% 100%, rgba(59, 130, 246, 0.4) 0%, transparent 40%),
            radial-gradient(circle at 5% 95%, rgba(147, 51, 234, 0.4) 0%, transparent 40%),
            radial-gradient(circle at 10% 90%, rgba(236, 72, 153, 0.4) 0%, transparent 40%),
            radial-gradient(circle at 3% 97%, rgba(59, 130, 246, 0.3) 0%, transparent 40%);
          background-position: 0% 100%;
          background-repeat: no-repeat;
          background-size: 0% 0%;
          filter: blur(40px);
          animation: magicPulse 3s cubic-bezier(0.22, 1, 0.36, 1) forwards, shimmer 2s ease-in-out;
        }

        .magic-border-glow {
          position: absolute;
          inset: 0;
          box-shadow: 
            inset 0 0 80px rgba(59, 130, 246, 0.5),
            inset 0 0 40px rgba(147, 51, 234, 0.4),
            inset 0 0 20px rgba(236, 72, 153, 0.3);
          animation: magicPulse 3s ease-out forwards;
        }

        .magic-particles {
          position: absolute;
          inset: 0;
          background: 
            radial-gradient(2px 2px at 20% 30%, white, transparent),
            radial-gradient(2px 2px at 60% 70%, white, transparent),
            radial-gradient(2px 2px at 80% 10%, white, transparent),
            radial-gradient(1px 1px at 40% 60%, white, transparent),
            radial-gradient(1px 1px at 90% 90%, white, transparent),
            radial-gradient(2px 2px at 10% 80%, white, transparent),
            radial-gradient(1px 1px at 70% 40%, white, transparent);
          background-size: 200% 200%;
          animation: shimmer 2s ease-in-out;
        }
      `}</style>
      
      <div className="magic-glow-container">
        <div className="magic-radial-glow" />
        <div className="magic-grain" />
        <div className="magic-border-glow" />
        <div className="magic-particles" />
      </div>
    </>
  );
}

