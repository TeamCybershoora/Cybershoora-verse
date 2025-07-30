import React, { useRef, useEffect } from 'react';
// import metalImg from '../public/assets/scratch1.jpeg';

const SCRATCH_CODE = 'Gaddari Karbey';

export default function Scratcher() {
    const canvasRef = useRef(null);
    const codeRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        // Draw metal image as scratch area
        const img = new window.Image();
        img.src = '/assets/scratch1.jpeg';
        img.onload = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        };
        ctx.globalCompositeOperation = 'source-over';

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
        <div className="scratcher-root">
            <h1 className="hero-heading">
                <span className="hero-block">More Value,</span>
                <span className="hero-block">Less Cost.</span>
            </h1>
            <h3 className="scratcher-heading2">
                Quality and Value Drive Us, Delivering More For Less Cost
            </h3>
            <p className="scratcher-para">
                Course validity is for 1 year from date of purchase.
            </p>
            <small className="scratcher-label">
                Scratch this to Get Discount Coupon
            </small>
            <div className="scratcher-outer">
                <div
                    ref={codeRef}
                    className="scratcher-code"
                >
                    {SCRATCH_CODE}
                </div>
                <canvas
                    ref={canvasRef}
                    width={310}
                    height={80}
                    className="scratcher-canvas"
                />
            </div>
            <style jsx>{`
        .scratcher-root {
          width: 100%;
          max-width: 100vw;
          margin: 2rem 0;
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          justify-content: flex-start;
        }
        .hero-heading {
          font-family: 'Beni', 'NeueMachina', 'Inter', Arial, sans-serif;
          font-weight: 900;
          color: #fff;
          text-align: left;
          line-height: 0.95;
          font-size: unset;
          margin-bottom: 2.5rem;
          letter-spacing: -0.02em;
        }
        .hero-block {
          display: block;
          font-size: 12rem;
          line-height: 0.95;
          margin: 0;
          padding: 0;
        }
        .scratcher-heading2 {
          font-size: 2rem;
          font-weight: 600;
          margin-bottom: 2px;
          color: #b18cff;
          text-align: left;
          width: 100%;
        }
        .scratcher-para {
          font-size: 1.5rem;
          color: #bdbdbd;
          margin-bottom: 16px;
          text-align: left;
          width: 100%;
        }
        .scratcher-outer {
          border: 2.5px dashed #888;
          border-radius: 25px;
          padding: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          width: 100%;
          max-width: 400px;
          aspect-ratio: 4/1;
          margin-left: 0;
          position: relative;
          background: transparent;
          min-height: unset;
          flex-direction: column;
        }
        .scratcher-label {
          margin-bottom: 8px;
          margin-top: 3rem;
          margin-left: 1rem;
          color:rgb(255, 255, 255);
          font-weight: 600;
          font-size: 1rem;
          letter-spacing: 1px;
          text-align: center;
          display: block;
        }
        .scratcher-code {
          border-radius: 25px;
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
          font-size: 2rem;
          position: relative;
          z-index: 1;
          letter-spacing: 2px;
          text-align: center;
          user-select: none;
        }
        .scratcher-canvas {
          border-radius: 25px;
          position: absolute;
          top: 0;
          left: 0;
          z-index: 2;
          width: 100%;
          height: 100%;
          background: transparent;
          cursor: pointer;
        }
        @media (max-width: 900px) {
          .hero-block {
            font-size: 5rem;
          }
          .scratcher-outer {
            max-width: 100vw;
          }
        }
        @media (max-width: 600px) {
          .hero-block {
            font-size: 2.2rem;
          }
          .scratcher-outer {
            width: 100%;
            max-width: 100vw;
          }
        }

        @media (max-width: 300px) {
        .scratcher-canvas {
        height: 3rem;
        }
        }
      `}</style>
        </div>
    );
} 

