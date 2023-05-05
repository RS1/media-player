/* ┐
   │ File: use-airplay-api.ts [/src/hooks/use-airplay-api.ts]
   │ Package: @rs1/media-player | RS1 Project
   │ Author: Andrea Corsini
   │ Created: April 25th, 2023 - 14:12:46
   │ Modified: May 3rd, 2023 - 17:16:58
   │ 
   │ Copyright (c) 2023 Andrea Corsini T/A RS1 Project.
   │ This work is licensed under the terms of the MIT License.
   │ For a copy, see https://opensource.org/licenses/MIT
   │ or the LICENSE file in the root of this project.
   └ */
import React from 'react'

type WebKitWindow = (Window & typeof globalThis) & {
    WebKitPlaybackTargetAvailabilityEvent: unknown
}

interface WebKitHTMLVideoElement extends HTMLVideoElement {
    webkitShowPlaybackTargetPicker: () => Promise<void>
    webkitCurrentPlaybackTargetIsWireless: boolean
}

interface WebKitEvent extends Event {
    availability: 'available' | 'not-available'
}

async function showPicker(element: HTMLVideoElement | null) {
    if (!element) return
    ;(element as WebKitHTMLVideoElement).webkitShowPlaybackTargetPicker()
}

function useAirPlayAPI(target: HTMLVideoElement | null) {
    const [isActive, setActive] = React.useState(false)
    const [isAvailable, setAvailable] = React.useState(false)

    React.useEffect(() => {
        const setAirPlayActive = () => {
            if (!target) {
                setActive(false)
                return
            }
            setActive((target as WebKitHTMLVideoElement).webkitCurrentPlaybackTargetIsWireless)
        }

        if (!(window as WebKitWindow).WebKitPlaybackTargetAvailabilityEvent) {
            setAvailable(false)
            return
        }

        const setAirPlayAvailable = (e: Event) => {
            setAvailable((e as WebKitEvent).availability === 'available')
        }

        target?.addEventListener('webkitcurrentplaybacktargetiswirelesschanged', setAirPlayActive)
        target?.addEventListener('webkitplaybacktargetavailabilitychanged', setAirPlayAvailable)

        return () => {
            target?.removeEventListener('webkitcurrentplaybacktargetiswirelesschanged', setAirPlayActive)
            target?.removeEventListener('webkitplaybacktargetavailabilitychanged', setAirPlayAvailable)
        }
    }, [target])

    return {
        isActive,
        isAvailable,
        airPlayAPI: {
            showPicker: () => showPicker(target),
        },
    }
}

export default useAirPlayAPI
