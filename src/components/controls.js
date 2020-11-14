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
 * Modified on Saturday, 14th November 2020 2:55:31 pm
 * *****************************************************************************
 */

import React, { useCallback, useEffect } from 'react'
import styled from '@emotion/styled'
import { useFullScreen } from '@rs1/react-hooks'
import { motion } from 'framer-motion'
import ControlItem from './control-item'

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
                mediaElem.currentTime = value * mediaElem.duration || 0
            }
        },
        [mediaElem, state.time]
    )

    const supportFS = fsAPI.isSupported(container, mediaElem)

    const items = {
        previous: {
            type: 'icon',
            labels: ['Previous'],
            icons: [icons.previous],
            action: previous,
            visible: options.isPlaylist,
        },
        backward10: {
            type: 'icon',
            labels: ['Back 10 seconds'],
            icons: [icons.backward10],
            action: semiPrevious,
        },
        play: {
            type: 'icon',
            active: state.playing,
            loading: !state.loaded,
            labels: ['Play', 'Pause', 'Loading...'],
            icons: [icons.play, icons.pause, icons.seeking],
            action: toggle,
            size: '2x',
        },
        forward10: {
            type: 'icon',
            labels: ['Skip 10 seconds'],
            icons: [icons.forward10],
            action: semiNext,
        },
        next: {
            type: 'icon',
            labels: ['Next'],
            icons: [icons.next],
            action: next,
            visible: options.isPlaylist,
        },
        mute: {
            type: 'icon',
            active: state.muted,
            labels: ['Mute', 'Unmute'],
            icons: [icons.muted, icons.unmuted],
            action: () => setSettings({ toggle: 'muted' }),
            visible: options.canMute,
        },
        metadata: {
            type: 'text',
            text: metadata.title + ' / ' + metadata.artist,
        },
        fullscreen: {
            type: 'icon',
            active: state.fullscreen,
            labels: ['Full screen', 'Exit full screen'],
            icons: [icons.exit_fullscreen, icons.fullscreen],
            action: () => fsAPI.toggle(container, mediaElem),
            visible: !options.vinylMode && options.canFullScreen && supportFS,
        },
        time: {
            type: 'time',
            seconds: state.time * state.duration,
            loading: (state.duration || 0) <= 0,
        },
        duration: {
            type: 'time',
            seconds: state.duration,
            loading: (state.duration || 0) <= 0,
        },
        spacer: { type: 'spacer' },
        seekbar: {
            type: 'seekbar',
            value: state.time,
            progress: state.progress,
            action: updateTime,
        },
    }

    return (
        <Controls styling={style} isVinyl={options.vinylMode} {...props}>
            {options.controlsSetup.map((row, idx) => (
                <Row key={idx}>
                    {row.map(
                        (key, idx) =>
                            Object.prototype.hasOwnProperty.call(
                                items,
                                key
                            ) && (
                                <ControlItem
                                    key={`${key}_${idx}`}
                                    prop={key}
                                    item={items[key]}
                                    styling={style}
                                    compact={options.vinylMode}
                                />
                            )
                    )}
                </Row>
            ))}
        </Controls>
    )
}

const Row = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    align-items: center;
    &:first-of-type {
        margin-top: 0px;
    }
    &:last-of-type {
        margin-bottom: 0px;
    }
`

const Controls = styled(motion.div)`
    ${props =>
        props.isVinyl
            ? `
        position: relative;
        width: 75%;
        border-radius: 15px;
        box-sizing: border-box;
        padding: 15px;
    `
            : `
        position: absolute;
        left: 10px;
        right: 10px;
        bottom: 10px;
        border-radius: 5px;
        padding: 10px 15px;
    `}
    display: flex;
    transition: all 0.1s ease;
    background: rgba(0, 0, 0, 0.75);
    backdrop-filter: blur(5px);
    box-shadow: 0 0 3px rgba(0, 0, 0, 0.25);
    flex-direction: column;
    justify-content: center;
    align-items: stretch;
    z-index: 10;
    & ${Row} {
        color: ${props => props.styling.controlsColor};
        margin: ${props => (props.isVinyl ? '5px 0' : '5px 0')};
    }
`
