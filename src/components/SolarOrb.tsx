import { useEffect, useRef, useState } from "react";
import { Moon, SunMedium } from "lucide-react";

type Props = {
    isNight: boolean;
    setIsNight: (v: boolean) => void;
};

export default function SolarOrb({ isNight, setIsNight }: Props) {
    const ref = useRef<HTMLDivElement | null>(null);
    const startRef = useRef<{ x: number; y: number; t: number } | null>(null);
    const draggingRef = useRef(false);

    const [hintVisible, setHintVisible] = useState(true);
    const [horizonY, setHorizonY] = useState(0);

    useEffect(() => {
        const update = () => setHorizonY(window.innerHeight * 0.62);
        update();
        window.addEventListener("resize", update);
        return () => window.removeEventListener("resize", update);
    }, []);

    const clamp = (v: number, min: number, max: number) =>
        Math.max(min, Math.min(max, v));

    const setVars = (x: number, y: number) => {
        const root = document.documentElement;

        const clampedX = clamp(x, 40, window.innerWidth - 40);
        const clampedY = clamp(y, 40, window.innerHeight - 40);

        const isBelow = clampedY > horizonY;
        root.classList.toggle("mode-night", isBelow);
        root.classList.toggle("mode-day", !isBelow);

        root.style.setProperty("--sun-x", `${clampedX}px`);
        root.style.setProperty("--sun-y", `${clampedY}px`);

        const p = Math.min(1, Math.max(0, clampedY / window.innerHeight));
        root.style.setProperty("--sun-progress", String(p));

        const dusk = Math.min(1, Math.max(0, (p - 0.33) / 0.48));
        root.style.setProperty("--dusk", String(dusk));
    };

    useEffect(() => {
        const root = document.documentElement;
        root.classList.toggle("mode-night", isNight);
        root.classList.toggle("mode-day", !isNight);
    }, [isNight]);

    useEffect(() => {
        const el = ref.current;
        if (!el) return;

        const threshold = 7;

        const onPointerDown = (e: PointerEvent) => {
            startRef.current = {
                x: e.clientX,
                y: e.clientY,
                t: performance.now(),
            };
            draggingRef.current = false;
            setHintVisible(false);
            (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
        };

        const onPointerMove = (e: PointerEvent) => {
            if (!startRef.current) return;

            const dx = e.clientX - startRef.current.x;
            const dy = e.clientY - startRef.current.y;
            const dist = Math.hypot(dx, dy);

            if (!draggingRef.current && dist > threshold) {
                draggingRef.current = true;
            }

            if (draggingRef.current) {
                setVars(e.clientX, e.clientY);
            }
        };

        const onPointerUp = (e: PointerEvent) => {
            if ((e.currentTarget as HTMLElement).hasPointerCapture(e.pointerId)) {
                (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);
            }

            if (!startRef.current) return;

            const dx = e.clientX - startRef.current.x;
            const dy = e.clientY - startRef.current.y;
            const dist = Math.hypot(dx, dy);
            const dt = performance.now() - startRef.current.t;

            const isTap = dist <= threshold && dt < 320;

            if (isTap) {
                setIsNight(!isNight);
            } else {
                const shouldBeNight = e.clientY > horizonY;
                setIsNight(shouldBeNight);
                setVars(e.clientX, e.clientY);
            }

            startRef.current = null;
            draggingRef.current = false;
        };

        el.addEventListener("pointerdown", onPointerDown);
        el.addEventListener("pointermove", onPointerMove);
        el.addEventListener("pointerup", onPointerUp);
        el.addEventListener("pointercancel", onPointerUp);
        el.addEventListener("pointerleave", onPointerUp);

        return () => {
            el.removeEventListener("pointerdown", onPointerDown);
            el.removeEventListener("pointermove", onPointerMove);
            el.removeEventListener("pointerup", onPointerUp);
            el.removeEventListener("pointercancel", onPointerUp);
            el.removeEventListener("pointerleave", onPointerUp);
        };
    }, [isNight, horizonY]);

    useEffect(() => {
        const timer = setTimeout(() => setHintVisible(false), 2500);
        return () => clearTimeout(timer);
    }, []);

    return (
        <div
            className="fixed z-50 select-none"
            style={{
                left: "var(--sun-x)",
                top: "var(--sun-y)",
                transform: "translate(-50%, -50%)",
            }}
        >
            <div ref={ref} className="relative cursor-pointer">
                <div className="orb-pulse" />

                {hintVisible && (
                    <div className="absolute -top-10 left-1/2 -translate-x-1/2 text-[11px] opacity-60 whitespace-nowrap">
                        Drag or tap
                    </div>
                )}

                <div
                    onClick={(e) => {
                        e.stopPropagation();
                        setIsNight(!isNight);
                    }}
                    className="w-14 h-14 rounded-full grid place-items-center transition active:scale-90 hover:scale-105"
                    style={{
                        background: isNight
                            ? "rgba(96,165,250,0.15)"
                            : "rgba(251,191,36,0.95)",
                        boxShadow: isNight
                            ? "0 0 30px rgba(96,165,250,0.25)"
                            : "0 0 80px rgba(251,191,36,0.55)",
                    }}
                >
                    {isNight ? <Moon size={20} /> : <SunMedium size={20} />}
                </div>
            </div>
        </div>
    );
}