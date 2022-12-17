import React, { Suspense, lazy } from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import SLUGS from 'resources/slugs';
import LoadingComponent from 'components/loading';
import CreateScratchCard from './createscratchcard';
import ScratchCardProducts from './scratchcards';
import Packages from './packages';
import FarmerPage from './farmer';
import AddPackage from './addpackage';
const Transactions = lazy(()=> import('../routes/transactions'))
const DashboardComponent = lazy(() => import('./dashboard'));
const Products =lazy(()=> import('./products'));
function PrivateRoutes() {
    return (
        <Suspense fallback={<LoadingComponent loading />}>
            <Switch>
                <Route exact path={SLUGS.dashboard} component={DashboardComponent} />
                
                <Route exact path={SLUGS.addpackage} component={AddPackage}/>
                <Route exact path={SLUGS.farmer} component={FarmerPage}/>

                <Route exact path={SLUGS.productsThree} render={() => <div>productsThree</div>} />
                <Route exact path={SLUGS.products} component={ Products} />
               <Route exact path={SLUGS.packages} component={Packages} />
               <Route exact path={SLUGS.transactions} component={Transactions} />
                <Route exact path={SLUGS.scratchCardsTwo} component={CreateScratchCard} />
                <Route exact path={SLUGS.scratchCardsThree} render={() => <div>scratchCardsThree</div>} />
                <Route exact path={SLUGS.scratchCards}  component={ScratchCardProducts}/>
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
