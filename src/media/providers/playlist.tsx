/* ┐
   │ File: playlist.tsx [/src/media/providers/playlist.tsx]
   │ Package: @rs1/media-player | RS1 Project
   │ Author: Andrea Corsini
   │ Created: April 20th, 2023 - 14:29:27
   │ Modified: May 6th, 2023 - 15:35:18
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

import { MediaPlaylist, MediaTrack, PlaylistControls, PlaylistState, RawMediaPlaylist, RawMediaTrack } from '../types'
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
        (
            track:
                | RawMediaTrack
                | string
                | number
                | null
                | ((track: MediaTrack | null) => RawMediaTrack | string | number | null),
        ) => void,
    ]
    /**
     * The current playlist returned as a tuple. (mimics the `useState` hook)
     * The first element is the current playlist, the second element is a function to update the playlist.
     * The setter function accepts a `MediaPlaylist` or a function that given the current playlist returns the new playlist.
     * Both the playlist and the setter function are memoized.
     */
    playlist: [
        MediaPlaylist | null,
        (
            playlist:
                | RawMediaPlaylist
                | string
                | number
                | null
                | ((
                      playlist: MediaPlaylist | null,
                      track: MediaTrack | null,
                  ) => RawMediaPlaylist | string | number | null),
            track:
                | RawMediaTrack
                | string
                | number
                | null
                | ((
                      playlist: MediaPlaylist | null,
                      track: MediaTrack | null,
                  ) => RawMediaTrack | string | number | null),
        ) => void,
    ]
    /**
     * The current collection of playlists returned as a tuple. (mimics the `useState` hook)
     * The first element is the current collection of playlists, the second element is a function to update the collection.
     * The setter function accepts a `MediaPlaylist` array or a function that given the current collection returns the new collection.
     * Both the collection and the setter function are memoized.
     */
    collection: [
        MediaPlaylist[],
        (
            collection:
                | RawMediaPlaylist[]
                | RawMediaPlaylist
                | ((collection: MediaPlaylist[]) => RawMediaPlaylist[] | RawMediaPlaylist),
        ) => void,
    ]
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
    playlist: RawMediaPlaylist | RawMediaPlaylist[]
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
     * A collection of playlists.
     * Each playlist is a collection of tracks.
     */
    playlistCollection: MediaPlaylist[]
    /**
     * The current tracklist.
     * This could be the original tracklist or a filtered/shuffled version of it.
     */
    tracklist: MediaTrack[]
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
    activeTrack: number | null
    /**
     * The index of the active playlist in the playlist collection.
     * If `null`, no playlist is active.
     */
    activePlaylist: number | null
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

function normalizePlaylist(playlist: RawMediaPlaylist, index: number): MediaPlaylist {
    const id = typeof playlist.id !== 'undefined' ? `${playlist.id}` : `playlist-${index}`

    return {
        ...playlist,
        id: id,
        tracks: playlist.tracks?.map(normalizeTrack) ?? [],
    }
}

export function PlaylistProvider(props: PlaylistProviderProps) {
    const { children, playlist: initialPlaylist, track: initialTrack } = props

    const config = useContext(ConfigContext)

    const [state, _setState] = useState<PlaylistInternalState>(() => {
        if (initialTrack && !initialPlaylist) {
            const c = [normalizePlaylist({ id: 'playlist-0', tracks: [initialTrack] }, 0)]
            return {
                playlistCollection: c,
                tracklist: c[0].tracks,

                mode: config.loop ? 'repeat-one' : 'repeat',
                shuffle: false,

                activeTrack: 0,
                activePlaylist: 0,
            }
        }

        const collection = (
            !initialPlaylist ? [] : Array.isArray(initialPlaylist) ? initialPlaylist : [initialPlaylist]
        ).map(normalizePlaylist)
        let activePlaylist = -1
        let activeTrack = -1
        if (initialTrack) {
            const track = normalizeTrack(initialTrack, 0)
            activePlaylist = collection.findIndex(p => p.tracks.some(t => t.id === track.id))
            if (activePlaylist !== -1) {
                activeTrack = collection[activePlaylist].tracks.findIndex(t => t.id === track.id)
            }
        }
        const tracklist = collection[activePlaylist !== -1 ? activePlaylist : 0].tracks

        return {
            playlistCollection: collection,
            tracklist: tracklist,
            mode: config.loop ? 'repeat-one' : 'repeat',
            shuffle: false,
            activePlaylist: !collection.length ? null : clamp(activePlaylist, 0, collection.length - 1),
            activeTrack: !tracklist.length ? null : clamp(activeTrack, 0, tracklist.length - 1),
        }
    })

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
            const p = s.activePlaylist !== null ? shuffleArray(s.playlistCollection[s.activePlaylist].tracks) : []
            const a = p.length && s.activeTrack !== null ? s.tracklist[s.activeTrack] : null
            const active = a ? p.findIndex(t => t.id === a.id) : null

            return {
                ...s,
                tracklist: p,
                activeTrack: active,
                shuffle: true,
            }
        })
    }, [])

    const unshuffle = useCallback(() => {
        _setState(s => {
            const a = s.activeTrack !== null ? s.tracklist[s.activeTrack] : null
            const active =
                a && s.activePlaylist
                    ? s.playlistCollection[s.activePlaylist].tracks.findIndex(t => t.id === a.id)
                    : null

            return {
                ...s,
                tracklist: s.activePlaylist !== null ? s.playlistCollection[s.activePlaylist].tracks : [],
                activeTrack: active,
                shuffle: false,
            }
        })
    }, [])

    const setPlaylistCollection = useCallback(
        (
            collection:
                | RawMediaPlaylist[]
                | RawMediaPlaylist
                | ((collection: MediaPlaylist[]) => RawMediaPlaylist[] | RawMediaPlaylist),
        ) => {
            _setState(s => {
                const _c = typeof collection === 'function' ? collection(s.playlistCollection) : collection
                const c = (Array.isArray(_c) ? _c : [_c]).map(normalizePlaylist)

                const currentPlaylist = s.activePlaylist !== null ? s.playlistCollection[s.activePlaylist] : null
                const currentTrack = s.activeTrack !== null ? s.tracklist[s.activeTrack] : null

                let activePlaylist = currentPlaylist ? c.findIndex(p => p.id === currentPlaylist.id) : null
                activePlaylist = activePlaylist === -1 ? null : activePlaylist
                const tracklist =
                    activePlaylist === null
                        ? []
                        : s.shuffle
                        ? shuffleArray(c[activePlaylist].tracks)
                        : c[activePlaylist].tracks
                let activeTrack =
                    currentTrack && activePlaylist ? tracklist.findIndex(t => t.id === currentTrack.id) : null
                activeTrack = activeTrack === -1 ? null : activeTrack

                return {
                    ...s,
                    playlistCollection: c,
                    tracklist: tracklist,
                    activePlaylist: activePlaylist,
                    activeTrack: activeTrack,
                }
            })
        },
        [_setState],
    )

    /**
     * Setter function for returned `playlist` tuple.
     * Works like the `setState` function returned by the `useState` hook.
     */
    const setPlaylist = useCallback(
        (
            playlist:
                | RawMediaPlaylist
                | string
                | number
                | null
                | ((
                      playlist: MediaPlaylist | null,
                      track: MediaTrack | null,
                  ) => RawMediaPlaylist | string | number | null),
            track:
                | RawMediaTrack
                | string
                | number
                | null
                | ((
                      playlist: MediaPlaylist | null,
                      track: MediaTrack | null,
                  ) => RawMediaTrack | string | number | null) = 0,
        ) => {
            _setState(s => {
                const activeTrack = s.activeTrack === null ? null : s.tracklist[s.activeTrack]
                const activePlaylist = s.activePlaylist === null ? null : s.playlistCollection[s.activePlaylist]
                const p = typeof playlist === 'function' ? playlist(activePlaylist, activeTrack) : playlist
                const t = typeof track === 'function' ? track(activePlaylist, activeTrack) : track
                if (p === s.activePlaylist) return s

                let index: number | null = null
                if (typeof p === 'number') {
                    index = clamp(p, 0, s.playlistCollection.length - 1)
                } else if (typeof p === 'string') {
                    const match = s.playlistCollection.findIndex(pl => pl.id === p)
                    if (match !== -1) {
                        index = match
                    }
                } else if (p !== null) {
                    const normalP = normalizePlaylist(p, s.playlistCollection.length)
                    const match = s.playlistCollection.findIndex(pl => pl.id === normalP.id)
                    if (match !== -1) {
                        index = match
                    } else {
                        index = s.playlistCollection.length
                    }
                }

                if (index === null) {
                    return {
                        ...s,
                        tracklist: [],
                        activePlaylist: null,
                        activeTrack: null,
                    }
                }

                const collection =
                    index < s.playlistCollection.length
                        ? s.playlistCollection
                        : [...s.playlistCollection, normalizePlaylist(p as RawMediaPlaylist, index)]
                const tracklist = collection[index].tracks
                const shuffled = s.shuffle ? shuffleArray(tracklist) : tracklist
                // Find the index in shuffled of the track `0` in tracklist
                const selectedTrack =
                    t === null
                        ? 0
                        : shuffled.findIndex(
                              t =>
                                  t.id ===
                                  (typeof t === 'number'
                                      ? tracklist[clamp(t, 0, tracklist.length)].id
                                      : typeof t === 'string'
                                      ? t
                                      : t.id),
                          )
                return {
                    ...s,
                    playlistCollection: collection,
                    tracklist: shuffled,
                    activePlaylist: index,
                    activeTrack: selectedTrack,
                }
            })
        },
        [],
    )

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
                const t =
                    typeof track === 'function'
                        ? track(s.activeTrack === null ? null : s.tracklist[s.activeTrack])
                        : track
                if (t === null) {
                    return { ...s, activeTrack: null }
                }

                if (typeof t === 'number') {
                    // find the track in the original playlist
                    const original =
                        s.activePlaylist === null
                            ? null
                            : s.playlistCollection[s.activePlaylist].tracks[clamp(t, 0, s.tracklist.length - 1)]
                    if (!original) return { ...s, activeTrack: null }
                    // find the track in the current playlist
                    const index = s.tracklist.findIndex(_t => _t.id === original.id)
                    return { ...s, activeTrack: index < 0 ? null : index }
                }

                if (typeof t === 'string') {
                    // find the track in the original playlist
                    const original =
                        s.activePlaylist === null
                            ? null
                            : s.playlistCollection[s.activePlaylist].tracks.find(_t => _t.id === t)
                    let playlist, track, tracklist
                    if (!original) {
                        // search in other playlists
                        const match = s.playlistCollection.findIndex(pl => pl.tracks.find(_t => _t.id === t))
                        if (match === -1) return { ...s, activeTrack: null }

                        playlist = match
                        tracklist = s.playlistCollection[match].tracks
                        if (s.shuffle) tracklist = shuffleArray(tracklist)
                        track = tracklist.findIndex(_t => _t.id === t)
                    } else {
                        playlist = s.activePlaylist
                        tracklist = s.tracklist
                        track = s.tracklist.findIndex(_t => _t.id === t)
                    }
                    return {
                        ...s,
                        tracklist,
                        activePlaylist: playlist,
                        activeTrack: track < 0 ? null : track,
                    }
                }

                const nT = normalizeTrack(t, s.tracklist.length)
                const index = s.tracklist.findIndex(t => t.id === nT.id)
                if (index === -1) {
                    // search in other playlists
                    const match = s.playlistCollection.findIndex(pl => pl.tracks.find(_t => _t.id === nT.id))
                    if (match >= 0) {
                        const playlist = match
                        let tracklist = s.playlistCollection[match].tracks
                        if (s.shuffle) tracklist = shuffleArray(tracklist)
                        const track = tracklist.findIndex(_t => _t.id === nT.id)
                        return {
                            ...s,
                            tracklist,
                            activePlaylist: playlist,
                            activeTrack: track < 0 ? null : track,
                        }
                    }
                    // add to current playlist
                    const collection = [...s.playlistCollection]
                    if (s.activePlaylist === null) {
                        return {
                            ...s,
                            activeTrack: null,
                        }
                    }
                    const playlist = s.playlistCollection[s.activePlaylist]
                    playlist.tracks = [...playlist.tracks, nT]
                    const tracklist = s.shuffle ? shuffleArray(playlist.tracks) : playlist.tracks
                    const track = tracklist.findIndex(_t => _t.id === nT.id)
                    collection[s.activePlaylist] = playlist

                    return {
                        ...s,
                        playlistCollection: collection,
                        tracklist,
                        activeTrack: track < 0 ? null : track,
                    }
                }
                return { ...s, activeTrack: index }
            }),
        [],
    )

    /**
     * Skips the active track by the specified offset. (Negative values are allowed)
     */
    const skipTrackBy = useCallback((offset: number) => {
        _setState(s => {
            const base = s.activeTrack === null ? 0 : s.activeTrack
            return {
                ...s,
                active: (base + offset) % s.tracklist.length,
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
            track: [state.activeTrack === null ? null : state.tracklist[state.activeTrack], setTrack],
            playlist: [
                state.activePlaylist === null ? null : state.playlistCollection[state.activePlaylist],
                setPlaylist,
            ],
            collection: [state.playlistCollection, setPlaylistCollection],
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
            setPlaylist,
            setPlaylistCollection,
            skipTrackBy,
            previousTrack,
            nextTrack,
            JSON.stringify(state.tracklist),
            JSON.stringify(state.playlistCollection),
            state.activeTrack,
            state.activePlaylist,
            state.mode,
            state.shuffle,
        ],
    )

    return <PlaylistContext.Provider value={value}>{children}</PlaylistContext.Provider>
}
