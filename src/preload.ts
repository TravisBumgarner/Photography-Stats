import { contextBridge, ipcRenderer } from 'electron'

import { ContextBridge } from './types'

const contextBridgeContents: ContextBridge = {
    selectFolder: () => ipcRenderer.invoke('dialog:openDirectory'),
    processPhotos: (folder: string) => {
        return ipcRenderer.invoke('processPhotos', { folder })
    }
}

contextBridge.exposeInMainWorld('contextBridge', contextBridgeContents)