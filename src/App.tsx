import { useEffect, useState } from "react";
import SolarOrb from "./components/SolarOrb.tsx";
import { useSolarTracker } from "./hooks/useSolarTracker.ts";

export default function App() {
    const [isNight, setIsNight] = useState(false);

    useSolarTracker();

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
            {/* BACKGROUND */}
            <div className="solar-layers">
                <div className="sky" />
                <div className="aurora" />
                <div className="stars" />
                <div className="vignette" />
            </div>

            <div className="night-curtain" />

            <div className="horizon" />
            <div className="horizon-label">Horizon</div>

            {/* SUN CONTROL */}
            <SolarOrb isNight={isNight} setIsNight={setIsNight} />

            <main className="relative z-20 h-full mx-auto w-full max-w-7xl py-20">
                <div className="h-full grid grid-rows-[auto_1fr] gap-10 items-center py-10">

                    {/* TEXT */}
                    <section className="max-w-3xl pr-[260px]">
                        <h1 className="mt-7 text-[clamp(36px,5.2vw,68px)] leading-[0.94] font-black tracking-tight text-title">
                            Solaris
                        </h1>

                        <h2 className="mt-5 max-w-xl text-[15px] leading-relaxed opacity-70">
                            Drag the sun. Tap to switch.
                        </h2>
                    </section>

                    {/* LIGHT SYSTEM */}
                    <section className="relative h-[320px] mt-16 flex items-center justify-center pointer-events-none">
                        {/* DAY LIGHT */}
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

                        {/* NIGHT LIGHT */}
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

                        {/* GLASS PANEL */}
                        <div className="translate-y-6">
                            <div
                                className="relative w-[90%] max-w-[560px] h-[220px] md:h-[240px] rounded-[40px] backdrop-blur-3xl transition-all duration-500"
                                style={{
                                    background:
                                        "linear-gradient(180deg, rgba(255,255,255,0.16), rgba(255,255,255,0.04))",
                                    border: "1px solid rgba(255,255,255,0.08)",

                                    transform: `
                                        rotateX(calc((var(--sun-y) - 50vh) * -0.015deg))
                                        rotateY(calc((var(--sun-x) - 50vw) * 0.015deg))
                                    `,

                                    boxShadow: `
                                        0 40px 120px rgba(0,0,0,0.35),
                                        inset 0 1px 0 rgba(255,255,255,0.25)
                                    `,

                                    animation: "float 6s ease-in-out infinite"
                                }}
                            >
                                {/* REFLECTION */}
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

                                {/* DAY GLOW */}
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

                                {/* NIGHT GLOW */}
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