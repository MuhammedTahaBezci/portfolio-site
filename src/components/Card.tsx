// src/components/Card.tsx
'use client';

import React from 'react';

const Card = ({
  children,
  className = "",
}: React.PropsWithChildren<{ className?: string }>) => {
  return (
    <div className={`bg-white shadow-xl rounded-xl p-8 md:p-10 border border-neutral-100 ${className}`}>
      {children}
    </div>
  );
};

export default Card;