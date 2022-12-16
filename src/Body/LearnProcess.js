import React, { useCallback, useEffect, useRef, useState } from 'react';
import _ from 'lodash';
import styled from '@emotion/styled';
import { Button } from '@mui/material';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
// import FormLabel from '@mui/material/FormLabel';
import FormHelperText from '@mui/material/FormHelperText';

const PlanTitle = styled.h1`
    text-align: center;
`;

const FlexBase = styled.div`
    display: flex;
    align-items: flex-start;
`;

const FlexAround = styled(FlexBase)`
    justify-content: space-around;
`;

const WordLine = styled.div`
    margin-bottom: 12px;
`;

const FlexCenter = styled(FlexBase)`
    justify-content: center;
`;

const WordCard = styled.div`
    position: relative;
    padding: 32px;
    font-size: 14px;
`;

const WordPosition = styled.div`
    margin-right: 12px;
`;

const Tag = styled.div`
    padding: 4px 12px;
    border-radius: 6px;
    font-size: 12px;
    margin-right: 6px;
    min-width: 50px;
    text-align: center;

    ${({ theme }) => {
        // console.log(theme);
        return {
            // backgroundColor: theme.palette.grey[300],
            color: theme.palette.info.contrastText,
            backgroundColor: theme.palette.info[theme.palette.mode],
        }
    }}
`;

const TestTag = styled(Tag)`
    text-align: left;
    font-size: 18px;
`;

const VoiceTag = styled(Tag)`
    cursor: pointer;
    text-decoration: underline;
    display: flex;
    align-items: center;
    justify-content: center;

    &:hover {
        ${({ theme }) => {
            return {
                backgroundColor: theme.palette.grey[400],
            }
        }}
    }
`;

const LearnProcess = ({ handleExec, handleEnd, learnCount, learnBook }) => {
    const [words, setWords] = useState([]);
    const queryRef = useRef(false);
    const [processIdx, setProcessIdx] = useState(0);
    const [testWords, setTestWords] = useState([]);
    const [testRecord, setTestRecord] = useState({});
    const [showTestRes, setShowTestRes] = useState(false);

    useEffect(() => {
        if (!queryRef.current) {
            queryRef.current = true;
            handleExec(`SELECT * from ${learnBook} WHERE status = 0 ORDER BY RANDOM() LIMIT 0,${learnCount}`, undefined, (result) => {
                try {
                    const { columns, values } = result[0];
                    const words = [];
                    // console.log(result, values);
                    for (let i = 0; i < values.length; i++) {
                        const line = values[i];
                        const word = {};
                        for (let j = 0; j < line.length; j++) {
                            const val = line[j];
                            word[columns[j]] = val;
                        }
                        words.push(word);
                    }
                    setWords(words);
                } catch (e) {
                    console.log(`Parse Query Result Error`, e);
                }
            });
        }
    }, []);

    const handleVoice = useCallback((word, type) => {
        const audio = new Audio(`https://dict.youdao.com/dictvoice?audio=${word}&type=${type}`);
        audio.play();
    }, []);

    const handleVoiceUK = useCallback(_.throttle((...args) => {
        handleVoice(...args)
    }, 3000), []);

    const handleVoiceUS = useCallback(_.throttle((...args) => {
        handleVoice(...args)
    }, 3000), []);

    const handleChangeTest = useCallback((wd, value) => {
        setTestRecord(old => {
            return {
                ...old,
                [wd]: value,
            };
        });
    }, []);

    const handleStartTest = useCallback(_.throttle(() => {
        // console.log(words)

        handleExec(`SELECT * from ${learnBook} WHERE headWord NOT IN (${_.map(words, v => `'${v.headWord}'`).join(',')}) ORDER BY RANDOM() LIMIT 0,${learnCount*2}`, undefined, (result) => {
            try {
                const { columns, values } = result[0];
                const _words = [];
                for (let i = 0; i < values.length; i++) {
                    const line = values[i];
                    const word = {};
                    for (let j = 0; j < line.length; j++) {
                        const val = line[j];
                        word[columns[j]] = val;
                    }
                    _words.push(word);
                }
                const _testWords = [];
                _.each(words, (wd, i) => {
                    _testWords.push(_.shuffle([
                        wd.tranCN,
                        _words[i].tranCN,
                        _words[i + learnCount].tranCN,
                    ]));
                });
                setTestWords(_testWords);
            } catch (e) {
                console.log(`Parse Query Result Error`, e);
            }
        });
    }, 1000), [words]);

    const handleEndTest = () => {
        // console.log(testRecord, words);
        const pass = [];
        _.each(words, (wd) => {
            if (wd.tranCN === testRecord[wd.headWord]) {
                pass.push(`"${wd.headWord}"`);
            }
        });

        // console.log(testRecord,pass);
        if (pass.length) {
            handleExec(`UPDATE ${learnBook} set status=1 WHERE headWord IN (${pass.join(',')})`, undefined, (result) => {
                console.log(result);
            });
        }
        setShowTestRes(true);
    };

    // console.log(words);
    if (words.length < 1) {
        return (
            <WordCard>
                <FlexCenter>
                    <PlanTitle>这本书已经没有单词可学了</PlanTitle>
                </FlexCenter>
                <FlexCenter>
                    <Button onClick={handleEnd} variant="contained">去卷其他的吧</Button>
                </FlexCenter>
            </WordCard>
        );
    }


    if (testWords.length > 0) {
        return (
            <WordCard>
                <FlexCenter>
                    <PlanTitle>学习检测</PlanTitle>
                </FlexCenter>
                <FlexCenter><WordLine>请选择正确解释</WordLine></FlexCenter>
                <div>
                    {_.map(words, (wd, i) => {
                        const error = !(wd.tranCN === testRecord[wd.headWord]);

                        return (
                            <WordLine key={wd.headWord}>
                                <TestTag>{i + 1}) {wd.headWord}</TestTag>
                                <FormControl component="fieldset" error={showTestRes ? error : undefined}>
                                    <RadioGroup aria-label="请选择正确解释" name={wd.headWord} value={testRecord[wd.headWord] || ''} onChange={(event) => handleChangeTest(wd.headWord, event.target.value)}>
                                        {_.map(testWords[i], (v) => {
                                            return <FormControlLabel key={v} disabled={showTestRes && testRecord[wd.headWord]!==v} value={v} control={<Radio color={showTestRes ? (error ? 'error' : 'success') : undefined} />} label={v} />
                                        })}
                                    </RadioGroup>
                                    {(showTestRes && error) ? (
                                        <FormHelperText>正确答案：{wd.tranCN}</FormHelperText>
                                    ) : null}
                                </FormControl>
                            </WordLine>
                        );
                    })}
                </div>
                <FlexCenter>
                    {showTestRes ? (
                        <Button onClick={handleEnd} variant="contained">再卷一轮！</Button>
                    ) : (
                        <Button onClick={handleEndTest} variant="contained">交卷</Button>
                    )}
                </FlexCenter>
            </WordCard>
        );
    }

    // console.log(words);
    const currentWord = words[processIdx];

    return (
        <WordCard>
            <FlexCenter>
                <PlanTitle>{currentWord.headWord}</PlanTitle>
            </FlexCenter>
            <WordLine>
                <FlexBase>
                    {currentWord.ukphone ? (<><VoiceTag onClick={() => handleVoiceUK(currentWord.headWord, 1)}>英<VolumeUpIcon fontSize="small" /></VoiceTag><div style={{ marginRight: 6 }}>/{currentWord.ukphone}/</div></>) : null}
                    {currentWord.usphone ? (<><VoiceTag onClick={() => handleVoiceUS(currentWord.headWord, 2)}>美<VolumeUpIcon fontSize="small" /></VoiceTag><div>/{currentWord.usphone}/</div></>) : null}
                </FlexBase>
            </WordLine>
            <WordLine>
                <FlexBase>
                    <Tag>解释</Tag>
                    <WordPosition><i>[{currentWord.pos}]</i></WordPosition>
                    <div>{currentWord.tranCN}</div>
                </FlexBase>
            </WordLine>
            {currentWord.phrase ? (
                <WordLine>
                    <FlexBase><Tag>短语</Tag><div style={{ marginRight: 6 }} dangerouslySetInnerHTML={{ __html: `${currentWord.phrase}`.replace(currentWord.headWord, `<b>${currentWord.headWord}</b>`) }} /><div>({currentWord.phraseCN})</div></FlexBase>
                </WordLine>
            ) : null}
            {currentWord.sentence ? (
                <WordLine>
                    <FlexBase><Tag>例句</Tag><div style={{ marginRight: 6 }} dangerouslySetInnerHTML={{ __html: `${currentWord.sentence}`.replace(currentWord.headWord, `<b>${currentWord.headWord}</b>`) }} /><div>({currentWord.sentenceCN})</div></FlexBase>
                </WordLine>
            ) : null}
            <FlexAround style={{ marginTop: 64 }}>
                {processIdx > 0 ? (
                    <Button onClick={() => setProcessIdx(processIdx - 1)}>上一个</Button>
                ) : null}
                {processIdx === words.length - 1 ? (
                    <Button onClick={handleStartTest} variant="contained">学好了，开始测试！</Button>
                ) : (
                    <Button onClick={() => setProcessIdx(processIdx + 1)} variant="contained">下一个</Button>
                )}
            </FlexAround>
        </WordCard>
    );
};

export default LearnProcess;