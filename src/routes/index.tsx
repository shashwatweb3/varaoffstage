import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import hero from "@/assets/backstage-hero.jpg";
import { NAV, SOCIAL_LINKS, VARA_NETWORK_URL } from "@/config/site";
import { SignupForm } from "@/components/offstage/SignupForm";
import { Reveal } from "@/components/offstage/Reveal";
import { Wordmark } from "@/components/offstage/Wordmark";
import { BlackHolePortal } from "@/components/offstage/BlackHolePortal";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "VARA [OFFSTAGE] — The building happens offstage" },
      { name: "description", content: "The event was the stage. VARA [OFFSTAGE] is becoming an online home for builders, technical notes, project showcases and conversations across Vara Network. Coming soon." },
      { property: "og:title", content: "VARA [OFFSTAGE] — Coming soon" },
      { property: "og:description", content: "The event was the stage. The building happens offstage. A space for people building with Vara." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Spotlight() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!window.matchMedia("(pointer: fine)").matches || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const move = (e: PointerEvent) => {
      ref.current?.style.setProperty("--x", `${e.clientX}px`);
      ref.current?.style.setProperty("--y", `${e.clientY}px`);
      if (ref.current) ref.current.style.opacity = "1";
    };
    window.addEventListener("pointermove", move);
    return () => window.removeEventListener("pointermove", move);
  }, []);
  return (
    <div ref={ref} aria-hidden className="pointer-events-none fixed inset-0 z-30 opacity-0 transition-opacity duration-700"
      style={{ background: "radial-gradient(420px circle at var(--x) var(--y), color-mix(in oklab, var(--primary) 9%, transparent), transparent 70%)" }} />
  );
}

function Curtains() {
  const [gone, setGone] = useState(false);
  useEffect(() => { const t = setTimeout(() => setGone(true), 2100); return () => clearTimeout(t); }, []);
  if (gone) return null;
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-50 flex">
      <div className="curtain-fabric animate-curtain-left h-full w-1/2 shadow-2xl" />
      <div className="curtain-fabric animate-curtain-right h-full w-1/2 shadow-2xl" />
    </div>
  );
}

function Status() {
  return (
    <div className="inline-flex items-center gap-3 rounded-full border border-border bg-background/50 px-4 py-2 font-mono text-[0.7rem] uppercase tracking-[0.2em] backdrop-blur">
      <span className="animate-pulse-dot h-2 w-2 rounded-full bg-primary glow" />
      <span className="text-foreground">Coming soon</span>
      <span className="text-muted-foreground">/ currently building</span>
      <span className="relative hidden h-px w-10 overflow-hidden bg-border sm:block">
        <span className="animate-bar absolute inset-y-0 w-1/2 bg-primary" />
      </span>
    </div>
  );
}

const IDEA = [
  { n: "01", t: "Meet", d: "Bring developers, founders and community builders together.", note: "where it started" },
  { n: "02", t: "Build", d: "Explore technical ideas, experiments and projects across Vara.", note: "where it continues" },
  { n: "03", t: "Connect", d: "Turn conversations into collaborations, feedback and opportunities.", note: "where it leads" },
];

const OFFSTAGE = [
  { n: "01", t: "Behind the Builds", d: "Real projects, teams, experiments and stories from the Vara ecosystem.", tag: "// stories", style: "border-l-2 border-primary pl-6" },
  { n: "02", t: "Offstage Notes", d: "Technical explainers, architecture breakdowns, development guides and useful resources for builders.", tag: "$ cat notes.md", style: "font-mono bg-card/40 border border-border p-6" },
  { n: "03", t: "Builder Conversations", d: "Interviews, discussions, lessons learned and conversations with people building in the ecosystem.", tag: "“ … ”", style: "border-t border-border pt-6 italic" },
  { n: "04", t: "The Demo Room", d: "Product showcases, live demos, experiments and early-stage projects.", tag: "● live soon", style: "border border-primary/40 p-6 bg-[radial-gradient(circle_at_top_right,color-mix(in_oklab,var(--primary)_14%,transparent),transparent_60%)]" },
];

function Index() {
  return (
    <div className="relative overflow-x-clip bg-background text-foreground">
      <Curtains />
      <Spotlight />
      <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:bg-primary focus:px-3 focus:py-2 focus:text-primary-foreground">Skip to content</a>

      <header className="fixed inset-x-0 top-0 z-40 border-b border-border bg-background/60 backdrop-blur-md">
        <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4" aria-label="Main">
          <a href="#top" className="text-sm"><Wordmark /></a>
          <ul className="hidden gap-8 md:flex">
            {NAV.map((n) => (
              <li key={n.id}><a href={`#${n.id}`} className="font-mono text-[0.72rem] uppercase tracking-[0.2em] text-muted-foreground transition hover:text-primary focus-visible:text-primary">{n.label}</a></li>
            ))}
          </ul>
          <a href="#join" className="font-mono text-[0.7rem] uppercase tracking-[0.2em] text-primary md:hidden">Join</a>
        </nav>
      </header>

      <main id="main">
        {/* HERO */}
        <section id="top" className="grain relative flex min-h-svh items-end overflow-hidden pb-20 pt-32">
          <BlackHolePortal />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-background via-background/30 to-transparent" />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-background via-background/10 to-background/35" />
          <div className="relative z-10 mx-auto w-full max-w-7xl px-6">
            <div className="animate-fade-up" style={{ animationDelay: "1.4s" }}><Status /></div>
            <p className="eyebrow animate-fade-up mt-10" style={{ animationDelay: "1.6s" }}>The next chapter of Vara [Offstage]</p>
            <h1 className="font-wide animate-fade-up mt-5 max-w-5xl text-5xl uppercase leading-[0.92] sm:text-7xl lg:text-8xl" style={{ animationDelay: "1.75s" }}>
              The room was just the <span className="text-primary text-glow">beginning.</span>
            </h1>
            <div className="animate-fade-up mt-8 grid max-w-4xl gap-4 md:grid-cols-2" style={{ animationDelay: "1.95s" }}>
              <p className="text-lg text-foreground/90">The conversations continue. The builds continue. And there's a lot more happening offstage.</p>
              <p className="text-muted-foreground">A space for the people building, experimenting and creating with Vara.</p>
            </div>
            <div className="animate-fade-up mt-10 flex flex-wrap gap-3" style={{ animationDelay: "2.1s" }}>
              <a href="#join" className="inline-flex h-12 items-center rounded-sm bg-primary px-7 font-mono text-xs font-bold uppercase tracking-[0.18em] text-primary-foreground glow transition hover:brightness-110">Get early access</a>
              <a href={VARA_NETWORK_URL} target="_blank" rel="noreferrer" className="inline-flex h-12 items-center rounded-sm border border-border px-7 font-mono text-xs uppercase tracking-[0.18em] transition hover:border-primary hover:text-primary">Explore Vara Network ↗</a>
            </div>
          </div>
        </section>

        {/* IDEA */}
        <section id="about" className="mx-auto max-w-7xl px-6 py-32 md:py-44">
          <Reveal><p className="eyebrow">The idea</p></Reveal>
          <Reveal delay={100}>
            <h2 className="font-wide mt-6 max-w-4xl text-4xl uppercase leading-[0.95] md:text-6xl">When the lights go off, the building doesn't stop.</h2>
          </Reveal>
          <Reveal delay={200}>
            <p className="mt-8 max-w-2xl text-lg text-muted-foreground">VARA [OFFSTAGE] started as a room in Mumbai — developers, founders and community builders in one place. Now it's moving online, so the work and the conversations can keep going long after the event.</p>
          </Reveal>
          <div className="mt-20 grid border-t border-border md:grid-cols-3">
            {IDEA.map((i, k) => (
              <Reveal key={i.n} delay={k * 150} className="group relative border-b border-border py-10 md:border-b-0 md:border-r md:px-8 md:last:border-r-0 md:first:pl-0">
                <span className="font-mono text-sm text-primary">{i.n}</span>
                <h3 className="font-wide mt-4 text-3xl uppercase">{i.t}</h3>
                <p className="mt-3 max-w-xs text-muted-foreground">{i.d}</p>
                <span className="mt-6 block font-mono text-[0.7rem] uppercase tracking-widest text-primary opacity-0 transition group-hover:opacity-100">→ {i.note}</span>
              </Reveal>
            ))}
          </div>
        </section>

        {/* OFFSTAGE */}
        <section id="builds" className="border-y border-border bg-card/30 py-32">
          <div className="mx-auto max-w-7xl px-6">
            <Reveal><p className="eyebrow">Behind the curtain</p></Reveal>
            <Reveal delay={100}><h2 className="font-wide mt-6 text-4xl uppercase md:text-6xl">What happens offstage?</h2></Reveal>
            <div className="mt-20 grid gap-x-16 gap-y-16 md:grid-cols-2">
              {OFFSTAGE.map((o, k) => (
                <Reveal key={o.n} delay={(k % 2) * 150} className="group">
                  <div className={`transition duration-500 group-hover:-translate-y-1 ${o.style}`}>
                    <div className="flex items-baseline justify-between font-mono text-xs not-italic text-muted-foreground">
                      <span className="text-primary">{o.n}.</span><span>{o.tag}</span>
                    </div>
                    <h3 className="font-wide mt-4 text-2xl uppercase not-italic md:text-3xl">{o.t}</h3>
                    <p className="mt-3 max-w-md not-italic text-muted-foreground" style={{ fontFamily: "inherit" }}>{o.d}</p>
                    <p className="mt-4 font-mono text-[0.7rem] not-italic uppercase tracking-widest text-primary/0 transition group-hover:text-primary">Backstage note: opening soon</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* PASS */}
        <section id="pass" className="mx-auto grid max-w-7xl items-center gap-16 px-6 py-32 md:grid-cols-2 md:py-44">
          <Reveal className="flex justify-center">
            <div className="group relative w-72 rotate-[-4deg] transition duration-700 hover:rotate-0 sm:w-80">
              <div className="mx-auto h-16 w-1 bg-gradient-to-b from-transparent to-border" />
              <div className="relative overflow-hidden rounded-lg border border-primary/40 bg-card p-7 glow">
                <div className="absolute -right-16 -top-16 h-40 w-40 rounded-full bg-primary/20 blur-3xl" />
                <div className="mx-auto mb-6 h-3 w-14 rounded-full bg-background" />
                <p className="eyebrow">All access</p>
                <p className="font-wide mt-3 text-4xl uppercase leading-none">Back<br />stage<br /><span className="text-primary">pass</span></p>
                <div className="mt-8 grid grid-cols-2 gap-4 border-t border-dashed border-border pt-5 font-mono text-[0.65rem] uppercase tracking-widest text-muted-foreground">
                  <div>Holder<br /><span className="text-foreground">Builder</span></div>
                  <div>Access<br /><span className="text-foreground">Offstage</span></div>
                </div>
                <div className="mt-6 flex items-end justify-between">
                  <Wordmark className="text-xs" />
                  <div className="flex h-8 gap-[2px]" aria-hidden>
                    {[3, 1, 2, 1, 3, 2, 1, 1, 3, 2, 1, 2].map((w, i) => <span key={i} className="bg-foreground/70" style={{ width: w }} />)}
                  </div>
                </div>
              </div>
            </div>
          </Reveal>
          <div>
            <Reveal><p className="eyebrow">The backstage pass</p></Reveal>
            <Reveal delay={100}><h2 className="font-wide mt-6 text-4xl uppercase leading-[0.95] md:text-5xl">Your next connection could start here.</h2></Reveal>
            <Reveal delay={200}><p className="mt-6 max-w-md text-lg text-muted-foreground">Discover builders, explore projects, exchange ideas and find people working on problems similar to yours.</p></Reveal>
            <Reveal delay={300} className="mt-10"><SignupForm id="email-pass" cta="Get on the list" /></Reveal>
          </div>
        </section>

        {/* COMMUNITY */}
        <section id="community" className="border-t border-border py-32">
          <div className="mx-auto max-w-7xl px-6">
            <Reveal><p className="eyebrow">The community</p></Reveal>
            <Reveal delay={100}><h2 className="font-wide mt-6 max-w-4xl text-4xl uppercase leading-[0.95] md:text-6xl">Built by the community. Open to builders.</h2></Reveal>
            <Reveal delay={200}><p className="mt-6 max-w-xl text-lg text-muted-foreground">Developers, founders, creators and community organisers — stay connected and keep the conversation going.</p></Reveal>
            <ul className="mt-16 grid border-t border-border sm:grid-cols-2 lg:grid-cols-4">
              {SOCIAL_LINKS.map((s, k) => {
                const inner = (
                  <>
                    <span className="font-mono text-xs text-muted-foreground">{s.handle}</span>
                    <span className="font-wide mt-2 block text-xl uppercase">{s.label}</span>
                    <span className="mt-4 block font-mono text-[0.7rem] uppercase tracking-widest text-primary">{s.url ? "Follow ↗" : "Link coming soon"}</span>
                  </>
                );
                return (
                  <li key={k} className="border-b border-border sm:border-r lg:last:border-r-0">
                    {s.url ? (
                      <a href={s.url} target="_blank" rel="noreferrer" className="block p-8 transition hover:bg-card focus-visible:bg-card">{inner}</a>
                    ) : (
                      <div className="block p-8 opacity-70">{inner}</div>
                    )}
                  </li>
                );
              })}
            </ul>
          </div>
        </section>

        {/* FINAL */}
        <section id="join" className="grain relative overflow-hidden py-40 text-center">
          <img src={hero} alt="" loading="lazy" width={1920} height={1088} className="absolute inset-0 h-full w-full object-cover opacity-30" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,color-mix(in_oklab,var(--primary)_22%,transparent),transparent_60%)]" />
          <div className="absolute inset-0 bg-gradient-to-b from-background via-transparent to-background" />
          <div className="relative mx-auto flex max-w-3xl flex-col items-center px-6">
            <Reveal><Wordmark className="text-glow text-2xl md:text-3xl" /></Reveal>
            <Reveal delay={100}><h2 className="font-wide mt-10 text-4xl uppercase leading-[0.95] md:text-6xl">The next chapter is being built.</h2></Reveal>
            <Reveal delay={200}><p className="mt-5 text-lg text-muted-foreground">See you offstage.</p></Reveal>
            <Reveal delay={300} className="mt-10 flex w-full justify-center"><SignupForm id="email-final" cta="Stay in the loop" /></Reveal>
            <Reveal delay={400}><p className="mt-20 font-mono text-[0.7rem] uppercase tracking-[0.25em] text-muted-foreground">The event was the stage. <span className="text-primary">The building happens offstage.</span></p></Reveal>
          </div>
        </section>
      </main>

      <footer className="border-t border-border py-8 text-center font-mono text-[0.7rem] uppercase tracking-[0.25em] text-muted-foreground">
        Vara [Offstage] · Powered by Vara Network
      </footer>
    </div>
  );
}
