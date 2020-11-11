/*
 * *****************************************************************************
 * File: provider.js (/src/context/provider.js) | @rs1/media-player
 * Written by Andrea Corsini <andrea@rs1.it>
 * =============================================================
 * Created on Tuesday, 10th November 2020 5:54:42 pm
 *
 * Copyright (c) 2020 RS1 Project
 * License: Apache License 2.0
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Modified on Tuesday, 10th November 2020 5:57:13 pm
 * *****************************************************************************
 */

import React, { useReducer } from 'react'
import Context, { defaults, reducer } from '.'

export default ({ children }) => {
    const [context, dispatch] = useReducer(reducer, defaults)
    return (
        <Context.Provider value={[context, dispatch]}>
            {children}
        </Context.Provider>
    )
}
