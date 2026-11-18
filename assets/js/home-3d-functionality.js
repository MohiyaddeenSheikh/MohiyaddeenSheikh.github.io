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
- Straight / Random movement modes
===========================================================
*/

import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js";
import { createGraduationCap } from "./home-3d-shape.js";

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
    y: -21,
    tilt: 4,
    visible: true,
    theme: "classic",
    autoRotate: false,
    movementMode: "random"
};

let settings = { ...DEFAULT_SETTINGS };

try {
    const saved = JSON.parse(
        localStorage.getItem("portfolio-cap-settings")
    );

    if (saved && typeof saved === "object") {
        settings = { ...DEFAULT_SETTINGS, ...saved };

        // Migrate old 100% default to 42%.
        if (Number(saved.size) === 100) {
            settings.size = 42;
        }

        localStorage.setItem(
            "portfolio-cap-settings",
            JSON.stringify(settings)
        );
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

        .portfolio-cap-movement {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 8px;
            margin-bottom: 15px;
        }

        .portfolio-cap-movement button {
            padding: 9px;
            border-radius: 9px;
            border: 1px solid rgba(255,255,255,.18);
            background: rgba(255,255,255,.08);
            color: #d1d5db;
            font-size: 12px;
        }

        .portfolio-cap-movement button.active {
            background: rgba(234,179,8,.25);
            border-color: #eab308;
            color: #fff;
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
                    min="35" max="150" value="${settings.size}">
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

            <p style="font-size:12px;color:#d1d5db;margin:15px 0 8px;">
                Cap Movement
            </p>

            <div class="portfolio-cap-movement">
                <button id="cap-move-straight"
                    type="button">
                    Straight
                </button>

                <button id="cap-move-random"
                    type="button">
                    Random
                </button>
            </div>

            <p style="font-size:12px;color:#d1d5db;margin:15px 0 5px;">
                Academic colour themes
            </p>

            <div class="portfolio-cap-themes">
                <button class="portfolio-cap-swatch active"
                    data-theme="classic" title="Classic Black & Gold"
                    style="background:linear-gradient(135deg,#17191f 35%,#eab308 35%)"></button>

                <button class="portfolio-cap-swatch"
                    data-theme="navy" title="Royal Navy & Silver"
                    style="background:linear-gradient(135deg,#172554 35%,#e2e8f0 35%)"></button>

                <button class="portfolio-cap-swatch"
                    data-theme="maroon" title="Crimson Maroon & Gold"
                    style="background:linear-gradient(135deg,#5e1224 35%,#f59e0b 35%)"></button>

                <button class="portfolio-cap-swatch"
                    data-theme="emerald" title="Emerald Green & Gold"
                    style="background:linear-gradient(135deg,#064e3b 35%,#fbbf24 35%)"></button>

                <button class="portfolio-cap-swatch"
                    data-theme="ivory" title="Ivory & Gold"
                    style="background:linear-gradient(135deg,#ece6d8 35%,#d97706 35%)"></button>
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
    // 5. BUILD THE 3D SHAPE
    // =====================================================

    const capShape = createGraduationCap(scene, THEMES);
    const { capRoot, capModel } = capShape;

    const {
        fabricMaterial,
        pipingMaterial,
        liningMaterial,
        tasselMaterial,
        tasselDarkMaterial,
        bandMaterial
    } = capShape.materials;

    let autoRotate = settings.autoRotate;
    let userRotation = 0;
    let tiltRotation = settings.tilt * Math.PI / 180;
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

        capShape.updateStrandColors();

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
    // 17. SCROLL-DRIVEN CAP MOVEMENT
    // =====================================================

// =====================================================
// 17. SCROLL-DRIVEN CAP MOVEMENT
// =====================================================

function updateCapPosition() {

    const rect = portrait.getBoundingClientRect();

    if (!rect.width || !rect.height) return;

    const startX =
        rect.left + rect.width * 0.5 + Number(settings.x);

    const startY =
        rect.top + rect.height * 0.05 + Number(settings.y);

    const startDocumentY = startY + window.scrollY;

    const startScale =
        rect.width * 0.90 *
        (Number(settings.size) / 100) / 2;

    const capHalfHeight = startScale * 0.72;
    const gap = 20;

    const viewportHeight = window.innerHeight;

    // Find all section headings
    const headings = Array.from(
    document.querySelectorAll(
        ".section[id] .section__title, .footer .footer__title"
    )
).filter(el => {
    const r = el.getBoundingClientRect();
    return r.width > 0 && r.height-10 > 0;
});

    // Store heading positions in document coordinates
    const destinations = headings.map(el => {

        const r = el.getBoundingClientRect();

        return {
            x: r.left + r.width * 0.5,

            headingY: r.top + window.scrollY,

            y: r.top + window.scrollY -
                capHalfHeight - gap
        };
    });

    let centerX = startX;
    let centerY = startDocumentY - window.scrollY;

    const scroll = window.scrollY;

    if (destinations.length > 0) {

        const first = destinations[0];

        // Title starts entering from the bottom
        const firstMoveStart = Math.max(
            0,
            first.headingY - viewportHeight
        );

        // Cap arrives when title reaches 78% screen height
        const firstArrival = Math.max(
            firstMoveStart + 1,
            first.headingY - viewportHeight * 0.78
        );

        if (scroll < firstMoveStart) {

            // Keep original portrait positioning
            centerX = startX;

            centerY = startDocumentY - scroll;

        } else if (scroll < firstArrival) {

            // Initial movement: portrait to first heading
            let progress = THREE.MathUtils.clamp(
                (scroll - firstMoveStart) /
                (firstArrival - firstMoveStart),
                0,
                1
            );

            progress = progress * progress * (3 - 2 * progress);

            centerX = THREE.MathUtils.lerp(
                startX,
                first.x,
                progress
            );

            const movingY = THREE.MathUtils.lerp(
                startDocumentY,
                first.y,
                progress
            );

            centerY = movingY - scroll;

        } else {

            // Cap has reached the first heading.
            // Keep it attached to that heading until its top
            // edge reaches the top of the viewport.

            let current = first;

            centerX = current.x;
            centerY = current.y - scroll;

            // Process every following heading
            for (let i = 1; i < destinations.length; i++) {

                const next = destinations[i];

                // Start moving only when current cap
                // touches the top edge of the viewport.
                const transitionStart =
                    current.headingY -
                    (capHalfHeight * 2) -
                    gap;

                // New title starts entering from the bottom
                const nextArrivalTarget =
                    next.headingY - viewportHeight * 0.78;

                // Ensure transition always has a valid duration
                const transitionEnd = Math.max(
                    transitionStart + 1,
                    nextArrivalTarget
                );

                if (scroll < transitionStart) {
                    break;
                }

                if (scroll < transitionEnd) {

                    let progress = THREE.MathUtils.clamp(
                        (scroll - transitionStart) /
                        (transitionEnd - transitionStart),
                        0,
                        1
                    );

                    // Smooth acceleration and deceleration
                    progress =
                        progress * progress * (3 - 2 * progress);

                    if (settings.movementMode === "random") {

                        // Deterministic curved movement
                        // Same path in reverse scrolling

                        const seed = Math.sin(
                            i * 127.1
                        ) * 43758.5453;

                        const random =
                            seed - Math.floor(seed);

                        const direction = i % 2 === 1 ? 1 : -1;

                        const bend = 140 + random * 120;

                        const dx = next.x - current.x;
                        const dy = next.y - current.y;

                        const distance =
                            Math.sqrt(dx * dx + dy * dy) || 1;

                        const perpendicularX = -dy / distance;
                        const perpendicularY = dx / distance;

                        const control1X =
                            current.x +
                            dx * 0.33 +
                            perpendicularX * bend * direction;

                        const control1Y =
                            current.y +
                            dy * 0.33 +
                            perpendicularY * bend * direction;

                        const control2X =
                            current.x +
                            dx * 0.66 +
                            perpendicularX * bend * direction;

                        const control2Y =
                            current.y +
                            dy * 0.66 +
                            perpendicularY * bend * direction;

                        const inverse = 1 - progress;

                        const movingX =
                            inverse * inverse * inverse * current.x +
                            3 * inverse * inverse * progress * control1X +
                            3 * inverse * progress * progress * control2X +
                            progress * progress * progress * next.x;

                        const movingY =
                            inverse * inverse * inverse * current.y +
                            3 * inverse * inverse * progress * control1Y +
                            3 * inverse * progress * progress * control2Y +
                            progress * progress * progress * next.y;

                        centerX = movingX;
                        centerY = movingY - scroll;

                    } else {

                        // Straight movement
                        centerX = THREE.MathUtils.lerp(
                            current.x,
                            next.x,
                            progress
                        );

                        const movingY = THREE.MathUtils.lerp(
                            current.y,
                            next.y,
                            progress
                        );

                        centerY = movingY - scroll;
                    }

                    break;

                } else {

                    // Reached next heading.
                    // Lock cap above it until it touches the top.

                    current = next;

                    centerX = current.x;
                    centerY = current.y - scroll;
                }
            }
        }
    }

    capRoot.position.set(
        centerX - window.innerWidth / 2,
        window.innerHeight / 2 - centerY,
        0
    );

    // Preserve original cap size
    capRoot.scale.setScalar(startScale);

    capRoot.visible = !!settings.visible;
}

    // =====================================================
    // MOVEMENT MODE BUTTONS
    // =====================================================

    const straightButton =
        document.getElementById("cap-move-straight");

    const randomButton =
        document.getElementById("cap-move-random");

    function updateMovementButtons() {
        straightButton.classList.toggle(
            "active",
            settings.movementMode === "straight"
        );

        randomButton.classList.toggle(
            "active",
            settings.movementMode === "random"
        );
    }

    straightButton.addEventListener("click", () => {
        settings.movementMode = "straight";

        updateMovementButtons();
        updateCapPosition();
        saveSettings();
    });

    randomButton.addEventListener("click", () => {
        settings.movementMode = "random";

        updateMovementButtons();
        updateCapPosition();
        saveSettings();
    });

    updateMovementButtons();

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
    // 19. TASSEL CONTROLS
    // =====================================================

    document.getElementById("cap-tassel").addEventListener("click", () => {
        capShape.toggleTasselSide();
    });

    document.getElementById("cap-wind").addEventListener("click", () => {
        capShape.triggerWind();
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

        // Reset movement mode
        settings.movementMode = "straight";
        updateMovementButtons();

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

        capModel.rotation.set(
            tiltRotation,
            userRotation,
            0
        );

        updateCapPosition();

        capShape.animateTassel(dt, elapsed);

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