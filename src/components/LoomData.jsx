import { useState } from 'react';
import './LoomData.css'; // We will create this next

// --- 1. Loom Data (Ported from your HTML) ---
// This is placed outside the component so it's not recreated on every render
const loomSpecifications = {
    L1: { loomNoDisplay: 'Loom 1', make: 'Dornier P1', system: 'JACQ.', selectors: '16', minWidth: '142', maxWidth: '210', jacqReedSize: '26', hooksPerCm: '27.66', totalWorkingHooks: '5750', startHook: '147', finishHook: '5896' },
    L2: { loomNoDisplay: 'Loom 2', make: 'Dornier P1', system: 'JACQ.', selectors: '8', minWidth: '132', maxWidth: '210', jacqReedSize: '26', hooksPerCm: '27.66', totalWorkingHooks: '5750', startHook: '198', finishHook: '5947' },
    L3: { loomNoDisplay: 'Loom 3', make: 'Dornier PTS', system: 'DOBBY', selectors: '12', minWidth: '125', maxWidth: '206', jacqReedSize: 'N/A', hooksPerCm: 'N/A', totalWorkingHooks: 'N/A', startHook: 'N/A', finishHook: 'N/A' },
    L4_1: { loomNoDisplay: 'Loom 4 (Config 1)', make: 'Dornier PTS', system: 'JACQ.', selectors: '8', minWidth: '125', maxWidth: '210', jacqReedSize: '18', hooksPerCm: '15.32', totalWorkingHooks: '3264', startHook: '417', finishHook: '3680' },
    L4_2: { loomNoDisplay: 'Loom 4 (Config 2)', make: 'Dornier PTS', system: 'JACQ.', selectors: '8', minWidth: '125', maxWidth: '210', jacqReedSize: '19', hooksPerCm: '16.17', totalWorkingHooks: '3264', startHook: '417', finishHook: '3680' },
    L5_1: { loomNoDisplay: 'Loom 5 (Config 1)', make: 'Dornier PTS', system: 'JACQ.', selectors: '12', minWidth: '125', maxWidth: '206', jacqReedSize: '18', hooksPerCm: '15.32', totalWorkingHooks: '3264', startHook: '417', finishHook: '3680' },
    L5_2: { loomNoDisplay: 'Loom 5 (Config 2)', make: 'Dornier PTS', system: 'JACQ.', selectors: '12', minWidth: '125', maxWidth: '206', jacqReedSize: '19', hooksPerCm: '16.17', totalWorkingHooks: '3264', startHook: '417', finishHook: '3680' },
    L6_1: { loomNoDisplay: 'Loom 6 (Config 1)', make: 'Dornier PTS', system: 'JACQ.', selectors: '8', minWidth: '125', maxWidth: '210', jacqReedSize: '18', hooksPerCm: '15.32', totalWorkingHooks: '3264', startHook: '417', finishHook: '3680' },
    L6_2: { loomNoDisplay: 'Loom 6 (Config 2)', make: 'Dornier PTS', system: 'JACQ.', selectors: '12', minWidth: '125', maxWidth: '206', jacqReedSize: '19', hooksPerCm: '16.17', totalWorkingHooks: '3264', startHook: '417', finishHook: '3680' },
    L7: { loomNoDisplay: 'Loom 7', make: 'Dornier PTS', system: 'DOBBY', selectors: '8', minWidth: '125', maxWidth: '210', jacqReedSize: 'N/A', hooksPerCm: 'N/A', totalWorkingHooks: 'N/A', startHook: 'N/A', finishHook: 'N/A' },
    L8: { loomNoDisplay: 'Loom 8', make: 'Dornier PTS', system: 'JACQ.', selectors: '8', minWidth: '125', maxWidth: '210', jacqReedSize: '14', hooksPerCm: '11.92', totalWorkingHooks: '2440', startHook: '117', finishHook: '2556' },
    L9: { loomNoDisplay: 'Loom 9', make: 'Dornier PTS', system: 'DOBBY', selectors: '8', minWidth: '125', maxWidth: '210', jacqReedSize: 'N/A', hooksPerCm: 'N/A', totalWorkingHooks: 'N/A', startHook: 'N/A', finishHook: 'N/A' },
    L10_1: { loomNoDisplay: 'Loom 10 (Config 1)', make: 'Dornier PTS', system: 'JACQ.', selectors: '8', minWidth: '125', maxWidth: '210', jacqReedSize: '14', hooksPerCm: '11.92', totalWorkingHooks: '2592', startHook: '97', finishHook: '2688' },
    L10_2: { loomNoDisplay: 'Loom 10 (Config 2)', make: 'Dornier PTS', system: 'JACQ.', selectors: '8', minWidth: '125', maxWidth: '210', jacqReedSize: '15', hooksPerCm: '12.77', totalWorkingHooks: '2656', startHook: '33', finishHook: '2688' },
    L11: { loomNoDisplay: 'Loom 11', make: 'Dornier PTS', system: 'DOBBY', selectors: '8', minWidth: '125', maxWidth: '210', jacqReedSize: 'N/A', hooksPerCm: 'N/A', totalWorkingHooks: 'N/A', startHook: 'N/A', finishHook: 'N/A' },
    L12: { loomNoDisplay: 'Loom 12', make: 'Dornier PTS', system: 'DOBBY', selectors: '8', minWidth: '125', maxWidth: '210', jacqReedSize: 'N/A', hooksPerCm: 'N/A', totalWorkingHooks: 'N/A', startHook: 'N/A', finishHook: 'N/A' },
    L13: { loomNoDisplay: 'Loom 13', make: 'Dornier PTS', system: 'JACQ.', selectors: '8', minWidth: '125', maxWidth: '210', jacqReedSize: '26', hooksPerCm: '27.66', totalWorkingHooks: '5750', startHook: '147', finishHook: '5896' },
    L14: { loomNoDisplay: 'Loom 14', make: 'Dornier HTV', system: 'DOBBY', selectors: '8', minWidth: '125', maxWidth: '210', jacqReedSize: 'N/A', hooksPerCm: 'N/A', totalWorkingHooks: 'N/A', startHook: 'N/A', finishHook: 'N/A' },
    L15: { loomNoDisplay: 'Loom 15', make: 'Dornier PTS', system: 'JACQ.', selectors: '8', minWidth: '125', maxWidth: '210', jacqReedSize: '26', hooksPerCm: '27.66', totalWorkingHooks: '5750', startHook: '147', finishHook: '5896' },
    L16: { loomNoDisplay: 'Loom 16', make: 'Dornier PTS', system: 'JACQ.', selectors: '8', minWidth: '125', maxWidth: '210', jacqReedSize: '26', hooksPerCm: '27.66', totalWorkingHooks: '5750', startHook: '147', finishHook: '5896' },
    L17: { loomNoDisplay: 'Loom 17', make: 'Dornier PTS', system: 'JACQ.', selectors: '8', minWidth: '125', maxWidth: '210', jacqReedSize: '26', hooksPerCm: '27.66', totalWorkingHooks: '5750', startHook: '147', finishHook: '5896' },
    L18: { loomNoDisplay: 'Loom 18', make: 'Dornier PTS', system: 'JACQ.', selectors: '8', minWidth: '125', maxWidth: '210', jacqReedSize: '14 or 15', hooksPerCm: '12.77', totalWorkingHooks: '2440', startHook: '117', finishHook: '2556' },
    L19: { loomNoDisplay: 'Loom 19', make: 'Dornier PTS', system: 'JACQ.', selectors: '12', minWidth: '125', maxWidth: '206', jacqReedSize: '26', hooksPerCm: '27.66', totalWorkingHooks: '5750', startHook: '147', finishHook: '5896' },
    L20: { loomNoDisplay: 'Loom 20', make: 'Dornier PTS', system: 'JACQ.', selectors: '12', minWidth: '125', maxWidth: '206', jacqReedSize: '26', hooksPerCm: '27.66', totalWorkingHooks: '5750', startHook: '147', finishHook: '5896' },
    L21: { loomNoDisplay: 'Loom 21', make: 'Dornier PTS', system: 'DOBBY', selectors: '8', minWidth: '125', maxWidth: '210', jacqReedSize: 'N/A', hooksPerCm: 'N/A', totalWorkingHooks: 'N/A', startHook: 'N/A', finishHook: 'N/A' },
    L22: { loomNoDisplay: 'Loom 22', make: 'Dornier PTS', system: 'DOBBY', selectors: '8', minWidth: '125', maxWidth: '210', jacqReedSize: 'N/A', hooksPerCm: 'N/A', totalWorkingHooks: 'N/A', startHook: 'N/A', finishHook: 'N/A' },
    L23: { loomNoDisplay: 'Loom 23', make: 'Dornier PTS', system: 'DOBBY', selectors: '12', minWidth: '125', maxWidth: '206', jacqReedSize: 'N/A', hooksPerCm: 'N/A', totalWorkingHooks: 'N/A', startHook: 'N/A', finishHook: 'N/A' },
    L24: { loomNoDisplay: 'Loom 24', make: 'Dornier P1', system: 'JACQ.', selectors: '12', minWidth: '132', maxWidth: '206', jacqReedSize: '26', hooksPerCm: '27.66', totalWorkingHooks: '5750', startHook: '198', finishHook: '5947' },
    Z_L25: { loomNoDisplay: 'Loom 25', make: 'Dornier P1', system: 'JACQ.', selectors: '12', minWidth: '132', maxWidth: '206', jacqReedSize: '26', hooksPerCm: '27.66', totalWorkingHooks: '5750', startHook: '198', finishHook: '5947' },
    L26: { loomNoDisplay: 'Loom 26', make: 'Dornier P1', system: 'JACQ.', selectors: '12', minWidth: '132', maxWidth: '206', jacqReedSize: '26', hooksPerCm: '27.66', totalWorkingHooks: '5750', startHook: '198', finishHook: '5947' },
    L27: { loomNoDisplay: 'Loom 27', make: 'Dornier P1', system: 'JACQ.', selectors: '8', minWidth: '132', maxWidth: '210', jacqReedSize: '26', hooksPerCm: '22.13', totalWorkingHooks: '4670', startHook: '162', finishHook: '4831' },
};

// --- 2. The React Component ---
export default function LoomData() {
    // This state holds the key (e.g., "L1", "L4_1") of the loom to show.
    // If it's `null`, we show the selection grid.
    const [selectedLoomKey, setSelectedLoomKey] = useState(null);

    // Get the data object for the selected loom
    const selectedLoomData = selectedLoomKey ? loomSpecifications[selectedLoomKey] : null;

    // --- View 1: Selection Grid ---
    // This is what renders if `selectedLoomKey` is null
    if (!selectedLoomData) {
        return (
            <div className="calculator-container loom-data-container">
                <h1>Loom Data Repository</h1>
                <h2>Select Loom Configuration</h2>
                <div className="loom-grid">
                    {Object.keys(loomSpecifications).map((loomKey) => {
                        const loom = loomSpecifications[loomKey];
                        return (
                            <button
                                key={loomKey}
                                className="loom-selector-button"
                                onClick={() => setSelectedLoomKey(loomKey)} // Set the state on click
                            >
                                {loom.loomNoDisplay}
                            </button>
                        );
                    })}
                </div>
            </div>
        );
    }

    // --- View 2: Data Details ---
    // This renders if `selectedLoomData` exists (because `selectedLoomKey` is set)
    return (
        <div className="calculator-container loom-data-container">
            <div className="data-view-header">
                <h1>Data for {selectedLoomData.loomNoDisplay}</h1>
                <button
                    className="glow-button"
                    onClick={() => setSelectedLoomKey(null)} // Go back to the grid
                >
                    &larr; Back to Selection
                </button>
            </div>

            <div className="data-content">
                {/* --- General Data --- */}
                <div className="data-item">
                    <span className="data-label">Make/Type:</span>
                    <span className="data-value">{selectedLoomData.make || 'N/A'}</span>
                </div>
                <div className="data-item">
                    <span className="data-label">System:</span>
                    <span className="data-value">{selectedLoomData.system || 'N/A'}</span>
                </div>
                <div className="data-item">
                    <span className="data-label">Weft Selectors:</span>
                    <span className="data-value">{selectedLoomData.selectors || 'N/A'}</span>
                </div>
                <div className="data-item">
                    <span className="data-label">Min Weaving Width:</span>
                    <span className="data-value">{selectedLoomData.minWidth || 'N/A'} cm</span>
                </div>
                <div className="data-item">
                    <span className="data-label">Max Weaving Width:</span>
                    <span className="data-value">{selectedLoomData.maxWidth || 'N/A'} cm</span>
                </div>

                {/* --- Conditional Jacquard Details --- */}
                {selectedLoomData.system === 'JACQ.' && (
                    <>
                        <h3 className="data-subheader">Jacquard Details</h3>
                        <div className="data-item">
                            <span className="data-label">Jacq Reed Size:</span>
                            <span className="data-value">{selectedLoomData.jacqReedSize || 'N/A'}</span>
                        </div>
                        <div className="data-item">
                            <span className="data-label">Hooks per cm:</span>
                            <span className="data-value">{selectedLoomData.hooksPerCm || 'N/A'}</span>
                        </div>
                        <div className="data-item">
                            <span className="data-label">Total Working Hooks:</span>
                            <span className="data-value">{selectedLoomData.totalWorkingHooks || 'N/A'}</span>
                        </div>
                        <div className="data-item">
                            <span className="data-label">Start Hook:</span>
                            <span className="data-value">{selectedLoomData.startHook || 'N/A'}</span>
                        </div>
                        <div className="data-item">
                            <span className="data-label">Finish Hook:</span>
                            <span className="data-value">{selectedLoomData.finishHook || 'N/A'}</span>
                        </div>
                    </>
                )}

                {/* --- Conditional Dobby Message --- */}
                {selectedLoomData.system === 'DOBBY' && (
                    <p className="dobby-message">
                        Jacquard specific data is not applicable for Dobby systems.
                    </p>
                )}
            </div>
        </div>
    );
}