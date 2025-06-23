'use client';

import { useEffect } from 'react';
import '@/styles/index.css';
import '@/styles/index.scss';
import '@/styles/navbar.css';
import '@/styles/Navbar.scss';


export default function HomePage() {
  useEffect(() => {
    // --- COUNTER LOGIC ---
    const counters = document.querySelectorAll('.counter');
    counters.forEach(counter => {
      const target = +counter.getAttribute('data-target');
      let count = 0;

      const updateCount = () => {
        const increment = target / 100;
        if (count < target) {
          count += increment;
          counter.innerText = Math.ceil(count);
          setTimeout(updateCount, 20);
        } else {
          counter.innerText = `${target}+`;
        }
      };
      updateCount();
    });

    // --- TYPEWRITER LOGIC ---
    class TxtRotate {
      constructor(el, toRotate, period) {
        this.toRotate = toRotate;
        this.el = el;
        this.loopNum = 0;
        this.period = parseInt(period, 10) || 2000;
        this.txt = '';
        this.isDeleting = false;
        this.tick();
      }

      tick() {
        const i = this.loopNum % this.toRotate.length;
        const fullTxt = this.toRotate[i];

        if (this.isDeleting) {
          this.txt = fullTxt.substring(0, this.txt.length - 1);
        } else {
          this.txt = fullTxt.substring(0, this.txt.length + 1);
        }

        const keywords = [
          "Teaching?", "Brains", "Gyaan", "Skillz",
          "Legends", "NPCs", "Power", "Bakwaas",
          "Sasta Tutorials", "Shoora.Tech", "Game", "Hacks"
        ];

        let displayTxt = this.txt;
        keywords.forEach(word => {
          const regex = new RegExp(`(${word})`, 'gi');
          displayTxt = displayTxt.replace(regex, `<span style="color:#ff6a32;">$1</span>`);
        });

        this.el.innerHTML = `<span class="wrap">${displayTxt}</span>`;

        let delta = this.isDeleting ? 60 : 120;

        if (!this.isDeleting && this.txt === fullTxt) {
          delta = this.period;
          this.isDeleting = true;
        } else if (this.isDeleting && this.txt === '') {
          this.isDeleting = false;
          this.loopNum++;
          delta = 500;
        }

        setTimeout(() => this.tick(), delta);
      }
    }

    const elements = document.getElementsByClassName('txt-rotate');
    for (let i = 0; i < elements.length; i++) {
      const toRotate = elements[i].getAttribute('data-rotate');
      const period = elements[i].getAttribute('data-period');
      if (toRotate) {
        new TxtRotate(elements[i], JSON.parse(toRotate), period);
      }
    }
  }, []);

  return (
    <main className="text-white text-center p-10 bg-[#0f172a]">
      <section id="view1" className="view">
        <div className="top"></div>

        <div className="middle">
          <h1>
            This isn’t school. This is{' '}
            <span style={{ color: '#ff6a32', fontWeight: 400 }}>Shoora.Tech.</span>
            <br />
            <br /> Real <span className="italic">skills.</span> Real{' '}
            <span className="italic"> fast.</span> No <span className="italic"> bakwaas.</span>
          </h1>

          <div>
            <span
              style={{ fontSize: '2rem' }}
              className="txt-rotate"
              data-period="1500"
              data-rotate={`[
                "Teaching? Nah bro, We upgrade Brains.",
                "No fake Gyaan, Only real Skillz.",
                "Taught by Legends, NOT NPCs.",
                "Full Power, No Bakwaas.",
                "Stop learning from Sasta tutorials. Come to Shoora.Tech.",
                "We mastered the Game, Now we teach the Hacks."
              ]`}
            ></span>
          </div>

          <div className="homebuttons my-5 space-x-4">
            <a href="./courses" className="btn btn-primary px-4 py-2 bg-orange-500 rounded shadow-md">
              What We Teach ❤️
            </a>
            <a href="./register" className="btn btn-primary px-4 py-2 bg-orange-500 rounded shadow-md">
              Register Now 🚀
            </a>
          </div>
        </div>

        <div className="bottom mt-10">
          <div className="mileStones flex justify-center space-x-10">
            <div className="mileStone">
              <div className="text">
                <h2 className="counter text-3xl font-bold" data-target="25000">1</h2>
                <p>Students taught</p>
              </div>
            </div>
            <div className="mileStone">
              <div className="text">
                <h2 className="counter text-3xl font-bold" data-target="10">1</h2>
                <p>Instructors</p>
              </div>
            </div>
            <div className="mileStone">
              <div className="text">
                <h2 className="counter text-3xl font-bold" data-target="105">1</h2>
                <p>Live Projects.</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
