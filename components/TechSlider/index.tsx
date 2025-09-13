import React from "react";

const TECHS = [
  "Cybersecurity",
  "Next.js",
  "React",
  "React Native",
  "Electron",
  "Express",
  "Node.js",
  "WordPress",
  "Shopify",
  "Blockchain",
  "DevOps",
  "Cloud",
];

const Badge = ({ label }: { label: string }) => (
  <span className="mx-3 inline-flex items-center rounded-full border border-slate-200/70 bg-white/70 px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm backdrop-blur dark:border-white/10 dark:bg-white/10 dark:text-white">
    {label}
  </span>
);

const Row = () => (
  <div className="flex min-w-full shrink-0 items-center">
    {TECHS.map((t) => (
      <Badge key={t} label={t} />
    ))}
    {TECHS.map((t, i) => (
      <Badge key={`${t}-dup-${i}`} label={t} />
    ))}
  </div>
);

const TechSlider = () => {
  return (
    <section aria-label="Technology Slider" className="relative z-10 py-6">
      <div className="container">
        <div className="rounded-2xl border border-slate-900/5 bg-slate-50/70 p-3 ring-1 ring-black/5 backdrop-blur dark:border-white/10 dark:bg-white/5 dark:ring-white/10">
          <div className="relative overflow-hidden">
            <div className="animate-infinite-scroll flex w-[200%]">
              <Row />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TechSlider;
