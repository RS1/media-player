/* ┐
   │ File: use-fullscreen-api.ts [/src/hooks/use-fullscreen-api.ts]
   │ Package: @rs1/media-player | RS1 Project
   │ Author: Andrea Corsini
   │ Created: April 24th, 2023 - 15:08:44
   │ Modified: May 9th, 2023 - 11:22:39
   │ 
   │ Copyright (c) 2023 Andrea Corsini T/A RS1 Project.
   │ This work is licensed under the terms of the MIT License.
   │ For a copy, see https://opensource.org/licenses/MIT
   │ or the LICENSE file in the root of this project.
   └ */
import { useEffect, useRef, useState } from 'react'

declare global {
    interface FullscreenAPIDocument extends Document {
        /* Standard APIs */
        exitFullscreen: () => Promise<void>
        requestFullscreen: (element: HTMLElement) => Promise<void>
        fullscreenElement: HTMLElement | null
        readonly fullscreenEnabled: boolean

        /* WebKit newer APIs */
        webkitExitFullscreen: () => Promise<void>
        webkitRequestFullscreen: (element: HTMLElement) => Promise<void>
        webkitFullscreenElement: HTMLElement | null
        readonly webkitFullscreenEnabled: boolean

        /* WebKit older APIs */
        webkitCancelFullScreen: () => Promise<void>
        webkitRequestFullScreen: (element: HTMLElement) => Promise<void>
        webkitFullScreenElement: HTMLElement | null
        readonly webkitIsFullScreen: boolean

        /* Firefox APIs */
        mozCancelFullScreen: () => Promise<void>
        mozRequestFullScreen: (element: HTMLElement) => Promise<void>
        mozFullScreenElement: HTMLElement | null
        readonly mozFullScreenEnabled: boolean

        /* Explorer APIs */
        msExitFullscreen: () => Promise<void>
        msRequestFullscreen: (element: HTMLElement) => Promise<void>
        msFullscreenElement: HTMLElement | null
        readonly msFullscreenEnabled: boolean
    }

    interface FullscreenAPIHTMLElement extends HTMLElement {
        /* Standard APIs */
        exitFullscreen: () => Promise<void>
        requestFullscreen: () => Promise<void>
        readonly fullscreen: boolean

        /* WebKit newer APIs */
        webkitExitFullscreen: () => Promise<void>
        webkitRequestFullscreen: () => Promise<void>
        readonly webkitDisplayingFullscreen: boolean

        /* WebKit older APIs */
        webkitCancelFullScreen: () => Promise<void>
        webkitRequestFullScreen: () => Promise<void>
        readonly webkitSupportsFullscreen: boolean

        /* Firefox APIs */
        mozCancelFullScreen: () => Promise<void>
        mozRequestFullScreen: () => Promise<void>
        readonly mozFullScreen: boolean

        /* Explorer APIs */
        msExitFullscreen: () => Promise<void>
        msRequestFullscreen: () => Promise<void>
        readonly msFullscreenElement: boolean
    }

    interface FullscreenAPIHTMLMediaElement extends HTMLMediaElement {
        /* Standard APIs */
        enterFullscreen: () => Promise<void>

        /* WebKit newer APIs */
        webkitEnterFullscreen: () => Promise<void>
    }
}

interface FullscreenAPI {
    exit: () => Promise<void>
    request: (element: HTMLElement | null, fallback: HTMLMediaElement | null) => Promise<void>
    toggle: (element: HTMLElement | null, fallback: HTMLMediaElement | null) => Promise<void>
    element: HTMLElement | null
    enabled: boolean
}

type APISet = 'mdn' | 'webkit' | 'webkit-old' | 'firefox' | 'explorer'

const document = window?.document as FullscreenAPIDocument | undefined

const currentAPI = ((): APISet => {
    if (document && 'fullscreenEnabled' in document) return 'mdn'
    if (document && 'webkitFullscreenEnabled' in document) return 'webkit'
    if (document && 'webkitIsFullScreen' in document) return 'webkit-old'
    if (document && 'mozFullScreenEnabled' in document) return 'firefox'
    if (document && 'msFullscreenEnabled' in document) return 'explorer'
    return 'mdn'
})()
export const isFullscreenEnabled = (() => {
    if (!document) return false
    switch (currentAPI) {
        case 'mdn':
            return document.fullscreenEnabled
        case 'webkit':
            return document.webkitFullscreenEnabled
        case 'webkit-old':
            return document.webkitIsFullScreen
        case 'firefox':
            return document.mozFullScreenEnabled
        case 'explorer':
            return document.msFullscreenEnabled
        default:
            return false
    }
})()
const onFullscreenEvent = (() => {
    switch (currentAPI) {
        case 'webkit':
        case 'webkit-old':
            return 'webkitfullscreenchange'
        case 'firefox':
            return 'mozfullscreenchange'
        case 'explorer':
            return 'MSFullscreenChange'
        case 'mdn':
        default:
            return 'fullscreenchange'
    }
})()
const onFullscreenErrorEvent = (() => {
    switch (currentAPI) {
        case 'webkit':
        case 'webkit-old':
            return 'webkitfullscreenerror'
        case 'firefox':
            return 'mozfullscreenerror'
        case 'explorer':
            return 'MSFullscreenError'
        case 'mdn':
        default:
            return 'fullscreenerror'
    }
})()

function getFullscreenElement(): HTMLElement | null {
    let element: HTMLElement | null = null
    if (!document) return element
    if (currentAPI === 'mdn') {
        element = document.fullscreenElement
    } else if (currentAPI === 'webkit') {
        element = document.webkitFullscreenElement
    } else if (currentAPI === 'webkit-old') {
        element = document.webkitFullScreenElement
    } else if (currentAPI === 'firefox') {
        element = document.mozFullScreenElement
    } else if (currentAPI === 'explorer') {
        element = document.msFullscreenElement
    }
    return element
}

async function requestFullscreen(element: HTMLElement | null, fallback: HTMLMediaElement | null) {
    if (!element) return

    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent)
    if (fallback && !isFullscreenEnabled && isIOS && fallback.tagName === 'VIDEO') {
        const _fallback = fallback as FullscreenAPIHTMLMediaElement
        return _fallback?.['webkitEnterFullscreen' in _fallback ? 'webkitEnterFullscreen' : 'enterFullscreen']()
    }

    const _element = element as FullscreenAPIHTMLElement
    if (currentAPI === 'mdn') {
        return _element.requestFullscreen()
    } else if (currentAPI === 'webkit') {
        return _element.webkitRequestFullscreen()
    } else if (currentAPI === 'webkit-old') {
        return _element.webkitRequestFullScreen()
    } else if (currentAPI === 'firefox') {
        return _element.mozRequestFullScreen()
    } else if (currentAPI === 'explorer') {
        return _element.msRequestFullscreen()
    }
}

async function exitFullscreen() {
    if (!document) return
    if (currentAPI === 'mdn') {
        return document.exitFullscreen()
    } else if (currentAPI === 'webkit') {
        return document.webkitExitFullscreen()
    } else if (currentAPI === 'webkit-old') {
        return document.webkitCancelFullScreen()
    } else if (currentAPI === 'firefox') {
        return document.mozCancelFullScreen()
    } else if (currentAPI === 'explorer') {
        return document.msExitFullscreen()
    }
}

async function toggleFullscreen(element: HTMLElement | null, fallback: HTMLMediaElement | null) {
    if (!element) return

    if (getFullscreenElement()) {
        return exitFullscreen()
    } else {
        return requestFullscreen(element, fallback)
    }
}

function useFullscreenAPI() {
    const [isActive, setActive] = useState(false)

    const fsAPI = useRef<FullscreenAPI>({
        request: requestFullscreen,
        exit: exitFullscreen,
        toggle: toggleFullscreen,
        element: null,
        enabled: isFullscreenEnabled,
    })

    useEffect(() => {
        const setFSActive = () => {
            const element = getFullscreenElement()
            fsAPI.current.element = element
            setActive(element !== null)
        }

        document?.addEventListener(onFullscreenEvent, setFSActive)
        document?.addEventListener(onFullscreenErrorEvent, setFSActive)

        return () => {
            document?.removeEventListener(onFullscreenEvent, setFSActive)
            document?.removeEventListener(onFullscreenErrorEvent, setFSActive)
        }
    }, [])

    return [isActive, fsAPI.current] as const
}

export default useFullscreenAPI
