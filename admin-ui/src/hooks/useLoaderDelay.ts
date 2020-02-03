import { useEffect, useState } from 'react';

export const useLoaderDelay = (predicate: boolean): boolean => {
  const [showLoader, setShowLoader] = useState(false);

  useEffect(() => {
    const loaderTimer = predicate
      ? setTimeout(() => {
          setShowLoader(true);
        }, 2000)
      : undefined;

    return () => {
      loaderTimer && clearTimeout(loaderTimer);
    };
  }, [predicate]);

  return showLoader;
};
