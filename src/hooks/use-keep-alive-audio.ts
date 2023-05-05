/* ┐
   │ File: use-keep-alive-audio.ts [/src/hooks/use-keep-alive-audio.ts]
   │ Package: @rs1/media-player | RS1 Project
   │ Author: Andrea Corsini
   │ Created: April 20th, 2023 - 10:32:55
   │ Modified: April 27th, 2023 - 12:22:32
   │ 
   │ Copyright (c) 2023 Andrea Corsini T/A RS1 Project.
   │ This work is licensed under the terms of the MIT License.
   │ For a copy, see https://opensource.org/licenses/MIT
   │ or the LICENSE file in the root of this project.
   └ */
import { useCallback, useRef } from 'react'

function initSilentAudioStream(): HTMLAudioElement | null {
    // @ts-ignore
    const AudioContext = window.AudioContext || window.webkitAudioContext || false
    if (!AudioContext) return null
    // Create a silent audio context to keep the audio focus
    // on the web page. (iOS / Safari)
    const ctx = new AudioContext()
    const bufferSize = 2 * ctx.sampleRate
    const emptyBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate)
    const output = emptyBuffer.getChannelData(0)
    for (let i = 0; i < bufferSize; i++) output[i] = 0
    const source = ctx.createBufferSource()
    source.buffer = emptyBuffer
    source.loop = true
    const node = ctx.createMediaStreamDestination()
    source.connect(node)
    const audio = document.createElement('audio')
    audio.style.display = 'none'
    document.body.appendChild(audio)
    audio.srcObject = node.stream
    return audio
}

export interface UseKeepAliveAudio {
    initStream: () => void
    playStream: () => void
    stream: HTMLAudioElement | null
}

/**
 * Returns a hidden audio element that is used to keep alive the audio focus.
 * This is useful on iOS / Safari, where the audio focus is lost when the
 * user navigates away from the page or locks the screen.
 * @returns {HTMLAudioElement | null} The keep alive audio element, or null on unsupported browsers.
 */
export function useKeepAliveAudio(): UseKeepAliveAudio {
    const keepAliveStream = useRef<HTMLAudioElement | null>(null)

    const init = useCallback(() => {
        if (keepAliveStream.current) return
        keepAliveStream.current = initSilentAudioStream()
    }, [])

    const play = useCallback(() => {
        if (!keepAliveStream.current) return
        keepAliveStream.current.play()
    }, [])

    return {
        initStream: init,
        playStream: play,
        stream: keepAliveStream.current,
    }
}
