import React, { useEffect, useRef } from 'react';
import { GraduationCap, CheckCircle2, ShieldCheck } from 'lucide-react';

const FEATURES = [
  'Affiliation & Student Registration',
  'Comprehensive Academic Records',
  'Curriculum & Course Selection',
  'Personalized Student Dashboards',
  'Downloadable Mark Lists & Grade Sheets',
  'Secure University Communication',
  'Master Data & Cluster Management',
  'Examination & Evaluation Planning',
];

const BrandingPanel: React.FC = () => {
  const featureRefs = useRef<(HTMLLIElement | null)[]>([]);

  useEffect(() => {
    // Staggered entrance for features
    featureRefs.current.forEach((el, idx) => {
      if (el) {
        el.style.animationDelay = `${0.6 + idx * 0.1}s`;
      }
    });
  }, []);

  return (
    <div
      className="relative h-full w-full flex flex-col justify-between overflow-hidden select-none"
      style={{
        background: 'linear-gradient(160deg, #1E3A5F 0%, #0F1F3A 60%, #0A1628 100%)',
      }}
    >
      {/* ── Inner shadow for depth ── */}
      <div
        className="absolute inset-0 pointer-events-none z-[1]"
        style={{
          boxShadow: 'inset -20px 0 40px -20px rgba(0,0,0,0.15), inset 0 -20px 40px -20px rgba(0,0,0,0.1)',
        }}
      />

      {/* ── Diagonal gradient overlay ── */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'linear-gradient(135deg, rgba(255,255,255,0.03) 0%, transparent 50%, rgba(0,0,0,0.08) 100%)',
        }}
      />

      {/* ── Floating decorative orbs ── */}
      <div
        className="floating absolute rounded-full pointer-events-none"
        style={{
          top: '-8%',
          left: '-12%',
          width: '280px',
          height: '280px',
          background: 'radial-gradient(circle, rgba(255,255,255,0.06) 0%, transparent 70%)',
        }}
      />
      <div
        className="floating-slow absolute rounded-full pointer-events-none"
        style={{
          bottom: '-10%',
          right: '-14%',
          width: '340px',
          height: '340px',
          background: 'radial-gradient(circle, rgba(201,169,97,0.08) 0%, transparent 70%)',
        }}
      />
      <div
        className="floating-med absolute rounded-full pointer-events-none"
        style={{
          top: '35%',
          right: '5%',
          width: '140px',
          height: '140px',
          background: 'radial-gradient(circle, rgba(255,255,255,0.04) 0%, transparent 70%)',
        }}
      />
      {/* Small accent orb */}
      <div
        className="floating absolute rounded-full pointer-events-none"
        style={{
          top: '20%',
          left: '60%',
          width: '60px',
          height: '60px',
          background: 'radial-gradient(circle, rgba(201,169,97,0.06) 0%, transparent 70%)',
          animationDuration: '12s',
          animationDelay: '2s',
        }}
      />

      {/* ── Kerala-inspired dot lattice ── */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          opacity: 0.06,
          backgroundImage:
            'radial-gradient(circle at 1.5px 1.5px, white 1px, transparent 0)',
          backgroundSize: '36px 36px',
        }}
      />

      {/* ── Diagonal accent lines ── */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'linear-gradient(135deg, transparent 46%, rgba(201,169,97,0.03) 47%, rgba(201,169,97,0.03) 53%, transparent 54%)',
        }}
      />
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'linear-gradient(135deg, transparent 66%, rgba(255,255,255,0.02) 67%, rgba(255,255,255,0.02) 73%, transparent 74%)',
        }}
      />

      {/* ── Main Content ── */}
      <div className="relative z-10 p-10 xl:p-12 flex flex-col h-full">
        {/* Top: Logo + Branding */}
        <div>
          {/* Logo Badge */}
          {/* Logo Badge */}
          <div
            className="w-[90px] h-[90px] flex items-center justify-center mb-8 cursor-default"
            style={{
              transition: 'transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)',
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLDivElement).style.transform = 'scale(1.1) rotate(-2deg)';
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLDivElement).style.transform = 'scale(1) rotate(0deg)';
            }}
          >
            <img
              src="/ktu-logo.png"
              alt="KTU Logo"
              className="w-full h-full object-contain rounded-2xl"
              style={{
                filter: 'drop-shadow(0 0 2px #fff) drop-shadow(0 0 1px #fff)',
              }}
            />
          </div>

          {/* University Name */}
          <h1
            className="font-serif font-bold leading-[1.08] mb-4"
            style={{ fontSize: 'clamp(1.8rem, 2.5vw, 2.75rem)', color: '#fff' }}
          >
            APJ Abdul Kalam
            <br />
            <span style={{ color: '#C9A961' }}>Technological University</span>
          </h1>

          <p
            className="text-lg font-medium italic mb-12"
            style={{ color: 'rgba(255,255,255,0.6)' }}
          >
            "Empowering the Next Generation of Innovators"
          </p>

          {/* Feature List — staggered entrance */}
          <ul className="space-y-3.5">
            {FEATURES.map((feature, idx) => (
              <li
                key={idx}
                ref={(el) => { featureRefs.current[idx] = el; }}
                className="feature-enter flex items-center gap-4 group"
              >
                <div
                  className="flex-shrink-0 w-9 h-9 rounded-full flex items-center justify-center"
                  style={{
                    background: 'rgba(255,255,255,0.08)',
                    transition: 'background 0.3s ease, transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
                  }}
                  onMouseEnter={(e) => {
                    const el = e.currentTarget as HTMLDivElement;
                    el.style.background = 'rgba(201,169,97,0.25)';
                    el.style.transform = 'scale(1.15)';
                  }}
                  onMouseLeave={(e) => {
                    const el = e.currentTarget as HTMLDivElement;
                    el.style.background = 'rgba(255,255,255,0.08)';
                    el.style.transform = 'scale(1)';
                  }}
                >
                  <CheckCircle2
                    size={18}
                    color="#C9A961"
                    strokeWidth={2.4}
                  />
                </div>
                <span
                  className="text-base font-medium tracking-wide"
                  style={{ color: 'rgba(255,255,255,0.88)' }}
                >
                  {feature}
                </span>
              </li>
            ))}
          </ul>
        </div>

        {/* Bottom: Badge + Footer + Version */}
        <div className="mt-auto pt-10">
          {/* Secure Access Badge */}
          <div
            className="inline-flex items-center gap-2.5 px-4 py-2.5 rounded-xl mb-6"
            style={{
              background: 'rgba(255,255,255,0.06)',
              border: '1px solid rgba(255,255,255,0.1)',
              backdropFilter: 'blur(8px)',
              transition: 'background 0.3s ease',
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLDivElement).style.background = 'rgba(255,255,255,0.1)';
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLDivElement).style.background = 'rgba(255,255,255,0.06)';
            }}
          >
            <ShieldCheck size={18} color="#C9A961" strokeWidth={2.2} />
            <span
              className="text-xs font-semibold tracking-[0.15em] uppercase"
              style={{ color: 'rgba(255,255,255,0.85)' }}
            >
              Official e-Governance Gateway
            </span>
          </div>

          {/* Copyright + Version */}
          <div
            className="pt-5 flex items-center justify-between"
            style={{ borderTop: '1px solid rgba(255,255,255,0.08)' }}
          >
            <p
              className="text-sm font-medium"
              style={{ color: 'rgba(255,255,255,0.35)' }}
            >
              © 2024 APJ Abdul Kalam Technological University
            </p>
            <span
              className="text-xs font-medium animate-fade-in"
              style={{
                color: 'rgba(255,255,255,0.25)',
                animationDelay: '1.2s',
                opacity: 0,
                animationFillMode: 'forwards',
              }}
            >
              v2.4.1
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BrandingPanel;
