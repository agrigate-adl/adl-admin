import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import useWindowSize from 'hooks/useWindowSize';
import PrivateSection from 'routes/PrivateSection';
import PublicRoutes from 'routes/PublicRoutes';
import { useSelector } from 'react-redux';
import { selectUser } from 'features/userSlice';

function Routes() {
    const { pathname } = useLocation();
    // eslint-disable-next-line no-unused-vars
    const [width, height] = useWindowSize();
    const user = useSelector(selectUser);
    useEffect(() => {
        window.scrollTo(0, 0);
    }, [pathname]);
    return user ? <PrivateSection /> : <PublicRoutes />;
}

export default Routes;
