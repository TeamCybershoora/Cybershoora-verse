'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import '@/styles/common.scss';
import '@/styles/common.css';
import { toast } from 'react-hot-toast';
import GetStartedModal from './GetStartedModal';

export default function Navbar() {
    const [isRequestPopupOpen, setRequestPopupOpen] = useState(false);
    const [isDiscordPopupOpen, setDiscordPopupOpen] = useState(false);
    const [isLoginPopupOpen, setLoginPopupOpen] = useState(false);

    const initialFormState = {
        name: '',
        phone: '',
        datetime: new Date().toISOString().slice(0, 16),
        enquiry: 'online',
        course: '',
    };
    const [form, setForm] = useState(initialFormState);

    function handleChange(e) {
        setForm({ ...form, [e.target.name]: e.target.value });
    }

    function handleSubmit(e) {
        e.preventDefault();
        if (
            !form.name.trim() ||
            !form.phone.trim() ||
            !form.datetime.trim() ||
            !form.enquiry.trim() ||
            !form.course.trim()
        ) {
            toast.error('Please fill all fields!');
            return;
        }
        setRequestPopupOpen(false);
        toast.success('Request submitted successfully!');
        setForm(initialFormState);
    }

    // Function to close the menu
    function closeMenu() {
        const toggleBtn = document.querySelector('.menu-toggle');
        if (toggleBtn && toggleBtn.classList.contains('menu-show')) {
            toggleBtn.classList.remove('menu-show');
            toggleBtn.classList.remove('menu-close');
        }
    }

    useEffect(() => {
        const toggleBtn = document.querySelector('.menu-toggle');
        if (!toggleBtn) return;

        const handleClick = () => {
            if (toggleBtn.classList.contains('menu-show')) {
                toggleBtn.classList.add('menu-close');
            } else {
                toggleBtn.classList.remove('menu-close');
            }
            toggleBtn.classList.toggle('menu-show');
        };

        toggleBtn.addEventListener('click', handleClick);
        return () => {
            toggleBtn.removeEventListener('click', handleClick);
        };
    }, []);

    return (

        <>

            <nav>
                <div className="header">
                    <div className="left nav-left" onClick={() => (window.location.href = '/')}>
                        <div className="logo-container">
                            <Image
                                src="https://ik.imagekit.io/cybershoora/Shooraverse/Logos%20of%20Web%20Panel%20or%20Web%20aap/Shooraverse-text.svg?updatedAt=1750497732898"
                                alt="Shooraverse"
                                fill
                                className="logo-img"
                            />
                        </div>
                    </div>

                    <div className="right">
                        
                        <Link href="/courses" className="nav-item"><span>Courses</span></Link>
                        <Link href="/" className="nav-item"><span>Products</span></Link>
                        <Link href="#" className="nav-item">
                            <span className="wiggle live-course-link" onClick={e => { e.preventDefault(); setShowGetStarted(true); }}>Certification</span>
                        </Link>

                        <button onClick={() => setRequestPopupOpen(true)} className="nav-item mobile-item request-callback" style={{ color: '#fff' }}>
                            <i className="ri-phone-line"></i>
                            <span>Request Callback</span>
                        </button>

                        <Link href="/#" className="nav-item auth-user">
                            <span className="btn btn-primary sign-in" style={{ color: '#fff' }} onClick={() => setLoginPopupOpen(true)}>Login</span>
                        </Link>

                        <div className="menu nav-item">
                            <div className="menu-toggle">
                                <div className="line line1"></div>
                                <div className="line line2"></div>
                                <div className="line line2"></div>
                            </div>

                            <div className="menu-panel">
                                <div className="menu-header"><h1>Menu</h1></div>
                                <div className="menu-items" style={{ position: 'relative', zIndex: 3 }}>
                                    <Link href="/" className="nav-item menu-item mobile-item" onClick={closeMenu}>Website</Link>
                                    <Link href="/courses" className="nav-item menu-item mobile-item" onClick={closeMenu}>Courses</Link>
                                    <Link href="#" className="nav-item menu-item mobile-item highlight-nav" style={{ color: '#ff6a32' }} onClick={() => setLoginPopupOpen(true)}>
                                        Login 🚀
                                    </Link>
                                    <button onClick={() => { setRequestPopupOpen(true); closeMenu(); }} className="nav-item menu-item mobile-item">Enquiry</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Request Callback Popup */}
                {isRequestPopupOpen && (
                    <>
                        <div className="blur-overlay"></div>
                        <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.5)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'auto' }}>
                            <div style={{ position: 'relative', minWidth: 340, maxWidth: 380, width: '100%', borderRadius: 10, boxShadow: '0 2px 16px #0008' }}>
                                {/* Metal backgrounds */}
                                <div style={{
                                    position: 'absolute',
                                    inset: 0,
                                    zIndex: 1,
                                    borderRadius: 10,
                                    background: "url('/assets/metal-3.png') center center/cover no-repeat",
                                    opacity: 0.92,
                                }}></div>
                                <div style={{
                                    position: 'absolute',
                                    inset: 0,
                                    zIndex: 2,
                                    borderRadius: 10,
                                    background: "url('/assets/metal-strip.png') center center/cover no-repeat",
                                    opacity: 0.7,
                                    pointerEvents: 'none',
                                }}></div>
                                {/* Form content */}
                                <form onSubmit={handleSubmit} style={{ background: 'transparent', color: '#fff', borderRadius: 10, padding: 32, minWidth: 340, maxWidth: 380, position: 'relative', zIndex: 3, boxShadow: 'none' }}>
                                    <button type="button" onClick={() => setRequestPopupOpen(false)} style={{ position: 'absolute', top: 12, right: 12, background: 'none', border: 'none', color: '#fff', fontSize: 22, cursor: 'pointer', zIndex: 4 }}>&#10005;</button>
                                    <h2 style={{ textAlign: 'center', fontWeight: 700, marginBottom: 4 }}>Request a callback</h2>
                                    <div style={{ textAlign: 'center', fontSize: 15, marginBottom: 18, color: '#ccc' }}>Fill the form below to request a callback from our team.</div>
                                    <label style={{ fontWeight: 500 }}>Name</label>
                                    <input name="name" value={form.name} onChange={handleChange} placeholder="Name" required style={{ width: '100%', marginBottom: 12, marginTop: 2, padding: 8, borderRadius: 4, border: 'none', background: '#181818', color: '#fff' }} />
                                    <label style={{ fontWeight: 500 }}>Phone</label>
                                    <input name="phone" value={form.phone} onChange={handleChange} placeholder="Phone" required style={{ width: '100%', marginBottom: 12, marginTop: 2, padding: 8, borderRadius: 4, border: 'none', background: '#181818', color: '#fff' }} />
                                    <div style={{ marginBottom: 28 }}>
                                        <label style={{ fontWeight: 500, marginBottom: 6, display: 'block' }}>Select Date and Time <span role="img" aria-label="calendar">📅</span></label>
                                        <input type="datetime-local" name="datetime" value={form.datetime} onChange={handleChange} required style={{ width: '100%', marginTop: 2, padding: 8, borderRadius: 4, border: 'none', background: '#181818', color: '#fff', display: 'block' }} />
                                    </div>
                                    <label style={{ fontWeight: 500 }}>Enquiry For <span role="img" aria-label="calendar">📅</span></label>
                                    <select name="enquiry" value={form.enquiry} onChange={handleChange} style={{ width: '100%', marginBottom: 12, marginTop: 2, padding: 8, borderRadius: 4, border: 'none', background: '#181818', color: '#fff' }}>
                                        <option value="online">Online Courses</option>
                                        <option value="offline">Offline Courses</option>
                                    </select>
                                    <label style={{ fontWeight: 500 }}>Course Name</label>
                                    <input name="course" value={form.course} onChange={handleChange} placeholder="Course Name" style={{ width: '100%', marginBottom: 18, marginTop: 2, padding: 8, borderRadius: 4, border: 'none', background: '#181818', color: '#fff' }} />
                                    <button
                                        type="submit"
                                        className="callback-submit-btn"
                                        style={{
                                            width: '100%',
                                            fontSize: 16,
                                            marginTop: 8,
                                            transition: 'background 0.3s',
                                            zIndex: 4,
                                            position: 'relative',
                                            overflow: 'visible',
                                        }}
                                    >
                                        Submit
                                    </button>
                                </form>
                            </div>
                        </div>
                    </>
                )}

                {/* Login Popup Modal using GetStartedModal for consistent UI */}
                {isLoginPopupOpen && (
                    <GetStartedModal
                        open={isLoginPopupOpen}
                        onClose={() => setLoginPopupOpen(false)}
                        onlyLogin={true}
                    />
                )}
            </nav>

            <style jsx>{`
      
      .logo-container {
  position: relative;
  width: 12rem;
  height: 3.5rem;

  @media (max-width: 768px) {
    width: 8rem;
    height: 2.5rem;
  }
}

.logo-img {
  object-fit: contain;
}

      
      `}</style>

            <style jsx global>{`
                .blur-overlay {
                    position: fixed;
                    top: 0; left: 0; right: 0; bottom: 0;
                    width: 100vw;
                    height: 100vh;
                    z-index: 9998;
                    backdrop-filter: blur(6px);
                    background: rgba(0,0,0,0.2);
                    pointer-events: none;
                }
            `}</style>
        </>
    );
}
