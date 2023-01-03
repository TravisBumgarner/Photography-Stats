import React, { useCallback, useState } from 'react'
import { ExporeRootDirIPC } from '../../../../shared/types'

const { ipcRenderer } = window.require('electron')

const Home = () => {
    const [rootDir, setRootDir] = useState('')

    const callBackend = async () => {
        const response = await ipcRenderer.invoke('exploreRootDir', { data: { dir: rootDir } } as ExporeRootDirIPC)
        console.log(response)
    }

    const getFileDir = useCallback(callBackend, [rootDir])

    return <p>Home <button onClick={getFileDir}>Click me</button> </p>
}

export default Home
