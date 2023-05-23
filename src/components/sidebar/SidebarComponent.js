import React from 'react';
import { createUseStyles, useTheme } from 'react-jss';
import { useHistory } from 'react-router-dom';
import SLUGS from 'resources/slugs';
import {
    IconContacts,
    IconLogout,
    Iconproducts,
} from 'assets/icons';
import { convertSlugToUrl } from 'resources/utilities';
import LogoComponent from './LogoComponent';
import Menu from './MenuComponent';
import MenuItem from './MenuItemComponent';
import {useDispatch} from 'react-redux';
import { logout } from 'features/userSlice';
import { CardMembership, ContactMailRounded, ContactMailSharp, Home,Payment, Message } from '@material-ui/icons';

const useStyles = createUseStyles({
    separator: {
        borderTop: ({ theme }) => `1px solid ${theme.color.lightGreenIshVibe}`,
        marginTop: 16,
        marginBottom: 16,
        opacity: 0.06
    }
});

function SidebarComponent() {
    const { push } = useHistory();
    const theme = useTheme();
    const classes = useStyles({ theme });
    const isMobile = window.innerWidth <= 1080;

    // async function logout() {
    //     // log out
    //     push(SLUGS.login);
    // }

    function onClick(slug, parameters = {}) {
        push(convertSlugToUrl(slug, parameters));
    }
    const dispatch = useDispatch();
    
    async function handleLogout(){
        dispatch(logout());
    }

    return (
        <Menu isMobile={isMobile}>
            <div style={{ paddingTop: 30, paddingBottom: 30 }}>
                <LogoComponent />
            </div>
            <MenuItem
                id={SLUGS.dashboard}
                title='Dashboard (Farmers)'
                icon={Home}
                onClick={() => onClick(SLUGS.dashboard)}
            />
            <MenuItem
                id={SLUGS.products}
                title='Products'
                icon={Iconproducts}
                onClick={() => onClick(SLUGS.products)}
            />
            <MenuItem
                    id={SLUGS.packages}
                    title='Packages'
                    icon={ContactMailSharp}
                    onClick={() => onClick(SLUGS.packages)}
                />
            
            <MenuItem
                id={SLUGS.transactions}
                title='Transactions'
                icon={Payment}
                onClick={() => onClick(SLUGS.transactions)}
            />
            <MenuItem
                id={SLUGS.bulkSms}
                title='Send Messages'
                icon={Message}
                onClick={() => onClick(SLUGS.bulkSms)}
            />
            <MenuItem
                id={SLUGS.scratchCards}
                items={[SLUGS.scratchCardsTwo, SLUGS.scratchCardsTwo]}
                title='Scratch Cards'
                icon={CardMembership}
            >
                <MenuItem
                    id={SLUGS.scratchCards}
                    title='Cards products'
                    level={2}
                    icon={CardMembership}
                    onClick={() => onClick(SLUGS.scratchCards)}
                />
                <MenuItem
                    id={SLUGS.scratchCardsTwo}
                    title='Create New Cards'
                    level={2}
                    icon={ContactMailRounded}
                    onClick={() => onClick(SLUGS.scratchCardsTwo)}
                />
               
            </MenuItem>
            <MenuItem
                id={SLUGS.contacts}
                title='Support Contacts'
                icon={IconContacts}
                onClick={() => onClick(SLUGS.contacts)}
            />
            <div className={classes.separator}></div>
            <MenuItem id='logout' title='Logout' icon={IconLogout} onClick={()=>{handleLogout()}} />
        </Menu>
    );
}

export default SidebarComponent;
