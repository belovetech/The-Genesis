import React , { Component } from 'react';
import { Switch, Route } from 'react-router-dom';
import './App.css';

import HomePage from './pages/homepage/homepage.component';
import ShopPage from './pages/shoppage/shoppage.component';
import SignInAndSignUpPage from './pages/sign-in-and-sign-up/sign-in-and-sign-up.component';
import Header from './components/header/header.component';
import { auth, createUsersProfileDocument} from './firebase/firebase.utils';




class App extends React.Component {
  constructor() {
    super();

    this.state = {
      currentUser: null
    };
  }

  unSubscribeFromAuth = null;

  // Our app listening to authentication state changes on our firebabse backend
  componentDidMount() {
      this.unSubscribeFromAuth = auth.onAuthStateChanged(async userAuth => {
        if (userAuth) {

         const userRef = await createUsersProfileDocument(userAuth);

         userRef.onSnapshot(snapShot => {
           this.setState({ 
             currentUser: {
               id: snapShot.id,
               ...snapShot.data()
             }
           });
         })
        } 
          this.setState({currentUser: userAuth});
        
    });
  }
    

  componentWillUnmount() {
      this.unSubscribeFromAuth();
  }
  
  render() {
    
    return (
      <div>
        <Header currentUser={this.state.currentUser}/>
        <Switch>
          <Route  exact path='/' component={HomePage}/>
          <Route path='/shop' component={ShopPage}/>   
          <Route path='/signin' component={SignInAndSignUpPage}/>   
        </Switch>
      </div>
    );
  }

}

export default App;
