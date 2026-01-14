import { useEffect, useRef } from "react";

type Particle = {
  x: number;
  y: number;
  tx: number;
  ty: number;
  vx: number;
  vy: number;
  alpha: number;
};

const messages = [
  "You pulled every piece of me together",
  "Somehow, you made chaos feel like home",
  "Every strand of me leads to you",
  "You’re the shape my heart chose",
  "I didn’t fall — I assembled",
  "You turned fragments into meaning",
  "This heart learned your name"
];

const fullName = "Reneilwe (wewe) Anny Mothibi";

function getDayIndex(total: number) {
  const now = new Date();
  const start = Date.UTC(now.getUTCFullYear(), 0, 1);
  const today = Date.UTC(
    now.getUTCFullYear(),
    now.getUTCMonth(),
    now.getUTCDate()
  );
  return Math.floor((today - start) / 86400000) % total;
}

export default function ParticleHeart() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const dayIndex = getDayIndex(messages.length);

  useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d")!;

    let particles: Particle[] = [];
    let formed = false;
    let beatPhase = 0;

    function setup() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;

      formed = false;
      beatPhase = 0;
      particles = [];

      const size = Math.min(canvas.width, canvas.height);
      const scale = size * 0.035;

      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;

      const heartPoints: { x: number; y: number }[] = [];

      for (let t = 0; t < Math.PI * 2; t += 0.014) {
        const x = 16 * Math.pow(Math.sin(t), 3);
        const y =
          13 * Math.cos(t) -
          5 * Math.cos(2 * t) -
          2 * Math.cos(3 * t) -
          Math.cos(4 * t);

        heartPoints.push({
          x: centerX + x * scale,
          y: centerY - y * scale
        });
      }

      heartPoints.forEach(p => {
        particles.push({
          x: Math.random() * canvas.width,
          y: canvas.height + Math.random() * size,
          tx: p.x,
          ty: p.y,
          vx: 0,
          vy: 0,
          alpha: 0
        });
      });
    }

    function drawBackground() {
      const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
      gradient.addColorStop(0, "#000000");
      gradient.addColorStop(0.6, "#1a0005");
      gradient.addColorStop(1, "#3b000a");
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }

    function animate() {
      drawBackground();

      let settled = 0;
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;

      particles.forEach(p => {
        let tx = p.tx;
        let ty = p.ty;

        if (formed) {
          beatPhase += 0.025;
          const beat = 1 + Math.sin(beatPhase) * 0.045;
          tx = centerX + (p.tx - centerX) * beat;
          ty = centerY + (p.ty - centerY) * beat;
        }

        const dx = tx - p.x;
        const dy = ty - p.y;

        p.vx += dx * 0.00045;
        p.vy += dy * 0.00045;

        p.vx *= 0.9;
        p.vy *= 0.9;

        p.x += p.vx;
        p.y += p.vy;

        p.alpha = Math.min(p.alpha + 0.02, 1);

        if (Math.abs(dx) < 0.6 && Math.abs(dy) < 0.6) settled++;

        ctx.beginPath();
        ctx.arc(p.x, p.y, Math.max(1.2, canvas.width * 0.0012), 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 30, 60, ${p.alpha})`; // RED heart
        ctx.fill();
      });

      if (!formed && settled > particles.length * 0.96) {
        formed = true;
      }

      requestAnimationFrame(animate);
    }

    setup();
    animate();

    window.addEventListener("resize", setup);
    return () => window.removeEventListener("resize", setup);
  }, []);

  return (
    <>
      <canvas ref={canvasRef} />
      <div style={messageStyle}>
        <h1>{messages[dayIndex]}</h1>
        <p>And made a heart out of it ❤️</p>
        <p style={{ fontSize: "1rem", opacity: 0.8 }}>{fullName}</p>
      </div>
    </>
  );
}

const messageStyle: React.CSSProperties = {
  position: "absolute",
  bottom: "8%",
  width: "100%",
  textAlign: "center",
  color: "white",
  padding: "0 16px",
  pointerEvents: "none"
};
