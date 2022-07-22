/*
 * *****************************************************************************
 * File: time.js (/src/components/time.js) | @rs1/media-player
 * Written by Andrea Corsini <andrea@rs1.it>
 * =============================================================
 * Created on Tuesday, 10th November 2020 5:54:42 pm
 *
 * Copyright (c) 2020-2021 Andrea Corsini T/A RS1 Project - All rights reserved.
 * License: Apache License 2.0
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Modified on Wednesday, 27th January 2021 12:02:22 pm
 * *****************************************************************************
 */

import React from 'react'
import styled from '@emotion/styled'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSpinner } from '@fortawesome/free-solid-svg-icons'

const padZero = digit => `${digit < 10 ? '0' : ''}${digit}`

export default ({ seconds, loading = false, roundTop = false, ...props }) => {
    const formatted = () => {
        const prefix = seconds < 0 ? '-' : ''
        const absSeconds = Math[roundTop ? 'ceil' : 'floor'](Math.abs(seconds))

        const hh = Math.floor(absSeconds / 3600)
        const ii = Math.floor((absSeconds % 3600) / 60)
        const ss = absSeconds % 60

        return hh > 0
            ? `${prefix}${hh}:${padZero(ii)}:${padZero(ss)}`
            : `${prefix}${ii}:${padZero(ss)}`
    }

    return loading || Number.isNaN(seconds) ? (
        <FontAwesomeIcon icon={faSpinner} fixedWidth spin />
    ) : (
        <Time {...props} dangerouslySetInnerHTML={{ __html: formatted() }} />
    )
}

const Time = styled.span``
