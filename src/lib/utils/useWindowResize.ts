import { useEffect, useRef } from "react";


export default function useWindowResize(options: {
    measure: () => number,
    onShrink?: () => void,
    onGrow?: () => void
}){
    const sizeHistory = useRef<[number, number, number]>([
        options.measure(),
        options.measure(),
        options.measure()
    ]);

    useEffect(() => {
        const onResize = () => {
            sizeHistory.current.push(options.measure());
            sizeHistory.current.shift();

            if(
                sizeHistory.current[0] <= sizeHistory.current[1] &&
                sizeHistory.current[1] > sizeHistory.current[2]
            ){
                options.onShrink?.();
            } else if(
                sizeHistory.current[0] >= sizeHistory.current[1] &&
                sizeHistory.current[1] < sizeHistory.current[2]
            ){
                options.onGrow?.();
            }
        };

        window.addEventListener('resize', onResize)
        return () => {
            window.removeEventListener('resize', onResize)
        };
    }, []);
}