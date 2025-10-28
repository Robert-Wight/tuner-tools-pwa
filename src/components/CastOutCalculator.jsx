import { useState, useRef } from 'react';
import './CastOutCalculator.css'; // We will create this file next

export default function CastOutCalculator() {
    // --- 1. States for Inputs ---
    const [startHook, setStartHook] = useState('');
    const [maxHookNumber, setMaxHookNumber] = useState('');
    const [listEnds, setListEnds] = useState('');
    const [scarfEnds, setScarfEnds] = useState('');
    const [cuttingGapEnds, setCuttingGapEnds] = useState('');
    const [numScarves, setNumScarves] = useState('');
    const [customHookPattern, setCustomHookPattern] = useState('');

    // 'simple', 'hermes', '14in2out', 'custom'
    // Using a single state for the mode is much cleaner in React
    const [calcMode, setCalcMode] = useState('simple');

    // --- 2. States for Outputs ---
    const [resultsData, setResultsData] = useState([]);
    const [summaryData, setSummaryData] = useState(null);
    const [error, setError] = useState(null);
    const [warning, setWarning] = useState(null);
    const [showResults, setShowResults] = useState(false);

    // This is for scrolling to the results
    const resultsRef = useRef(null);

    // --- 3. The Main Calculation Function ---
    const handleCalculate = () => {
        // --- 3.1. Reset UI ---
        setResultsData([]);
        setSummaryData(null);
        setError(null);
        setWarning(null);
        setShowResults(false);

        // --- 3.2. Get and Validate Input Values ---
        const i_startHook = parseInt(startHook);
        const i_maxHookNumber = parseInt(maxHookNumber);
        const i_listEnds = parseInt(listEnds) || 0; // Default 0 if empty
        const i_scarfEnds = parseInt(scarfEnds) || 0;
        const i_cuttingGapEnds = parseInt(cuttingGapEnds) || 0;
        const i_numScarves = parseInt(numScarves) || 0;

        const isSimpleSumMode = calcMode === 'simple';

        // Common Validation
        if (
            (isNaN(i_listEnds) || i_listEnds < 0) ||
            (isNaN(i_scarfEnds) || (i_scarfEnds < 1 && i_numScarves > 0)) ||
            (isNaN(i_cuttingGapEnds) || i_cuttingGapEnds < 0) ||
            (isNaN(i_numScarves) || i_numScarves < 0) ||
            (isNaN(i_startHook) || i_startHook < 1)
        ) {
            setError(
                'Error: Please enter valid positive numbers. Start Hook must be at least 1. Ends can be 0.'
            );
            setShowResults(true);
            return;
        }

        // --- 3.3. Determine Hook Pattern (for Pattern Mode) ---
        let hookPattern = '';
        if (!isSimpleSumMode) {
            if (calcMode === 'hermes') {
                hookPattern = 'xoxxoxxoxoxxoxxo';
            } else if (calcMode === '14in2out') {
                hookPattern = 'xxxxxxxxxxxxxxoo';
            } else if (calcMode === 'custom') {
                hookPattern = customHookPattern.trim().toLowerCase();
            }

            // Pattern Mode Validation
            if (isNaN(i_maxHookNumber) || i_maxHookNumber < 1 || i_startHook > i_maxHookNumber) {
                setError('Error: Please enter valid positive numbers for hooks. Starting hook cannot exceed total hooks.');
                setShowResults(true);
                return;
            }
            if (hookPattern.length === 0) {
                setError('Error: Hook Usage Pattern is empty.');
                setShowResults(true);
                return;
            }
            if (calcMode === 'custom' && !/^[xo]+$/.test(hookPattern)) {
                setError("Error: Custom Hook Usage Pattern is invalid. Use only 'x' and 'o'.");
                setShowResults(true);
                return;
            }
        }

        // --- 4. Perform Calculation based on Mode ---

        // --- MODE A: Simple Sum Mode ---
        if (isSimpleSumMode) {
            let currentEndIndex = i_startHook - 1;
            let totalEndsCalculated = 0;
            const newResultsData = [];

            const sectionsToSum = [];
            sectionsToSum.push({ name: 'Start List', ends: i_listEnds });
            if ((i_listEnds > 0 || i_numScarves > 0) && i_cuttingGapEnds > 0) sectionsToSum.push({ name: 'Gap after Start List', ends: i_cuttingGapEnds, conditional: true });
            for (let i = 0; i < i_numScarves; i++) {
                sectionsToSum.push({ name: `Scarf ${i + 1}`, ends: i_scarfEnds });
                if (i < i_numScarves - 1 && i_cuttingGapEnds > 0) sectionsToSum.push({ name: `Gap between Scarf ${i + 1} & ${i + 2}`, ends: i_cuttingGapEnds, conditional: true });
            }
            if ((i_listEnds > 0 || i_numScarves > 0) && i_cuttingGapEnds > 0) sectionsToSum.push({ name: 'Gap before End List', ends: i_cuttingGapEnds, conditional: true });
            sectionsToSum.push({ name: 'End List', ends: i_listEnds });

            sectionsToSum.forEach((section) => {
                const includeSection = section.ends > 0 || (section.conditional && section.ends > 0);
                if (section.name.toLowerCase().includes('list') || includeSection) {
                    const sectionStartEnd = currentEndIndex + 1;
                    const sectionEndEnd = currentEndIndex + section.ends;
                    newResultsData.push({
                        name: section.name,
                        start: section.ends > 0 ? sectionStartEnd : '-',
                        end: section.ends > 0 ? sectionEndEnd : '-',
                        endsInSection: section.ends,
                    });
                    if (section.ends > 0) {
                        currentEndIndex += section.ends;
                        totalEndsCalculated += section.ends;
                    }
                }
            });

            setResultsData(newResultsData);
            setSummaryData({
                totalEnds: totalEndsCalculated,
                lastEndIndex: totalEndsCalculated > 0 ? currentEndIndex : (i_startHook > 1 ? i_startHook - 1 : '-'),
            });

            // --- MODE B: Pattern Cast Out Mode ---
        } else {
            const patternLength = hookPattern.length;
            let currentPhysicalHook = i_startHook;
            const newResultsData = [];
            let calculationError = null;

            // --- Helper Functions (Ported from your JS) ---
            function getHooksForSection(endsNeeded, sectionName) {
                const sectionStartHook = currentPhysicalHook;
                let activeHooksFound = 0;
                let physicalHooksInSection = 0;
                let sectionEndHook = currentPhysicalHook - 1;

                if (endsNeeded <= 0) {
                    return { name: sectionName, start: sectionStartHook, end: sectionStartHook - 1, activeHooks: 0, physicalHooks: 0, error: null, endsNeeded: 0 };
                }

                let tempCurrentPhysicalHook = currentPhysicalHook;
                while (activeHooksFound < endsNeeded) {
                    if (tempCurrentPhysicalHook > i_maxHookNumber) {
                        currentPhysicalHook = tempCurrentPhysicalHook;
                        return { name: sectionName, error: `Ran out of available hooks (hit limit ${i_maxHookNumber}) while allocating for ${sectionName}. Needed ${endsNeeded}, found ${activeHooksFound}. Last hook checked: ${tempCurrentPhysicalHook - 1}` };
                    }
                    const patternIndex = (tempCurrentPhysicalHook - i_startHook + patternLength * 10000) % patternLength;
                    const isActive = hookPattern[patternIndex] === 'x';
                    if (isActive) {
                        activeHooksFound++;
                    }
                    sectionEndHook = tempCurrentPhysicalHook;
                    physicalHooksInSection++;
                    tempCurrentPhysicalHook++;
                }
                currentPhysicalHook = tempCurrentPhysicalHook;
                return { name: sectionName, start: sectionStartHook, end: sectionEndHook, activeHooks: activeHooksFound, physicalHooks: physicalHooksInSection, error: null, endsNeeded: endsNeeded };
            }

            function findNextActiveHook(startSearchHook, currentSectionNameForError) {
                let searchHook = startSearchHook;
                let skips = 0;
                while (true) {
                    if (searchHook > i_maxHookNumber) {
                        return { error: `Ran out of available hooks (hit limit ${i_maxHookNumber}) while searching for active start hook for ${currentSectionNameForError}. Last hook checked: ${searchHook - 1}`, nextHook: -1, skips: -1 };
                    }
                    const patternIndex = (searchHook - i_startHook + patternLength * 10000) % patternLength;
                    if (hookPattern[patternIndex] === 'x') {
                        return { error: null, nextHook: searchHook, skips: skips };
                    }
                    skips++;
                    searchHook++;
                }
            }
            // --- End Helper Functions ---

            // --- 6.1. Calculate Start List ---
            let sectionResult;
            sectionResult = getHooksForSection(i_listEnds, 'Start List');
            if (sectionResult.error) { calculationError = sectionResult; } else { newResultsData.push(sectionResult); }

            // --- 6.2. Calculate Gap/Alignment before Scarf 1 ---
            if (i_numScarves > 0 && !calculationError) {
                const hookWhereScarf1WouldStart = currentPhysicalHook;
                const patternIndexBeforeScarf1 = (hookWhereScarf1WouldStart - i_startHook + patternLength * 10000) % patternLength;
                let physicalHooksAddedForAlignment_Scarf1 = 0;
                let alignedScarf1StartHook = hookWhereScarf1WouldStart;

                if (patternIndexBeforeScarf1 !== 0) {
                    const hooksToAdd = patternLength - patternIndexBeforeScarf1;
                    const targetHook = hookWhereScarf1WouldStart + hooksToAdd - 1;
                    if (targetHook >= i_maxHookNumber && hooksToAdd > 0) {
                        calculationError = { name: 'Scarf 1 Alignment', error: `Cannot align Scarf 1 to pattern start (needs hook ${hookWhereScarf1WouldStart + hooksToAdd}, limit ${i_maxHookNumber}).` };
                    } else {
                        alignedScarf1StartHook = hookWhereScarf1WouldStart + hooksToAdd;
                        physicalHooksAddedForAlignment_Scarf1 = hooksToAdd;
                    }
                }

                if (!calculationError) {
                    const shouldIncludeGapAfterList = (i_cuttingGapEnds > 0 || physicalHooksAddedForAlignment_Scarf1 > 0);
                    if (shouldIncludeGapAfterList) {
                        let gapStartsAt = currentPhysicalHook;
                        let gapEndsResult = getHooksForSection(i_cuttingGapEnds, 'Gap after Start List');
                        if (gapEndsResult.error) { calculationError = gapEndsResult; }
                        else {
                            const totalPhysicalHooksForGapAndAlignment = gapEndsResult.physicalHooks + physicalHooksAddedForAlignment_Scarf1;
                            const gapEndHook = alignedScarf1StartHook - 1;
                            let gapName = 'Gap after Start List';
                            if (physicalHooksAddedForAlignment_Scarf1 > 0 && gapEndsResult.activeHooks === 0 && i_cuttingGapEnds === 0) { gapName = 'Scarf 1 Alignment Skips'; }
                            else if (physicalHooksAddedForAlignment_Scarf1 > 0) { gapName += ` (+ ${physicalHooksAddedForAlignment_Scarf1} Scarf 1 align skip${physicalHooksAddedForAlignment_Scarf1 > 1 ? 's' : ''})`; }

                            if (gapEndsResult.activeHooks > 0 || totalPhysicalHooksForGapAndAlignment > 0) {
                                newResultsData.push({ name: gapName, start: gapStartsAt, end: gapEndHook, activeHooks: gapEndsResult.activeHooks, physicalHooks: totalPhysicalHooksForGapAndAlignment, error: null, endsNeeded: i_cuttingGapEnds });
                            }
                            currentPhysicalHook = alignedScarf1StartHook;
                        }
                    } else { currentPhysicalHook = alignedScarf1StartHook; }
                }
            }

            // --- 6.3. Calculate Scarves and Gaps Between Them ---
            if (!calculationError) {
                for (let i = 0; i < i_numScarves; i++) {
                    const scarfNumber = i + 1; const scarfName = `Scarf ${scarfNumber}`;
                    sectionResult = getHooksForSection(i_scarfEnds, scarfName);
                    if (sectionResult.error) { calculationError = sectionResult; break; }
                    newResultsData.push(sectionResult);

                    if (i < i_numScarves - 1 && !calculationError) {
                        const nextScarfNumber = i + 2; const gapSectionName = `Gap Scarf ${scarfNumber}-${nextScarfNumber}`;
                        let gapResult = getHooksForSection(i_cuttingGapEnds, gapSectionName);
                        if (gapResult.error) { calculationError = gapResult; break; }

                        const alignmentInfo = findNextActiveHook(currentPhysicalHook, `Scarf ${nextScarfNumber}`);
                        if (alignmentInfo.error) { calculationError = { name: `Alignment for Scarf ${nextScarfNumber}`, error: alignmentInfo.error }; break; }

                        const alignmentSkips = alignmentInfo.skips;
                        const nextScarfAlignedStartHook = alignmentInfo.nextHook;
                        let finalGapName = gapSectionName;
                        if (alignmentSkips > 0 && gapResult.activeHooks === 0 && i_cuttingGapEnds === 0) { finalGapName = `Alignment Skips before Scarf ${nextScarfNumber}`; }
                        else if (alignmentSkips > 0) { finalGapName += ` (+ ${alignmentSkips} align skip${alignmentSkips > 1 ? 's' : ''})`; }

                        if (gapResult.activeHooks > 0 || (gapResult.physicalHooks + alignmentSkips) > 0) {
                            newResultsData.push({ name: finalGapName, start: gapResult.start, end: nextScarfAlignedStartHook - 1, activeHooks: gapResult.activeHooks, physicalHooks: gapResult.physicalHooks + alignmentSkips, error: null, endsNeeded: i_cuttingGapEnds });
                        }
                        currentPhysicalHook = nextScarfAlignedStartHook;
                    }
                }
            }

            // --- 6.4. Calculate Gap/Alignment before End List ---
            if (!calculationError) {
                const shouldIncludeGapBeforeEndList = i_cuttingGapEnds > 0 && i_listEnds > 0;
                let gapBeforeListResult = null;
                let originalGapStartHook = currentPhysicalHook;

                if (shouldIncludeGapBeforeEndList) {
                    gapBeforeListResult = getHooksForSection(i_cuttingGapEnds, 'Gap before End List');
                    if (gapBeforeListResult.error) { calculationError = gapBeforeListResult; }
                } else {
                    gapBeforeListResult = { name: 'Gap before End List', start: currentPhysicalHook, end: currentPhysicalHook - 1, activeHooks: 0, physicalHooks: 0, error: null, endsNeeded: 0 };
                }

                if (i_listEnds > 0 && !calculationError) {
                    const alignmentInfo = findNextActiveHook(currentPhysicalHook, 'End List');
                    if (alignmentInfo.error) { calculationError = { name: 'Alignment for End List', error: alignmentInfo.error }; }
                    else {
                        const alignmentSkips = alignmentInfo.skips;
                        const endListAlignedStartHook = alignmentInfo.nextHook;
                        let finalGapName = 'Gap before End List';
                        if (alignmentSkips > 0 && gapBeforeListResult.activeHooks === 0 && i_cuttingGapEnds === 0) { finalGapName = `Alignment Skips before End List`; }
                        else if (alignmentSkips > 0) { finalGapName += ` (+ ${alignmentSkips} align skip${alignmentSkips > 1 ? 's' : ''})`; }

                        if (gapBeforeListResult.activeHooks > 0 || (gapBeforeListResult.physicalHooks + alignmentSkips) > 0) {
                            newResultsData.push({ name: finalGapName, start: originalGapStartHook, end: endListAlignedStartHook - 1, activeHooks: gapBeforeListResult.activeHooks, physicalHooks: gapBeforeListResult.physicalHooks + alignmentSkips, error: null, endsNeeded: i_cuttingGapEnds });
                        }
                        currentPhysicalHook = endListAlignedStartHook;
                    }
                } else if (shouldIncludeGapBeforeEndList && !calculationError && gapBeforeListResult.activeHooks > 0) {
                    newResultsData.push(gapBeforeListResult);
                }

                // --- 6.5. Calculate End List ---
                if (i_listEnds > 0 && !calculationError) {
                    sectionResult = getHooksForSection(i_listEnds, 'End List');
                    if (sectionResult.error) { calculationError = sectionResult; } else { newResultsData.push(sectionResult); }
                } else if (!calculationError && i_listEnds === 0) {
                    newResultsData.push({ name: 'End List', start: currentPhysicalHook, end: currentPhysicalHook - 1, activeHooks: 0, physicalHooks: 0, error: null, endsNeeded: 0 });
                }
            }

            // --- 7. Set Pattern Mode Results ---
            const totalActiveHooksUsed = newResultsData.reduce((total, res) => total + (res.activeHooks || 0), 0);
            let lastHookUsedOverall = i_startHook - 1;
            newResultsData.forEach(res => {
                if (res.end >= res.start && res.end > lastHookUsedOverall) { lastHookUsedOverall = res.end; }
            });
            const totalPhysicalHooksConsumed = lastHookUsedOverall >= i_startHook ? lastHookUsedOverall - i_startHook + 1 : 0;

            if (lastHookUsedOverall >= i_startHook && lastHookUsedOverall > i_maxHookNumber) {
                setWarning(`Warning: The calculated pattern end hook (${lastHookUsedOverall}) exceeds the Total Hooks Available (${i_maxHookNumber}).`);
            }

            if (calculationError) {
                setError(`Error in ${calculationError.name}: ${calculationError.error}`);
            } else {
                setResultsData(newResultsData);
                setSummaryData({
                    totalActive: totalActiveHooksUsed,
                    lastHook: lastHookUsedOverall < i_startHook ? '-' : lastHookUsedOverall,
                    totalPhysical: totalPhysicalHooksConsumed,
                });
            }
        }

        // --- 8. Show Results and Scroll ---
        setShowResults(true);
        // Use setTimeout to ensure the DOM has updated before scrolling
        setTimeout(() => {
            resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }, 100);
    };

    // --- 5. The JSX (HTML) to render ---
    return (
        <div className="calculator-container cast-out-container">
            <h1>Cast Out Calculator</h1>

            {/* --- Input Form --- */}
            <div className="input-group">
                <label>Starting Hook:</label>
                <input type="number" value={startHook} onChange={(e) => setStartHook(e.target.value)} placeholder="e.g., 1" />
            </div>

            <div className="input-group">
                <label>List Ends (Start & End):</label>
                <input type="number" value={listEnds} onChange={(e) => setListEnds(e.target.value)} placeholder="e.g., 10" />
            </div>

            <div className="input-group">
                <label>Scarf Ends (per Scarf):</label>
                <input type="number" value={scarfEnds} onChange={(e) => setScarfEnds(e.target.value)} placeholder="e.g., 50" />
            </div>

            <div className="input-group">
                <label>Cutting Gap Ends:</label>
                <input type="number" value={cuttingGapEnds} onChange={(e) => setCuttingGapEnds(e.target.value)} placeholder="e.g., 2" />
            </div>

            <div className="input-group">
                <label>Number of Scarves:</label>
                <input type="number" value={numScarves} onChange={(e) => setNumScarves(e.target.value)} placeholder="e.g., 4" />
            </div>

            {/* --- Mode Selection --- */}
            <fieldset className="mode-selection">
                <legend>Calculation Mode</legend>
                <div className="radio-option">
                    <input type="radio" id="mode_simple" name="calc_mode" value="simple" checked={calcMode === 'simple'} onChange={(e) => setCalcMode(e.target.value)} />
                    <label htmlFor="mode_simple">Simple Sum Mode</label>
                </div>

                <div className="radio-option">
                    <input type="radio" id="mode_hermes" name="calc_mode" value="hermes" checked={calcMode === 'hermes'} onChange={(e) => setCalcMode(e.target.value)} />
                    <label htmlFor="mode_hermes">Hermes Pattern (xoxxoxxoxoxxoxxo)</label>
                </div>

                <div className="radio-option">
                    <input type="radio" id="mode_14in2out" name="calc_mode" value="14in2out" checked={calcMode === '14in2out'} onChange={(e) => setCalcMode(e.target.value)} />
                    <label htmlFor="mode_14in2out">14 in 2 out (xxxxxxxxxxxxxxoo)</label>
                </div>

                <div className="radio-option">
                    <input type="radio" id="mode_custom" name="calc_mode" value="custom" checked={calcMode === 'custom'} onChange={(e) => setCalcMode(e.target.value)} />
                    <label htmlFor="mode_custom">Custom Pattern</label>
                </div>
            </fieldset>

            {/* --- Conditional Inputs (only show for pattern mode) --- */}
            {calcMode !== 'simple' && (
                <>
                    <div className="input-group">
                        <label>Total Hooks Available (Max):</label>
                        <input type="number" value={maxHookNumber} onChange={(e) => setMaxHookNumber(e.target.value)} placeholder="e.g., 6144" />
                    </div>

                    {/* Only show custom pattern input if 'custom' is selected */}
                    {calcMode === 'custom' && (
                        <div className="input-group">
                            <label>Custom Hook Pattern (use 'x' and 'o'):</label>
                            <input type="text" value={customHookPattern} onChange={(e) => setCustomHookPattern(e.target.value)} placeholder="e.g., xoxoxoxx" />
                        </div>
                    )}
                </>
            )}

            {/* --- Calculate Button --- */}
            <button onClick={handleCalculate}>Calculate</button>

            {/* --- 6. Results Display --- */}
            {showResults && (
                <div className="results-container" ref={resultsRef}>
                    {/* Error Message */}
                    {error && (
                        <div className="message message-error">
                            {error}
                        </div>
                    )}

                    {/* Warning Message */}
                    {warning && (
                        <div className="message message-warning">
                            {warning}
                        </div>
                    )}

                    {/* --- Results Table --- */}
                    {resultsData.length > 0 && (
                        <div className="results-table">
                            <table>
                                <thead>
                                    {/* Show different headers for each mode */}
                                    {calcMode === 'simple' ? (
                                        <tr>
                                            <th>Section Name</th>
                                            <th>Start End Index</th>
                                            <th>End End Index</th>
                                            <th>Ends in Section</th>
                                        </tr>
                                    ) : (
                                        <tr>
                                            <th>Section Name</th>
                                            <th>Start Hook</th>
                                            <th>End Hook</th>
                                            <th>Active Hooks (Ends)</th>
                                            <th>Physical Hooks Used</th>
                                        </tr>
                                    )}
                                </thead>
                                <tbody>
                                    {resultsData.map((res, index) => {
                                        // In Pattern mode, only show rows that are lists or used hooks
                                        const showRow =
                                            calcMode === 'simple' ||
                                            res.name.toLowerCase().includes('list') ||
                                            res.activeHooks > 0 ||
                                            res.physicalHooks > 0;

                                        if (!showRow) return null;

                                        return (
                                            <tr key={index}>
                                                {calcMode === 'simple' ? (
                                                    <>
                                                        <td>{res.name}</td>
                                                        <td>{res.start}</td>
                                                        <td>{res.end}</td>
                                                        <td>{res.endsInSection}</td>
                                                    </>
                                                ) : (
                                                    <>
                                                        <td>{res.name}</td>
                                                        <td>{(res.physicalHooks > 0 || res.name.toLowerCase().includes('list')) ? res.start : '-'}</td>
                                                        <td>{(res.physicalHooks > 0 || res.name.toLowerCase().includes('list')) && res.end >= res.start ? res.end : '-'}</td>
                                                        <td>{res.activeHooks}</td>
                                                        <td>{res.physicalHooks}</td>
                                                    </>
                                                )}
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    )}

                    {/* --- Summary --- */}
                    {summaryData && (
                        <div className="results-summary">
                            {calcMode === 'simple' ? (
                                <>
                                    <p><strong>Total Ends Calculated:</strong> {summaryData.totalEnds}</p>
                                    <p><strong>Last End Index Reached:</strong> {summaryData.lastEndIndex}</p>
                                </>
                            ) : (
                                <>
                                    <p><strong>Total Active Hooks (Ends) Used:</strong> {summaryData.totalActive}</p>
                                    <p><strong>Pattern Ends On Hook:</strong> {summaryData.lastHook}</p>
                                    <p><strong>Total Physical Hooks Consumed by Pattern:</strong> {summaryData.totalPhysical}</p>
                                </>
                            )}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}