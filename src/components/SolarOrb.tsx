import { useEffect, useMemo, useRef, useState } from "react";
import { Moon, SunMedium, ArrowDown, ArrowUp } from "lucide-react";

type Props = {
    isNight: boolean;
    setIsNight: (v: boolean) => void;
};

export default function SolarOrb({ isNight, setIsNight }: Props) {
    const ref = useRef<HTMLDivElement | null>(null);
    const startRef = useRef<{ x: number; y: number; t: number } | null>(null);
    const movedRef = useRef(false);
    const draggingRef = useRef(false);
    const [hintVisible, setHintVisible] = useState(true);

    const horizonY = useMemo(() => window.innerHeight * 0.62, []);

    const setVars = (x: number, y: number) => {
        const root = document.documentElement;
        root.style.setProperty("--sun-x", `${x}px`);
        root.style.setProperty("--sun-y", `${y}px`);

        const p = Math.min(1, Math.max(0, y / window.innerHeight));
        root.style.setProperty("--sun-progress", String(p));

        const dusk = Math.min(1, Math.max(0, (p - 0.33) / 0.48));
        root.style.setProperty("--dusk", String(dusk));

        if (y > horizonY + 10 && !isNight) setIsNight(true);
        if (y < horizonY - 18 && isNight) setIsNight(false);
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
            startRef.current = { x: e.clientX, y: e.clientY, t: performance.now() };
            movedRef.current = false;
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
                movedRef.current = true;
            }

            if (draggingRef.current) {
                setVars(e.clientX, e.clientY);
            }
        };

        const onPointerUp = (e: PointerEvent) => {
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
            draggingRef.current = false;
        };

        el.addEventListener("pointerdown", onPointerDown);
        el.addEventListener("pointermove", onPointerMove);
        el.addEventListener("pointerup", onPointerUp);
        el.addEventListener("pointercancel", onPointerUp);

        return () => {
            el.removeEventListener("pointerdown", onPointerDown);
            el.removeEventListener("pointermove", onPointerMove);
            el.removeEventListener("pointerup", onPointerUp);
            el.removeEventListener("pointercancel", onPointerUp);
        };
    }, [isNight, setIsNight, horizonY]);

    return (
        <div
            className="fixed z-50 select-none"
            style={{
                left: "var(--sun-x)",
                top: "var(--sun-y)",
                transform: "translate(-50%, -50%)",
            }}
        >
            <div ref={ref} className="relative cursor-grab active:cursor-grabbing">
                <div className="orb-pulse" />

                {hintVisible && (
                    <div className="orb-tooltip">
            <span className="inline-flex items-center gap-2">
              <span className="inline-flex items-center gap-1">
                <ArrowUp size={14} /> day
              </span>
              <span className="opacity-60">/</span>
              <span className="inline-flex items-center gap-1">
                <ArrowDown size={14} /> night
              </span>
              <span className="opacity-60">•</span>
              <span>tap to toggle</span>
            </span>
                    </div>
                )}

                <div
                    className="glass rounded-[1.4rem] px-4 py-3 flex items-center gap-3"
                    style={{ color: "var(--fg)" }}
                >
                    <div
                        className="w-12 h-12 rounded-[1.25rem] grid place-items-center ring-1"
                        style={{
                            borderColor: "var(--glass-border)",
                            background: isNight ? "rgba(96,165,250,0.12)" : "rgba(251,191,36,0.92)",
                            boxShadow: isNight
                                ? "0 0 28px rgba(96,165,250,0.22)"
                                : "0 0 90px rgba(251,191,36,0.50), 0 0 160px rgba(251,191,36,0.18)",
                        }}
                    >
                        {isNight ? <Moon size={18} /> : <SunMedium size={18} />}
                    </div>

                    <div className="leading-tight">
                        <div className="text-[11px] font-semibold tracking-[0.24em] uppercase" style={{ color: "var(--muted)" }}>
                            Sun controller
                        </div>
                        <div className="text-xs font-semibold" style={{ color: "var(--fg)" }}>
                            Drag across horizon • Tap toggles
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
