import React from 'react';
import { Row } from 'simple-flexbox';
import { createUseStyles, useTheme } from 'react-jss';
import { IconLogo } from 'assets/icons';
import  Colorlogowithbackground  from 'assets/icons/Colorlogo-nobackground.png';
import { useSelector } from 'react-redux';
import { selectUser } from 'features/userSlice';


const useStyles = createUseStyles((theme) => ({
    container: {
        marginLeft: 32,
        marginRight: 32
    },
    title: {
        ...theme.typography.cardTitle,
        color: '#fff',
        opacity: 0.7,
        marginLeft: 12
    }
}));

function LogoComponent() {
    const theme = useTheme();
    const user = useSelector(selectUser);
    const classes = useStyles({ theme });
    return (
        <Row className={classes.container} horizontal='center' vertical='center'>
            <img 
            src={Colorlogowithbackground} 
            width={60}
            height={100}
            >
            </img>
            <span className={classes.title}>ADL { user.role === 'admin' ? "Admin" : user.role === "agent" ? "Agent" : ""}</span>
        </Row>
    );
}

export default LogoComponent;
