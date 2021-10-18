/*
 * *****************************************************************************
 * File: control-item.js (/src/components/control-item.js) | @rs1/media-player
 * Written by Andrea Corsini <andrea@rs1.it>
 * =============================================================
 * Created on Saturday, 14th November 2020 10:29:54 am
 *
 * Copyright (c) 2020-2021 Andrea Corsini T/A RS1 Project - All rights reserved.
 * License: Apache License 2.0
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Modified on Monday, 18th October 2021 9:29:40 am
 * *****************************************************************************
 */

import React from 'react'
import styled from '@emotion/styled'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import SeekBar from './seekbar'
import Time from './time'

export default ({
    prop: key = '',
    item = {},
    styling: style = {},
    vinyl = false,
    identifier = '',
}) => {
    switch (item.type) {
        case 'spacer':
            return <Spacer id={identifier} />
        case 'seekbar':
            return (
                <SeekBar
                    value={item.value}
                    progress={item.progress}
                    onChange={item.action}
                    styling={style}
                    id={identifier}
                />
            )
        case 'text':
            return (
                <Text
                    dangerouslySetInnerHTML={{ __html: item.text }}
                    id={identifier}
                />
            )
        case 'time':
            return (
                <TimeSpan fontFamily={style.timeFontFamily} id={identifier}>
                    <Time
                        seconds={item.seconds}
                        loading={item.loading}
                        roundTop={item.roundTop}
                    />
                </TimeSpan>
            )
        case 'icon':
        default:
            return (
                <Icon
                    onClick={
                        item.visible ?? true
                            ? item.action ?? (() => {})
                            : () => {}
                    }
                    mainColor={
                        item.active && key !== 'play'
                            ? style.accentColor
                            : style.controlsColor
                    }
                    hoverColor={style.accentColor}
                    title={
                        item.loading
                            ? item.labels[2]
                            : item.active
                            ? item.labels[1]
                            : item.labels[0]
                    }
                    disabled={Boolean(item.loading ?? false)}
                    show={Boolean(item.visible ?? true)}
                    vinyl={vinyl}
                    spinSpeed={
                        vinyl && key === 'play' && !item.loading ? '7s' : '2s'
                    }
                    id={identifier}
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
                        spin={(item.loading || item.active) && key === 'play'}
                    />
                </Icon>
            )
    }
}

const Text = styled.div`
    font-size: 11px;
    margin: 0 5px;
    cursor: default;
    text-align: center;
    flex: 999;
    line-height: 1;
    @media (max-width: 1023px) {
        font-size: 13px;
    }
`

const Spacer = styled.div`
    flex: 999;
`

const TimeSpan = styled.div`
    flex: 1;
    font-size: 13px;
    cursor: default;
    padding: 0 10px;
    font-family: ${props => props.fontFamily};
    &::before {
        content: '';
        display: inline-block;
        height: 14px;
    }
    &:first-child {
        padding-left: 0;
    }
    &:last-child {
        padding-right: 0;
    }
    &:first-of-type {
        text-align: left;
    }
    &:last-of-type {
        text-align: right;
    }
`

const Icon = styled.div`
    opacity: ${props => (props.show ? '1' : '0')};
    visibility: ${props => (props.show ? 'visible' : 'hidden')};
    pointer-events: ${props =>
        props.disabled || !props.show ? 'none' : 'initial'};
    touch-events: ${props =>
        props.disabled || !props.show ? 'none' : 'initial'};
    color: ${props => props.mainColor};
    cursor: pointer;
    transform: scale(1) translateZ(0);
    transition: all 0.2s ease;
    padding: ${props => (props.vinyl ? '0 5px' : '0 10px')};
    text-align: center;
    & .fa-spin {
        animation: fa-spin ${props => props.spinSpeed} infinite linear;
    }
    &:hover {
        color: ${props => props.hoverColor};
        transform: scale(1.3) translateZ(0);
    }
    &:first-child {
        padding-left: 0;
    }
    &:last-child {
        padding-right: 0;
    }
    @media (max-width: 414px) {
        padding: 0 5px;
        &:first-child {
            padding-left: 0;
        }
        &:last-child {
            padding-right: 0;
        }
    }
`
