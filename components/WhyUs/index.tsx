import SectionTitle from "../Common/SectionTitle";

const WhyUs = () => {
  return (
    <section id="why-us" className="py-16 md:py-20 lg:py-28">
      <div className="container">
        <SectionTitle
          title="Why Choose Netcurion Technology?"
          paragraph="We combine cybersecurity-first engineering with modern cloud, DevOps and product craftsmanship to deliver secure, scalable and delightful software."
          center
        />

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-xl border border-slate-200 bg-white/70 p-6 shadow-sm backdrop-blur dark:border-white/10 dark:bg-white/5">
            <h3 className="mb-2 text-lg font-semibold text-slate-900 dark:text-white">Security by Design</h3>
            <p className="text-slate-600 dark:text-slate-300">Threat modeling, SAST/DAST, SOC-ready logging, and least-privilege cloud architectures built-in.</p>
          </div>
          <div className="rounded-xl border border-slate-200 bg-white/70 p-6 shadow-sm backdrop-blur dark:border-white/10 dark:bg-white/5">
            <h3 className="mb-2 text-lg font-semibold text-slate-900 dark:text-white">Cloud-Native Delivery</h3>
            <p className="text-slate-600 dark:text-slate-300">AWS/Azure/GCP infrastructure as code, scalable microservices, and cost-aware serverless patterns.</p>
          </div>
          <div className="rounded-xl border border-slate-200 bg-white/70 p-6 shadow-sm backdrop-blur dark:border-white/10 dark:bg-white/5">
            <h3 className="mb-2 text-lg font-semibold text-slate-900 dark:text-white">DevOps Velocity</h3>
            <p className="text-slate-600 dark:text-slate-300">Automated CI/CD, GitOps, and observability for faster, safer releases with measurable reliability.</p>
          </div>
          <div className="rounded-xl border border-slate-200 bg-white/70 p-6 shadow-sm backdrop-blur dark:border-white/10 dark:bg-white/5">
            <h3 className="mb-2 text-lg font-semibold text-slate-900 dark:text-white">Product Craft</h3>
            <p className="text-slate-600 dark:text-slate-300">User-centric UX, performance budgets, and SEO-first Next.js builds that convert and scale.</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhyUs;
