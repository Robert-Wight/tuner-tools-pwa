// This is a simple "presentational" component.
// It doesn't need 'useState' because it doesn't manage any changing data.

export default function ManualLibrary() {
    // --- Your List of Manuals ---
    // Add or remove items from this array to update your list.
    const manuals = [
        {
            name: 'Rapier Weaving Machine P1(PTS 12/JEG)', // The name you want the user to see
            filename: 'P1.pdf', // The exact filename in your 'public' folder
        },
        {
            name: 'Weaver Training ',
            filename: 'Weaver training manual.pdf',
        },
        // Add more manuals here
        // {
        //   name: "My Third Manual",
        //   filename: "my-third-manual.pdf"
        // }
    ];

    return (
        <div className="library-container">
            <h1>Manual Library</h1>
            <ul>
                {manuals.map((manual) => (
                    <li key={manual.filename}>
                        {/*
              - We use an <a> tag for a standard link.
              - href={`/${manual.filename}`} points to the file in the 'public' folder.
              - target="_blank" opens the link in a new tab.
              - rel="noopener noreferrer" is a security best practice for new tabs.
            */}
                        <a
                            href={`/${manual.filename}`}
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            {manual.name}
                        </a>
                    </li>
                ))}
            </ul>
        </div>
    );
}