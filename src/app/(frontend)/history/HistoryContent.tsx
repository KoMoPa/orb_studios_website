'use client'

import React, { useRef } from 'react'
import { ParallaxProvider, Parallax } from 'react-scroll-parallax'

// ─── Design tokens ──────────────────────────────────────────────────────────
const bg        = '#131210'   // near-black warm
const bgAlt     = '#1a1814'   // slightly lighter warm
const amber     = '#b89a6a'   // warm gold accent
const amberDim  = '#7c6645'   // muted gold
const textPrime = '#e8e0d4'   // off-white, warm
const textMuted = '#8a7f72'   // muted warm grey

// ─── Placeholder images ──────────────────────────────────────────────────────
// Replace each path with the real CMS media URL once assets are uploaded.
// Using placehold.co for local development splashes.
const IMAGES = {
  hero:      'https://placehold.co/1920x1080/131210/b89a6a?text=Hero',
  gallery01: 'https://placehold.co/800x1100/181512/b89a6a?text=Gallery+Era+I+Left',
  gallery02: 'https://placehold.co/800x1100/131210/7c6645?text=Gallery+Era+I+Right',
  gallery03: 'https://placehold.co/800x900/181512/7c6645?text=Backroom+Left',
  gallery04: 'https://placehold.co/800x900/131210/b89a6a?text=Backroom+Right',
  gallery05: 'https://placehold.co/800x1000/181512/b89a6a?text=Studio+I+Left',
  gallery06: 'https://placehold.co/800x1000/131210/7c6645?text=Studio+I+Right',
  gallery07: 'https://placehold.co/800x950/181512/7c6645?text=Growth+Left',
  gallery08: 'https://placehold.co/800x950/131210/b89a6a?text=Growth+Right',
  gallery09: 'https://placehold.co/800x1050/181512/b89a6a?text=Art+Walls+Left',
  gallery10: 'https://placehold.co/800x1050/131210/7c6645?text=Art+Walls+Right',
  gallery11: 'https://placehold.co/800x1000/181512/7c6645?text=Commercial+Left',
  gallery12: 'https://placehold.co/800x1000/131210/b89a6a?text=Commercial+Right',
  landing:   'https://placehold.co/1920x1080/131210/b89a6a?text=Orb+Studios+Today',
}

// ─── Timeline eras ──────────────────────────────────────────────────────────
const eras = [
  {
    year: '2011 – 2014',
    era: 'I',
    title: 'The Gallery Years',
    body: `Long before the first microphone stand was ever unfolded here, this space breathed as an art gallery. The walls — which still carry that legacy today — were hung with the work of local painters, photographers, and installation artists. Sunday openings. Wine on folding tables. Music drifting from a battered turntable in the corner. The building had a pulse; it just hadn't found its rhythm yet.`,
    imageLeft:  IMAGES.gallery01,
    imageRight: IMAGES.gallery02,
    altLeft:    'Art gallery walls lined with paintings, warm afternoon light',
    altRight:   'Installation art piece, soft gallery lighting',
    active: 'left' as const,
  },
  {
    year: '2014 – 2016',
    era: 'II',
    title: 'The Backroom',
    body: `Someone dragged in a Tascam four-track. Then a condenser mic. Then a drum kit that barely fit. The gallery's back room quietly became the neighbourhood's worst-kept secret — a roughed-in recording hideout where bands tracked demos between show posters still pinned to the brick. No acoustic treatment, no control room. Just drive, a bit of foam, and the unmistakeable smell of solder.`,
    imageLeft:  IMAGES.gallery03,
    imageRight: IMAGES.gallery04,
    altLeft:    'Vintage four-track recorder on a wooden table, warm lamp light',
    altRight:   'Brick backroom, drum kit in the corner, show posters on the wall',
    active: 'right' as const,
  },
  {
    year: '2016 – 2018',
    era: 'III',
    title: 'First Dedicated Studio',
    body: `The gallery lease ended and the music stayed. The front space was subdivided: a proper live room emerged with a floating floor, rockwool panels, and a second-hand SSL desk picked up from a closing commercial room downtown. Bands started booking real sessions. The artwork from the gallery years moved to the studio walls — framed now, permanent, a reminder of where this all started.`,
    imageLeft:  IMAGES.gallery05,
    imageRight: IMAGES.gallery06,
    altLeft:    'Early acoustic panels being installed, raw studio build-out',
    altRight:   'Art on studio walls, SSL console, warm overhead lighting',
    active: 'left' as const,
  },
  {
    year: '2018 – 2020',
    era: 'IV',
    title: 'Growing the Walls',
    body: `Word got around. The roster of regulars grew — rappers, rock bands, film composers, podcast hosts. A second control room was carved out of the storage space. The gear list expanded: outboard compressors, a proper patchbay, acoustic guitars on hooks, keyboards stacked in the corner. More art went up on every available surface. The walls became a living archive of everyone who'd ever worked here.`,
    imageLeft:  IMAGES.gallery07,
    imageRight: IMAGES.gallery08,
    altLeft:    'Expanded control room, patchbay wiring, studio monitors',
    altRight:   'Art-covered studio wall, guitars hanging, warm fill light',
    active: 'right' as const,
  },
  {
    year: '2020 – 2022',
    era: 'V',
    title: 'The Art on the Walls',
    body: `Every piece of artwork in this studio has a story. The large collage above the live room door was made by a painter who traded it for three weeks of studio time. The oil portrait near the console belonged to a jazz drummer who left it as a gift after tracking his first solo record here. The murals in the isolation booth were commissioned from a local muralist the same summer ORB went all-analogue on the tracking chain. These aren't decorations — they're a second history hanging in plain sight.`,
    imageLeft:  IMAGES.gallery09,
    imageRight: IMAGES.gallery10,
    altLeft:    'Large collage above a studio doorway, bold colours',
    altRight:   'Oil portrait near studio console, warm dramatic light',
    active: 'left' as const,
  },
  {
    year: '2022 – 2024',
    era: 'VI',
    title: 'Full Commercial Operations',
    body: `ORB became a fully commercial facility: 32 analogue inputs, Allen & Heath console, world-class monitoring, monthly membership tiers, and a booking system that finally kept up with demand. The Jam Room and Mixing Room were acoustically tuned to hit industry standards. Engineers, producers, and artists from across the GTA — and beyond — started making it a base camp. The backroom four-track was framed and hung on the wall beside the art. Some things deserve to stay.`,
    imageLeft:  IMAGES.gallery11,
    imageRight: IMAGES.gallery12,
    altLeft:    'Allen & Heath console, professional mixing setup',
    altRight:   'Jam room with full drum kit, amp wall, treated ceiling',
    active: 'right' as const,
  },
]

// ─── Sub-components ──────────────────────────────────────────────────────────

function RuledLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-4 mb-5">
      <div className="h-px flex-1" style={{ backgroundColor: amber, opacity: 0.25 }} />
      <span
        className="text-xs tracking-[0.35em] uppercase"
        style={{ color: amber, fontFamily: 'var(--font-geist-mono)' }}
      >
        {children}
      </span>
      <div className="h-px flex-1" style={{ backgroundColor: amber, opacity: 0.25 }} />
    </div>
  )
}

function EraCard({
  year,
  era,
  title,
  body,
}: {
  year: string
  era: string
  title: string
  body: string
}) {
  return (
    <div className="w-full max-w-md mx-auto px-4 py-8 text-center">
      {/* Era numeral */}
      <p
        className="text-7xl font-bold mb-1 leading-none select-none"
        style={{
          color: amber,
          opacity: 0.12,
          fontFamily: 'var(--font-geist-mono)',
          letterSpacing: '-0.04em',
        }}
        aria-hidden
      >
        {era}
      </p>

      {/* Year */}
      <p
        className="text-xs tracking-[0.35em] uppercase mt-1 mb-4"
        style={{ color: amberDim, fontFamily: 'var(--font-geist-mono)' }}
      >
        {year}
      </p>

      {/* Title */}
      <h2
        className="vinyl text-3xl md:text-4xl mb-5 leading-tight"
        style={{ color: textPrime }}
      >
        {title}
      </h2>

      {/* Divider */}
      <div className="w-10 h-px mx-auto mb-5" style={{ backgroundColor: amber, opacity: 0.45 }} />

      {/* Body */}
      <p
        className="text-sm md:text-base leading-relaxed"
        style={{ color: textMuted, fontFamily: 'var(--font-geist-sans)' }}
      >
        {body}
      </p>
    </div>
  )
}

interface EraRowProps {
  era: (typeof eras)[number]
  index: number
}

function EraRow({ era, index }: EraRowProps) {
  // Both images fall at the same constant speed (rhythmic cascade).
  // Active image starts near the section top → it's centered first.
  // Passive image starts ~55% down → it arrives at center in the second half.
  // Section is tall enough that both images complete their arc inside the frame.
  const SPEED = 80
  const leftMarginTop  = era.active === 'left'  ? '2%' : '52%'
  const rightMarginTop = era.active === 'right' ? '2%' : '52%'

  return (
    <div
      className="relative grid grid-cols-[1fr_auto_1fr] items-start gap-0 overflow-hidden"
      style={{
        minHeight: '100vh',
        backgroundColor: index % 2 === 0 ? bg : bgAlt,
      }}
    >
      {/* ── Vertical timeline thread ──────────────────────────── */}
      <div
        className="absolute left-1/2 top-0 bottom-0 -translate-x-1/2 w-px pointer-events-none"
        style={{ backgroundColor: amber, opacity: 0.08 }}
        aria-hidden
      />

      {/* ── Left image column ─────────────────────────────────── */}
      <div className="relative w-full flex justify-end pr-6 pt-12 pb-12">
        <Parallax
          speed={SPEED}
          className="relative"
          style={{ width: 'min(320px, 42vw)', marginTop: leftMarginTop }}
        >
          {/* Image frame with amber border accent */}
          <div
            className="relative overflow-hidden"
            style={{
              border: `1px solid`,
              borderColor: era.active === 'left'
                ? `${amber}55`
                : `${amber}1a`,
              boxShadow: era.active === 'left'
                ? `0 24px 64px rgba(0,0,0,0.6), 0 0 0 1px ${amber}22`
                : `0 8px 24px rgba(0,0,0,0.4)`,
            }}
          >
            <img
              src={era.imageLeft}
              alt={era.altLeft}
              className="w-full object-cover display-block"
              style={{
                filter: era.active === 'left'
                  ? 'sepia(15%) brightness(0.85) contrast(1.05)'
                  : 'sepia(25%) brightness(0.65) contrast(1.0)',
                aspectRatio: '3/4',
              }}
            />
            {/* Bottom caption bar on the active image */}
            {era.active === 'left' && (
              <div
                className="absolute bottom-0 left-0 right-0 px-3 py-2"
                style={{ background: 'linear-gradient(transparent, rgba(0,0,0,0.75))' }}
              >
                <p
                  className="text-xs tracking-widest uppercase text-right"
                  style={{ color: amber, fontFamily: 'var(--font-geist-mono)', opacity: 0.8 }}
                >
                  {era.year}
                </p>
              </div>
            )}
          </div>
        </Parallax>
      </div>

      {/* ── Center text ───────────────────────────────────────── */}
      <div
        className="sticky self-start flex items-start justify-center z-10"
        style={{ top: '30vh', width: 'min(360px, 28vw)', minWidth: '220px' }}
      >
        {/* Connector dots on the timeline */}
        <div
          className="absolute left-1/2 top-6 -translate-x-1/2 w-2 h-2 rounded-full"
          style={{ backgroundColor: amber, opacity: 0.55, boxShadow: `0 0 10px ${amber}88` }}
          aria-hidden
        />
        <EraCard {...era} />
      </div>

      {/* ── Right image column ────────────────────────────────── */}
      <div className="relative w-full flex justify-start pl-6 pt-12 pb-12">
        <Parallax
          speed={SPEED}
          className="relative"
          style={{ width: 'min(320px, 42vw)', marginTop: rightMarginTop }}
        >
          <div
            className="relative overflow-hidden"
            style={{
              border: `1px solid`,
              borderColor: era.active === 'right'
                ? `${amber}55`
                : `${amber}1a`,
              boxShadow: era.active === 'right'
                ? `0 24px 64px rgba(0,0,0,0.6), 0 0 0 1px ${amber}22`
                : `0 8px 24px rgba(0,0,0,0.4)`,
            }}
          >
            <img
              src={era.imageRight}
              alt={era.altRight}
              className="w-full object-cover display-block"
              style={{
                filter: era.active === 'right'
                  ? 'sepia(15%) brightness(0.85) contrast(1.05)'
                  : 'sepia(25%) brightness(0.65) contrast(1.0)',
                aspectRatio: '3/4',
              }}
            />
            {era.active === 'right' && (
              <div
                className="absolute bottom-0 left-0 right-0 px-3 py-2"
                style={{ background: 'linear-gradient(transparent, rgba(0,0,0,0.75))' }}
              >
                <p
                  className="text-xs tracking-widest uppercase text-right"
                  style={{ color: amber, fontFamily: 'var(--font-geist-mono)', opacity: 0.8 }}
                >
                  {era.year}
                </p>
              </div>
            )}
          </div>
        </Parallax>
      </div>
    </div>
  )
}

// ─── Main component ──────────────────────────────────────────────────────────

export function HistoryContent() {
  return (
    <ParallaxProvider>

      {/* ══ HERO ══════════════════════════════════════════════════════════ */}
      <section
        className="relative flex items-end justify-center overflow-hidden"
        style={{ minHeight: '100vh', backgroundColor: bg }}
      >
        {/* Background image */}
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `url(${IMAGES.hero})`,
            backgroundAttachment: 'fixed',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            filter: 'brightness(0.35) sepia(30%)',
          }}
        />

        {/* Gradient fade-to-dark at bottom so timeline feels like it emerges */}
        <div
          className="absolute inset-x-0 bottom-0 h-64 pointer-events-none"
          style={{ background: `linear-gradient(transparent, ${bg})` }}
        />

        {/* Radial amber glow */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse at 50% 60%, rgba(184,154,106,0.08) 0%, transparent 65%)' }}
        />

        {/* Content */}
        <Parallax translateY={['0px', '-80px']} opacity={[1, 0]} shouldAlwaysCompleteAnimation className="relative z-10 w-full pb-24">
          <div className="max-w-4xl mx-auto px-6 text-center">
            <p
              className="text-xs tracking-[0.4em] uppercase mb-6"
              style={{ color: amber, fontFamily: 'var(--font-geist-mono)' }}
            >
              Orb Studios · Etobicoke
            </p>

            <div className="flex items-center gap-6 mb-4">
              <div className="flex-1 h-px" style={{ backgroundColor: amber, opacity: 0.2 }} />
              <h1
                className="vinyl text-5xl sm:text-6xl md:text-8xl text-white leading-none"
                style={{ letterSpacing: '-0.01em' }}
              >
                Our History
              </h1>
              <div className="flex-1 h-px" style={{ backgroundColor: amber, opacity: 0.2 }} />
            </div>

            <p
              className="text-sm md:text-base max-w-xl mx-auto mt-6 leading-relaxed"
              style={{ color: textMuted, fontFamily: 'var(--font-geist-sans)' }}
            >
              From an art gallery with a beat-up turntable to a full commercial recording facility —
              every wall, every wire, every frame tells part of the same story.
            </p>
          </div>
        </Parallax>

        {/* Scroll cue */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 pointer-events-none">
          <Parallax opacity={[1, 0]} shouldAlwaysCompleteAnimation>
            <div className="flex flex-col items-center gap-2" style={{ color: amberDim }}>
              <span style={{ fontFamily: 'var(--font-geist-mono)', fontSize: '0.65rem', letterSpacing: '0.28em' }}>
                SCROLL
              </span>
              <div className="animate-bounce">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </Parallax>
        </div>
      </section>

      {/* ══ WATERFALL TIMELINE ════════════════════════════════════════════ */}
      {eras.map((era, i) => (
        <EraRow key={era.era} era={era} index={i} />
      ))}

      {/* ══ LANDING — WHERE WE ARE NOW ════════════════════════════════════ */}
      <section
        className="relative overflow-hidden"
        style={{ backgroundColor: bg, minHeight: '100vh' }}
      >
        {/* Full-bleed background image */}
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `url(${IMAGES.landing})`,
            backgroundAttachment: 'fixed',
            backgroundSize: 'cover',
            backgroundPosition: 'center 40%',
            filter: 'brightness(0.3) sepia(20%)',
          }}
        />

        {/* Top fade-in from the last timeline section */}
        <div
          className="absolute inset-x-0 top-0 h-40 pointer-events-none"
          style={{ background: `linear-gradient(${bg}, transparent)` }}
        />

        {/* Bottom vignette */}
        <div
          className="absolute inset-x-0 bottom-0 h-64 pointer-events-none"
          style={{ background: `linear-gradient(transparent, ${bg})` }}
        />

        {/* Amber radial bloom */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse at 50% 50%, rgba(184,154,106,0.1) 0%, transparent 60%)' }}
        />

        {/* Three stat columns */}
        <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-6 py-24 text-center">

          <RuledLabel>Where We Are Now</RuledLabel>

          <h2
            className="vinyl text-4xl sm:text-5xl md:text-7xl text-white leading-tight mb-6 max-w-3xl"
            style={{ letterSpacing: '-0.01em' }}
          >
            Orb Studios,<br />2025
          </h2>

          <div className="w-12 h-px mx-auto mb-8" style={{ backgroundColor: amber, opacity: 0.5 }} />

          <p
            className="text-sm md:text-lg max-w-2xl mx-auto leading-relaxed mb-16"
            style={{ color: textMuted }}
          >
            ORB Studios is a fully commercial recording and rehearsal facility in Etobicoke, Toronto.
            Two acoustically treated rooms, 32 analogue inputs, an Allen &amp; Heath console, and walls
            covered in fourteen years of local art — every piece earned, every piece staying. We offer
            hourly, daily, and monthly membership options for artists, engineers, and bands at every
            stage of their career.
          </p>

          {/* Stat grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12 w-full max-w-3xl">
            {[
              { stat: '14', label: 'Years in the building' },
              { stat: '32', label: 'Analogue inputs' },
              { stat: '2',  label: 'Treated live rooms' },
              { stat: '∞',  label: 'Art on the walls' },
            ].map(({ stat, label }) => (
              <div key={label} className="flex flex-col items-center gap-2">
                <p
                  className="text-5xl md:text-6xl leading-none"
                  style={{ color: amber, fontFamily: 'var(--font-geist-mono)', letterSpacing: '-0.03em' }}
                >
                  {stat}
                </p>
                <p
                  className="text-xs tracking-widest uppercase"
                  style={{ color: amberDim, fontFamily: 'var(--font-geist-mono)' }}
                >
                  {label}
                </p>
              </div>
            ))}
          </div>

          {/* CTA */}
          <div className="mt-16 flex flex-col sm:flex-row items-center gap-4">
            <a
              href="/booking"
              className="inline-block px-8 py-3 text-sm tracking-widest uppercase transition-opacity hover:opacity-80"
              style={{
                border: `1px solid ${amber}`,
                color: amber,
                fontFamily: 'var(--font-geist-mono)',
                letterSpacing: '0.2em',
              }}
            >
              Book a Session
            </a>
            <a
              href="/rooms"
              className="inline-block px-8 py-3 text-sm tracking-widest uppercase transition-opacity hover:opacity-80"
              style={{
                color: textMuted,
                fontFamily: 'var(--font-geist-mono)',
                letterSpacing: '0.2em',
                border: `1px solid ${amber}22`,
              }}
            >
              Explore the Rooms
            </a>
          </div>

        </div>
      </section>

    </ParallaxProvider>
  )
}
