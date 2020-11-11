/*
 * *****************************************************************************
 * File: error.js (/src/components/error.js) | @rs1/media-player
 * Written by Andrea Corsini <andrea@rs1.it>
 * =============================================================
 * Created on Tuesday, 10th November 2020 5:54:42 pm
 *
 * Copyright (c) 2020 RS1 Project
 * License: Apache License 2.0
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Modified on Tuesday, 10th November 2020 5:58:04 pm
 * *****************************************************************************
 */

import React from 'react'
import styled from '@emotion/styled'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

export default ({ settings }) => (
    <Overlay styling={settings.style}>
        <p
            dangerouslySetInnerHTML={{
                __html:
                    'An error occured while loading this media element.<br />' +
                    settings.metadata.title +
                    ' / ' +
                    settings.metadata.artist,
            }}
        />
        <FontAwesomeIcon icon={settings.icons.error} />
    </Overlay>
)

const Overlay = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    color: ${props => props.styling.errorColor};
    font-size: 50px;
    text-shadow: 0 0 3px rgba(0, 0, 0, 0.25);
    z-index: 15;
    & p {
        margin: 0 0 25px 0;
        font-size: 15px;
        text-align: center;
    }
`
