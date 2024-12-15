import React, { Suspense, lazy } from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import SLUGS from 'resources/slugs';
import LoadingComponent from 'components/loading';
//import CreateScratchCard from './createscratchcard';
import ScratchCardProducts from './scratchcards';
import Packages from './packages';
import FarmerPage from './farmer';
import Analytics from './analytics';
import AddPackage from './addpackage';
import PayoutCash from './payoutCash';
import IndividualSavingStatement from './IndividualSavingStatement';
import AddAgent from './agents';
// import BulkSms from './bulkSms';
const Transactions = lazy(()=> import('../routes/transactions'))
const DashboardComponent = lazy(() => import('./dashboard'));
const Products =lazy(()=> import('./products'));
const BulkSms =lazy(()=> import('./bulkSms'));

const CreateScratchCard =lazy(()=> import('./createscratchcard'));

function PrivateRoutes() {
    return (
        <Suspense fallback={<LoadingComponent loading />}>
            <Switch>
                <Route exact path={SLUGS.dashboard} component={DashboardComponent} />
                <Route exact path={SLUGS.agents} component={AddAgent} />
                <Route exact path={SLUGS.addpackage} component={AddPackage}/>
                <Route exact path ={SLUGS.analytics}  component= {Analytics}/>
                <Route exact path={SLUGS.farmer} component={FarmerPage}/>
                <Route exact path={SLUGS.products} component={Products} />
                <Route exact path={SLUGS.packages} component={Packages} />
                <Route exact path={SLUGS.payoutCash} component={PayoutCash} />
                <Route exact path={SLUGS.individualSavingStatement} component={IndividualSavingStatement} />
                <Route exact path={SLUGS.transactions} component={Transactions} />
                <Route exact path={SLUGS.scratchCardsTwo} component={CreateScratchCard} />
                <Route exact path={SLUGS.scratchCards}  component={ScratchCardProducts}/>
                <Route exact path={SLUGS.bulkSms}  component={BulkSms}/>
                <Route exact path={SLUGS.contacts} render={() => <div>contacts</div>} />
                <Redirect to={SLUGS.dashboard} />
            </Switch>
        </Suspense>
    );
}

export default PrivateRoutes;
