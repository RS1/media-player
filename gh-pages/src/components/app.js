/*
 * *****************************************************************************
 * File: app.js (/src/components/app.js) | @rs1/media-player-pages
 * Written by Andrea Corsini <andrea@rs1.it>
 * =============================================================
 * Created on Monday, 9th November 2020 6:24:53 pm
 *
 * Copyright (c) 2020 RS1 Project
 * License: Apache License 2.0
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Modified on Wednesday, 11th November 2020 7:52:50 pm
 * *****************************************************************************
 */

import React, { useState } from 'react'
import styled from '@emotion/styled'

import './app.css'

import Player from '@rs1/media-player'

export default () => {
    const [track, setTrack] = useState(1)
    const tracks = [
        {
            title: 'Algorithmic Sounds',
            artist: 'Sound Helix',
            src:
                'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
            video: false,
            poster: 'https://picsum.photos/id/10/2500/1667',
        },
        {
            title: 'Big Buck Bunny',
            artist: 'Artist unknown',
            src:
                'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
            video: true,
        },
    ]

    const [state, setState] = useState({
        canMute: true,
        canFullScreen: true,
        isPlaylist: true,
        loop: false,
        autoResize: true,
        playerWidth: 512,
        playerHeight: 512,
        controlsColor: '#f0cd41',
        metadataOnMediaColor: '#f0cd41',
        accentColor: '#009fe3',
        loaderColor: '#f0cd41',
        fontFamily: 'Helvetica Neue',
    })

    const config = {
        options: {
            playerSize: [state.playerWidth, state.playerHeight],
            canMute: state.canMute,
            canFullScreen: state.canFullScreen,
            isPlaylist: state.isPlaylist,
            loop: state.loop,
            autoResize: state.autoResize,
        },
        style: {
            controlsColor: state.controlsColor,
            metadataOnMediaColor: state.metadataOnMediaColor,
            accentColor: state.accentColor,
            loaderColor: state.loaderColor,
            fontFamily: state.fontFamily,
        },
        actions: {
            onPrevious: () => {
                setTrack(t => (t === 0 ? tracks.length : t) - 1)
            },
            onNext: () => {
                setTrack(t => (t === tracks.length - 1 ? 0 : t + 1))
            },
            // onPlayingChanged: playing => console.log(`Playing: ${playing}`),
            // onLoadingChanged: loading => console.log(`Loading: ${loading}`),
            // onSeekingChanged: seeking => console.log(`Seeking: ${seeking}`),
            // onBufferChanged: buffer => console.log(`Buffer: ${buffer}`),
            // onTimeChanged: time => console.log(`Time: ${time}`),
            // onStateChanged: state =>
            //     console.log(`State: ${JSON.stringify(state)}`),
        },
    }

    const options = {
        canMute: {
            label: 'Mute button',
            type: 'checkbox',
            value: state.canMute,
        },
        canFullScreen: {
            label: 'Full screen button',
            type: 'checkbox',
            value: state.canFullScreen,
        },
        isPlaylist: {
            label: 'Enable playlist controls',
            type: 'checkbox',
            value: state.isPlaylist,
        },
        loop: {
            label: 'Loop single media',
            type: 'checkbox',
            value: state.loop,
        },
        autoResize: {
            label: 'Auto resize player to fit content',
            type: 'checkbox',
            value: state.autoResize,
        },
        controlsColor: {
            label: 'Icons / text color for controls',
            type: 'text',
            value: state.controlsColor,
        },
        metadataOnMediaColor: {
            label: 'Color of text on media',
            type: 'text',
            value: state.metadataOnMediaColor,
        },
        accentColor: {
            label: 'Active icon color',
            type: 'text',
            value: state.accentColor,
        },
        loaderColor: {
            label: 'Loading text color',
            type: 'text',
            value: state.loaderColor,
        },
        fontFamily: {
            label: 'Font Family',
            type: 'text',
            value: state.fontFamily,
        },
    }

    const handleChange = e => {
        setState(state => ({
            ...state,
            [e.target.name]:
                options[e.target.name].type === 'checkbox'
                    ? e.target.checked
                    : e.target.value,
        }))
    }

    return (
        <Container>
            <Title>@rs1/media-player</Title>
            <Wrapper>
                <Sidebar>
                    <Subtitle>Options</Subtitle>
                    {Object.entries(options).map(([key, option]) => (
                        <Option key={key}>
                            {option.type === 'checkbox' && (
                                <>
                                    <input
                                        id={`option_${key}`}
                                        type='checkbox'
                                        name={key}
                                        onChange={handleChange}
                                        checked={option.value}
                                    />
                                    <label htmlFor={`option_${key}`}>
                                        {option.label}
                                    </label>
                                </>
                            )}
                            {['number', 'text'].includes(option.type) && (
                                <>
                                    <label htmlFor={`option_${key}`}>
                                        {option.label}
                                    </label>
                                    <br />
                                    <input
                                        id={`option_${key}`}
                                        type={option.type}
                                        name={key}
                                        onChange={handleChange}
                                        value={option.value}
                                        placeholder={option.label}
                                    />
                                </>
                            )}
                        </Option>
                    ))}
                </Sidebar>
                <Content>
                    <Player media={tracks[track]} config={config} />
                </Content>
            </Wrapper>
        </Container>
    )
}

const Container = styled.div`
    width: 100vw;
    height: 100vh;
    display: flex;
    flex-direction: column;
`

const Title = styled.h1`
    font-size: 25px;
    margin: 15px 0 0 0;
    width: 100%;
    text-align: center;
    flex: 1;
`

const Wrapper = styled.div`
    display: flex;
    flex-direction: row;
    padding: 15px;
    box-sizing: border-box;
    flex: 999;
`

const Sidebar = styled.div`
    display: flex;
    flex-direction: column;
    width: 30%;
    box-sizing: border-box;
    margin-right: 15px;
    background: #eeeeee;
    padding: 5px 10px;
    border-radius: 10px;
    align-items: flex-start;
    justify-content: flex-start;
`

const Subtitle = styled.h3`
    font-size: 17px;
    margin: 10px 0;
    width: 100%;
    text-align: center;
`

const Option = styled.div`
    padding: 5px 0;
    border-bottom: 1px solid #dddddd;
    &:last-of-type {
        border-bottom: 0;
    }
    & input[type='checkbox'] {
        margin-right: 5px;
    }
    & input[type='text'],
    input[type='number'] {
        margin-top: 5px;
    }
`

const Content = styled.div`
    width: 70%;
    position: relative;
    box-sizing: border-box;
`
