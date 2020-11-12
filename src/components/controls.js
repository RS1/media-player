/*
 * *****************************************************************************
 * File: controls.js (/src/components/controls.js) | @rs1/media-player
 * Written by Andrea Corsini <andrea@rs1.it>
 * =============================================================
 * Created on Tuesday, 10th November 2020 5:54:42 pm
 *
 * Copyright (c) 2020 RS1 Project
 * License: Apache License 2.0
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Modified on Thursday, 12th November 2020 2:18:30 pm
 * *****************************************************************************
 */

import React, { useCallback, useEffect } from 'react'
import styled from '@emotion/styled'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import SeekBar from './seekbar'
import Time from './time'
import { useFullScreen } from '@rs1/react-hooks'
import { motion } from 'framer-motion'

export default ({
    settings,
    setSettings,
    toggle,
    previous,
    semiPrevious,
    next,
    semiNext,
    container,
    mediaElem,
    ...props
}) => {
    const { state, metadata, options, icons, style } = settings
    const fsAPI = useFullScreen({})

    useEffect(() => {
        setSettings({ fullscreen: fsAPI.isActive })
    }, [fsAPI.isActive])

    const updateTime = useCallback(
        value => {
            if (state.time !== value) {
                setSettings({ time: value })
                mediaElem.currentTime = value * mediaElem.duration
            }
        },
        [mediaElem, state.time]
    )

    const supportFS = fsAPI.isSupported(container, mediaElem)

    const items = {
        previous: {
            labels: ['Previous'],
            icons: [icons.previous],
            action: previous,
            visible: options.isPlaylist,
        },
        semiPrevious: {
            labels: ['10 seconds backward'],
            icons: [icons.backward10],
            action: semiPrevious,
        },
        play: {
            active: state.playing,
            loading: !state.loaded,
            labels: ['Play', 'Pause', 'Loading...'],
            icons: [icons.play, icons.pause, icons.loading],
            action: toggle,
            size: '2x',
        },
        semiNext: {
            labels: ['10 seconds forward'],
            icons: [icons.forward10],
            action: semiNext,
        },
        next: {
            labels: ['Next'],
            icons: [icons.next],
            action: next,
            visible: options.isPlaylist,
        },
    }

    const extras = {
        mute: {
            active: state.muted,
            labels: ['Mute', 'Unmute'],
            icons: [icons.muted, icons.unmuted],
            action: () => setSettings({ toggle: 'muted' }),
            visible: options.canMute,
        },
        metadata: {
            text: metadata.title + ' / ' + metadata.artist,
        },
        fullscreen: {
            active: state.fullscreen,
            labels: ['Full screen', 'Exit full screen'],
            icons: [icons.exit_fullscreen, icons.fullscreen],
            action: () => fsAPI.toggle(container, mediaElem),
            visible: options.canFullScreen && supportFS,
        },
    }

    return (
        <Controls styling={style} {...props}>
            <SeekBar settings={settings} onChange={updateTime} />
            <Buttons>
                <TimeSpan style={{ textAlign: 'left' }}>
                    <Time
                        seconds={state.time * state.duration}
                        loading={state.duration <= 0}
                    />
                </TimeSpan>
                <Spacer />
                {Object.entries(items).map(([key, item], idx) => (
                    <Icon
                        key={idx}
                        onClick={item.action ?? (() => {})}
                        mainColor={
                            item.active && key !== 'play'
                                ? style.accentColor
                                : style.controlsColor
                        }
                        title={
                            item.loading
                                ? item.labels[2]
                                : item.active
                                ? item.labels[1]
                                : item.labels[0]
                        }
                        disabled={Boolean(item.loading ?? false)}
                        show={Boolean(item.visible ?? true)}
                    >
                        <FontAwesomeIcon
                            icon={
                                item.loading
                                    ? item.icons[2]
                                    : item.active
                                    ? item.icons[1]
                                    : item.icons[0]
                            }
                            fixedWidth
                            size={item.size ?? '1x'}
                            spin={
                                (item.loading || item.active) && key === 'play'
                            }
                        />
                    </Icon>
                ))}
                <Spacer />
                <TimeSpan style={{ textAlign: 'right' }}>
                    <Time
                        seconds={state.duration}
                        loading={state.duration <= 0}
                    />
                </TimeSpan>
            </Buttons>
            <Metadata>
                {Object.entries(extras).map(([key, item], idx) => {
                    return key === 'metadata' ? (
                        <p
                            key={idx}
                            dangerouslySetInnerHTML={{ __html: item.text }}
                        />
                    ) : (
                        <Icon
                            key={idx}
                            onClick={item.action ?? (() => {})}
                            mainColor={
                                item.active
                                    ? style.accentColor
                                    : style.controlsColor
                            }
                            title={
                                item.active ? item.labels[1] : item.labels[0]
                            }
                            show={item.visible ?? true}
                        >
                            <FontAwesomeIcon
                                icon={
                                    item.active ? item.icons[1] : item.icons[0]
                                }
                                fixedWidth
                                size={item.size ?? '1x'}
                            />
                        </Icon>
                    )
                })}
            </Metadata>
        </Controls>
    )
}

const Buttons = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    padding: 0 15px;
    margin-bottom: 10px;
`

const Spacer = styled.div`
    flex: 999;
`

const TimeSpan = styled.div`
    flex: 1;
    font-size: 13px;
    cursor: default;
    &::before {
        content: '';
        display: inline-block;
        height: 14px;
    }
`

const Icon = styled.div`
    opacity: ${props => (props.show ? '1' : '0')};
    visibility: ${props => (props.show ? 'visible' : 'hidden')};
    pointer-events: ${props =>
        props.disabled || !props.show ? 'none' : 'initial'};
    color: ${props => props.mainColor};
    cursor: pointer;
    transform: scale(1) translateZ(0);
    transition: all 0.2s ease;
    flex: 1;
    padding: 0 10px;
    &:hover {
        transform: scale(1.3) translateZ(0);
    }
`

const Metadata = styled.div`
    display: flex;
    flex-direction: row;
    padding: 0 15px;
    margin-bottom: 5px;
    justify-content: space-between;
    align-items: center;
    line-height: 1;
    & p {
        font-size: 11px;
        margin: 0 5px;
        cursor: default;
        text-align: center;
        @media (max-width: 1023px) {
            font-size: 13px;
        }
    }
    & ${Icon} {
        padding: 0;
        flex: none;
    }
`

const Controls = styled(motion.div)`
    position: absolute;
    left: 10px;
    right: 10px;
    bottom: 10px;
    border-radius: 5px;
    display: flex;
    transition: all 0.1s ease;
    /*background: -moz-linear-gradient(top, rgba(0,0,0,0.15) 0%, rgba(0,0,0,0.85) 100%);
	background: -webkit-linear-gradient(top, rgba(0,0,0,0.15) 0%,rgba(0,0,0,0.85) 100%);
	background: linear-gradient(to bottom, rgba(0,0,0,0.15) 0%,rgba(0,0,0,0.85) 100%);
	filter: progid:DXImageTransform.Microsoft.gradient( startColorstr='#26000000', endColorstr='#d9000000',GradientType=0 );*/
    background: rgba(0, 0, 0, 0.75);
    backdrop-filter: blur(5px);
    box-shadow: 0 0 3px rgba(0, 0, 0, 0.25);
    flex-direction: column;
    justify-content: center;
    align-items: stretch;
    padding: 10px 0;
    z-index: 10;
    & ${Buttons}, ${Metadata} {
        color: ${props => props.styling.controlsColor};
    }
    & ${Icon}:hover {
        color: ${props => props.styling.accentColor};
    }
`
