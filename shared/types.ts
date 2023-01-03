type NotificationIPC = {
    title: string
    body: string
}

type ExporeRootDirIPC = {
    data: {
        dir: string
    }
}



export {
    NotificationIPC,
    ExporeRootDirIPC,
}