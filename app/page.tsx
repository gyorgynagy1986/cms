import React from "react";

export const metadata = {
  title: "Webjawa — International IT Solutions, Software & Operations",
  description:
    "Webjawa is a software studio building production-grade web applications, mobile apps and infrastructure for international clients.",
};

const services = [
  {
    no: "01",
    title: "Application Development",
    body: "Bespoke web and mobile applications built on modern stacks — Next.js, React, React Native. From first prototype to production scale.",
  },
  {
    no: "02",
    title: "SaaS Platforms",
    body: "End-to-end product engineering for SaaS businesses: authentication, billing, multi-tenancy, analytics and the operational layer beneath them.",
  },
  {
    no: "03",
    title: "Infrastructure & Operations",
    body: "VPS provisioning, mail servers, monitoring, backups, CI/CD pipelines. Reliable operations is a product feature, not an afterthought.",
  },
  {
    no: "04",
    title: "Web Development",
    body: "Marketing sites, landing pages and integrations with measurable performance — Core Web Vitals, SEO, schema markup, analytics.",
  },
  {
    no: "05",
    title: "System Integration",
    body: "Third-party APIs, payment gateways, CRM and ERP connectors. We make disparate systems behave as one coherent product.",
  },
  {
    no: "06",
    title: "Consulting & Audits",
    body: "Architecture reviews, performance audits and technical due diligence. Clear written reports with prioritised, actionable findings.",
  },
];

const stack = [
  ["Frontend", "Next.js · React · TypeScript · Tailwind"],
  ["Mobile", "React Native · Expo"],
  ["Backend", "Node.js · MongoDB · PostgreSQL · Redis"],
  ["Infra", "Vercel · Hetzner · Docker · Nginx"],
  ["Email", "SendGrid · Mailcow · Postfix"],
  ["Tooling", "GitHub Actions · Sentry · Upstash"],
];

const process = [
  {
    step: "I",
    title: "Discovery",
    body: "A structured conversation about the business problem, constraints and success metrics. No code is written yet.",
  },
  {
    step: "II",
    title: "Architecture",
    body: "A written technical proposal: stack, data model, timeline, risks. Reviewed and agreed before engineering starts.",
  },
  {
    step: "III",
    title: "Engineering",
    body: "Short iteration cycles with working software at the end of each. Changes are visible in staging, not in meetings.",
  },
  {
    step: "IV",
    title: "Operations",
    body: "Launch, monitoring, incident response and ongoing maintenance. The product is not finished when it ships.",
  },
];

const Page = () => {
  return (
    <main className="min-h-screen bg-[#f4f1ec] text-[#141414] font-sans antialiased selection:bg-[#141414] selection:text-[#f4f1ec]">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300;0,9..144,400;0,9..144,500;1,9..144,400&family=Inter:wght@300;400;500;600&display=swap');
        .font-display { font-family: 'Fraunces', 'Times New Roman', serif; font-optical-sizing: auto; }
        .font-sans { font-family: 'Inter', -apple-system, sans-serif; }
        .grid-bg {
          background-image:
            linear-gradient(to right, rgba(20,20,20,0.06) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(20,20,20,0.06) 1px, transparent 1px);
          background-size: 64px 64px;
        }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(12px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .reveal { animation: fadeUp 0.9s cubic-bezier(0.2, 0.7, 0.2, 1) both; }
        .rule { height: 1px; background: #141414; opacity: 0.15; }
        .rule-strong { height: 1px; background: #141414; opacity: 0.9; }
      `}</style>

      {/* NAV */}
      <header className="border-b border-[#141414]/15">
        <div className="max-w-[1280px] mx-auto px-6 md:px-10 flex items-center justify-between h-16">
          <div className="flex items-baseline gap-2">
            <span className="font-display text-xl tracking-tight">Webjawa</span>
            <span className="text-[10px] uppercase tracking-[0.2em] text-[#141414]/50">
              Studio
            </span>
          </div>
          <nav className="hidden md:flex items-center gap-8 text-sm">
            <a
              href="#services"
              className="hover:text-[#141414]/60 transition-colors"
            >
              Services
            </a>
            <a
              href="#stack"
              className="hover:text-[#141414]/60 transition-colors"
            >
              Stack
            </a>
            <a
              href="#process"
              className="hover:text-[#141414]/60 transition-colors"
            >
              Process
            </a>
            <a
              href="#contact"
              className="hover:text-[#141414]/60 transition-colors"
            >
              Contact
            </a>
          </nav>
          <a
            href="mailto:hello@webjawa.com"
            className="text-sm border border-[#141414] px-4 py-2 hover:bg-[#141414] hover:text-[#f4f1ec] transition-colors"
          >
            hello@webjawa.com
          </a>
        </div>
      </header>

      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 grid-bg opacity-60 pointer-events-none" />
        <div className="relative max-w-[1280px] mx-auto px-6 md:px-10 pt-20 md:pt-32 pb-20 md:pb-28">
          <div className="reveal flex items-center gap-3 text-[11px] uppercase tracking-[0.25em] text-[#141414]/60 mb-10">
            <span className="inline-block w-8 h-px bg-[#141414]/60" />
            <span>International IT Solutions</span>
            <span className="text-[#141414]/30">·</span>
            <span>Est. Hungary</span>
          </div>

          <h1
            className="reveal font-display font-light text-[44px] leading-[1.02] md:text-[104px] md:leading-[0.95] tracking-[-0.02em] max-w-[16ch]"
            style={{ animationDelay: "120ms" }}
          >
            Engineered software for{" "}
            <em className="italic font-normal">serious</em> businesses.
          </h1>

          <div
            className="reveal mt-12 md:mt-16 grid md:grid-cols-12 gap-8 md:gap-10"
            style={{ animationDelay: "260ms" }}
          >
            <div className="md:col-span-5">
              <p className="text-base md:text-lg leading-relaxed text-[#141414]/75">
                Webjawa is a software studio building production-grade web
                applications, mobile platforms and the infrastructure that keeps
                them running — for teams operating across borders.
              </p>
            </div>
            <div className="md:col-span-4 md:col-start-8 flex flex-col gap-4">
              <a
                href="mailto:hello@webjawa.com"
                className="group inline-flex items-center justify-between border border-[#141414] px-6 py-4 text-sm hover:bg-[#141414] hover:text-[#f4f1ec] transition-colors"
              >
                <span>Start a project</span>
                <span className="transition-transform group-hover:translate-x-1">
                  →
                </span>
              </a>
              <a
                href="#services"
                className="inline-flex items-center justify-between px-6 py-4 text-sm border border-transparent hover:border-[#141414]/30 transition-colors"
              >
                <span>Explore services</span>
                <span>↓</span>
              </a>
            </div>
          </div>

          {/* Meta row */}
          <div
            className="reveal mt-20 md:mt-32 pt-8 border-t border-[#141414]/15 grid grid-cols-2 md:grid-cols-4 gap-8 text-sm"
            style={{ animationDelay: "400ms" }}
          >
            <div>
              <div className="text-[11px] uppercase tracking-[0.2em] text-[#141414]/50 mb-2">
                Founded
              </div>
              <div className="font-display text-xl">MMXX</div>
            </div>
            <div>
              <div className="text-[11px] uppercase tracking-[0.2em] text-[#141414]/50 mb-2">
                Clients in
              </div>
              <div className="font-display text-xl">4 countries</div>
            </div>
            <div>
              <div className="text-[11px] uppercase tracking-[0.2em] text-[#141414]/50 mb-2">
                Uptime target
              </div>
              <div className="font-display text-xl">99.9%</div>
            </div>
            <div>
              <div className="text-[11px] uppercase tracking-[0.2em] text-[#141414]/50 mb-2">
                Based in
              </div>
              <div className="font-display text-xl">Budapest</div>
            </div>
          </div>
        </div>
      </section>

      {/* SERVICES */}
      <section id="services" className="border-t border-[#141414]/15">
        <div className="max-w-[1280px] mx-auto px-6 md:px-10 py-20 md:py-28">
          <div className="grid md:grid-cols-12 gap-8 mb-16">
            <div className="md:col-span-3">
              <div className="text-[11px] uppercase tracking-[0.25em] text-[#141414]/60 mb-4">
                § 01
              </div>
              <div className="text-[11px] uppercase tracking-[0.25em] text-[#141414]/60">
                Services
              </div>
            </div>
            <div className="md:col-span-8 md:col-start-5">
              <h2 className="font-display font-light text-4xl md:text-6xl leading-[1.05] tracking-[-0.01em]">
                A compact team, a <em className="italic">broad</em> mandate.
              </h2>
            </div>
          </div>

          <div className="grid md:grid-cols-2 border-t border-[#141414]/20">
            {services.map((s, i) => (
              <div
                key={s.no}
                className={`group p-8 md:p-10 border-b border-[#141414]/20 ${
                  i % 2 === 0 ? "md:border-r md:border-[#141414]/20" : ""
                } hover:bg-[#141414] hover:text-[#f4f1ec] transition-colors duration-300`}
              >
                <div className="flex items-start gap-6">
                  <div className="font-display text-sm opacity-60 pt-2">
                    {s.no}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-display text-2xl md:text-3xl mb-4 tracking-tight">
                      {s.title}
                    </h3>
                    <p className="text-sm md:text-base leading-relaxed opacity-75">
                      {s.body}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TECH STACK */}
      <section
        id="stack"
        className="border-t border-[#141414]/15 bg-[#141414] text-[#f4f1ec]"
      >
        <div className="max-w-[1280px] mx-auto px-6 md:px-10 py-20 md:py-28">
          <div className="grid md:grid-cols-12 gap-8 mb-16">
            <div className="md:col-span-3">
              <div className="text-[11px] uppercase tracking-[0.25em] opacity-50 mb-4">
                § 02
              </div>
              <div className="text-[11px] uppercase tracking-[0.25em] opacity-50">
                Technology
              </div>
            </div>
            <div className="md:col-span-8 md:col-start-5">
              <h2 className="font-display font-light text-4xl md:text-6xl leading-[1.05] tracking-[-0.01em]">
                Boring technology, <em className="italic">deliberately</em>{" "}
                chosen.
              </h2>
              <p className="mt-6 text-base leading-relaxed opacity-70 max-w-xl">
                We favour a consistent, well-understood stack across projects.
                It is faster to build, cheaper to maintain, and easier to hand
                over.
              </p>
            </div>
          </div>

          <div className="border-t border-[#f4f1ec]/20">
            {stack.map(([label, value]) => (
              <div
                key={label}
                className="grid grid-cols-12 gap-6 py-6 border-b border-[#f4f1ec]/20 items-baseline"
              >
                <div className="col-span-12 md:col-span-3 font-display text-xl">
                  {label}
                </div>
                <div className="col-span-12 md:col-span-9 text-sm md:text-base opacity-80 tracking-wide">
                  {value}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PROCESS */}
      <section id="process" className="border-t border-[#141414]/15">
        <div className="max-w-[1280px] mx-auto px-6 md:px-10 py-20 md:py-28">
          <div className="grid md:grid-cols-12 gap-8 mb-16">
            <div className="md:col-span-3">
              <div className="text-[11px] uppercase tracking-[0.25em] text-[#141414]/60 mb-4">
                § 03
              </div>
              <div className="text-[11px] uppercase tracking-[0.25em] text-[#141414]/60">
                Process
              </div>
            </div>
            <div className="md:col-span-8 md:col-start-5">
              <h2 className="font-display font-light text-4xl md:text-6xl leading-[1.05] tracking-[-0.01em]">
                How we <em className="italic">actually</em> work.
              </h2>
            </div>
          </div>

          <div className="grid md:grid-cols-4 gap-0 border-t border-[#141414]/20">
            {process.map((p, i) => (
              <div
                key={p.step}
                className={`p-8 md:p-10 border-b border-[#141414]/20 ${
                  i < process.length - 1
                    ? "md:border-r md:border-[#141414]/20"
                    : ""
                }`}
              >
                <div className="font-display text-5xl md:text-6xl opacity-20 mb-8">
                  {p.step}
                </div>
                <h3 className="font-display text-xl md:text-2xl mb-3 tracking-tight">
                  {p.title}
                </h3>
                <p className="text-sm leading-relaxed text-[#141414]/70">
                  {p.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA / CONTACT */}
      <section
        id="contact"
        className="relative border-t border-[#141414]/15 overflow-hidden"
      >
        <div className="absolute inset-0 grid-bg opacity-40 pointer-events-none" />
        <div className="relative max-w-[1280px] mx-auto px-6 md:px-10 py-24 md:py-36 text-center">
          <div className="text-[11px] uppercase tracking-[0.25em] text-[#141414]/60 mb-10">
            <span className="inline-block w-8 h-px bg-[#141414]/60 align-middle mr-3" />
            Next step
            <span className="inline-block w-8 h-px bg-[#141414]/60 align-middle ml-3" />
          </div>

          <h2 className="font-display font-light text-5xl md:text-8xl leading-[0.95] tracking-[-0.02em] max-w-[16ch] mx-auto">
            Have a project <em className="italic">worth</em> building?
          </h2>

          <p className="mt-10 text-base md:text-lg text-[#141414]/70 max-w-xl mx-auto leading-relaxed">
            Send a short description of the problem. You will receive a
            considered reply — not a templated brochure — within two business
            days.
          </p>

          <a
            href="mailto:hello@webjawa.com"
            className="group inline-flex items-center gap-4 mt-12 border-b border-[#141414] pb-2"
          >
            <span className="font-display text-2xl md:text-4xl tracking-tight">
              hello@webjawa.com
            </span>
            <span className="transition-transform group-hover:translate-x-1 text-2xl">
              →
            </span>
          </a>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-[#141414]/15">
        <div className="max-w-[1280px] mx-auto px-6 md:px-10 py-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 text-sm">
          <div className="flex items-baseline gap-3">
            <span className="font-display text-lg">Webjawa</span>
            <span className="text-[#141414]/50">
              © {new Date().getFullYear()}
            </span>
          </div>
          <div className="flex items-center gap-6 text-[#141414]/60">
            <span>Budapest, Hungary</span>
            <span className="hidden md:inline">·</span>
            <a
              href="mailto:hello@webjawa.com"
              className="hover:text-[#141414] transition-colors"
            >
              hello@webjawa.com
            </a>
          </div>
        </div>
      </footer>
    </main>
  );
};

export default Page;
