'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface NavItem {
  label: string
  url: string
}

interface Room {
  id: string
  title: string
  slug: string
}

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [isRoomsOpen, setIsRoomsOpen] = useState(false);
  const [navItems, setNavItems] = useState<NavItem[]>([]);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHeader = async () => {
      try {
        // Fetch header global nav items
        const headerRes = await fetch('/api/globals/header');
        const headerData = await headerRes.json();
        const headerNavItems = headerData.nav || [];
        setNavItems(headerNavItems);

        // Fetch all rooms
        const roomsRes = await fetch('/api/rooms?limit=100');
        const roomsData = await roomsRes.json();
        setRooms(roomsData.docs || []);
      } catch (error) {
        console.error('Failed to fetch header:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchHeader();
  }, []);

  return (
    <header className="sticky top-0 z-50 bg-primary shadow-lg">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="font-display text-2xl font-bold text-white tracking-wider">
            ORB STUDIOS
          </Link>

          <button
            className={`md:hidden flex flex-col gap-1.5 focus:outline-none ${isOpen ? 'space-y-0' : 'space-y-1.5'}`}
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
          >
            <span className={`block w-6 h-0.5 bg-white transition-all ${isOpen ? 'rotate-45 translate-y-2' : ''}`}></span>
            <span className={`block w-6 h-0.5 bg-white transition-all ${isOpen ? 'opacity-0' : ''}`}></span>
            <span className={`block w-6 h-0.5 bg-white transition-all ${isOpen ? '-rotate-45 -translate-y-2' : ''}`}></span>
          </button>

          <ul className={`absolute md:relative top-16 md:top-0 left-0 right-0 md:flex md:items-center gap-8 bg-primary md:bg-transparent px-4 md:px-0 pb-4 md:pb-0 transition-all duration-300 ${isOpen ? 'block' : 'hidden md:flex'}`}>
            {!loading && navItems.map((item, index) => (
              <li key={index}>
                <Link
                  href={item.url}
                  className={`${
                    item.label === 'Book Now'
                      ? 'inline-block px-6 py-2 bg-secondary text-white font-semibold rounded transition-all duration-300 hover:bg-red-600 hover:-translate-y-0.5'
                      : 'text-white hover:text-secondary transition-colors'
                  } py-2 md:py-0`}
                  onClick={() => setIsOpen(false)}
                >
                  {item.label}
                </Link>
              </li>
            ))}

            {/* Rooms Dropdown */}
            <li className="relative group">
              <button
                onClick={() => setIsRoomsOpen(!isRoomsOpen)}
                className="text-white hover:text-secondary transition-colors py-2 md:py-0 flex items-center gap-2"
              >
                Rooms
                <span className={`inline-block transition-transform ${isRoomsOpen ? 'rotate-180' : ''}`}>
                  ▼
                </span>
              </button>

              {/* Dropdown Menu */}
              {isRoomsOpen && (
                <ul className="md:absolute md:left-0 md:mt-0 w-full md:w-48 bg-primary md:bg-gray-900 rounded-md md:shadow-lg py-2 mt-2">
                  {rooms.length > 0 ? (
                    rooms.map((room) => (
                      <li key={room.id}>
                        <Link
                          href={`/${room.slug}`}
                          className="block px-4 py-2 text-white hover:bg-secondary hover:text-black transition-colors"
                          onClick={() => {
                            setIsRoomsOpen(false);
                            setIsOpen(false);
                          }}
                        >
                          {room.title}
                        </Link>
                      </li>
                    ))
                  ) : (
                    <li className="px-4 py-2 text-gray-400">No rooms available</li>
                  )}
                </ul>
              )}
            </li>
          </ul>
        </div>
      </nav>
    </header>
  );
}
