/* ┐
   │ File: media-session.ts [/src/media/utils/media-session.ts]
   │ Package: @rs1/media-player | RS1 Project
   │ Author: Andrea Corsini
   │ Created: April 20th, 2023 - 10:12:12
   │ Modified: May 7th, 2023 - 13:35:10
   │ 
   │ Copyright (c) 2023 Andrea Corsini T/A RS1 Project.
   │ This work is licensed under the terms of the MIT License.
   │ For a copy, see https://opensource.org/licenses/MIT
   │ or the LICENSE file in the root of this project.
   └ */
import { AugmentedMediaElement } from '@media/hooks/use-augmented-media-ref'

import { isIOS, isSafari } from '@utils/device-detect'
import { guessSrcMimeType } from '@utils/mime-type'

export type MediaSessionHandlers = Partial<{ [key in MediaSessionAction]: MediaSessionActionHandler | null }>
function setMediaSessionHandlers(handlers: MediaSessionHandlers) {
    Object.entries(handlers).forEach(([action, handler]) => {
        navigator.mediaSession.setActionHandler(action as MediaSessionAction, handler)
    })
}

export type MediaSessionMetadata = {
    title?: string
    artist?: string
    album?: string
    artwork?: string
}
function setMetadata(metadata: MediaSessionMetadata) {
    const msMetadata = {
        title: metadata?.title,
        artist: metadata?.artist,
        album: metadata?.album,
        artwork: metadata?.artwork
            ? [{ src: metadata.artwork, type: guessSrcMimeType(metadata.artwork) ?? undefined }]
            : [],
    }
    if (typeof window !== 'undefined')
        navigator.mediaSession.metadata = new window.MediaMetadata(msMetadata)
    // console.log('setMetadata', msMetadata)
}

function setPlaybackState(media: AugmentedMediaElement | null) {
    navigator.mediaSession.playbackState = media?.isPlaying ? 'playing' : 'paused'
}

function setPosition(media: AugmentedMediaElement | null) {
    const duration = media?.getDuration() || 0
    const position = media?.getTime() || 0
    const playbackRate = media?.getPlaybackRate() ?? 1
    navigator.mediaSession.setPositionState({
        duration,
        position,
        playbackRate,
    })
}

function setPlaybackActions(
    media: AugmentedMediaElement | null,
    options: {
        forPlaylist: boolean
        canSeek: boolean
        canPause: boolean
    },
) {
    setMediaSessionHandlers({
        play: () => media?.play(),
        pause: options?.canPause ? () => media?.pause() : null,
        stop: () => media?.pause(),
        seekto: options?.canSeek ? ({ seekTime = 0 }) => media?.seekTo(seekTime) : null,

        /* macOS Safari nor iOS support these actions
        when used together with `nexttrack` and `previoustrack` */
        seekbackward: !options?.canSeek
            ? null
            : (isIOS || isSafari) && options?.forPlaylist
            ? null
            : ({ seekOffset }) => media?.skip(seekOffset || -10),
        seekforward: !options?.canSeek
            ? null
            : (isIOS || isSafari) && options?.forPlaylist
            ? null
            : ({ seekOffset }) => media?.skip(seekOffset || +10),
        nexttrack: () => media?.next(),
        previoustrack: () => media?.previous(),
    })
}

export const setMediaSession = (
    media: AugmentedMediaElement | null,
    metadata: MediaSessionMetadata,
    options: {
        forPlaylist: boolean
        canSeek: boolean
        canPause: boolean
    },
) => {
    if (!('mediaSession' in navigator)) return
    try {
        setMetadata(metadata)
        setPlaybackState(media)
        setPosition(media)
        setPlaybackActions(media, options)
    } catch (e) {
        console.error(e)
    }
}

export const initMediaSession = (
    media: AugmentedMediaElement | null,
    options: {
        forPlaylist: boolean
        canSeek: boolean
        canPause: boolean
    },
) => ({
    setMetadata(metadata: MediaSessionMetadata) {
        try {
            setMetadata(metadata)
        } catch (e) {
            console.error(e)
        }
    },
    refreshPlaybackState() {
        try {
            setPlaybackState(media)
        } catch (e) {
            console.error(e)
        }
    },
    refreshPosition() {
        try {
            setPosition(media)
        } catch (e) {
            console.error(e)
        }
    },
    refreshPlaybackActions() {
        try {
            setPlaybackActions(media, options)
        } catch (e) {
            console.error(e)
        }
    },
})
