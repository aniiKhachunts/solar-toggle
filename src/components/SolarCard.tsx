import { motion, useMotionValue, useSpring } from "motion/react";

export const SolarCard = ({ label }: { label: string }) => {
    const mx = useMotionValue(0);
    const my = useMotionValue(0);

    const sx = useSpring(mx, { stiffness: 160, damping: 20 });
    const sy = useSpring(my, { stiffness: 160, damping: 20 });

    return (
        <motion.div
            onPointerMove={(e) => {
                const r = (e.currentTarget as HTMLDivElement).getBoundingClientRect();
                const x = e.clientX - (r.left + r.width / 2);
                const y = e.clientY - (r.top + r.height / 2);
                mx.set(x * 0.2);
                my.set(y * 0.2);
            }}
            onPointerLeave={() => {
                mx.set(0);
                my.set(0);
            }}
            style={{
                x: sx,
                y: sy,
                rotateX: "calc((var(--sun-y) - 50vh) * -0.012deg)",
                rotateY: "calc((var(--sun-x) - 50vw) * 0.012deg)",
            }}
            whileHover={{ scale: 1.015 }}
            transition={{ duration: 0.4 }}
            className="relative w-full h-[240px] rounded-[28px] overflow-hidden"
        >
            {/* glass base */}
            <div
                className="absolute inset-0 backdrop-blur-2xl"
                style={{
                    background:
                        "linear-gradient(180deg, rgba(255,255,255,0.14), rgba(255,255,255,0.03))",
                    border: "1px solid rgba(255,255,255,0.08)",
                }}
            />

            {/* edge light (VERY important) */}
            <div
                className="absolute inset-0 pointer-events-none"
                style={{
                    background:
                        "linear-gradient(120deg, rgba(255,255,255,0.18), transparent 30%)",
                    opacity: 0.6,
                }}
            />

            {/* sun reflection */}
            <div
                className="absolute inset-0 pointer-events-none"
                style={{
                    background:
                        "radial-gradient(circle at var(--sun-x) var(--sun-y), rgba(255,255,255,0.22), transparent 35%)",
                }}
            />

            {/* warm glow */}
            <div
                className="absolute inset-0 pointer-events-none"
                style={{
                    background:
                        "radial-gradient(circle at var(--sun-x) var(--sun-y), rgba(251,191,36,0.28), transparent 60%)",
                    opacity: "calc(1 - var(--dusk))",
                }}
            />

            {/* night tint */}
            <div
                className="absolute inset-0 pointer-events-none"
                style={{
                    background:
                        "radial-gradient(circle at var(--sun-x) var(--sun-y), rgba(96,165,250,0.2), transparent 60%)",
                    opacity: "var(--dusk)",
                }}
            />

            {/* subtle shadow */}
            <div
                className="absolute inset-0 pointer-events-none"
                style={{
                    boxShadow:
                        "0 20px 60px rgba(0,0,0,0.25)",
                }}
            />

            {/* label */}
            <div className="absolute bottom-5 left-6 text-[11px] tracking-[0.2em] uppercase opacity-50">
                {label}
            </div>
        </motion.div>
    );
};