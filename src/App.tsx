import { createRoot } from 'react-dom/client';
import { useCallback, useState } from 'react';

const App = () => {
    const [folder, setFolder] = useState('/Users/travisbumgarner/Desktop/large')
    const [results, setResults] = useState('')
    const handleSelectPath = useCallback(() => {
        window.contextBridge.selectFolder().then(r => setFolder(r))
    }, [])

    const handleProcessPhotos = useCallback(() => {
        window.contextBridge.processPhotos(folder).then(r => setResults(r))
    }, [])

    return (
        <>
            <button onClick={handleSelectPath}>Select Path</button>
            <p>Selected Folder: {folder}</p>
            <button onClick={handleProcessPhotos}>Process Photos</button>
            <p>Results: {results}</p>
        </>
    )
}


const container = document.getElementById('root');
const root = createRoot(container);
root.render(<App />);