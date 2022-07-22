/*
 * *****************************************************************************
 * File: helper.js (/src/context/helper.js) | @rs1/media-player
 * Written by Andrea Corsini <andrea@rs1.it>
 * =============================================================
 * Created on Sunday, 17th July 2022 3:25:07 pm
 *
 * Copyright (c) 2020-2022 Andrea Corsini T/A RS1 Project - All rights reserved.
 * Unauthorized copying of this file, via any medium is strictly prohibited.
 * Proprietary and confidential.
 *
 * Modified on Wednesday, 20th July 2022 10:02:28 am
 * *****************************************************************************
 */

import { useState, useEffect } from 'react'

export const calcVinylMode = settings =>
    settings?.options?.vinylMode && !settings?.metadata?.video

export const calcVinylModeWithMeta = (options, metadata) =>
    options?.vinylMode && !metadata?.video

export const useVinylMode = ({ options, metadata }) => {
    const [vinylMode, setVinylMode] = useState(
        calcVinylModeWithMeta(options, metadata)
    )

    useEffect(() => {
        setVinylMode(calcVinylModeWithMeta(options, metadata))
    }, [options?.vinylMode, metadata?.video])

    return vinylMode
}
