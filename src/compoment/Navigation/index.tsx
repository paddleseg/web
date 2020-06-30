import React, { Component } from 'react'
import BottomNavigation from '@material-ui/core/BottomNavigation';
import BottomNavigationAction from '@material-ui/core/BottomNavigationAction';

class Navi extends Component {
    render() {
        return (
            <BottomNavigation
                showLabels
            >
                <BottomNavigationAction label="Recents" />
                <BottomNavigationAction label="Favorites" />
                <BottomNavigationAction label="Nearby" />
            </BottomNavigation>
        )
    }
}

export default Navi