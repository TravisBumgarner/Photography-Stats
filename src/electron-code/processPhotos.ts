const { readdir } = require('fs').promises;

import { Photo } from 'shared';
import * as exifr from 'exifr'


const getFileList = async (dirName: string) => {
    let files: string[] = [];
    const items = await readdir(dirName, { withFileTypes: true });

    for (const item of items) {
        if (item.isDirectory()) {
            files = [
                ...files,
                ...(await getFileList(`${dirName}/${item.name}`)),
            ];
        } else {
            files.push(`${dirName}/${item.name}`);
        }
    }

    return files;
};

type ParsedData = {
    DateTimeOriginal: string
    Lens?: string
    LensModel?: string
    RawFileName: string
    Make: string
    Model: string
    ExposureTime?: number
    FNumber?: number
    ExposureProgram?: string
    ISO?: number
    FocalLength?: number
}

const formatShutterSpeed = (shutterSpeed: number) => {
    if (shutterSpeed < 1) {
        return `1/${1 / shutterSpeed}s`
    } else {
        return `${shutterSpeed}s`
    }
}

const formatAperture = (focalLength: number) => {
    return `\u0192/${focalLength.toFixed(1)}`
}

const formatLens = (possibleLenses: (undefined | string)[]) => {
    // Lens has different name depending ont he camera.

    const lens = possibleLenses.filter(l => l !== undefined)[0]

    return lens || ''
}

const processPhoto = async (file: string): Promise<Photo | null> => {
    let data: ParsedData

    data = await exifr.parse(file)
    if (!data) {
        return null
    }

    const results = {
        src: file,
        make: data.Make,
        model: data.Model,
        lens: formatLens([data.Lens, data.LensModel]),
        iso: data.ISO ? `ISO ${data.ISO}` : '',
        shutterSpeed: data.ExposureTime ? formatShutterSpeed(data.ExposureTime) : '',
        aperture: data.FNumber ? formatAperture(data.FNumber) : '',
        focalLength: data.FocalLength ? `${data.FocalLength}mm` : '',
        dateTaken: data.DateTimeOriginal,
    }

    const missingKeys = Object.keys(results).filter((key: keyof typeof results) => results[key] === undefined)
    if (missingKeys.length > 0) {
        console.log(`${file} Missing values: ${JSON.stringify(missingKeys)}`)
        console.log(`${file} Available Data: ${JSON.stringify(Object.keys(data))}`)
    }
    return results
}

const VALID_EXTENSIONS = ['jpg', 'dng', 'nef', 'raw', 'png', 'jpeg', 'arw', 'cr2', 'heic', 'tif']
const BLOCKED_EXTENSIONS = ['mov', 'mp4', 'avi', 'mts', 'xmp', 'ds_store', 'gif', 'thm,', 'psd', 'pto', 'mk', 'mpg']

const processPhotos = async (folderPath: string) => {
    const photos: Photo[] = []
    const blockedCounts: Record<string, number> = {}
    const notSupportedCounts: Record<string, number> = {}
    const invalidMetadata: string[] = []

    const files = await getFileList(folderPath)

    for (let file of files) {
        const extension = file.split('.').slice(-1)[0].toLowerCase()
        if (BLOCKED_EXTENSIONS.includes(extension)) {
            if (!(extension in blockedCounts)) blockedCounts[extension] = 0
            blockedCounts[extension]++
            continue
        }

        if (!VALID_EXTENSIONS.includes(extension)) {
            if (!(extension in notSupportedCounts)) notSupportedCounts[extension] = 0
            notSupportedCounts[extension]++
            continue
        }

        const result = await processPhoto(file)
        if (result === null) {
            invalidMetadata.push(file)
            continue
        }
        photos.push(result)
    }
    console.log(photos.length)
    console.log(JSON.stringify(blockedCounts))
    console.log(JSON.stringify(notSupportedCounts))
    return JSON.stringify({ photos });
}

export default processPhotos