import { NotificationIPC } from '../../shared/types'

const { ipcRenderer } = window.require('electron')
const sendNotification = (title: string, body: string) => {
    ipcRenderer.send('notification', { title, body } as NotificationIPC)
}

const getLocalStorage = (key: string) => {
    const result = localStorage.getItem(key)
    return result ? JSON.parse(result) : ''
}

const setLocalStorage = (key: string, value: any) => {
    localStorage.setItem(key, JSON.stringify(value))
}

export {
    sendNotification,
    getLocalStorage,
    setLocalStorage
}