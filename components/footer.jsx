import React from 'react';
import '@/styles/common.css';
import '@/styles/common.scss';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  const socialLinks = [
    {
      href: "https://www.instagram.com/sheryians_coding_school",
      title: "Visit our Instagram page",
      icon: "ri-instagram-fill"
    },
    {
      href: "https://in.linkedin.com/company/the-sheryians-coding-school",
      title: "Visit our LinkedIn page", 
      icon: "ri-linkedin-box-fill"
    },
    {
      href: "https://discord.gg/D23JkFqrgz",
      title: "Visit our Discord server",
      icon: "ri-discord-fill"
    },
    {
      href: "https://www.youtube.com/@sheryians",
      title: "Visit our YouTube channel",
      icon: "ri-youtube-fill"
    },
    {
      href: "https://twitter.com/sheryians_",
      title: "Visit our Twitter profile",
      icon: "ri-twitter-fill"
    }
  ];

  const courseOptions = [
    "Popular Courses",
    "Web Development", 
    "Data Science",
    "Interview Preparation",
    "Programming Languages",
    "Events",
    "FAQs"
  ];

  const companyOptions = [
    { href: "/aboutUs", text: "About Us", external: true },
    { href: "/cdn-cgi/l/email-protection#0c64696060634c7f64697e75656d627f226f6361", text: "Support", external: false },
    { href: "/terms-and-conditions/Terms_and_Conditions.pdf", text: "Privacy Policy", external: true },
    { href: "/terms-and-conditions/Terms_and_Conditions.pdf", text: "Terms and Condition", external: true },
    { href: "/Pricing&Refund-Policy/Pricing-and-Refund_policy.pdf", text: "Pricing and Refund", external: true },
    { href: "/hire", text: "Hire From Us", external: true },
    { href: "https://ik.imagekit.io/sheryians/Bug_8EBE0pzVa.pdf", text: "Bug Bounty", external: true }
  ];

  const communityOptions = [
    { href: "https://www.instagram.com/inertiabysheryians", text: "Inertia", external: true },
    { href: "https://discord.gg/D23JkFqrgz", text: "Discord", external: true }
  ];

  const contactOptions = [
    { href: "tel:+91", text: "+91 9520936655", external: false },
    { href: "mailto:teamcybershoora@gmail.com", text: "teamcybershoora@gmail.com", external: false },
    { href: "https://www.google.com/maps/place/Sheryians+Coding+School/@23.2512609,77.4627502,17z/data=!3m1!4b1!4m6!3m5!1s0x397c43977890a98d:0x928a948dc6de732e!8m2!3d23.251256!4d77.4653251!16s%2Fg%2F11gvy2g2z8", text: "23-B, Khatauli, Uttar Pardesh (UP), 251201", external: true }
  ];

  return (
    <section id="footer">
      <div className="top">
        <div className="footer-section">
          <img 
            className="logo" 
            src="https://ik.imagekit.io/cybershoora/Shoora.tech/Logos%20of%20Web%20Panel%20or%20Web%20aap/Shoora-tech-text.svg?updatedAt=1750497732898" 
            alt="Shoora Tech Logo"
            loading="lazy"
          />
          <p>Let&apos;s connect with our socials</p>
          <div className="socials">
            {socialLinks.map((link, index) => (
              <a 
                key={index}
                target="_blank" 
                rel="noopener noreferrer" 
                title={link.title} 
                href={link.href}
                aria-label={link.title}
              >
                <i className={link.icon}></i>
              </a>
            ))}
          </div>
        </div>
        
        <div className="footer-section">
          <h1>OUR COURSES</h1>
          <div className="options">
            {courseOptions.map((option, index) => (
              <p key={index}>{option}</p>
            ))}
          </div>
        </div>
        
        <div className="footer-section">
          <h1>COMPANY</h1>
          <div className="options">
            {companyOptions.map((option, index) => (
              <a 
                key={index}
                target={option.external ? "_blank" : undefined}
                rel={option.external ? "noopener noreferrer" : undefined}
                href={option.href}
              >
                {option.text}
              </a>
            ))}
          </div>
        </div>
        
        <div className="footer-section">
          <h1>COMMUNITY</h1>
          <div className="options">
            {communityOptions.map((option, index) => (
              <a 
                key={index}
                target="_blank" 
                rel="noopener noreferrer" 
                href={option.href}
              >
                {option.text}
              </a>
            ))}
          </div>
        </div>
        
        <div className="footer-section">
          <h1>Get In Touch</h1>
          <div className="options">
            {contactOptions.map((option, index) => (
              <a 
                key={index}
                target={option.external ? "_blank" : undefined}
                rel={option.external ? "noopener noreferrer" : undefined}
                href={option.href}
              >
                {option.text}
              </a>
            ))}
          </div>
        </div>
      </div>
      
      <div className="bottom">
        <h1 className="copyright-text">
          Copyright &copy; {currentYear} Shoora.tech . <br /> All Rights Reserved.
        </h1>
      </div>
    </section>
  );
};

export default Footer;