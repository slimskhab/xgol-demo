import { Button, Select, Slider, SliderFilledTrack, SliderMark, SliderThumb, SliderTrack, Textarea } from '@chakra-ui/react';
import React, { useState } from 'react';
import "./RecordPage.css";
import { Spinner } from '@chakra-ui/react';
import {
    Table,
    Thead,
    Tbody,
    Tfoot,
    Tr,
    Th,
    Td,
    TableCaption,
    TableContainer,
} from '@chakra-ui/react'
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ArcGauge } from "@progress/kendo-react-gauges";
import { useDispatch } from 'react-redux';
import { addSpeech } from '../../../features/recording';

function RecordPage(props) {
const dispatch=useDispatch();
    const [sliderValue, setSliderValue] = useState(1)
    const [lang, setLang] = useState("lang1")
    const [type, setType] = useState("")

    const [total, setTotal] = useState(1)

    const [sections, setSections] = useState([])
    const [durations, setDurations] = useState(["30 sec", "30 sec", "1 min"])
    const [script1, setScript1] = useState(false)
    const [script2, setScript2] = useState(false)
    const [script3, setScript3] = useState(false)


    const labelStyles = {
        mt: '2',
        ml: '-5',
        fontSize: 'sm',
    }

    const [isLoadingImproved, setIsLoadingImproved] = useState(false)
    const [isLoadingStats, setIsLoadingStats] = useState(false)


    const navigate = useNavigate();
    const apiKey = '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';
    const endpoint = 'https://api.openai.com/v1/chat/completions';

    const [para1, setPara1] = useState("");
    const [para2, setPara2] = useState("");
    const [para3, setPara3] = useState("");


    const [paraImproved, setParaImproved] = useState("");


    const [showImproved, setShowImproved] = useState(false)
    const [showStats, setShowStats] = useState(false)


    const [completeness, setCompleteness] = useState();
    const [quality, setQuality] = useState();
    const [structure, setStructure] = useState()
    const handleStatsGeneration = async () => {
        try {
            setIsLoadingStats(true)
            const res = await axios.post(
                endpoint,
                {
                    model: "gpt-3.5-turbo", // Specify the model
                    max_tokens: 100,
                    messages: [{
                        role: "user",
                        content: `${para1}\n${para2}\n${para3}
            rate this speech in this format
Completeness:rate/100
Content Quality:rate/100
Structure:rate/100
no extra text please just say that 
            `
                    }]
                },
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${apiKey}`
                    }
                }
            );
            var splittedLines = res.data.choices[0].message.content.split("\n")
            for (let i = 0; i < splittedLines.length; i++) {
                var splittedContent = splittedLines[i].split(":")
                if (i === 0) {
                    setCompleteness(splittedContent[1].split("/")[0])
                } else if (i === 1) {
                    setQuality(splittedContent[1].split("/")[0])
                } else if (i === 2) {
                    setStructure(splittedContent[1].split("/")[0])
                }
            }
            setIsLoadingStats(false)

            setShowStats(true)

        } catch (error) {
            console.log(error)
        }
    };



    const handleImprove = () => {
        setShowImproved(false)
        setIsLoadingImproved(true)
        const headers = {
            "Authorization": "Bearer eyJhbGciOiJSUzI1NiIsImtpZCI6Ilg1ZVhrNHh5b2pORnVtMWtsMll0djhkbE5QNC1jNTdkTzZRR1RWQndhTmsiLCJ0eXAiOiJKV1QifQ.eyJvaWQiOiJjZGZkZWM3OS1iMTYyLTQ3NTMtYTBkNi1hYjRjYTYwODc4NTAiLCJzdWIiOiJjZGZkZWM3OS1iMTYyLTQ3NTMtYTBkNi1hYjRjYTYwODc4NTAiLCJlbWFpbHMiOlsic2xpbS5za2hhYkBtZWR0ZWNoLnRuIl0sIm5hbWUiOiJTbGltIFNraGFiIiwidGZwIjoiQjJDXzFfc3VzaTEiLCJub25jZSI6IjIyOWE5NjcwLWI1NDQtNGYxMC05NGFmLWY0Y2EyYjgxNjQ4NCIsInNjcCI6IkFkbWluVmlkZW8uUmVhZFdyaXRlIEFkbWluVmlkZW8uUmVhZCBWaWRlby5SZWFkV3JpdGUgVmlkZW8uUmVhZCBTcGVlY2guUmVhZCBTcGVlY2guUmVhZFdyaXRlIiwiYXpwIjoiZDA1Y2M0ZjUtYTA1Mi00Mzc2LWI5M2QtZmE3ZGY4MWNiMzRmIiwidmVyIjoiMS4wIiwiaWF0IjoxNzA3NjQ5MDM2LCJhdWQiOiIwNzE1NTU1YS05ZDNmLTRkOTAtODE1OC02NjczODc0NjU0YjciLCJleHAiOjE3MDc3MzU0MzYsImlzcyI6Imh0dHBzOi8veGdvbG9yZy5iMmNsb2dpbi5jb20vZjQwOWY0MGMtMDcxOC00YjFlLWJkNjQtMmU3NTJmODQxNjhjL3YyLjAvIiwibmJmIjoxNzA3NjQ5MDM2fQ.OIlMgFrUXgwS7CJz6VLVM56UtKM5A8ypbXdfAtnvZnFe8vmdbzGGrukqW5FGqA41gZQYyoAHJCXfPexzJ90VyPnbjXFwUaYTw7AB3v3Tc9NFpvOMK3eq16uMZPNJ-b5CZalY2Q4fnGt23_HiQDhAsY6RSAPoO2S80aHVAKa1J3uhK3ZTRAoAm9gkMSt9dugYYTndr3QZPrufQCVKbIYJ5dTMmn31ZsdjyWDWYoXQ1Opbw5GbpesyvvUUrbX7KPjTYSL5Y0PAujes_v3pi7Pc78Tq50VUG7azcKuS7_krDj_Pk34mSllLp0di1cMjboo-PS8tFoGWFBb4FwPkj4dEwQ"
        }
        axios.post("https://api.xgol.pro/api/speech/improve", {
            text: `${para1}\n${para2}\n${para3}`
        }, { headers: headers }).then((res) => {
            setShowImproved(true)
            setIsLoadingImproved(false)

            setParaImproved(res.data)

        }).catch((e)=>{
            setIsLoadingImproved(false)

        })
    }

    const colors = [
        {
            to: 25,
            color: "#f31700",
        },
        {
            from: 25,
            to: 50,
            color: "#ffc000",
        },
        {
            from: 50,
            to: 75,
            color: "#37b400",
        },
        {
            from: 75,
            color: "#0058e9",
        },
    ];
    const arcOptionsCompleteness = {
        value: completeness,
        colors,
    };

    const arcOptionsStructure = {
        value: structure,
        colors,
    };

    const arcOptionsQuality = {
        value: quality,
        colors,
    };
    const arcCenterRenderer = (value, color) => {
        return (
            <span
                style={{
                    color: color,
                    fontSize: 20
                }}
            >
                {value}/100
            </span>

        );
    };
    return (
        <div style={{ display: "flex", flexDirection: "row", width: "100%", justifyContent: "center" }}>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", width: "80%" }}>
                <h1 className='title'>Hello, Slim</h1>


                <p>
                Ready to show the world how awesome you are?

                    <br></br>
                    Please click start and accept the necessary permissions to access your camera and microphone.
                </p>
                <b>
                Please select the speech type and language
                </b>
                <br></br>
                <div style={{ display: "flex", width: "100%", justifyContent: "space-between" }}>
                    <div style={{ width: "45%" }}>
                        <Select placeholder='Select Language' style={{ width: "100%" }} defaultValue='lang1' value={lang} onChange={(e) => {
                            setLang(e.target.value)

                        }}>
                            <option value='lang1'>Francais</option>
                            <option value='lang2'>Anglais</option>
                            <option value='lang3'>عربي</option>
                        </Select>

                    </div>
                    <div style={{ width: "45%" }}>
                        <Select placeholder='Select Type' style={{ width: "100%" }} defaultValue='type1' value={type} onChange={(e) => {
                            setType(e.target.value)
                            if (e.target.value === "type1") {
                                setSections(["Introduction", "Body", "Conclusion"])
                                setTotal(3)
                            } else if (e.target.value === "type2") {
                                setSections(["Introduction", "Exploration", "Engagement and Action"])

                                setTotal(4)
                            } else if (e.target.value === "type3") {
                                setSections(["Inspiring Beginning", "Building Momentum", "Empowering Action"])

                                setTotal(5)
                            } else {
                                setSections([])
                            }

                        }}>
                            <option value='type1'>Informative Speech</option>
                            <option value='type2'>Persuasive Speech</option>
                            <option value='type3'>Motivational Speech</option>
                        </Select>
                    </div>


                </div>
                <br>
                </br>
                <span>Best speech duration for this combination is : {total} min</span>
                <br></br>
                <div style={{ width: "60%" }}>
                    <Slider defaultValue={2} min={1} max={5} step={1} onChange={(val) => {
                        if (val === 1) {
                            setDurations(["20 sec", "20 sec", "20 sec"])
                        } else if (val === 2) {
                            setDurations(["30 sec", "30 sec", "1 min"])

                        } else if (val === 3) {
                            setDurations(["1 min", "1 min", "1 min"])

                        } else if (val === 4) {
                            setDurations(["1 min", "1 min 30 sec", "1 min 30 sec"])

                        }
                        else if (val === 5) {
                            setDurations(["1 min", "2 min", "2 min"])

                        }
                    }}>

                        <SliderMark value={1} {...labelStyles}>
                            1min
                        </SliderMark>
                        <SliderMark value={2} {...labelStyles}>
                            2min
                        </SliderMark>
                        <SliderMark value={3} {...labelStyles}>
                            3min
                        </SliderMark>
                        <SliderMark value={4} {...labelStyles}>
                            4min
                        </SliderMark>
                        <SliderMark value={5} {...labelStyles} style={{ display: "flex" }}>
                            5min
                        </SliderMark>
                        <SliderTrack bg='var(--secondary-color)'>
                            <SliderFilledTrack bg='var(--main-color)' />
                        </SliderTrack>
                        <SliderThumb boxSize={6} />
                    </Slider>
                </div>
                <br></br>
                {
                    sections.length !== 0 &&

                    <div style={{ width: "100%", display: "flex", flexDirection: "column" }}>
                        <TableContainer style={{ width: "100%" }}>
                            <Table variant='simple' style={{ width: "100%" }}>
                                <Thead>
                                    <Tr style={{ width: "30%" }}>
                                        <Th style={{ width: "30%" }}>Question</Th>
                                        <Th>Duration</Th>
                                        <Th>Your Script</Th>
                                    </Tr>
                                </Thead>
                                <Tbody>
                                    <Tr style={{ width: "30%" }}>
                                        <Td style={{ width: "30%" }}>{sections[0]}</Td>
                                        <Td>{durations[0]}</Td>
                                        <Td>
                                            {
                                                script1 ?
                                                    <Textarea value={para1} onChange={(e) => {
                                                        setPara1(e.target.value)
                                                    }}
                                                        placeholder='Put script here'
                                                        size='sm'
                                                        resize="vertical"
                                                    /> : <span style={{ cursor: "pointer", color: "var(--main-color)", fontWeight: "bold" }} onClick={() => {
                                                        setScript1(!script1)
                                                    }}>
                                                        Add your script
                                                    </span>
                                            }

                                        </Td>
                                    </Tr>
                                    <Tr style={{ width: "40%" }}>
                                        <Td style={{ width: "40%" }}>{sections[1]}</Td>
                                        <Td>{durations[1]}</Td>
                                        <Td>{script2 ? <Textarea value={para2} onChange={(e) => {
                                            setPara2(e.target.value)
                                        }}
                                            placeholder='Put script here'
                                            size='sm'
                                            resize="vertical"
                                        /> : <span style={{ cursor: "pointer", color: "var(--main-color)", fontWeight: "bold" }} onClick={() => {
                                            setScript2(!script2)

                                        }}>
                                            Add your script
                                        </span>}</Td>
                                    </Tr>
                                    <Tr>
                                        <Td>{sections[2]}</Td>
                                        <Td>{durations[2]}</Td>
                                        <Td>{script3 ? <Textarea value={para3} onChange={(e) => {
                                            setPara3(e.target.value)
                                        }}
                                            placeholder='Put script here'
                                            size='sm'
                                            resize="vertical"
                                        /> : <span style={{ cursor: "pointer", color: "var(--main-color)", fontWeight: "bold" }} onClick={() => {
                                            setScript3(!script3)

                                        }}>
                                            Add your script
                                        </span>}</Td>
                                    </Tr>
                                </Tbody>

                            </Table>
                        </TableContainer>
                        <b>Everything is Ready!</b>
                        <br></br>
                        <div style={{ display: "flex", justifyContent: "space-between", width: "100%" }}>
                            <Button style={{ width: "30%" }} isDisabled={para1.length===0||para2.length===0||para3.length===0} onClick={() => {
                                handleImprove();
                            }} colorScheme='teal' size='md' bg={"var(--main-color)"} _hover={{ bg: "var(--secondary-color)" }}>
                                {
                                    isLoadingImproved ? <Spinner /> : "Improve Speech"
                                }
                            </Button>
                            <Button style={{ width: "30%" }} isDisabled={para1.length===0||para2.length===0||para3.length===0} onClick={() => {
                                handleStatsGeneration()

                            }} colorScheme='teal' size='md' bg={"var(--main-color)"} _hover={{ bg: "var(--secondary-color)" }}>
                                {
                                    isLoadingStats ? <Spinner /> : "Rate Speech"
                                }
                            </Button>
                            <Button style={{ width: "30%" }} onClick={() => {
                                dispatch(addSpeech(`${para1}\n${para2}\n${para3}`))
                                navigate("/verify")
                            }} colorScheme='teal' size='md' bg={"var(--main-color)"} _hover={{ bg: "var(--secondary-color)" }}>
                                Start Recording
                            </Button>
                        </div>
                    </div>
                }
                <br></br>
                {
                    showImproved &&
                    <div style={{display:"flex",flexDirection:"column",alignItems:"center",width:"100%"}}>

                    <Textarea value={paraImproved} onChange={(e) => {
                        
                        setParaImproved(e.target.value)
                    }}
                        placeholder='Put script here'
                        size='sm'
                        resize="vertical"
                    />
                    <br></br>
                    <Button style={{ width: "50%" }} onClick={() => {
                                                        dispatch(addSpeech(paraImproved))

                                navigate("/verify")
                            }} colorScheme='teal' size='md' bg={"var(--main-color)"} _hover={{ bg: "var(--secondary-color)" }}>
                                Start Recording With Improved Speech
                            </Button>
</div>
                }
                <br></br>
                {
                    showStats && <div style={{ display: "flex" }}>

                        <div>
                            <ArcGauge style={{ width: "400px", height: "100px" }} {...arcOptionsCompleteness} arcCenterRender={arcCenterRenderer} />
                            <b>
                                Completeness
                            </b>
                        </div>

                        <div>
                            <ArcGauge style={{ width: "400px", height: "100px" }} {...arcOptionsStructure} arcCenterRender={arcCenterRenderer} />
                            <b>
                                Structure
                            </b>
                        </div>

                        <div>
                            <ArcGauge style={{ width: "400px", height: "100px" }} {...arcOptionsQuality} arcCenterRender={arcCenterRenderer} />
                            <b>
                                Quality
                            </b>
                        </div>

                    </div>

                }



            </div>
        </div>

    );
}

export default RecordPage;