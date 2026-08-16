import Matter from 'matter-js';
import type P5 from 'p5';

export interface ColoredPillOptions {
    word: string;
    background: string;
    textColor: string;
    x: number;
    y: number;
    rotation: number;
    width: number;
}

const MIN_HEIGHT = 36;
const HEIGHT_RATIO = 0.36;
const FONT_SIZE = 16;
const TEXT_PADDING = 16;

/**
 * Wraps a single Matter.js rectangle body — chamfered into a pill/capsule
 * shape — plus the p5 drawing logic that renders it every frame.
 */
export default class ColoredPill {
    p: P5;
    body: Matter.Body;
    word: string;
    background: string;
    textColor: string;
    width: number;
    height: number;

    constructor(p5Instance: P5, world: Matter.World, options: ColoredPillOptions) {
        const { word, background, textColor, x, y, rotation, width } = options;

        this.p = p5Instance;
        this.word = word;
        this.background = background;
        this.textColor = textColor;
        this.width = width;
        this.height = Math.max(MIN_HEIGHT, width * HEIGHT_RATIO);

        this.body = Matter.Bodies.rectangle(x, y, this.width, this.height, {
            // radius = half the height turns the rectangle's corners into a full
            // capsule/pill shape rather than just rounded corners
            chamfer: { radius: this.height / 2 },
            restitution: 0.55, // bounciness on collision
            friction: 0.2, // surface friction against other bodies
            frictionAir: 0.02, // air drag, keeps things from sliding forever
            density: 0.002,
            angle: (rotation * Math.PI) / 180,
        });

        Matter.World.add(world, this.body);
    }

    /** Draw this pill at its current Matter.js position/angle. Call once per frame from p.draw(). */
    update() {
        const p = this.p;
        const { position, angle } = this.body;

        p.push();
        p.translate(position.x, position.y);
        p.rotate(angle);
        p.rectMode(p.CENTER);
        p.noStroke();
        p.fill(this.background);
        p.rect(0, 0, this.width, this.height, this.height / 2);

        p.fill(this.textColor);
        p.textAlign(p.CENTER, p.CENTER);
        p.textSize(FONT_SIZE);
        p.textStyle(p.BOLD);
        p.text(this.word, 0, 0, this.width - TEXT_PADDING);
        p.pop();
    }

    /** True if (mx, my) is within `radius` px of this pill's center — used for drag detection. */
    isNear(mx: number, my: number, radius = 50): boolean {
        const dx = mx - this.body.position.x;
        const dy = my - this.body.position.y;
        return Math.hypot(dx, dy) < radius;
    }
}