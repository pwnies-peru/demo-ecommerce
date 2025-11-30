'use client';

import { useEffect, useState } from 'react';

export function AgentNotification({ isActive }: { isActive: boolean }) {
  const [stage, setStage] = useState<'hidden' | 'circle' | 'expanded'>('hidden');

  useEffect(() => {
    if (isActive) {
      setStage('circle');
      const timer1 = setTimeout(() => setStage('expanded'), 500);
      const timer2 = setTimeout(() => setStage('hidden'), 5000);
      return () => {
        clearTimeout(timer1);
        clearTimeout(timer2);
      };
    }
  }, [isActive]);

  if (stage === 'hidden') return null;

  return (
    <>
      <style jsx>{`
        @keyframes circleAppear {
          from {
            opacity: 0;
            transform: scale(0.5);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        @keyframes textExpand {
          from {
            max-width: 0;
            padding-left: 0;
            padding-right: 0;
            opacity: 0;
          }
          to {
            max-width: 280px;
            padding-left: 20px;
            padding-right: 20px;
            opacity: 1;
          }
        }

        @keyframes pulse {
          0%, 100% {
            box-shadow: 0 0 20px rgba(59, 130, 246, 0.5);
          }
          50% {
            box-shadow: 0 0 40px rgba(59, 130, 246, 0.8);
          }
        }

        .agent-container {
          position: fixed;
          bottom: 0;
          left: 0;
          z-index: 9999999;
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 24px;
        }

        .agent-circle {
          width: 80px;
          height: 80px;
          border-radius: 50%;
          background: linear-gradient(135deg, #3b82f6, #8b5cf6);
          display: flex;
          align-items: center;
          justify-content: center;
          animation: circleAppear 0.5s ease-out, pulse 2s ease-in-out infinite;
          box-shadow: 0 6px 30px rgba(59, 130, 246, 0.6);
          flex-shrink: 0;
        }

        .agent-icon {
          width: 40px;
          height: 40px;
          color: white;
        }

        .agent-message {
          background: white;
          padding-top: 16px;
          padding-bottom: 16px;
          padding-left: 0;
          padding-right: 0;
          border-radius: 12px;
          box-shadow: 0 4px 24px rgba(0, 0, 0, 0.15);
          animation: textExpand 0.5s ease-out forwards;
          overflow: hidden;
          white-space: nowrap;
          max-width: 0;
        }

        .agent-message-text {
          font-weight: 600;
          font-size: 15px;
          color: #1f2937;
          background: linear-gradient(135deg, #3b82f6, #8b5cf6);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
      `}</style>

      <div className="agent-container">
        <div className="agent-circle">
          <svg className="agent-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 2L2 7l10 5 10-5-10-5z" />
            <path d="M2 17l10 5 10-5" />
            <path d="M2 12l10 5 10-5" />
          </svg>
        </div>
        
        {stage === 'expanded' && (
          <div className="agent-message">
            <div className="agent-message-text">
              🎁 You got a new offer!
            </div>
          </div>
        )}
      </div>
    </>
  );
}

