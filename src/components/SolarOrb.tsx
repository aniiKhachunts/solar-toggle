import {type Dispatch, type SetStateAction, useEffect, useRef, useState} from "react";

type Props = {
    isNight: boolean;
    setIsNight: Dispatch<SetStateAction<boolean>>;
    setIsDragging: (v: boolean) => void;
};

export default function SolarOrb({ isNight, setIsNight, setIsDragging }: Props) {
    const ref = useRef<HTMLDivElement | null>(null);
    const startRef = useRef<{ x: number; y: number; t: number } | null>(null);
    const draggingRef = useRef(false);

    const rafRef = useRef<number | null>(null);
    const lastPosRef = useRef<{ x: number; y: number } | null>(null);

    const viewportRef = useRef({
        w: window.innerWidth,
        h: window.innerHeight
    });

    const [hintVisible, setHintVisible] = useState(true);
    const [horizonY, setHorizonY] = useState(0);

    useEffect(() => {
        const update = () => {
            viewportRef.current = {
                w: window.innerWidth,
                h: window.innerHeight
            };
            setHorizonY(window.innerHeight * 0.62);
        };
        update();
        window.addEventListener("resize", update);
        return () => window.removeEventListener("resize", update);
    }, []);

    const clamp = (v: number, min: number, max: number) =>
        Math.max(min, Math.min(max, v));

    const setVars = (x: number, y: number) => {
        const root = document.documentElement;

        const clampedX = clamp(x, 40, viewportRef.current.w - 40);
        const clampedY = clamp(y, 40, viewportRef.current.h - 40);

        const isBelow = clampedY > horizonY;

        root.classList.toggle("mode-night", isBelow);
        root.classList.toggle("mode-day", !isBelow);

        setIsNight(prev => (prev !== isBelow ? isBelow : prev));

        root.style.setProperty("--sun-x", `${clampedX}px`);
        root.style.setProperty("--sun-y", `${clampedY}px`);

        const p = Math.min(1, Math.max(0, clampedY / viewportRef.current.h));
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
                setIsDragging(true);
            }

            if (!draggingRef.current) return;

            lastPosRef.current = { x: e.clientX, y: e.clientY };

            if (rafRef.current) return;

            rafRef.current = requestAnimationFrame(() => {
                if (lastPosRef.current) {
                    setVars(lastPosRef.current.x, lastPosRef.current.y);
                }
                rafRef.current = null;
            });
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
                setVars(e.clientX, e.clientY);
            }

            startRef.current = null;

            if (draggingRef.current) {
                setIsDragging(false);
            }

            draggingRef.current = false;
        };

        el.addEventListener("pointerdown", onPointerDown);
        el.addEventListener("pointermove", onPointerMove, { passive: true });
        el.addEventListener("pointerup", onPointerUp);
        el.addEventListener("pointercancel", onPointerUp);
        el.addEventListener("pointerleave", onPointerUp);

        return () => {
            el.removeEventListener("pointerdown", onPointerDown);
            el.removeEventListener("pointermove", onPointerMove);
            el.removeEventListener("pointerup", onPointerUp);
            el.removeEventListener("pointercancel", onPointerUp);
            el.removeEventListener("pointerleave", onPointerUp);
            if (rafRef.current) cancelAnimationFrame(rafRef.current);
        };
    }, [horizonY]);

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
                transform: "translate3d(-50%, -50%, 0)",
                willChange: "transform"
            }}
        >
            <div ref={ref} className="relative cursor-pointer">
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
                    className="relative w-16 h-16 rounded-full transition active:scale-90 hover:scale-105"
                >
                    <div
                        className="absolute inset-0 rounded-full"
                        style={{
                            background: isNight
                                ? "radial-gradient(circle, rgba(96,165,250,0.9), rgba(96,165,250,0.2) 60%, transparent)"
                                : "radial-gradient(circle, rgba(251,191,36,1), rgba(251,191,36,0.4) 60%, transparent)",
                            boxShadow: isNight
                                ? "0 0 40px rgba(0, 0, 0,0.5)"
                                : "0 0 80px rgba(0, 0, 0,0.8)"
                        }}
                    />

                    <div
                        className="absolute inset-[-20px] rounded-full pointer-events-none"
                        style={{
                            background: isNight
                                ? "conic-gradient(from 0deg, rgba(96,165,250,0.4), transparent, rgba(96,165,250,0.4))"
                                : "conic-gradient(from 0deg, rgba(251,191,36,0.6), transparent, rgba(251,191,36,0.6))",
                            filter: "blur(10px)",
                            opacity: 0.8,
                            animation: "spin 10s linear infinite"
                        }}
                    />

                    <div
                        className="absolute inset-[-30px] rounded-full pointer-events-none"
                        style={{
                            background: isNight
                                ? "radial-gradient(circle, rgba(96,165,250,0.2), transparent 70%)"
                                : "radial-gradient(circle, rgba(251,191,36,0.3), transparent 70%)",
                            filter: "blur(20px)"
                        }}
                    />
                </div>
            </div>
        </div>
    );
}