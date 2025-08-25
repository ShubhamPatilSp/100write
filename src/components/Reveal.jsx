'use client';

import React from 'react';
import { motion } from 'framer-motion';

export default function Reveal({ children, className = '', as: Tag = 'div', delay = 0 }) {
  const MotionTag = motion[Tag];

  const variants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <MotionTag
      className={className}
      variants={variants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.6, delay }}
    >
      {children}
    </MotionTag>
  );
}