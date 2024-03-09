import React from 'react';
import { AppBar, Toolbar, Typography, Container, Button } from '@mui/material';
import { Link } from 'react-router-dom';
import LabelBottomNavigation from '../components/LabelBottomNavigation';
import styled from "styled-components";
import Footer from "../components/MyFooter";
import { ThemeProvider } from '@mui/material/styles';

import { createTheme } from '@mui/material/styles';

const theme = createTheme({
    palette: {
        primary: {
            main: '#3131b1e3', // Your desired primary color
        },
    },
});


function HomePage() {
    return (
        <ThemeProvider theme={theme}>
            <div>
                <MyAppBar position="static">
                    <Toolbar>
                        <Typography sx={{ color: "#ffffff" }}><b>TUBEKIT</b></Typography>
                    </Toolbar>
                </MyAppBar>
                <MyContainer>
                    <Typography color={"white"} variant="h4" align="center" height={100}>
                        HELLO TUBEKIT
                    </Typography>
                    <Typography color={"white"} align="center" height={100}>
                        To explore the game world together！
                    </Typography>
                    <Typography align="center">
                        <Button component={Link} to="/game" variant="contained" color="primary" mt={4}>
                            Get Start
                        </Button>
                    </Typography>
                </MyContainer>
                <LabelBottomNavigation />
                <Footer />
            </div>
        </ThemeProvider >
    );
}

const MyAppBar = styled(AppBar)`
`;

const MyContainer = styled(Container)`
    min-height: 100vh;
    background-image: url(${require('../assets/web_home_bg.png')});
    background-size: cover;
    background-repeat: no-repeat;
    background-position: center;
    padding: 4rem;
    margin-top: 1rem;
    border-radius: 0.5rem;
`;


export default HomePage;
