/* ┐
   │ File: use-media-keyboard-controls.ts [/src/media/hooks/use-media-keyboard-controls.ts]
   │ Package: @rs1/media-player | RS1 Project
   │ Author: Andrea Corsini
   │ Created: April 21st, 2023 - 10:21:21
   │ Modified: May 4th, 2023 - 12:41:18
   │ 
   │ Copyright (c) 2023 Andrea Corsini T/A RS1 Project.
   │ This work is licensed under the terms of the MIT License.
   │ For a copy, see https://opensource.org/licenses/MIT
   │ or the LICENSE file in the root of this project.
   └ */
import { useEffect } from 'react'

import { useMediaConfig } from './use-media-config'
import { useMediaControls } from './use-media-controls'
import { usePlaylistControls } from './use-playlist-controls'

/**
 * Check if an event is a KeyboardEvent
 * @param {Event} e The event to check
 * @returns {e is KeyboardEvent} Whether the event is a KeyboardEvent
 */
function isKeyboardEvent(e: Event): e is KeyboardEvent {
    return 'key' in e
}

/**
 * Use this hook anywhere within a `MediaProvider` to enable keyboard controls.
 * By default, keyboard controls are attached to the `document` object, so they will work even if the media player is not focused.
 * You can change this behaviour by passing a ref to the element you want to attach the keyboard controls to.
 *
 * The kind of controls available depends on the current configuration. (refer to the `can*` properties in the `MediaConfig` interface)
 * @param {React.RefObject<HTMLElement>} [ref] The element to attach the keyboard controls to. If not specified, the `document` object will be used.
 * @example
 * ```js
 * const ref = useRef()
 * useMediaKeyboardControls(ref)
 *
 * return (
 *    <div ref={ref}>
 *       <CustomMediaPlayer />
 *    </div>
 * )
 * ```
 */
export const useMediaKeyboardControls = (ref?: React.RefObject<HTMLElement>) => {
    const config = useMediaConfig()
    const controls = useMediaControls()
    const playlistControls = usePlaylistControls()

    useEffect(() => {
        const handleKeydown = (e: Event) => {
            if (!isKeyboardEvent(e)) return
            // Ignore keypresses when the user is typing in an input field
            // https://developer.mozilla.org/en-US/docs/Web/API/Element/keydown_event
            if (e.isComposing || e.keyCode === 229) return
            switch (e.key) {
                case ' ':
                    if (config.canPause) {
                        e.preventDefault()
                        controls.togglePlay()
                    }
                    break
                case 'ArrowLeft':
                    if (config.canSeek) {
                        e.preventDefault()
                        controls.skip(-10)
                    }
                    break
                case 'ArrowRight':
                    if (config.canSeek) {
                        e.preventDefault()
                        controls.skip(10)
                    }
                    break
                case 'ArrowUp':
                    if (config.canChangeVolume) {
                        e.preventDefault()
                        controls.setVolume(v => v + 0.05)
                    }
                    break
                case 'ArrowDown':
                    if (config.canChangeVolume) {
                        e.preventDefault()
                        controls.setVolume(v => v - 0.05)
                    }
                    break
                case 'm':
                    if (config.canMute) {
                        e.preventDefault()
                        controls.toggleMute()
                    }
                    break
                case 'f':
                    if (config.canFullscreen) {
                        e.preventDefault()
                        controls.toggleFullscreen()
                    }
                    break
                case 'p':
                    if (config.canPictureInPicture) {
                        e.preventDefault()
                        controls.togglePiP()
                    }
                    break
                case 'r':
                    if (config.canLoop) {
                        e.preventDefault()
                        playlistControls.toggleLoop()
                    }
                    break
                case 'l':
                    if (config.canLoop) {
                        e.preventDefault()
                        playlistControls.toggleLoop()
                    }
                    break
                case 's':
                    if (config.canShuffle) {
                        e.preventDefault()
                        playlistControls.toggleShuffle()
                    }
                    break
            }
        }

        const attachTo = typeof ref === 'undefined' ? document : ref.current

        if (attachTo && config.canControlWithKeyboard) {
            attachTo.addEventListener('keydown', handleKeydown)
        }
        return () => attachTo?.removeEventListener('keydown', handleKeydown)
    }, [
        ref,
        controls,
        playlistControls,
        config.canControlWithKeyboard,
        config.canPause,
        config.canSeek,
        config.canMute,
        config.canChangeVolume,
        config.canFullscreen,
        config.canPictureInPicture,
        config.canLoop,
        config.canShuffle,
    ])
}
