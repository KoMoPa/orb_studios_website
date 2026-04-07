'use client'

import React from 'react'
import { ParallaxProvider, Parallax } from 'react-scroll-parallax'
import { FormBlock } from '@/blocks/Form/Component'
import type { Form } from '@payloadcms/plugin-form-builder/types'

interface MonthlyRentalContentProps {
  form?: Form
}

const features = [
  {
    num: '01',
    title: '24 Hours of Studio Time',
    subtitle: 'Each Month',
    body: 'Book whenever works best—24/7 availability. Use your hours in any configuration: quick 2-hour rehearsals, half-day recording sessions, full mixing days, or 24-hour lockouts for intensive projects. Total flexibility.',
  },
  {
    num: '02',
    title: 'Complete Access',
    subtitle: 'Jam Room & Mixing Room',
    body: 'Both rooms included. Rehearse and write in the Jam Room, then move to the Mixing Room for production and post. Take your projects from initial ideas through final mixes—all in-house.',
  },
  {
    num: '03',
    title: '50% Off Additional Hours',
    subtitle: 'For Members Only',
    body: 'Need more than your monthly 24 hours? Members get half off our standard hourly rate for any extra bookings. Extend sessions or book additional time without breaking your budget.',
  },
  {
    num: '04',
    title: 'Secure Gear Storage',
    subtitle: 'On-Site',
    body: 'Store your amps, drums, and equipment on-site. No more hauling heavy gear—your equipment stays safe, secure, and ready to go. Save time on setup and teardown so you can focus on creating.',
  },
] as const

// Warm-dark colour tokens used throughout
const bg1 = '#181512'   // primary dark
const bg2 = '#201d18'   // secondary dark
const amber = '#b89a6a' // warm accent

export const MonthlyRentalContent: React.FC<MonthlyRentalContentProps> = ({ form }) => {
  const filteredForm = form
    ? {
        ...form,
        fields: form.fields?.filter((field) => field.blockType !== 'checkbox') || [],
      }
    : undefined

  return (
    <ParallaxProvider>

      {/* ── HERO ─────────────────────────────────────────────────────── */}
      <section
        className="relative h-screen flex items-center justify-center overflow-hidden"
        style={{ backgroundColor: bg1 }}
      >
        {/* Warm amber vignette instead of cold red glow */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse at center, rgba(184,154,106,0.07) 0%, transparent 60%)' }}
        />

        <div className="relative z-10 text-center px-6 w-full max-w-6xl mx-auto">
          <Parallax translateY={['0px', '-80px']} opacity={[1, 0]} shouldAlwaysCompleteAnimation>
            {/* Small label above title */}
            <p
              className="text-sm tracking-[0.35em] uppercase mb-8"
              style={{ color: amber, fontFamily: 'var(--font-geist-mono)' }}
            >
              Orb Studios · Membership
            </p>

            {/* Hairline rules flanking the title */}
            <div className="flex items-center gap-6 mb-6 px-4">
              <div className="flex-1 h-px" style={{ backgroundColor: amber, opacity: 0.25 }} />
              <h1
                className="vinyl text-5xl md:text-7xl lg:text-[6.5rem] text-white leading-tight"
                style={{ letterSpacing: '-0.01em' }}
              >
                All-Inclusive<br />Monthly Rental
              </h1>
              <div className="flex-1 h-px" style={{ backgroundColor: amber, opacity: 0.25 }} />
            </div>

            
          </Parallax>
        </div>

        {/* Scroll cue */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10 pointer-events-none">
          <Parallax opacity={[1, 0]} shouldAlwaysCompleteAnimation>
            <div className="flex flex-col items-center gap-2" style={{ color: '#4a4035' }}>
              <span style={{ fontFamily: 'var(--font-geist-mono)', fontSize: '0.715rem', letterSpacing: '0.25em' }}>
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

      {/* ── PARALLAX IMAGE GALLERY ───────────────────────────────────── */}
      <section
        className="relative overflow-hidden"
        style={{ height: '85vh', backgroundColor: bg1 }}
      >
        <div className="absolute inset-0 flex gap-2 p-2">
          {/* Col 1 — speed 4 */}
          <Parallax speed={4} className="flex-1 flex flex-col gap-2" style={{ marginTop: '-18%' }}>
            <div style={{ height: '55vh' }} className="overflow-hidden">
              <img src="/api/media/file/liveroom1.jpg" alt="" className="w-full h-full object-cover" style={{ filter: 'sepia(20%) brightness(0.88)' }} />
            </div>
            <div style={{ height: '55vh' }} className="overflow-hidden">
              <img src="/api/media/file/controlroom3.jpg" alt="" className="w-full h-full object-cover" style={{ filter: 'sepia(20%) brightness(0.88)' }} />
            </div>
          </Parallax>

          {/* Col 2 — speed -6 */}
          <Parallax speed={-6} className="flex-1 flex flex-col gap-2" style={{ marginTop: '-8%' }}>
            <div style={{ height: '40vh' }} className="overflow-hidden">
              <img src="/api/media/file/controlroom1.jpg" alt="" className="w-full h-full object-cover" style={{ filter: 'sepia(20%) brightness(0.88)' }} />
            </div>
            <div style={{ height: '40vh' }} className="overflow-hidden">
              <img src="/api/media/file/liveroom3.jpg" alt="" className="w-full h-full object-cover" style={{ filter: 'sepia(20%) brightness(0.88)' }} />
            </div>
            <div style={{ height: '40vh' }} className="overflow-hidden">
              <img src="/api/media/file/liveroom5.jpg" alt="" className="w-full h-full object-cover" style={{ filter: 'sepia(20%) brightness(0.88)' }} />
            </div>
          </Parallax>

          {/* Col 3 — speed -14 */}
          <Parallax speed={-14} className="flex-1 flex flex-col gap-2" style={{ marginTop: '-28%' }}>
            <div style={{ height: '55vh' }} className="overflow-hidden">
              <img src="/api/media/file/liveroom2.jpg" alt="" className="w-full h-full object-cover" style={{ filter: 'sepia(20%) brightness(0.88)' }} />
            </div>
            <div style={{ height: '55vh' }} className="overflow-hidden">
              <img src="/api/media/file/controlroom4.jpg" alt="" className="w-full h-full object-cover" style={{ filter: 'sepia(20%) brightness(0.88)' }} />
            </div>
          </Parallax>

          {/* Col 4 — speed 10 */}
          <Parallax speed={10} className="flex-1 flex flex-col gap-2" style={{ marginTop: '-12%' }}>
            <div style={{ height: '48vh' }} className="overflow-hidden">
              <img src="/api/media/file/liveroom4.jpg" alt="" className="w-full h-full object-cover" style={{ filter: 'sepia(20%) brightness(0.88)' }} />
            </div>
            <div style={{ height: '48vh' }} className="overflow-hidden">
              <img src="/api/media/file/controlroom2.jpg" alt="" className="w-full h-full object-cover" style={{ filter: 'sepia(20%) brightness(0.88)' }} />
            </div>
          </Parallax>
        </div>

        {/* Fade to pricing */}
        <div
          className="absolute bottom-0 left-0 right-0 h-40 pointer-events-none"
          style={{ background: `linear-gradient(to top, #8B1A1A, transparent)` }}
        />
      </section>

      {/* ── RATE CARD ────────────────────────────────────────────────── */}
      <div className="py-20 px-4 text-center" style={{ backgroundColor: '#8B1A1A' }}>
        <Parallax translateY={['40px', '0px']} opacity={[0, 1]} easing="easeOutQuart">
          <p
            className="text-sm tracking-[0.35em] uppercase mb-10"
            style={{ color: 'rgba(255,255,255,0.45)', fontFamily: 'var(--font-geist-mono)' }}
          >
            Monthly Rate
          </p>

          {/* Rate card box */}
          <div
            className="inline-block px-12 py-10 mx-auto"
            style={{ border: '1px solid rgba(255,255,255,0.2)' }}
          >
            <div className="flex items-start justify-center gap-1">
              <span className="text-white/60 text-[1.65rem] font-light mt-2">$</span>
              <span className="spraypaint text-8xl md:text-9xl text-white leading-none">400</span>
            </div>
            <div className="mt-3 h-px w-24 mx-auto" style={{ backgroundColor: 'rgba(255,255,255,0.2)' }} />
            <p className="mt-3 text-base tracking-[0.15em] uppercase" style={{ color: 'rgba(255,255,255,0.5)', fontFamily: 'var(--font-geist-mono)' }}>
              per month + GST / HST
            </p>
          </div>

          <p className="mt-10 max-w-lg mx-auto text-[1.1rem] leading-relaxed" style={{ color: 'rgba(255,255,255,0.6)' }}>
            No hidden fees. No nickel-and-diming. Complete facility access and everything you need to
            create—one predictable monthly rate.
          </p>
        </Parallax>
      </div>

      {/* ── WHAT YOU GET ─────────────────────────────────────────────── */}
      <div className="py-24 px-4" style={{ backgroundColor: bg1 }}>
        {/* Section header with ruled lines */}
        <Parallax translateY={['30px', '0px']} opacity={[0, 1]} easing="easeOutQuart">
          <div className="flex items-center gap-6 max-w-5xl mx-auto mb-20">
            <div className="flex-1 h-px" style={{ backgroundColor: '#2c2520' }} />
            <div className="text-center">
              <h2 className="vinyl text-4xl md:text-5xl text-white">What You Get</h2>
            </div>
            <div className="flex-1 h-px" style={{ backgroundColor: '#2c2520' }} />
          </div>
        </Parallax>

        {/* Feature list — track-sheet style */}
        <div className="max-w-5xl mx-auto divide-y" style={{ borderColor: '#2c2520' }}>
          {features.map(({ num, title, subtitle, body }, i) => (
            <Parallax
              key={num}
              translateY={[`${36 + i * 6}px`, '0px']}
              opacity={[0, 1]}
              easing="easeOutQuart"
            >
              <div className="flex gap-8 py-10">
                <div>
                  <h3 className="text-white font-semibold text-lg mb-0.5">{title}</h3>
                  <p
                    className="text-sm tracking-[0.15em] uppercase mb-3"
                    style={{ color: amber, fontFamily: 'var(--font-geist-mono)' }}
                  >
                    {subtitle}
                  </p>
                  <p className="text-base leading-relaxed" style={{ color: '#8a7f72' }}>{body}</p>
                </div>
              </div>
            </Parallax>
          ))}
        </div>
      </div>

      {/* ── PERFECT FOR ──────────────────────────────────────────────── */}
      <div className="py-24 px-4" style={{ backgroundColor: bg2 }}>
        <Parallax translateY={['40px', '0px']} opacity={[0, 1]} easing="easeOutQuart">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="vinyl text-4xl md:text-5xl text-white mb-10">Perfect For</h2>
            <p className="text-xl leading-relaxed" style={{ color: '#b5a898' }}>
              Musicians and bands who need regular rehearsal space, solo artists working on album
              projects, producers who want consistent studio access—or anyone who values the
              convenience of having their gear stored on-site and ready whenever inspiration strikes.
            </p>
          </div>
        </Parallax>
      </div>

      {/* ── HOW IT WORKS ─────────────────────────────────────────────── */}
      <div className="py-24 px-4" style={{ backgroundColor: bg1 }}>
        <Parallax translateY={['40px', '0px']} opacity={[0, 1]} easing="easeOutQuart">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-14">
              <p
                className="text-sm tracking-[0.35em] uppercase mb-6"
                style={{ color: amber, fontFamily: 'var(--font-geist-mono)' }}
              >
                ORB Studios
              </p>
              <h2 className="vinyl text-4xl md:text-5xl text-white">Ready to make our studio your creative home base?</h2>
            </div>


            {/* CTA box — sharp-cornered, hand-stamp feel */}
            <div
              className="p-10 text-center"
              style={{ border: '1px solid #2c2520', backgroundColor: '#8B1A1A' }}
            >
              <p
                className="text-sm tracking-[0.3em] uppercase mb-6"
                style={{ color: '#ffffff', fontFamily: 'var(--font-geist-mono)' }}
              >
                — We only carry 5 Monthly Clients at a time. —
              </p>
              <p className="text-xl font-semibold text-white leading-snug mb-2">
                Put your name down on the waiting list for the next open spot. 
              </p>
              {/* WAITLIST FORM */}
              {filteredForm && (
                <div className="mt-8 flex justify-center w-full" >
                  <div className="w-full max-w-2xl">
                    <div className="flex items-end gap-4 flex-wrap justify-center" >
                      <FormBlock form={filteredForm} enableIntro={false}  />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </Parallax>
      </div>
    </ParallaxProvider>
  )
}
