/*
 * *****************************************************************************
 * File: loading.js (/src/components/loading.js) | @rs1/media-player
 * Written by Andrea Corsini <andrea@rs1.it>
 * =============================================================
 * Created on Tuesday, 10th November 2020 5:54:42 pm
 *
 * Copyright (c) 2020-2022 Andrea Corsini T/A RS1 Project - All rights reserved.
 * License: Apache License 2.0
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Modified on Wednesday, 20th July 2022 10:03:14 am
 * *****************************************************************************
 */

import React from 'react'
import styled from '@emotion/styled'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import metaFormatter from './metadata'
import { useVinylMode } from '../lib/helper'

export default ({ settings, ...props }) => {
    const isVinyl = useVinylMode(settings)
    return (
        <Overlay isVinyl={isVinyl} {...props}>
            <FontAwesomeIcon icon={settings.icons.loading} spin />
            <p
                dangerouslySetInnerHTML={{
                    __html: metaFormatter(
                        settings.options.metadataVisible,
                        settings.metadata,
                        settings.options.metadataSeparator
                    ),
                }}
            />
        </Overlay>
    )
}

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
                flex: 20%;
            `
            : ``}
    & p {
        margin: ${props => (props.isVinyl ? '0 0 0 15px' : '25px 0 0 0')};
        font-size: 15px;
        text-align: ${props => (props.isVinyl ? 'left' : 'center')};
    }
`
