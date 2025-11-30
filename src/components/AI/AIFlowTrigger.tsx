'use client';

import { useEffect, useState } from 'react';
import { AgentNotification } from './AgentNotification';
import { MagicGlow } from './MagicGlow';

export function AIFlowTrigger() {
  const [showGlow, setShowGlow] = useState(false);
  const [showAgent, setShowAgent] = useState(false);
  const [triggerCount, setTriggerCount] = useState(0);

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === 'g' || e.key === 'G') {
        setTriggerCount(prev => prev + 1);
        setShowGlow(true);
        setShowAgent(true);
        
        // Hide glow after 3 seconds
        const glowTimer = setTimeout(() => {
          setShowGlow(false);
        }, 3000);
        
        return () => clearTimeout(glowTimer);
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, []);

  return (
    <>
      {showGlow && <MagicGlow isActive={showGlow} key={`glow-${triggerCount}`} />}
      <AgentNotification isActive={showAgent} key={`agent-${triggerCount}`} />
    </>
  );
}

