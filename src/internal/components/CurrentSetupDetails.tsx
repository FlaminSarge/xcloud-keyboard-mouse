import React from 'react';
interface CurrentSetupDetailsProps {
  gameName: string | null;
  activeConfig: string | null;
}

export default function CurrentSetupDetails({ gameName, activeConfig }: CurrentSetupDetailsProps) {
  const plus = <span style={{ padding: '0 5px', fontWeight: 'bold' }}>+</span>;
  return (
    <header className="box horizontal green-bg space-between setup-details">
      <div className="logo unselectable horizontal centered-v">
        <img src="/images/xbox-logo.svg" />
        {plus}
        <img src="/images/keyboard.svg" />
        {plus}
        <img src="/images/mouse.svg" />
      </div>
      <div>
        <div>
          <small>Playing:</small> {gameName || 'None'}
        </div>
        <div>
          <small>Preset:</small> {activeConfig || 'None'}
        </div>
      </div>
    </header>
  );
}
