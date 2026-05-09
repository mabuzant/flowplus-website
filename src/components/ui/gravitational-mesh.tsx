"use client";

import React, { useRef, useEffect } from "react";
import * as THREE from "three";

/**
 * Background-only gravitational mesh canvas.
 * Renders an interactive Three.js wireframe plane that warps toward the cursor.
 * Pure visual — no text. Compose with your own foreground content.
 */
export function GravitationalMesh({ className = "" }: { className?: string }) {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.z = 10;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    mount.appendChild(renderer.domElement);

    const mouse = new THREE.Vector2(0, 0);
    const clock = new THREE.Clock();

    // flow+ palette: warm cream lines on near-black background.
    const lineColor = new THREE.Color(0xf5f1e8);

    const geometry = new THREE.PlaneGeometry(40, 40, 50, 50);
    const material = new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uMouse: { value: new THREE.Vector2(0, 0) },
        uColor: { value: lineColor },
      },
      vertexShader: `
        uniform float uTime;
        uniform vec2 uMouse;
        varying float vIntensity;

        void main() {
          vec3 pos = position;
          float mouseDist = distance(pos.xy, uMouse * 20.0);
          float warp = 1.0 - smoothstep(0.0, 5.0, mouseDist);
          pos.z += warp * 3.0;
          vIntensity = warp;
          pos.z += sin(pos.x * 0.5 + uTime * 0.5) * 0.1;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
        }
      `,
      fragmentShader: `
        uniform vec3 uColor;
        varying float vIntensity;
        void main() {
          // Always-visible base glow + extra intensity near the cursor.
          float alpha = 0.18 + vIntensity * 0.72;
          gl_FragColor = vec4(uColor, alpha);
        }
      `,
      wireframe: true,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    const mesh = new THREE.Mesh(geometry, material);
    mesh.rotation.x = -0.2;
    scene.add(mesh);

    const handleMouseMove = (event: MouseEvent) => {
      mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    };
    window.addEventListener("mousemove", handleMouseMove);

    let frameId = 0;
    const animate = () => {
      frameId = requestAnimationFrame(animate);
      const t = clock.getElapsedTime();
      material.uniforms.uTime.value = t;
      material.uniforms.uMouse.value.lerp(mouse, 0.05);
      renderer.render(scene, camera);
    };
    animate();

    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener("resize", handleResize);

    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handleMouseMove);
      if (renderer.domElement.parentNode === mount) {
        mount.removeChild(renderer.domElement);
      }
      geometry.dispose();
      material.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <div
      ref={mountRef}
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 z-0 ${className}`}
    />
  );
}
