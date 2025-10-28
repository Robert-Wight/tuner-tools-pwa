import { useState } from 'react';

export default function ReedLengthCalculator() {
    // --- States for our inputs ---
    // We use strings for inputs to handle empty fields, and convert to numbers for calculation
    const [endsInReed, setEndsInReed] = useState('');
    const [reedNumber, setReedNumber] = useState('');
    const [endsInSplit, setEndsInSplit] = useState('');

    // --- State for our result ---
    const [reedWidth, setReedWidth] = useState(null);

    // --- Function to run when the button is clicked ---
    const handleCalculate = () => {
        // Convert text inputs to floating-point numbers
        const numEndsInReed = parseFloat(endsInReed);
        const numReedNumber = parseFloat(reedNumber);
        const numEndsInSplit = parseFloat(endsInSplit);

        // Check if all inputs are valid numbers
        if (numEndsInReed && numReedNumber && numEndsInSplit) {
            // Perform the calculation
            const result =
                (numEndsInReed / (numReedNumber * numEndsInSplit)) * 4.699;

            // Store the result, rounded to 2 decimal places like your example
            setReedWidth(result.toFixed(2));
        } else {
            // If inputs are missing or invalid, set a helpful message
            setReedWidth('Please enter all values');
        }
    };

    return (
        <div className="calculator-container">
            <h1>Reed Length Calculator</h1>

            {/* Input Fields */}
            <div className="input-group">
                <label>Ends In Reed (including Cutting Gap):</label>
                <input
                    type="number"
                    value={endsInReed}
                    onChange={(e) => setEndsInReed(e.target.value)}
                    placeholder="e.g., 1296"
                />
            </div>

            <div className="input-group">
                <label>Reed Number:</label>
                <input
                    type="number"
                    value={reedNumber}
                    onChange={(e) => setReedNumber(e.target.value)}
                    placeholder="e.g., 16"
                />
            </div>

            <div className="input-group">
                <label>Ends In Split:</label>
                <input
                    type="number"
                    value={endsInSplit}
                    onChange={(e) => setEndsInSplit(e.target.value)}
                    placeholder="e.g., 2"
                />
            </div>

            {/* Calculate Button */}
            <button onClick={handleCalculate}>Calculate Length</button>

            {/* Result Display */}
            {/* This will only show after the button is clicked */}
            {reedWidth !== null && (
                <div className="result">
                    <h2>Reed Width:</h2>
                    <p>{reedWidth}</p>
                </div>
            )}
        </div>
    );
}
