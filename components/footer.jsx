import React from 'react';

import '@/styles/common.css';
import '@/styles/common.scss';

const Footer = () => (
  <section id="footer">
    <div className="top">
      <div className="footer-section">
        <img className="logo" src="https://ik.imagekit.io/cybershoora/Shoora.tech/Logos%20of%20Web%20Panel%20or%20Web%20aap/Shoora-tech-text.svg?updatedAt=1750497732898" style={{width: '100%'}} alt="" />
        <p>Let&apos;s connect with our socials</p>
        <div className="socials">
          <a target="_blank" rel="noopener" title="Visit our Instagram page" href="https://www.instagram.com/sheryians_coding_school">
            <i className="ri-instagram-fill"></i>
          </a>
          <a target="_blank" rel="noopener" title="Visit our LinkedIn page" href="https://in.linkedin.com/company/the-sheryians-coding-school">
            <i className="ri-linkedin-box-fill"></i>
          </a>
          <a target="_blank" rel="noopener" title="Visit our Discord server" href="https://discord.gg/D23JkFqrgz">
            <i className="ri-discord-fill"></i>
          </a>
          <a target="_blank" rel="noopener" title="Visit our YouTube channel" href="https://www.youtube.com/@sheryians">
            <i className="ri-youtube-fill"></i>
          </a>
          <a target="_blank" rel="noopener" title="Visit our Twitter profile" href="https://twitter.com/sheryians_">
            <i className="ri-twitter-fill"></i>
          </a>
        </div>
      </div>
      <div className="footer-section">
        <h1>OUR COURSES</h1>
        <div className="options">
          <p>Popular Courses</p>
          <p>Web Development</p>
          <p>Data Science</p>
          <p>Interview Preparation</p>
          <p>Programming Languages</p>
          <p>Events</p>
          <p>FAQs</p>
        </div>
      </div>
      <div className="footer-section">
        <h1>COMPANY</h1>
        <div className="options">
          <a target="_blank" href="/aboutUs">About Us</a>
          <a href="/cdn-cgi/l/email-protection#0c64696060634c7f64697e75656d627f226f6361">Support</a>
          <a target="_blank" href="/terms-and-conditions/Terms_and_Conditions.pdf">Privacy Policy</a>
          <a target="_blank" href="/terms-and-conditions/Terms_and_Conditions.pdf">Terms and Condition</a>
          <a target="_blank" href="/Pricing&Refund-Policy/Pricing-and-Refund_policy.pdf">Pricing and Refund</a>
          <a target="_blank" href="/hire">Hire From Us</a>
          <a target="_blank" rel="noopener" href="https://ik.imagekit.io/sheryians/Bug_8EBE0pzVa.pdf">Bug Bounty</a>
        </div>
      </div>
      <div className="footer-section">
        <h1>COMMUNITY</h1>
        <div className="options">
          <a target="_blank" rel="noopener" href="https://www.instagram.com/inertiabysheryians">Inertia</a>
          <a target="_blank" rel="noopener" href="https://discord.gg/D23JkFqrgz">Discord</a>
        </div>
      </div>
      <div className="footer-section">
        <h1>Get In Touch</h1>
        <div className="options">
          <a href="tel:+91">+91 9520936655</a>
          <a href="mailto:teamcybershoora@gmail.com">teamcybershoora@gmail.com</a>
          <a target="_blank" rel="noopener" href="https://www.google.com/maps/place/Sheryians+Coding+School/@23.2512609,77.4627502,17z/data=!3m1!4b1!4m6!3m5!1s0x397c43977890a98d:0x928a948dc6de732e!8m2!3d23.251256!4d77.4653251!16s%2Fg%2F11gvy2g2z8">
            23-B, Khatauli, Uttar Pardesh (UP), 251201
          </a>
        </div>
      </div>
    </div>
    <div className="bottom">
      <h1 className="copyright-text">
        Copyright &copy; 2025 Shoora.tech . <br /> All Rights Reserved.
      </h1>
    </div>
  </section>
);

export default Footer;