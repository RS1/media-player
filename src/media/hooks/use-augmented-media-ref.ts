/* ┐
   │ File: use-augmented-media-ref.ts [/src/media/hooks/use-augmented-media-ref.ts]
   │ Package: @rs1/media-player | RS1 Project
   │ Author: Andrea Corsini
   │ Created: April 20th, 2023 - 11:11:06
   │ Modified: May 9th, 2023 - 14:30:33
   │ 
   │ Copyright (c) 2023 Andrea Corsini T/A RS1 Project.
   │ This work is licensed under the terms of the MIT License.
   │ For a copy, see https://opensource.org/licenses/MIT
   │ or the LICENSE file in the root of this project.
   └ */
import { useCallback, useRef } from 'react'

import { MediaPlaybackRate } from '@media/types'

import { useKeepAliveAudio } from '@/hooks'

import { clamp } from '@utils/math'

/**
 * An AugmentedMediaElement is a wrapper around the HTMLMediaElement that provides a unified
 * interface for interacting with the media player.
 * In the future, this will be useful to support other media types (e.g. HLS, DASH, etc.) or
 * sources (e.g. YouTube, Vimeo, etc.). For now, it's just a wrapper around the HTMLMediaElement
 * that provides some useful methods and properties.
 */
export interface AugmentedMediaElement extends Pick<HTMLMediaElement, 'play' | 'pause'> {
    // node reference
    /**
     * The underlying HTMLMediaElement. (<audio> or <video>)
     */
    current: HTMLMediaElement | null
    // augmented methods
    /**
     * Alias for `pause()`
     */
    wait: () => Promise<void>
    /**
     * Seek forward by the specified number of seconds.
     * A negative number will seek backward.
     * @param {number} time The number of seconds to seek by.
     * @returns {Promise<void>} A promise that resolves when the seek is complete.
     */
    skip: (time: number) => Promise<void>
    /**
     * Ask the player to load the previous media item in the playlist.
     */
    previous: () => Promise<void>
    /**
     * Ask the player to load the next media item in the playlist.
     */
    next: () => Promise<void>
    // alias methods
    /**
     * Alias for `setTime(time)`
     */
    seekTo: (time: number) => Promise<void>
    // augmented setters
    /**
     * Set the current time of the media player. (in seconds)
     * @param {number} time The time to seek to.
     * @returns {Promise<void>} A promise that resolves when the seek is complete.
     */
    setTime: (time: number) => Promise<void>
    /**
     * Set the current progress of the media player. (in percent 0-1)
     * Progress is calculated as `time / duration` and clamped to the range 0-1.
     * @param {number} progress The progress to seek to.
     */
    setProgress: (progress: number) => Promise<void>
    /**
     * Ask the player to mute/unmute the audio output.
     * @param {boolean | ((muted: boolean) => boolean)} muted A boolean or a function that given the current muted state returns the new muted state.
     */
    setMuted: (muted: boolean | ((muted: boolean) => boolean)) => Promise<void>
    /**
     * Set the volume of the media player. (in percent 0-1)
     * @param {number | ((volume: number) => number)} volume A number or a function that given the current volume returns the new volume.
     */
    setVolume: (volume: number | ((volume: number) => number)) => Promise<void>
    /**
     * Set the playback rate of the media player.
     * @param {MediaPlaybackRate | ((rate: MediaPlaybackRate) => MediaPlaybackRate)} rate A playback rate or a function that given the current playback rate returns the new playback rate.
     */
    setPlaybackRate: (rate: MediaPlaybackRate | ((rate: MediaPlaybackRate) => MediaPlaybackRate)) => Promise<void>
    // augmented getters
    /**
     * Get the current time of the media player. (in seconds)
     * The time is garanteed to be a number, even if the media player is not ready yet. (in that case, it will be 0)
     */
    getTime: () => number
    /**
     * Get the duration of the media player. (in seconds)
     * The duration is garanteed to be a number, even if the media player is not ready yet. (in that case, it will be 0)
     */
    getDuration: () => number
    /**
     * Get the current progress of the media player. (in percent 0-1)
     * Progress is calculated as `time / duration` and clamped to the range 0-1.
     * The progress is garanteed to be a number, even if the media player is not ready yet. (in that case, it will be 0)
     */
    getProgress: () => number
    /**
     * Get the current buffered progress of the media player. (in percent 0-1)
     * Buffered progress is calculated as `buffered / duration` and clamped to the range 0-1.
     * The buffered progress is garanteed to be a number, even if the media player is not ready yet. (in that case, it will be 0)
     */
    getBuffered: () => number
    /**
     * Get the current muted state of the media player.
     * @returns Either `true` (muted) or `false` (unmuted)
     */
    getMuted: () => boolean
    /**
     * Get the current volume of the media player. (as a float 0-1, where 0 is muted and 1 is max volume)
     */
    getVolume: () => number
    /**
     * Get the current playback rate of the media player.
     * @returns Either `0.25`, `0.5`, `0.75`, `1`, `1.25`, `1.5`, `1.75`, or `2`
     */
    getPlaybackRate: () => MediaPlaybackRate
    // augmented properties
    /**
     * Whether the media player is currently playing.
     */
    isPlaying: boolean
    /**
     * Whether the media player is currently seeking, and in which direction.
     */
    isSeeking: 'forward' | 'backward' | false
}

interface Props {
    /**
     * A callback that will be called when the augmented media element starts or stops playing.
     * @param {boolean} isPlaying Whether the media is playing or not.
     */
    onPlaybackChange?: (isPlaying: boolean) => void
    /**
     * A callback that will be called when the augmented media element needs a new track to be loaded.
     * @param {number} track The index of the track to load. (negative values are used for previous tracks)
     */
    onTrackChange?: (track: number) => void
    /**
     * Whether to keep the audio alive when the media element is not playing.
     * This is useful as a workaround for browsers that suspend the audio when the tab is not active.
     * Example: Safari on iOS.
     * @default false
     */
    keepAlive?: boolean
}

type UseAugmentedMediaRef = readonly [
    AugmentedMediaElement | null,
    (node: HTMLMediaElement | null) => void,
    React.RefObject<HTMLMediaElement>,
]

/**
 * Use this hook to get a reference to an `AugmentedMediaElement` from a `HTMLMediaElement`.
 * @example
 * ```js
 * // considering a standard media element component
 * const ref = useRef(null)
 *
 * return (
 *   <audio ref={ref} />
 * )
 *
 * // you can use the hook like this
 *
 * const onPlaybackChange = useCallback(isPlaying => {
 *    // do something...
 * }, [])
 *
 * const onTrackChange = useCallback(track => {
 *   // do something...
 * }, [])
 *
 * const [augmentedRef, setRef, mediaRef] = useAugmentedMediaRef({ onPlaybackChange, onTrackChange })
 *
 * // Now in `augmentedRef` you have an `AugmentedMediaElement` instance.
 * // In `mediaRef` you have the `HTMLMediaElement` instance. (equivalent to `ref.current` in the example above)
 *
 * return (
 *   <audio ref={setRef} />
 * )
 * ```
 */
export function useAugmentedMediaRef(props: Props): UseAugmentedMediaRef {
    const mediaRef = useRef<HTMLMediaElement | null>(null)
    const augmentedRef = useRef<AugmentedMediaElement | null>(null)
    const { onPlaybackChange, onTrackChange, keepAlive = false } = props
    const keepAliveAudio = useKeepAliveAudio()

    const setRef = useCallback(
        (node: HTMLMediaElement | null) => {
            if (node) {
                mediaRef.current = node
                // console.log(`[use-augmented-media-ref] Setting media ref...`)
                augmentedRef.current = {
                    // node reference
                    current: node,
                    // augmented properties
                    isPlaying: augmentedRef?.current ? augmentedRef.current.isPlaying : !node.paused,
                    isSeeking: false,
                    // augmented getters
                    getTime: () => {
                        if (!node || isNaN(node.currentTime)) return 0
                        return node.currentTime
                    },
                    getDuration: () => {
                        if (!node || isNaN(node.duration)) return 0
                        return node.duration
                    },
                    getProgress: () => {
                        if (!node || isNaN(node.duration) || isNaN(node.currentTime)) return 0
                        return node.currentTime / node.duration
                    },
                    getBuffered: () => {
                        if (!node || !node.buffered.length || isNaN(node.duration)) return 0
                        return node.buffered.end(node.buffered.length - 1) / node.duration
                    },
                    getMuted: () => {
                        if (!node) return false
                        return node.muted || node.volume === 0
                    },
                    getVolume: () => {
                        if (!node) return 1
                        if (node.muted) return 0
                        if (isNaN(node.volume)) return 1
                        return node.volume
                    },
                    getPlaybackRate: () => {
                        if (!node || isNaN(node.playbackRate)) return 1
                        return node.playbackRate as MediaPlaybackRate
                    },
                    // augmented setters
                    setTime: async time => {
                        if (!node) return
                        if (augmentedRef.current) {
                            const originalTime = isNaN(node.currentTime) ? 0 : node.currentTime
                            augmentedRef.current.isSeeking = time > originalTime ? 'forward' : 'backward'
                        }
                        node.dispatchEvent(new Event('seeking'))
                        const duration = augmentedRef.current?.getDuration() ?? 0
                        node.currentTime = clamp(time, 0, duration)
                        node.dispatchEvent(new Event('seeked'))
                    },
                    setProgress: async progress => {
                        if (!node) return
                        const duration = isNaN(node.duration) ? 0 : node.duration
                        if (augmentedRef.current) {
                            const originalTime = isNaN(node.currentTime) ? 0 : node.currentTime
                            augmentedRef.current.isSeeking = progress * duration > originalTime ? 'forward' : 'backward'
                        }
                        node.dispatchEvent(new Event('seeking'))
                        node.currentTime = clamp(progress * duration, 0, duration)
                        node.dispatchEvent(new Event('seeked'))
                    },
                    setMuted: async muted => {
                        if (!node) return
                        node.muted = typeof muted === 'function' ? muted(node.muted) : muted
                    },
                    setVolume: async volume => {
                        if (!node) return
                        const volumeValue = typeof volume === 'function' ? volume(node.volume) : volume
                        node.volume = clamp(volumeValue, 0, 1)
                        node.muted = false
                    },
                    setPlaybackRate: async rate => {
                        if (!node) return
                        const playbackRate =
                            typeof rate === 'function' ? rate(node.playbackRate as MediaPlaybackRate) : rate
                        node.playbackRate = clamp(parseFloat(`${playbackRate}`), 0.25, 2)
                    },
                    // augmented methods
                    play: async () => {
                        if (keepAlive) {
                            if (!keepAliveAudio.stream) {
                                await keepAliveAudio.initStream()
                            }
                            keepAliveAudio.playStream()
                        }
                        node && (await node.play())
                        if (augmentedRef.current) {
                            augmentedRef.current.isPlaying = true
                        }
                        onPlaybackChange && onPlaybackChange(true)
                    },
                    pause: async () => {
                        node && (await node.pause())
                        if (augmentedRef.current) {
                            augmentedRef.current.isPlaying = false
                        }
                        onPlaybackChange && onPlaybackChange(false)
                    },
                    wait: async () => {
                        node && (await node.pause())
                    },
                    skip: async time => {
                        if (!node) return
                        const destination = (augmentedRef.current?.getTime() ?? 0) + time
                        const duration = augmentedRef.current?.getDuration() ?? 0
                        augmentedRef.current?.setTime(destination)

                        if (destination <= 0.1) {
                            await augmentedRef.current?.previous()
                        } else if (destination > duration - 0.1) {
                            await augmentedRef.current?.next()
                        }
                    },
                    previous: async () => {
                        if (!node) return
                        const time = augmentedRef.current?.getTime() ?? 0
                        if (time > 10 || !onTrackChange) {
                            await augmentedRef.current?.setTime(0)
                            await augmentedRef.current?.play()
                            return
                        }
                        onTrackChange(-1)
                    },
                    next: async () => {
                        if (!node) return
                        if (!onTrackChange) {
                            const duration = augmentedRef.current?.getDuration() ?? 0
                            const left = duration - (augmentedRef.current?.getTime() ?? 0)
                            if (left > 10) {
                                await augmentedRef.current?.setTime(duration)
                                await augmentedRef.current?.pause()
                            } else {
                                await augmentedRef.current?.setTime(0)
                                await augmentedRef.current?.play()
                            }
                            return
                        }
                        onTrackChange(1)
                    },
                    // alias methods
                    seekTo: async time => {
                        await augmentedRef.current?.setTime(time)
                    },
                }
            } else {
                mediaRef.current = null
                augmentedRef.current = null
            }
        },
        [onPlaybackChange, onTrackChange, keepAlive],
    )

    return [augmentedRef?.current, setRef, mediaRef]
}
