"use client";
import { useLayoutEffect, useEffect, useState, useRef } from "react";
import '@/styles/index.css';
import '@/styles/index.scss';
import '@/styles/common.css';
import '@/styles/common.scss';
import '@/styles/courses.css';
import gsap from 'gsap';


import CourseCard from '../components/CourseCard';
import GetStartedModal from '../components/GetStartedModal';
import { useRouter } from 'next/navigation';
import { useAuthRedirect } from '../hooks/useAuthRedirect';

const staticHomepageCourses = [
  {
    image: 'https://ik.imagekit.io/cybershoora/Shoora.tech/Live-Course_Thumbnail.%20Vector%20illustration_?updatedAt=1750021872707',
    badge: 'INSTITUTE',
    title: 'Coding with AI (Without Learning Traditional Coding)',
    duration: '6 MONTHS',
    languages: ['Hindi, sh'],
    originalPrice: '₹12000',
    currentPrice: '₹900',
    discount: '25OFF',
    details: [
      'AI Tools',
      'No-Code Platforms',
      'Prompt Engineering',
      'Automation with AI',
      'Practical AI Projects'
    ],
    link: '#',
  },
  {
    image: 'https://ik.imagekit.io/cybershoora/Shoora.tech/Live-Course_Thumbnail.%20Vector%20illustration_?updatedAt=1750021872707',
    badge: 'INSTITUTE',
    title: 'UI/UX Design',
    duration: '4 MONTHS',
    languages: ['Hindi, sh'],
    originalPrice: '₹10000',
    currentPrice: '₹7500',
    discount: '25OFF',
    details: [
      'Figma',
      'Adobe Photoshop',
      'Adobe Illustrator',
      'Wireframing',
      'Prototyping',
      'User Research'
    ],
    link: '#',
  },
  {
    image: 'https://ik.imagekit.io/cybershoora/Shoora.tech/Live-Course_Thumbnail.%20Vector%20illustration_?updatedAt=1750021872707',
    badge: 'INSTITUTE',
    title: 'Web Development',
    duration: '8 MONTHS',
    languages: ['Hindi, sh'],
    originalPrice: '₹15000',
    currentPrice: '₹12000',
    discount: '20OFF',
    details: [
      'HTML & CSS',
      'JavaScript',
      'React.js',
      'Node.js',
      'MongoDB',
      'Full Stack Projects'
    ],
    link: '#',
  },
  {
    image: 'https://ik.imagekit.io/cybershoora/Shoora.tech/Live-Course_Thumbnail.%20Vector%20illustration_?updatedAt=1750021872707',
    badge: 'INSTITUTE',
    title: 'Data Science & Analytics',
    duration: '6 MONTHS',
    languages: ['Hindi, sh'],
    originalPrice: '₹18000',
    currentPrice: '₹14000',
    discount: '22OFF',
    details: [
      'Python Programming',
      'Data Analysis',
      'Machine Learning',
      'Statistics',
      'Data Visualization',
      'Real-world Projects'
    ],
    link: '#',
  }
];

export default function HomePage() {
  const router = useRouter();
  const [homepageCourses, setHomepageCourses] = useState([]);
  const [showGetStarted, setShowGetStarted] = useState(false);
  const [openDropdowns, setOpenDropdowns] = useState([]);
  const companiesSliderRef = useRef(null);
  const [isMobile, setIsMobile] = useState(false);
  const [videoPlayMode, setVideoPlayMode] = useState('hover'); // 'hover' or 'manual'
  const [videoProgress, setVideoProgress] = useState(0);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [homepageData, setHomepageData] = useState(null);
  const [homepageLoading, setHomepageLoading] = useState(true);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const checkMobile = () => setIsMobile(window.innerWidth <= 600);
      checkMobile();
      window.addEventListener('resize', checkMobile);
      return () => window.removeEventListener('resize', checkMobile);
    }
  }, []);

  // Use custom auth hook
  useAuthRedirect();

  useEffect(() => {
    fetch('/api/courses')
      .then(res => res.json())
      .then(data => setHomepageCourses(data));
  }, []);

  // Fetch homepage content
  useEffect(() => {
    setHomepageLoading(true);
    fetch('/api/admin/homepage')
      .then(res => res.json())
      .then(data => {
        console.log('Homepage data loaded:', data);
        console.log('Companies count:', data.companies?.length || 0);
        console.log('Hero media:', data.heroMedia);
        setHomepageData(data);
        setHomepageLoading(false);
      })
      .catch(err => {
        console.error('Failed to load homepage data:', err);
        setHomepageLoading(false);
      });
  }, []);

  useLayoutEffect(() => {
    // Counter animation
    const counters = document.querySelectorAll('.counter');
    counters.forEach(counter => {
      const target = +counter.getAttribute('data-target');
      let current = 0;
      const startTime = performance.now();
      const updateCounter = (currentTime) => {
        const elapsedTime = currentTime - startTime;
        const progress = Math.min(elapsedTime / 2000, 1);
        const value = Math.floor(progress * target);
        counter.innerText = value >= 1000 ? value.toLocaleString() : value;
        if (progress < 1) {
          requestAnimationFrame(updateCounter);
        } else {
          counter.innerText = target >= 1000 ? target.toLocaleString() + '+' : target + '+';
        }
      };
      requestAnimationFrame(updateCounter);
    });

    // GSAP ultra-smooth typewriter effect with highlight words
    const elements = document.getElementsByClassName('txt-rotate');
    let rafIds = [];
    for (let i = 0; i < elements.length; i++) {
      const el = elements[i];
      const toRotate = el.getAttribute('data-rotate');
      const period = parseInt(el.getAttribute('data-period'), 10) || 2000;
      if (!toRotate) continue;
      let phrases = JSON.parse(toRotate);
      phrases = Array.isArray(phrases)
        ? phrases.filter(p => p && typeof p === 'object' && typeof p.text === 'string' && Array.isArray(p.highlights))
        : [];
      if (phrases.length === 0) continue; // Do not start animation if no valid phrases
      let phraseIndex = 0;
      function renderWithHighlights(text, highlights, charCount) {
        let soFar = text.slice(0, charCount);
        let words = soFar.split(/(\s+)/);
        return words.map((w, idx) => {
          if (highlights && highlights.includes(w.trim()) && w.trim() !== '') {
            return `<span style=\"color:#ff6a32;\">${w}</span>`;
          }
          return w;
        }).join('');
      }
      function typePhrase(phraseObj, cb) {
        if (!phraseObj || typeof phraseObj.text !== 'string') { cb && cb(); return; }
        let chars = phraseObj.text.split("");
        let charIndex = 0;
        el.innerHTML = `<span class=\"wrap\"></span>`;
        function typeNext() {
          if (charIndex <= chars.length) {
            el.querySelector('.wrap').innerHTML = renderWithHighlights(phraseObj.text, phraseObj.highlights, charIndex);
            charIndex++;
            gsap.to(el.querySelector('.wrap'), { opacity: 1, duration: 0.08, ease: 'power1.inOut' });
            const delay = 50 + Math.random() * 20;
            rafIds[i] = setTimeout(typeNext, delay);
          } else {
            rafIds[i] = setTimeout(() => erasePhrase(phraseObj, cb), period);
          }
        }
        typeNext();
      }
      function erasePhrase(phraseObj, cb) {
        let chars = phraseObj.text.split("");
        let charIndex = chars.length;
        function eraseNext() {
          if (charIndex >= 0) {
            el.querySelector('.wrap').innerHTML = renderWithHighlights(phraseObj.text, phraseObj.highlights, charIndex);
            charIndex--;
            const delay = 35 + Math.random() * 15;
            rafIds[i] = setTimeout(eraseNext, delay);
          } else {
            cb();
          }
        }
        eraseNext();
      }
      function nextPhrase() {
        if (phrases.length === 0) return;
        if (rafIds[i]) clearTimeout(rafIds[i]);
        const phraseObj = phrases[phraseIndex];
        typePhrase(phraseObj, () => {
          phraseIndex = (phraseIndex + 1) % phrases.length;
          nextPhrase();
        });
      }
      nextPhrase();
    }
    return () => {
      rafIds.forEach(id => clearTimeout(id));
    };
  }, [homepageData]);

  // Company logos array for easy mapping
  const companyLogos = [
    { src: "https://res.cloudinary.com/dr8razrcd/image/upload/v1753210645/Netlink_f8zjfe.png", alt: "Netlink" },
    { src: "https://res.cloudinary.com/dr8razrcd/image/upload/v1753210645/Mindtree_msxbxe.png", alt: "Mindtree" },
    { src: "https://res.cloudinary.com/dr8razrcd/image/upload/v1753210645/Walmart_ofest2.png", alt: "Walmart" },
    { src: "https://res.cloudinary.com/dr8razrcd/image/upload/v1753210645/rapidops_r0jlnt.png", alt: "Rapidops" },
    { src: "https://res.cloudinary.com/dr8razrcd/image/upload/v1753210646/TCS_tppbhr.png", alt: "TCS" },
    { src: "https://res.cloudinary.com/dr8razrcd/image/upload/v1753210646/Amazon_vadamm.png", alt: "Amazon" },
    { src: "https://res.cloudinary.com/dr8razrcd/image/upload/v1753210647/Wipro_qiyamv.png", alt: "Wipro" },
    { src: "https://res.cloudinary.com/dr8razrcd/image/upload/v1753210648/Geeks_for_Geeks_yryfdo.png", alt: "GeeksforGeeks" },
  ];

  // Auto-scroll companies logo slider on mobile with scroll direction based on user scroll
  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (window.innerWidth > 600) return;
    
    const slider = companiesSliderRef.current;
    if (!slider) return;
    
    console.log('🎯 Starting auto-scroll for companies logos');
    console.log('📊 Companies count:', homepageData?.companies?.length || 0);
    console.log('🔄 Default direction: Right to Left (positive)');
    
    let scrollDirection = 1; // Default: right to left (positive for right)
    let scrollStep = 2; // Faster scroll for better responsiveness
    let scrollInterval = 20; // Smoother animation
    let autoScroll;
    let lastScrollY = window.scrollY;
    let directionChangeTimer = null;
    
    // Function to start auto-scroll
    const startAutoScroll = () => {
      autoScroll = setInterval(() => {
        if (!slider) return;
        
        // For right to left (positive direction) - DEFAULT
        if (scrollDirection === 1) {
          if (slider.scrollLeft >= slider.scrollWidth - slider.clientWidth) {
            // Reset to beginning for seamless loop
            slider.scrollLeft = 0;
            console.log('🔄 Right to Left: Reset to beginning, scrollLeft:', slider.scrollLeft);
          } else {
            slider.scrollLeft += scrollStep; // Move right (positive)
          }
        }
        // For left to right (negative direction) - REVERSE (only when user scrolls up)
        else if (scrollDirection === -1) {
          if (slider.scrollLeft <= 0) {
            // Reset to end for seamless loop
            slider.scrollLeft = slider.scrollWidth - slider.clientWidth;
            console.log('🔄 Left to Right: Reset to end, scrollLeft:', slider.scrollLeft);
          } else {
            slider.scrollLeft -= scrollStep; // Move left (negative)
          }
        }
      }, scrollInterval);
    };

    // Function to change scroll direction
    const changeScrollDirection = (newDirection) => {
      if (scrollDirection !== newDirection) {
        const oldDirection = scrollDirection;
        scrollDirection = newDirection;
        console.log('🔄 Scroll direction changed from:', oldDirection === 1 ? 'Right to Left' : 'Left to Right', 'to:', newDirection === 1 ? 'Right to Left' : 'Left to Right');
        
        // Set appropriate initial position for new direction
        if (slider) {
          if (newDirection === 1) {
            // For right to left (default), start from beginning
            slider.scrollLeft = 0;
            console.log('📍 Right to Left: Position set to beginning:', slider.scrollLeft);
          } else {
            // For left to right (reverse), start from end
            slider.scrollLeft = slider.scrollWidth - slider.clientWidth;
            console.log('📍 Left to Right: Position set to end:', slider.scrollLeft);
          }
        }
      } else {
        console.log('ℹ️ Direction unchanged:', newDirection === 1 ? 'Right to Left' : 'Left to Right');
      }
    };
    
    // Function to handle scroll direction based on page scroll
    const handleScrollDirection = () => {
      const currentScrollY = window.scrollY;
      const scrollDelta = currentScrollY - lastScrollY;
      
      // Clear previous timer
      if (directionChangeTimer) {
        clearTimeout(directionChangeTimer);
      }
      
      // Only change direction when user scrolls UP (footer to navbar)
      if (scrollDelta < 0) {
        changeScrollDirection(-1); // Left to Right
        console.log('⬆️ User scrolling UP - Logos now scroll Left to Right');
      } 
      // When user scrolls DOWN, keep default direction (right to left)
      else if (scrollDelta > 0) {
        // Don't change direction, keep default right to left
        console.log('⬇️ User scrolling DOWN - Logos continue Right to Left');
      }
      
      lastScrollY = currentScrollY;
      
      // Auto-revert to default direction after 3 seconds of no scroll
      directionChangeTimer = setTimeout(() => {
        changeScrollDirection(1); // Default: Right to Left
        console.log('🔄 Auto-reverted to default Right to Left direction');
      }, 3000);
    };
    
    // Start auto-scroll after a short delay to ensure DOM is ready
    setTimeout(() => {
      // Set initial scroll position for right to left (default)
      if (slider && scrollDirection === 1) {
        slider.scrollLeft = 0;
        console.log('📍 Initial scroll position set for Right to Left:', slider.scrollLeft);
      }
      startAutoScroll();
      console.log('🚀 Auto-scroll started with direction:', scrollDirection === 1 ? 'Right to Left' : 'Left to Right');
    }, 1000);
    
    // Listen for page scroll to change direction
    window.addEventListener('scroll', handleScrollDirection, { passive: true });
    
    // Pause on user interaction with slider
    const pauseScroll = () => {
      clearInterval(autoScroll);
      setTimeout(startAutoScroll, 2000); // Resume after 2 seconds
    };
    
    // Resume scroll when user stops scrolling the page
    const resumeScroll = () => {
      if (!autoScroll) {
        startAutoScroll();
        console.log('▶️ Auto-scroll resumed');
      }
    };
    
    slider.addEventListener('touchstart', pauseScroll);
    slider.addEventListener('mousedown', pauseScroll);
    
    // Resume auto-scroll when user stops scrolling the page
    let scrollTimeout;
    const handlePageScrollEnd = () => {
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        resumeScroll();
      }, 500); // Resume after 500ms of no page scroll
    };
    
    window.addEventListener('scroll', handlePageScrollEnd, { passive: true });
    
    return () => {
      if (autoScroll) {
        clearInterval(autoScroll);
      }
      if (directionChangeTimer) {
        clearTimeout(directionChangeTimer);
      }
      if (scrollTimeout) {
        clearTimeout(scrollTimeout);
      }
      window.removeEventListener('scroll', handleScrollDirection);
      window.removeEventListener('scroll', handlePageScrollEnd);
      if (slider) {
        slider.removeEventListener('touchstart', pauseScroll);
        slider.removeEventListener('mousedown', pauseScroll);
      }
    };
  }, [homepageData?.companies]); // Re-run when companies data changes

  // Fix: Define requestCallback for the callback form
  function requestCallback(event) {
    event.preventDefault();
    // You can handle form data here or send to API
    const form = event.target;
    const data = new FormData(form);
    // Example: log form data
    console.log('Request Callback:', Object.fromEntries(data.entries()));
    // Optionally, show a success message or close popup
  }

  // Render
  return (
    <>
      <GetStartedModal open={showGetStarted} onClose={() => setShowGetStarted(false)} />
      <main>
        {/* Hero Section */}
        <section id="view1" className="view">
          <div className="top"></div>
          <div className="middle">
            <h1>
              {homepageData ? (
                <>
                  <span style={{ display: 'block' }}>
                    {homepageData.mainHeadingWhite}
                  </span>
                  <span style={{ display: 'block', marginTop: 8, color: '#ff6a32' }}>
                    {homepageData.mainHeadingOrange}
                  </span>
                </>
              ) : (
                <>
                  <span style={{ display: 'block' }}>This isn't school. This is</span>
                  <span style={{ display: 'block', marginTop: 8, color: '#ff6a32' }}>Shoora.Tech</span>
                </>
              )}
            </h1>
            <div>
              {homepageData && homepageData.typewriterTexts && homepageData.typewriterTexts.length > 0 ? (
                <span style={{ fontSize: '1.5rem', fontWeight: 400 }} className="txt-rotate" data-period="1000" data-rotate={JSON.stringify(homepageData.typewriterTexts)}></span>
              ) : (
                <span style={{ fontSize: '1.5rem', fontWeight: 400 }} className="txt-rotate" data-period="1000" data-rotate='[{"text":"Teaching? Nah bro, We upgrade Brains.","highlights":["Brains"]},{"text":"No fake Gyaan, Only real Skillz.","highlights":["Skillz."]},{"text":"Taught by Legends, NOT NPCs.","highlights":["Legends","NPCs."]},{"text":"Full Power, No Bakwaas.","highlights":["Bakwaas."]},{"text":"Stop learning from Sasta tutorials. Come to Shoora.Tech.","highlights":["Shoora.Tech."]},{"text":"We mastered the Game, Now we teach the Hacks.","highlights":["Hacks."]}]'></span>
              )}
            </div>
            
            <div className="homebuttons">
              <a href="./courses.html" className="flex btn btn-primary checkout shadow-bottom shadow-primary" style={{ color: '#fff', fontFamily: 'NeueMachina' }}>
                What We Teach ❤️
              </a>
              <a href="#" className="flex btn btn-primary checkout shadow-bottom shadow-primary" style={{ color: '#fff', fontFamily: 'NeueMachina' }} onClick={e => { e.preventDefault(); setShowGetStarted(true); }}>
                Get Started 👉
              </a>
            </div>
          </div>
          <div className="bottom">
            <div className="mileStones">
              <div className="mileStone">
                <div className="text">
                  <h2 className="counter" data-target={homepageData?.stats?.studentsTaught || 8000}>1</h2>
                  <p>Students taught</p>
                </div>
              </div>
              <div className="mileStone">
                <div className="text">
                  <h2 className="counter" data-target={homepageData?.stats?.instructors || 10}>1</h2>
                  <p>Instructors</p>
                </div>
              </div>
              <div className="mileStone">
                <div className="text">
                  <h2 className="counter" data-target={homepageData?.stats?.liveProjects || 105}>1</h2>
                  <p>Live Projects.</p>
                </div>
              </div>
            </div>
          </div>
        </section>
        {/* Video/Intro Section */}
        <section className="view" id="view2">
          <div className="top">
            <span>
              {homepageData && homepageData.heroImageText ? (
                <>
                  {homepageData.heroImageText}
                  <br />
                  <span className="text-highlight" style={{ color: '#9747ff' }}>{homepageData.heroImageTextHighlight}</span>
                </>
              ) : (
                <>
                  we do whatever it takes to help you
                  <br />
                  <span className="text-highlight" style={{ color: '#9747ff' }}>understand the concepts.</span>
                </>
              )}
            </span>
          </div>
          <div className="middle">
            <div className="video-container">
              {homepageLoading ? (
                <div style={{ 
                  height: '100%',
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#9747ff',
                  fontSize: '16px',
                  background: '#1a1a1a'
                }}>
                  Loading media...
                </div>
              ) : homepageData && homepageData.heroMedia && homepageData.heroMedia.url ? (
                (() => {
                  console.log('Rendering hero media:', homepageData.heroMedia);
                  if (homepageData.heroMedia.type === 'image') {
                    return <img src={homepageData.heroMedia.url} alt="Hero Media" />;
                  } else if (homepageData.heroMedia.type === 'video') {
                    const url = homepageData.heroMedia.url;
                    const ytMatch = url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|v\/))([\w-]{11})/);
                    if (ytMatch) {
                      return <iframe src={`https://www.youtube.com/embed/${ytMatch[1]}`} frameBorder={0} allow="autoplay; encrypted-media" allowFullScreen />;
                    }
                    
                    // Custom video player with hover functionality
                    return (
                      <div 
                        className="video-container-hover"
                        style={{
                          position: 'relative',
                          width: '100%',
                          height: '100%',
                          borderRadius: '10px',
                          overflow: 'hidden',
                          cursor: 'pointer'
                        }}
                        onMouseEnter={async (e) => {
                          if (videoPlayMode === 'hover') {
                            try {
                              const video = e.currentTarget.querySelector('video');
                              if (video) {
                                video.loop = true;
                                video.style.opacity = '1';
                                try {
                                  await video.play();
                                } catch (playError) {
                                  console.log('Hover play error:', playError);
                                }
                              }
                            } catch (error) {
                              console.log('Mouse enter error:', error);
                            }
                          }
                        }}
                        onMouseLeave={(e) => {
                          if (videoPlayMode === 'hover') {
                            const video = e.currentTarget.querySelector('video');
                            if (video) {
                              video.pause();
                              video.style.opacity = '0.8';
                            }
                          }
                        }}
                        onTouchStart={(e) => {
                          // Touch handled by mobile play/pause button
                          e.stopPropagation();
                        }}
                      >
                        <video 
                          src={url} 
                          style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover',
                            opacity: '0.8',
                            transition: 'opacity 0.3s ease'
                          }}
                          muted
                          loop
                          playsInline
                          preload="metadata"
                          controls={false}
                          controlsList="nodownload"
                          disablePictureInPicture
                          onContextMenu={(e) => e.preventDefault()}
                          onEnded={(e) => {
                            if (videoPlayMode === 'manual') {
                              setVideoPlayMode('hover');
                              e.target.loop = true;
                              e.target.style.opacity = '0.8';
                              const playIcon = e.target.parentElement.querySelector('.play-icon');
                              if (playIcon) {
                                playIcon.style.opacity = '1';
                              }
                            }
                          }}
                          onTimeUpdate={(e) => {
                            const video = e.target;
                            if (video.duration) {
                              const progress = (video.currentTime / video.duration) * 100;
                              setVideoProgress(progress);
                            }
                          }}
                          onPlay={() => setIsVideoPlaying(true)}
                          onPause={() => setIsVideoPlaying(false)}
                          onClick={async (e) => {
                            e.stopPropagation();
                            e.preventDefault();
                            try {
                              const video = e.target;
                              if (video.paused) {
                                try {
                                  await video.play();
                                } catch (playError) {
                                  console.log('Video click play error:', playError);
                                  video.play().catch(err => console.log('Fallback click play error:', err));
                                }
                              } else {
                                video.pause();
                              }
                            } catch (error) {
                              console.log('Video click error:', error);
                            }
                          }}
                        />
                        
                        {/* Custom Video Controls */}
                        <div className="custom-video-controls" style={{
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          right: 0,
                          bottom: 0,
                          pointerEvents: 'none',
                          zIndex: 5
                        }}>
                          {/* Volume Control - Top Left */}
                          <button
                            style={{
                              position: 'absolute',
                              top: '15px',
                              left: '15px',
                              background: 'rgba(0,0,0,0.7)',
                              border: 'none',
                              borderRadius: '50%',
                              width: '40px',
                              height: '40px',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              cursor: 'pointer',
                              pointerEvents: 'auto',
                              zIndex: 10
                            }}
                            onClick={(e) => {
                              e.stopPropagation();
                              const video = e.currentTarget.parentElement.parentElement.querySelector('video');
                              if (video) {
                                video.muted = !video.muted;
                                e.currentTarget.innerHTML = video.muted ? 
                                  '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M11 5L6 9H2V15H6L11 19V5Z" fill="white"/><path d="M19.07 4.93L17.66 6.34C19.11 7.78 20 9.62 20 11.5C20 13.38 19.11 15.22 17.66 16.66L19.07 18.07C20.88 16.26 22 13.97 22 11.5C22 9.03 20.88 6.74 19.07 4.93Z" fill="white"/></svg>' :
                                  '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M11 5L6 9H2V15H6L11 19V5Z" fill="white"/></svg>';
                              }
                            }}
                          >
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path d="M11 5L6 9H2V15H6L11 19V5Z" fill="white"/>
                            </svg>
                          </button>

                          {/* Fullscreen Control - Top Right */}
                          <button
                            style={{
                              position: 'absolute',
                              top: '15px',
                              right: '15px',
                              background: 'rgba(0,0,0,0.7)',
                              border: 'none',
                              borderRadius: '50%',
                              width: '40px',
                              height: '40px',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              cursor: 'pointer',
                              pointerEvents: 'auto',
                              zIndex: 10
                            }}
                            onClick={(e) => {
                              e.stopPropagation();
                              const video = e.currentTarget.parentElement.parentElement.querySelector('video');
                              if (video) {
                                if (document.fullscreenElement) {
                                  document.exitFullscreen();
                                } else {
                                  video.requestFullscreen();
                                }
                              }
                            }}
                          >
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path d="M7 14H5V19H10V17H7V14Z" fill="white"/>
                              <path d="M5 10H7V7H10V5H5V10Z" fill="white"/>
                              <path d="M17 17H14V19H19V14H17V17Z" fill="white"/>
                              <path d="M14 5V7H17V10H19V5H14Z" fill="white"/>
                            </svg>
                          </button>

                                                     {/* Progress Bar - Bottom */}
                           <div 
                             style={{
                               position: 'absolute',
                               bottom: '0',
                               left: '0',
                               right: '0',
                               height: '4px',
                               background: 'rgba(0,0,0,0.3)',
                               pointerEvents: 'auto',
                               cursor: 'pointer'
                             }}
                             onClick={(e) => {
                               e.stopPropagation();
                               const video = e.currentTarget.parentElement.parentElement.querySelector('video');
                               if (video) {
                                 const rect = e.currentTarget.getBoundingClientRect();
                                 const clickX = e.clientX - rect.left;
                                 const percentage = (clickX / rect.width) * 100;
                                 const newTime = (percentage / 100) * video.duration;
                                 video.currentTime = newTime;
                               }
                             }}
                           >
                                                         <div 
                               className="video-progress"
                               style={{
                                 height: '100%',
                                 background: '#9747ff',
                                 width: `${videoProgress}%`,
                                 transition: 'width 0.1s ease'
                               }}
                             />
                          </div>
                        </div>

                        {/* Center Play/Pause Icon - Desktop */}
                        {!isMobile && (
                          <div 
                            style={{
                              position: 'absolute',
                              top: '50%',
                              left: '50%',
                              transform: 'translate(-50%, -50%)',
                              background: 'rgba(0,0,0,0.7)',
                              borderRadius: '50%',
                              width: '60px',
                              height: '60px',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              cursor: 'pointer',
                              transition: 'opacity 0.3s ease',
                              zIndex: 10
                            }}
                            className="play-icon"
                            onClick={async (e) => {
                              e.stopPropagation();
                              e.preventDefault();
                              try {
                                const video = e.currentTarget.parentElement.querySelector('video');
                                if (video) {
                                  console.log('Play button clicked - switching to manual mode');
                                  setVideoPlayMode('manual');
                                  video.loop = false;
                                  video.style.opacity = '1';
                                  e.currentTarget.style.opacity = '0';
                                  
                                  // Use try-catch for video.play() as it returns a promise
                                  try {
                                    await video.play();
                                  } catch (playError) {
                                    console.log('Video play error:', playError);
                                    // Fallback: try to play without await
                                    video.play().catch(err => console.log('Fallback play error:', err));
                                  }
                                }
                              } catch (error) {
                                console.log('Play button click error:', error);
                              }
                            }}
                          >
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path d="M8 5V19L19 12L8 5Z" fill="white"/>
                            </svg>
                          </div>
                        )}

                        {/* Center Play/Pause Icon - Mobile */}
                        {isMobile && (
                          <div 
                            style={{
                              position: 'absolute',
                              top: '50%',
                              left: '50%',
                              transform: 'translate(-50%, -50%)',
                              background: 'rgba(0,0,0,0.7)',
                              borderRadius: '50%',
                              width: '70px',
                              height: '70px',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              cursor: 'pointer',
                              transition: 'all 0.3s ease',
                              zIndex: 10,
                              opacity: isVideoPlaying ? 0 : 1
                            }}
                            className="mobile-play-pause-icon"
                            onClick={async (e) => {
                              e.stopPropagation();
                              e.preventDefault();
                              try {
                                const video = e.currentTarget.parentElement.querySelector('video');
                                if (video) {
                                  if (video.paused) {
                                    try {
                                      await video.play();
                                      video.style.opacity = '1';
                                    } catch (playError) {
                                      console.log('Mobile video play error:', playError);
                                      video.play().catch(err => console.log('Fallback mobile play error:', err));
                                    }
                                  } else {
                                    video.pause();
                                    video.style.opacity = '0.8';
                                  }
                                }
                              } catch (error) {
                                console.log('Mobile play button error:', error);
                              }
                            }}
                          >
                            {isVideoPlaying ? (
                              // Pause Icon
                              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M6 4H10V20H6V4Z" fill="white"/>
                                <path d="M14 4H18V20H14V4Z" fill="white"/>
                              </svg>
                            ) : (
                              // Play Icon
                              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M8 5V19L19 12L8 5Z" fill="white"/>
                              </svg>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  }
                   return null;
                })()
              ) : (
                <img src="https://ik.imagekit.io/cybershoora/Shoora.tech/Live-Course_Thumbnail.%20Vector%20illustration_?updatedAt=1750021872707" alt="coursesimg" title="Introduction to Sheryians Coding School" />
              )}
            </div>
          </div>
          <div className="bottom">
            <a href="#" target="_blank" rel="noopener" className="btn btn-primary shadow-bottom shadow-primary" style={{ color: '#fff' }}>
              Explore More
            </a>
          </div>
        </section>
        {/* Courses Offered Section */}
        <section className="view" id="view3">
          <div className="top">
            <h1>
              <span>Courses Offered.</span>
            </h1>
          </div>
          <div className="bottom">
            <div className="courses" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 2fr))', gap: '2rem', rowGap: '2rem' ,}}>
              {homepageCourses.length === 0 ? (
                <div style={{ color: '#fff', textAlign: 'center', gridColumn: '1/-1' }}>No courses found.</div>
              ) : (
                homepageCourses.map((course, idx) => (
                  <div className="course-card" key={course._id || idx} style={{ background: "url('/assets/metal.png')", borderRadius: 18, boxShadow: '0 8px 32px 0 rgba(10,12,20,0.22)', border: '1.5px solid #232428', color: '#fff', overflow: 'hidden', display: 'flex', flexDirection: 'column', margin: '0 1rem 0rem 1rem', position: 'relative' }}>
                    {/* Background overlays absolutely positioned at the back */}
                    <div style={{
                      position: 'absolute',
                      inset: 0,
                      borderRadius: 18,
                      pointerEvents: 'none',
                      zIndex: 1,
                      background: "transparent",
                      opacity: 0.32,
                      mixBlendMode: 'lighten',
                    }} />
                    <div style={{
                      position: 'absolute',
                      top: '8%',
                      left: '-20%',
                      width: '140%',
                      height: '32%',
                      borderRadius: '40% 60% 60% 40%/60% 40% 60% 40%',
                      background: 'linear-gradient(110deg, rgba(255,255,255,0.85) 0%, rgba(255,255,255,0.12) 80%, rgba(255,255,255,0) 100%)',
                      filter: 'blur(8px)',
                      opacity: 0.38,
                      zIndex: 2,
                      pointerEvents: 'none',
                    }} />
                    {/* Card content always above overlays */}
                    <div style={{ position: 'relative', zIndex: 3 }}>
                      <div className="course-image" style={{ position: 'relative', height: 200, overflow: 'hidden' }}>
                        <img src={course.image} alt={course.title} className="course-img" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        {course.badge && <div className="category-badge" style={{ position: 'absolute', top: 15, left: 15, background: 'rgba(255,255,255,0.7)', color: '#000', padding: '5px 12px', borderRadius: 15, fontWeight: 500, fontSize: 12 }}>{course.badge}</div>}
                      </div>
                      <div className="card-bg" style={{ position: 'relative', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: 24 }}>
                        <div className="course-content">
                          <h3 className="course-title" style={{ fontSize: 18, fontWeight: 600, margin: 0, marginBottom: 10, display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}
                            onClick={() => {
                              setOpenDropdowns((prev) => {
                                const copy = [...prev];
                                copy[idx] = !copy[idx];
                                return copy;
                              });
                            }}
                          >
                            {course.title}
                            {Array.isArray(course.technologies) && course.technologies.length > 0 && (
                              <span style={{ display: 'inline-block', transition: 'transform 0.3s', transform: openDropdowns[idx] ? 'rotate(180deg)' : 'rotate(0deg)' }}>
                                <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                                  <path d="M6 9L11 14L16 9" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                              </span>
                            )}
                          </h3>
                          {/* Technologies dropdown: only show if open */}
                          {Array.isArray(course.technologies) && course.technologies.length > 0 && openDropdowns[idx] && (
                            <div style={{ margin: '4px 0 8px 0' }}>
                              <strong style={{ color: '#8b5cf6', fontSize: 14 }}>Technologies:</strong>
                              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: 6 }}>
                                {course.technologies.map((tech, i) => (
                                  <span key={i} style={{ background: '#8b5cf6', color: '#fff', borderRadius: '16px', padding: '4px 14px', fontSize: 14, fontWeight: 500, display: 'inline-block' }}>{tech}</span>
                                ))}
                              </div>
                            </div>
                          )}
                          {/* Details below title, above duration */}
                          {course.details && (
                            <div style={{ color: '#ccc', fontSize: 14, margin: '4px 0 8px 0' }}>
                              {Array.isArray(course.details) ? course.details.join(', ') : course.details}
                            </div>
                          )}
                          {course.duration && <p className="course-duration" style={{ color: '#8b5cf6', fontWeight: 600, margin: 0, marginBottom: 10 }}>{course.duration}</p>}
                          {course.languages && (
                            <div className="Course-language" style={{ display: 'flex', gap: 8, marginBottom: 10 }}>
                              {(Array.isArray(course.languages) ? course.languages : typeof course.languages === 'string' ? course.languages.split(',').map(l => l.trim()).filter(Boolean) : []).map((lang, i) => (
                                <p key={i} style={{ background: '#333', color: '#fff', borderRadius: 8, padding: '4px 10px', fontSize: 13, margin: 0 }}>{lang}</p>
                              ))}
                            </div>
                          )}
                          <div className="pricing" style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                            {course.originalPrice && <span className="original-price" style={{ color: '#666', textDecoration: 'line-through', fontSize: 14 }}>&#8377; {course.originalPrice}</span>}
                            {course.currentPrice && <span className="current-price" style={{ color: '#fff', fontWeight: 700, fontSize: 18 }}>&#8377; {course.currentPrice}</span>}
                            {course.discount && <span className="discount" style={{ background: '#22c55e', color: '#fff', borderRadius: 12, padding: '2px 8px', fontSize: 12, fontWeight: 600 }}>{course.discount}</span>}
                          </div>
                        </div>
                        <div style={{ display: 'flex', gap: 10, marginTop: 16 }}>
                          <button className="view-details-btn" style={{ flex: 1, background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)', color: '#fff', border: 'none', padding: 12, borderRadius: 8, fontWeight: 600, cursor: 'pointer' }} onClick={() => { }}>
                            View Details
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </section>
        {/* Companies Section */}
        <section className="view companies-section" id="view4">
          <div className="top">
            <h1>
              <span>
                Top <span className="text-highlight">companies</span> our students working with
              </span>
            </h1>
          </div>
                    <div className="companies-logos-wrapper" ref={companiesSliderRef}>
            {(homepageData?.companies || []).length === 0 ? (
              <div style={{ 
                textAlign: 'center', 
                color: '#666', 
                fontSize: '16px', 
                padding: '40px 20px',
                background: '#1a1a1a',
                borderRadius: '12px',
                border: '2px dashed #333'
              }}>
                <div style={{ marginBottom: '12px' }}>📊</div>
                <div>No company logos added yet</div>
                <div style={{ fontSize: '14px', marginTop: '8px', color: '#888' }}>
                  Add company logos from admin dashboard
                </div>
              </div>
            ) : isMobile ? (
              <div className="companies-logos-row">
                {/* Duplicate logos for infinite scroll effect */}
                {[...(homepageData?.companies || []), ...(homepageData?.companies || []), ...(homepageData?.companies || []), ...(homepageData?.companies || [])].map((logo, idx) => (
                  <img key={idx} src={logo.src} alt={logo.alt} title={logo.title || logo.alt} className="company-logo" />
                ))}
              </div>
            ) : (
              <>
                {/* First row - 3 logos */}
                <div className="companies-logos-row row-1">
                  {(homepageData?.companies || []).slice(0, 3).map((logo, idx) => (
                    <img key={idx} src={logo.src} alt={logo.alt} title={logo.title || logo.alt} className="company-logo" />
                  ))}
                </div>
                {/* Second row - 4 logos */}
                <div className="companies-logos-row row-2">
                  {(homepageData?.companies || []).slice(3, 7).map((logo, idx) => (
                    <img key={idx + 3} src={logo.src} alt={logo.alt} title={logo.title || logo.alt} className="company-logo" />
                  ))}
                </div>
                {/* Third row - 4 logos */}
                <div className="companies-logos-row row-3">
                  {(homepageData?.companies || []).slice(7, 11).map((logo, idx) => (
                    <img key={idx + 7} src={logo.src} alt={logo.alt} title={logo.title || logo.alt} className="company-logo" />
                  ))}
                </div>
                {/* Fourth row - 4 logos */}
                <div className="companies-logos-row row-4">
                  {(homepageData?.companies || []).slice(11, 15).map((logo, idx) => (
                    <img key={idx + 11} src={logo.src} alt={logo.alt} title={logo.title || logo.alt} className="company-logo" />
                  ))}
                </div>
              </>
            )}
          </div>
          <div className="bottom">
            <a href="/courses" className="btn btn-primary btn-explore" style={{ color: '#fff' }}>
              Explore Courses
            </a>
          </div>
        </section>
        {/* FAQs Section */}
        <section className="view" id="view5">
          <div className="top">
            <h1 className="mobile-view">FAQs</h1>
            <h1> Frequently <br /> Asked <br /> Question </h1>
            <p>
              <span>or drop email at</span>
              <br />
              <a href="mailto:hello@sheryians.com" className="text-highlight" style={{ color: '#fff' }}>
                teamcybershoora@gmail.com
              </a>
            </p>
          </div>
          <div className="bottom">
            {(homepageData?.faqs || [
              { question: 'What kind of courses do you offer?', answer: 'We offer job-ready courses in Web Development, UI/UX Design, 3D Animation, Graphic Design, App Development, and more — all focused on practical learning and real-world projects.' },
              { question: 'Are the classes live or recorded?', answer: 'All our classes are conducted live, with full interaction. However, you also get access to recorded sessions for revision and backup.' },
              { question: 'Do I need any prior knowledge to join the course?', answer: 'No prior experience is required. Our courses are beginner-friendly and start from scratch.' },
              { question: 'Will I receive a certificate after completion?', answer: 'Yes! All students receive an industry-recognized certificate after successfully completing the course and projects.' },
            ]).map((faq, idx) => (
              <div key={idx}>
                <div className="accordian">
                  <label htmlFor={`accordian_${idx}`}>
                    <input type="checkbox" id={`accordian_${idx}`} hidden />
                    <div className="left">
                      <span>{faq.question}</span>
                    </div>
                    <div className="right">
                      <i className="ri-arrow-down-s-line"></i>
                    </div>
                  </label>
                  <div className="content">
                    <div className="accordian-content">
                      <p>{faq.answer}</p>
                    </div>
                  </div>
                </div>
                {idx < (homepageData?.faqs || []).length - 1 && <hr />}
              </div>
            ))}
          </div>
        </section>
      </main>
    </>
  );
}
