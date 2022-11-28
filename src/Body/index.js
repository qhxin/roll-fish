import { useState } from 'react';
import styled from '@emotion/styled';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import LearnWords from './LearnWords';
import logo from '../assets/logo.png';

const LayoutCenter = styled.div`
    text-align: center;
`;

const Wrapper = styled.div`
    padding: 16px 16px 32px 16px;
`;

const BodyImage = styled.img`
    margin: 16px;
    width: 180px;
`;

const Tips = styled.div`
    margin-top: 16px;
`;

const StyledPaper = styled(Paper)`
    padding: 16px 16px 32px 16px;
`;

const LimitPaper = styled(StyledPaper)`
    width: 800px;
    margin: 0 auto;
`;

const StartArea = styled(LayoutCenter)`
    margin-top: 16px;
`;

const Body = () => {
    const theme = useTheme();
    const matches = useMediaQuery(theme.breakpoints.up('md'));

    const MatchedPaper = matches ? LimitPaper : StyledPaper;

    const [started, setStarted] = useState(false);
    
    return (
        <Wrapper>
            <MatchedPaper>
                {started ? (
                    <>
                        <LearnWords />
                    </>
                ) : (
                    <>
                        <LayoutCenter>
                            <BodyImage src={logo} />
                            <Typography variant="h6" mb={2} align="center" color="inherit" component="div">这是一个利用摸鱼时间背单词的软件</Typography>
                            <Typography variant="h6" mb={2} align="center" color="inherit" component="div">可以让你在上班、上课等恶劣环境下安全隐蔽地背单词</Typography>
                        </LayoutCenter>
                        <LayoutCenter>
                            <div>由于ToastFish只支持Win10+系统且只有本地程序，为了让更多人能够持续<b>学习进步</b>，我开发了这个WEB版。</div>
                            <Tips>Tips: 数据和部分功能来自于 <a href="https://github.com/Uahh/ToastFish" target="_blank" rel="noopener noreferrer">ToastFish</a></Tips>
                        </LayoutCenter>
                        <StartArea>
                            <Button variant="contained" onClick={() => setStarted(true)}>进入学习</Button>
                        </StartArea>
                    </>
                )}
            </MatchedPaper>
        </Wrapper>
    );
};

export default Body;