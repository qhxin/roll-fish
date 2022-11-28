import styled from '@emotion/styled';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import logo from '@/assets/logo.png';

const Logo = styled.img`
    height: 50px;
`;

const Header = () => {
    return (
        <AppBar position="static">
            <Toolbar variant="dense">
                <IconButton edge="start" color="inherit" aria-label="menu" sx={{ mr: 2 }}>
                    <Logo src={logo} />
                </IconButton>
                <Typography variant="h5" color="inherit" component="div">
                    RollFish
                </Typography>
            </Toolbar>
        </AppBar>
    );
}

export default Header;
