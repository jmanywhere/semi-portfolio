"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

type Pointer = {
  x: number;
  y: number;
};

const columns = 18;
const rows = 10;
const palette = ["#36d399", "#0f8b8d", "#f5b841", "#ff6b35", "#6c63ff"];

export function HeroCanvas() {
  const mountRef = useRef<HTMLDivElement>(null);
  const pointerRef = useRef<Pointer>({ x: 0, y: 0 });

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 100);
    camera.position.set(0, -2.2, 19);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: "high-performance",
    });
    renderer.setClearColor(0x000000, 0);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    mount.appendChild(renderer.domElement);

    const ambient = new THREE.AmbientLight(0xffffff, 1.6);
    const key = new THREE.DirectionalLight(0xffffff, 2.2);
    key.position.set(-3, -7, 10);
    const rim = new THREE.DirectionalLight(0xffc857, 1.6);
    rim.position.set(8, 4, 6);
    scene.add(ambient, key, rim);

    const geometry = new THREE.BoxGeometry(0.56, 0.56, 0.38);
    const material = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      metalness: 0.18,
      roughness: 0.42,
    });
    const mesh = new THREE.InstancedMesh(geometry, material, columns * rows);
    mesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
    scene.add(mesh);

    const object = new THREE.Object3D();
    const color = new THREE.Color();
    const items = Array.from({ length: columns * rows }, (_, index) => {
      const x = index % columns;
      const y = Math.floor(index / columns);
      const centeredX = x - (columns - 1) / 2;
      const centeredY = y - (rows - 1) / 2;
      const paletteIndex = (x + y * 2) % palette.length;
      mesh.setColorAt(index, color.set(palette[paletteIndex]));

      return {
        x: centeredX * 0.78,
        y: centeredY * 0.72,
        phase: x * 0.42 + y * 0.74,
        scale: 0.82 + ((x + y) % 4) * 0.055,
      };
    });
    if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;

    const resize = () => {
      const rect = mount.getBoundingClientRect();
      const width = Math.max(rect.width, 1);
      const height = Math.max(rect.height, 1);
      renderer.setSize(width, height, false);
      camera.aspect = width / height;
      camera.position.z = width < 720 ? 23 : 19;
      camera.updateProjectionMatrix();
    };

    const onPointerMove = (event: PointerEvent) => {
      const rect = mount.getBoundingClientRect();
      pointerRef.current = {
        x: ((event.clientX - rect.left) / rect.width - 0.5) * 2,
        y: ((event.clientY - rect.top) / rect.height - 0.5) * 2,
      };
    };

    const ro = new ResizeObserver(resize);
    ro.observe(mount);
    resize();
    window.addEventListener("pointermove", onPointerMove, { passive: true });

    let frame = 0;
    const render = (time: number) => {
      const t = prefersReducedMotion ? 0.8 : time * 0.001;
      const pointer = pointerRef.current;
      const driftX = pointer.x * 0.45;
      const driftY = pointer.y * 0.25;

      items.forEach((item, index) => {
        const wave = Math.sin(t * 1.65 + item.phase);
        const crossWave = Math.cos(t * 1.15 + item.x * 0.35);

        object.position.set(
          item.x + driftX * (item.y / rows),
          item.y + driftY * 0.6,
          wave * 1.08 + crossWave * 0.28
        );
        object.rotation.set(
          0.72 + wave * 0.22 + pointer.y * 0.08,
          -0.68 + crossWave * 0.18 + pointer.x * 0.1,
          0.12 + wave * 0.06
        );
        object.scale.setScalar(item.scale + wave * 0.045);
        object.updateMatrix();
        mesh.setMatrixAt(index, object.matrix);
      });

      mesh.instanceMatrix.needsUpdate = true;
      mesh.rotation.z = -0.1 + pointer.x * 0.035;
      mesh.rotation.x = -0.32 + pointer.y * 0.025;
      renderer.render(scene, camera);

      if (!prefersReducedMotion) {
        frame = requestAnimationFrame(render);
      }
    };

    frame = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("pointermove", onPointerMove);
      ro.disconnect();
      geometry.dispose();
      material.dispose();
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, []);

  return (
    <div
      ref={mountRef}
      className="absolute inset-0 h-full w-full pointer-events-none opacity-95"
      aria-hidden
    />
  );
}
