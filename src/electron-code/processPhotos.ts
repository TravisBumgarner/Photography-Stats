import fs from 'fs'
import path from 'path'

import * as exifr from 'exifr'
import { v5 as uuidv5 } from 'uuid'


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

type Sidecar = {
    lr: {
        hierarchicalSubject: string[]
    }
}

type Photo = {
    src: string,
    make: string,
    model: string,
    lens: string,
    dateTaken: string,
    aperture: string,
    shutterSpeed: string,
    iso: string,
    focalLength: string,
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
    const sidecar = await exifr.sidecar(file) as unknown as Sidecar

    try {
        data = await exifr.parse(file)
    } catch {
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
        console.log(`${file} Missing values: ${JSON.stringify(missingKeys)}, they were probably not exported from Lightroom`)
    }
    return results
}

const VALID_EXTENSIONS = ['jpg']

const processPhotos = async (folderPath: string) => {
    const photos: Record<string, Photo> = {}

    // https://stackoverflow.com/questions/5827612/node-js-fs-readdir-recursive-directory-search
    const files = fs.readdirSync(folderPath)

    for (let file of files) {
        const extension = file.split('.').slice(-1)[0]
        if (!VALID_EXTENSIONS.includes(extension)) {
            console.log('\tSkipping for invalid file type')
            continue
        }

        const result = await processPhoto(path.join(folderPath, file))
        if (result === null) console.log('skipping', file)
        else {
            photos[result.src] = result
        }
    }
    return JSON.stringify({ photos });
}

export default processPhotos