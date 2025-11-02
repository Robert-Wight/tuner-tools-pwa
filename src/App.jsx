import { useState } from 'react';

// Import all our tool components
import ReedLengthCalculator from './components/ReedLengthCalculator';
import ManualLibrary from './components/ManualLibrary';
import Glossary from './components/Glossary';
import LoomTimingDiagram from './components/LoomTimingDiagram';
import CastOutCalculator from './components/CastOutCalculator';
import HookLocator from './components/HookLocator';
import LoomData from './components/LoomData';

// 1. We create a "manifest" of all our tools.
// This makes it easy to add or remove tools later.
const tools = {
  reedCalculator: {
    name: 'Reed Length Calculator',
    component: <ReedLengthCalculator />,
  },
  castOutCalculator: {
    name: 'Cast Out Calculator',
    component: <CastOutCalculator />,
  },
  hookLocator: {
    name: 'Jacquard Hook Locator',
    component: <HookLocator />,
  },
  loomTiming: {
    name: 'Loom Timing Diagram',
    component: <LoomTimingDiagram />,
  },
  loomData: {
    name: 'Loom Data Repository',
    component: <LoomData />,
  },
  manualLibrary: {
    name: 'Manual Library',
    component: <ManualLibrary />,
  },
  glossary: {
    name: 'Glossary of Terms',
    component: <Glossary />,
  },
};

// Get just the keys (e.g., 'reedCalculator', 'castOutCalculator')
const toolKeys = Object.keys(tools);

function App() {
  // 2. This is our navigation state.
  // `null` means we are on the "Main Menu".
  // 'reedCalculator' means we are showing that tool.
  const [activeToolKey, setActiveToolKey] = useState(null);

  // Find the full tool object based on the active key
  const activeTool = activeToolKey ? tools[activeToolKey] : null;

  // 3. We remove the old flex layout classes from <main>
  return (
    <main className="min-h-screen container mx-auto p-4 max-w-3xl">

      {/* --- VIEW 1: A TOOL IS ACTIVE --- */}
      {activeTool ? (
        <div>
          {/* Back Button */}
          <button
            onClick={() => setActiveToolKey(null)} // This takes us "home"
            className="mb-4 font-semibold text-yellow-500 hover:text-yellow-400"
          >
            &larr; Back to Main Menu
          </button>

          {/* The selected tool component renders here */}
          {activeTool.component}
        </div>

      ) : (
        /* --- VIEW 2: MAIN MENU (no tool selected) --- */
        <div>
          <h1 className="text-3xl font-bold text-white mb-6">
            Tuner Tools Pro
          </h1>
          <p className="text-lg text-slate-300 mb-8">
            Please select a tool to begin.
          </p>

          {/* We map over our 'tools' object to create the menu */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {toolKeys.map((key) => (
              <button
                key={key}
                onClick={() => setActiveToolKey(key)}
                className="p-6 bg-slate-800 rounded-lg text-left text-lg font-semibold text-slate-200 hover:bg-slate-700 hover:ring-2 hover:ring-yellow-500 transition-all"
              >
                {tools[key].name}
              </button>
            ))}
          </div>
        </div>
      )}

    </main>
  );
}

export default App;