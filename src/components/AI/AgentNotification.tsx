'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';

const messages = [
  '¡Nueva oferta disponible! 🎉',
  '¡Descuento especial para ti! ✨',
  '¡Oferta exclusiva activada! 🔥',
  '¡Promoción limitada! 💫',
];

interface AgentNotificationProps {
  isActive: boolean;
  onOpenNegotiation: () => void;
  hideIcon?: boolean;
}

export function AgentNotification({ isActive, onOpenNegotiation, hideIcon }: AgentNotificationProps) {
  const [showIcon, setShowIcon] = useState(false);
  const [showText, setShowText] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (isActive) {
      console.log('AgentNotification activated!');
      // Pick random message
      setMessage(messages[Math.floor(Math.random() * messages.length)]);
      setShowIcon(true);

      const timer1 = setTimeout(() => setShowText(true), 500);
      const timer2 = setTimeout(() => setShowText(false), 5000);

      return () => {
        clearTimeout(timer1);
        clearTimeout(timer2);
      };
    }
  }, [isActive]);

  console.log('AgentNotification render - showIcon:', showIcon, 'hideIcon:', hideIcon);

  if (!showIcon || hideIcon) return null;

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
          z-index: 999999;
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 24px;
          pointer-events: auto;
        }

        .agent-circle {
          width: 120px;
          height: 120px;
          border-radius: 3px;
          background: white;
          display: flex;
          align-items: center;
          justify-content: center;
          animation: circleAppear 0.5s ease-out, pulse 2s ease-in-out infinite;
          box-shadow: 0 6px 30px rgba(59, 130, 246, 0.6);
          flex-shrink: 0;
          overflow: hidden;
          cursor: pointer;
          transition: transform 0.2s;
        }

        .agent-circle:hover {
          transform: scale(1.05);
        }

        .agent-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .agent-message {
          background: white;
          padding-top: 16px;
          padding-bottom: 16px;
          padding-left: 0;
          padding-right: 0;
          border-radius: 4px;
          box-shadow: 0 4px 24px rgba(0, 0, 0, 0.15);
          animation: textExpand 0.5s ease-out forwards;
          overflow: hidden;
          white-space: nowrap;
          max-width: 0;
        }

        .agent-message-text {
          font-weight: 600;
          font-size: 15px;
          color: #000;
          background: linear-gradient(135deg, #000, #000);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
      `}</style>

      <div className="agent-container">
        <div
          className="agent-circle"
          onClick={onOpenNegotiation}
          role="button"
          tabIndex={0}
        >
          <Image
            src="/images/blink.png"
            alt="Agent"
            width={120}
            height={120}
            className="agent-image"
          />
        </div>

        {showText && (
          <div className="agent-message">
            <div className="agent-message-text">
              {message}
            </div>
          </div>
        )}
      </div>
    </>
  );
}

