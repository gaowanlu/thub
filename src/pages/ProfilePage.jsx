import { createTheme } from '@mui/material/styles';
import MyAppBar from './../components/MyAppBar';
import styled from 'styled-components';
import Footer from "../components/MyFooter";
import { ThemeProvider } from '@mui/material/styles';
import { Typography, Container } from '@mui/material';

const theme = createTheme({
    palette: {
        primary: {
            main: 'rgba(59,130,246,.9)', // Your desired primary color
        },
    },
});

function ProfilePage() {
    return (
        <ThemeProvider theme={theme}>
            <CenterDiv >
                <MyAppBar />
                <MyContainer>
                    <Typography color={"black"} variant="h4" align="center" height={100}>
                        Vanlu Gao
                    </Typography>
                </MyContainer>
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
    padding: 4rem;
    margin-top: 1rem;
    border-radius: 0.5rem;
    background-color: #eeeeee;
`;

export default ProfilePage;