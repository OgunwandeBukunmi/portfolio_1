export interface PillProps {
    /** Word or short phrase shown inside the pill */
    word: string;
    /** Pill background color — any valid CSS color */
    background?: string;
    /** Pill text color */
    textColor?: string;
    /** Initial x position in px, relative to the physics canvas's positioned parent */
    x: number;
    /** Initial y position in px, relative to the physics canvas's positioned parent */
    y: number;
    /** Initial rotation in degrees */
    rotation?: number;
    /** Pill width in px — height is derived from this in ColoredPill */
    width: number;
}

/**
 * Renders an invisible DOM node that exists only to carry a pill's initial
 * physics data into the tree via data-* attributes. PhysicsCanvas queries
 * every `.physics-pill` node on mount, reads this dataset, and spins up a
 * matching Matter.js body + p5 drawing for it — the canvas is the actual
 * visual layer, this node itself is never seen.
 *
 * Keeping the word in real DOM (instead of only ever existing on canvas)
 * means it's still readable by screen readers and crawlers.
 */
export default function Pill({
    word,
    background = '#6C5CE7',
    textColor = '#FFFFFF',
    x,
    y,
    rotation = 0,
    width,
}: PillProps) {
    return (
        <div
            className="physics-pill"
            data-word={word}
            data-background={background}
            data-text-color={textColor}
            data-x={x}
            data-y={y}
            data-rotation={rotation}
            data-width={width}
            style={{
                position: 'absolute',
                left: 0,
                top: 0,
                width: `${width}px`,
                transform: `translate(${x}px, ${y}px) rotate(${rotation}deg)`,
                visibility: 'hidden',
                pointerEvents: 'none',
            }}
        >
            {word}
        </div>
    );
}