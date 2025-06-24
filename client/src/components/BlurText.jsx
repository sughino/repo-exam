import { useRef, useEffect, useState } from 'react';
import { motion, easeOut, cubicBezier } from 'framer-motion';

export const BlurText = ({
  text = '',
  delay = 150,
  className = '',
  animateBy = 'words',
  direction = 'top',
  threshold = 0.1,
  rootMargin = '0px',
  animationFrom,
  animationTo,
  easing = 'easeOutCubic',
  onAnimationComplete,
  initialDelay = 0,
}) => {
  const elements = animateBy === 'words' ? text.split(' ') : text.split('');
  const [inView, setInView] = useState(false);
  const [shouldAnimate, setShouldAnimate] = useState(false);
  const ref = useRef();

  const defaultFrom =
    direction === 'top'
      ? { filter: 'blur(10px)', opacity: 0, y: -50 }
      : { filter: 'blur(10px)', opacity: 0, y: 50 };

  const defaultTo = [
    {
      filter: 'blur(5px)',
      opacity: 0.5,
      y: direction === 'top' ? 5 : -5,
    },
    { filter: 'blur(0px)', opacity: 1, y: 0 },
  ];

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.unobserve(ref.current);
        }
      },
      { threshold, rootMargin }
    );

    observer.observe(ref.current);

    return () => observer.disconnect();
  }, [threshold, rootMargin]);

  useEffect(() => {
    if (inView) {
      const timer = setTimeout(() => {
        setShouldAnimate(true);
      }, initialDelay);

      return () => clearTimeout(timer);
    }
  }, [inView, initialDelay]);

  // Convert easing string to framer-motion easing function
  const getEasingFunction = (easingType) => {
    switch (easingType) {
      case 'easeOutCubic':
        return cubicBezier(0.33, 1, 0.68, 1);
      case 'easeInCubic':
        return cubicBezier(0.32, 0, 0.67, 0);
      case 'easeInOutCubic':
        return cubicBezier(0.65, 0, 0.35, 1);
      default:
        return easeOut;
    }
  };

  const handleAnimationComplete = (index) => {
    if (index === elements.length - 1 && onAnimationComplete) {
      onAnimationComplete();
    }
  };

  return (
    <p ref={ref} className={`blur-text ${className}`}>
      {elements.map((element, index) => (
        <motion.span
          key={index}
          initial={animationFrom || defaultFrom}
          animate={
            inView && shouldAnimate
              ? animationTo
                ? animationTo[animationTo.length - 1]
                : defaultTo[defaultTo.length - 1]
              : animationFrom || defaultFrom
          }
          transition={{
            delay: initialDelay / 1000 + (index * delay) / 1000,
            duration: 0.5,
            ease: getEasingFunction(easing),
          }}
          style={{
            display: 'inline-block',
            willChange: 'transform, filter, opacity',
          }}
          onAnimationComplete={() => handleAnimationComplete(index)}
        >
          {element === ' ' ? '\u00A0' : element}
          {animateBy === 'words' && index < elements.length - 1 && '\u00A0'}
        </motion.span>
      ))}
    </p>
  );
};

export default BlurText;