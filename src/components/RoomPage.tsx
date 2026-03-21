'use client';

import Image from 'next/image';
import { useState, useEffect } from 'react';
// Note: Header and Footer are server components and cannot be imported in a client component
// This component is not currently in use - consider refactoring as a server component if needed
// import Header from '@/components/Header';
// import Footer from '@/components/Footer';

interface Media {
  id: string;
  filename: string;
  alt?: string;
}

interface RoomData {
  id: string;
  title: string;
  slug: string;
  heroImage: Media | string;
  heroTitle: string;
  heroGradientColor: string;
  aboutSection: any;
  gearList: any;
  galleryImages: (Media | string)[];
  infoBox: {
    area: string;
    areaDetails?: string;
    hourlyRate: string;
    hourlyRateLabel: string;
  };
  bookingSection: {
    heading: string;
    description: string;
    buttonText: string;
  };
}

async function fetchRoom(slug: string): Promise<RoomData | null> {
  try {
    const res = await fetch(
      `/api/rooms?where[slug][equals]=${slug}`,
      { next: { revalidate: 60 } }
    );
    const data = await res.json();
    return data.docs?.[0] || null;
  } catch (error) {
    console.error(`Failed to fetch room ${slug}:`, error);
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
  return image.filename.startsWith('/') ? image.filename : `/media/${image.filename}`;
}

interface RoomPageProps {
  slug: string;
}

export default function RoomPage({ slug }: RoomPageProps) {
  const [room, setRoom] = useState<RoomData | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const data = await fetchRoom(slug);
      setRoom(data);
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

  if (!room) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-500">Room not found</p>
      </div>
    );
  }

  const heroImageUrl = getImageUrl(room.heroImage);

  return (
    <div className="font-sans text-white">
        {/* Hero Section */}
        <div
          className="relative min-h-[380px] flex items-center bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url('${heroImageUrl}')`,
          }}
        >
          <div className={`absolute inset-0 bg-gradient-to-r ${room.heroGradientColor} opacity-50`}></div>
          <header className="relative z-10 w-full">
          <div className="relative z-10 w-full max-w-5xl pl-4 pr-12 py-12 text-left">
            <h1 className="text-5xl font-bold text-white">{room.heroTitle}</h1>
            <a href="#booking" className="inline-block mt-4 ml-4 bg-black bg-opacity-40 text-white px-4 py-2 rounded">
              Book {room.title}
            </a>
          </div>
        </header>
        </div>

        <main className="max-w-5xl mx-auto px-6 py-12">
          {/* About Section */}
          <section className="flex flex-col lg:flex-row gap-8">
            <div className="flex-1">
              <h2 className="text-2xl font-semibold text-white">About {room.title}</h2>
              <div className="mt-4 text-white">
                {renderRichText(room.aboutSection)}
              </div>

              <h3 className="mt-6 text-xl font-semibold text-white">Included Gear</h3>
              <div className="mt-2 text-white">
                {renderRichText(room.gearList)}
              </div>
            </div>

            {/* Info Box */}
            <aside className="w-full lg:w-64">
              <div className="bg-gray-100 rounded-lg p-6 space-y-4">
                <div>
                  <strong className="block text-xl">{room.infoBox.area}</strong>
                  {room.infoBox.areaDetails && (
                    <span className="text-sm text-gray-600">{room.infoBox.areaDetails}</span>
                  )}
                </div>
                <div>
                  <strong className="block text-xl">{room.infoBox.hourlyRate}</strong>
                  <span className="text-sm text-gray-600">{room.infoBox.hourlyRateLabel}</span>
                </div>
              </div>
            </aside>
          </section>

          {/* Gallery Section */}
          <section className="mt-12">
            <h2 className="text-2xl font-semibold text-white">Gallery</h2>
            <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {room.galleryImages.map((image, index) => {
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
            className={`mt-16 bg-gradient-to-r ${room.heroGradientColor} text-white rounded-lg py-12 text-center`}
            id="booking"
          >
            <h2 className="text-2xl font-semibold">{room.bookingSection.heading}</h2>
            <p className="mt-4">{room.bookingSection.description}</p>
            <a
              className="inline-block mt-6 bg-yellow-400 text-red-800 px-6 py-3 rounded font-medium"
              href="mailto:orbmusicstudios@gmail.com"
            >
              {room.bookingSection.buttonText}
            </a>
          </section>
        </main>
      </div>
  );
}
