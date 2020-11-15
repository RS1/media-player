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
 * Modified on Sunday, 15th November 2020 11:14:08 am
 * *****************************************************************************
 */

import React from 'react'
import styled from '@emotion/styled'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import metaFormatter from './metadata'

export default ({ settings, ...props }) => (
    <Overlay isVinyl={settings.options.vinylMode} {...props}>
        <FontAwesomeIcon icon={settings.icons.error} />
        <p
            dangerouslySetInnerHTML={{
                __html:
                    'An error occured while loading this media element.<br />' +
                    metaFormatter(
                        settings.options.metadataVisible,
                        settings.metadata,
                        settings.options.metadataSeparator
                    ),
            }}
        />
    </Overlay>
)

const Overlay = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    font-size: ${props => (props.isVinyl ? '30px' : '50px')};
    z-index: 15;
    width: 100%;
    box-sizing: border-box;
    padding: 15px;
    ${props =>
        props.isVinyl
            ? `
                flex-direction: row;
                width: 80%;
                padding: 0;
                margin-top: 25px;
            `
            : ``}
    & p {
        margin: ${props => (props.isVinyl ? '0 0 0 15px' : '25px 0 0 0')};
        font-size: 15px;
        text-align: ${props => (props.isVinyl ? 'left' : 'center')};
    }
`
