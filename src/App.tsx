import { useEffect, useState } from "react";
import { Sparkles, Layout, Zap } from "lucide-react";
import SolarOrb from "./components/SolarOrb.tsx";
import {SolarCard} from "./components/SolarCard.tsx";
import {useSolarTracker} from "./hooks/useSolarTracker.ts";

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
            <div className="solar-layers">
                <div className="sky" />
                <div className="aurora" />
                <div className="stars" />
                <div className="vignette" />
            </div>

            <div className="night-curtain" />

            <div className="horizon" />
            <div className="horizon-label">Horizon</div>

            <SolarOrb isNight={isNight} setIsNight={setIsNight} />

            <main className="relative z-20 h-full mx-auto w-full max-w-7xl px-10">
                <div className="h-full grid grid-rows-[auto_1fr] gap-10 items-center">
                    <section className="max-w-3xl pr-[260px]">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass">
                            <Sparkles size={14} className="text-yellow-500" />
                            <span
                                className="text-[11px] font-semibold tracking-[0.28em] uppercase"
                                style={{ color: "var(--muted)" }}
                            >
                Solaris • Material Playground
              </span>
                        </div>

                        <h1 className="mt-7 text-[clamp(36px,5.2vw,68px)] leading-[0.94] font-black tracking-tight text-title">
                            Light-driven UI
                        </h1>

                        <p className="mt-5 max-w-xl text-[15px] leading-relaxed text-body">
                            Drag the sun above the horizon for day. Pull it below to enter night. Tap the orb to toggle instantly.
                        </p>
                    </section>

                    <section className="min-h-0">
                        <div className="grid grid-cols-3 gap-7 items-stretch">
                            <SolarCard
                                title="Reactive Layout"
                                icon={Layout}
                                meta="POSITION-AWARE"
                                description="Cards understand where the light source is and respond with convincing material depth."
                            />
                            <SolarCard
                                title="Weighted Motion"
                                icon={Zap}
                                meta="SPRING SYSTEM"
                                description="Magnetic hover and inertial tracking create a tactile premium interaction."
                            />
                            <SolarCard
                                title="Atmosphere"
                                icon={Sparkles}
                                meta="DUSK-DRIVEN"
                                description="Sky, glow, aurora and stars blend naturally based on sun position."
                            />
                        </div>
                    </section>
                </div>
            </main>
        </div>
    );
}
