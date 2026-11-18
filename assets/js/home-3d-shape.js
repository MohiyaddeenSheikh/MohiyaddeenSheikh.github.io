import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js";

/*
 * Graduation-cap geometry module.
 * This file owns the 3D shape, materials, and tassel strand simulation.
 */
export function createGraduationCap(scene, THEMES) {
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
    // 13. TASSEL ATTACHMENT AND KNOT
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
    // 14. INDIVIDUAL TASSEL THREADS
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
    // 15. TASSEL PHYSICS
    // =====================================================

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
    // 16. TASSEL MOVEMENT STATE
    // =====================================================

    let windImpulse = new THREE.Vector3();
    let targetSide = -1;
    let sideTransition = 1;

    // =====================================================
    // 17. CHANGE TASSEL SIDE
    // =====================================================

    function toggleTasselSide() {
        targetSide *= -1;
        sideTransition = 0;
        windImpulse.y += 2.2;
    }

    // =====================================================
    // 18. WIND EFFECT
    // =====================================================

    function triggerWind() {
        windImpulse.set(
            (Math.random() - 0.35) * 8,
            1.4,
            (Math.random() - 0.35) * 8
        );
    }

    // =====================================================
    // 19. ANIMATE TASSEL
    // =====================================================

    function animateTassel(dt, elapsed) {
        if (sideTransition < 1) {
            sideTransition = Math.min(
                1,
                sideTransition + dt * 2.4
            );
        }

        updateTassel(dt, elapsed);
    }

    // =====================================================
    // 20. RETURN SHAPE AND CONTROLS
    // =====================================================

    return {
        capRoot,
        capModel,

        materials: {
            fabricMaterial,
            pipingMaterial,
            liningMaterial,
            tasselMaterial,
            tasselDarkMaterial,
            bandMaterial
        },

        updateStrandColors,
        animateTassel,
        toggleTasselSide,
        triggerWind
    };
}