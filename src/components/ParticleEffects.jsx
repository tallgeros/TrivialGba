// ParticleEffects.jsx - Efectos con explosiones directas en posiciones aleatorias
import React, { useEffect, useRef, useState } from 'react';
import './ParticleEffects.css';

const ParticleEffects = ({ type, isVisible, onComplete }) => {
  const canvasRef = useRef(null);
  const animationRef = useRef(null);
  const [showBomb, setShowBomb] = useState(false);
  const [bombPhase, setBombPhase] = useState('growing');

  useEffect(() => {
    if (!isVisible) return;

    if (type === 'bomb' || type === 'fail' || type === 'explosion') {
      handleBombSequence();
    } else {
      handleDirectFireworksSequence();
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isVisible, type]);

  const handleBombSequence = () => {
    setShowBomb(true);
    setBombPhase('growing');

    setTimeout(() => {
      setBombPhase('exploding');
      
      setTimeout(() => {
        setBombPhase('particles');
        startBombParticles();
        
        setTimeout(() => {
          if (onComplete) onComplete();
        }, 2500);
      }, 500);
    }, 1000);
  };

  const handleDirectFireworksSequence = () => {
    startDirectExplosionFireworks();
    setTimeout(() => {
      if (onComplete) onComplete();
    }, 6000); // Reducido de 8000 a 6000 por cohetes más rápidos
  };

  const startDirectExplosionFireworks = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const particles = [];

    // Configurar canvas
    const resizeCanvas = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resizeCanvas();

    // Paletas de colores vibrantes
    const colorPalettes = [
      ['#ff0040', '#ff4080', '#ff80c0', '#ffffff'], // Rosa vibrante
      ['#00ff40', '#40ff80', '#80ffc0', '#ffffff'], // Verde eléctrico
      ['#4000ff', '#8040ff', '#c080ff', '#ffffff'], // Púrpura
      ['#ffff00', '#ffff80', '#ffffb0', '#ffffff'], // Amarillo dorado
      ['#ff8000', '#ffb040', '#ffe080', '#ffffff'], // Naranja fuego
      ['#00ffff', '#40ffff', '#80ffff', '#ffffff'], // Cyan brillante
      ['#ff0080', '#ff40a0', '#ff80c0', '#ffffff'], // Magenta
      ['#8000ff', '#a040ff', '#c080ff', '#ffffff']  // Violeta
    ];

    // Tipos de explosiones
    const explosionTypes = ['chrysanthemum', 'peony', 'willow', 'ring', 'crossette', 'palm'];

    // Clase para explosiones directas
    class DirectExplosion {
      constructor(x, y, explosionType = 'chrysanthemum') {
        this.x = x;
        this.y = y;
        this.palette = colorPalettes[Math.floor(Math.random() * colorPalettes.length)];
        this.explosionType = explosionType;
        this.delay = Math.random() * 2000; // Retraso aleatorio hasta 2 segundos
        this.hasExploded = false;
        
        // Programar la explosión
        setTimeout(() => {
          this.explode();
        }, this.delay);
      }

      explode() {
        if (this.hasExploded) return;
        this.hasExploded = true;
        
        // Crear efecto de flash inicial
        this.createFlashEffect();
        
        switch(this.explosionType) {
          case 'chrysanthemum':
            this.createChrysanthemum();
            break;
          case 'peony':
            this.createPeony();
            break;
          case 'willow':
            this.createWillow();
            break;
          case 'ring':
            this.createRing();
            break;
          case 'crossette':
            this.createCrossette();
            break;
          case 'palm':
            this.createPalm();
            break;
          default:
            this.createChrysanthemum();
        }
      }

      createFlashEffect() {
        // Crear partículas de flash inicial
        for (let i = 0; i < 20; i++) {
          const angle = Math.random() * Math.PI * 2;
          const speed = Math.random() * 3 + 1;
          particles.push(new FireworkParticle(
            this.x, this.y,
            Math.cos(angle) * speed,
            Math.sin(angle) * speed,
            '#ffffff',
            'flash',
            0.3 // Vida corta para el flash
          ));
        }
      }

      createChrysanthemum() {
        const particleCount = Math.random() * 40 + 80;
        for (let i = 0; i < particleCount; i++) {
          const angle = (i / particleCount) * Math.PI * 2;
          const speed = Math.random() * 8 + 4;
          particles.push(new FireworkParticle(
            this.x, this.y, 
            Math.cos(angle) * speed,
            Math.sin(angle) * speed,
            this.palette[Math.floor(Math.random() * this.palette.length)],
            'chrysanthemum'
          ));
        }
      }

      createPeony() {
        const particleCount = Math.random() * 60 + 100;
        for (let i = 0; i < particleCount; i++) {
          const angle = Math.random() * Math.PI * 2;
          const speed = Math.random() * 12 + 2;
          particles.push(new FireworkParticle(
            this.x, this.y,
            Math.cos(angle) * speed,
            Math.sin(angle) * speed,
            this.palette[Math.floor(Math.random() * this.palette.length)],
            'peony'
          ));
        }
      }

      createWillow() {
        const branches = 8;
        for (let b = 0; b < branches; b++) {
          const branchAngle = (b / branches) * Math.PI * 2;
          const branchSpeed = Math.random() * 3 + 2;
          
          for (let i = 0; i < 15; i++) {
            const spread = (Math.random() - 0.5) * 0.5;
            particles.push(new FireworkParticle(
              this.x, this.y,
              Math.cos(branchAngle + spread) * branchSpeed,
              Math.sin(branchAngle + spread) * branchSpeed,
              this.palette[Math.floor(Math.random() * this.palette.length)],
              'willow'
            ));
          }
        }
      }

      createRing() {
        const ringParticles = 60;
        for (let i = 0; i < ringParticles; i++) {
          const angle = (i / ringParticles) * Math.PI * 2;
          const speed = Math.random() * 2 + 6;
          particles.push(new FireworkParticle(
            this.x, this.y,
            Math.cos(angle) * speed,
            Math.sin(angle) * speed,
            this.palette[Math.floor(Math.random() * this.palette.length)],
            'ring'
          ));
        }
      }

      createCrossette() {
        // Explosión principal
        this.createChrysanthemum();
        
        // Crear mini explosiones secundarias
        setTimeout(() => {
          for (let i = 0; i < 4; i++) {
            const angle = (i / 4) * Math.PI * 2;
            const distance = 50;
            const newX = this.x + Math.cos(angle) * distance;
            const newY = this.y + Math.sin(angle) * distance;
            
            for (let j = 0; j < 30; j++) {
              const subAngle = Math.random() * Math.PI * 2;
              const subSpeed = Math.random() * 6 + 2;
              particles.push(new FireworkParticle(
                newX, newY,
                Math.cos(subAngle) * subSpeed,
                Math.sin(subAngle) * subSpeed,
                this.palette[Math.floor(Math.random() * this.palette.length)],
                'crossette'
              ));
            }
          }
        }, 500);
      }

      createPalm() {
        const fronds = 8;
        for (let f = 0; f < fronds; f++) {
          const frondAngle = (f / fronds) * Math.PI * 2;
          
          for (let i = 0; i < 20; i++) {
            const t = i / 20;
            const speed = (1 - t) * 8 + 2;
            const spread = t * 0.8;
            
            particles.push(new FireworkParticle(
              this.x, this.y,
              Math.cos(frondAngle + (Math.random() - 0.5) * spread) * speed,
              Math.sin(frondAngle + (Math.random() - 0.5) * spread) * speed + Math.random() * 2,
              this.palette[Math.floor(Math.random() * this.palette.length)],
              'palm'
            ));
          }
        }
      }
    }

    // Partícula mejorada
    class FireworkParticle {
      constructor(x, y, vx, vy, color, type = 'normal', customLife = null) {
        this.x = x;
        this.y = y;
        this.vx = vx;
        this.vy = vy;
        this.color = color;
        this.type = type;
        this.life = customLife || 1;
        this.maxLife = customLife || 1;
        this.decay = type === 'flash' ? 0.05 : Math.random() * 0.015 + 0.008;
        this.size = type === 'flash' ? Math.random() * 2 + 1 : Math.random() * 3 + 2;
        this.gravity = type === 'willow' ? 0.15 : type === 'flash' ? 0.02 : 0.1;
        this.sparkles = [];
        this.twinkle = Math.random() * Math.PI * 2;
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;
        this.vy += this.gravity;
        this.life -= this.decay;
        this.twinkle += 0.2;
        
        // Fricción del aire
        this.vx *= 0.995;
        this.vy *= 0.995;
        
        // Crear chispas ocasionales (excepto para flash)
        if (this.type !== 'flash' && Math.random() < 0.1 && this.life > 0.3) {
          this.sparkles.push({
            x: this.x + (Math.random() - 0.5) * 4,
            y: this.y + (Math.random() - 0.5) * 4,
            life: 0.5,
            color: this.color
          });
        }
        
        // Actualizar chispas
        for (let i = this.sparkles.length - 1; i >= 0; i--) {
          this.sparkles[i].life -= 0.1;
          if (this.sparkles[i].life <= 0) {
            this.sparkles.splice(i, 1);
          }
        }
      }

      draw() {
        // Efecto de centelleo
        const twinkleAlpha = this.type === 'flash' ? 1 : (Math.sin(this.twinkle) + 1) * 0.3 + 0.4;
        
        ctx.globalAlpha = this.life * twinkleAlpha;
        
        // Crear gradiente radial
        const gradient = ctx.createRadialGradient(
          this.x, this.y, 0,
          this.x, this.y, this.size * 2
        );
        gradient.addColorStop(0, this.color);
        gradient.addColorStop(0.3, this.color + '80');
        gradient.addColorStop(1, 'transparent');
        
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
        
        // Dibujar chispas
        this.sparkles.forEach(spark => {
          ctx.globalAlpha = spark.life * this.life;
          ctx.fillStyle = spark.color;
          ctx.beginPath();
          ctx.arc(spark.x, spark.y, 1, 0, Math.PI * 2);
          ctx.fill();
        });
        
        ctx.globalAlpha = 1;
      }

      isDead() {
        return this.life <= 0;
      }
    }

    // Crear explosiones directas en posiciones aleatorias
    const explosions = [];
    const explosionCount = 25; // Número de explosiones
    
    for (let i = 0; i < explosionCount; i++) {
      const x = Math.random() * canvas.width;
      const y = Math.random() * canvas.height * 0.8 + canvas.height * 0.1; // Evitar bordes superior e inferior
      const explosionType = explosionTypes[Math.floor(Math.random() * explosionTypes.length)];
      
      explosions.push(new DirectExplosion(x, y, explosionType));
    }

    // Bucle de animación optimizado
    const animate = () => {
      // Efecto de desvanecimiento suave
      ctx.fillStyle = 'rgba(0, 0, 0, 0.06)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Actualizar partículas
      for (let i = particles.length - 1; i >= 0; i--) {
        particles[i].update();
        particles[i].draw();
        if (particles[i].isDead()) {
          particles.splice(i, 1);
        }
      }

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();
  };

  const startBombParticles = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const particles = [];

    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    class ExplosionParticle {
      constructor() {
        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;
        
        this.x = centerX;
        this.y = centerY;
        this.vx = (Math.random() - 0.5) * 25;
        this.vy = (Math.random() - 0.5) * 25;
        this.size = Math.random() * 10 + 4;
        this.color = ['#ff4444', '#ff8800', '#ffaa00', '#666', '#333'][
          Math.floor(Math.random() * 5)
        ];
        this.life = 1;
        this.decay = Math.random() * 0.015 + 0.008;
        this.shape = Math.random() > 0.5 ? 'circle' : 'square';
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;
        this.vy += 0.5;
        this.life -= this.decay;
        this.vx *= 0.98;
        this.vy *= 0.98;
      }

      draw() {
        ctx.globalAlpha = this.life;
        ctx.fillStyle = this.color;
        
        if (this.shape === 'circle') {
          ctx.beginPath();
          ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
          ctx.fill();
        } else {
          ctx.fillRect(
            this.x - this.size/2, 
            this.y - this.size/2, 
            this.size, 
            this.size
          );
        }
        ctx.globalAlpha = 1;
      }

      isDead() {
        return this.life <= 0;
      }
    }

    for (let i = 0; i < 150; i++) {
      particles.push(new ExplosionParticle());
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (let i = particles.length - 1; i >= 0; i--) {
        particles[i].update();
        particles[i].draw();
        if (particles[i].isDead()) {
          particles.splice(i, 1);
        }
      }

      if (particles.length > 0) {
        animationRef.current = requestAnimationFrame(animate);
      }
    };

    animate();
  };

  if (!isVisible) return null;

  return (
    <div className="particle-effects-overlay">
      <canvas 
        ref={canvasRef}
        className="particle-canvas"
      />

      {(type === 'bomb' || type === 'fail' || type === 'explosion') && showBomb && (
        <div className={`bomb-container bomb-${bombPhase}`}>
          {bombPhase === 'growing' && (
            <div className="bomb-growing">
              💣
            </div>
          )}
          {bombPhase === 'exploding' && (
            <div className="explosion-flash">
              💥
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ParticleEffects;
