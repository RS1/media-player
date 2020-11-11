/*
 * *****************************************************************************
 * File: index.js (/src/components/index.js) | @rs1/media-player
 * Written by Andrea Corsini <andrea@rs1.it>
 * =============================================================
 * Created on Tuesday, 10th November 2020 5:54:42 pm
 *
 * Copyright (c) 2020 RS1 Project
 * License: Apache License 2.0
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Modified on Tuesday, 10th November 2020 5:58:21 pm
 * *****************************************************************************
 */

import React from 'react'
import Provider from '../context/provider'
import Player from './player'

export default ({ ...props }) => (
    <Provider>
        <Player {...props} />
    </Provider>
)
