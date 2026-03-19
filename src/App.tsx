import {useEffect, useState} from "react";
import SolarOrb from "./components/SolarOrb.tsx";
import {useSolarTracker} from "./hooks/useSolarTracker.ts";

export default function App() {
    const [isNight, setIsNight] = useState(false);

    useSolarTracker();

    const [particles] = useState(() =>
        Array.from({length: 36}).map(() => ({
            size: Math.random() * 2 + 1,
            left: Math.random() * 100,
            top: Math.random() * 100,
            opacity: Math.random() * 0.5 + 0.2,
            duration: 8 + Math.random() * 10,
            delay: Math.random() * 8,
        }))
    );

    useEffect(() => {
        const root = document.documentElement;
        root.classList.toggle("mode-night", isNight);
        root.classList.toggle("mode-day", !isNight);
    }, [isNight]);

    useEffect(() => {
        const root = document.documentElement;
        if (!root.style.getPropertyValue("--sun-x")) {
            root.style.setProperty("--sun-x", `${window.innerWidth - 170}px`);
            root.style.setProperty("--sun-y", `130px`);
            root.style.setProperty("--sun-progress", "0.18");
            root.style.setProperty("--dusk", "0");
        }
    }, []);

    return (
        <div className="noise solar-scene h-screen overflow-hidden">
            <div className="solar-layers">
                <div className="sky"/>
                <div className="aurora"/>
                <div className="stars"/>
                <div className="vignette"/>
            </div>

            <div className="night-curtain"/>
            <div className="horizon"/>
            <div className="horizon-label">Horizon</div>

            <SolarOrb isNight={isNight} setIsNight={setIsNight}/>

            <main className="relative z-20 h-full mx-auto w-full max-w-7xl py-20">
                <div className="h-full grid grid-rows-[auto_1fr] gap-10 items-center py-10">

                    <section className="max-w-3xl pr-[260px]">
                        <h1 className="mt-7 text-[clamp(36px,5.2vw,68px)] leading-[0.94] font-black tracking-tight text-title">
                            Solaris
                        </h1>

                        <h2 className="mt-5 max-w-xl text-[15px] leading-relaxed opacity-70">
                            Drag the sun. Tap to switch.
                        </h2>
                    </section>

                    <section className="relative h-[320px] mt-16 flex items-center justify-center overflow-hidden">

                        <div className="absolute inset-0 pointer-events-none noise-overlay"/>

                        <div
                            className="absolute inset-0 pointer-events-none"
                            style={{
                                background: `
                                    radial-gradient(
                                        circle at var(--sun-x) var(--sun-y),
                                        rgba(255,255,255,0.15),
                                        transparent 40%
                                    )
                                `,
                                filter: "blur(40px)",
                                opacity: "calc(1 - var(--dusk))"
                            }}
                        />

                        <div
                            className="absolute inset-0 pointer-events-none"
                            style={{
                                background: `
                                    radial-gradient(
                                        circle at var(--sun-x) var(--sun-y),
                                        rgba(251,191,36,0.18),
                                        transparent 55%
                                    )
                                `,
                                filter: "blur(60px)",
                                opacity: "calc(1 - var(--dusk))"
                            }}
                        />

                        <div
                            className="absolute inset-0 pointer-events-none"
                            style={{
                                background: `
                                    radial-gradient(
                                        circle at var(--sun-x) var(--sun-y),
                                        rgba(96,165,250,0.18),
                                        transparent 70%
                                    )
                                `,
                                filter: "blur(80px)",
                                opacity: "var(--dusk)"
                            }}
                        />

                        <div className="absolute inset-0 pointer-events-none">
                            <div
                                className="sun-trail"
                                style={{
                                    left: "var(--sun-x)",
                                    top: "var(--sun-y)"
                                }}
                            />
                        </div>

                        <div className="absolute inset-0 pointer-events-none overflow-hidden">
                            {particles.map((p, i) => (
                                <div
                                    key={i}
                                    className="absolute rounded-full bg-white"
                                    style={{
                                        width: `${p.size}px`,
                                        height: `${p.size}px`,
                                        left: `${p.left}%`,
                                        top: `${p.top}%`,
                                        opacity: `
                                            calc(${p.opacity} * (0.6 + (1 - var(--dusk)) * 0.6))
                                        `,
                                        filter: "blur(0.6px)",
                                        transform: `
                                            translate(
                                                calc((50vw - var(--sun-x)) * ${0.01 + p.size * 0.01}),
                                                calc((50vh - var(--sun-y)) * ${0.01 + p.size * 0.01})
                                            )
                                        `,
                                        animation: `floatParticle ${p.duration}s linear infinite`,
                                        animationDelay: `${p.delay}s`
                                    }}
                                />
                            ))}
                        </div>

                        <div className="translate-y-6">
                            <div
                                className="absolute inset-0 pointer-events-none"
                                style={{
                                    background: `
                                        linear-gradient(
                                            calc((var(--sun-x) / 100vw) * 180deg),
                                            rgba(255,255,255,0.12),
                                            transparent 40%
                                        )
                                    `,
                                    mixBlendMode: "overlay",
                                    opacity: 0.6
                                }}
                            />
                            <div
                                className="relative w-[90%] max-w-[560px] h-[220px] rounded-[40px] backdrop-blur-3xl transition-all duration-500"
                                style={{
                                    background: `
                                        radial-gradient(
                                            circle at 50% 30%,
                                            rgba(255,255,255,0.18),
                                            rgba(255,255,255,0.02) 70%
                                        )
                                    `,
                                    border: "1px solid rgba(255,255,255,0.06)",
                                    transform: `
                                        rotateX(calc((var(--sun-y) - 50vh) * -0.015deg))
                                        rotateY(calc((var(--sun-x) - 50vw) * 0.015deg))
                                    `,
                                    boxShadow: `
                                        0 60px 140px rgba(0,0,0,0.35),
                                        inset 0 1px 0 rgba(255,255,255,0.2)
                                    `,
                                    animation: "float 6s ease-in-out infinite"
                                }}
                            >
                                <div
                                    className="absolute inset-0 pointer-events-none"
                                    style={{
                                        background: `
                                            radial-gradient(
                                                circle at center,
                                                transparent 55%,
                                                rgba(0,0,0,0.25)
                                            )
                                        `,
                                        mixBlendMode: "soft-light"
                                    }}
                                />

                                <div
                                    className="absolute inset-0 pointer-events-none"
                                    style={{
                                        background: `
                                            radial-gradient(
                                                circle at var(--sun-x) var(--sun-y),
                                                rgba(255,255,255,0.35),
                                                transparent 35%
                                            )
                                        `
                                    }}
                                />

                                <div
                                    className="absolute inset-0 pointer-events-none"
                                    style={{
                                        background: `
                                            radial-gradient(
                                                circle at var(--sun-x) var(--sun-y),
                                                rgba(251,191,36,0.35),
                                                transparent 65%
                                            )
                                        `,
                                        opacity: "calc(1 - var(--dusk))"
                                    }}
                                />

                                <div
                                    className="absolute inset-0 pointer-events-none"
                                    style={{
                                        background: `
                                            radial-gradient(
                                                circle at var(--sun-x) var(--sun-y),
                                                rgba(96,165,250,0.25),
                                                transparent 65%
                                            )
                                        `,
                                        opacity: "var(--dusk)"
                                    }}
                                />
                            </div>
                        </div>

                    </section>
                </div>
            </main>
        </div>
    );
}