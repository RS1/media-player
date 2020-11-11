/*
 * *****************************************************************************
 * File: svg-extract.js (/src/components/svg-extract.js) | @rs1/media-player-pages
 * Written by Andrea Corsini <andrea@rs1.it>
 * =============================================================
 * Created on Wednesday, 11th November 2020 1:17:53 pm
 *
 * Copyright (c) 2020 RS1 Project
 * License: Apache License 2.0
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Modified on Wednesday, 11th November 2020 1:53:00 pm
 * *****************************************************************************
 */

const parseSVG = content =>
    content
        ?.match?.(/<path( .*)?\/>/g)
        ?.reduce?.(
            (p, node) => p + ((node?.match?.(/ d="([^"]*)"/))[1] + ' ' ?? ''),
            ''
        ) ?? ''

export default (
    name = 'icon',
    file = '',
    size = [512, 512],
    collection = 'fas'
) => {
    const [w = 512, h = w] = size

    return {
        prefix: collection,
        iconName: name,
        icon: [w, h, [], 'f0000', parseSVG(file)],
    }
}
