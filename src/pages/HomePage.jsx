import React from 'react';
import { Typography, Container, Button } from '@mui/material';
import { Link } from 'react-router-dom';
import LabelBottomNavigation from '../components/LabelBottomNavigation';
import styled from "styled-components";
import Footer from "../components/MyFooter";
import { ThemeProvider } from '@mui/material/styles';

import { createTheme } from '@mui/material/styles';
import MyAppBar from './../components/MyAppBar';

const theme = createTheme({
    palette: {
        primary: {
            main: 'rgba(59,130,246,.9)', // Your desired primary color
        },
    },
});

function HomePage() {
    return (
        <ThemeProvider theme={theme}>
            <CenterDiv >
                <MyAppBar />
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
            </CenterDiv>
        </ThemeProvider >
    );
}

const CenterDiv = styled.div`
    display: flex;
    justify-content: center;
    flex-wrap: wrap;
`;

const MyContainer = styled(Container)`
    min-height: 100vh;
    min-width: 80vw;
    background-image: url(${require('../assets/web_home_bg.png')});
    background-size: cover;
    background-repeat: no-repeat;
    background-position: center;
    padding: 4rem;
    margin-top: 1rem;
    border-radius: 0.5rem;
`;


export default HomePage;
