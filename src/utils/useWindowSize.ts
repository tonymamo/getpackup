import { screenSizes } from '@styles/size';
import { useEffect, useState } from 'react';

const useWindowSize = () => {
  const isClient = typeof window === 'object';

  const getSize = () => {
    const width = isClient ? window.innerWidth : undefined;

    return {
      width,
      height: isClient ? window.innerHeight : undefined,
      isExtraSmallScreen: isClient ? width && width < screenSizes.small : false,
      isSmallScreen: isClient ? width && width < screenSizes.medium : false,
      isLargeScreen: isClient ? width && width > screenSizes.large : false,
    };
  };

  const [windowSize, setWindowSize] = useState(getSize);

  useEffect(() => {
    if (!isClient) {
      return undefined;
    }

    const handleResize = () => {
      setWindowSize(getSize());
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []); // Empty array ensures that effect is only run on mount and unmount

  return windowSize;
};

export default useWindowSize;
