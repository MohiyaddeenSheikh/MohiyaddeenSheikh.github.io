/*
===========================================================
PORTFOLIO — 3D ACADEMIC GRADUATION CAP
Based on the supplied Academic Mortarboard reference.

Features:
- Detailed 3D mortarboard
- Sculpted skullcap
- Centre golden button
- Braided golden cord
- 60 animated tassel strands
- Five academic colour themes
- Tassel left/right control
- Wind gust
- Auto rotation
- Reset
- Interactive rotation
- Settings panel
- Responsive portrait positioning
- Saved settings
===========================================================
*/

import * as THREE from
    "https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js";

(() => {
    "use strict";

    const canvas = document.getElementById("home-3d-canvas");
    const portrait = document.querySelector("#home .home__blob");

    if (!canvas || !portrait) {
        console.error("Graduation cap: required portfolio elements not found.");
        return;
    }

    if (canvas.parentElement !== document.body) {
        document.body.appendChild(canvas);
    }

    // =====================================================
    // 1. SETTINGS
    // =====================================================

    const DEFAULT_SETTINGS = {
    size: 42,
    x: -4,
    y: -31,
    tilt: 4,
    visible: true,
    theme: "classic",
    autoRotate: false
};

let settings = { ...DEFAULT_SETTINGS };

try {
    const saved = JSON.parse(
        localStorage.getItem("portfolio-cap-settings")
    );

    if (saved && typeof saved === "object") {
        settings = { ...DEFAULT_SETTINGS, ...saved };

        // Migrate the old 100% default to the new 42% default.
        if (Number(saved.size) === 100) {
            settings.size = 42;

            localStorage.setItem(
                "portfolio-cap-settings",
                JSON.stringify(settings)
            );
        }
    }
} catch (error) {
    console.warn("Could not load cap settings:", error);
}

    const THEMES = {
        classic: {
            name: "Classic Black & Gold",
            fabric: 0x1a1d24,
            lining: 0x111319,
            piping: 0x262a34,
            tassel: 0xf4b41a,
            tasselDark: 0xc27d0e,
            band: 0xd96b14
        },

        navy: {
            name: "Royal Navy & Silver",
            fabric: 0x162447,
            lining: 0x0e1830,
            piping: 0x223666,
            tassel: 0xe2e8f0,
            tasselDark: 0x94a3b8,
            band: 0x64748b
        },

        maroon: {
            name: "Crimson Maroon & Gold",
            fabric: 0x5c1324,
            lining: 0x3b0a15,
            piping: 0x781b31,
            tassel: 0xf59e0b,
            tasselDark: 0xb45309,
            band: 0xd97706
        },

        emerald: {
            name: "Emerald Green & Gold",
            fabric: 0x074837,
            lining: 0x042d22,
            piping: 0x0c634c,
            tassel: 0xfbbf24,
            tasselDark: 0xd97706,
            band: 0xb45309
        },

        ivory: {
            name: "Ivory & Gold",
            fabric: 0xe8e1d1,
            lining: 0xd2c9b6,
            piping: 0xf5efe2,
            tassel: 0xd97706,
            tasselDark: 0x92400e,
            band: 0xb45309
        }
    };

    function saveSettings() {
        try {
            localStorage.setItem(
                "portfolio-cap-settings",
                JSON.stringify(settings)
            );
        } catch (error) {
            console.warn("Could not save cap settings.");
        }
    }

    // =====================================================
    // 2. SETTINGS INTERFACE
    // =====================================================

    const style = document.createElement("style");

    style.textContent = `
        #portfolio-cap-ui {
            position: fixed;
            right: 20px;
            bottom: 22px;
            z-index: 2147483647;
            font-family: inherit;
        }

        #portfolio-cap-ui button {
            cursor: pointer;
            font-family: inherit;
        }

        .portfolio-cap-gear {
            width: 45px;
            height: 45px;
            border-radius: 50%;
            border: 1px solid rgba(255,255,255,.22);
            background: rgba(20,24,34,.88);
            color: white;
            font-size: 23px;
            box-shadow: 0 5px 20px rgba(0,0,0,.25);
            backdrop-filter: blur(12px);
        }

        .portfolio-cap-panel {
            display: none;
            position: absolute;
            right: 0;
            bottom: 55px;
            width: min(310px, calc(100vw - 35px));
            max-height: 75vh;
            overflow-y: auto;
            padding: 17px;
            color: #fff;
            background: rgba(15,20,32,.94);
            border: 1px solid rgba(255,255,255,.14);
            border-radius: 17px;
            backdrop-filter: blur(18px);
            box-shadow: 0 15px 45px rgba(0,0,0,.4);
        }

        .portfolio-cap-panel.open {
            display: block;
        }

        .portfolio-cap-heading {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 15px;
        }

        .portfolio-cap-heading h3 {
            color: white;
            font-size: 15px;
            margin: 0;
        }

        .portfolio-cap-close {
            background: transparent;
            color: white;
            border: none;
            font-size: 23px;
        }

        .portfolio-cap-control {
            margin-bottom: 13px;
        }

        .portfolio-cap-control label {
            display: flex;
            justify-content: space-between;
            font-size: 12px;
            color: #d1d5db;
            margin-bottom: 5px;
        }

        .portfolio-cap-control input[type=range] {
            width: 100%;
            accent-color: #eab308;
        }

        .portfolio-cap-themes {
            display: flex;
            gap: 10px;
            margin: 12px 0 17px;
        }

        .portfolio-cap-swatch {
            width: 29px;
            height: 29px;
            border-radius: 50%;
            border: 2px solid rgba(255,255,255,.25);
        }

        .portfolio-cap-swatch.active {
            outline: 2px solid white;
            outline-offset: 3px;
        }

        .portfolio-cap-actions {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 8px;
            margin-top: 12px;
        }

        .portfolio-cap-actions button {
            padding: 9px 7px;
            border-radius: 9px;
            border: 1px solid rgba(255,255,255,.13);
            color: white;
            background: rgba(255,255,255,.10);
            font-size: 11px;
        }

        .portfolio-cap-actions button:hover {
            background: rgba(255,255,255,.2);
        }

        .portfolio-cap-hint {
            color: #9ca3af;
            font-size: 10px;
            line-height: 1.5;
            margin-top: 13px;
        }

        @media(max-width:600px) {
            #portfolio-cap-ui {
                right: 12px;
                bottom: 15px;
            }

            .portfolio-cap-panel {
                max-height: 65vh;
            }
        }
    `;

    document.head.appendChild(style);

    const ui = document.createElement("div");

    ui.id = "portfolio-cap-ui";

    ui.innerHTML = `
        <section class="portfolio-cap-panel">

            <div class="portfolio-cap-heading">
                <h3>Graduation Cap Settings</h3>
                <button class="portfolio-cap-close">×</button>
            </div>

            <div class="portfolio-cap-control">
                <label>
                    <span>Cap size</span>
                    <output id="cap-size-value"></output>
                </label>
                <input id="cap-size" type="range"
                    min="30" max="150" value="${settings.size}">
            </div>

            <div class="portfolio-cap-control">
                <label>
                    <span>Horizontal position</span>
                    <output id="cap-x-value"></output>
                </label>
                <input id="cap-x" type="range"
                    min="-100" max="100" value="${settings.x}">
            </div>

            <div class="portfolio-cap-control">
                <label>
                    <span>Vertical position</span>
                    <output id="cap-y-value"></output>
                </label>
                <input id="cap-y" type="range"
                    min="-120" max="80" value="${settings.y}">
            </div>

            <div class="portfolio-cap-control">
                <label>
                    <span>Cap tilt</span>
                    <output id="cap-tilt-value"></output>
                </label>
                <input id="cap-tilt" type="range"
                    min="-40" max="40" value="${settings.tilt}">
            </div>

            <div class="portfolio-cap-control">
                <label>
                    <span>Horizontal rotation</span>
                    <output id="cap-rotation-value"></output>
                </label>
                <input id="cap-rotation" type="range"
                    min="-90" max="90" value="0">
            </div>

            <label style="font-size:12px;display:flex;gap:8px;align-items:center;">
                <input id="cap-visible" type="checkbox"
                    ${settings.visible ? "checked" : ""}>
                Show graduation cap
            </label>

            <p style="font-size:12px;color:#d1d5db;margin:15px 0 5px;">
                Academic colour themes
            </p>

            <div class="portfolio-cap-themes">
                <button class="portfolio-cap-swatch active"
                    data-theme="classic" title="Classic Black & Gold"
                    style="background:linear-gradient(135deg,#17191f 55%,#eab308 55%)"></button>

                <button class="portfolio-cap-swatch"
                    data-theme="navy" title="Royal Navy & Silver"
                    style="background:linear-gradient(135deg,#172554 55%,#e2e8f0 55%)"></button>

                <button class="portfolio-cap-swatch"
                    data-theme="maroon" title="Crimson Maroon & Gold"
                    style="background:linear-gradient(135deg,#5e1224 55%,#f59e0b 55%)"></button>

                <button class="portfolio-cap-swatch"
                    data-theme="emerald" title="Emerald Green & Gold"
                    style="background:linear-gradient(135deg,#064e3b 55%,#fbbf24 55%)"></button>

                <button class="portfolio-cap-swatch"
                    data-theme="ivory" title="Ivory & Gold"
                    style="background:linear-gradient(135deg,#ece6d8 55%,#d97706 55%)"></button>
            </div>

            <div class="portfolio-cap-actions">
                <button id="cap-tassel">Turn Tassel</button>
                <button id="cap-wind">Wind Gust</button>
                <button id="cap-auto">Auto-Rotate</button>
                <button id="cap-reset">Reset</button>
            </div>

            <p class="portfolio-cap-hint">
                Drag the cap to rotate it. Your settings are
                saved automatically on this device.
            </p>

        </section>

        <button class="portfolio-cap-gear"
            aria-label="Graduation cap settings"
            title="Graduation cap settings">⚙</button>
    `;

    document.body.appendChild(ui);

    const panel = ui.querySelector(".portfolio-cap-panel");
    const gear = ui.querySelector(".portfolio-cap-gear");

    gear.addEventListener("click", () => {
        panel.classList.toggle("open");
    });

    ui.querySelector(".portfolio-cap-close").addEventListener("click", () => {
        panel.classList.remove("open");
    });

    document.addEventListener("pointerdown", event => {
        if (!ui.contains(event.target)) {
            panel.classList.remove("open");
        }
    });

    // =====================================================
    // 3. THREE.JS RENDERER
    // =====================================================

    let renderer;

    try {
        renderer = new THREE.WebGLRenderer({
            canvas,
            alpha: true,
            antialias: true,
            powerPreference: "high-performance"
        });
    } catch (error) {
        console.error("Graduation cap WebGL error:", error);
        return;
    }

    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.setClearColor(0x000000, 0);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;

    const scene = new THREE.Scene();

    const camera = new THREE.OrthographicCamera(
        -window.innerWidth / 2,
        window.innerWidth / 2,
        window.innerHeight / 2,
        -window.innerHeight / 2,
        0.1,
        2000
    );

    camera.position.set(0, 0, 1000);
    camera.lookAt(0, 0, 0);

    // =====================================================
    // 4. STUDIO LIGHTING
    // =====================================================

    scene.add(new THREE.AmbientLight(0xffffff, 1.45));

    const keyLight = new THREE.DirectionalLight(0xfff6e5, 2.5);
    keyLight.position.set(3, 7, 10);
    scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight(0xc2d8ff, 1.0);
    fillLight.position.set(-5, 2, 8);
    scene.add(fillLight);

    const rimLight = new THREE.DirectionalLight(0xffe1b0, 1.1);
    rimLight.position.set(0, 3, -5);
    scene.add(rimLight);

    // =====================================================
    // 5. MATERIALS
    // =====================================================

    const fabricMaterial = new THREE.MeshStandardMaterial({
        color: THEMES.classic.fabric,
        roughness: 0.84,
        metalness: 0.04
    });

    const pipingMaterial = new THREE.MeshStandardMaterial({
        color: THEMES.classic.piping,
        roughness: 0.72,
        metalness: 0.08
    });

    const liningMaterial = new THREE.MeshStandardMaterial({
        color: THEMES.classic.lining,
        roughness: 0.92,
        side: THREE.DoubleSide
    });

    const tasselMaterial = new THREE.MeshStandardMaterial({
        color: THEMES.classic.tassel,
        roughness: 0.30,
        metalness: 0.4
    });

    const tasselDarkMaterial = new THREE.MeshStandardMaterial({
        color: THEMES.classic.tasselDark,
        roughness: 0.36,
        metalness: 0.38
    });

    const bandMaterial = new THREE.MeshStandardMaterial({
        color: THEMES.classic.band,
        roughness: 0.32,
        metalness: 0.36
    });

    // =====================================================
    // 6. CAP ROOT AND POSITION
    // =====================================================

    const capRoot = new THREE.Group();
    scene.add(capRoot);

    const capModel = new THREE.Group();
    capRoot.add(capModel);

    let autoRotate = settings.autoRotate;
    let userRotation = 0;
    let tiltRotation = settings.tilt * Math.PI / 180;

    // Reference-style cap proportions.
    const BOARD_HALF = 1.0;
    const BOARD_TOP_Y = 0.08;
    const BOARD_THICKNESS = 0.068;
    const SKULL_BOTTOM_Y = -0.58;

    // =====================================================
    // 7. SQUARE MORTARBOARD
    // =====================================================

    const boardShape = new THREE.Shape();

    const bevel = 0.024;
    const s = BOARD_HALF - bevel;
    const corner = 0.028;

    boardShape.moveTo(-s + corner, -s);
    boardShape.lineTo(s - corner, -s);
    boardShape.quadraticCurveTo(s, -s, s, -s + corner);
    boardShape.lineTo(s, s - corner);
    boardShape.quadraticCurveTo(s, s, s - corner, s);
    boardShape.lineTo(-s + corner, s);
    boardShape.quadraticCurveTo(-s, s, -s, s - corner);
    boardShape.lineTo(-s, -s + corner);
    boardShape.quadraticCurveTo(-s, -s, -s + corner, -s);

    const boardGeometry = new THREE.ExtrudeGeometry(boardShape, {
        depth: BOARD_THICKNESS - bevel * 2,
        bevelEnabled: true,
        bevelSegments: 4,
        steps: 1,
        bevelSize: bevel,
        bevelThickness: bevel
    });

    boardGeometry.rotateX(Math.PI / 2);
    boardGeometry.computeBoundingBox();

    boardGeometry.translate(
        0,
        BOARD_TOP_Y - boardGeometry.boundingBox.max.y,
        0
    );

    const board = new THREE.Mesh(
        boardGeometry,
        fabricMaterial
    );

    capModel.add(board);

    // =====================================================
    // 8. EDGE PIPING
    // =====================================================


    // =====================================================
    // 9. SCULPTED SKULLCAP
    // =====================================================

    const skullGeometry = new THREE.CylinderGeometry(
        0.56,
        0.62,
        0.035 - SKULL_BOTTOM_Y,
        64,
        24,
        true
    );

    const positions = skullGeometry.attributes.position;

    for (let i = 0; i < positions.count; i++) {
        const x = positions.getX(i);
        const y = positions.getY(i);
        const z = positions.getZ(i);

        const t =
            (y + (0.035 - SKULL_BOTTOM_Y) * 0.5) /
            (0.035 - SKULL_BOTTOM_Y);

        const angle = Math.atan2(z, x);

        const taper = 1.0 - Math.pow(t, 2.3) * 0.14;

        const dip =
            -Math.pow(1.0 - t, 1.8) *
            0.045 *
            Math.cos(angle - Math.PI * 0.25);

        positions.setX(i, x * 0.96 * taper);
        positions.setZ(i, z * 1.05 * taper);

        positions.setY(
            i,
            SKULL_BOTTOM_Y +
            t * (0.035 - SKULL_BOTTOM_Y) +
            dip
        );
    }

    skullGeometry.computeVertexNormals();

    const skull = new THREE.Mesh(
        skullGeometry,
        fabricMaterial
    );

    capModel.add(skull);

    const innerSkull = new THREE.Mesh(
        skullGeometry,
        liningMaterial
    );

    innerSkull.scale.set(0.985, 0.995, 0.985);
    capModel.add(innerSkull);

    // =====================================================
    // 10. SKULLCAP BOTTOM SEAM
    // =====================================================

   

    // =====================================================
    // 11. GOLDEN CENTRE BUTTON
    // =====================================================

    const buttonGroup = new THREE.Group();

    buttonGroup.position.set(0, BOARD_TOP_Y, 0);

    const buttonGeometry = new THREE.SphereGeometry(
        0.062,
        32,
        18
    );

    buttonGeometry.scale(1, 0.34, 1);

    const button = new THREE.Mesh(
        buttonGeometry,
        tasselMaterial
    );

    button.position.y = 0.008;
    buttonGroup.add(button);

    const buttonRing = new THREE.Mesh(
        new THREE.TorusGeometry(0.060, 0.011, 14, 32),
        tasselDarkMaterial
    );

    buttonRing.rotation.x = Math.PI / 2;
    buttonRing.position.y = 0.010;

    buttonGroup.add(buttonRing);
    capModel.add(buttonGroup);

    // =====================================================
    // 12. BRAIDED GOLDEN CORD
    // =====================================================

    const cordGroup = new THREE.Group();
    capModel.add(cordGroup);

    const cordPoints = [
        new THREE.Vector3(0, BOARD_TOP_Y + 0.025, 0),
        new THREE.Vector3(-0.35, BOARD_TOP_Y + 0.025, -0.20),
        new THREE.Vector3(-0.72, BOARD_TOP_Y + 0.025, -0.42),
        new THREE.Vector3(-1.02, BOARD_TOP_Y + 0.025, -0.65),
        new THREE.Vector3(-1.02, BOARD_TOP_Y + 0.025, -0.90),
        new THREE.Vector3(-1.02, BOARD_TOP_Y + 0.025, -1.02)
    ];

    const cordCurve = new THREE.CatmullRomCurve3(cordPoints);

    const cord = new THREE.Mesh(
        new THREE.TubeGeometry(cordCurve, 100, 0.022, 12, false),
        tasselMaterial
    );

    cordGroup.add(cord);

    // =====================================================
    // 13. TASSEl ATTACHMENT AND KNOT
    // =====================================================

    const tasselRoot = new THREE.Group();

    tasselRoot.position.set(
        -1.02,
        BOARD_TOP_Y + 0.025,
        -1.02
    );

    capModel.add(tasselRoot);

    const knot = new THREE.Mesh(
        new THREE.SphereGeometry(0.055, 24, 18),
        tasselMaterial
    );

    tasselRoot.add(knot);

    const collar = new THREE.Mesh(
        new THREE.CylinderGeometry(0.047, 0.05, 0.028, 24),
        bandMaterial
    );

    collar.position.y = -0.07;
    tasselRoot.add(collar);

    // =====================================================
    // 14. INDIVIDUAL TASSEl THREADS
    // =====================================================

    const STRAND_COUNT = 60;
    const STRAND_NODES = 6;
    const STRAND_LENGTH = 0.56;
    const STRAND_SEGMENT = STRAND_LENGTH / (STRAND_NODES - 1);

    const strandPositions = [];
    const strandOldPositions = [];
    const strandRoots = [];
    const strandTargets = [];

    const strandGeometry = new THREE.BufferGeometry();

    const totalVertices =
        STRAND_COUNT * (STRAND_NODES - 1) * 2;

    const linePositions = new Float32Array(totalVertices * 3);
    const lineColors = new Float32Array(totalVertices * 3);

    strandGeometry.setAttribute(
        "position",
        new THREE.BufferAttribute(linePositions, 3)
    );

    strandGeometry.setAttribute(
        "color",
        new THREE.BufferAttribute(lineColors, 3)
    );

    const strandMaterial = new THREE.LineBasicMaterial({
        vertexColors: true,
        transparent: true,
        opacity: 0.98
    });

    const strandLines = new THREE.LineSegments(
        strandGeometry,
        strandMaterial
    );

    strandLines.frustumCulled = false;
    capModel.add(strandLines);

    function initializeStrands() {
        strandPositions.length = 0;
        strandOldPositions.length = 0;
        strandRoots.length = 0;
        strandTargets.length = 0;

        for (let i = 0; i < STRAND_COUNT; i++) {
            const angle = i / STRAND_COUNT * Math.PI * 2;

            const radius =
                i < 12 ? 0.015 :
                i < 32 ? 0.028 :
                0.041;

            const x = Math.cos(angle) * radius;
            const z = Math.sin(angle) * radius;

            strandRoots.push(new THREE.Vector3(x, -0.08, z));

            strandTargets.push(
                new THREE.Vector3(x * 2.6, -0.08, z * 2.6)
            );

            const nodes = [];
            const oldNodes = [];

            for (let n = 0; n < STRAND_NODES; n++) {
                const point = new THREE.Vector3(
                    x,
                    -n * STRAND_SEGMENT,
                    z
                );

                nodes.push(point.clone());
                oldNodes.push(point.clone());
            }

            strandPositions.push(nodes);
            strandOldPositions.push(oldNodes);
        }

        updateStrandColors();
    }

    function updateStrandColors() {
        const base = new THREE.Color(tasselMaterial.color);
        const dark = new THREE.Color(tasselDarkMaterial.color);

        let ptr = 0;

        for (let s = 0; s < STRAND_COUNT; s++) {
            for (let n = 0; n < STRAND_NODES - 1; n++) {
                const t0 = n / (STRAND_NODES - 1);
                const t1 = (n + 1) / (STRAND_NODES - 1);

                const c0 = dark.clone().lerp(base, t0);
                const c1 = dark.clone().lerp(base, t1);

                lineColors[ptr++] = c0.r;
                lineColors[ptr++] = c0.g;
                lineColors[ptr++] = c0.b;

                lineColors[ptr++] = c1.r;
                lineColors[ptr++] = c1.g;
                lineColors[ptr++] = c1.b;
            }
        }

        strandGeometry.attributes.color.needsUpdate = true;
    }

    initializeStrands();

    // =====================================================
    // 15. TASSEl PHYSICS
    // =====================================================

    let windImpulse = new THREE.Vector3();
    let tasselSide = -1;
    let targetSide = -1;
    let sideTransition = 1;

    const gravity = new THREE.Vector3(0, -12, 0);

    function updateTassel(dt, elapsed) {
        const windX = Math.sin(elapsed * 1.5) * 0.3;
        const windZ = Math.cos(elapsed * 1.3) * 0.3;

        windImpulse.multiplyScalar(Math.pow(0.08, dt));

        const root = new THREE.Vector3(
            -1.02,
            BOARD_TOP_Y - 0.06,
            -1.02
        );

        for (let s = 0; s < STRAND_COUNT; s++) {
            const nodes = strandPositions[s];
            const oldNodes = strandOldPositions[s];

            nodes[0].copy(root).add(strandRoots[s]);
            oldNodes[0].copy(nodes[0]);

            const target = strandTargets[s];

            for (let n = 1; n < STRAND_NODES; n++) {
                const p = nodes[n];
                const old = oldNodes[n];

                const vx = (p.x - old.x) * 0.965;
                const vy = (p.y - old.y) * 0.965;
                const vz = (p.z - old.z) * 0.965;

                old.copy(p);

                const t = n / (STRAND_NODES - 1);

                const flutter =
                    Math.sin(elapsed * 3 + s * 0.7 + n) * 0.10;

                p.x += vx +
                    (windX + windImpulse.x + target.x * 0.1 + flutter) *
                    dt * dt * 12;

                p.y += vy +
                    gravity.y * dt * dt;

                p.z += vz +
                    (windZ + windImpulse.z + target.z * 0.1 - flutter) *
                    dt * dt * 12;
            }

            // Keep the strands connected.
            for (let iteration = 0; iteration < 3; iteration++) {
                for (let n = 0; n < STRAND_NODES - 1; n++) {
                    const a = nodes[n];
                    const b = nodes[n + 1];

                    const direction = new THREE.Vector3().subVectors(b, a);
                    const distance = direction.length();

                    if (distance > 0.0001) {
                        const difference =
                            (distance - STRAND_SEGMENT) / distance;

                        if (n === 0) {
                            b.addScaledVector(direction, -difference);
                        } else {
                            a.addScaledVector(direction, difference * 0.5);
                            b.addScaledVector(direction, -difference * 0.5);
                        }
                    }
                }
            }
        }

        // Update line geometry.
        const array = strandGeometry.attributes.position.array;
        let ptr = 0;

        for (const nodes of strandPositions) {
            for (let n = 0; n < STRAND_NODES - 1; n++) {
                const a = nodes[n];
                const b = nodes[n + 1];

                array[ptr++] = a.x;
                array[ptr++] = a.y;
                array[ptr++] = a.z;

                array[ptr++] = b.x;
                array[ptr++] = b.y;
                array[ptr++] = b.z;
            }
        }

        strandGeometry.attributes.position.needsUpdate = true;
    }

    // =====================================================
    // 16. APPLY COLOUR THEME
    // =====================================================

    function applyTheme(key) {
        const theme = THEMES[key];

        if (!theme) return;

        settings.theme = key;

        fabricMaterial.color.setHex(theme.fabric);
        liningMaterial.color.setHex(theme.lining);
        pipingMaterial.color.setHex(theme.piping);
        tasselMaterial.color.setHex(theme.tassel);
        tasselDarkMaterial.color.setHex(theme.tasselDark);
        bandMaterial.color.setHex(theme.band);

        updateStrandColors();

        ui.querySelectorAll(".portfolio-cap-swatch").forEach(button => {
            button.classList.toggle(
                "active",
                button.dataset.theme === key
            );
        });

        saveSettings();
    }

    ui.querySelectorAll(".portfolio-cap-swatch").forEach(button => {
        button.addEventListener("click", () => {
            applyTheme(button.dataset.theme);
        });
    });

    applyTheme(settings.theme);

    // =====================================================
    // 17. POSITION ABOVE PORTRAIT
    // =====================================================

    function updateCapPosition() {
        const rect = portrait.getBoundingClientRect();

        if (!rect.width || !rect.height) return;

        const centerX =
            rect.left + rect.width * 0.5 + Number(settings.x);

        const centerY =
            rect.top + rect.height * 0.05 + Number(settings.y);

        capRoot.position.set(
            centerX - window.innerWidth / 2,
            window.innerHeight / 2 - centerY,
            0
        );

        const scale =
            rect.width * 0.90 *
            (Number(settings.size) / 100) / 2;

        capRoot.scale.setScalar(scale);

        capRoot.visible = !!settings.visible;
    }

    // =====================================================
    // 18. SETTINGS SLIDERS
    // =====================================================

    function connectSlider(id, key, output, suffix = "") {
        const input = document.getElementById(id);
        const display = document.getElementById(output);

        input.addEventListener("input", () => {
            settings[key] = Number(input.value);

            display.textContent = input.value + suffix;

            applySettings();
        });

        display.textContent = input.value + suffix;
    }

    function applySettings() {
        tiltRotation = settings.tilt * Math.PI / 180;

        updateCapPosition();
        saveSettings();
    }

    connectSlider("cap-size", "size", "cap-size-value", "%");
    connectSlider("cap-x", "x", "cap-x-value", "px");
    connectSlider("cap-y", "y", "cap-y-value", "px");
    connectSlider("cap-tilt", "tilt", "cap-tilt-value", "°");

    document.getElementById("cap-rotation").addEventListener("input", event => {
        userRotation = Number(event.target.value) * Math.PI / 180;

        document.getElementById("cap-rotation-value").textContent =
            event.target.value + "°";

        saveSettings();
    });

    document.getElementById("cap-visible").addEventListener("change", event => {
        settings.visible = event.target.checked;

        updateCapPosition();
        saveSettings();
    });

    // =====================================================
    // 19. TASSEl CONTROLS
    // =====================================================

    document.getElementById("cap-tassel").addEventListener("click", () => {
        targetSide *= -1;
        sideTransition = 0;

        windImpulse.y += 2.2;
    });

    document.getElementById("cap-wind").addEventListener("click", () => {
        windImpulse.set(
            (Math.random() - 0.35) * 8,
            1.4,
            (Math.random() - 0.35) * 8
        );
    });

    document.getElementById("cap-auto").addEventListener("click", event => {
        autoRotate = !autoRotate;
        settings.autoRotate = autoRotate;

        event.currentTarget.style.background =
            autoRotate ? "rgba(16,185,129,.45)" : "";

        saveSettings();
    });

    // =====================================================
    // 20. RESET
    // =====================================================

    document.getElementById("cap-reset").addEventListener("click", () => {
        settings = { ...DEFAULT_SETTINGS };

        autoRotate = false;
        userRotation = 0;

        document.getElementById("cap-size").value = settings.size;
        document.getElementById("cap-x").value = settings.x;
        document.getElementById("cap-y").value = settings.y;
        document.getElementById("cap-tilt").value = settings.tilt;
        document.getElementById("cap-rotation").value = 0;

        document.getElementById("cap-size-value").textContent =
            settings.size + "%";

        document.getElementById("cap-x-value").textContent =
            settings.x + "px";

        document.getElementById("cap-y-value").textContent =
            settings.y + "px";

        document.getElementById("cap-tilt-value").textContent =
            settings.tilt + "°";

        document.getElementById("cap-rotation-value").textContent = "0°";

        document.getElementById("cap-visible").checked = true;

        applyTheme("classic");
        applySettings();

        document.getElementById("cap-auto").style.background = "";
    });

    // =====================================================
    // 21. DRAG ROTATION
    // =====================================================

    let dragging = false;
    let lastX = 0;
    let lastY = 0;

    function pointerHitsCap(event) {
        const rect = portrait.getBoundingClientRect();

        const centerX =
            rect.left + rect.width / 2 + Number(settings.x);

        const centerY =
            rect.top + rect.height * 0.05 + Number(settings.y);

        const width = rect.width * 1.15 *
            (Number(settings.size) / 100);

        const height = rect.width * 0.8 *
            (Number(settings.size) / 100);

        return (
            Math.abs(event.clientX - centerX) < width / 2 &&
            Math.abs(event.clientY - centerY) < height / 2
        );
    }

    window.addEventListener("pointerdown", event => {
        if (!settings.visible) return;
        if (ui.contains(event.target)) return;
        if (!pointerHitsCap(event)) return;

        dragging = true;

        lastX = event.clientX;
        lastY = event.clientY;
    });

    window.addEventListener("pointermove", event => {
        if (!dragging) return;

        const dx = event.clientX - lastX;
        const dy = event.clientY - lastY;

        userRotation += dx * 0.008;

        tiltRotation += dy * 0.006;

        settings.tilt = THREE.MathUtils.clamp(
            tiltRotation * 180 / Math.PI,
            -40,
            40
        );

        lastX = event.clientX;
        lastY = event.clientY;

        document.getElementById("cap-tilt").value = settings.tilt;

        document.getElementById("cap-tilt-value").textContent =
            Math.round(settings.tilt) + "°";

        saveSettings();
    });

    window.addEventListener("pointerup", () => {
        dragging = false;
    });

    window.addEventListener("pointercancel", () => {
        dragging = false;
    });

    // =====================================================
    // 22. RESIZE
    // =====================================================

    function resize() {
        const width = window.innerWidth;
        const height = window.innerHeight;

        renderer.setSize(width, height, false);

        camera.left = -width / 2;
        camera.right = width / 2;
        camera.top = height / 2;
        camera.bottom = -height / 2;

        camera.updateProjectionMatrix();

        updateCapPosition();
    }

    window.addEventListener("resize", resize);

    window.addEventListener("scroll", updateCapPosition, {
        passive: true
    });

    if ("ResizeObserver" in window) {
        const observer = new ResizeObserver(updateCapPosition);
        observer.observe(portrait);
    }

    // =====================================================
    // 23. MAIN ANIMATION
    // =====================================================

    const clock = new THREE.Clock();

    function animate() {
        requestAnimationFrame(animate);

        const dt = Math.min(clock.getDelta(), 0.033);
        const elapsed = clock.getElapsedTime();

        if (autoRotate && !dragging) {
            userRotation += dt * 0.35;
        }

        // Smooth tassel-side transition.
        if (sideTransition < 1) {
            sideTransition = Math.min(
                1,
                sideTransition + dt * 2.4
            );
        }

        const ease = sideTransition < 0.5
            ? 4 * sideTransition ** 3
            : 1 - Math.pow(-2 * sideTransition + 2, 3) / 2;

        tasselSide = THREE.MathUtils.lerp(
            -targetSide,
            targetSide,
            ease
        );

        // Smooth random graduation cap movement
const randomX = Math.sin(elapsed * 0.7) * 0.035;
const randomY = Math.sin(elapsed * 0.45) * 0.025;
const randomTilt = Math.sin(elapsed * 0.55) * 0.025;

capModel.rotation.set(
    tiltRotation + randomX,
    userRotation + randomY,
    randomTilt
);

        updateTassel(dt, elapsed);

        renderer.render(scene, camera);
    }

    // =====================================================
    // 24. INITIALIZE
    // =====================================================

    resize();
    applySettings();
    animate();

    console.log("Portfolio 3D graduation cap initialized.");

})();