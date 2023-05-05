/* ┐
   │ File: svg.ts [/src/utils/svg.ts]
   │ Package: @rs1/media-player | RS1 Project
   │ Author: Andrea Corsini
   │ Created: April 21st, 2023 - 16:42:17
   │ Modified: April 27th, 2023 - 12:22:32
   │ 
   │ Copyright (c) 2023 Andrea Corsini T/A RS1 Project.
   │ This work is licensed under the terms of the MIT License.
   │ For a copy, see https://opensource.org/licenses/MIT
   │ or the LICENSE file in the root of this project.
   └ */

/**
 * Extract the width and height from an SVG string looking for the viewBox attribute
 * @param content The SVG string
 * @returns The width and height of the SVG
 */
export function extractViewBoxFromSVG(content: string): [width: number, height: number] {
    if (!content || typeof content !== 'string') return [0, 0]

    const match = content.match(/viewBox="([^"]*)"/)
    if (!match) return [0, 0]

    const [width, height] = match[1]
        .split(' ')
        .slice(2)
        .map(x => parseInt(x))

    return [width, height]
}

/**
 * Extract the paths from an SVG string looking for the path tags and their d attribute.
 * @param content The SVG string
 * @returns The paths of the SVG as an array of strings
 */
export function extactPathsFromSVG(content: string): string[] {
    if (!content || typeof content !== 'string') return []

    const match = content.match(/<path( .*)?\/>/g)
    if (!match) return []

    const paths = match.reduce((p, node) => {
        const d = node.match(/ d="([^"]*)"/)
        if (!d || !d[1]) return p
        p.push(d[1])
        return p
    }, [] as string[])

    return paths
}

/**
 * Extract the width, height and paths from an SVG string
 * @param content The SVG string
 * @returns The width, height and paths of the SVG
 * @see extractViewBoxFromSVG
 * @see extactPathsFromSVG
 */
export function extractSVG(content: string): {
    width: number
    height: number
    paths: string[]
} {
    const [width, height] = extractViewBoxFromSVG(content)
    const paths = extactPathsFromSVG(content)

    return { width, height, paths }
}
