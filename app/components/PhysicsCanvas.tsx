'use client';

import { useEffect, useRef } from 'react';
import Matter from 'matter-js';
import type P5 from 'p5';
import ColoredPill from './ColoredPill';

const DRAG_RADIUS = 50;
const WALL_THICKNESS = 80;

/**
 * Absolutely-positioned p5 canvas that overlays its parent. On mount, it:
 *
 *  1. spins up a Matter.js engine + world with gravity
 *  2. builds static walls around the parent's bounds (ground/ceiling/sides)
 *  3. reads every `.physics-pill` node inside the parent for its data-*
 *     attributes and creates a matching Matter.js body for each one
 *  4. each frame, steps the physics engine and redraws every pill at its
 *     new position/angle
 *  5. lets the user grab and throw pills with the mouse
 *
 * Render this as a sibling of your <Pill /> elements, inside a
 * `position: relative` parent — see app/pill-physics/page.tsx for a
 * working example.
 */
export default function PhysicsCanvas() {
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        let p5Instance: P5 | null = null;
        let cancelled = false;

        (async () => {
            // p5 reaches for `window` as soon as its module body runs, so it can
            // only be imported once we're safely on the client — inside this
            // effect is the earliest safe point. Matter.js has no such
            // dependency, so it's imported normally at the top of the file.
            const { default: P5Ctor } = await import('p5');
            if (cancelled || !container) return;

            const engine = Matter.Engine.create();
            const world = engine.world;
            engine.gravity.y = 1;

            const pills: ColoredPill[] = [];
            let walls: Matter.Body[] = [];
            let draggedPill: ColoredPill | null = null;

            const buildWalls = (w: number, h: number) => {
                if (walls.length) Matter.World.remove(world, walls);
                const t = WALL_THICKNESS;
                walls = [
                    Matter.Bodies.rectangle(w / 2, h + t / 2, w + t * 2, t, { isStatic: true }), // ground
                    Matter.Bodies.rectangle(w / 2, -t / 2, w + t * 2, t, { isStatic: true }), // ceiling
                    Matter.Bodies.rectangle(-t / 2, h / 2, t, h + t * 2, { isStatic: true }), // left wall
                    Matter.Bodies.rectangle(w + t / 2, h / 2, t, h + t * 2, { isStatic: true }), // right wall
                ];
                Matter.World.add(world, walls);
            };

            const collectPills = (p: P5) => {
                const nodes =
                    container?.parentElement?.querySelectorAll<HTMLElement>('.physics-pill') ?? [];

                nodes.forEach((node) => {
                    const {
                        word = '',
                        background = '#6C5CE7',
                        textColor = '#FFFFFF',
                        x = '0',
                        y = '0',
                        rotation = '0',
                        width = '100',
                    } = node.dataset;

                    pills.push(
                        new ColoredPill(p, world, {
                            word,
                            background,
                            textColor,
                            x: parseFloat(x),
                            y: parseFloat(y),
                            rotation: parseFloat(rotation),
                            width: parseFloat(width),
                        })
                    );
                });
            };

            const sketch = (p: P5) => {
                p.setup = () => {
                    const w = container?.clientWidth ?? 0;
                    const h = container?.clientHeight ?? 0;
                    p.createCanvas(w, h);
                    buildWalls(w, h);
                    collectPills(p);
                };

                p.draw = () => {
                    p.clear();
                    Matter.Engine.update(engine);
                    pills.forEach((pill) => pill.update());
                };

                p.mousePressed = () => {
                    draggedPill = pills.find((pill) => pill.isNear(p.mouseX, p.mouseY, DRAG_RADIUS)) ?? null;
                    if (draggedPill) Matter.Body.setStatic(draggedPill.body, true);
                };

                p.mouseDragged = () => {
                    if (!draggedPill) return;
                    Matter.Body.setPosition(draggedPill.body, { x: p.mouseX, y: p.mouseY });
                };

                p.mouseReleased = () => {
                    if (!draggedPill) return;
                    Matter.Body.setStatic(draggedPill.body, false);
                    // fling it using however fast the mouse was moving on release
                    Matter.Body.setVelocity(draggedPill.body, {
                        x: p.movedX * 1.2,
                        y: p.movedY * 1.2,
                    });
                    draggedPill = null;
                };

                p.windowResized = () => {
                    const w = container?.clientWidth ?? 0;
                    const h = container?.clientHeight ?? 0;
                    p.resizeCanvas(w, h);
                    buildWalls(w, h);
                };
            };

            p5Instance = new P5Ctor(sketch, container);
        })();

        return () => {
            cancelled = true;
            p5Instance?.remove();
        };
    }, []);

    return (
        <div
            ref={containerRef}
            className="absolute inset-0"
            style={{ zIndex: 10, pointerEvents: 'auto' }}
        />
    );
}