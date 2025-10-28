import { useState } from 'react';

// --- Your Glossary Data ---
// Add, edit, or remove objects from this array to build your glossary.
const glossaryData = [
    {
        term: 'Ends In Reed',
        definition:
            'The total number of warp threads (ends) in the reed, including any extra threads for the cutting gap.',
    },
    {
        term: 'Reed Number',
        definition:
            'A measure of the reed\'s fineness. It indicates the number of "dents" (splits) per unit of measurement (e.g., per inch or per 10cm).',
    },
    {
        term: 'Ends In Split',
        definition:
            'The number of individual warp threads (ends) that are drawn through a single split (dent) in the reed.',
    },
    {
        term: 'PWA (Progressive Web App)',
        definition:
            'A web application that can be "installed" on your device and can work offline, providing an experience similar to a native app.',
    },
];

export default function Glossary() {
    // This state will   keep track of *which* term is currently selected.
    // We'll store the *index* (position) of the term, starting with `null` (nothing selected).
    const [activeIndex, setActiveIndex] = useState(null);

    // This function is called when a user clicks a term.
    const handleTermClick = (index) => {
        // If the user clicks the *same* term that is already open, close it.
        if (index === activeIndex) {
            setActiveIndex(null);
        } else {
            // Otherwise, open the new term.
            setActiveIndex(index);
        }
    };

    return (
        <div className="glossary-container">
            <h1>Glossary</h1>
            <ul className="term-list">
                {glossaryData.map((item, index) => (
                    <li key={item.term} className="term-item">
                        {/* We use a <button> here because it's interactive content.
              It's more accessible than a simple <div>.
            */}
                        <button onClick={() => handleTermClick(index)}>
                            {item.term}
                        </button>

                        {/* This is the magic: We only show the definition if the
              'activeIndex' state matches the 'index' of this term.
            */}
                        {activeIndex === index && (
                            <div className="definition">
                                <p>{item.definition}</p>
                            </div>
                        )}
                    </li>
                ))}
            </ul>
        </div>
    );
}