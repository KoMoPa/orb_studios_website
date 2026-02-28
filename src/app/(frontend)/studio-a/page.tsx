"use client";

import Image from 'next/image';
import Link from 'next/link';
import { useState, useEffect } from 'react';

export default function StudioA() {
    const gallery = [
        '/liveroom1.jpg',
        '/liveroom2.jpg',
        '/liveroom3.jpg',
    ];

    const gear = [
        "DW Drumkit with assorted cymbals and hardware",
        'Fender 100W Rumble Bass Amp',
        'Orange Guitar Amp/Cab Combo',
        "Fender '65 Deluxe Reverb",
        'Allen & Heath ZED 4 Channel Mixer',
        'Yorkville PA System/Speakers',
        'Assorted Dynamic Mics (57s, 58s, 421, d112s)',
    ];

    const [selectedImage, setSelectedImage] = useState<string | null>(null);

    useEffect(() => {
        const handleKey = (e: KeyboardEvent) => {
            if (e.key === 'Escape') setSelectedImage(null);
        };
        window.addEventListener('keydown', handleKey);
        return () => window.removeEventListener('keydown', handleKey);
    }, []);

    return (
        <div className="font-sans text-gray-800">
            {/* hero */}
            <header className="relative min-h-[380px] flex items-center bg-cover bg-center"
                style={{ backgroundImage: "linear-gradient(to right,rgba(220,38,38,.6),rgba(234,179,8,.6)),url('/hero.png')" }}>
                <div className="relative z-10 w-full max-w-5xl pl-4 pr-12 py-12 text-left">
                    <h1 className="text-5xl font-bold text-white">Studio A</h1>
                    <p className="mt-2 text-lg text-red-100 ml-px">Rehearsal Room — 21 x 17 x 11 ft</p>
                    <Link href="#booking" className="inline-block mt-4 ml-4 bg-black bg-opacity-40 text-white px-4 py-2 rounded">
                        Book Studio A
                    </Link>
                </div>
            </header>

            <main className="max-w-5xl mx-auto px-6 py-12">
                <section className="flex flex-col lg:flex-row gap-8">
                    <div className="flex-1">
                        <h2 className="text-2xl font-semibold">About Studio A</h2>
                        <p className="mt-4">
                            Studio A is a bright, roomy rehearsal space ideal for bands and artists. It includes quality amps,
                            drums, PA and a small control area for simple tracking. Monthly and hourly rentals are available.
                        </p>

                        <h3 className="mt-6 text-xl font-semibold">Included Gear</h3>
                        <ul className="list-disc list-inside mt-2 space-y-1">
                            {gear.map((g) => (
                                <li key={g}>{g}</li>
                            ))}
                        </ul>
                    </div>

                    <aside className="w-full lg:w-64">
                        <div className="bg-gray-100 rounded-lg p-6 space-y-4">
                            <div>
                                <strong className="block text-xl">21 x 17 x 11</strong>
                                <span className="text-sm text-gray-600">Feet (L&nbsp;x&nbsp;W&nbsp;x&nbsp;H)</span>
                            </div>
                            <div>
                                <strong className="block text-xl">$30</strong>
                                <span className="text-sm text-gray-600">Hourly Rehearsal Rate</span>
                            </div>
                            <div>
                                <strong className="block text-xl">$400</strong>
                                <span className="text-sm text-gray-600">Monthly Rate</span>
                            </div>
                        </div>
                    </aside>
                </section>

                <section className="mt-12">
                    <h2 className="text-2xl font-semibold">Gallery</h2>
                    <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {gallery.map((src) => (
                            <div
                                key={src}
                                className="relative w-full aspect-video rounded-lg overflow-hidden cursor-pointer"
                                onClick={() => setSelectedImage(src)}
                            >
                                <Image
                                    src={src}
                                    alt={src}
                                    fill
                                    sizes="(max-width: 600px) 100vw, 400px"
                                    className="object-cover"
                                />
                            </div>
                        ))}
                    </div>
                    {selectedImage && (
                        <div
                            className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50"
                            onClick={() => setSelectedImage(null)}
                        >
                            <div className="relative max-w-3xl max-h-full p-4 rounded-lg overflow-hidden">
                                <button
                                    className="absolute top-2 right-2 text-white text-2xl"
                                    onClick={() => setSelectedImage(null)}
                                >
                                    &times;
                                </button>
                                <Image
                                    src={selectedImage}
                                    alt="Selected"
                                    width={1200}
                                    height={800}
                                    className="object-contain"
                                />
                            </div>
                        </div>
                    )}
                </section>

                <section className="mt-16 bg-gradient-to-r from-red-500 to-yellow-400 text-white rounded-lg py-12 text-center" id="booking">
                    <h2 className="text-2xl font-semibold">Ready to Book?</h2>
                    <p className="mt-4">Contact us to reserve Studio A. Monthly storage and long‑form lockouts available.</p>
                    <a
                        className="inline-block mt-6 bg-yellow-400 text-red-800 px-6 py-3 rounded font-medium"
                        href="mailto:orbmusicstudios@gmail.com"
                    >
                        Email to Book
                    </a>
                </section>
            </main>

            <footer className="py-12 text-center text-gray-500">
                <p>&copy; 2026 Orb Studios</p>
                <Link href="/" className="underline">
                    Back to Home
                </Link>
            </footer>
        </div>
    );
}
