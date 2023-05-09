/* ┐
   │ File: core.tsx [/src/media/providers/core.tsx]
   │ Package: @rs1/media-player | RS1 Project
   │ Author: Andrea Corsini
   │ Created: April 20th, 2023 - 22:30:44
   │ Modified: May 9th, 2023 - 14:35:35
   │ 
   │ Copyright (c) 2023 Andrea Corsini T/A RS1 Project.
   │ This work is licensed under the terms of the MIT License.
   │ For a copy, see https://opensource.org/licenses/MIT
   │ or the LICENSE file in the root of this project.
   └ */
import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef } from 'react'

import { useMediaControlsFactory } from '@media/factories/media-controls'
import { AugmentedMediaElement, useAugmentedMediaRef } from '@media/hooks/use-augmented-media-ref'
import { initMediaSession, MediaSessionMetadata } from '@media/utils/media-session'

import { MediaControls, PlaylistControls, PlaylistState, RawMediaTrack } from '../types'
import { ConfigContext } from './config'
import { PlaylistContext } from './playlist'
import { StateContext, StateUpdaterContext } from './state'
import { TimeUpdaterContext } from './time'

export type MediaProps = Partial<
    React.MediaHTMLAttributes<HTMLVideoElement> & React.VideoHTMLAttributes<HTMLVideoElement>
>

export interface CoreProviderValue {
    node: AugmentedMediaElement | null
    container: HTMLElement | null
    setRef: (node: HTMLMediaElement | null) => void
    setContainerRef: (node: HTMLElement | null) => void
    props: MediaProps
    controls: MediaControls
}

export type CoreProviderProps = React.PropsWithChildren

export const CoreContext = createContext<CoreProviderValue | null>(null)

export function CoreProvider(props: CoreProviderProps) {
    const { children } = props

    const updateMediaState = useContext(StateUpdaterContext) ?? (() => {})
    const mediaState = useContext(StateContext) ?? {}
    const updateTimeState = useContext(TimeUpdaterContext) ?? (() => {})

    const config = useContext(ConfigContext)
    const {
        track: [track = null] = [],
        controls: playlistControls = {} as PlaylistControls,
        state: { queue = [], mode: repeatMode = 'repeat-all' } = {} as PlaylistState,
    } = useContext(PlaylistContext) ?? {}

    const inPlaylist = queue.length > 1

    const handlePlaybackChange = useCallback((isPlaying: boolean) => {
        updateMediaState({ isPlaying })
    }, [])
    const handleTrackChange = useCallback(
        (offset: number) => playlistControls.skipTrackBy?.(offset),
        [playlistControls.skipTrackBy],
    )
    const [media, setMedia] = useAugmentedMediaRef({
        onPlaybackChange: handlePlaybackChange,
        onTrackChange: inPlaylist ? handleTrackChange : undefined,
    })

    const metadata: MediaSessionMetadata = useMemo(() => {
        const t: Omit<RawMediaTrack, 'src'> = track || {}
        return {
            ...(t.title ? { title: t.title } : {}),
            ...(t.artist ? { artist: t.artist } : {}),
            ...(t.album ? { album: t.album } : {}),
            ...(t.artwork ? { artwork: t.artwork } : {}),
        }
    }, [JSON.stringify(track)])
    const mediaSession = useMemo(
        () =>
            initMediaSession(media, {
                forPlaylist: inPlaylist,
                canSeek: config?.canSeek,
                canPause: config?.canPause,
            }),
        [media, inPlaylist, config?.canSeek, config?.canPause],
    )

    const mediaProps: MediaProps = useMemo(() => {
        return {
            onPlay: () => {
                // console.log('[media-element] onPlay')
                mediaSession.setMetadata(metadata)
                mediaSession.refreshPlaybackState()
                mediaSession.refreshPosition()
                mediaSession.refreshPlaybackActions()
                updateMediaState({
                    isWaiting: false,
                    isSeeking: false,
                    isLoaded: true,
                    isStalled: false,
                    isPlaying: true,
                    wasPlaying: true,
                })
            },
            onPlaying: () => {
                // console.log('[media-element] onPlaying')
                mediaSession.setMetadata(metadata)
                mediaSession.refreshPlaybackState()
                updateMediaState({
                    isWaiting: false,
                    isSeeking: false,
                    isLoaded: true,
                    isStalled: false,
                    isPlaying: true,
                    wasPlaying: true,
                })
            },
            onPause: () => {
                // console.log('[media-element] onPause')
                mediaSession.refreshPlaybackState()
                updateMediaState({ isPlaying: false, wasPlaying: false })
            },
            onEnded: () => {
                // console.log('[media-element] onEnded')
                mediaSession.refreshPlaybackState()
                updateMediaState({ isPlaying: false, wasPlaying: true })
                if (repeatMode === 'repeat-one') {
                    media?.seekTo(0)
                } else {
                    media?.next()
                }
            },
            onSeeking: () => {
                // console.log('[media-element] onSeeking')
                updateMediaState({ isSeeking: media?.isSeeking || false })
            },
            onSeeked: () => {
                // console.log('[media-element] onSeeked')
                mediaSession.refreshPosition()
                const time = media?.getTime() || 0
                updateMediaState({ isSeeking: false })
                updateTimeState({ time, progress: media?.getProgress() || 0 })
            },
            onStalled: () => {
                // console.log('[media-element] onStalled')
                updateMediaState({ isStalled: true })
            },
            onWaiting: () => {
                // console.log('[media-element] onWaiting')
                updateMediaState({ isWaiting: true, isStalled: true })
            },
            onCanPlay: () => {
                // console.log('[media-element] onCanPlay')
                updateMediaState({ isWaiting: false, isSeeking: false, isLoaded: true, isStalled: false })
                mediaState.wasPlaying && media?.play()
            },
            onCanPlayThrough: () => {
                // console.log('[media-element] onCanPlayThrough')
                updateMediaState({ isWaiting: false, isSeeking: false, isLoaded: true, isStalled: false })
            },
            onLoadStart: () => {
                // console.log('[media-element] onLoadStart')
                updateMediaState({ isLoaded: false })
            },
            onLoadedData: () => {
                // console.log('[media-element] onLoadedData')
                updateMediaState({ isLoaded: true, hasLoadedData: true })
            },
            onLoadedMetadata: () => {
                // console.log('[media-element] onLoadedMetadata')
                mediaSession.refreshPlaybackActions()
                // video instrinsic size is not available until this event
                let intrinsicSize: [number, number] = [512, 512]
                if (media?.current?.tagName === 'VIDEO') {
                    const { videoWidth, videoHeight } = media.current as HTMLVideoElement
                    intrinsicSize = [videoWidth, videoHeight]
                }
                updateMediaState({ isLoaded: true, hasLoadedMetadata: true, intrinsicSize })
                mediaState.wasPlaying && media?.play()
            },
            onError: () => {
                // console.log('[media-element] onError')
                // To do: find a way to get the error message from the event.
                // We are currently unable to get the error message from the event,
                // because video elements don't provide any information if they load
                // content from <source> elements. For the time being, we'll just
                // use a generic error message.
                updateMediaState({
                    hasError: 'An error occurred while loading the media',
                })
            },
            onAbort: () => {
                // console.log('[media-element] onAbort')
                updateMediaState({
                    isWaiting: false,
                    isSeeking: false,
                    isLoaded: true,
                    hasError: false,
                    isStalled: false,
                })
            },
            onEmptied: () => {
                // console.log('[media-element] onEmptied')
                updateMediaState({
                    isWaiting: false,
                    isSeeking: false,
                    isLoaded: true,
                    hasError: false,
                    isStalled: false,
                })
            },
            onTimeUpdate: () => {
                // console.log('[media-element] onTimeUpdate')
                mediaSession.refreshPosition()
                mediaSession.setMetadata(metadata)
                const time = media?.getTime() || 0
                updateTimeState({
                    time,
                    progress: media?.getProgress() || 0,
                })
                updateMediaState(s => (time > 0 && s.hasError ? { hasError: false } : s))
                const duration = media?.getDuration() || 0
                if (duration > 0 && time >= duration - 0.5) {
                    if (repeatMode === 'repeat-one') {
                        media?.seekTo(0)
                    } else {
                        media?.next()
                    }
                }
            },
            onDurationChange: () => {
                // console.log('[media-element] onDurationChange')

                /**
                 * This is a workaround for a bug in Safari where the duration
                 * returned by the media element is NaN or Infinity when there is an error
                 * loading one of the sources. Needs further investigation because
                 * Infinity is a valid duration value for HLS streams.
                 */
                const srcDuration = media?.current?.duration
                if (typeof srcDuration === 'undefined' || isNaN(srcDuration) || srcDuration === Infinity) {
                    updateMediaState({
                        hasError: 'An error occurred while loading the media',
                    })
                    return
                }

                mediaSession.refreshPosition()
                updateTimeState({
                    duration: media?.getDuration() || 0,
                    progress: media?.getProgress() || 0,
                    buffered: media?.getBuffered() || 0,
                })
            },
            onProgress: () => {
                // console.log('[media-element] onProgress')
                updateTimeState({ buffered: media?.getBuffered() || 0 })
                updateMediaState({ isStalled: false })
            },
            onVolumeChange: () => {
                // console.log('[media-element] onVolumeChange')
                updateMediaState({ volume: media?.getVolume() ?? 1, isMuted: media?.getMuted() ?? false })
            },
            onRateChange: () => {
                // console.log('[media-element] onRateChange')
                mediaSession.refreshPosition()
                updateMediaState({ playbackRate: media?.getPlaybackRate() ?? 1 })
            },
            poster: track?.thumbnail,
            preload: 'metadata',
            playsInline: true,
            autoPlay: mediaState.wasPlaying,
            muted: config?.muted,
            ['x-webkit-airplay']: config?.canAirPlay === false ? 'deny' : undefined,
            ['x-webkit-wirelessvideoplaybackdisabled']: config?.canRemotePlay === false ? true : undefined,
            disableRemotePlayback: config?.canRemotePlay === false ? true : undefined,
            disablePictureInPicture: config?.canPictureInPicture === false ? true : undefined,
            crossOrigin: track?.crossOrigin,
        }
    }, [
        media,
        mediaSession,
        config?.muted,
        config?.canAirPlay,
        config?.canPictureInPicture,
        JSON.stringify(track),
        mediaState.wasPlaying,
        repeatMode,
    ])

    useEffect(() => {
        media?.current?.load()
    }, [JSON.stringify(track)])

    const containerRef = useRef<HTMLElement | null>(null)
    const setContainerRef = useCallback((ref: HTMLElement | null) => {
        containerRef.current = ref
    }, [])

    const mediaControls = useMediaControlsFactory(media, containerRef.current)

    const value: CoreProviderValue = useMemo(
        () => ({
            node: media,
            container: containerRef?.current,
            setRef: setMedia,
            setContainerRef,
            props: mediaProps,
            controls: mediaControls,
        }),
        [media, containerRef, setMedia, mediaProps, mediaControls],
    )

    return <CoreContext.Provider value={value}>{children}</CoreContext.Provider>
}
