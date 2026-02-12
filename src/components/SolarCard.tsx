import { motion, useMotionValue, useSpring, useTransform } from "motion/react";
import type { LucideIcon } from "lucide-react";

interface CardProps {
    title: string;
    description: string;
    icon: LucideIcon;
    meta?: string;
}

export const SolarCard = ({ title, description, icon: Icon, meta = "POSITION-AWARE" }: CardProps) => {
    const mx = useMotionValue(0);
    const my = useMotionValue(0);

    const sx = useSpring(mx, { stiffness: 240, damping: 22, mass: 0.6 });
    const sy = useSpring(my, { stiffness: 240, damping: 22, mass: 0.6 });

    const tx = useTransform(sx, [-40, 40], [-10, 10]);
    const ty = useTransform(sy, [-40, 40], [-10, 10]);

    return (
        <motion.div
            onPointerMove={(e) => {
                const r = (e.currentTarget as HTMLDivElement).getBoundingClientRect();
                const x = e.clientX - (r.left + r.width / 2);
                const y = e.clientY - (r.top + r.height / 2);
                mx.set(Math.max(-40, Math.min(40, x)));
                my.set(Math.max(-40, Math.min(40, y)));
            }}
            onPointerLeave={() => {
                mx.set(0);
                my.set(0);
            }}
            style={{
                rotateX: "calc((var(--sun-y) - 50vh) * -0.012deg)",
                rotateY: "calc((var(--sun-x) - 50vw) * 0.012deg)",
                x: tx,
                y: ty,
            } as any}
            whileHover={{ scale: 1.03 }}
            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            className="solar-card solar-shadow group w-[20rem] h-[21.5rem] p-8 flex flex-col justify-between"
        >
            <div style={{ transform: "translateZ(34px)" }}>
                <div className="flex items-center justify-between">
                    <div className="w-12 h-12 rounded-2xl flex items-center justify-center ring-1"
                         style={{ background: "rgba(255,255,255,0.18)", borderColor: "var(--card-border)" }}>
                        <Icon size={22} style={{ color: "var(--card-fg)" }} />
                    </div>

                    <div
                        className="text-[11px] tracking-[0.28em] uppercase font-semibold"
                        style={{ color: "color-mix(in oklab, var(--card-fg) 55%, transparent)" }}
                    >
                        {meta}
                    </div>
                </div>

                <h3 className="mt-7 text-[22px] leading-tight font-black tracking-tight" style={{ color: "var(--card-fg)" }}>
                    {title}
                </h3>

                <p className="mt-3 text-[14px] leading-relaxed" style={{ color: "var(--card-muted)" }}>
                    {description}
                </p>

                <div className="mt-7 flex items-center gap-3">
                    <div className="h-[1px] flex-1" style={{ background: "color-mix(in oklab, var(--card-fg) 16%, transparent)" }} />
                    <div className="text-[12px] font-semibold" style={{ color: "color-mix(in oklab, var(--card-fg) 48%, transparent)" }}>
                        Drag the orb
                    </div>
                </div>
            </div>

            <motion.div
                style={{ transform: "translateZ(26px)" }}
                className="rounded-2xl px-4 py-3 ring-1"
                whileHover={{ y: -2 }}
                transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                aria-hidden
            >
                <div className="text-xs font-semibold" style={{ color: "var(--card-fg)" }}>
                    Material UI, but physical
                </div>
                <div className="mt-1 text-[12px]" style={{ color: "var(--card-muted)" }}>
                    Light drives depth, shadow and mood.
                </div>
            </motion.div>
        </motion.div>
    );
};
