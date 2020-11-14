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
 * Modified on Saturday, 14th November 2020 3:03:38 pm
 * *****************************************************************************
 */

import React from 'react'
import styled from '@emotion/styled'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

export default ({ settings, ...props }) => (
    <Overlay isVinyl={settings.options.vinylMode} {...props}>
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
    font-size: 50px;
    z-index: 15;
    width: 100%;
    box-sizing: border-box;
    padding: 15px;
    ${props =>
        props.isVinyl
            ? `
                width: 75%;
                background: rgba(0, 0, 0, 0.75);
                backdrop-filter: blur(5px);
                box-shadow: 0 0 3px rgba(0, 0, 0, 0.25);
                border-radius: 15px;
            `
            : ``}
    & p {
        margin: 0 0 25px 0;
        font-size: 15px;
        text-align: center;
    }
`
