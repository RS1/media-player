/* ┐
   │ File: media-session.ts [/src/media/utils/media-session.ts]
   │ Package: @rs1/media-player | RS1 Project
   │ Author: Andrea Corsini
   │ Created: April 20th, 2023 - 10:12:12
   │ Modified: April 27th, 2023 - 12:22:32
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

function setPlaybackActions(media: AugmentedMediaElement | null, forPlaylist: boolean) {
    setMediaSessionHandlers({
        play: () => media?.play(),
        pause: () => media?.pause(),
        stop: () => media?.pause(),
        seekto: ({ seekTime = 0 }) => media?.seekTo(seekTime),

        /* macOS Safari nor iOS support these actions
        when used together with `nexttrack` and `previoustrack` */
        seekbackward: (isIOS || isSafari) && forPlaylist ? null : ({ seekOffset }) => media?.skip(seekOffset || -10),
        seekforward: (isIOS || isSafari) && forPlaylist ? null : ({ seekOffset }) => media?.skip(seekOffset || +10),
        nexttrack: () => media?.next(),
        previoustrack: () => media?.previous(),
    })
}

export const setMediaSession = (
    media: AugmentedMediaElement | null,
    metadata: MediaSessionMetadata,
    forPlaylist: boolean,
) => {
    if (!('mediaSession' in navigator)) return
    try {
        setMetadata(metadata)
        setPlaybackState(media)
        setPosition(media)
        setPlaybackActions(media, forPlaylist)
    } catch (e) {
        console.error(e)
    }
}

export const initMediaSession = (media: AugmentedMediaElement | null, forPlaylist: boolean) => ({
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
            setPlaybackActions(media, forPlaylist)
        } catch (e) {
            console.error(e)
        }
    },
})
