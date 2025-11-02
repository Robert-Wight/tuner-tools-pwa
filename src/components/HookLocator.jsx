import { useState, useEffect } from 'react';
import './HookLocator.css'; // We will create this next

// --- 1. Loom Configuration Data  ---
// This is placed outside the component so it's not recreated on every render
const loomConfigs = {
    'Loom 10': {
        startHook: 97,
        boardRowCounts: [11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11],
        dataStrings: [
            '(1)9(13)', '(14)9(1)', '(2)9(12)', '(13)9(2)', '(3)9(11)', '(12)9(3)',
            '(4)9(10)', '(11)9(4)', '(5)9(9)', '(10)9(5)', '(6)9(8)', '(9)9(6)',
            '(7)9(7)', '(8)9(7)', '(7)8(15)', '(8)9(6)', '(6)9(8)', '(9)9(5)',
        ],
    },
    'Loom 6': {
        startHook: 147,
        boardRowCounts: [11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11],
        dataStrings: [
            '(1)9(13)', '(14)9(1)', '(2)9(12)', '(13)9(2)', '(3)9(11)', '(12)9(3)',
            '(4)9(10)', '(11)9(4)', '(5)9(9)', '(10)9(5)', '(6)9(8)', '(9)9(6)',
            '(7)9(7)', '(8)9(7)', '(7)8(15)', '(8)9(6)', '(6)9(8)', '(9)9(5)',
        ],
    },
    // --- Add other looms here as needed ---
    'Loom 4': { isPlaceholder: true }, // startHook:
};

// --- 2. Helper Functions  ---
// These are defined outside the component as they don't depend on state
function parseBoardStringV9(dataString, totalRows) {
    const rowCounts = [];
    let currentRow = 0;
    const regex = /(\(\d+\)|\d+)/g;
    let match;

    while ((match = regex.exec(dataString)) !== null && currentRow < totalRows) {
        const part = match[1];
        if (part.startsWith('(')) {
            const count = parseInt(part.substring(1, part.length - 1));
            rowCounts.push(count);
            currentRow++;
        } else {
            const fullRowCount = parseInt(part);
            for (let i = 0; i < fullRowCount && currentRow < totalRows; i++) {
                rowCounts.push(16);
                currentRow++;
            }
        }
    }
    return rowCounts;
}

function getTotalHooksV9(layout, boardIndex) {
    let total = 0;
    for (let i = 0; i < boardIndex; i++) {
        total += layout[i].reduce((sum, count) => sum + count, 0);
    }
    return total;
}

// --- 3. The React Component ---
export default function HookLocator() {
    // --- Input States ---
    const [loomSelector, setLoomSelector] = useState('Loom 10');
    const [comberBoard, setComberBoard] = useState(1);
    const [rowNum, setRowNum] = useState(1);
    const [hookPos, setHookPos] = useState(1);

    // --- Data & Output States ---
    const [currentLoomConfig, setCurrentLoomConfig] = useState(loomConfigs[loomSelector]);
    const [currentLoomLayout, setCurrentLoomLayout] = useState(null); // This is the pre-processed data
    const [error, setError] = useState(null);
    const [result, setResult] = useState(null);
    const [maxRows, setMaxRows] = useState(loomConfigs[loomSelector].boardRowCounts[0]);

    // --- Logic Functions ---

    // This function pre-processes the data strings into a usable layout
    const preprocessData = (config) => {
        try {
            const newLayout = [];
            for (let i = 0; i < 18; i++) {
                const boardString = config.dataStrings[i];
                const rowsInBoard = config.boardRowCounts[i];
                const rowCounts = parseBoardStringV9(boardString, rowsInBoard);
                newLayout.push(rowCounts);
            }
            setCurrentLoomLayout(newLayout); // Store the processed layout
            setError(null);
        } catch (e) {
            console.error('Preprocessing failed:', e);
            setError('Error: Failed to process loom data string.');
            setCurrentLoomLayout(null);
        }
    };

    // --- "Side Effects" ---
    // This useEffect runs once on load, and again *any time* loomSelector changes
    useEffect(() => {
        const newConfig = loomConfigs[loomSelector];
        setCurrentLoomConfig(newConfig);

        // Reset inputs
        setComberBoard(1);
        setRowNum(1);
        setHookPos(1);
        setResult(null);

        if (newConfig.isPlaceholder) {
            setError('Harness not yet mapped');
            setCurrentLoomLayout(null);
            setMaxRows(1);
        } else {
            preprocessData(newConfig); // Process the new loom's data
            setMaxRows(newConfig.boardRowCounts[0]); // Set max rows for the *first* board
        }
    }, [loomSelector]); // Dependency: run this code when loomSelector changes

    // This useEffect runs when comberBoard changes
    useEffect(() => {
        if (currentLoomConfig && !currentLoomConfig.isPlaceholder) {
            // Update the maxRows based on the selected comber board (1-indexed)
            const newMax = currentLoomConfig.boardRowCounts[comberBoard - 1];
            setMaxRows(newMax);

            // Reset rowNum if it's now out of bounds (1-indexed)
            // We read rowNum here, but we don't want this effect to
            // re-run just because rowNum changed, only when the comber board changes.
            if (parseInt(rowNum) > newMax) {
                setRowNum(1);
            }
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [comberBoard, currentLoomConfig]); // We are INTENTIONALLY omitting rowNum
    // --- Calculation (on button click) ---
    const handleCalculate = () => {
        setError(null);
        setResult(null);

        // --- Validation ---
        if (!currentLoomLayout) {
            setError('Loom data is not processed.');
            return;
        }

        const i_comberBoard = parseInt(comberBoard);
        const i_rowNum = parseInt(rowNum);
        const i_hookPos = parseInt(hookPos);

        if (isNaN(i_comberBoard) || isNaN(i_rowNum) || isNaN(i_hookPos)) {
            setError('Error: Inputs must be valid numbers.');
            return;
        }
        if (i_comberBoard < 1 || i_comberBoard > 18) {
            setError('Error: Comber Board must be between 1 and 18.');
            return;
        }
        if (i_rowNum < 1 || i_rowNum > maxRows) {
            setError(`Error: Row Number must be between 1 and ${maxRows} for this board.`);
            return;
        }

        // This is the "smart" validation
        const maxHooksInThisRow = currentLoomLayout[i_comberBoard - 1][i_rowNum - 1];
        if (i_hookPos < 1 || i_hookPos > maxHooksInThisRow) {
            setError(`Error: Hook Position must be between 1 and ${maxHooksInThisRow} for this row.`);
            return;
        }

        // --- Calculation ---
        try {
            const startHook = currentLoomConfig.startHook;
            const hooksInPrevBoards = getTotalHooksV9(currentLoomLayout, i_comberBoard - 1);

            let hooksInPrevRows = 0;
            for (let i = 0; i < i_rowNum - 1; i++) {
                hooksInPrevRows += currentLoomLayout[i_comberBoard - 1][i];
            }

            const finalHookNumber = startHook + hooksInPrevBoards + hooksInPrevRows + (i_hookPos - 1);
            setResult(finalHookNumber);

        } catch (e) {
            console.error('Calculation error:', e);
            setError('An unexpected error occurred during calculation.');
        }
    };

    // --- 4. The JSX (HTML) to render ---
    return (
        <div className="calculator-container hook-locator-container">
            <h1>Jacquard Hook Locator</h1>

            {/* --- Input Form --- */}
            <div className="input-group">
                <label htmlFor="loom_selector">Loom:</label>
                <select
                    id="loom_selector"
                    value={loomSelector}
                    onChange={(e) => setLoomSelector(e.target.value)}
                >
                    {Object.keys(loomConfigs).map((loomName) => (
                        <option key={loomName} value={loomName}>
                            {loomName}
                        </option>
                    ))}
                </select>
            </div>

            <div className="input-group">
                <label htmlFor="comber_board">Comber Board (1-18):</label>
                <select
                    id="comber_board"
                    value={comberBoard}
                    onChange={(e) => setComberBoard(parseInt(e.target.value))}
                    disabled={!!currentLoomConfig?.isPlaceholder}
                >
                    {/* Create 18 <option> elements */}
                    {[...Array(18).keys()].map((i) => (
                        <option key={i + 1} value={i + 1}>
                            {i + 1}
                        </option>
                    ))}
                </select>
            </div>

            <div className="input-group">
                <label htmlFor="row_num">Row in Board (1-{maxRows}):</label>
                <input
                    type="number"
                    id="row_num"
                    value={rowNum}
                    onChange={(e) => setRowNum(parseInt(e.target.value))}
                    min="1"
                    max={maxRows} // Dynamic max!
                    disabled={!!currentLoomConfig?.isPlaceholder}
                />
            </div>

            <div className="input-group">
                <label htmlFor="hook_pos">Hook Position in Row:</label>
                <input
                    type="number"
                    id="hook_pos"
                    value={hookPos}
                    onChange={(e) => setHookPos(parseInt(e.target.value))}
                    min="1"
                    disabled={!!currentLoomConfig?.isPlaceholder}
                />
            </div>

            {/* --- Calculate Button --- */}
            <button onClick={handleCalculate} disabled={!!currentLoomConfig?.isPlaceholder}>
                Find Hook
            </button>

            {/* --- Results Display --- */}
            {/* Error Message */}
            {error && (
                <div className="message message-error">
                    {error}
                </div>
            )}

            {/* Result Message */}
            {result !== null && (
                <div className="message message-success">
                    <strong>Absolute Harness Hook:</strong>
                    <span className="result-number">{result}</span>
                </div>
            )}
        </div>
    );
}