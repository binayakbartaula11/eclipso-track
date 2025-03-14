"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass.js";

const InteractiveStarMap = () => {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (mountRef.current) {
      // --- Scene Setup ---
      const scene = new THREE.Scene();
      scene.background = new THREE.Color(0x000000);
      scene.fog = new THREE.FogExp2(0x000000, 0.0008);

      // --- Camera ---
      const camera = new THREE.PerspectiveCamera(
        75,
        mountRef.current.clientWidth / mountRef.current.clientHeight,
        0.1,
        20000
      );
      camera.position.set(0, 50, 150);

      // --- Renderer ---
      const renderer = new THREE.WebGLRenderer({ antialias: true });
      renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
      renderer.setPixelRatio(window.devicePixelRatio);
      mountRef.current.appendChild(renderer.domElement);

      // --- Postprocessing (Enhanced Bloom) ---
      const composer = new EffectComposer(renderer);
      composer.addPass(new RenderPass(scene, camera));
      const bloomPass = new UnrealBloomPass(
        new THREE.Vector2(mountRef.current.clientWidth, mountRef.current.clientHeight),
        1.5,
        0.4,
        0.85
      );
      bloomPass.threshold = 0;
      bloomPass.strength = 2.0;
      bloomPass.radius = 0.5;
      composer.addPass(bloomPass);

      // --- Enhanced Lighting ---
      const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
      scene.add(ambientLight);
      const directionalLight = new THREE.DirectionalLight(0xffffff, 1.2);
      directionalLight.position.set(100, 100, 100);
      scene.add(directionalLight);

      // Add point light at sun position for better illumination
      const sunLight = new THREE.PointLight(0xfff0dd, 2, 300);
      sunLight.position.set(0, 0, 0);
      scene.add(sunLight);

      // --- Orbit Controls ---
      const controls = new OrbitControls(camera, renderer.domElement);
      controls.enableDamping = true;
      controls.dampingFactor = 0.05;
      controls.rotateSpeed = 0.5;
      controls.zoomSpeed = 0.5;

      // --- Enhanced Star Field with Multiple Colors ---
      const starCount = 10000;
      const starGeometry = new THREE.BufferGeometry();
      const starPositions = [];
      const starColors = [];
      
      // Star color palette
      const starColorPalette = [
        0xffffff, // White
        0xffffee, // Warm White
        0xeeeeff, // Cool White
        0xffdddd, // Reddish
        0xddffff, // Bluish
        0xffffdd  // Yellowish
      ];
      
      for (let i = 0; i < starCount; i++) {
        starPositions.push(
          THREE.MathUtils.randFloatSpread(2000),
          THREE.MathUtils.randFloatSpread(2000),
          THREE.MathUtils.randFloatSpread(2000)
        );
        
        // Add varied star sizes based on distance
        const distance = Math.sqrt(
          starPositions[i * 3] ** 2 + 
          starPositions[i * 3 + 1] ** 2 + 
          starPositions[i * 3 + 2] ** 2
        );
        
        // Create RGB color components
        const colorIndex = Math.floor(Math.random() * starColorPalette.length);
        const color = new THREE.Color(starColorPalette[colorIndex]);
        
        starColors.push(color.r, color.g, color.b);
      }
      
      starGeometry.setAttribute('position', new THREE.Float32BufferAttribute(starPositions, 3));
      starGeometry.setAttribute('color', new THREE.Float32BufferAttribute(starColors, 3));
      
      const starMaterial = new THREE.PointsMaterial({ 
        size: 1.2, 
        vertexColors: true,
        transparent: true,
        opacity: 0.8
      });
      
      const stars = new THREE.Points(starGeometry, starMaterial);
      scene.add(stars);

      // --- Create Planets Without Relying on External Textures ---
      // Helper function to create a procedural texture for planets
      const createPlanetTexture = (
        baseColor: number,
        spotColor: number,
        spotDensity: number = 20,
        resolution: number = 512
      ) => {
        const canvas = document.createElement('canvas');
        canvas.width = resolution;
        canvas.height = resolution;
        const ctx = canvas.getContext('2d');
        
        if (!ctx) return null;
        
        // Base color
        ctx.fillStyle = `#${baseColor.toString(16).padStart(6, '0')}`;
        ctx.fillRect(0, 0, resolution, resolution);
        
        // Create spots/features
        ctx.fillStyle = `#${spotColor.toString(16).padStart(6, '0')}`;
        for (let i = 0; i < spotDensity; i++) {
          const x = Math.random() * resolution;
          const y = Math.random() * resolution;
          const radius = Math.random() * (resolution / 10) + 5;
          ctx.beginPath();
          ctx.arc(x, y, radius, 0, Math.PI * 2);
          ctx.fill();
        }
        
        // Create some bands for gas giants
        if (spotDensity > 40) {
          for (let i = 0; i < 5; i++) {
            const y = Math.random() * resolution;
            const height = Math.random() * (resolution / 10) + 10;
            ctx.fillRect(0, y, resolution, height);
          }
        }
        
        const texture = new THREE.CanvasTexture(canvas);
        texture.needsUpdate = true;
        return texture;
      };

      // --- Helper Function: Create Planet with Enhanced Materials ---
      const createPlanet = (
        name: string,
        radius: number,
        baseColor: number,
        spotColor: number,
        distance: number,
        spotDensity: number = 20,
        orbitColor: number = 0x888888,
        emissive: boolean = false
      ) => {
        // Create procedural texture
        const texture = createPlanetTexture(baseColor, spotColor, spotDensity);
        
        // Using MeshStandardMaterial for a more realistic, PBR look
        const geometry = new THREE.SphereGeometry(radius, 64, 64); // Higher polygon count
        const material = new THREE.MeshStandardMaterial({
          map: texture,
          color: baseColor,
          metalness: 0.1,
          roughness: 0.7,
          emissive: emissive ? new THREE.Color(baseColor).multiplyScalar(0.5) : new THREE.Color(0x000000),
          emissiveIntensity: emissive ? 1 : 0,
        });
        
        const planet = new THREE.Mesh(geometry, material);
        planet.position.x = distance;
        
        // Add atmosphere for some planets
        if (['earth', 'venus', 'saturn', 'uranus', 'neptune'].includes(name)) {
          const atmosphereGeometry = new THREE.SphereGeometry(radius * 1.05, 64, 64);
          const atmosphereColor = {
            'earth': 0x6699ff,
            'venus': 0xffffcc,
            'saturn': 0xffffaa,
            'uranus': 0x99ffff,
            'neptune': 0x6688ff
          }[name] || 0xffffff;
          
          const atmosphereMaterial = new THREE.MeshBasicMaterial({
            color: atmosphereColor,
            transparent: true,
            opacity: 0.2,
            side: THREE.BackSide
          });
          
          const atmosphere = new THREE.Mesh(atmosphereGeometry, atmosphereMaterial);
          planet.add(atmosphere);
        }
        
        scene.add(planet);

        // Enhanced orbit ring
        const orbitGeometry = new THREE.RingGeometry(distance - 0.5, distance + 0.5, 128);
        const orbitMaterial = new THREE.MeshBasicMaterial({
          color: orbitColor,
          side: THREE.DoubleSide,
          transparent: true,
          opacity: 0.3,
        });
        const orbit = new THREE.Mesh(orbitGeometry, orbitMaterial);
        orbit.rotation.x = Math.PI / 2;
        scene.add(orbit);

        return planet;
      };

      // --- Create Properly Spherical Sun with Glow Effects ---
      // First create a proper sphere for the sun
      const sunGeometry = new THREE.SphereGeometry(10, 64, 64); // High-poly sphere for smoothness
      
      // Create a custom sun material with emissive properties
      const sunMaterial = new THREE.MeshStandardMaterial({
        color: 0xffdd44,
        emissive: 0xffdd44, 
        emissiveIntensity: 1,
        roughness: 0.3,
        metalness: 0,
      });
      
      // Add noise texture to sun for more detail
      const sunTexture = createPlanetTexture(0xffdd44, 0xff8800, 60);
      if (sunTexture) {
        sunMaterial.map = sunTexture;
      }
      
      const sun = new THREE.Mesh(sunGeometry, sunMaterial);
      scene.add(sun);
      
      // Add multiple layers of glow for the sun
      // Inner glow
      const innerGlowGeometry = new THREE.SphereGeometry(10.5, 64, 64);
      const innerGlowMaterial = new THREE.MeshBasicMaterial({
        color: 0xffff88,
        transparent: true,
        opacity: 0.4,
        side: THREE.BackSide
      });
      const innerGlow = new THREE.Mesh(innerGlowGeometry, innerGlowMaterial);
      sun.add(innerGlow);
      
      // Middle glow
      const middleGlowGeometry = new THREE.SphereGeometry(12, 64, 64);
      const middleGlowMaterial = new THREE.MeshBasicMaterial({
        color: 0xffdd66,
        transparent: true,
        opacity: 0.3,
        side: THREE.BackSide
      });
      const middleGlow = new THREE.Mesh(middleGlowGeometry, middleGlowMaterial);
      sun.add(middleGlow);
      
      // Outer glow
      const outerGlowGeometry = new THREE.SphereGeometry(15, 64, 64);
      const outerGlowMaterial = new THREE.MeshBasicMaterial({
        color: 0xffcc44,
        transparent: true,
        opacity: 0.2,
        side: THREE.BackSide
      });
      const outerGlow = new THREE.Mesh(outerGlowGeometry, outerGlowMaterial);
      sun.add(outerGlow);
      
      // Create planets with distinct colors and features
      const mercury = createPlanet('mercury', 1, 0xa0a0a0, 0x505050, 20, 40);
      const venus = createPlanet('venus', 1.5, 0xdda066, 0xcc7744, 30, 30);
      const earth = createPlanet('earth', 1.5, 0x1166aa, 0x44aa44, 40, 35);
      const mars = createPlanet('mars', 1.2, 0xdd5544, 0x993322, 50, 25);
      const jupiter = createPlanet('jupiter', 3.5, 0xddaa77, 0xaa6633, 70, 80);
      const saturn = createPlanet('saturn', 3, 0xddcc99, 0xbb9955, 90, 60);
      
      // Add rings to Saturn
      const saturnRingGeometry = new THREE.RingGeometry(3.5, 6, 64);
      const saturnRingMaterial = new THREE.MeshBasicMaterial({
        color: 0xddcc99,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.7
      });
      const saturnRing = new THREE.Mesh(saturnRingGeometry, saturnRingMaterial);
      saturnRing.rotation.x = Math.PI / 3;
      saturn.add(saturnRing);
      
      const uranus = createPlanet('uranus', 2.5, 0x88ccff, 0x66aacc, 110, 30);
      const neptune = createPlanet('neptune', 2.5, 0x4477dd, 0x3355aa, 130, 40);
      const pluto = createPlanet('pluto', 1, 0xbbaaaa, 0x998877, 150, 15);

      // --- Enhanced Asteroid Belt ---
      const createAsteroidBelt = (minRadius: number, maxRadius: number, count: number, height: number = 3) => {
        const beltGeometry = new THREE.BufferGeometry();
        const beltPositions = [];
        const beltColors = [];
        
        // Color variations for asteroids
        const asteroidColors = [
          0x887766, 0x998877, 0xaa9988, 0x776655, 0x665544
        ];
        
        for (let i = 0; i < count; i++) {
          const angle = Math.random() * Math.PI * 2;
          const radius = THREE.MathUtils.randFloat(minRadius, maxRadius);
          const x = radius * Math.cos(angle);
          const z = radius * Math.sin(angle);
          const y = THREE.MathUtils.randFloatSpread(height);
          
          beltPositions.push(x, y, z);
          
          // Random color from palette
          const color = new THREE.Color(
            asteroidColors[Math.floor(Math.random() * asteroidColors.length)]
          );
          beltColors.push(color.r, color.g, color.b);
        }
        
        beltGeometry.setAttribute('position', new THREE.Float32BufferAttribute(beltPositions, 3));
        beltGeometry.setAttribute('color', new THREE.Float32BufferAttribute(beltColors, 3));
        
        const beltMaterial = new THREE.PointsMaterial({ 
          size: 0.5, 
          vertexColors: true,
          transparent: true,
          opacity: 0.8
        });
        
        const belt = new THREE.Points(beltGeometry, beltMaterial);
        scene.add(belt);
        
        return belt;
      };
      
      const asteroidBelt = createAsteroidBelt(55, 65, 2000);

      // --- Enhanced Constellations ---
      const createConstellation = (points: number[][], name: string, color: number = 0x4f46e5) => {
        const group = new THREE.Group();
        group.name = name;
        
        const starGeometry = new THREE.SphereGeometry(0.7, 16, 16);
        const starMaterial = new THREE.MeshBasicMaterial({ 
          color,
          emissive: color,
          emissiveIntensity: 0.5
        });
        
        points.forEach((p) => {
          const star = new THREE.Mesh(starGeometry, starMaterial);
          star.position.set(p[0], p[1], p[2]);
          group.add(star);
        });
        
        // Create lines connecting stars
        const lineMaterial = new THREE.LineBasicMaterial({ 
          color, 
          transparent: true, 
          opacity: 0.7,
        });
        
        const linePoints = points.map((p) => new THREE.Vector3(p[0], p[1], p[2]));
        const lineGeometry = new THREE.BufferGeometry().setFromPoints(linePoints);
        const line = new THREE.Line(lineGeometry, lineMaterial);
        group.add(line);
        
        scene.add(group);
        return group;
      };

      const bigDipper = [
        [100, 200, -300],
        [110, 210, -300],
        [120, 220, -300],
        [130, 210, -300],
        [140, 220, -300],
        [150, 230, -300],
        [160, 240, -300],
      ];
      createConstellation(bigDipper, "Big Dipper", 0x4f8fff);

      const orion = [
        [-100, 50, -400],
        [-90, 60, -400],
        [-80, 70, -400],
        [-70, 60, -400],
        [-60, 50, -400],
        [-50, 40, -400],
        [-40, 30, -400],
        [-30, 20, -400],
        [-20, 10, -400],
      ];
      createConstellation(orion, "Orion", 0xffa500);
      
      // Add a third constellation
      const cassiopeia = [
        [200, 100, -350],
        [220, 120, -350],
        [240, 90, -350],
        [260, 110, -350],
        [280, 90, -350],
      ];
      createConstellation(cassiopeia, "Cassiopeia", 0xff55aa);

      // --- Animation Loop with Enhanced Effects ---
      let angle = 0;
      const animate = () => {
        requestAnimationFrame(animate);

        // Rotate planets with different speeds
        sun.rotation.y += 0.001;
        mercury.rotation.y += 0.02;
        venus.rotation.y   += 0.015;
        earth.rotation.y   += 0.01;
        mars.rotation.y    += 0.008;
        jupiter.rotation.y += 0.004;
        saturn.rotation.y  += 0.003;
        uranus.rotation.y  += 0.002;
        neptune.rotation.y += 0.002;
        pluto.rotation.y   += 0.001;

        // Simulate orbital motion with varied speeds and slight eccentricity
        angle += 0.001;
        const setPosition = (planet, distance, speed, eccentricity = 0) => {
          const a = distance;
          const b = distance * (1 - eccentricity);
          const x = a * Math.cos(angle * speed);
          const z = b * Math.sin(angle * speed);
          planet.position.set(x, planet.position.y, z);
        };
        
        setPosition(mercury, 20, 4.0, 0.1);
        setPosition(venus, 30, 3.0, 0.05);
        setPosition(earth, 40, 2.0, 0.02);
        setPosition(mars, 50, 1.8, 0.09);
        setPosition(jupiter, 70, 1.5, 0.04);
        setPosition(saturn, 90, 1.2, 0.05);
        setPosition(uranus, 110, 1.1, 0.03);
        setPosition(neptune, 130, 1.0, 0.01);
        setPosition(pluto, 150, 0.9, 0.2); // Pluto has more eccentric orbit
        
        // Animate sun glow
        const time = Date.now() * 0.0005;
        const pulseFactor = (Math.sin(time) * 0.1 + 0.9);
        innerGlow.scale.set(pulseFactor, pulseFactor, pulseFactor);
        middleGlow.scale.set(pulseFactor * 0.95, pulseFactor * 0.95, pulseFactor * 0.95);
        outerGlow.scale.set(pulseFactor * 0.9, pulseFactor * 0.9, pulseFactor * 0.9);

        controls.update();
        composer.render();
      };

      animate();

      // --- Handle Window Resize ---
      const handleResize = () => {
        if (mountRef.current) {
          const width = mountRef.current.clientWidth;
          const height = mountRef.current.clientHeight;
          camera.aspect = width / height;
          camera.updateProjectionMatrix();
          renderer.setSize(width, height);
          composer.setSize(width, height);
        }
      };
      window.addEventListener("resize", handleResize);

      // --- Cleanup ---
      return () => {
        window.removeEventListener("resize", handleResize);
        if (mountRef.current) {
          mountRef.current.removeChild(renderer.domElement);
        }
        renderer.dispose();
      };
    }
  }, []);

  return (
    <div
      ref={mountRef}
      className="w-full h-[70vh] rounded-lg border border-indigo-900/30 overflow-hidden"
    />
  );
};

export default InteractiveStarMap;
