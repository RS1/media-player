/*
 * *****************************************************************************
 * File: player.js (/src/components/player.js) | @rs1/media-player
 * Written by Andrea Corsini <andrea@rs1.it>
 * =============================================================
 * Created on Tuesday, 10th November 2020 5:54:42 pm
 *
 * Copyright (c) 2020 - 2021 RS1 Project
 * License: Apache License 2.0
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Modified on Saturday, 2nd January 2021 6:31:39 pm
 * *****************************************************************************
 */

import React, { useEffect, useContext, useCallback, useState } from 'react'
import { keyframes } from '@emotion/core'
import styled from '@emotion/styled'

import Context from '../context'

import ErrorMessage from './error'
import Loading from './loading'
import Controls from './controls'
import MiniControls from './mini-controls'
import IconFlasher from './icon-flasher'

import {
    useDynamicRef,
    useAutoIdle,
    useListener,
    useAgentParser,
    useRectRef,
    useKeyAction,
} from '@rs1/react-hooks'
import { AnimatePresence } from 'framer-motion'

const rectInRect = ([a, b], [x, y]) =>
    a / b < x / y ? [(a * y) / b, y] : [x, (b * x) / a]

export default ({ config, media: track, ...props }) => {
    const { isTouch } = useAgentParser()
    const [flashIcon, setFlashIcon] = useState(false)
    const [configLoaded, setConfigLoaded] = useState(false)
    const [settings, setSettings] = useContext(Context)
    const { metadata, state, options, actions, style, icons } = settings

    const [container, containerRef] = useRectRef()
    const [wrapper, wrapperRef, updateWrapperRef] = useDynamicRef()
    const [vinyl, vinylRef, updateVinyl] = useRectRef({
        useOffset: true,
        delay: 0,
    })
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
        setConfigLoaded(true)
        config && setSettings({ config: config })
        updateVinyl()
    }, [config])

    useEffect(() => {
        setSettings({ reset: 'reset' })
    }, [metadata.src])

    const [, resetIdle] = useAutoIdle(wrapper, {
        callback: idle => setSettings({ immersive: idle }),
        wait: options.autoHideControls || 5,
        condition:
            state.playing &&
            state.loaded &&
            options.autoHideControls > 0 &&
            !options.vinylMode,
    })

    useEffect(() => {
        updateWrapperRef()
    }, [JSON.stringify(state.playerRect)])

    useEffect(() => {
        if (!options.autoResize && !options.vinylMode) {
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
        options.vinylMode,
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
            const extra = {
                mediaRect: options.vinylMode ? [1, 1] : options.playerSize,
            }
            if (media.tagName === 'VIDEO')
                extra.mediaRect = [media.videoWidth, media.videoHeight]
            setSettings({ duration: media.duration, loaded: true, ...extra })
            if (state.playing && media.paused) media.play()
            else if (!state.playing && !media.paused) media.pause()
        },
        [state.playing, options.vinylMode, JSON.stringify(options.playerSize)]
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

    useListener(
        media,
        'waiting',
        e => {
            setSettings({ loaded: false })
            resetIdle()
        },
        []
    )

    const togglePlay = useCallback(
        e => {
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

    const controlsAnim = {
        hide: { opacity: 0, scaleY: 0, originY: 1 },
        show: { opacity: 1, scaleY: 1, originY: 1 },
    }

    return (
        <Container styling={style} ref={containerRef} show={configLoaded}>
            <Wrapper
                ref={wrapperRef}
                isImmersive={state.immersive}
                isVinyl={options.vinylMode}
                widthRatio={
                    !state.fullscreen &&
                    !options.vinylMode &&
                    state.playerRect[0]
                }
                heightRatio={
                    !state.fullscreen &&
                    !options.vinylMode &&
                    state.playerRect[1]
                }
            >
                <Media
                    ref={metadata.video ? videoRef : audioRef}
                    as={metadata.video ? 'video' : 'audio'}
                    src={metadata.src}
                    poster={metadata.poster}
                    preload='metadata'
                    muted={state.muted}
                    onClick={!isTouch ? togglePlay : undefined}
                    loop={options.loop}
                    autoPlay={options.autoPlay}
                    playsInline
                />
                {!metadata.video && options.vinylMode && (
                    <Vinyl
                        ref={vinylRef}
                        onClick={togglePlay}
                        bg={metadata.poster}
                        isPlaying={state.playing && state.loaded}
                        aspectRatio={vinyl.width / vinyl.height}
                        vinylSize={Math.min(vinyl.width, vinyl.height)}
                    >
                        <img src={metadata.poster} />
                        <div className='outer-border' />
                        <div className='inner-border' />
                    </Vinyl>
                )}
                {state.error ? (
                    <MediaError settings={settings} />
                ) : state.duration === 0 ? (
                    <MediaLoading settings={settings} />
                ) : (
                    <AnimatePresence>
                        {!metadata.video && !options.vinylMode && (
                            <Poster onClick={togglePlay} bg={metadata.poster} />
                        )}
                        {state.immersive && options.metadataOnMedia && (
                            <MiniControls
                                key='mini-player-controls'
                                settings={settings}
                                initial={controlsAnim.hide}
                                animate={controlsAnim.show}
                                exit={controlsAnim.hide}
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
                                initial={controlsAnim.hide}
                                animate={controlsAnim.show}
                                exit={controlsAnim.hide}
                            />
                        )}
                    </AnimatePresence>
                )}
                <IconFlasher
                    size={options.vinylMode ? vinyl.height : 0}
                    icon={flashIcon}
                    onEnd={setFlashIcon}
                />
            </Wrapper>
        </Container>
    )
}

const playerRotate = keyframes`
    0% {
        transform: rotate(0deg);
    }
    100% {
        transform: rotate(360deg);
    }
`

const Media = styled.video`
    position: absolute;
    top: 0;
    left: 0;
`

const Wrapper = styled.div`
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: ${props => (props.isVinyl ? 'flex-start' : 'center')};
    transition: all 0.3s ease-in-out;
    user-select: none;
    cursor: ${props => (props.isImmersive ? 'none' : 'default')};
    width: ${props => (!props.widthRatio ? '100%' : props.widthRatio + 'px')};
    height: ${props =>
        !props.heightRatio ? '100%' : props.heightRatio + 'px'};
    & ${Media} {
        width: ${props => (props.isVinyl ? '0' : '100%')};
        height: ${props => (props.isVinyl ? '0' : '100%')};
    }
`

const MediaBg = styled.div`
    position: absolute;
    top: 0;
    width: 100%;
    height: 100%;
    background-image: url('${props => props.bg}');
    background-position: center;
    background-size: contain;
    background-repeat: no-repeat;
`

const Vinyl = styled(MediaBg)`
    position: relative;
    top: unset;
    width: 80%;
    height: unset;
    background: none;
    animation: ${playerRotate} 7s linear infinite;
    animation-play-state: ${props => (props.isPlaying ? 'running' : 'paused')};
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    box-sizing: border-box;
    /* overflow: hidden; */
    transform: translateZ(0);
    flex: 80%;
    & img {
        position: absolute;
        ${props =>
            props.aspectRatio > 1
                ? `
                    top: 0;
                    height: 100%;
                `
                : `
                    left: 0;
                    width: 100%;
                `}
        background-color: #eeeeee;
        border-radius: 100%;
        box-shadow: 0 0 15px rgba(0, 0, 0, 0.1);
        mask-image: radial-gradient(
            ${props => Math.floor(props.vinylSize * 0.05)}.1px at 50% 50%,
            transparent 99%,
            black 100%
        );
    }
    & div.outer-border {
        position: absolute;
        top: 50%;
        left: 50%;
        margin-left: -${props => props.vinylSize * 0.5}px;
        margin-top: -${props => props.vinylSize * 0.5}px;
        width: ${props => props.vinylSize}px;
        height: ${props => props.vinylSize}px;
        border-radius: 50%;
        box-shadow: inset 0px 0px 0px 2px rgba(238, 238, 238, 0.5);
    }
    & div.inner-border {
        position: absolute;
        top: 50%;
        left: 50%;
        margin-left: -${props => Math.floor(props.vinylSize * 0.05)}px;
        margin-top: -${props => Math.floor(props.vinylSize * 0.05)}px;
        width: ${props => Math.floor(props.vinylSize * 0.05) * 2}px;
        height: ${props => Math.floor(props.vinylSize * 0.05) * 2}px;
        border-radius: 50%;
        box-shadow: 0 0 0px 6px rgba(238, 238, 238, 0.5),
            inset 0px 0px 15px rgba(0, 0, 0, 0.25);
    }
    @media (max-width: 768px) and (max-aspect-ratio: 1/1) {
        width: 100%;
    }
`

const Poster = styled(MediaBg)`
    left: 0;
    border-radius: 0px;
`

const MediaError = styled(ErrorMessage)``

const MediaLoading = styled(Loading)``

const Container = styled.div`
    width: 100%;
    height: 100%;
    position: absolute;
    display: flex;
    align-items: center;
    justify-content: center;
    font-family: ${props => props.styling.fontFamily};
    opacity: ${props => (props.show ? '1' : '0')};
    transition: all 0.2s linear;
    & ${MediaError} {
        color: ${props => props.styling.errorColor};
    }
    & ${MediaLoading} {
        color: ${props => props.styling.loaderColor};
    }
    & ${Poster}, ${Media}, ${Wrapper} {
        background-color: ${props => props.styling.mediaBackground};
    }
    & ${Vinyl} .inner-border {
        background-color: ${props => props.styling.vinylBackground};
    }
`
