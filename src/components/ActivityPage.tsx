'use client';

import Image from 'next/image';
import { useState, useEffect } from 'react';
import type { Media } from '@/payload-types';
// Note: Header and Footer are server components and cannot be imported in a client component
// This component is not currently in use - consider refactoring as a server component if needed
// import { Header } from '@/Header/Component';
// import { Footer } from '@/Footer/Component';

interface ActivityData {
    id: string;
    title: string;
    slug: string;
    heroImage: Media | string;
    heroTitle: string;
    heroGradient: {
        startColor: string;
        endColor: string;
    };
    aboutSection: any;
    gearList: any;
    galleryImages: (Media | string)[];
    infoBox: {
        area: string;
        hourlyRate: string;
        hourlyRateLabel: string;
        test: string;
    };
    bookingSection: {
        heading: string;
        description?: string;
        buttonText: string;
    }
}

async function fetchActivity(slug:string): Promise<ActivityData | null> {
    try {
        const res = await fetch(`/api/activities?where[slug][equals]=${slug}`, { next: { revalidate: 60}});
        const data = await res.json();
        return data.docs?.[0] || null;
    } catch (error) {
        console.error(`Failed to fetch activity ${slug}:`, error);
        return null;
    }
}

function renderRichText(content: any): React.ReactNode {
    if (!content) return null;
    if (typeof content === 'string') {
        return content;
    }
    // Handle Payload's Lexical editor format
    if (content.root && content.root.children) {
    return content.root.children.map((block: any, index: number) => {
      if (block.type === 'paragraph') {
        return (
          <p key={index} className="mt-4 text-white">
            {block.children?.map((child: any, i: number) => (
              <span key={i}>{child.text}</span>
            ))}
          </p>
        );
      }
      if (block.type === 'ul' || block.type === 'list') {
        return (
          <ul key={index} className="list-disc list-inside mt-2 space-y-1 text-white">
            {block.children?.map((item: any, i: number) => {
              const itemText = item.children?.[0]?.text || item.text;
              return <li key={i}>{itemText}</li>;
            })}
          </ul>
        );
      }
      return null;
    });
  }
  // Handle flat array format (fallback)
  if (Array.isArray(content)) {
    return content.map((block: any, index: number) => {
      if (block.type === 'paragraph') {
        return (
          <p key={index} className="mt-4 text-white">
            {block.children?.map((child: any, i: number) => (
              <span key={i}>{child.text}</span>
            ))}
          </p>
        );
      }
      if (block.type === 'ul') {
        return (
          <ul key={index} className="list-disc list-inside mt-2 space-y-1 text-white">
            {block.children?.map((item: any, i: number) => (
              <li key={i}>{item.children?.[0]?.text}</li>
            ))}
          </ul>
        );
      }
      return null;
    });
  }
  return null;
}

function getImageUrl(image: Media | string): string {
  if (typeof image === 'string') {
    return image.startsWith('/') ? image : `/media/${image}`;
  }
  if (!image.filename) return '';
  return image.filename.startsWith('/') ? image.filename : `/media/${image.filename}`;
}

interface ActivityPageProps {
    slug: string;
}

export default function ActivityPage({ slug }: ActivityPageProps) {
    const [activity, setActivity] = useState<ActivityData | null>(null);
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const load = async () => {
            const data = await fetchActivity(slug);
            setActivity(data);
            setLoading(false);
        };
        load();
    }, [slug]);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
            <p className="text-gray-500">Loading...</p>
            </div>
        );
    }

    if (!activity) {
        return (
            <div className="flex items-center justify-center min-h-screen">
            <p className="text-gray-500">Activity not found</p>
            </div>
        );
    }

    const heroImageUrl = getImageUrl(activity.heroImage);

    return (
        <div className="font-sans text-white">
                {/* Hero Section */}
                <div
                    className="relative min-h-[380px] flex items-center bg-cover bg-center bg-no-repeat"
                    style={{
                        backgroundImage: `url('${heroImageUrl}')`,
                    }}
                >
                    <div 
                        className="absolute inset-0 opacity-50"
                        style={{
                            background: `linear-gradient(to right, ${activity.heroGradient.startColor}, ${activity.heroGradient.endColor})`
                        }}
                    ></div>
                    <header className="relative z-10 w-full">
                        <div className="relative z-10 w-full max-w-5xl pl-4 pr-12 py-12 text-left">
                            <h1 className="text-5xl font-bold text-white">{activity.heroTitle}</h1>
                            <a href="#booking" className="inline-block mt-4 ml-4 bg-black bg-opacity-40 text-white px-4 py-2 rounded">
                                Book {activity.title}
                            </a>
                        </div>
                    </header>
                </div>

                <main className="max-w-5xl mx-auto px-6 py-12">
                    {/* About Section */}
                    <section className="flex flex-col lg:flex-row gap-8">
                        <div className="flex-1">
                            <h2 className="text-2xl font-semibold text-white">About {activity.title}</h2>
                            <div className="mt-4 text-white">
                                {renderRichText(activity.aboutSection)}
                            </div>

                            <h3 className="mt-6 text-xl font-semibold text-white">What's Included</h3>
                            <div className="mt-2 text-white">
                                {renderRichText(activity.gearList)}
                            </div>
                        </div>

                        {/* Info Box */}
                        <aside className="w-full lg:w-64">
                            <div className="bg-gray-100 rounded-lg p-6 space-y-4">
                                <div>
                                    <strong className="block text-xl text-gray-900">{activity.infoBox.area}</strong>
                                </div>
                                <div>
                                    <strong className="block text-xl text-gray-900">{activity.infoBox.hourlyRate}</strong>
                                    <span className="text-sm text-gray-600">{activity.infoBox.hourlyRateLabel}</span>
                                    <span className="text-sm text-gray-600">{activity.infoBox.test}</span>
                                </div>
                            </div>
                        </aside>
                    </section>

                    {/* Gallery Section */}
                    <section className="mt-12">
                        <h2 className="text-2xl font-semibold text-white">Gallery</h2>
                        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            {activity.galleryImages.map((image, index) => {
                                const imageUrl = getImageUrl(image);
                                return (
                                    <div
                                        key={index}
                                        className="relative w-full aspect-video rounded-lg overflow-hidden cursor-pointer"
                                        onClick={() => setSelectedImage(imageUrl)}
                                    >
                                        <img
                                            src={imageUrl}
                                            alt={`Gallery ${index + 1}`}
                                            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                                        />
                                    </div>
                                );
                            })}
                        </div>

                        {/* Lightbox */}
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
                                    <img src={selectedImage} alt="Selected" className="max-w-full max-h-full object-contain" />
                                </div>
                            </div>
                        )}
                    </section>

                    {/* Booking Section */}
                    <section
                        className="mt-16 text-white rounded-lg py-12 text-center"
                        style={{
                            background: `linear-gradient(to right, ${activity.heroGradient.startColor}, ${activity.heroGradient.endColor})`
                        }}
                        id="booking"
                    >
                        <h2 className="text-2xl font-semibold">{activity.bookingSection.heading}</h2>
                        {activity.bookingSection.description && (
                            <p className="mt-4">{activity.bookingSection.description}</p>
                        )}
                        <a
                            className="inline-block mt-6 bg-yellow-400 text-red-800 px-6 py-3 rounded font-medium"
                            href="mailto:orbmusicstudios@gmail.com"
                        >
                            {activity.bookingSection.buttonText}
                        </a>
                    </section>
                </main>
            </div>
    );
}