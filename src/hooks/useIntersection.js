import { useState, useLayoutEffect } from 'react'
import { isMobile } from 'react-device-detect';

export const useIntersection = (element, rootMargin) => {
    const [isVisible, setState] = useState(false);

    useLayoutEffect(() => {
        if(!isMobile) return
        if(!element.current) return

        const observer = new IntersectionObserver(
            ([entry]) => {
               // if (entry.isIntersecting) {
               //     setState(entry.isIntersecting);
               //     observer.unobserve(element.current);
               // }
                setState(entry.isIntersecting);
            }, { rootMargin }
        );

        element.current && observer.observe(element?.current);

        return () => observer.unobserve(element?.current);
    }, []);

    return isVisible;
};