import React from 'react';
import { Route, Switch } from 'react-router-dom';
import Home from '../pages/Home';
import Directory from '../pages/Directory';
import BlockAndTxn from '../pages/BlockAndTxn';
import More from '../pages/More';
import EpochList from '../pages/Epoch/list';
import EpochDetail from '../pages/Epoch/detail';
import BlockList from '../pages/Block/list';
import BlockDetail from '../pages/Block/detail';
import TransactionList from '../pages/Transaction/list';
import TransactionDetail from '../pages/Transaction/detail';
import AccountDetail from '../pages/Account/detail';
import TopHolder from '../pages/TopList/holder';
import SearchNotFound from '../pages/SearchNotFound';
import NotFound from '../pages/404';

function Router() {
  return (
    <Switch>
      <Route path="/home" component={Home} />
      <Route path="/dashboard" component={Home} />
      <Route path="/directory" component={Directory} />
      <Route path="/blocktxn" component={BlockAndTxn} />
      <Route path="/more" component={More} />
      <Route path="/blocks" component={BlockList} />
      <Route path="/blocksdetail/:blockhash" component={BlockDetail} />
      <Route path="/transactions" component={TransactionList} />
      <Route path="/transactionsdetail/:txnhash" component={TransactionDetail} />
      <Route path="/accountdetail" component={AccountDetail} />
      <Route path="/epochs" component={EpochList} />
      <Route path="/epochsdetail/:epochid" component={EpochDetail} />
      <Route path="/topholders" component={TopHolder} />
      <Route path="/notfound" component={SearchNotFound} />
      <Route component={NotFound} />
    </Switch>
  );
}
export default Router;
