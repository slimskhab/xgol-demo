import { CheckIcon, ChevronRightIcon, RepeatIcon } from '@chakra-ui/icons';
import { Button, Switch } from '@chakra-ui/react';
import React, { useState, useRef, useEffect } from 'react';
import { useSelector } from 'react-redux';

function Recording(props) {
    const [recording, setRecording] = useState(false);
    const [mediaStream, setMediaStream] = useState(null);
    const [mediaRecorder, setMediaRecorder] = useState(null);
    const [recordedChunks, setRecordedChunks] = useState([]);
    const videoRef = useRef(null);
    const videoRef2 = useRef(null);
    const audioContext = useRef(null);
    const analyser = useRef(null);
    const speech = useSelector((state) => state.recordingStore.speech);
    const startCamera = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
            const videoStream = new MediaStream([stream.getVideoTracks()[0]]);
            videoRef2.current.srcObject = videoStream;

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
    useEffect(() => {
        startCamera();

    }, []);

    const startRecording = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
            setMediaStream(stream);

            const recorder = new MediaRecorder(stream);
            setMediaRecorder(recorder);

            recorder.ondataavailable = (e) => {
                if (e.data.size > 0) {
                    setRecordedChunks((prev) => [...prev, e.data]);
                }
            };

            recorder.start();
        } catch (error) {
            console.error('Error accessing media devices:', error);
        }
    };

    const stopRecording = () => {
        if (mediaRecorder && mediaStream) {
            mediaRecorder.stop();
            mediaStream.getTracks().forEach((track) => track.stop());
            setMediaStream(null);
            setMediaRecorder(null);
        }
    };

    const playRecordedVideo = () => {
        const recordedBlob = new Blob(recordedChunks, { type: 'video/webm' });
        const recordedUrl = URL.createObjectURL(recordedBlob);
        videoRef.current.src = recordedUrl;
        videoRef.current.play();
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', width: '100%', alignItems: 'center' }}>
            <div style={{ display: 'flex', flexDirection: 'column', width: '80%', alignItems: 'center', justifyContent: 'center' }}>
                {
                    recordedChunks.length === 0 && (
                        <div>

                            <p>{speech}</p>
                            <br />
                            <video ref={videoRef2} autoPlay />
                            <br></br>
                            <div style={recording ? { border: '2px solid red', padding: '5px 10px', borderRadius: 10 } : { border: '2px solid #CBD5E0', padding: '5px 10px', borderRadius: 10 }}>

                                <Switch
                                    colorScheme='red'
                                    size='lg'
                                    style={{ paddingRight: 10 }}
                                    isChecked={recording}
                                    onChange={(e) => {
                                        setRecording(e.target.checked);
                                        if (e.target.checked) {
                                            startRecording();
                                        } else {
                                            stopRecording();
                                        }
                                    }}
                                />
                                {recording ? 'Stop Recording' : 'Start Recording'}
                            </div>
                        </div>
                    )
                }
                {recordedChunks.length > 0 && (
                    <>
                        <video ref={videoRef} controls autoPlay />
                        <br></br>
                        <div style={{ display: "flex" }}>
                            <Button style={{ marginRight: 20 }} leftIcon={< RepeatIcon boxSize={4} />} colorScheme='yellow' variant='outline' onClick={() => {
                                setRecordedChunks([])
                                startCamera()
                            }}>
                                Re-do
                            </Button>

                            <Button style={{ marginRight: 20 }} leftIcon={< ChevronRightIcon boxSize={7} />} colorScheme='blue' variant='outline' onClick={() => {
                                playRecordedVideo()
                            }}>
                                Play
                            </Button>
                            <Button leftIcon={< CheckIcon boxSize={4} />} colorScheme='teal' variant='outline' onClick={() => {

                            }}>
                                Submit
                            </Button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}

export default Recording;
