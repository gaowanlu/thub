import React from 'react';
import { AppBar, Toolbar, Typography, Container, Button } from '@mui/material';
import { Link } from 'react-router-dom';

function HomePage() {
    return (
        <div>
            <AppBar position="static">
                <Toolbar>
                    <Typography variant="h6"><b>ThubGames</b></Typography>
                </Toolbar>
            </AppBar>
            <Container>
                <Typography variant="h4" align="center" mt={4} height={100}>
                    welcome thub
                </Typography>
                <Typography variant="body1" align="center" mt={2} height={100}>
                    explore thub game world together ！
                </Typography>
                <Button component={Link} to="/game" variant="contained" color="primary" fullWidth mt={4}>
                    Get Start
                </Button>
            </Container>
        </div>
    );
}

export default HomePage;
