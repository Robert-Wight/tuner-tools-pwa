import ReedLengthCalculator from './components/ReedLengthCalculator';
import ManualLibrary from './components/ManualLibrary';
import Glossary from './components/Glossery';
import LoomTimingDiagram from './components/LoomTimingDiagram';
import CastOutCalculator from './components/CastOutCalculator';
import HookLocator from './components/HookLocator';


function App() {
  return (
    <main>
      {/* This is where we will list all our tools. */}

      <ReedLengthCalculator />
      <ManualLibrary />
      <Glossary />
      <LoomTimingDiagram />
      <CastOutCalculator />
      <HookLocator />
    </main>
  );
}

export default App;