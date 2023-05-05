/* ┐
   │ File: mime-type.ts [/src/utils/mime-type.ts]
   │ Package: @rs1/media-player | RS1 Project
   │ Author: Andrea Corsini
   │ Created: April 27th, 2023 - 12:11:25
   │ Modified: May 2nd, 2023 - 14:48:59
   │ 
   │ Copyright (c) 2023 Andrea Corsini T/A RS1 Project.
   │ This work is licensed under the terms of the MIT License.
   │ For a copy, see https://opensource.org/licenses/MIT
   │ or the LICENSE file in the root of this project.
   └ */
import { MediaType } from '@media/types'

/**
 * Guess the type of a video/audio source based on the file extension
 * @param {string} src the source URL
 * @returns {MediaType} the type of the source
 * @example guessSrcType('https://example.com/video.mp4') // 'video'
 */
export function guessSrcType(src: string): MediaType {
    if (!src || typeof src !== 'string') return 'video'
    const ext = src.split('?')[0].split('.').pop()?.toLowerCase()
    if (!ext) return 'video'

    switch (ext) {
        case 'mp4':
        case 'webm':
        case 'ogg':
        case 'm4v':
        case 'mov':
        case 'wmv':
        case 'avi':
        case 'flv':
        case 'mpg':
        case 'mpeg':
        case '3gp':
        case '3g2':
        case 'ts':
        case 'm3u8':
        case 'f4v':
        case 'f4p':
        case 'f4a':
        case 'f4b':
            return 'video'
        case 'm3u':
        case 'mp3':
        case 'wav':
        case 'aac':
        case 'flac':
        case 'm4a':
            return 'audio'
        default:
            return 'video'
    }
}

/**
 * Guess the MIME type of a video/audio source based on the file extension
 * @param {string} src the source URL
 * @returns {string | null} the MIME type or null if the extension is unknown
 * @example guessSrcMimeType('https://example.com/video.mp4') // 'video/mp4'
 * @example guessSrcMimeType('https://example.com/video') // null
 */
export function guessSrcMimeType(src: string): string | null {
    if (!src || typeof src !== 'string') return null
    const ext = src.split('?')[0].split('.').pop()?.toLowerCase()
    if (!ext) return null
    switch (ext) {
        case 'mp4':
            return 'video/mp4'
        case 'webm':
            return 'video/webm'
        case 'ogg':
            return 'video/ogg'
        case 'm4v':
            return 'video/x-m4v'
        case 'mov':
            return 'video/quicktime'
        case 'wmv':
            return 'video/x-ms-wmv'
        case 'avi':
            return 'video/x-msvideo'
        case 'flv':
            return 'video/x-flv'
        case 'mpg':
        case 'mpeg':
            return 'video/mpeg'
        case '3gp':
            return 'video/3gpp'
        case '3g2':
            return 'video/3gpp2'
        case 'ts':
            return 'video/mp2t'
        case 'm3u8':
            return 'application/x-mpegURL'
        case 'm3u':
            return 'audio/x-mpegurl'
        case 'f4v':
            return 'video/x-f4v'
        case 'f4p':
            return 'video/x-f4p'
        case 'f4a':
            return 'video/x-f4a'
        case 'f4b':
            return 'video/x-f4b'
        case 'mp3':
            return 'audio/mpeg'
        case 'wav':
            return 'audio/wav'
        case 'aac':
            return 'audio/aac'
        case 'flac':
            return 'audio/flac'
        case 'm4a':
            return 'audio/x-m4a'
        case 'jpg':
        case 'jpeg':
            return 'image/jpeg'
        case 'png':
            return 'image/png'
        case 'gif':
            return 'image/gif'
        case 'svg':
            return 'image/svg+xml'
        case 'webp':
            return 'image/webp'
        case 'bmp':
            return 'image/bmp'
        case 'ico':
            return 'image/vnd.microsoft.icon'
        case 'tiff':
        case 'tif':
            return 'image/tiff'
        case 'avif':
            return 'image/avif'
        default:
            return null
    }
}
