import React from 'react';
import { AppBar, Toolbar } from '@mui/material';
import styled from 'styled-components';
import { Link, useNavigate } from 'react-router-dom';

const MyAppBar = () => {
    const navigate = useNavigate();

    const handleButtonClick = () => {
        navigate('/');
    };

    return (<MyAppBarC position="static">
        <MyToolbar>
            <Logo>
                <div onClick={handleButtonClick}>Avant</div>
            </Logo>
            <Center>
                <Link to='/game'>Game</Link>
                <Link to='/profile'>Profile</Link>
            </Center>
            <Right></Right>
        </MyToolbar>
    </MyAppBarC >);
};


const MyToolbar = styled(Toolbar)`
    display: flex;
    align-items: center;
`;

const MyAppBarC = styled(AppBar)`
    height: 4rem;
`;

const Logo = styled.div`
    display: flex;
    align-items: center;
    color: #ffffff;
    &:hover {
        color: pink;
    }
    /* background-color: red; */
    height: 100%;
    cursor: pointer;
    font-size: 1.3rem;
`;

const Center = styled.div`
    display: flex;
    align-items: center;
    /* background-color: blue; */
    height: 4rem;
    a{
        text-decoration: none;
        color: #ffffff;
        margin-left: 1rem;
        &:hover {
            color: pink;
        }
    }
    padding-left: 3rem;
`;

const Right = styled.div`
    display: flex;
    align-items: center;
    /* background-color: yellow; */
`;

export default MyAppBar;