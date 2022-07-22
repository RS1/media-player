/*
 * *****************************************************************************
 * File: media.js (/src/components/media.js) | @rs1/media-player
 * Written by Andrea Corsini <andrea@rs1.it>
 * =============================================================
 * Created on Wednesday, 20th July 2022 10:19:10 am
 *
 * Copyright (c) 2020-2022 Andrea Corsini T/A RS1 Project - All rights reserved.
 * Unauthorized copying of this file, via any medium is strictly prohibited.
 * Proprietary and confidential.
 *
 * Modified on Friday, 22nd July 2022 1:41:23 pm
 * *****************************************************************************
 */

import React, {
    forwardRef,
    useCallback,
    useEffect,
    useRef,
    useState,
} from 'react'
import { useAgentParser } from '@rs1/react-hooks'
import { useCallbackRef } from 'use-callback-ref'

const useRefListener = (ref, events, callback) => {
    useEffect(() => {
        const _events = Array.isArray(events) ? events : [events]
        if (!ref || !callback) return
        for (const event of _events) ref.addEventListener(event, callback)
        return () => {
            for (const event of _events)
                ref.removeEventListener(event, callback)
        }
    }, [ref, callback])
}

function MediaElement(
    { src, tag, actions = {}, metadata = {}, onChange = () => {}, ...props },
    ref
) {
    const {
        onAbort = null,
        onCanPlay = null,
        onCanPlayThrough = null,
        onDurationChange = null,
        onEmptied = null,
        onEnded = null,
        onError = null,
        onFinish = null,
        onLoadedData = null,
        onLoadedMetadata = null,
        onLoadStart = null,
        onPause = null,
        onPlay = null,
        onPlaying = null,
        onProgress = null,
        onRateChange = null,
        onSeeked = null,
        onSeeking = null,
        onStalled = null,
        onSuspend = null,
        onTimeUpdate = null,
        onVolumeChange = null,
        onWaiting = null,
        onNextTrack = null,
        onPrevTrack = null,
    } = actions
    const {
        title = '',
        artist = '',
        album = '',
        poster = '',
        artwork = poster,
    } = metadata

    const {
        OS: { name: osName },
        browser: { name: browserName },
    } = useAgentParser()

    const [state, setState] = useState({
        wasPlaying: false,
        playing: false,
        waiting: false,
        seeking: false,
        error: false,
        loaded: false,
        loadeddata: false,
        loadedmetadata: false,
        currentTime: 0,
        duration: 0,
        progress: 0,
        volume: 1,
        playbackRate: 1,
    })

    const mediaElem = useCallbackRef(null, refNode => {
        if (ref) {
            ref.current = {
                node: refNode,
                play: () => {
                    silentCtx.current.play()
                    refNode.play()
                    setState(s => ({ ...s, playing: true, wasPlaying: true }))
                },
                pause: () => {
                    refNode.pause()
                    setState(s => ({ ...s, playing: false, wasPlaying: false }))
                },
                wait: () => {
                    refNode.pause()
                },
                seekTo: time => (refNode.currentTime = time),
                skip: time => (refNode.currentTime += time),
                duration:
                    refNode.duration && !isNaN(refNode.duration)
                        ? refNode.duration
                        : 0,
                currentTime:
                    refNode.currentTime && !isNaN(refNode.currentTime)
                        ? refNode.currentTime
                        : 0,
            }
        }
        setState(s => s)
    })

    useEffect(() => {
        onChange && onChange(state)
    }, [JSON.stringify(state)])

    const silentCtx = useRef()
    useEffect(() => {
        const AudioContext =
            window.AudioContext || window.webkitAudioContext || false
        if (!AudioContext) return
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
        silentCtx.current = audio
    }, [])

    const setSessionMetadata = useCallback(() => {
        if (!('mediaSession' in navigator)) return
        navigator.mediaSession.metadata = new window.MediaMetadata({
            title,
            artist,
            album,
            artwork: [{ src: artwork }],
        })
    }, [title, artist, album, artwork])

    const setSessionPlaybackState = useCallback(() => {
        if (!('mediaSession' in navigator)) return
        navigator.mediaSession.playbackState =
            !mediaElem.current || mediaElem.current.paused
                ? 'paused'
                : 'playing'
    }, [mediaElem.current])

    const setSessionPosition = useCallback(() => {
        if (!('mediaSession' in navigator)) return
        if (!mediaElem.current.duration || isNaN(mediaElem.current.duration))
            return
        try {
            navigator.mediaSession.setPositionState({
                duration: mediaElem.current ? mediaElem.current.duration : 0,
                position: mediaElem.current ? mediaElem.current.currentTime : 0,
                playbackRate: 1,
            })
        } catch (e) {
            console.error(e)
        }
    }, [mediaElem.current])

    const setSessionActionsHandlers = useCallback(() => {
        if (!('mediaSession' in navigator)) return
        const handlers = {
            play: () => ref.current.play(),
            pause: () => ref.current.pause(),
            seekto: ({ seekTime = 0 }) => ref.current.seekTo(seekTime),
            seekbackward:
                osName === 'iOS' || browserName === 'Safari'
                    ? null
                    : () => ref.current.skip(-10),
            seekforward:
                osName === 'iOS' || browserName === 'Safari'
                    ? null
                    : () => ref.current.skip(+10),
        }

        for (const action in handlers) {
            try {
                navigator.mediaSession.setActionHandler(
                    action,
                    handlers[action]
                )
            } catch (e) {
                console.error(e)
            }
        }
    }, [mediaElem.current, osName, browserName])

    const setSessionPlaylistActionsHandlers = useCallback(() => {
        if (!('mediaSession' in navigator)) return

        const handlers = {
            nexttrack: () => {
                ref.current.play()
                onNextTrack()
            },
            previoustrack: () => {
                if (mediaElem.current.currentTime <= 10) {
                    ref.current.play()
                    onPrevTrack()
                } else {
                    ref.current.seekTo(0)
                }
            },
        }

        for (const action in handlers) {
            try {
                navigator.mediaSession.setActionHandler(
                    action,
                    handlers[action]
                )
            } catch (e) {
                console.error(e)
            }
        }
    }, [mediaElem.current, onNextTrack, onPrevTrack])

    useRefListener(mediaElem.current, ['play', 'playing'], setSessionMetadata)
    useRefListener(
        mediaElem.current,
        ['play', 'playing', 'timeupdate'],
        setSessionPosition
    )
    useRefListener(
        mediaElem.current,
        ['play', 'playing'],
        setSessionActionsHandlers
    )
    useRefListener(
        mediaElem.current,
        ['play', 'playing'],
        setSessionPlaylistActionsHandlers
    )
    useRefListener(
        mediaElem.current,
        ['play', 'playing', 'pause', 'ended'],
        setSessionPlaybackState
    )

    useRefListener(mediaElem.current, ['playing'], () =>
        setState(s => ({
            ...s,
            waiting: false,
            seeking: false,
            loaded: true,
            playing: true,
        }))
    )
    useRefListener(mediaElem.current, ['error'], () => {
        console.error(
            `Media Error: ${mediaElem.current.error.message} (${mediaElem.current.error.code})
            src: ${mediaElem.current.src}`
        )
        setState(s => ({ ...s, error: true }))
    })
    useRefListener(mediaElem.current, ['seeking'], () =>
        setState(s => ({ ...s, seeking: true }))
    )
    useRefListener(mediaElem.current, ['seeked'], () =>
        setState(s => ({ ...s, seeking: false }))
    )
    useRefListener(mediaElem.current, ['waiting'], () =>
        setState(s => ({ ...s, waiting: true }))
    )
    useRefListener(mediaElem.current, ['canplay', 'canplaythrough'], () =>
        setState(s => ({ ...s, waiting: false, seeking: false, loaded: true }))
    )
    useRefListener(mediaElem.current, ['loadstart'], () =>
        setState(s => ({ ...s, loaded: false }))
    )
    useRefListener(mediaElem.current, ['loadeddata'], () =>
        setState(s => ({ ...s, loaded: true, loadeddata: true }))
    )
    useRefListener(mediaElem.current, ['loadedmetadata'], () =>
        setState(s => ({ ...s, loaded: true, loadedmetadata: true }))
    )
    useRefListener(mediaElem.current, ['abort', 'emptied'], () =>
        setState(s => ({
            ...s,
            error: false,
            waiting: false,
            seeking: false,
            loaded: true,
        }))
    )
    useRefListener(mediaElem.current, ['timeupdate'], () => {
        const limit = 0.5
        if (
            onFinish &&
            mediaElem.current.duration &&
            !isNaN(mediaElem.current.duration) &&
            mediaElem.current.currentTime >= mediaElem.current.duration - limit
        ) {
            onFinish()
        }
    })

    useRefListener(mediaElem.current, ['timeupdate'], () =>
        setState(s => ({
            ...s,
            waiting: false,
            currentTime: mediaElem.current.currentTime,
        }))
    )
    useRefListener(mediaElem.current, ['durationchange'], () =>
        setState(s => ({
            ...s,
            waiting: false,
            duration: mediaElem.current.duration,
        }))
    )
    useRefListener(mediaElem.current, ['progress'], () =>
        setState(s => ({
            ...s,
            progress: mediaElem.current.buffered.length
                ? mediaElem.current.buffered.end(0) / mediaElem.current.duration
                : 0,
        }))
    )
    useRefListener(mediaElem.current, ['volumechange'], () =>
        setState(s => ({ ...s, volume: mediaElem.current.volume }))
    )
    useRefListener(mediaElem.current, ['ratechange'], () =>
        setState(s => ({ ...s, playbackRate: mediaElem.current.playbackRate }))
    )

    useRefListener(mediaElem.current, 'abort', onAbort)
    useRefListener(mediaElem.current, 'canplay', onCanPlay)
    useRefListener(mediaElem.current, 'canplaythrough', onCanPlayThrough)
    useRefListener(mediaElem.current, 'durationchange', onDurationChange)
    useRefListener(mediaElem.current, 'emptied', onEmptied)
    useRefListener(mediaElem.current, 'ended', onEnded)
    useRefListener(mediaElem.current, 'error', onError)
    useRefListener(mediaElem.current, 'loadeddata', onLoadedData)
    useRefListener(mediaElem.current, 'loadedmetadata', onLoadedMetadata)
    useRefListener(mediaElem.current, 'loadstart', onLoadStart)
    useRefListener(mediaElem.current, 'pause', onPause)
    useRefListener(mediaElem.current, 'play', onPlay)
    useRefListener(mediaElem.current, 'playing', onPlaying)
    useRefListener(mediaElem.current, 'progress', onProgress)
    useRefListener(mediaElem.current, 'ratechange', onRateChange)
    useRefListener(mediaElem.current, 'seeked', onSeeked)
    useRefListener(mediaElem.current, 'seeking', onSeeking)
    useRefListener(mediaElem.current, 'stalled', onStalled)
    useRefListener(mediaElem.current, 'suspend', onSuspend)
    useRefListener(mediaElem.current, 'timeupdate', onTimeUpdate)
    useRefListener(mediaElem.current, 'volumechange', onVolumeChange)
    useRefListener(mediaElem.current, 'waiting', onWaiting)

    return (
        <video
            ref={mediaElem}
            src={src}
            title={[title, artist, album].filter(Boolean).join(' — ')}
            poster={poster}
            preload='metadata'
            {...props}
            autoPlay={props?.autoPlay || state.wasPlaying}
        />
    )
}

export default forwardRef(MediaElement)
