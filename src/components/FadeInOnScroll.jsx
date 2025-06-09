import React from 'react';
import { useInView } from 'react-intersection-observer';

const FadeInOnScroll = ({ children }) => {
  const { ref, inView } = useInView({
    triggerOnce: true, // animate only once
    threshold: 0.13,     // fire when 10% of the element is visible
  });

  return (
    <div
      ref={ref}
      className={`transition-opacity duration-700 ${
        inView ? 'fade-in' : 'opacity-0'
      }`}
    >
      {children}
    </div>
  );
};

export default FadeInOnScroll;
