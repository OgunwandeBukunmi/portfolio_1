import { useEffect, useRef, useState, useCallback } from "react";

const CIRCLE_RADIUS = 40;
const SMEAR_DECAY = 1.4;

export default function TextSmearHover() {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);
  const textCanvasRef = useRef(null);
  const mouse = useRef({ x: -9999, y: -9999 });
  const rafRef = useRef(null);
  const smearTrailsRef = useRef([]);
  const lastMouseRef = useRef({ x: -9999, y: -9999 });
  const [dims, setDims] = useState({ w: 0, h: 0 });

  const TEXT = "WAYNE";

  const buildTextCanvas = useCallback((w, h) => {
    const tc = textCanvasRef.current;
    if (!tc) return;
    tc.width = w;
    tc.height = h;
    const ctx = tc.getContext("2d");
    ctx.clearRect(0, 0, w, h);

    ctx.fillStyle = "#000000";
    ctx.fillRect(0, 0, w, h);

    const isMobile = w < 768;
    const fontSize = isMobile ? Math.min(w * 0.4, h * 0.5) : Math.min(w * 0.72, h * 0.82);
    ctx.font = `900 ${fontSize}px 'VT323', monospace`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    ctx.fillStyle = "#f5f5f5";
    ctx.fillText(TEXT, w / 2, h / 2);
  }, [TEXT]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const ro = new ResizeObserver((entries) => {
      for (let entry of entries) {
        const { width, height } = entry.contentRect;
        if (width > 0 && height > 0) {
          setDims({ w: width, h: height });
          buildTextCanvas(width, height);
        }
      }
    });

    ro.observe(container);
    return () => ro.disconnect();
  }, [buildTextCanvas]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !dims.w || !dims.h) return;
    canvas.width = dims.w;
    canvas.height = dims.h;
  }, [dims]);

  useEffect(() => {
    const updatePosition = (clientX, clientY) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      mouse.current = {
        x: clientX - rect.left,
        y: clientY - rect.top
      };
    };

    const onMouseMove = (e) => updatePosition(e.clientX, e.clientY);

    const onTouchMove = (e) => {
      if (e.touches.length > 0) {
        updatePosition(e.touches[0].clientX, e.touches[0].clientY);
      }
    };

    const onTouchStart = (e) => {
      if (e.touches.length > 0) {
        if (!containerRef.current) return;
        const rect = containerRef.current.getBoundingClientRect();
        const x = e.touches[0].clientX - rect.left;
        const y = e.touches[0].clientY - rect.top;
        mouse.current = { x, y };
        lastMouseRef.current = { x, y };
      }
    };

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("touchmove", onTouchMove, { passive: true });
    window.addEventListener("touchstart", onTouchStart, { passive: true });

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("touchstart", onTouchStart);
    };
  }, []);

  useEffect(() => {
    if (!dims.w || !dims.h) return;

    const canvas = canvasRef.current;
    const tc = textCanvasRef.current;
    if (!canvas || !tc) return;
    const ctx = canvas.getContext("2d");

    const drawFrame = () => {
      const { w, h } = dims;
      const mx = mouse.current.x;
      const my = mouse.current.y;
      const lx = lastMouseRef.current.x;
      const ly = lastMouseRef.current.y;

      const dx = mx - lx;
      const dy = my - ly;
      const speed = Math.sqrt(dx * dx + dy * dy);

      if (speed > 1) {
        smearTrailsRef.current.push({
          x: lx,
          y: ly,
          toX: mx,
          toY: my,
          radius: CIRCLE_RADIUS + Math.min(speed * 0.5, 40),
          alpha: Math.min(0.85 + speed * 0.005, 0.98),
          life: 1.0,
          speed,
        });
        lastMouseRef.current = { x: mx, y: my };
      }

      ctx.clearRect(0, 0, w, h);
      ctx.drawImage(tc, 0, 0);

      smearTrailsRef.current = smearTrailsRef.current.filter((s) => s.life > 0.01);

      for (const s of smearTrailsRef.current) {
        const eased = s.life * s.life;

        ctx.save();
        const grd = ctx.createRadialGradient(s.x, s.y, 0, s.x, s.y, s.radius);
        grd.addColorStop(0, `rgba(0, 0, 0, ${eased * s.alpha})`);
        grd.addColorStop(0.4, `rgba(0, 0, 0, ${eased * s.alpha * 0.6})`);
        grd.addColorStop(1, `rgba(0, 0, 0, 0)`);

        ctx.globalCompositeOperation = "source-over";
        ctx.fillStyle = grd;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.radius, 0, Math.PI * 2);
        ctx.fill()
        ctx.restore();

        ctx.save();
        ctx.globalCompositeOperation = "source-over";
        const blurAmt = Math.round(eased * 18 * (s.speed / 20));
        if (blurAmt > 0) {
          ctx.filter = `blur(${blurAmt}px)`;
        }

        const clipGrd = ctx.createRadialGradient(s.x, s.y, 0, s.x, s.y, s.radius * 0.85);
        clipGrd.addColorStop(0, `rgba(0,0,0,${eased})`);
        clipGrd.addColorStop(0.6, `rgba(0,0,0,${eased * 0.5})`);
        clipGrd.addColorStop(1, "rgba(0,0,0,0)");

        ctx.beginPath();
        ctx.arc(s.x, s.y, s.radius, 0, Math.PI * 2);
        ctx.clip();

        ctx.globalAlpha = eased * 0.9;
        ctx.drawImage(tc, 0, 0);
        ctx.restore();

        s.life -= 0.022 * SMEAR_DECAY;
      }

      ctx.save();
      const circleGrd = ctx.createRadialGradient(mx, my, 0, mx, my, CIRCLE_RADIUS);
      circleGrd.addColorStop(0, "rgba(0, 0, 0, 0.4)");
      circleGrd.addColorStop(0.5, "rgba(0, 0, 0, 0.2)");
      circleGrd.addColorStop(1, "rgba(0, 0, 0, 0)");
      ctx.fillStyle = circleGrd;
      ctx.beginPath();
      ctx.arc(mx, my, CIRCLE_RADIUS, 0, Math.PI * 2);
      ctx.fill()

      ctx.filter = `blur(14px)`;
      ctx.globalAlpha = 0.55;
      ctx.beginPath();
      ctx.arc(mx, my, CIRCLE_RADIUS, 0, Math.PI * 2);
      ctx.clip();
      ctx.drawImage(tc, 0, 0);
      ctx.restore();

      rafRef.current = requestAnimationFrame(drawFrame);
    };

    rafRef.current = requestAnimationFrame(drawFrame);
    return () => cancelAnimationFrame(rafRef.current);
  }, [dims]);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=VT323&display=swap');

        .scene {
          width: 100%;
          height: 100%;
          background: #000000;
          position: relative;
          overflow: hidden;
          cursor: none;
        }

        canvas {
          position: absolute;
          top: 0; left: 0;
          width: 100%;
          height: 100%;
        }

        #text-canvas {
          display: none;
        }

        .scanlines {
          position: absolute;
          inset: 0;
          background: repeating-linear-gradient(
            0deg,
            transparent,
            transparent 2px,
            rgba(0,0,0,0.04) 2px,
            rgba(0,0,0,0.04) 4px
          );
          pointer-events: none;
          z-index: 50;
        }

        .vignette {
          position: absolute;
          inset: 0;
          background: radial-gradient(ellipse at center, transparent 50%, rgba(0,0,0,0.8) 100%);
          pointer-events: none;
          z-index: 51;
        }

        .corner-label {
          position: absolute;
          font-family: 'VT323', monospace;
          font-size: 13px;
          color: rgba(255, 255, 255, 0.3);
          letter-spacing: 0.2em;
          z-index: 60;
          pointer-events: none;
        }
      `}</style>

      <div className="scene" ref={containerRef}>
        <canvas id="text-canvas" ref={textCanvasRef} />
        <canvas ref={canvasRef} />

        <div className="scanlines" />
        <div className="vignette" />


        <span className="corner-label" style={{ bottom: "1.5rem", left: "1.5rem" }}>
          HOVER / SMEAR
        </span>
      </div>
    </>
  );
}

// function CursorFollower({ radius }) {
//     const ringRef = useRef(null);
//     const dotRef = useRef(null);

//     useEffect(() => {
//         const onMove = (e) => {
//             gsap.to(ringRef.current, {
//                 left: e.clientX,
//                 top: e.clientY,
//                 duration: 0.12,
//                 ease: "power2.out",
//             });
//             gsap.to(dotRef.current, {
//                 left: e.clientX,
//                 top: e.clientY,
//                 duration: 0.04,
//                 ease: "none",
//             });
//         };
//         window.addEventListener("mousemove", onMove);
//         return () => window.removeEventListener("mousemove", onMove);
//     }, []);

//     return (
//         <>
//             <div ref={ringRef} className="cursor-ring" />
//             <div ref={dotRef} className="cursor-dot" />
//         </>
//     );
// }