/*
 * *****************************************************************************
 * File: player.js (/src/components/player.js) | @rs1/media-player
 * Written by Andrea Corsini <andrea@rs1.it>
 * =============================================================
 * Created on Tuesday, 10th November 2020 5:54:42 pm
 *
 * Copyright (c) 2020 RS1 Project
 * License: Apache License 2.0
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Modified on Friday, 13th November 2020 3:26:39 pm
 * *****************************************************************************
 */

import React, { useEffect, useContext, useCallback, useState } from 'react'
import styled from '@emotion/styled'

import Context from '../context'

import Error from './error'
import Loading from './loading'
import Controls from './controls'
import MiniControls from './mini-controls'
import IconFlasher from './icon-flasher'

import {
    useDynamicRef,
    useAutoIdle,
    useListener,
    // useAgentParser,
    useRectRef,
    useKeyAction,
} from '@rs1/react-hooks'
import { AnimatePresence } from 'framer-motion'

const rectInRect = ([a, b], [x, y]) =>
    a / b < x / y ? [(a * y) / b, y] : [x, (b * x) / a]

export default ({ config, media: track, ...props }) => {
    // const { isTouch } = useAgentParser()
    const [flashIcon, setFlashIcon] = useState(false)
    const [settings, setSettings] = useContext(Context)
    const { metadata, state, options, actions, style, icons } = settings

    const [container, containerRef] = useRectRef()
    const [wrapper, wrapperRef, updateWrapperRef] = useDynamicRef()
    const [video, videoRef, updateVideoRef] = useDynamicRef()
    const [audio, audioRef, updateAudioRef] = useDynamicRef()
    const media = metadata.video ? video : audio

    useEffect(() => {
        if (track) {
            setSettings({ metadata: track })
            updateVideoRef()
            updateAudioRef()
        }
    }, [track])

    useEffect(() => {
        config && setSettings({ config: config })
    }, [config])

    useEffect(() => {
        setSettings({ reset: 'reset' })
    }, [metadata.src])

    const [, resetIdle] = useAutoIdle(wrapper, {
        callback: idle => setSettings({ immersive: idle }),
        wait: options.autoHideControls || 5,
        condition: state.playing && options.autoHideControls > 0,
    })

    useEffect(() => {
        updateWrapperRef()
    }, [JSON.stringify(state.playerRect)])

    useEffect(() => {
        if (!options.autoResize) {
            setSettings({ playerRect: options.playerSize })
            return
        }
        const [w, h] = rectInRect(state.mediaRect, [
            container.width,
            container.height,
        ])
        setSettings({ playerRect: [Math.floor(w), Math.floor(h)] })
    }, [
        container,
        options.autoResize,
        JSON.stringify(options.playerSize),
        JSON.stringify(state.mediaRect),
    ])

    useEffect(() => {
        state.error && actions.onError()
    }, [state.error, actions.onError])
    useEffect(() => {
        actions.onTimeChanged(state.time * state.duration || 0)
    }, [state.time, state.duration, actions.onTimeChanged])
    useEffect(() => {
        actions.onDurationChanged(state.duration || 0)
    }, [state.duration, actions.onDurationChanged])
    useEffect(() => {
        actions.onPlayingChanged(state.playing)
    }, [state.playing, actions.onPlayingChanged])
    useEffect(() => {
        actions.onBufferChanged(state.progress)
    }, [state.progress, actions.onBufferChanged])
    useEffect(() => {
        actions.onLoadingChanged(!state.loaded && !state.duration)
        actions.onSeekingChanged(!state.loaded && state.duration)
    }, [
        state.duration,
        state.loaded,
        actions.onLoadingChanged,
        actions.onSeekingChanged,
    ])
    useEffect(() => {
        actions.onMuteChanged(state.muted)
    }, [state.muted, actions.onMuteChanged])
    useEffect(() => {
        actions.onFullScreenChanged(state.fullscreen)
    }, [state.fullscreen, actions.onFullScreenChanged])
    useEffect(() => {
        actions.onStateChanged({
            error: state.error,
            time: state.time * state.duration || 0,
            duration: state.duration || 0,
            playing: state.playing,
            buffer: state.progress,
            loading: !state.loaded && !state.duration,
            seeking: !state.loaded && state.duration,
            muted: state.muted,
            fullscreen: state.fullscreen,
        })
    }, [
        state.error,
        state.time,
        state.duration,
        state.playing,
        state.progress,
        state.loaded,
        state.muted,
        state.fullscreen,
    ])

    useListener(
        media,
        'error',
        e => {
            setSettings({ error: true, loaded: true, duration: 0, time: 0 })
        },
        []
    )

    useListener(
        media,
        'progress',
        e => {
            const media = e.currentTarget
            if (media.buffered.length > 0) {
                const bufferedEnd = media.buffered.end(
                    media.buffered.length - 1
                )
                const duration = media.duration
                if (duration > 0) {
                    setSettings({ progress: bufferedEnd / duration })
                }
            }
        },
        []
    )

    useListener(
        media,
        'pause',
        e => {
            if (state.wasPlaying) {
                setSettings({ wasPlaying: false })
                media.play()
            } else if (state.playing) {
                setSettings({ playing: false })
            }
        },
        [state.wasPlaying, state.playing]
    )

    useListener(
        media,
        'play',
        e => {
            if (!state.playing) {
                setSettings({ playing: true })
            }
        },
        [state.playing]
    )

    useListener(
        media,
        'loadedmetadata',
        e => {
            const media = e.currentTarget
            const extra = { mediaRect: options.playerSize }
            if (media.tagName === 'VIDEO')
                extra.mediaRect = [media.videoWidth, media.videoHeight]
            setSettings({ duration: media.duration, loaded: true, ...extra })
            if (state.playing && media.paused) media.play()
            else if (!state.playing && !media.paused) media.pause()
        },
        [state.playing, JSON.stringify(options.playerSize)]
    )

    useListener(
        media,
        'timeupdate',
        e => {
            const media = e.currentTarget
            if (media.duration && media.currentTime >= media.duration) {
                setSettings({ wasPlaying: true })
                next()
                return
            }
            const time = media.currentTime / media.duration || 0
            setSettings({ time: time, loaded: true })
        },
        [actions.onNext, icons.next, options.loop, options.isPlaylist]
    )

    /* useListener(media, 'ended', next, [
        actions.onNext,
        icons.next,
        options.loop,
        options.isPlaylist,
    ]) */

    useListener(
        media,
        'seeking',
        e => {
            setSettings({ loaded: false })
        },
        []
    )

    const togglePlay = useCallback(
        e => {
            if (state.immersive && e) return
            if (state.playing) {
                media.pause()
                setFlashIcon(icons.pause)
            } else {
                media.play()
                setFlashIcon(icons.play)
            }
            resetIdle()
            // setSettings({ toggle: 'playing' });
        },
        [media, state.playing, state.immersive, icons.pause, icons.play]
    )
    useKeyAction(
        32 /* __ space */,
        togglePlay,
        [media, state.playing, state.immersive, icons.pause, icons.play],
        false
    )

    const previous = useCallback(() => {
        setFlashIcon(icons.previous)
        setSettings({ time: 0 })
        media.currentTime = 0
        if (!options.isPlaylist) return
        if (state.time * state.duration <= 5) {
            setSettings({ reset: 'reset' })
            actions.onPrevious()
        }
    }, [
        media,
        state.time,
        state.duration,
        actions.onPrevious,
        icons.previous,
        options.isPlaylist,
    ])
    const semiPrevious = useCallback(() => {
        if (state.time * state.duration <= 10) return previous()
        const toTime = state.time * state.duration - 10
        setSettings({
            time: toTime / state.duration,
        })
        media.currentTime = toTime || 0
        setFlashIcon(icons.backward10)
    }, [
        media,
        state.time,
        state.duration,
        actions.onPrevious,
        icons.backward10,
        icons.previous,
        options.isPlaylist,
    ])
    useKeyAction(
        37 /* <- left */,
        semiPrevious,
        [
            media,
            state.time,
            state.duration,
            actions.onPrevious,
            icons.backward10,
            icons.previous,
            options.isPlaylist,
        ],
        false
    )

    const next = useCallback(() => {
        setFlashIcon(icons.next)
        if (!options.loop && !options.isPlaylist) return
        media.currentTime = 0
        setSettings({ time: 0 })
        if (options.isPlaylist) {
            setSettings({ reset: 'reset' })
            actions.onNext()
        }
    }, [media, actions.onNext, icons.next, options.loop, options.isPlaylist])
    const semiNext = useCallback(() => {
        const toTime = state.time * state.duration + 10
        if (toTime >= state.duration) return next()
        setSettings({
            time: toTime / state.duration,
        })
        media.currentTime = toTime || 0
        setFlashIcon(icons.forward10)
    }, [
        media,
        state.time,
        state.duration,
        actions.onNext,
        icons.forward10,
        icons.next,
        options.loop,
        options.isPlaylist,
    ])
    useKeyAction(
        39 /* -> right */,
        semiNext,
        [
            media,
            state.time,
            state.duration,
            actions.onNext,
            icons.forward10,
            icons.next,
            options.loop,
            options.isPlaylist,
        ],
        false
    )

    const controlsHidden = { opacity: 0, scaleY: 0, originY: 1 }
    const controlsVisible = { opacity: 1, scaleY: 1, originY: 1 }

    return (
        <Container styling={style} ref={containerRef}>
            <Wrapper
                ref={wrapperRef}
                isImmersive={state.immersive}
                widthRatio={!state.fullscreen && state.playerRect[0]}
                heightRatio={!state.fullscreen && state.playerRect[1]}
            >
                <Media
                    ref={metadata.video ? videoRef : audioRef}
                    as={metadata.video ? 'video' : 'audio'}
                    src={metadata.src}
                    poster={metadata.poster}
                    preload='metadata'
                    muted={state.muted}
                    onClick={togglePlay}
                    loop={options.loop}
                    autoPlay={options.autoPlay}
                    playsInline
                />
                {state.error ? (
                    <Error settings={settings} />
                ) : state.duration === 0 ? (
                    <Loading settings={settings} />
                ) : (
                    <AnimatePresence>
                        {!metadata.video && (
                            <Poster onClick={togglePlay} bg={metadata.poster} />
                        )}
                        {state.immersive && options.metadataOnMedia && (
                            <MiniControls
                                key='mini-player-controls'
                                settings={settings}
                                initial={controlsHidden}
                                animate={controlsVisible}
                                exit={controlsHidden}
                            />
                        )}
                        {!state.immersive && (
                            <Controls
                                key='full-player-controls'
                                settings={settings}
                                setSettings={setSettings}
                                toggle={togglePlay}
                                previous={previous}
                                semiPrevious={semiPrevious}
                                next={next}
                                semiNext={semiNext}
                                container={wrapper}
                                mediaElem={media}
                                initial={controlsHidden}
                                animate={controlsVisible}
                                exit={controlsHidden}
                            />
                        )}
                    </AnimatePresence>
                )}
                <IconFlasher icon={flashIcon} onEnd={setFlashIcon} />
            </Wrapper>
        </Container>
    )
}

const Wrapper = styled.div`
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    transition: all 0.3s ease-in-out;
    user-select: none;
    cursor: ${props => (props.isImmersive ? 'none' : 'default')};
    width: ${props => (!props.widthRatio ? '100%' : props.widthRatio + 'px')};
    height: ${props =>
        !props.heightRatio ? '100%' : props.heightRatio + 'px'};
`

const Media = styled.video`
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    border-radius: 0px;
`

const Poster = styled.div`
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    border-radius: 0px;
    background-image: url('${props => props.bg}');
    background-position: center;
    background-size: contain;
    background-repeat: no-repeat;
`

const Container = styled.div`
    width: 100%;
    height: 100%;
    position: absolute;
    display: flex;
    align-items: center;
    justify-content: center;
    font-family: '${props => props.styling.fontFamily}', sans-serif;
    & ${Poster}, ${Media}, ${Wrapper} {
        background-color: ${props => props.styling.mediaBackground};
    }
`
