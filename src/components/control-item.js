/*
 * *****************************************************************************
 * File: control-item.js (/src/components/control-item.js) | @rs1/media-player
 * Written by Andrea Corsini <andrea@rs1.it>
 * =============================================================
 * Created on Saturday, 14th November 2020 10:29:54 am
 *
 * Copyright (c) 2020 RS1 Project
 * License: Apache License 2.0
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Modified on Saturday, 14th November 2020 11:31:47 am
 * *****************************************************************************
 */

import React from 'react'
import styled from '@emotion/styled'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import SeekBar from './seekbar'
import Time from './time'

export default ({ prop: key = '', item = {}, styling: style = {} }) => {
    switch (item.type) {
        case 'spacer':
            return <Spacer />
        case 'seekbar':
            return (
                <SeekBar
                    value={item.value}
                    progress={item.progress}
                    onChange={item.action}
                    styling={style}
                />
            )
        case 'text':
            return <Text dangerouslySetInnerHTML={{ __html: item.text }} />
        case 'time':
            return (
                <TimeSpan>
                    <Time seconds={item.seconds} loading={item.loading} />
                </TimeSpan>
            )
        case 'icon':
        default:
            return (
                <Icon
                    onClick={item.action ?? (() => {})}
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
    color: ${props => props.mainColor};
    cursor: pointer;
    transform: scale(1) translateZ(0);
    transition: all 0.2s ease;
    padding: 0 10px;
    text-align: center;
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
`