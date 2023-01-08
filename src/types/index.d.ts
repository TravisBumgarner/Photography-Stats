type ContextBridge = {
    selectFolder: () => Promise<string>
    processPhotos: (folder: string) => Promise<string>
}

declare global {
    interface Window {
        contextBridge: ContextBridge
    }
}

export { ContextBridge }