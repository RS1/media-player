/*
 * *****************************************************************************
 * File: loading.js (/src/components/loading.js) | @rs1/media-player
 * Written by Andrea Corsini <andrea@rs1.it>
 * =============================================================
 * Created on Tuesday, 10th November 2020 5:54:42 pm
 *
 * Copyright (c) 2020 RS1 Project
 * License: Apache License 2.0
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Modified on Saturday, 14th November 2020 2:31:04 pm
 * *****************************************************************************
 */

import React from 'react'
import styled from '@emotion/styled'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

export default ({ settings }) => (
    <Overlay styling={settings.style}>
        <FontAwesomeIcon icon={settings.icons.loading} spin />
        <p
            dangerouslySetInnerHTML={{
                __html:
                    settings.metadata.title + ' / ' + settings.metadata.artist,
            }}
        />
    </Overlay>
)

const Overlay = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    color: ${props => props.styling.loaderColor};
    font-size: 50px;
    text-shadow: 0 0 3px rgba(0, 0, 0, 0.25);
    z-index: 15;
    width: 100%;
    box-sizing: border-box;
    padding: 15px;
    border-radius: 15px;
    & p {
        margin: 25px 0 0 0;
        font-size: 15px;
        text-align: center;
    }
`
