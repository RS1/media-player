/*
 * *****************************************************************************
 * File: metadata.js (/src/components/metadata.js) | @rs1/media-player
 * Written by Andrea Corsini <andrea@rs1.it>
 * =============================================================
 * Created on Sunday, 15th November 2020 11:02:44 am
 *
 * Copyright (c) 2020-2021 Andrea Corsini T/A RS1 Project - All rights reserved.
 * License: Apache License 2.0
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Modified on Sunday, 17th October 2021 8:30:24 pm
 * *****************************************************************************
 */

export default (visible = [], metadata = {}, separator = ' / ') =>
    visible
        .map(
            key =>
                `<span id="rs1-media-player-metadata-${key}">${
                    metadata[key] ?? ''
                }</span>`
        )
        .reduce(
            // eslint-disable-next-line no-sequences
            (acc, cur) => (cur && acc.push(cur), acc),
            []
        )
        .join(separator)
