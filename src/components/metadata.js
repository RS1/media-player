/*
 * *****************************************************************************
 * File: metadata.js (/src/components/metadata.js) | @rs1/media-player
 * Written by Andrea Corsini <andrea@rs1.it>
 * =============================================================
 * Created on Sunday, 15th November 2020 11:02:44 am
 *
 * Copyright (c) 2020 RS1 Project
 * License: Apache License 2.0
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Modified on Sunday, 15th November 2020 11:09:30 am
 * *****************************************************************************
 */

export default (visible = [], metadata = {}, separator = ' / ') =>
    visible
        .map(key => metadata[key] ?? '')
        .reduce(
            // eslint-disable-next-line no-sequences
            (acc, cur) => (cur && acc.push(cur), acc),
            []
        )
        .join(separator)
