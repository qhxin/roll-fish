import React, { useCallback, useEffect, useRef, useState } from 'react';
import _ from 'lodash';
import styled from '@emotion/styled';
import { Button } from '@mui/material';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';

const PlanTitle = styled.h1`
    text-align: center;
`;

const FlexBase = styled.div`
    display: flex;
    align-items: center;
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
    background-color: #e1e1e1;
    border-radius: 6px;
    font-size: 12px;
    margin-right: 6px;
    min-width: 50px;
    text-align: center;
`;

const VoiceTag = styled(Tag)`
    cursor: pointer;
    text-decoration: underline;
    display: flex;
    align-items: center;
    justify-content: center;

    &:hover {
        background-color: #a1a1a1;
    }
`;

const LearnProcess = ({ handleExec, learnCount, learnBook }) => {
    const [words, setWords] = useState([]);
    const queryRef = useRef(false);
    const [processIdx, setProcessIdx] = useState(0);

    useEffect(() => {
        if (!queryRef.current) {
            queryRef.current = true;
            handleExec(`SELECT * from ${learnBook} WHERE status = 0 ORDER BY RANDOM() LIMIT 0,${learnCount}`, (result) => {
                try {
                    const { columns, values } = result[0];
                    const words = [];
                    console.log(result, values);
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
                    console.log(`Query Error`, e);
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

    // console.log(words);
    if (words.length < 1) {
        return null;
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
                    <Button  variant="contained">学好了，开始测试！</Button>
                ) : (
                    <Button onClick={() => setProcessIdx(processIdx + 1)} variant="contained">下一个</Button>
                )}
            </FlexAround>
        </WordCard>
    );
};

export default LearnProcess;