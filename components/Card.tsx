import React from 'react';//react project

interface CardProps {
  title?: string;
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  noPadding?: boolean;
}//hi

const Card: React.FC<CardProps> = ({ title, children, className = '', onClick, noPadding = false }) => {
  return (
    <div 
      className={`bg-white shadow-xl rounded-2xl overflow-hidden border border-green-100 hover:shadow-2xl transition-shadow duration-300 ${onClick ? 'cursor-pointer' : ''} ${className}`}
      onClick={onClick}
    >
      {title && (
        <div className="bg-gradient-to-r from-green-600 via-lime-500 to-green-400 text-white p-4 rounded-t-2xl">
          <h3 className="text-lg font-semibold drop-shadow-lg">{title}</h3>
        </div>
      )}
      <div className={noPadding ? '' : 'p-5'}>
        {children}
      </div>
    </div>
  );
};

export default Card;
