import React from 'react';
import { Typography, Container } from '@mui/material';

const Footer = () => {
    return (
        <Container sx={{ height: "8rem", display: "flex", alignItems: "center", justifyContent: "center" }} >
            <Typography variant="body1" align='center' color={"grey"}>
                Copyright © 2023-2024 tubekit. All rights reserved.
            </Typography>
        </Container>
    );
};

export default Footer;
