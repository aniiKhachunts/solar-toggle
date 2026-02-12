import { useEffect } from "react";

export const useSolarTracker = () => {
    useEffect(() => {
        const root = document.documentElement;
        if (!root.style.getPropertyValue("--sun-x")) {
            root.style.setProperty("--sun-x", `${window.innerWidth * 0.55}px`);
            root.style.setProperty("--sun-y", `${window.innerHeight * 0.22}px`);
            root.style.setProperty("--sun-progress", "0.22");
            root.style.setProperty("--dusk", "0");
        }
    }, []);
};
