import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Hero from '../components/Hero';
import NewCollection from '../components/NewCollection';
import Bestsellers from '../components/Bestsellers';
import About from '../components/About';
import FAQ from '../components/FAQ';
import Contact from '../components/Contact';
import Footer from '../components/Footer';

const Home = () => {
  const location = useLocation();

  useEffect(() => {
    // Handle hash-based scrolling when coming from another page
    if (location.hash) {
      const element = document.getElementById(location.hash.substring(1));
      if (element) {
        // Delay to ensure component is fully rendered
        setTimeout(() => {
          element.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
        }, 100);
      }
    }
  }, [location]);

  return (
    <div>
      <Hero />
      <NewCollection />
      <Bestsellers />
      <About />
      <FAQ />
      <Contact />
      <Footer />
    </div>
  );
};

export default Home;
