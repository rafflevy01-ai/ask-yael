import React, { useRef, useEffect } from "react";
import * as THREE from "three";

export default function GlassBackground() {
  const containerRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // Create plane geometry
    const geometry = new THREE.PlaneGeometry(2, 2);

    // Glass distortion shader
    const vertexShader = `
      varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = vec4(position, 1.0);
      }
    `;

    const fragmentShader = `
      uniform float uTime;
      uniform vec2 uResolution;
      uniform vec2 uMouse;
      varying vec2 vUv;

      // Noise function
      float random(vec2 st) {
        return fract(sin(dot(st.xy, vec2(12.9898,78.233))) * 43758.5453123);
      }

      float noise(vec2 st) {
        vec2 i = floor(st);
        vec2 f = fract(st);
        float a = random(i);
        float b = random(i + vec2(1.0, 0.0));
        float c = random(i + vec2(0.0, 1.0));
        float d = random(i + vec2(1.0, 1.0));
        vec2 u = f * f * (3.0 - 2.0 * f);
        return mix(a, b, u.x) + (c - a)* u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
      }

      float fbm(vec2 st) {
        float value = 0.0;
        float amplitude = 0.5;
        for (int i = 0; i < 5; i++) {
          value += amplitude * noise(st);
          st *= 2.0;
          amplitude *= 0.5;
        }
        return value;
      }

      void main() {
        vec2 uv = vUv;
        vec2 mouse = uMouse / uResolution;
        
        // Base gradient
        vec3 color1 = vec3(0.92, 0.93, 0.96);
        vec3 color2 = vec3(0.96, 0.91, 0.95);
        vec3 baseColor = mix(color1, color2, uv.y + 0.3 * fbm(uv * 2.0));
        
        // Glass stripes
        float stripes = sin(uv.x * 80.0 + uv.y * 40.0 + uTime * 0.1);
        stripes = smoothstep(0.0, 0.15, stripes);
        
        // Distortion waves
        vec2 distortedUV = uv;
        distortedUV.x += 0.03 * sin(uv.y * 10.0 + uTime * 0.3);
        distortedUV.y += 0.02 * cos(uv.x * 8.0 + uTime * 0.25);
        
        // Mouse interaction
        float mouseDist = distance(uv, mouse);
        distortedUV += 0.05 * exp(-3.0 * mouseDist) * (uv - mouse);
        
        // Noise texture
        float n = fbm(distortedUV * 3.0 + uTime * 0.05);
        
        // Combine layers
        vec3 glassColor = baseColor + stripes * 0.08 + n * 0.05;
        
        // Subtle chromatic aberration
        float r = fbm(distortedUV * 3.5 + vec2(0.02, 0.01) * uTime);
        float b = fbm(distortedUV * 3.5 - vec2(0.02, 0.01) * uTime);
        glassColor.r += r * 0.03;
        glassColor.b += b * 0.03;
        
        gl_FragColor = vec4(glassColor, 1.0);
      }
    `;

    const uniforms = {
      uTime: { value: 0 },
      uResolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) },
      uMouse: { value: new THREE.Vector2(window.innerWidth / 2, window.innerHeight / 2) },
    };

    const material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms,
    });

    const plane = new THREE.Mesh(geometry, material);
    scene.add(plane);

    // Mouse tracking
    const handleMouseMove = (e) => {
      uniforms.uMouse.value.x = e.clientX;
      uniforms.uMouse.value.y = window.innerHeight - e.clientY;
    };

    const handleTouchMove = (e) => {
      if (e.touches.length > 0) {
        uniforms.uMouse.value.x = e.touches[0].clientX;
        uniforms.uMouse.value.y = window.innerHeight - e.touches[0].clientY;
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("touchmove", handleTouchMove, { passive: true });

    // Resize handler
    const handleResize = () => {
      renderer.setSize(window.innerWidth, window.innerHeight);
      uniforms.uResolution.value.set(window.innerWidth, window.innerHeight);
    };

    window.addEventListener("resize", handleResize);

    // Animation loop
    let animationId;
    const animate = () => {
      animationId = requestAnimationFrame(animate);
      uniforms.uTime.value += 0.01;
      renderer.render(scene, camera);
    };

    animate();

    // Cleanup
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationId);
      if (container && renderer.domElement) {
        container.removeChild(renderer.domElement);
      }
      geometry.dispose();
      material.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      style={{
        position: "absolute",
        inset: 0,
        pointerEvents: "none",
        zIndex: 0,
      }}
    />
  );
}