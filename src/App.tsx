import { createRoot } from 'react-dom/client';
import { useCallback, useMemo, useState } from 'react';

import { Photo } from 'shared';

const App = () => {
    const [folder, setFolder] = useState('/Users/travisbumgarner/Dropbox/Dropbox/Digital Photography')
    const [results, setResults] = useState<Record<string, number>>({})
    const [isLoading, setIsLoading] = useState(false)
    const handleSelectPath = useCallback(() => {
        window.contextBridge.selectFolder().then(data => setFolder(data))
    }, [])

    const handleProcessPhotos = useCallback(() => {
        setIsLoading(true)
        window.contextBridge.processPhotos(folder).then(data => {
            const results: { photos: Photo[] } = JSON.parse(data)
            const photosByISO = results.photos.reduce((accum, { iso }) => {
                if (!(iso in accum)) accum[iso] = 0
                else accum[iso]++
                return accum
            }, {} as Record<string, number>)
            setResults(photosByISO)
            setIsLoading(false)
        })
    }, [])

    const isoChart = useMemo(() => {
        return Object
            .keys(results)
            .sort((a, b) => results[a] - results[b])
            .map(iso => <li key={iso}>{iso} - {results[iso]}</li>)
    }, [results])

    return (
        <>
            <p>For Best results, export all photos from lightroom to a single directory first.</p>
            <button onClick={handleSelectPath}>Select Path</button>
            <p>Selected Folder: {folder}</p>
            <button disabled={isLoading} onClick={handleProcessPhotos}>Process Photos</button>
            <div>Results: {isoChart}</div>
        </>
    )
}


const container = document.getElementById('root');
const root = createRoot(container);
root.render(<App />);