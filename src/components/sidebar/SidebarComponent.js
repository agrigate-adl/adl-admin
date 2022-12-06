import React from 'react';
import { createUseStyles, useTheme } from 'react-jss';
import { useHistory } from 'react-router-dom';
import SLUGS from 'resources/slugs';
import {
    IconAgents,
    IconContacts,
    IconscratchCards,
    IconLogout,
    Iconproducts,
    IconSubscription,
    Icontransactions
} from 'assets/icons';
import { convertSlugToUrl } from 'resources/utilities';
import LogoComponent from './LogoComponent';
import Menu from './MenuComponent';
import MenuItem from './MenuItemComponent';

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

    async function logout() {
        push(SLUGS.login);
    }

    function onClick(slug, parameters = {}) {
        push(convertSlugToUrl(slug, parameters));
    }

    return (
        <Menu isMobile={isMobile}>
            <div style={{ paddingTop: 30, paddingBottom: 30 }}>
                <LogoComponent />
            </div>
            <MenuItem
                id={SLUGS.dashboard}
                title='Dashboard (Farmers)'
                icon={IconSubscription}
                onClick={() => onClick(SLUGS.dashboard)}
            />
            <MenuItem
                id={SLUGS.products}
                title='Products'
                icon={Iconproducts}
                onClick={() => onClick(SLUGS.products)}
            />
            <MenuItem
                id={SLUGS.transactions}
                title='Transactions'
                icon={Icontransactions}
                onClick={() => onClick(SLUGS.transactions)}
            />
            <MenuItem
                id={SLUGS.scratchCards}
                items={[SLUGS.scratchCardsTwo, SLUGS.scratchCardsThree]}
                title='Scratch Cards'
                icon={IconscratchCards}
            >
                <MenuItem
                    id={SLUGS.scratchCards}
                    title='Cards products'
                    level={2}
                    icon={IconAgents}
                    onClick={() => onClick(SLUGS.scratchCards)}
                />
                <MenuItem
                    id={SLUGS.scratchCardsTwo}
                    title='Create New Cards'
                    level={2}
                    icon={IconContacts}
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
            <MenuItem id='logout' title='Logout' icon={IconLogout} onClick={logout} />
        </Menu>
    );
}

export default SidebarComponent;
