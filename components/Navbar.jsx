'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import '@/styles/navbar.css';
import '@/styles/Navbar.scss';

export default function Navbar() {
    const [isRequestPopupOpen, setRequestPopupOpen] = useState(false);
    const [isDiscordPopupOpen, setDiscordPopupOpen] = useState(false);

    const [requestForm, setRequestForm] = useState({
        name: '',
        contact: '',
        datetime: '2025-06-15T13:30',
        enquiryFor: 'online',
        courseName: '',
    });

    const handleRequestChange = (e) => {
        setRequestForm({ ...requestForm, [e.target.name]: e.target.value });
    };

    const handleRequestSubmit = (e) => {
        e.preventDefault();
        console.log('Request Callback Submitted:', requestForm);
        alert('Request submitted!');
        setRequestPopupOpen(false);
    };

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
                                src="https://ik.imagekit.io/cybershoora/Shoora.tech/Logos%20of%20Web%20Panel%20or%20Web%20aap/Shoora-tech-text.svg?updatedAt=1750497732898"
                                alt="Shoora Tech"
                                fill
                                className="logo-img"
                            />
                        </div>
                    </div>

                    <div className="right">
                        <Link href="/" className="nav-item"><span>Website</span></Link>
                        <Link href="/register" className="nav-item">
                            <span className="wiggle live-course-link">Register</span>
                        </Link>

                        <button onClick={() => setRequestPopupOpen(true)} className="nav-item mobile-item request-callback">
                            <i className="ri-phone-line"></i>
                            <span>Request Callback</span>
                        </button>

                        <Link href="/register" className="nav-item auth-user">
                            <span className="btn btn-primary sign-in">Get Started</span>
                        </Link>

                        <div className="menu nav-item">
                            <div className="menu-toggle">
                                <div className="line line1"></div>
                                <div className="line line2"></div>
                            </div>

                            <div className="menu-panel">
                                <div className="menu-header"><h1>Menu</h1></div>
                                <div className="menu-items">
                                    <Link href="/" className="nav-item menu-item mobile-item">Website</Link>
                                    <Link href="/register" className="nav-item menu-item mobile-item highlight-nav" style={{ color: '#ff6a32' }}>
                                        Register 🚀
                                    </Link>
                                    <button onClick={() => setRequestPopupOpen(true)} className="nav-item menu-item mobile-item">Enquiry</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Request Callback Popup */}
                {isRequestPopupOpen && (
                    <section className="popup request-callback">
                        <div className="bg" onClick={() => setRequestPopupOpen(false)}></div>
                        <div className="center">
                            <div className="text">
                                <h3>Request a callback</h3>
                                <small>Fill the form below to request a callback from our team.</small>
                                <form onSubmit={handleRequestSubmit}>
                                    <div className="form-group">
                                        <label>Name</label>
                                        <input type="text" name="name" placeholder="Name" value={requestForm.name} onChange={handleRequestChange} required />
                                    </div>
                                    <div className="form-group">
                                        <label>Phone</label>
                                        <input type="tel" name="contact" placeholder="Phone" value={requestForm.contact} onChange={handleRequestChange} required />
                                    </div>
                                    <div className="form-group">
                                        <label>Select Date and Time</label>
                                        <input type="datetime-local" name="datetime" value={requestForm.datetime} onChange={handleRequestChange} required />
                                    </div>
                                    <div className="form-group">
                                        <label>Enquiry For</label>
                                        <select name="enquiryFor" value={requestForm.enquiryFor} onChange={handleRequestChange}>
                                            <option value="online">Online Courses</option>
                                            <option value="offline">Offline Batches (Khatauli)</option>
                                        </select>
                                    </div>
                                    <input type="text" name="courseName" placeholder="Course Name" value={requestForm.courseName} onChange={handleRequestChange} />
                                    <div className="form-group submit">
                                        <button type="submit" className="btn btn-primary request-submit-btn">Submit</button>
                                    </div>
                                </form>
                            </div>
                            <div onClick={() => setRequestPopupOpen(false)} className="closePopup">
                                <i className="ri-close-circle-line"></i>
                            </div>
                        </div>
                    </section>
                )}

                {/* Discord Join Popup */}
                {isDiscordPopupOpen && (
                    <section className="popup discordJoinPopup" onClick={() => setDiscordPopupOpen(false)}>
                        <div className="center">
                            <div className="images">
                                <Image src="/Sheryians_Logo_wFKd9VClG.png" alt="Logo 1" width={50} height={50} />
                                <i className="ri-add-line"></i>
                                <Image src="/images/discord/discord.png" alt="Discord" width={50} height={50} />
                            </div>
                            <div className="text">
                                <h3>Authorize Discord to access course support</h3>
                                <small>To access support on Discord, authorize access.</small>
                                <div className="buttons">
                                    <button className="cancel" onClick={() => setDiscordPopupOpen(false)}>Cancel</button>
                                    <button className="authorize" onClick={() => window.open('/classroom/joinChannel/channel/role')}>Authorize</button>
                                </div>
                            </div>
                            <div onClick={() => setDiscordPopupOpen(false)} className="closePopup">
                                <i className="ri-close-circle-line"></i>
                            </div>
                        </div>
                    </section>
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
        </>
    );
}
