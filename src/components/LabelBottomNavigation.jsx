import * as React from 'react';
import BottomNavigation from '@mui/material/BottomNavigation';
import BottomNavigationAction from '@mui/material/BottomNavigationAction';
import FolderIcon from '@mui/icons-material/Folder';
import RestoreIcon from '@mui/icons-material/Restore';
import FavoriteIcon from '@mui/icons-material/Favorite';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import styled from "styled-components";

export default function LabelBottomNavigation() {
    const [value, setValue] = React.useState('recents');

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    return (
        <MyNavigation sx={{ display: 'none' }} value={value} onChange={handleChange}>
            <BottomNavigationAction
                label="recents"
                value="recents"
                icon={<RestoreIcon />}
            />
            <BottomNavigationAction
                label="favorites"
                value="favorites"
                icon={<FavoriteIcon />}
            />
            <BottomNavigationAction
                label="nearby"
                value="nearby"
                icon={<LocationOnIcon />}
            />
            <BottomNavigationAction label="folder" value="folder" icon={<FolderIcon />} />
        </MyNavigation>
    );
}

const MyNavigation = styled(BottomNavigation)`
    height: 4rem;
`;
