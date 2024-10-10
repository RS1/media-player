/* ┐
   │ File: device-detect.ts [/src/utils/device-detect.ts]
   │ Package: @rs1/media-player | RS1 Project
   │ Author: Andrea Corsini
   │ Created: April 26th, 2023 - 13:52:38
   │ Modified: April 27th, 2023 - 12:22:32
   │ 
   │ Copyright (c) 2023 Andrea Corsini T/A RS1 Project.
   │ This work is licensed under the terms of the MIT License.
   │ For a copy, see https://opensource.org/licenses/MIT
   │ or the LICENSE file in the root of this project.
   └ */

/**
 * @see https://developer.mozilla.org/en-US/docs/Web/API/Navigator/userAgentData
 */
declare global {
    interface ExperimentalNavigator extends Navigator {
        userAgentData?: {
            brands: {
                brand: string
                version: string
            }[]
            mobile?: boolean
            platform: string
        }
    }
}

declare const navigator: ExperimentalNavigator

/** @see https://stackoverflow.com/questions/9038625/detect-if-device-is-ios/9039885#comment132097456_9039885 */
const navigatorPlatform = typeof window !== 'undefined' ? navigator.userAgentData?.platform || navigator.platform : ''

/** @see https://stackoverflow.com/a/23522755 */
export const isSafari = typeof window !== 'undefined' ? /^((?!chrome|android).)*safari/i.test(navigator.userAgent) : false

/**
 * @see https://stackoverflow.com/a/9039885
 */
export const isIOS = typeof window !== 'undefined' ?
    /^(iPhone|iP[oa]d)(\sSimulator)?$/i.test(navigatorPlatform) ||
    (navigator.userAgent.includes('Mac') && 'ontouchend' in document) : false
