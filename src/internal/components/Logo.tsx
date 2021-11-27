import React from 'react';

interface LogoProps {
  isEnabled: boolean;
}

export default function Logo({ isEnabled }: LogoProps) {
  const opacity = { opacity: isEnabled ? 1 : 0.5 };
  const imgStyle = {
    width: 20,
    height: 20,
  };
  const plus = <span style={{ padding: '0 5px', paddingBottom: 4, fontWeight: 'bold', ...opacity }}>+</span>;
  return (
    <div className="logo unselectable horizontal centered-v">
      <img src="/images/xbox-logo.svg" style={imgStyle} />
      {plus}
      <img src="/images/keyboard.svg" style={{ ...imgStyle, ...opacity }} className="margin-right-s" />
      <img src="/images/mouse.svg" style={{ ...imgStyle, ...opacity }} />
    </div>
  );
}
