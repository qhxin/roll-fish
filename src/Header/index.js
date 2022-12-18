import styled from '@emotion/styled';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import { useTheme } from '@mui/material/styles';
import logo from '@/assets/logo.png';

const Logo = styled.img`
    height: 50px;
    margin-right: 10px;
`;

const reload = () => {
    window.location.reload();
};

// 算了，就这样吧，懒得写了
const Header = ({ handleClickLogo = reload, handleToggleColorMode }) => {
    const theme = useTheme();

    return (
        <>
            <AppBar position="fixed">
                <Toolbar variant="dense">
                    <IconButton edge="start" color="inherit" aria-label="menu" sx={{ mr: 2 }} onClick={handleClickLogo}>
                        <Logo src={logo} alt="RollFish" />
                        <Typography variant="h5" color="inherit" component="div">
                            RollFish
                        </Typography>
                    </IconButton>
                    
                    <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                        学到的才是自己的
                    </Typography>
                    <IconButton sx={{ ml: 1 }} onClick={handleToggleColorMode} edge="end" color="inherit">
                        {theme.palette.mode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
                    </IconButton>
                </Toolbar>
            </AppBar>
            <Toolbar>
                <IconButton edge="start" color="inherit" aria-label="menu" sx={{ mr: 2, visibility: 'hidden' }}>
                    <Logo src={logo} alt="RollFish" />
                    <Typography variant="h5" color="inherit" component="div">
                        RollFish
                    </Typography>
                </IconButton>
            </Toolbar>
        </>
    );
}

export default Header;
