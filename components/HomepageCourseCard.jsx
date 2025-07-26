import React from 'react';

export default function HomepageCourseCard({ course, idx, openDropdown, setOpenDropdowns }) {
  return (
    <div className="course-card" style={{ background: `url('/assets/metal.png')`, borderRadius: 18, boxShadow: '0 8px 32px 0 rgba(10,12,20,0.22)', border: '1.5px solid #232428', color: '#fff', overflow: 'hidden', display: 'flex', flexDirection: 'column', margin: '0 1rem 2rem 1rem', position: 'relative' }}>
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
                <span style={{ display: 'inline-block', transition: 'transform 0.3s', transform: openDropdown ? 'rotate(180deg)' : 'rotate(0deg)' }}>
                  <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M6 9L11 14L16 9" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
              )}
            </h3>
            {/* Technologies dropdown: only show if open */}
            {Array.isArray(course.technologies) && course.technologies.length > 0 && openDropdown && (
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
              {course.currentPrice && (
                <span className="current-price" style={{ color: '#fff', fontWeight: 700, fontSize: 18, display: 'flex', alignItems: 'center', gap: 4, whiteSpace: 'nowrap' }}>
                  <span style={{ fontSize: 18, display: 'inline-block' }}>&#8377;</span>
                  <span style={{ fontSize: 18, display: 'inline-block' }}>{course.currentPrice}</span>
                </span>
              )}
              {course.discount && <span className="discount" style={{ background: '#22c55e', color: '#fff', borderRadius: 12, padding: '2px 8px', fontSize: 12, fontWeight: 600 }}>{course.discount}</span>}
            </div>
          </div>
          <div style={{ display: 'flex', gap: 10, marginTop: 16 }}>
            <button className="view-details-btn" style={{ flex: 1, background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)', color: '#fff', border: 'none', padding: 12, borderRadius: 8, fontWeight: 600, cursor: 'pointer' }} onClick={() => { window.location.href = course.link || '#' }}>
              View Details
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 