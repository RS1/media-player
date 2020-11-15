/*
 * *****************************************************************************
 * File: mini-controls.js (/src/components/mini-controls.js) | @rs1/media-player
 * Written by Andrea Corsini <andrea@rs1.it>
 * =============================================================
 * Created on Tuesday, 10th November 2020 5:54:42 pm
 *
 * Copyright (c) 2020 RS1 Project
 * License: Apache License 2.0
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Modified on Sunday, 15th November 2020 11:14:08 am
 * *****************************************************************************
 */

import React from 'react'
import styled from '@emotion/styled'
import { motion } from 'framer-motion'
import _Time from './time'
import metaFormatter from './metadata'

export default ({
    settings: { state, metadata, style, options },
    ...props
}) => (
    <Controls styling={style} {...props}>
        <Metadata
            dangerouslySetInnerHTML={{
                __html: metaFormatter(
                    options.metadataVisible,
                    metadata,
                    options.metadataSeparator
                ),
            }}
        />
        <Spacer />
        <Info>
            <Time seconds={state.time * state.duration} />/
            <Time seconds={state.duration} />
        </Info>
    </Controls>
)

const Controls = styled(motion.div)`
    position: absolute;
    bottom: 0;
    display: flex;
    width: 100%;
    transition: all 0.1s ease;
    text-shadow: 0 0 3px rgba(0, 0, 0, 0.25);
    flex-direction: row;
    justify-content: center;
    align-items: center;
    color: ${props => props.styling.metadataOnMediaColor};
    font-size: 11px;
    padding: 10px 0;
    z-index: 9;
`

const Spacer = styled.div`
    flex: 999;
`

const Metadata = styled.p`
    margin: 0 0 0 15px;
`

const Info = styled.p`
    margin: 0 15px 0 10px;
    min-width: 85px;
    text-align: right;
`

const Time = styled(_Time)`
    &::before {
        content: '';
        display: inline-block;
        height: 12px;
    }
`
