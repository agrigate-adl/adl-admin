import React, { Suspense, lazy } from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import SLUGS from 'resources/slugs';
import LoadingComponent from 'components/loading';

const DashboardComponent = lazy(() => import('./dashboard'));

function PrivateRoutes() {
    return (
        <Suspense fallback={<LoadingComponent loading />}>
            <Switch>
                <Route exact path={SLUGS.dashboard} component={DashboardComponent} />
                <Route exact path={SLUGS.productsTwo} render={() => <div>productsTwo</div>} />
                <Route exact path={SLUGS.productsThree} render={() => <div>productsThree</div>} />
                <Route exact path={SLUGS.products} render={() => <div>products</div>} />
                <Route exact path={SLUGS.transactions} render={() => <div>transactions</div>} />
                <Route exact path={SLUGS.scratchCardsTwo} render={() => <div>scratchCardsTwo</div>} />
                <Route exact path={SLUGS.scratchCardsThree} render={() => <div>scratchCardsThree</div>} />
                <Route exact path={SLUGS.scratchCards} render={() => <div>scratchCards</div>} />
                <Route exact path={SLUGS.contacts} render={() => <div>contacts</div>} />
                {/* <Route exact path={SLUGS.agents} render={() => <div>agents</div>} />
                <Route exact path={SLUGS.articles} render={() => <div>articles</div>} />
                <Route exact path={SLUGS.settings} render={() => <div>settings</div>} />
                <Route exact path={SLUGS.subscription} render={() => <div>subscription</div>} /> */}
                <Redirect to={SLUGS.dashboard} />
            </Switch>
        </Suspense>
    );
}

export default PrivateRoutes;
