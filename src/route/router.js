import React, { Suspense, lazy } from 'react';
import { Route, Switch } from 'react-router-dom';
// import Home from '../pages/Home';
// import Directory from '../pages/Directory';
// import BlockAndTxn from '../pages/BlockAndTxn';
// import More from '../pages/More';
// import EpochList from '../pages/Epoch/list';
// import EpochDetail from '../pages/Epoch/detail';
// import BlockList from '../pages/Block/list';
// import BlockDetail from '../pages/Block/detail';
// import TransactionList from '../pages/Transaction/list';
// import TransactionDetail from '../pages/Transaction/detail';
// import AccountDetail from '../pages/Account/detail';
// import TopHolder from '../pages/TopList/holder';
// import SearchNotFound from '../pages/SearchNotFound';
// import NotFound from '../pages/404';

const Home = lazy(() => import('../pages/Home'));
const Directory = lazy(() => import('../pages/Directory'));
const BlockAndTxn = lazy(() => import('../pages/BlockAndTxn'));
const More = lazy(() => import('../pages/More'));
const EpochDetail = lazy(() => import('../pages/Epoch/detail'));
const BlockList = lazy(() => import('../pages/Block/list'));
const BlockDetail = lazy(() => import('../pages/Block/detail'));
const TransactionList = lazy(() => import('../pages/Transaction/list'));
const TransactionDetail = lazy(() => import('../pages/Transaction/detail'));
const AccountDetail = lazy(() => import('../pages/Account/detail'));
const TopHolder = lazy(() => import('../pages/TopList/holder'));
const SearchNotFound = lazy(() => import('../pages/SearchNotFound'));
const NotFound = lazy(() => import('../pages/404'));

function Router() {
  return (
    <Suspense fallback={<div className="ui active loader" />}>
      <Switch>
        <Route path="/" exact component={Home} />
        <Route path="/dashboard" component={Home} />
        <Route path="/directory" component={Directory} />
        <Route path="/blocktxn" component={BlockAndTxn} />
        <Route path="/more" component={More} />
        <Route path="/blocks" component={BlockList} />
        <Route path="/blocksdetail/:blockhash" component={BlockDetail} />
        <Route path="/transactions" component={TransactionList} />
        <Route path="/transactionsdetail/:txnhash" component={TransactionDetail} />
        <Route path="/accountdetail/:accountid" component={AccountDetail} />
        <Route path="/epochsdetail/:epochid" component={EpochDetail} />
        <Route path="/topholders" component={TopHolder} />
        <Route path="/notfound" component={SearchNotFound} />
        <Route component={NotFound} />
      </Switch>
    </Suspense>
  );
}
export default Router;
