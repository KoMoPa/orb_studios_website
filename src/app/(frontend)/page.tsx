'use client';

import Header from '@/components/Header';
import Footer from '@/components/Footer';
import HeroBlockComponent from '@/components/blocks/HeroBlockComponent';
import ArticleBlockComponent from '@/components/blocks/ArticleBlockComponent';

export default function Home() {
  return (
    <>
      <Header />
      
      {/* Hero Block Example */}
      <HeroBlockComponent
        backgroundImage={{
          id: '1',
          filename: 'liveroom1.jpg',
          alt: 'Recording studio'
        }}
        title="ORB STUDIOS"
        titleFont='vinyl'
        subtitle="Where Legends Make Records"
        description="Etobicoke's premier recording and rehearsal space with world-class equipment and professional tracking facilities."
        cta={{ text: 'Book Now', url: '#booking' }}
      />

      {/* Article Block Example - Image on Right */}
      <ArticleBlockComponent
        title="The Gear"
        image={{
          id: '2',
          filename: 'microphones.jpg',
          alt: 'Professional microphones'
        }}
        imagePosition="right"
        content={
          <div>
            <p>
              Industry-leading equipment and vintage boutique gear in one place. Everything you need to create your masterpiece.
            </p>
            <ul style={{ marginTop: '1.5rem' }}>
              <li>Professional mixing consoles and outboard gear</li>
              <li>Vintage and modern microphone collection</li>
              <li>High-end preamps and compressors</li>
              <li>Full drum kit selection</li>
              <li>Guitar and bass amplifiers</li>
              <li>Keyboard and synthesizer collection</li>
            </ul>
          </div>
        }
        cta={{ text: 'Explore Equipment', url: '#equipment' }}
      />

      {/* Article Block Example - Image on Left */}
      <ArticleBlockComponent
        title="About Orb Studios"
        image={{
          id: '3',
          filename: 'studio-interior.jpg',
          alt: 'Studio interior'
        }}
        imagePosition="left"
        content={
          <div>
            <p>
              Founded with a passion for exceptional sound, Orb Studios has established itself as Etobicoke's premier destination for recording, mixing, and rehearsal.
            </p>
            <p style={{ marginTop: '1rem' }}>
              Our state-of-the-art facilities and experienced team have helped countless artists bring their visions to life. Whether you're a seasoned professional or just starting your musical journey, we're committed to providing the highest quality production environment.
            </p>
          </div>
        }
      />

      <main style={{ minHeight: '70vh', padding: '2rem' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          {/* Additional content goes here */}
        </div>
      </main>
      
      <Footer />
    </>
  );
}
