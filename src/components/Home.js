import { useEffect, useState } from 'react';
import supabase from '../supabaseClient';

function Home() {
  const [tools, setTools] = useState([]);
  const [hover, setHover] = useState(false);
  const [currentImage, setCurrentImage] = useState(0);

  // Array of office activity background images
  const backgroundImages = [
    'https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1350&q=80', // Workers collaborating
    'https://images.unsplash.com/photo-1507208770228-c53a3d1a1d15?ixlib=rb-4.0.3&auto=format&fit=crop&w=1350&q=80', // Businesswoman on laptop
    'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?ixlib=rb-4.0.3&auto=format&fit=crop&w=1350&q=80', // Team meeting with laptops
  ];

  // Fetch tools from Supabase
  useEffect(() => {
    async function fetchTools() {
      const { data } = await supabase.from('dd_tools').select('*');
      setTools(data);
    }
    fetchTools();
  }, []);

  // Background image slider
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % backgroundImages.length);
    }, 5000); // Change image every 5 seconds
    return () => clearInterval(interval);
  }, [backgroundImages.length]);

  return (
    <div>
      {/* Hero Section with Background Slider */}
      <section style={{
        position: 'relative',
        height: '100vh',
        color: '#FFFFFF',
        padding: '100px 20px',
        textAlign: 'center',
        overflow: 'hidden',
        backgroundImage: `url(${backgroundImages[currentImage]})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        transition: 'background-image 1s ease-in-out',
      }}>
        {/* Overlay for readability */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          background: 'rgba(0, 0, 128, 0.6)', // Navy blue overlay
          zIndex: 1,
        }} />
        {/* Content */}
        <div style={{ position: 'relative', zIndex: 2 }}>
          <h1 style={{
            fontSize: '48px',
            margin: '0',
            transform: hover ? 'scale(1.05)' : 'scale(1)',
            transition: 'transform 0.3s ease-in-out',
          }}
          onMouseEnter={() => setHover(true)}
          onMouseLeave={() => setHover(false)}
          >
            Discover the Best Domaining Tools
          </h1>
          <p style={{ fontSize: '20px', margin: '20px 0', color: '#C0C0C0' }}>
            Explore top tools and resources for domain enthusiasts.
          </p>
          <div style={{ marginTop: '30px' }}>
            <a href="/submit-tool" style={ctaStyle(true)}>Submit Your Tool</a>
            <a href="/blog" style={ctaStyle(false)}>Read Our Blog</a>
          </div>
          {/* Dynamic Floating Circles */}
          <div style={circleStyle(100, 50)} />
          <div style={circleStyle(300, 200)} />
        </div>
      </section>

      {/* Tools List */}
      <section style={{ padding: '40px 20px', background: '#FFFFFF' }}>
        <h2 style={{ color: '#000080', textAlign: 'center' }}>Top Domaining Tools</h2>
        {tools.map((tool) => (
          <div key={tool.id} style={{
            border: '1px solid #C0C0C0',
            padding: '15px',
            margin: '10px auto',
            maxWidth: '600px',
            borderRadius: '5px',
            transition: 'box-shadow 0.3s',
          }}>
            <h3 style={{ color: '#4169E1' }}>{tool.name}</h3>
            <p style={{ color: '#000080' }}>{tool.description}</p>
            <a href={tool.link} style={{ color: '#FFD700', textDecoration: 'none' }}>Visit Tool</a>
          </div>
        ))}
      </section>
    </div>
  );
}

const ctaStyle = (isPrimary) => ({
  display: 'inline-block',
  padding: '12px 25px',
  margin: '0 10px',
  background: isPrimary ? '#FFD700' : '#C0C0C0',
  color: isPrimary ? '#000080' : '#4169E1',
  textDecoration: 'none',
  borderRadius: '5px',
  fontWeight: 'bold',
  transition: 'transform 0.2s, box-shadow 0.2s',
});

const circleStyle = (top, left) => ({
  position: 'absolute',
  width: '50px',
  height: '50px',
  background: 'rgba(255, 215, 0, 0.2)',
  borderRadius: '50%',
  top: `${top}px`,
  left: `${left}px`,
  animation: 'float 6s infinite ease-in-out',
  zIndex: 2,
});

export default Home;
