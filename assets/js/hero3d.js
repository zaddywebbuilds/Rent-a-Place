/* ==========================================================================
   Hero 3D - an abstract block city that slowly turns behind the headline.
   Pure Three.js, no build step. Degrades to a flat ink hero if the module
   cannot load or the visitor prefers reduced motion.
   ========================================================================== */

import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.160.1/build/three.module.js";

const canvas = document.getElementById("scene");
if (canvas) init(canvas);

function init(canvas) {
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true,
    alpha: true,
    powerPreference: "high-performance",
  });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;

  const scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(0x0e1013, 0.0295);

  const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 200);
  camera.position.set(18, 13.5, 20);
  camera.lookAt(0, 2.2, 0);

  /* ---------------- lighting ---------------- */

  scene.add(new THREE.HemisphereLight(0xdfe7f2, 0x14110b, 0.55));

  const key = new THREE.DirectionalLight(0xffe9c4, 2.15);
  key.position.set(16, 22, 11);
  key.castShadow = true;
  key.shadow.mapSize.set(1024, 1024);
  key.shadow.camera.near = 1;
  key.shadow.camera.far = 70;
  key.shadow.camera.left = -26;
  key.shadow.camera.right = 26;
  key.shadow.camera.top = 26;
  key.shadow.camera.bottom = -26;
  key.shadow.bias = -0.0006;
  scene.add(key);

  const rim = new THREE.DirectionalLight(0x9fc0ff, 0.5);
  rim.position.set(-15, 9, -13);
  scene.add(rim);

  const warm = new THREE.PointLight(0xc7a46b, 24, 34, 2);
  warm.position.set(-4, 5.5, 6);
  scene.add(warm);

  /* ---------------- materials ---------------- */

  const matStone = new THREE.MeshStandardMaterial({
    color: 0x2a2f36, roughness: 0.78, metalness: 0.12,
  });
  const matIvory = new THREE.MeshStandardMaterial({
    color: 0xd9d3c7, roughness: 0.62, metalness: 0.06,
  });
  const matBronze = new THREE.MeshStandardMaterial({
    color: 0xc7a46b, roughness: 0.3, metalness: 0.85,
  });
  const matGlass = new THREE.MeshStandardMaterial({
    color: 0x6f8597, roughness: 0.1, metalness: 0.5,
    transparent: true, opacity: 0.72,
  });

  const palette = [matStone, matStone, matIvory, matGlass, matBronze];

  /* ---------------- ground ---------------- */

  const ground = new THREE.Mesh(
    new THREE.CircleGeometry(46, 64),
    new THREE.MeshStandardMaterial({ color: 0x15181d, roughness: 0.95, metalness: 0 })
  );
  ground.rotation.x = -Math.PI / 2;
  ground.receiveShadow = true;
  scene.add(ground);

  /* ---------------- the block city ---------------- */

  const city = new THREE.Group();
  scene.add(city);

  const box = new THREE.BoxGeometry(1, 1, 1);
  const SPAN = 5;        // blocks per side of the grid
  const GAP = 2.45;      // spacing between block centres

  // Deterministic pseudo-random so the skyline is identical on every load.
  let seed = 20260418;
  const rand = () => {
    seed = (seed * 1664525 + 1013904223) % 4294967296;
    return seed / 4294967296;
  };

  for (let x = -SPAN; x <= SPAN; x++) {
    for (let z = -SPAN; z <= SPAN; z++) {
      const dist = Math.hypot(x, z);
      if (dist > SPAN + 0.4) continue;
      if (rand() > 0.82) continue; // leave streets and courtyards

      // Taller toward the middle, with a little noise on top.
      const h = Math.max(1.1, (SPAN + 1.6 - dist) * (0.85 + rand() * 1.35));
      const w = 1.15 + rand() * 0.5;
      const d = 1.15 + rand() * 0.5;

      const mat = palette[Math.floor(rand() * palette.length)];
      const block = new THREE.Mesh(box, mat);
      block.scale.set(w, h, d);
      block.position.set(x * GAP + (rand() - 0.5) * 0.4, h / 2, z * GAP + (rand() - 0.5) * 0.4);
      block.castShadow = true;
      block.receiveShadow = true;
      city.add(block);

      // Occasional bronze cap, like a lit penthouse.
      if (h > 5.2 && rand() > 0.55) {
        const cap = new THREE.Mesh(box, matBronze);
        cap.scale.set(w * 0.52, 0.32, d * 0.52);
        cap.position.set(block.position.x, h + 0.16, block.position.z);
        cap.castShadow = true;
        city.add(cap);
      }
    }
  }

  // A single floating keystone block for a touch of unreality.
  const keystone = new THREE.Mesh(box, matBronze);
  keystone.scale.set(1.5, 1.5, 1.5);
  keystone.position.set(-6.5, 11.5, 5);
  keystone.castShadow = true;
  scene.add(keystone);

  /* ---------------- interaction ---------------- */

  const pointer = { x: 0, y: 0, tx: 0, ty: 0 };

  if (!reduced) {
    window.addEventListener("pointermove", (e) => {
      pointer.tx = (e.clientX / window.innerWidth - 0.5) * 2;
      pointer.ty = (e.clientY / window.innerHeight - 0.5) * 2;
    }, { passive: true });
  }

  /* ---------------- resize ---------------- */

  // Framing: wide screens look along the skyline, narrow screens pull back and
  // up so the blocks sit low under the headline instead of behind it.
  const BASE = { x: 18, y: 13.5, z: 20 };
  const view = { x: BASE.x, y: BASE.y };

  function resize() {
    const w = canvas.clientWidth || window.innerWidth;
    const h = canvas.clientHeight || window.innerHeight;
    renderer.setSize(w, h, false);

    const aspect = w / h;
    camera.aspect = aspect;

    if (aspect < 0.95) {
      camera.fov = 56;
      camera.position.z = 30;
      view.x = 24;
      view.y = 22;
    } else {
      camera.fov = 42;
      camera.position.z = BASE.z;
      view.x = BASE.x;
      view.y = BASE.y;
    }

    camera.position.x = view.x;
    camera.position.y = view.y;
    camera.updateProjectionMatrix();
  }
  resize();
  window.addEventListener("resize", resize, { passive: true });

  /* ---------------- loop ---------------- */

  const clock = new THREE.Clock();
  let rafId = null;

  function start() {
    if (rafId === null && !reduced) tick();
  }
  function stop() {
    if (rafId !== null) { cancelAnimationFrame(rafId); rafId = null; }
  }

  // Pause the loop once the hero scrolls away.
  const hero = document.querySelector(".hero");
  if (hero && "IntersectionObserver" in window) {
    new IntersectionObserver(
      ([entry]) => { entry.isIntersecting ? start() : stop(); },
      { threshold: 0 }
    ).observe(hero);
  }

  function tick() {
    const t = clock.getElapsedTime();

    city.rotation.y = t * 0.035;

    keystone.rotation.y = t * 0.3;
    keystone.rotation.x = Math.sin(t * 0.4) * 0.12;
    keystone.position.y = 11.5 + Math.sin(t * 0.7) * 0.45;

    pointer.x += (pointer.tx - pointer.x) * 0.045;
    pointer.y += (pointer.ty - pointer.y) * 0.045;

    camera.position.x = view.x + pointer.x * 2.6;
    camera.position.y = view.y - pointer.y * 1.6;
    camera.lookAt(0, 2.2, 0);

    renderer.render(scene, camera);
    rafId = requestAnimationFrame(tick);
  }

  if (reduced) {
    renderer.render(scene, camera); // one still frame
  } else {
    start();
  }
}
