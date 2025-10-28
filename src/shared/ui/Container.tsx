import React from 'react';

interface ContainerProps {
  children: React.ReactNode;
  className?: string;
  as?: keyof JSX.IntrinsicElements;
}

export function Container({ children, className = '', as: Component = 'div' }: ContainerProps) {
  return (
    <Component className={`container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl ${className}`}>
      {children}
    </Component>
  );
}
