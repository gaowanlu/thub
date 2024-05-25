import React from 'react';
import { Typography, Container } from '@mui/material';

const Footer = () => {
    return (
        <Container sx={{ height: "15rem", display: "flex", alignItems: "end", justifyContent: "center" }} >
            <Typography sx={{ height: "5rem" }} variant="body1" align='center' color={"grey"}>
                Copyright © 2023-2024 tubekit. All rights reserved.
            </Typography>
        </Container>
    );
};

export default Footer;
