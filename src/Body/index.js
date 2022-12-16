import localforage from '../localForage';
import { useCallback, useState } from 'react';
import styled from '@emotion/styled';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import { useTheme } from '@mui/material/styles';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import useMediaQuery from '@mui/material/useMediaQuery';
import LearnWords from './LearnWords';
import { LOCAL_SAVE } from '../meta';
import logo from '../assets/logo.png';

const LayoutCenter = styled.div`
    text-align: center;
`;

const Wrapper = styled.div`
    min-height: 80vh;
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

    ${({ matches }) => {
        return matches ? {
            width: 800,
            margin: '0 auto',
        } : {};
    }}
`;


const StartArea = styled(LayoutCenter)`
    margin-top: 16px;
    position: relative;
`;

const ClearArea = styled.div`
    position: absolute;
    top: 0;
    right: 0;
`;

const Body = () => {
    const theme = useTheme();
    const matches = useMediaQuery(theme.breakpoints.up('md'));

    const [started, setStarted] = useState(false);
    
    const [openClear, setOpenClear] = useState(false);

    const handleOpenClear = useCallback(() => {
        setOpenClear(true);
    }, []);

    const handleCloseClear = useCallback(() => {
        setOpenClear(false);
    }, []);

    const handleClear = useCallback(() => {
        // console.log('clear');
        (async () => {
            
            try {
                await localforage.removeItem(LOCAL_SAVE);
                handleCloseClear();
            } catch (e) {
                console.error(e);
            }
        })();

    }, []);

    return (
        <Wrapper>
            <StyledPaper matches={!!matches ? 1 : undefined}>
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
                            <div>由于ToastFish只支持Win10+系统且只有本地程序，为了让更多人能够持续<b>学习进步</b>，我开发了这个WEB版。当前仅支持学英语。</div>
                            <Tips>Tips: 数据和部分功能来自于 <a href="https://github.com/Uahh/ToastFish" target="_blank" rel="noopener noreferrer">ToastFish</a></Tips>
                        </LayoutCenter>
                        <StartArea>
                            <Button variant="contained" onClick={() => setStarted(true)}>进入学习</Button>
                            <ClearArea>
                                <IconButton aria-label="delete" onClick={handleOpenClear}>
                                    <DeleteIcon />
                                </IconButton>
                            </ClearArea>
                        </StartArea>
                        <Dialog
                            open={openClear}
                            onClose={handleCloseClear}
                            aria-labelledby="alert-dialog-title"
                            aria-describedby="alert-dialog-description"
                        >
                            <DialogTitle id="alert-dialog-title">
                                确定要清空本地数据吗？
                            </DialogTitle>
                            <DialogContent>
                            <DialogContentText id="alert-dialog-description">
                                清空本地数据意味着学习进度丢失，但如果你已经学完了，或者想从头再卷，或者想升级到社区最新的词库（词库几乎不可能更新了），那么可以点击确定清空。
                            </DialogContentText>
                            </DialogContent>
                            <DialogActions>
                            <Button onClick={handleClear} sx={{ mr: 2 }}>确定清空</Button>
                            <Button variant="contained" onClick={handleCloseClear} autoFocus>
                                取消
                            </Button>
                            </DialogActions>
                        </Dialog>
                    </>
                )}
            </StyledPaper>
        </Wrapper>
    );
};

export default Body;