import React,{useState} from 'react';
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Switch, Route } from 'react-router-dom'; // Import the BrowserRouter, Switch, and Route components
import NewPage from './marketplace/Newpage.js'; // Import the NewPage component
import ModelMainPage from './ModelMainPage.js';
import GlobalNavbar from './GlobalNavbar.js';
import CreateModelPage from './CreateModelPage.js';
import useModel from './useModel.js';
import Setup from './Setup.js';
import MintModelPage from './MintModelPage.js';
import MarkerplaceMainPage  from './MarketPlaceMainPage.js';  
import SqaurePay from './SqaurePay.js';

const root = ReactDOM.createRoot(document.getElementById('root'));


root.render(
<div>
  <Setup/>
<BrowserRouter> 
     {/* <Navbar/> */}
     <Switch>
        <Route exact path="/models" component={ModelMainPage} />
        {/* <Route path="/" component={MarkerplaceMainPage}/>  */}
        <Route path="/marketplace" component={MarkerplaceMainPage}/> 
        {/* New Page */}
        <Route path="/create-model" component={CreateModelPage}/>
        <Route path="/try-model" component={useModel}/>
        <Route path='/mint-model' component={MintModelPage}/>
        <Route path='/payment' component={SqaurePay}/>
      </Switch>
      </BrowserRouter>
      </div>

);

