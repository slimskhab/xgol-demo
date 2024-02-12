import React, { useEffect, useRef, useState } from 'react';
import "./TestDevice.css"
import { Box, Button, Progress, Text } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';

function TestDevice(props) {
    const videoRef = useRef(null);
    const audioContext = useRef(null);
    const analyser = useRef(null);

    const [audioStrength, setAudioStrength] = useState(null)
    const [works, setWorks] = useState(false)

    const startCamera = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
            const videoStream = new MediaStream([stream.getVideoTracks()[0]]);
            videoRef.current.srcObject = videoStream;

            const audioTracks = stream.getAudioTracks();
            if (audioTracks.length > 0) {
                audioContext.current = new AudioContext();
                const source = audioContext.current.createMediaStreamSource(stream);
                analyser.current = audioContext.current.createAnalyser();
                analyser.current.fftSize = 256;
                source.connect(analyser.current);
            }
        } catch (err) {
            console.error('Error accessing camera:', err);
        }
    };

    const calculateVoiceLevel = () => {
        if (analyser.current) {
            const dataArray = new Uint8Array(analyser.current.frequencyBinCount);
            analyser.current.getByteFrequencyData(dataArray);
            const sum = dataArray.reduce((acc, val) => acc + val, 0);
            const average = sum / dataArray.length;
            return average;
        }
        return 0;
    };

    useEffect(() => {
        startCamera();
        const intervalId = setInterval(() => {
            const voiceLevel = calculateVoiceLevel();
            if (voiceLevel >= 80) {
                setWorks(true)
            }
            setAudioStrength(voiceLevel)
        }, 20);
        return () => {
            clearInterval(intervalId);
            if (audioContext.current) {
                audioContext.current.close();
            }
        };
    }, []);
const navigate=useNavigate()
    return (
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
            <div style={{ width: "50%", display: "flex", flexDirection: "column" }}>
                <h1 className='title'>Testing devices</h1>
                <span>Let's test your audio-video Devices.</span>
                <span>Say Hello XGol !</span>
                {
                    works&&<Button onClick={()=>{
                            navigate("/recording")
                        }} colorScheme='teal' size='md' bg={"var(--main-color)"} _hover={{ bg: "var(--secondary-color)" }}>
                            Continue
                        </Button>
                }
                
            </div>
            <div style={{ width: "50%", display: "flex", flexDirection: "column" }}>
                <video ref={videoRef} autoPlay />
                <Box position="relative">
                    <Progress value={audioStrength} />

                    <Text textAlign="center" mt="2">
                        {Math.floor(audioStrength)}
                    </Text>
                </Box>            </div>
        </div>
    );
}

export default TestDevice;
