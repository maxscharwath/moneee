import { useEffect, useRef } from 'react';

export function useDelayFunction(callback: () => void, delay: number) {
    const timerRef = useRef<number>();

    useEffect(
        () => () => {
            window.clearTimeout(timerRef.current);
        },
        []
    );

    return () => {
        window.clearTimeout(timerRef.current);
        timerRef.current = window.setTimeout(callback, delay);
    };
}
