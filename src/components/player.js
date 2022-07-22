/*
 * *****************************************************************************
 * File: player.js (/src/components/player.js) | @rs1/media-player
 * Written by Andrea Corsini <andrea@rs1.it>
 * =============================================================
 * Created on Tuesday, 10th November 2020 5:54:42 pm
 *
 * Copyright (c) 2020-2022 Andrea Corsini T/A RS1 Project - All rights reserved.
 * License: Apache License 2.0
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Modified on Friday, 22nd July 2022 11:25:40 am
 * *****************************************************************************
 */

import React, {
    useLayoutEffect,
    useEffect,
    useContext,
    useCallback,
    useState,
    useRef,
} from 'react'
import { keyframes } from '@emotion/core'
import styled from '@emotion/styled'

import Context from '../context'
import Analyser from './analyser'

import ErrorMessage from './error'
import Loading from './loading'
import Controls from './controls'
import MiniControls from './mini-controls'
import IconFlasher from './icon-flasher'

import {
    useDynamicRef,
    useAutoIdle,
    useAgentParser,
    useRectRef,
    useKeyAction,
} from '@rs1/react-hooks'
import { AnimatePresence } from 'framer-motion'
import { useVinylMode } from '../lib/helper'

import MediaElement from './media-element'

const rectInRect = ([a, b], [x, y]) =>
    a / b < x / y ? [(a * y) / b, y] : [x, (b * x) / a]

export default ({ config, media: track, ...props }) => {
    const { isTouch } = useAgentParser()
    const [flashIcon, setFlashIcon] = useState(false)
    const [configLoaded, setConfigLoaded] = useState(false)
    const [settings, setSettings] = useContext(Context)
    const { metadata, state, options, actions, style, icons } = settings

    const hasVinylMode = useVinylMode(settings)

    const [container, containerRef] = useRectRef()
    const [wrapper, wrapperRef, updateWrapperRef] = useDynamicRef(null, false)
    const [vinyl, vinylRef, updateVinyl] = useRectRef({
        useOffset: true,
        delay: 0,
    })

    const media = useRef(null)

    useEffect(() => {
        if (track) {
            setSettings({ metadata: track })
        }
    }, [track])

    useEffect(() => {
        setConfigLoaded(true)
        config && setSettings({ config: config })
        updateVinyl()
    }, [config])

    useEffect(() => {
        setSettings({ reset: 'reset' })
        if (
            state.analyser !== false &&
            (metadata.video ? 'video' : 'audio') !==
                state.analyser?.mediaSourceType
        ) {
            state.analyser?.updateSource &&
                state.analyser.updateSource(metadata.video ? 'video' : 'audio')
        }
    }, [metadata.src])

    useEffect(() => {
        !state.immersive && resetIdle()
    }, [state.immersive])

    const [, resetIdle] = useAutoIdle(wrapper, {
        callback: idle => setSettings({ immersive: idle }),
        wait: options.autoHideControls || 5,
        condition:
            state.playing &&
            state.loaded &&
            options.autoHideControls > 0 &&
            (!hasVinylMode || options.autoHideVinyl),
    })

    useLayoutEffect(() => {
        updateWrapperRef()
        updateVinyl()
    }, [JSON.stringify(state.playerRect)])

    useEffect(() => {
        if (hasVinylMode && !Object.keys(vinyl).length) {
            updateVinyl()
        }
        resetIdle()
    }, [hasVinylMode, JSON.stringify(vinyl)])

    useLayoutEffect(() => {
        if (!options.autoResize && !hasVinylMode) {
            setSettings({ playerRect: options.playerSize })
            return
        }
        const [w, h] = rectInRect(state.mediaRect, [
            container.width,
            container.height,
        ])
        setSettings({ playerRect: [Math.floor(w), Math.floor(h)] })
    }, [
        JSON.stringify(container),
        options.autoResize,
        hasVinylMode,
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
        actions.onAnalyserInitialized(state.analyser)
    }, [state.analyser, actions.onAnalyserInitialized])
    useEffect(() => {
        actions.onImmersiveChanged(state.immersive)
    }, [state.immersive, actions.onImmersiveChanged])
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
            analyser: state.analyser,
            immersive: state.immersive,
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
        state.analyser,
        state.immersive,
    ])

    const togglePlay = useCallback(
        e => {
            if (state.playing) {
                media.current.pause()
                setFlashIcon(icons.pause)
            } else {
                if (
                    (state.analyser === false ||
                        Object.keys(state.analyser).length === 0) &&
                    options.hasAnalyser
                ) {
                    const analyser = new Analyser({
                        mediaElem: 'rs1-media-player-element',
                        mediaType: metadata.video ? 'video' : 'audio',
                        ...options.analyserSetup,
                    })
                    setSettings({
                        analyser,
                    })
                }
                media.current.play()
                setFlashIcon(icons.play)
            }
            resetIdle()
        },
        [
            state.playing,
            state.immersive,
            icons.pause,
            icons.play,
            state.analyser,
            options.hasAnalyser,
            options.analyserSetup,
            metadata.video,
        ]
    )
    useKeyAction(
        32 /* __ space */,
        e => {
            e && e.preventDefault()
            togglePlay()
        },
        [state.playing, state.immersive, icons.pause, icons.play],
        false
    )

    const previous = useCallback(() => {
        setFlashIcon(icons.previous)
        const needsPrevious = state.time * state.duration <= 10
        media.current.seekTo(0)
        if (!options.isPlaylist) return
        if (needsPrevious) {
            actions.onPrevious()
        }
    }, [
        state.time,
        state.duration,
        actions.onPrevious,
        icons.previous,
        options.isPlaylist,
    ])
    const semiPrevious = useCallback(
        e => {
            const skipTime = e?.seekOffset || 10
            if (state.time * state.duration <= skipTime) return previous()
            media.current.skip(-skipTime)
            setFlashIcon(icons.backward10)
        },
        [
            state.time,
            state.duration,
            actions.onPrevious,
            icons.backward10,
            icons.previous,
            options.isPlaylist,
        ]
    )
    useKeyAction(
        37 /* <- left */,
        e => {
            e && e.preventDefault()
            semiPrevious()
        },
        [
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
        if (!options.loop && !options.isPlaylist) {
            media.current.pause()
        }
        media.current.seekTo(0)
        if (options.isPlaylist) {
            actions.onNext()
        }
    }, [actions.onNext, icons.next, options.loop, options.isPlaylist])
    const semiNext = useCallback(
        e => {
            const skipTime = e?.seekOffset || 10
            const toTime = state.time * state.duration + skipTime
            if (toTime >= state.duration) return next()
            media.current.skip(skipTime)
            setFlashIcon(icons.forward10)
        },
        [
            state.time,
            state.duration,
            actions.onNext,
            icons.forward10,
            icons.next,
            options.loop,
            options.isPlaylist,
        ]
    )
    useKeyAction(
        39 /* -> right */,
        e => {
            e && e.preventDefault()
            semiNext()
        },
        [
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

    useEffect(() => {
        if (!state.loaded || !media.current) return
        setSettings({
            mediaRect: hasVinylMode
                ? [1, 1]
                : media.current.node.tagName === 'VIDEO'
                ? [
                      media.current.node.videoWidth,
                      media.current.node.videoHeight,
                  ]
                : options.playerSize,
        })
    }, [state.loaded, options.playerSize, hasVinylMode])

    const controlsAnim = {
        hide: { opacity: 0, scaleY: 0, originY: 1 },
        show: { opacity: 1, scaleY: 1, originY: 1 },
    }

    return (
        <Container
            styling={style}
            ref={containerRef}
            show={configLoaded}
            id='rs1-media-player-container'
        >
            <Wrapper
                ref={wrapperRef}
                isImmersive={state.immersive}
                isVinyl={hasVinylMode}
                widthRatio={
                    !state.fullscreen && !hasVinylMode && state.playerRect[0]
                }
                heightRatio={
                    !state.fullscreen && !hasVinylMode && state.playerRect[1]
                }
                id='rs1-media-player-wrapper'
            >
                <Media
                    as={MediaElement}
                    ref={media}
                    src={metadata.src}
                    tag={metadata.video ? 'video' : 'audio'}
                    metadata={{ ...metadata }}
                    actions={{
                        onFinish: next,
                        onNextTrack: next,
                        onPrevTrack: previous,
                    }}
                    onChange={s => {
                        setSettings({
                            time: s.error ? 0 : s.currentTime / s.duration,
                            duration: s.error ? 0 : s.duration,
                            loaded: s.error
                                ? true
                                : s.loaded &&
                                  (s.loadeddata || s.loadedmetadata) &&
                                  !s.waiting,
                            error: s.error,
                            playing: s.playing,
                            progress: s.progress,
                        })
                    }}
                    preload='metadata'
                    muted={state.muted}
                    onClick={
                        !isTouch || options.touchToPause
                            ? togglePlay
                            : undefined
                    }
                    loop={options.loop}
                    autoPlay={options.autoPlay}
                    playsInline
                    crossOrigin={
                        options.crossOriginMedia
                            ? options.crossOriginMedia
                            : undefined
                    }
                    id='rs1-media-player-element'
                />
                {hasVinylMode && (
                    <Vinyl
                        ref={vinylRef}
                        onClick={togglePlay}
                        bg={metadata.poster}
                        isImmersive={state.immersive}
                        isPlaying={state.playing && state.loaded}
                        aspectRatio={vinyl.width / vinyl.height}
                        vinylSize={Math.min(vinyl.width, vinyl.height)}
                        playerRect={state.playerRect}
                        id='rs1-media-player-vinyl'
                    >
                        <img src={metadata.poster} />
                        <div className='outer-border' />
                        <div className='inner-border' />
                    </Vinyl>
                )}
                {state.error ? (
                    <MediaError
                        settings={settings}
                        id='rs1-media-player-error'
                    />
                ) : state.duration === 0 ? (
                    <MediaLoading
                        settings={settings}
                        id='rs1-media-player-loading'
                    />
                ) : (
                    <AnimatePresence>
                        {!hasVinylMode && !metadata.video && (
                            <Poster
                                onClick={togglePlay}
                                bg={metadata.poster}
                                id='rs1-media-player-poster'
                            />
                        )}
                        {state.immersive && options.metadataOnMedia && (
                            <MiniControls
                                key='mini-player-controls'
                                settings={settings}
                                initial={controlsAnim.hide}
                                animate={controlsAnim.show}
                                exit={controlsAnim.hide}
                                id='rs1-media-player-minicontrols'
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
                                mediaElem={media.current}
                                initial={controlsAnim.hide}
                                animate={controlsAnim.show}
                                exit={controlsAnim.hide}
                                id='rs1-media-player-controls'
                            />
                        )}
                    </AnimatePresence>
                )}
                <IconFlasher
                    size={hasVinylMode ? vinyl.height : 0}
                    icon={flashIcon}
                    onEnd={setFlashIcon}
                    id='rs1-media-player-iconflasher'
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

const Media = styled.div`
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
    opacity: ${props => (props.isImmersive ? '0' : '1')};
    transition: opacity 0.3s linear;
    /* overflow: hidden; */
    transform: translateZ(0);
    flex: 80%;
    & img {
        position: absolute;
        width: ${props => props.vinylSize}px;
        height: ${props => props.vinylSize}px;
        ${props =>
            props.aspectRatio > 1
                ? `
                    top: 0;
                `
                : `
                    left: 0;
                `}
        background-color: #eeeeee;
        border-radius: 100%;
        box-shadow: 0 0 15px rgba(0, 0, 0, 0.1);
        mask-image: radial-gradient(
            ${props => Math.floor(props.vinylSize * 0.05)}.1px at 50% 50%,
            transparent 99%,
            black 100%
        );
        object-fit: cover;
        object-position: center;
        transition: transform 0.3s linear;
        transform: ${props =>
            props.isImmersive
                ? 'scale(0) translateZ(0)'
                : 'scale(1) translateZ(0)'};
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
        transition: transform 0.3s linear;
        transform: ${props =>
            props.isImmersive
                ? 'scale(0) translateZ(0)'
                : 'scale(1) translateZ(0)'};
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
        transition: transform 0.3s linear;
        transform: ${props =>
            props.isImmersive
                ? 'scale(0) translateZ(0)'
                : 'scale(1) translateZ(0)'};
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
    min-height: 250px;
    & ${MediaError} {
        color: ${props => props.styling.errorColor};
    }
    & ${MediaLoading} {
        color: ${props => props.styling.loaderColor};
    }
    & ${Wrapper} {
        background-color: ${props => props.styling.playerBackground};
    }
    & ${Poster}, ${Media} {
        background-color: ${props => props.styling.mediaBackground};
    }
    & ${Vinyl} .inner-border {
        background-color: ${props => props.styling.vinylBackground};
    }
`
