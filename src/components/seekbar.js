/*
 * *****************************************************************************
 * File: seekbar.js (/src/components/seekbar.js) | @rs1/media-player
 * Written by Andrea Corsini <andrea@rs1.it>
 * =============================================================
 * Created on Tuesday, 10th November 2020 5:54:42 pm
 *
 * Copyright (c) 2020 RS1 Project
 * License: Apache License 2.0
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Modified on Saturday, 14th November 2020 11:16:05 am
 * *****************************************************************************
 */

import styled from '@emotion/styled'
import React, { useEffect } from 'react'
import { useAgentParser, useSliderRef } from '@rs1/react-hooks'

export default ({
    value: _value = 0,
    progress = 0,
    styling: style = {},
    onChange = () => {},
}) => {
    const [value, sliderRef] = useSliderRef(null, _value)
    const { isTouch } = useAgentParser()

    useEffect(() => {
        onChange(value)
    }, [value])

    return (
        <Slider ref={sliderRef} fatBar={isTouch} styling={style}>
            <Background />
            <Progress value={progress} />
            <Bar value={_value} />
            <Handle value={_value} />
        </Slider>
    )
}

const Background = styled.div`
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    opacity: 0.35;
    transition: all 0.1s ease-in-out;
`
const Progress = styled.div`
    position: absolute;
    top: 0;
    left: 0;
    opacity: 0.35;
    width: ${props => props.value * 100}%;
    transition: all 0.1s ease-in-out;
`
const Bar = styled.div`
    position: absolute;
    top: 0;
    left: 0;
    opacity: 1;
    width: ${props => props.value * 100}%;
    transition: all 0.1s ease-in-out;
`
const Handle = styled.div`
    position: absolute;
    top: 0;
    left: ${props => props.value * 100}%;
    border-radius: 100%;
    transform: scale(1);
    box-shadow: 0 0 3px rgba(0, 0, 0, 0.25);
    transition: all 0.1s ease-in-out;
`

const Slider = styled.div`
    width: 100%;
    cursor: pointer;
    position: relative;
    transition: all 0.1s ease-in-out;
    height: ${props => (props.fatBar ? '8px' : '4px')};
    color: ${props => props.styling.controlsColor};
    & ${Background}, ${Progress}, ${Bar} {
        height: ${props => (props.fatBar ? '8px' : '4px')};
        border-radius: ${props => (props.fatBar ? '8px' : '4px')};
    }
    & ${Handle} {
        width: ${props => (props.fatBar ? '12px' : '6px')};
        height: ${props => (props.fatBar ? '12px' : '6px')};
        margin-top: ${props => (props.fatBar ? '-2px' : '-1px')};
        margin-left: ${props => (props.fatBar ? '-6px' : '-2px')};
    }
    &:hover ${Handle} {
        transform: scale(1.3);
    }
    & ${Background}, ${Progress}, ${Bar} {
        background: ${props => props.styling.controlsColor};
    }
    & ${Handle} {
        background: ${props => props.styling.controlsColor};
    }
`
