import React, {useState, useRef, useEffect} from 'react';
import styled from 'styled-components';
import {Play, Pause, Volume2, VolumeX, Maximize, Minimize, SkipBack, SkipForward} from 'lucide-react';

const VideoContainer = styled.div`
    position: relative;
    width: 100%;
    max-width: 800px;
    margin: auto;
    border: 2px solid #444;
    border-radius: 10px;
    overflow: hidden;
    background-color: #000;
`;

const Video = styled.video`
    width: 100%;
    border-radius: 10px;
`;

const Controls = styled.div`
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    background: rgba(0, 0, 0, 0.7);
    display: flex;
    flex-direction: column;
    padding: 10px;
    transition: opacity 0.3s;
    opacity: 0;

    ${VideoContainer}:hover & {
        opacity: 1;
    }
`;

const ProgressBar = styled.input`
    width: 100%;
    height: 5px;
    -webkit-appearance: none;
    background: transparent;
    cursor: pointer;

    &::-webkit-slider-runnable-track {
        width: 100%;
        height: 5px;
        background: #ddd;
        border-radius: 5px;
    }

    &::-webkit-slider-thumb {
        -webkit-appearance: none;
        height: 15px;
        width: 15px;
        border-radius: 50%;
        background: #fff;
        margin-top: -5px;
    }
`;

const ButtonGroup = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 10px;
`;

const Button = styled.button`
    background: none;
    border: none;
    color: white;
    cursor: pointer;
    margin: 0 5px;

    &:hover {
        color: #aaa;
    }
`;

const VolumeControl = styled.input`
    width: 80px;
    height: 5px;
    -webkit-appearance: none;
    background: transparent;
    cursor: pointer;
    position: absolute;
    bottom: 25px;
    left:220px;
    &::-webkit-slider-runnable-track {
        width: 100%;
        height: 5px;
        background: #ddd;
        border-radius: 5px;
    }

    &::-webkit-slider-thumb {
        -webkit-appearance: none;
        height: 15px;
        width: 15px;
        border-radius: 50%;
        background: #fff;
        margin-top: -5px;
    }
`;

const TimeDisplay = styled.span`
    position: absolute;
    left: 600px;
    color: white;
    font-size: 14px;
    bottom: 18px;
`;

const SpeedControl = styled.select`
  background: #444;
  color: white;
  border: 1px solid #666;
  border-radius: 5px;
  padding: 5px;
  font-size: 14px;

  &:hover {
    background: #555;
  }
`;

const VideoPlayer = ({src}) => {
    const videoRef = useRef(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [progress, setProgress] = useState(0);
    const [volume, setVolume] = useState(1);
    const [isMuted, setIsMuted] = useState(false);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [duration, setDuration] = useState(0);
    const [currentTime, setCurrentTime] = useState(0);
    const [playbackRate, setPlaybackRate] = useState(1);

    useEffect(() => {
        const video = videoRef.current;
        const updateProgress = () => {
            if (video.duration) {
                setProgress((video.currentTime / video.duration) * 100);
                setCurrentTime(video.currentTime);
            }
        };
        video.addEventListener('timeupdate', updateProgress);
        video.addEventListener('loadedmetadata', () => {
            setDuration(video.duration);
        });
        return () => {
            video.removeEventListener('timeupdate', updateProgress);
            video.removeEventListener('loadedmetadata', () => {
            });
        };
    }, []);

    const togglePlay = () => {
        if (videoRef.current.paused) {
            videoRef.current.play();
            setIsPlaying(true);
        } else {
            videoRef.current.pause();
            setIsPlaying(false);
        }
    };

    const handleProgressChange = (e) => {
        const newTime = (e.target.value / 100) * videoRef.current.duration;
        videoRef.current.currentTime = newTime;
        setProgress(e.target.value);
    };

    const handleVolumeChange = (e) => {
        const newVolume = e.target.value;
        videoRef.current.volume = newVolume;
        setVolume(newVolume);
        setIsMuted(newVolume === 0);
    };

    const toggleMute = () => {
        if (isMuted) {
            videoRef.current.volume = volume;
            setIsMuted(false);
        } else {
            videoRef.current.volume = 0;
            setIsMuted(true);
        }
    };

    const toggleFullscreen = () => {
        if (!document.fullscreenElement) {
            videoRef.current.requestFullscreen().catch(err => {
                console.error(`Error attempting to enable full-screen mode: ${err.message}`);
            });
        } else {
            document.exitFullscreen();
        }
        setIsFullscreen(!isFullscreen);
    };

    const skipBackward = () => {
        videoRef.current.currentTime -= 10;
    };

    const skipForward = () => {
        videoRef.current.currentTime += 10;
    };

    const changePlaybackRate = (e) => {
        const newRate = e.target.value;
        videoRef.current.playbackRate = newRate;
        setPlaybackRate(newRate);
    };

    const formatTime = (time) => {
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60);
        return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    };

    return (
        <VideoContainer>
            <Video
                ref={videoRef}
                src={src}
                onClick={togglePlay}
            />
            <Controls>
                <ProgressBar
                    type="range"
                    value={progress}
                    onChange={handleProgressChange}
                />
                <ButtonGroup>
                    <div>
                        <Button onClick={togglePlay}>
                            {isPlaying ? <Pause size={24}/> : <Play size={24}/>}
                        </Button>
                        <Button onClick={skipBackward}>
                            <SkipBack size={24}/>
                        </Button>
                        <Button onClick={skipForward}>
                            <SkipForward size={24}/>
                        </Button>
                        <Button onClick={toggleMute}>
                            {isMuted ? <VolumeX size={24}/> : <Volume2 size={24}/>}
                        </Button>
                        <VolumeControl
                            type="range"
                            min="0"
                            max="1"
                            step="0.1"
                            value={isMuted ? 0 : volume}
                            onChange={handleVolumeChange}
                        />
                        <TimeDisplay>
                            {formatTime(currentTime)} / {formatTime(duration)}
                        </TimeDisplay>
                    </div>
                    <div>
                        <SpeedControl value={playbackRate} onChange={changePlaybackRate}>
                            <option value="0.5">0.5x</option>
                            <option value="1">1x</option>
                            <option value="1.5">1.5x</option>
                            <option value="2">2x</option>
                        </SpeedControl>
                        <Button onClick={toggleFullscreen}>
                            {isFullscreen ? <Minimize size={24}/> : <Maximize size={24}/>}
                        </Button>
                    </div>
                </ButtonGroup>
            </Controls>
        </VideoContainer>
    );
};

export default VideoPlayer;