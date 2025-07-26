import React, { useState } from 'react';

export default function CourseCard({
  image,
  badge,
  title,
  duration,
  languages = [],
  originalPrice,
  currentPrice,
  discount,
  link = '#',
  details = [],
  onDetailsClick,
  noCardContainer // new prop
}) {
  const [open, setOpen] = useState(false);
  // Always use array for languages
  const langArray = Array.isArray(languages)
    ? languages
    : typeof languages === 'string'
      ? languages.split(',').map(l => l.trim()).filter(Boolean)
      : [];
  const content = (
    <>
      <div className="course-image">
        <img src={image} alt={title} className="course-img" />
        {badge && <div className="category-badge">{badge}</div>}
      </div>
      <div className="card-bg">
        <div className="course-content">
          <h3 className="course-title" style={{ display: 'flex', alignItems: 'center', gap: '0.5em' }}>
            {title}
            {details.length > 0 && (
              <button
                className={`dropdown-arrow${open ? 'open' : ''}`}
                onClick={() => setOpen((v) => !v)}
                aria-label="Show course details"
                style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, marginLeft: 6 }}
              >
                <span
                  style={{
                    display: 'inline-block',
                    transition: 'transform 0.3s',
                    transform: open ? 'rotate(180deg)' : 'rotate(0deg)'
                  }}
                >
                  <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M6 9L11 14L16 9" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </span>
              </button>
            )}
          </h3>
          {open && details.length > 0 && (
            <ul className="course-details-dropdown">
              {details.map((item, i) => (
                <li key={i}>
                  {typeof item === 'object' && item.img ? (
                    <img src={item.img} alt={item.alt || `detail-img-${i}`} style={{ maxWidth: '100%', maxHeight: 120, borderRadius: 8 }} />
                  ) : (
                    item
                  )}
                </li>
              ))}
            </ul>
          )}
          {duration && <p className="course-duration">{duration}</p>}
          {langArray.length > 0 && (
            <div className="Course-language">
              {langArray.map((lang, i) => (
                <p key={i} className={lang}>{lang}</p>
              ))}
            </div>
          )}
          <div className="pricing">
            {originalPrice && <span className="original-price">{originalPrice}</span>}
            {currentPrice && <span className="current-price">{currentPrice}</span>}
            {discount && <span className="discount">{discount}</span>}
          </div>
          <button className="view-details-btn" onClick={onDetailsClick}>
            View Details
          </button>
        </div>
        <span className="edge-highlight"></span>
      </div>
    </>
  );
  if (noCardContainer) return content;
  return <div className="course-card">{content}</div>;
}
