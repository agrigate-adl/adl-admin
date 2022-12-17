import React from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import SLUGS from 'resources/slugs';
import Login from './login/Login'

function PublicRoutes() {
    return (
        <Switch>
            <Route component={Login}/>
            <Route path={SLUGS.signup} render={() => <div>signup</div>} />
            <Route path={SLUGS.forgotPassword} render={() => <div>forgotPassword</div>} />
            <Redirect to={SLUGS.login} />
        </Switch>
    );
}

export default PublicRoutes;
