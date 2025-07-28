"use client";
import { unstable_noStore as noStore } from 'next/cache';

import { useEffect, useState, useRef } from "react";
import HomepageCourseCard from '../../components/HomepageCourseCard';
import '@/styles/courses.css';
import '@/styles/scratcher.css';
import Scratcher from '../../components/Scratcher';

export default function CoursesPage() {
  // Force dynamic rendering to prevent static generation issues
  noStore();
  
  const canvasRef = useRef(null);
  const baseRef = useRef(null);

  // Coupon code (future: get from admin panel)
  const codes = ['ASHOOTA9870', 'SHOORA2024', 'DISCOUNT50', 'LEARNBIG', 'STUDENTX'];
  const couponCode = codes[Math.floor(Math.random() * codes.length)];

  // Add state for courses and loading
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openDropdowns, setOpenDropdowns] = useState([]);

  useEffect(() => {
    // Fetch courses from API
    fetch('/api/courses')
      .then(res => res.json())
      .then(data => {
        setCourses(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const img = new window.Image();
    img.src = '/assets/metal.png';
    img.onload = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    };
    let isDrawing = false;
    function getXY(e) {
      const rect = canvas.getBoundingClientRect();
      const x = (e.touches ? e.touches[0].clientX : e.clientX) - rect.left;
      const y = (e.touches ? e.touches[0].clientY : e.clientY) - rect.top;
      return { x, y };
    }
    function start(e) { isDrawing = true; scratch(e); }
    function end() { isDrawing = false; }
    function scratch(e) {
      if (!isDrawing) return;
      const { x, y } = getXY(e);
      ctx.globalCompositeOperation = 'destination-out';
      ctx.beginPath();
      ctx.arc(x, y, 28, 0, 2 * Math.PI);
      ctx.fill();
      ctx.globalCompositeOperation = 'source-over';
    }
    canvas.addEventListener('mousedown', start);
    canvas.addEventListener('touchstart', start);
    canvas.addEventListener('mousemove', scratch);
    canvas.addEventListener('touchmove', scratch);
    canvas.addEventListener('mouseup', end);
    canvas.addEventListener('touchend', end);
    return () => {
      canvas.removeEventListener('mousedown', start);
      canvas.removeEventListener('touchstart', start);
      canvas.removeEventListener('mousemove', scratch);
      canvas.removeEventListener('touchmove', scratch);
      canvas.removeEventListener('mouseup', end);
      canvas.removeEventListener('touchend', end);
    };
  }, []);

  return (
    <>
    <div className="course-page">
      <div className="container">
        <header className="header">
          <h1 className="main-title">
            We're not a <span className="highlight">course factory.</span>
          </h1>
          <p className="subtitle">We focus on courses that really help.</p>
        </header>

        <div className="filter-section">
          <p className="filter-text">Courses which do work</p>
          <button className="filter-dropdown">⌄</button>
        </div>

        {/* Show loading or no courses message */}
        {loading ? (
          <div style={{textAlign: 'center', margin: '2rem'}}>Loading courses...</div>
        ) : courses.length === 0 ? (
          <div style={{textAlign: 'center', margin: '2rem'}}>No courses found.</div>
        ) : (
          <div className="courses">
            {courses.map((course, idx) => (
              <HomepageCourseCard
                key={course._id || idx}
                course={course}
                idx={idx}
                openDropdown={openDropdowns[idx]}
                setOpenDropdowns={setOpenDropdowns}
              />
            ))}
          </div>
        )}

        <div className="scratcher-left-align">
          <Scratcher />
          <button
            style={{
              background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
              color: '#fff',
              border: 'none',
              padding: '14px 36px',
              borderRadius: '10px',
              fontWeight: 700,
              fontSize: '1.1rem',
              boxShadow: '0 4px 16px 0 rgba(10,12,20,0.12)',
              cursor: 'pointer',
              letterSpacing: '1px',
              transition: 'all 0.2s',
             
            }}
          >
            Apply Coupon Code
          </button>
        </div>
      </div>
      <style jsx global>{`
  .scratcher-left-align {
    width: 100%;
    display: block;
    margin-left: 0;
  }
`}</style> 
    </div>
    </>
  );
}

