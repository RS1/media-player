/* ┐
   │ File: playlist.tsx [/src/media/providers/playlist.tsx]
   │ Package: @rs1/media-player | RS1 Project
   │ Author: Andrea Corsini
   │ Created: April 20th, 2023 - 14:29:27
   │ Modified: May 3rd, 2023 - 13:44:00
   │ 
   │ Copyright (c) 2023 Andrea Corsini T/A RS1 Project.
   │ This work is licensed under the terms of the MIT License.
   │ For a copy, see https://opensource.org/licenses/MIT
   │ or the LICENSE file in the root of this project.
   └ */
import React, { createContext, useCallback, useContext, useMemo, useState } from 'react'

import { clamp, shuffleArray } from '@utils/math'
import { guessSrcMimeType, guessSrcType } from '@utils/mime-type'
import { Either } from '@utils/types'

import { MediaTrack, PlaylistControls, PlaylistState, RawMediaTrack } from '../types'
import { ConfigContext } from './config'

/**
 * @typedef {Object} PlaylistProviderValue - The value of the `PlaylistContext`.
 */
export interface PlaylistProviderValue {
    /**
     * The active track returned as a tuple. (mimics the `useState` hook)
     * The first element is the active track, the second element is a function to set the active track.
     * The setter function accepts a `MediaTrack`, a number, `null` or a function that given the current active track returns the new active track.
     * Both the active track and the setter function are memoized.
     */
    track: [
        MediaTrack | null,
        (track: RawMediaTrack | number | null | ((track: MediaTrack | null) => RawMediaTrack | number | null)) => void,
    ]
    /**
     * The current playlist returned as a tuple. (mimics the `useState` hook)
     * The first element is the current playlist, the second element is a function to update the playlist.
     * The setter function accepts a `MediaTrack[]` or a function that given the current playlist returns the new playlist.
     * Both the playlist and the setter function are memoized.
     */
    playlist: [MediaTrack[], (newPlaylist: RawMediaTrack[] | ((playlist: MediaTrack[]) => RawMediaTrack[])) => void]
    /**
     * An object containing the current state of the playlist.
     * The state is memoized.
     */
    state: PlaylistState
    /**
     * An object containing functions to control the playlist.
     * The functions are memoized.
     * @see PlaylistControls
     */
    controls: PlaylistControls
}

/**
 * @typedef {Object} PlaylistProviderProps - The props of the `PlaylistProvider` component.
 * When the `track` prop is provided, the `playlist` prop is ignored.
 * Vice versa, when the `playlist` prop is provided, the `track` prop is ignored.
 * This allows to use the `PlaylistProvider` in two different ways:
 * - To play a collection of tracks.
 * - To play a single track.
 */
export interface MultiTrackProviderProps extends React.PropsWithChildren {
    /**
     * The initial playlist.
     * @default []
     */
    playlist: RawMediaTrack[]
}
export interface SingleTrackProviderProps extends React.PropsWithChildren {
    /**
     * The initial active track.
     */
    track: RawMediaTrack | null
}
export type PlaylistProviderProps =
    | Either<MultiTrackProviderProps, SingleTrackProviderProps>
    | (MultiTrackProviderProps & SingleTrackProviderProps)

export const PlaylistContext = createContext<PlaylistProviderValue | null>(null)

/**
 * The internal state of the `PlaylistProvider`.
 * @private
 * @typedef {Object} PlaylistInternalState
 */
interface PlaylistInternalState {
    /**
     * The current playlist.
     * This could be the original playlist or a filtered/shuffled version of it.
     */
    playlist: MediaTrack[]
    /**
     * The original playlist.
     * This is used to reset the playlist.
     */
    originalPlaylist: MediaTrack[]
    /**
     * The playing mode of the playlist.
     * `repeat` means that the playlist is repeated.
     * `repeat-one` means that the active track is repeated.
     */
    mode: PlaylistState['mode']
    /**
     * Whether the playlist is shuffled or not.
     */
    shuffle: PlaylistState['shuffle']
    /**
     * The index of the active track in the playlist.
     * If `null`, no track is active.
     */
    active: number | null
}

function normalizeTrack(track: RawMediaTrack, index: number): MediaTrack {
    const sources = Array.isArray(track.src) ? track.src : [track.src]
    const mimeTypes = sources.reduce<string[]>(
        (acc, src, idx) => {
            if (acc[idx]) return acc
            acc.push(guessSrcMimeType(src) || '')
            return acc
        },
        !track.mimeType ? [] : Array.isArray(track.mimeType) ? track.mimeType : [track.mimeType],
    )

    const type = track.type ?? sources.length ? guessSrcType(sources[0]) : 'video'

    let id = typeof track.id !== 'undefined' ? `${track.id}` : undefined
    if (typeof id === 'undefined') {
        const srcs = [...sources]
        srcs.sort()
        id = srcs.join('-')
    }

    const crossOrigin =
        typeof track.crossOrigin !== 'string'
            ? track.crossOrigin === true
                ? 'anonymous'
                : undefined
            : track.crossOrigin === 'use-credentials'
            ? 'use-credentials'
            : 'anonymous'

    return {
        ...track,
        id: id,
        type: type,
        index: index,
        src: sources,
        mimeType: mimeTypes,
        crossOrigin: crossOrigin,
    }
}

export function PlaylistProvider(props: PlaylistProviderProps) {
    const { children, playlist: initialPlaylist = [], track: initialTrack } = props

    const config = useContext(ConfigContext)

    const [state, _setState] = useState<PlaylistInternalState>(() => {
        const playlist = initialPlaylist.map(normalizeTrack)
        if (initialTrack && !initialPlaylist.length) {
            const p = [normalizeTrack(initialTrack, 0)]
            return {
                playlist: p,
                originalPlaylist: p,
                mode: config.loop ? 'repeat-one' : 'repeat',
                shuffle: false,
                active: 0,
            }
        }

        let index = -1
        if (initialTrack) {
            const track = normalizeTrack(initialTrack, 0)
            index = playlist.findIndex(t => t.id === track.id)
        }

        return {
            playlist: playlist,
            originalPlaylist: playlist,
            mode: config.loop ? 'repeat-one' : 'repeat',
            shuffle: false,
            active: !playlist.length ? null : clamp(index, 0, playlist.length - 1),
        }
    })

    /**
     * Setter function for returned `playlist` tuple.
     * Works like the `setState` function returned by the `useState` hook.
     */
    const updatePlaylist = useCallback(
        (newPlaylist: RawMediaTrack[] | ((playlist: MediaTrack[]) => RawMediaTrack[])) => {
            _setState(s => {
                const p = typeof newPlaylist === 'function' ? newPlaylist(s.playlist) : newPlaylist
                const a = s.active !== null ? s.playlist[s.active] : null

                const original = p.map(normalizeTrack)
                const playlist = s.shuffle ? shuffleArray(original) : original
                const active = a ? playlist.findIndex(t => t.id === a.id) : playlist.length ? 0 : null

                return {
                    ...s,
                    playlist: playlist,
                    originalPlaylist: original,
                    active: active,
                }
            })
        },
        [],
    )

    const loop = useCallback(() => {
        _setState(s => ({
            ...s,
            mode: 'repeat-one',
        }))
    }, [])
    const unloop = useCallback(() => {
        _setState(s => ({
            ...s,
            mode: 'repeat',
        }))
    }, [])

    const shuffle = useCallback(() => {
        _setState(s => {
            const a = s.active !== null ? s.playlist[s.active] : null
            const p = shuffleArray(s.originalPlaylist)
            const active = a ? p.findIndex(t => t.id === a.id) : null

            return {
                ...s,
                playlist: p,
                active,
                shuffle: true,
            }
        })
    }, [])

    const unshuffle = useCallback(() => {
        _setState(s => {
            const a = s.active !== null ? s.playlist[s.active] : null
            const active = a ? s.originalPlaylist.findIndex(t => t.id === a.id) : null

            return {
                ...s,
                playlist: s.originalPlaylist,
                active,
                shuffle: false,
            }
        })
    }, [])

    /**
     * Setter function for returned `track` tuple.
     * Works like the `setState` function returned by the `useState` hook.
     */
    const setTrack = useCallback(
        (
            track:
                | RawMediaTrack
                | string
                | number
                | null
                | ((track: MediaTrack | null) => RawMediaTrack | string | number | null),
        ) =>
            _setState(s => {
                const t = typeof track === 'function' ? track(s.active === null ? null : s.playlist[s.active]) : track
                if (t === null) {
                    return { ...s, active: null }
                }

                if (typeof t === 'number') {
                    // find the track in the original playlist
                    const original = s.originalPlaylist[clamp(t, 0, s.playlist.length - 1)]
                    // find the track in the current playlist
                    const index = s.playlist.findIndex(_t => _t.id === original.id)
                    return { ...s, active: index }
                }

                if (typeof t === 'string') {
                    // find the track in the original playlist
                    const original = s.originalPlaylist.find(_t => _t.id === t)
                    if (!original) return { ...s, active: null }
                    // find the track in the current playlist
                    const index = s.playlist.findIndex(_t => _t.id === original.id)
                    return { ...s, active: index < 0 ? null : index }
                }

                const nT = normalizeTrack(t, s.playlist.length)
                const index = s.playlist.findIndex(t => t.id === nT.id)
                if (index === -1) {
                    return {
                        ...s,
                        playlist: [...s.playlist, nT],
                        originalPlaylist: [...s.originalPlaylist, nT],
                        active: s.playlist.length,
                    }
                }
                return { ...s, active: index }
            }),
        [],
    )

    /**
     * Skips the active track by the specified offset. (Negative values are allowed)
     */
    const skipTrackBy = useCallback((offset: number) => {
        _setState(s => {
            const base = s.active === null ? 0 : s.active
            return {
                ...s,
                active: (base + offset) % s.playlist.length,
            }
        })
    }, [])

    /**
     * Skip to the previous track in the playlist.
     */
    const previousTrack = useCallback(() => skipTrackBy(-1), [skipTrackBy])

    /**
     * Skip to the next track in the playlist.
     */
    const nextTrack = useCallback(() => skipTrackBy(1), [skipTrackBy])

    const value: PlaylistProviderValue = useMemo(
        () => ({
            track: [state.active === null ? null : state.playlist[state.active], setTrack],
            playlist: [state.originalPlaylist, updatePlaylist],
            state: {
                mode: state.mode,
                shuffle: state.shuffle,
            },
            controls: {
                shuffle,
                unshuffle,
                toggleShuffle: state.shuffle ? unshuffle : shuffle,
                loop,
                unloop,
                toggleLoop: state.mode === 'repeat-one' ? unloop : loop,
                setTrack,
                skipTrackBy,
                previousTrack,
                nextTrack,
            },
        }),
        [
            shuffle,
            unshuffle,
            loop,
            unloop,
            setTrack,
            skipTrackBy,
            previousTrack,
            nextTrack,
            JSON.stringify(state.playlist),
            JSON.stringify(state.originalPlaylist),
            state.active,
            state.mode,
            state.shuffle,
        ],
    )

    return <PlaylistContext.Provider value={value}>{children}</PlaylistContext.Provider>
}
