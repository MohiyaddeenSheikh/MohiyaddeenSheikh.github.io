// =========================================================================
        // 3D FREE TECH BUBBLES — BURST ON WINDOW EDGE & AUTO-RESPAWN SIMULATION
        // =========================================================================

        // Expanded Pool of Tech Stack Concepts & Vibrant Color Palettes
        const TECH_POOL = [
            { label: "AI",         color: "#38bdf8", accent: "#0284c7" },
            { label: "ML",         color: "#a855f7", accent: "#7e22ce" },
            { label: "BigData",    color: "#f97316", accent: "#c2410c" },
            { label: "RAG",        color: "#10b981", accent: "#047857" },
            { label: "Agents",     color: "#ec4899", accent: "#be185d" },
            { label: "LLM",        color: "#eab308", accent: "#a16207" },
            { label: "Cloud",      color: "#06b6d4", accent: "#0e7490" },
            { label: "DevOps",     color: "#6366f1", accent: "#4338ca" },
            { label: "Web3",       color: "#14b8a6", accent: "#0f766e" },
            { label: "IoT",        color: "#f43f5e", accent: "#be123c" },
            { label: "NeuralNet",  color: "#22d3ee", accent: "#0891b2" },
            { label: "Quantum",    color: "#c084fc", accent: "#9333ea" },
            { label: "VectorDB",   color: "#34d399", accent: "#059669" },
            { label: "Kubernetes", color: "#60a5fa", accent: "#2563eb" },
            { label: "PyTorch",    color: "#fb923c", accent: "#ea580c" },
            { label: "GraphQL",    color: "#f472b6", accent: "#db2777" },
            { label: "Docker",     color: "#38bdf8", accent: "#0369a1" },
            { label: "Rust",       color: "#f59e0b", accent: "#b45309" },
            { label: "EdgeAI",     color: "#2dd4bf", accent: "#0d9488" },
            { label: "CUDA",       color: "#4ade80", accent: "#15803d" }
        ];

        const EXTRA_PALETTE = [
            { color: "#22d3ee", accent: "#0891b2" },
            { color: "#c084fc", accent: "#9333ea" },
            { color: "#34d399", accent: "#059669" },
            { color: "#fb923c", accent: "#ea580c" },
            { color: "#f472b6", accent: "#db2777" },
            { color: "#60a5fa", accent: "#2563eb" }
        ];

        // Dynamic Viewport Bounds in World Coordinates (Computed from Camera Frustum)
        const viewBounds = {
            x: 12.0,
            y: 6.5,
            z: 4.5
        };

        // Simulation State
        const state = {
            targetCount: 3,
            driftMode: "rise", // "float" | "rise" | "gravity"
            timeScale: 0.2,
            restitution: 0.94,
            simTime: 0,
            poolCursor: 0
        };

        // Core Three.js Globals
        let scene, camera, renderer, controls;
        let worldGroup;
        let ambientParticles;
        const bubbles = [];
        const burstParticles = [];
        const pulseRings = [];
        const raycaster = new THREE.Raycaster();
        const pointer = new THREE.Vector2();
        let clock;

        // Shared Sphere & Droplet Geometries
        let sharedSphereGeo;
        let sharedRingGeo;
        let sharedDropletGeo;

        // =========================================================================
        // 1. INITIALIZATION & SCENE SETUP (NO BOX OR WALLS)
        // =========================================================================
        function init() {
            const container = document.getElementById("canvas-container");

            // Deep space backdrop
            scene = new THREE.Scene();
            scene.background = null;
            scene.fog = null;

            // Perspective Camera
            camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 160);
            camera.position.set(0, 0, 22);

            // WebGL Renderer
            renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "high-performance" });
            renderer.setSize(window.innerWidth, window.innerHeight);
            renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
            renderer.setClearColor(0x000000, 0);
            renderer.toneMapping = THREE.ACESFilmicToneMapping;
            renderer.toneMappingExposure = 1.25;
            container.appendChild(renderer.domElement);

            // OrbitControls (Gentle rotation/zoom while keeping viewport bounds synced)
            controls = new THREE.OrbitControls(camera, renderer.domElement);
            controls.enableDamping = true;
            controls.dampingFactor = 0.06;
            controls.minDistance = 12;
            controls.maxDistance = 42;
            controls.enableZoom = false;
            controls.enablePan = false;

            // Studio Lighting Setup
            setupLighting();

            // Shared Geometries
            sharedSphereGeo = new THREE.SphereGeometry(1, 48, 48);
            sharedRingGeo = new THREE.RingGeometry(0.955, 1.015, 64);
            sharedDropletGeo = new THREE.SphereGeometry(0.11, 12, 12);

            // Root container group (Completely open space — zero boxes/walls)
            worldGroup = new THREE.Group();
            scene.add(worldGroup);

            // Compute exact visible viewport boundaries at Z = 0
            updateViewportBounds();

            // Create Ambient Background Dust Particles
            createAmbientParticles();

            // Spawn Initial Free Tech Bubbles
            resetDefaultBubbles();

            // Bind UI & Pointer Events
            bindEvents();

            clock = new THREE.Clock();
        }

        function setupLighting() {
            const ambientLight = new THREE.AmbientLight(0xdbeafe, 0.9);
            scene.add(ambientLight);

            const topLight = new THREE.DirectionalLight(0xffffff, 1.4);
            topLight.position.set(8, 22, 14);
            scene.add(topLight);

            const rimLight1 = new THREE.PointLight(0x38bdf8, 1.4, 55);
            rimLight1.position.set(-14, 8, 12);
            scene.add(rimLight1);

            const rimLight2 = new THREE.PointLight(0xc084fc, 1.4, 55);
            rimLight2.position.set(14, -6, -12);
            scene.add(rimLight2);
        }

        // =========================================================================
        // 2. VIEWPORT WINDOW BOUNDARIES (NO BOXES OR BORDERS)
        // =========================================================================
        function updateViewportBounds() {
            if (!camera) return;
            const dist = camera.position.distanceTo(controls ? controls.target : new THREE.Vector3(0, 0, 0));
            const vFovRad = THREE.MathUtils.degToRad(camera.fov);
            const visibleHeight = 2 * Math.tan(vFovRad * 0.5) * dist;
            const visibleWidth = visibleHeight * camera.aspect;

            viewBounds.x = visibleWidth * 0.5;
            viewBounds.y = visibleHeight * 0.5;
            viewBounds.z = 4.2;
        }

        function getNextTechItem() {
            // Pick a tech item not currently active if possible
            const activeLabels = new Set(bubbles.map(b => b.label));
            for (let attempt = 0; attempt < TECH_POOL.length; attempt++) {
                const candidate = TECH_POOL[(state.poolCursor + attempt) % TECH_POOL.length];
                if (!activeLabels.has(candidate.label)) {
                    state.poolCursor = (state.poolCursor + attempt + 1) % TECH_POOL.length;
                    return candidate;
                }
            }
            const fallback = TECH_POOL[state.poolCursor % TECH_POOL.length];
            state.poolCursor = (state.poolCursor + 1) % TECH_POOL.length;
            return fallback;
        }

        // =========================================================================
        // 3. VISIBLE TRANSPARENT GLASS BUBBLES & INNER TECH TEXT SPRITES
        // =========================================================================
        function createBubbleMaterial(colorHex, accentHex, isFrontShell) {
            return new THREE.ShaderMaterial({
                uniforms: {
                    uColor: { value: new THREE.Color(colorHex) },
                    uAccent: { value: new THREE.Color(accentHex) },
                    uPulse: { value: 0.0 },
                    uIsFront: { value: isFrontShell ? 1.0 : 0.0 }
                },
                vertexShader: `
                    varying vec3 vNormal;
                    varying vec3 vViewDir;
                    void main() {
                        vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
                        vNormal = normalize(normalMatrix * normal);
                        vViewDir = normalize(-mvPosition.xyz);
                        gl_Position = projectionMatrix * mvPosition;
                    }
                `,
                fragmentShader: `
                    uniform vec3 uColor;
                    uniform vec3 uAccent;
                    uniform float uPulse;
                    uniform float uIsFront;
                    varying vec3 vNormal;
                    varying vec3 vViewDir;

                    void main() {
                        vec3 N = normalize(vNormal);
                        if (!gl_FrontFacing) {
                            N = -N;
                        }
                        vec3 V = normalize(vViewDir);
                        float ndotv = abs(dot(N, V));

                        // Crisp glass rim Fresnel
                        float fresnel = pow(1.0 - ndotv, 2.2);

                        // Primary and secondary studio specular highlights
                        vec3 L1 = normalize(vec3(-0.55, 0.78, 0.85));
                        vec3 H1 = normalize(L1 + V);
                        float spec1 = pow(max(dot(N, H1), 0.0), 42.0);

                        vec3 L2 = normalize(vec3(0.65, -0.55, 0.65));
                        vec3 H2 = normalize(L2 + V);
                        float spec2 = pow(max(dot(N, H2), 0.0), 22.0);

                        vec3 glassTint = mix(uAccent, uColor, fresnel * 0.85 + 0.15);
                        vec3 finalColor = glassTint * (0.45 + fresnel * 1.15);

                        if (uIsFront > 0.5) {
                            finalColor += vec3(1.0) * (spec1 * 1.25 + spec2 * 0.45);
                            finalColor += uColor * (fresnel * 0.55 + uPulse * 0.4);
                        } else {
                            finalColor += uColor * (fresnel * 0.35);
                        }

                        float baseTintAlpha = (uIsFront > 0.5) ? 0.13 : 0.08;
                        float rimAlpha = fresnel * ((uIsFront > 0.5) ? 0.82 : 0.45);
                        float specAlpha = (uIsFront > 0.5) ? (spec1 * 0.9 + spec2 * 0.3) : 0.0;

                        float alpha = clamp(baseTintAlpha + rimAlpha + specAlpha + uPulse * 0.22, 0.06, 0.94);
                        gl_FragColor = vec4(finalColor, alpha);
                    }
                `,
                transparent: true,
                depthWrite: false,
                side: isFrontShell ? THREE.FrontSide : THREE.BackSide,
                blending: THREE.NormalBlending
            });
        }

        function createTechLabelSprite(text, colorHex) {
            const canvas = document.createElement("canvas");
            const size = 512;
            canvas.width = size;
            canvas.height = size;

            const ctx = canvas.getContext("2d");
            ctx.clearRect(0, 0, size, size);

            // Stronger soft dark core keeps every label readable through the glass.
            const grad = ctx.createRadialGradient(
                size / 2, size / 2, 18,
                size / 2, size / 2, size * 0.46
            );
            grad.addColorStop(0, "rgba(3, 7, 18, 0.88)");
            grad.addColorStop(0.58, "rgba(3, 7, 18, 0.62)");
            grad.addColorStop(0.82, "rgba(3, 7, 18, 0.22)");
            grad.addColorStop(1, "rgba(3, 7, 18, 0.0)");
            ctx.fillStyle = grad;
            ctx.fillRect(0, 0, size, size);

            // Larger adaptive lettering while keeping long technology names inside the sphere.
            let fontSize = 132;
            if (text.length >= 4 && text.length <= 6) fontSize = 108;
            else if (text.length >= 7 && text.length <= 9) fontSize = 82;
            else if (text.length >= 10) fontSize = 66;

            ctx.font = `800 ${fontSize}px Inter, Arial, sans-serif`;
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            ctx.lineJoin = "round";

            // Crisp dark outline plus colored glow for contrast against any bubble color.
            ctx.shadowColor = colorHex;
            ctx.shadowBlur = 25;
            ctx.lineWidth = 13;
            ctx.strokeStyle = "rgba(0, 0, 0, 0.98)";
            ctx.strokeText(text, size / 2, size / 2 + 2);

            ctx.shadowBlur = 12;
            ctx.lineWidth = 4;
            ctx.strokeStyle = "rgba(255, 255, 255, 0.92)";
            ctx.strokeText(text, size / 2, size / 2 + 2);

            ctx.shadowColor = colorHex;
            ctx.shadowBlur = 18;
            ctx.fillStyle = "#ffffff";
            ctx.fillText(text, size / 2, size / 2 + 2);

            const texture = new THREE.CanvasTexture(canvas);
            texture.anisotropy = 8;
            texture.needsUpdate = true;

            const spriteMat = new THREE.SpriteMaterial({
                map: texture,
                transparent: true,
                depthWrite: false,
                depthTest: false,
                toneMapped: false
            });

            const sprite = new THREE.Sprite(spriteMat);
            return sprite;
        }

        function createAmbientParticles() {
            const count = 180;
            const positions = new Float32Array(count * 3);
            for (let i = 0; i < count; i++) {
                positions[i * 3]     = (Math.random() - 0.5) * 38;
                positions[i * 3 + 1] = (Math.random() - 0.5) * 16;
                positions[i * 3 + 2] = (Math.random() - 0.5) * 20;
            }
            const geo = new THREE.BufferGeometry();
            geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
            const mat = new THREE.PointsMaterial({
                color: 0x38bdf8,
                size: 0.09,
                transparent: true,
                opacity: 0.45
            });
            ambientParticles = new THREE.Points(geo, mat);
            scene.add(ambientParticles);
        }

        // =========================================================================
        // 4. BUBBLE SPAWNING, BURSTING & COUNT MANAGEMENT
        // =========================================================================
        function spawnBubble(label, colorHex, accentHex, spawnNearCenter = false) {
            const radius = 1.05;
            const group = new THREE.Group();

            // 1. Back inner glass shell (renderOrder = 1)
            const backMat = createBubbleMaterial(colorHex, accentHex, false);
            const backMesh = new THREE.Mesh(sharedSphereGeo, backMat);
            backMesh.scale.setScalar(radius);
            backMesh.renderOrder = 1;
            group.add(backMesh);

            // 2. Tech label sprite floating inside the center (renderOrder = 2)
            const labelSprite = createTechLabelSprite(label, colorHex);
            labelSprite.scale.set(radius * 1.62, radius * 1.62, 1);
            labelSprite.renderOrder = 2;
            group.add(labelSprite);

            // 3. Front glossy glass shell (renderOrder = 3)
            const frontMat = createBubbleMaterial(colorHex, accentHex, true);
            const frontMesh = new THREE.Mesh(sharedSphereGeo, frontMat);
            frontMesh.scale.setScalar(radius);
            frontMesh.renderOrder = 3;
            group.add(frontMesh);

            // 4. Crisp outer contour ring facing camera (renderOrder = 4)
            const ringMat = new THREE.MeshBasicMaterial({
                color: new THREE.Color(colorHex),
                transparent: true,
                opacity: 0.75,
                side: THREE.DoubleSide,
                depthWrite: false
            });
            const contourRing = new THREE.Mesh(sharedRingGeo, ringMat);
            contourRing.scale.setScalar(radius);
            contourRing.renderOrder = 4;
            group.add(contourRing);

            worldGroup.add(group);

            // Safe spawn region well inside the window edges
            const safeX = Math.max(1.5, viewBounds.x - radius * 2.4);
            const safeY = Math.max(1.2, viewBounds.y - radius * 2.4);
            const safeZ = Math.max(1.5, viewBounds.z - radius * 1.4);

            let px, py, pz;
            if (spawnNearCenter) {
                px = (Math.random() - 0.5) * safeX * 0.75;
                py = (Math.random() - 0.5) * safeY * 0.75;
                pz = (Math.random() - 0.5) * safeZ * 0.6;
            } else {
                px = (Math.random() * 2 - 1) * safeX;
                py = (Math.random() * 2 - 1) * safeY;
                pz = (Math.random() * 2 - 1) * safeZ;
            }

            // Gentle, organic initial drift velocity
            const angle = Math.random() * Math.PI * 2;
            const speed = 2.0 + Math.random() * 2.4;
            const vx = Math.cos(angle) * speed;
            const vy = Math.sin(angle) * speed;
            const vz = (Math.random() - 0.5) * 2.2;

            const bubbleObj = {
                label,
                color: colorHex,
                accent: accentHex,
                radius,
                group,
                backMat,
                frontMat,
                contourRing,
                labelSprite,
                phase: Math.random() * Math.PI * 2,
                pos: new THREE.Vector3(px, py, pz),
                vel: new THREE.Vector3(vx, vy, vz),
                spawnScale: 0.05,
                pulse: 0.65
            };

            group.position.copy(bubbleObj.pos);
            group.scale.setScalar(0.05);
            bubbles.push(bubbleObj);
            updateBubbleCounter();
            return bubbleObj;
        }

        function triggerBubbleBurst(index, reason = "edge") {
            const b = bubbles[index];
            if (!b) return;

            const burstPos = b.pos.clone();
            const burstColor = b.color;
            const burstRadius = b.radius;

            // Remove old bubble from scene & dispose dynamic sprite texture
            worldGroup.remove(b.group);
            if (b.labelSprite.material.map) b.labelSprite.material.map.dispose();
            b.labelSprite.material.dispose();
            b.backMat.dispose();
            b.frontMat.dispose();
            b.contourRing.material.dispose();
            bubbles.splice(index, 1);

            // Spawn expanding shockwave ring at burst point
            spawnPulseRing(burstPos, burstColor, burstRadius * 1.15);

            // Spawn 18 sparkling glass burst droplets flying outward
            const dropletCount = 18;
            for (let i = 0; i < dropletCount; i++) {
                const mat = new THREE.MeshBasicMaterial({
                    color: new THREE.Color(burstColor),
                    transparent: true,
                    opacity: 0.95,
                    blending: THREE.AdditiveBlending,
                    depthWrite: false
                });
                const mesh = new THREE.Mesh(sharedDropletGeo, mat);
                mesh.position.copy(burstPos);

                const theta = Math.random() * Math.PI * 2;
                const phi = Math.acos(2 * Math.random() - 1);
                const spd = 4.5 + Math.random() * 6.5;
                const vel = new THREE.Vector3(
                    Math.sin(phi) * Math.cos(theta) * spd,
                    Math.sin(phi) * Math.sin(theta) * spd,
                    Math.cos(phi) * spd * 0.6
                );

                // Bias droplets inward if burst happened on a window edge
                if (burstPos.x > viewBounds.x - burstRadius * 1.3) vel.x = -Math.abs(vel.x);
                if (burstPos.x < -viewBounds.x + burstRadius * 1.3) vel.x = Math.abs(vel.x);
                if (burstPos.y > viewBounds.y - burstRadius * 1.3) vel.y = -Math.abs(vel.y);
                if (burstPos.y < -viewBounds.y + burstRadius * 1.3) vel.y = Math.abs(vel.y);

                worldGroup.add(mesh);
                burstParticles.push({
                    mesh,
                    vel,
                    age: 0,
                    maxAge: 0.45 + Math.random() * 0.25
                });
            }

            // Immediately spawn another tech-named bubble if below targetCount
            if (bubbles.length < state.targetCount) {
                const nextTech = getNextTechItem();
                spawnBubble(nextTech.label, nextTech.color, nextTech.accent, true);
                if (reason === "click") {
                    showToast(`Popped ${b.label} → Spawned ${nextTech.label}`);
                }
            }
            updateBubbleCounter();
        }

        function syncBubbleCountToTarget() {
            while (bubbles.length < state.targetCount) {
                const nextTech = getNextTechItem();
                spawnBubble(nextTech.label, nextTech.color, nextTech.accent, true);
            }
            while (bubbles.length > state.targetCount) {
                triggerBubbleBurst(bubbles.length - 1, "trim");
            }
            updateBubbleCounter();
        }

        function updateBubbleCounter() {
            const badge = document.getElementById("bubble-count-badge");
            if (badge) {
                badge.textContent = `${bubbles.length} Bubble${bubbles.length === 1 ? "" : "s"}`;
            }
            const countVal = document.getElementById("count-val");
            if (countVal) {
                countVal.textContent = `${state.targetCount}`;
            }
        }

        function resetDefaultBubbles() {
            while (bubbles.length > 0) {
                const b = bubbles.pop();
                worldGroup.remove(b.group);
                if (b.labelSprite.material.map) b.labelSprite.material.map.dispose();
                b.labelSprite.material.dispose();
                b.backMat.dispose();
                b.frontMat.dispose();
                b.contourRing.material.dispose();
            }

            state.poolCursor = 0;
            for (let i = 0; i < state.targetCount; i++) {
                const item = getNextTechItem();
                spawnBubble(item.label, item.color, item.accent, false);
            }
            updateBubbleCounter();
        }

        // =========================================================================
        // 5. FREE-FLOAT PHYSICS, ELASTIC COLLISIONS & WINDOW EDGE BURSTING
        // =========================================================================
        function stepPhysics(dt) {
            const subSteps = 3;
            const subDt = dt / subSteps;

            for (let s = 0; s < subSteps; s++) {
                state.simTime += subDt;

                for (let i = 0; i < bubbles.length; i++) {
                    const b = bubbles[i];

                    // Organic harmonic currents + optional drift mode
                    const swirlX = Math.sin(state.simTime * 0.9 + b.phase) * 0.85;
                    const swirlY = Math.cos(state.simTime * 0.85 + b.phase * 1.3) * 0.85;
                    const swirlZ = Math.sin(state.simTime * 0.75 + b.phase * 0.7) * 0.75;

                    b.vel.x += swirlX * subDt;
                    b.vel.y += swirlY * subDt;
                    b.vel.z += swirlZ * subDt;

                    if (state.driftMode === "rise") {
                        b.vel.y += 2.4 * subDt;
                    } else if (state.driftMode === "gravity") {
                        b.vel.y -= 3.2 * subDt;
                    }

                    // Gentle speed clamp so bubbles glide gracefully and burst visibly on window edges
                    const maxSpd = 6.2;
                    const curSpd = b.vel.length();
                    if (curSpd > maxSpd) {
                        b.vel.multiplyScalar(maxSpd / curSpd);
                    } else if (curSpd < 1.3) {
                        b.vel.multiplyScalar(1.0 + 0.8 * subDt);
                    }

                    b.pos.addScaledVector(b.vel, subDt);

                    // Soft Z-depth cushion so bubbles stay in crisp 3D camera focus
                    const maxZ = viewBounds.z - b.radius;
                    if (b.pos.z < -maxZ) {
                        b.pos.z = -maxZ;
                        b.vel.z = Math.abs(b.vel.z) * 0.9;
                    } else if (b.pos.z > maxZ) {
                        b.pos.z = maxZ;
                        b.vel.z = -Math.abs(b.vel.z) * 0.9;
                    }
                }

                // Pairwise elastic bubble-to-bubble collisions
                for (let i = 0; i < bubbles.length; i++) {
                    for (let j = i + 1; j < bubbles.length; j++) {
                        const a = bubbles[i];
                        const b = bubbles[j];
                        const dx = b.pos.x - a.pos.x;
                        const dy = b.pos.y - a.pos.y;
                        const dz = b.pos.z - a.pos.z;
                        const distSq = dx * dx + dy * dy + dz * dz;
                        const minDist = a.radius + b.radius;

                        if (distSq > 0.00001 && distSq < minDist * minDist) {
                            const dist = Math.sqrt(distSq);
                            const nx = dx / dist;
                            const ny = dy / dist;
                            const nz = dz / dist;

                            const overlap = (minDist - dist) * 0.5;
                            a.pos.x -= nx * overlap;
                            a.pos.y -= ny * overlap;
                            a.pos.z -= nz * overlap;
                            b.pos.x += nx * overlap;
                            b.pos.y += ny * overlap;
                            b.pos.z += nz * overlap;

                            const rvx = b.vel.x - a.vel.x;
                            const rvy = b.vel.y - a.vel.y;
                            const rvz = b.vel.z - a.vel.z;
                            const velAlongNormal = rvx * nx + rvy * ny + rvz * nz;

                            if (velAlongNormal < 0) {
                                const impulse = -(1 + state.restitution) * velAlongNormal * 0.5;
                                a.vel.x -= impulse * nx;
                                a.vel.y -= impulse * ny;
                                a.vel.z -= impulse * nz;
                                b.vel.x += impulse * nx;
                                b.vel.y += impulse * ny;
                                b.vel.z += impulse * nz;

                                const flashAmt = Math.min(0.65, Math.abs(velAlongNormal) * 0.09);
                                a.pulse = Math.max(a.pulse, flashAmt);
                                b.pulse = Math.max(b.pulse, flashAmt);
                            }
                        }
                    }
                }
            }

            // Check if any bubble touched the left, right, top, or bottom edge of the window -> BURST!
            for (let i = bubbles.length - 1; i >= 0; i--) {
                const b = bubbles[i];
                const edgeX = viewBounds.x - b.radius * 0.85;
                const edgeY = viewBounds.y - b.radius * 0.85;

                if (
                    b.pos.x <= -edgeX ||
                    b.pos.x >= edgeX ||
                    b.pos.y <= -edgeY ||
                    b.pos.y >= edgeY
                ) {
                    triggerBubbleBurst(i, "edge");
                }
            }
        }

        // =========================================================================
        // 6. VISUAL UPDATES, BURST DROPLETS, PULSE RINGS & INTERACTIONS
        // =========================================================================
        function spawnPulseRing(position, colorHex, radius) {
            const geo = new THREE.RingGeometry(radius * 0.85, radius * 1.04, 48);
            const mat = new THREE.MeshBasicMaterial({
                color: new THREE.Color(colorHex),
                transparent: true,
                opacity: 0.9,
                side: THREE.DoubleSide,
                depthWrite: false,
                blending: THREE.AdditiveBlending
            });
            const mesh = new THREE.Mesh(geo, mat);
            mesh.position.copy(position);
            mesh.lookAt(camera.position);
            worldGroup.add(mesh);
            pulseRings.push({ mesh, age: 0, maxAge: 0.5 });
        }

        function scatterAllBubbles() {
            bubbles.forEach(b => {
                const angle = Math.atan2(b.pos.y, b.pos.x) + (Math.random() - 0.5) * 0.6;
                const speed = 4.6 + Math.random() * 2.2;
                b.vel.set(Math.cos(angle) * speed, Math.sin(angle) * speed, (Math.random() - 0.5) * 3.0);
                b.pulse = 0.85;
            });
            showToast("Scattered bubbles toward window edges!");
        }

        function updateVisuals(dt) {
            // Update bubbles position, smooth spawn scale-in & contour ring orientation
            for (let i = 0; i < bubbles.length; i++) {
                const b = bubbles[i];
                b.group.position.copy(b.pos);
                b.contourRing.lookAt(camera.position);

                // Smooth elastic pop-in scale for newly spawned bubbles
                if (b.spawnScale < 1.0) {
                    b.spawnScale = Math.min(1.0, b.spawnScale + dt * 3.8);
                }
                const easeScale = 1 - Math.pow(1 - b.spawnScale, 3);
                const wobble = Math.sin(state.simTime * 3.2 + b.phase) * 0.025;
                b.group.scale.set(
                    easeScale * (1 + wobble),
                    easeScale * (1 - wobble),
                    easeScale * (1 + wobble * 0.5)
                );

                if (b.pulse > 0.001) {
                    b.pulse = Math.max(0, b.pulse - dt * 2.1);
                }
                b.frontMat.uniforms.uPulse.value = b.pulse;
                b.backMat.uniforms.uPulse.value = b.pulse * 0.5;
            }

            // Update burst droplet particles
            for (let i = burstParticles.length - 1; i >= 0; i--) {
                const p = burstParticles[i];
                p.age += dt;
                const t = p.age / p.maxAge;
                if (t >= 1) {
                    worldGroup.remove(p.mesh);
                    p.mesh.material.dispose();
                    burstParticles.splice(i, 1);
                } else {
                    p.mesh.position.addScaledVector(p.vel, dt);
                    p.vel.multiplyScalar(0.95);
                    p.mesh.scale.setScalar(1 - t * 0.8);
                    p.mesh.material.opacity = (1 - t) * 0.95;
                }
            }

            // Update expanding shockwave rings
            for (let i = pulseRings.length - 1; i >= 0; i--) {
                const r = pulseRings[i];
                r.age += dt;
                const t = r.age / r.maxAge;
                if (t >= 1) {
                    worldGroup.remove(r.mesh);
                    r.mesh.geometry.dispose();
                    r.mesh.material.dispose();
                    pulseRings.splice(i, 1);
                } else {
                    const scale = 1 + t * 1.65;
                    r.mesh.scale.setScalar(scale);
                    r.mesh.material.opacity = (1 - t) * 0.85;
                    r.mesh.lookAt(camera.position);
                }
            }

            if (ambientParticles) {
                ambientParticles.rotation.y += dt * 0.02;
            }
        }

        // =========================================================================
        // 7. EVENT HANDLERS & UI CONTROLS
        // =========================================================================
        let toastTimer = null;
        function showToast(msg) {
            const banner = document.getElementById("toast-banner");
            const text = document.getElementById("toast-text");
            if (!banner || !text) return;
            text.textContent = msg;
            banner.classList.remove("opacity-0", "-translate-y-2");
            banner.classList.add("opacity-100", "translate-y-0");
            clearTimeout(toastTimer);
            toastTimer = setTimeout(() => {
                banner.classList.remove("opacity-100", "translate-y-0");
                banner.classList.add("opacity-0", "-translate-y-2");
            }, 2200);
        }

        function bindEvents() {
            // Resize handling -> dynamically update window burst boundaries
            window.addEventListener("resize", () => {
                camera.aspect = window.innerWidth / window.innerHeight;
                camera.updateProjectionMatrix();
                renderer.setSize(window.innerWidth, window.innerHeight);
                updateViewportBounds();
            });

            // Keep window burst bounds accurate if user zooms camera
            controls.addEventListener("change", updateViewportBounds);

            // Raycast click / tap on a bubble -> pop it & spawn a new tech bubble
            let pointerDownPos = { x: 0, y: 0 };
            renderer.domElement.addEventListener("pointerdown", (e) => {
                pointerDownPos = { x: e.clientX, y: e.clientY };
            });

            renderer.domElement.addEventListener("pointerup", (e) => {
                const moveDist = Math.hypot(e.clientX - pointerDownPos.x, e.clientY - pointerDownPos.y);
                if (moveDist > 6) return;

                const rect = renderer.domElement.getBoundingClientRect();
                pointer.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
                pointer.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

                raycaster.setFromCamera(pointer, camera);
                const targets = bubbles.map(b => b.group.children[2]); // Front sphere mesh
                const hits = raycaster.intersectObjects(targets, false);

                if (hits.length > 0) {
                    const hitMesh = hits[0].object;
                    const idx = bubbles.findIndex(b => b.group.children[2] === hitMesh);
                    if (idx !== -1) {
                        triggerBubbleBurst(idx, "click");
                    }
                }
            });

            // Add custom tech bubble to pool & spawn immediately
            const form = document.getElementById("add-bubble-form");
            const input = document.getElementById("tech-input");
            const countSlider = document.getElementById("count-slider");
            form.addEventListener("submit", (e) => {
                e.preventDefault();
                const raw = input.value.trim();
                if (!raw) return;

                const palette = EXTRA_PALETTE[TECH_POOL.length % EXTRA_PALETTE.length];
                TECH_POOL.unshift({ label: raw, color: palette.color, accent: palette.accent });
                state.poolCursor = 0;

                if (state.targetCount < 24) {
                    state.targetCount += 1;
                    countSlider.value = state.targetCount;
                } else if (bubbles.length > 0) {
                    triggerBubbleBurst(0, "replace");
                }
                syncBubbleCountToTarget();
                input.value = "";
                showToast(`Added "${raw}" bubble`);
            });

            // Bubble Count Slider Control
            countSlider.addEventListener("input", (e) => {
                state.targetCount = parseInt(e.target.value, 10);
                syncBubbleCountToTarget();
            });

            // Scatter Pulse Button
            document.getElementById("btn-burst-wave").addEventListener("click", scatterAllBubbles);

            // Drift Mode Cycle Button (Float -> Rise -> Gravity)
            const btnGravity = document.getElementById("btn-gravity");
            const gravityLabel = document.getElementById("gravity-label");
            const gravityDot = document.getElementById("gravity-dot");
            btnGravity.addEventListener("click", () => {
                if (state.driftMode === "float") {
                    state.driftMode = "rise";
                    gravityLabel.textContent = "Drift: Rise";
                    gravityDot.className = "w-2 h-2 rounded-full bg-cyan-400 animate-pulse";
                    showToast("Upward buoyancy drift enabled");
                } else if (state.driftMode === "rise") {
                    state.driftMode = "gravity";
                    gravityLabel.textContent = "Drift: Gravity";
                    gravityDot.className = "w-2 h-2 rounded-full bg-amber-400";
                    showToast("Downward gravity drift enabled");
                } else {
                    state.driftMode = "float";
                    gravityLabel.textContent = "Drift: Float";
                    gravityDot.className = "w-2 h-2 rounded-full bg-indigo-400";
                    showToast("Zero-G omnidirectional float enabled");
                }
            });

            // Reset Button
            document.getElementById("btn-reset").addEventListener("click", () => {
                camera.position.set(0, 0, 22);
                controls.target.set(0, 0, 0);
                controls.update();
                updateViewportBounds();
                resetDefaultBubbles();
                showToast("Bubbles reset");
            });

            // Speed Slider
            const speedSlider = document.getElementById("speed-slider");
            const speedVal = document.getElementById("speed-val");
            speedSlider.addEventListener("input", (e) => {
                state.timeScale = parseFloat(e.target.value);
                speedVal.textContent = `${state.timeScale.toFixed(1)}x`;
            });
        }

        // =========================================================================
        // 8. MAIN ANIMATION LOOP
        // =========================================================================
        function animate() {
            requestAnimationFrame(animate);

            const rawDt = Math.min(clock.getDelta(), 0.05);
            const scaledDt = rawDt * state.timeScale;

            stepPhysics(scaledDt);
            updateVisuals(rawDt);

            controls.update();
            renderer.render(scene, camera);
        }

        window.onload = function () {
            init();
            animate();
        };
