import { useState } from 'react';
import './LoomTimingDiagram.css';

// --- (Step 1: YOUR DATA GOES HERE) ---
// Replace this array with the full list of timing points.
const timingPoints = [
    {
        degree: 0,
        title: '0° Left opener and rapier',
        description: 'Left opener starts to touch rapier. Play aproxx 1mm',
        manualLink: null, // manual to find    

    },
    {
        degree: 50,
        title: '50°-52° Separating needle stops',
        description: 'Separating needle stops at the scissors.',
        manualLink: null, // manual to find
    },
    {
        degree: 80,
        title: '78°- 80° Weft Cutting',
        description: '(78°-80°) Scissors are cutting the weft.',
        manualLink: null, // manual link to find

    },
    {
        degree: 196,
        title: '196° Left rapier opening',
        description: 'This is the checking point for the left rapier opening. You should check A, B, and C to ensure correct operation.',
        manualLink: '/P1.pdf#page=12', // Example link to page 12
    },
    {
        degree: 270,
        title: '270° Event Three',
        description: 'Description for event at 270 degrees.',
        manualLink: '/P1.pdf#page=5',
    },
];
// --- End of Data ---

// --- Helper Function for the Math ---
// This turns a degree (like 196) into an [x, y] coordinate
// It's the "magic" part. You don't need to change this math.
const getCoordinates = (degree, radius) => {
    // We subtract 90 because 0° in math is at 3 o'clock,
    // but we want it at 12 o'clock.
    const angleInRadians = (degree - 90) * (Math.PI / 180);
    return {
        x: 200 + radius * Math.cos(angleInRadians),
        y: 200 + radius * Math.sin(angleInRadians),
    };
};
// --- End of Helper Function ---

export default function LoomTimingDiagram() {
    // This state will hold the *full object* of the point that is clicked
    const [selectedPoint, setSelectedPoint] = useState(null);

    // Constants for our SVG diagram
    const svgSize = 400; // A 400x400 "canvas"
    const diagramRadius = 120; // Radius of the main circle
    const labelRadius = 160; // Radius for placing the text

    return (
        <div className="timing-diagram-container">
            <h1>Loom Timing Diagram</h1>

            {/* --- 1. The SVG Graphic --- */}
            <svg viewBox="0 0 400 400" width={svgSize} height={svgSize}>
                {/* The main circle */}
                <circle
                    cx={200}
                    cy={200}
                    r={diagramRadius}
                    stroke="#aaa"
                    strokeWidth="2"
                    fill="none"
                />

                {/* This "maps" your data array into clickable SVG text elements */}
                {timingPoints.map((point) => {
                    // Get the (x, y) position for this point
                    const { x, y } = getCoordinates(point.degree, labelRadius);

                    // Get coordinates for a small dot on the circle itself
                    const dotCoords = getCoordinates(point.degree, diagramRadius);

                    return (
                        // <g> is an SVG "group" element. We make the whole group clickable.
                        <g
                            key={point.degree}
                            onClick={() => setSelectedPoint(point)}
                            style={{ cursor: 'pointer' }}
                        >
                            {/* The clickable text label */}
                            <text
                                x={x}
                                y={y}
                                textAnchor="middle" // Horizontally centers the text
                                dominantBaseline="middle" // Vertically centers the text
                                fill="blue" // Make it look like a link
                                fontSize="12"
                            >
                                {point.title}
                            </text>

                            {/* A small dot on the circle */}
                            <circle cx={dotCoords.x} cy={dotCoords.y} r="3" fill="#333" />
                        </g>
                    );
                })}
            </svg>

            {/* --- 2. The Details Box (Modal) --- */}
            {/* This section only appears if 'selectedPoint' is not null */}
            {selectedPoint && (
                <div className="details-modal">
                    <div className="details-content">
                        {/* Close button */}
                        <button
                            className="close-button"
                            onClick={() => setSelectedPoint(null)} // This closes the modal
                        >
                            &times;
                        </button>

                        <h2>{selectedPoint.title}</h2>
                        <p>{selectedPoint.description}</p>

                        {/* Only show the link if one exists */}
                        {selectedPoint.manualLink && (
                            <a
                                href={selectedPoint.manualLink}
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                Go to manual section
                            </a>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}