/* ┐
   │ File: use-pip-api.ts [/src/hooks/use-pip-api.ts]
   │ Package: @rs1/media-player | RS1 Project
   │ Author: Andrea Corsini
   │ Created: April 25th, 2023 - 14:12:46
   │ Modified: May 9th, 2023 - 11:26:31
   │ 
   │ Copyright (c) 2023 Andrea Corsini T/A RS1 Project.
   │ This work is licensed under the terms of the MIT License.
   │ For a copy, see https://opensource.org/licenses/MIT
   │ or the LICENSE file in the root of this project.
   └ */
import { useEffect, useRef, useState } from 'react'

interface PiPAPI {
    exit: () => Promise<void>
    request: (element: HTMLVideoElement | null) => Promise<void>
    toggle: (element: HTMLVideoElement | null) => Promise<void>
    element: Element | null
    enabled: boolean
}

export const isPiPEnabled = (() => {
    return !!document?.pictureInPictureEnabled
})()

function getPiPElement(): Element | null {
    return document?.pictureInPictureElement ?? null
}

async function requestPiP(element: HTMLVideoElement | null) {
    if (!element) return
    element.requestPictureInPicture()
}

async function exitPiP() {
    if (!getPiPElement()) return
    document.exitPictureInPicture()
}

async function togglePiP(element: HTMLVideoElement | null) {
    if (!element) return
    if (getPiPElement()) await exitPiP()
    else await requestPiP(element)
}

function usePiPAPI() {
    const [isActive, setActive] = useState(false)

    const pipAPI = useRef<PiPAPI>({
        request: requestPiP,
        exit: exitPiP,
        toggle: togglePiP,
        element: null,
        enabled: isPiPEnabled,
    })

    useEffect(() => {
        const setPiPActive = () => {
            const element = getPiPElement()
            pipAPI.current.element = element
            setActive(element !== null)
        }

        document.addEventListener('enterpictureinpicture', setPiPActive)
        document.addEventListener('leavepictureinpicture', setPiPActive)

        return () => {
            document.removeEventListener('enterpictureinpicture', setPiPActive)
            document.removeEventListener('leavepictureinpicture', setPiPActive)
        }
    }, [])

    return [isActive, pipAPI.current] as const
}

export default usePiPAPI
