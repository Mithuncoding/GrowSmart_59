import React from 'react';

const PlantCareLogo: React.FC<{ size?: number | string }> = ({ size = 48 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 64 64"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    {/* Leaf shape */}
    <path
      d="M32 60C32 60 8 44 8 24C8 13.9543 16.9543 5 27 5C37.0457 5 46 13.9543 46 24C46 44 32 60 32 60Z"
      fill="#22c55e"
      stroke="#166534"
      strokeWidth="2"
      strokeLinejoin="round"
    />
    {/* Tech/AI accent: circuit lines */}
    <path
      d="M32 60V24"
      stroke="#166534"
      strokeWidth="2"
      strokeLinecap="round"
    />
    <circle cx="32" cy="24" r="2.5" fill="#166534" />
    <circle cx="27" cy="14" r="1.5" fill="#166534" />
    <circle cx="37" cy="14" r="1.5" fill="#166534" />
    <path d="M32 24L27 14" stroke="#166534" strokeWidth="1.5" strokeLinecap="round" />
    <path d="M32 24L37 14" stroke="#166534" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);//hi

export default PlantCareLogo; 
