import React, { Component } from "react";
import "./App.css";
import { Switch, Route, Redirect } from "react-router-dom";
import Login from "./components/auth/Login";
import Signup from "./components/auth/Signup";
// import "./stylesheets/style.scss";

import GoogleAuth from "./components/auth/GoogleAuth";
import AuthService from "./components/auth/Authservice";
import RoutesService from "./RoutesService";

import Home from "./components/pages/Home";
import HomeLogged from "./components/pages/HomeLogged";
import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import CreateBid from "./components/organisms/CreateBid";
import CreateProduct from "./components/organisms/CreateProduct";
import ShowBid from "./components/pages/ShowBid";
import Navbar from "./components/organisms/Navbar";
import ShowMyProduct from "./components/pages/ShowMyProduct";
import ShowProduct from "./components/pages/ShowProduct";


export default class App extends Component {
  constructor(props) {
    super();
    this.state = {
      loggedInUser: null,
      bid: null,
      product: null
    };
    this.service = new AuthService();
    this.router = new RoutesService();
    this.fetchUser();
  }

  getUser = userObj => {
    this.setState({
      ...this.state,
      loggedInUser: userObj
    });
  };

  logout = () => {
    console.log("logueao out")
    this.service.logout().then(() => {
      this.setState({
        ...this.state,
        loggedInUser: null
      });
    });
  };

  fetchUser = () => {
    return this.service
      .loggedin()
      .then(response => {
        this.setState({
          ...this.state,
          loggedInUser: response,
        });
        console.log("fetch/////", this.state);
      })
      .catch(error => {
        this.setState({
          ...this.state,
          loggedInUser: false
        });
      });
  };
  changeStateBid(newValue) {
    // const { from, to, deadLine } = newValue;
    // this.setState({
    //   ...this.state,
    //   bid: {
    //     from: from,
    //     to: to,
    //     deadLine: deadLine
    //   },
    //   nobid: "xxxxxxxx"
    // });
    this.fetchUser();
    console.log(newValue);
    console.log("bid actualizada", this.state);
  }

  getProduct(id) {
    return this.router.getProduct(id)
    .then(response=> {

      this.setState({
        ...this.state,
        product: response,
      })
      console.log("vuelta de productid", this.state)
    })
    .catch(error=> console.log(error))
    
  }
  buyProduct(id) {
    return this.router.buyProduct(id)
    .then(response=> {
      this.setState({
        ...this.state,
        product: response
      })
      console.log("vuelta de compra producto", this.state)
    })
  }

  


  render() {
    return this.state.loggedInUser ? (
      <React.Fragment>
        <Switch>
          <Route
            exact
            path="/"
            render={() => {
              return (
                <React.Fragment>
                   <Navbar fromApp={()=>this.logout()}></Navbar>
                  <HomeLogged user={this.state.loggedInUser} product={}></HomeLogged>
                </React.Fragment>
              );
            }}
          />
          <Route
            exact
            path="/create-bid"
            render={() => {
              if (this.state.loggedInUser.bid) {
                return (
                  <React.Fragment>
                    <Navbar fromApp={()=>this.logout()}></Navbar>
                    <h1>Ya tienes una subasta activa</h1>
                    <p>Link al panel de control de tu mudanza</p>
                  </React.Fragment>
                );
              } else {
                return (
                  <React.Fragment>
                    <Navbar fromApp={()=>this.logout()}></Navbar>
                    estas log
                    <CreateBid
                      fromApp={newValue => this.changeStateBid(newValue)}
                    ></CreateBid>
                  </React.Fragment>
                );
              }
            }}
          />
          <Route
            exact
            path="/create-product"
            render={() => {
              console.log("YYYYYYYYYYYYYYYYYestate" , this.state.loggedInUser)
          
                return (
                  <React.Fragment>
                    <Navbar fromApp={()=>this.logout()}></Navbar>
                    <CreateProduct fromApp={()=>this.fetchUser()} bid={this.state.loggedInUser.bid? this.state.loggedInUser.bid._id : null}></CreateProduct>
                  </React.Fragment>
                ) 
            }}
          />
          <Route
            exact
            path="/your-bid"
            render={() => {
              return (
                <React.Fragment>
                  <Navbar fromApp={()=>this.logout()}></Navbar>
                  <ShowBid
                    fromApp={() => this.fetchUser()}
                    user={this.state.loggedInUser}
                  ></ShowBid>
                </React.Fragment>
              );
            }}
          />
   
          <Route
            path="/product/:id"
            render={(props) => {            
              return (
                <React.Fragment>
                  <Navbar fromApp={()=>this.logout()}></Navbar>
                 
                  <ShowProduct 
                  productFromApp={()=>this.getProduct(props.match.params.id)} product={this.state.product}
                  fromApp={() => this.fetchUser()} userId={this.state.loggedInUser._id} buyFromApp={(id)=>this.buyProduct(id)}>
                  
                  </ShowProduct>
                </React.Fragment>
              );
            }}
          />

          <Route
            path="/my-product/:id"
            render={(props) => {
              let chosenProduct = props.match.params.id;
              return (
                <React.Fragment>
                  <Navbar fromApp={()=>this.logout()}></Navbar>
                 
                  <ShowMyProduct productId={chosenProduct} fromApp={() => this.fetchUser()} user={this.state.loggedInUser} product={null}></ShowMyProduct>
                </React.Fragment>
              );
            }}
          />
        </Switch>
      </React.Fragment>
    ) :
    
    
    
    
    
    
    
    
    
    
    
    (
      <React.Fragment>
        <Switch>
          <Route
            exact
            path="/"
            render={() => {
              return (
                <React.Fragment>
                    <Navbar fromApp={(e)=>this.logout(e)}></Navbar>
                  <Home></Home>
                </React.Fragment>
              );
            }}
          />
          <Route
            exact
            path="/create-bid"
            render={() => {
              return (
                <React.Fragment>
                  <Navbar fromApp={(e)=>this.logout(e)}></Navbar>
                  <h1>
                    Tienes que estar registrado para poder crear tu mudanza
                  </h1>
                  <Login getUser={this.getUser}></Login>
                  <Signup getUser={this.getUser}></Signup>
                  <GoogleAuth getUser={this.getUser}></GoogleAuth>
                  <a href="http://localhost:3010/auth/google">
                    Sign In with Google
                  </a>
                  <Button
                    variant="contained"
                    color="primary"
                    href="http://localhost:3010/auth/google"
                  ></Button>
                </React.Fragment>
              );
            }}
          />
          <Route
            exact
            path="/create-product"
            render={() => {
              return (
                <React.Fragment>
                  <Navbar fromApp={(e)=>this.logout(e)}></Navbar>
                  <h1>
                    Tienes que estar registrado y tener una mudanza activa para
                    poder crear cajas con productos{" "}
                  </h1>
                  <Login getUser={this.getUser}></Login>
                  <Signup getUser={this.getUser}></Signup>
                  <GoogleAuth getUser={this.getUser}></GoogleAuth>
                  <a href="http://localhost:3010/auth/google">
                    Sign In with Google
                  </a>
                  <Button variant="contained" color="primary"></Button>
                </React.Fragment>
              );
            }}
          />
        </Switch>
      </React.Fragment>
    );
  }

  //   return (

  //     <div>
  //       <Switch>
  //         <Route
  //           exact
  //           path="/"
  //           render={() => {
  //             return (
  //               <React.Fragment>
  //                 <Home></Home>
  //                 <Home></Home>
  //               </React.Fragment>
  //             );
  //           }}
  //         />
  //         <Route
  //           exact
  //           path="/create-bid"
  //           render={() => {
  //             return (
  //               <React.Fragment>
  //                 {/* <CreateBidForm></CreateBidForm> */}
  //                 <CreateBid fromApp={newValue=>this.changeStateBid(newValue)}></CreateBid>
  //               </React.Fragment>
  //             );
  //           }}
  //         />
  //         <Route
  //           exact
  //           path="/create-product"
  //           render={() => {
  //             return (
  //               <React.Fragment>
  //                 <CreateProduct></CreateProduct>
  //               </React.Fragment>
  //             );
  //           }}
  //         />
  //         <Route
  //           exact
  //           path="/your-bid"
  //           render={() => {
  //             if (this.state.loggedInUser) {
  //               return (
  //                 <React.Fragment>
  //                   <ShowBid></ShowBid>
  //                 </React.Fragment>
  //               );
  //             } else {
  //               return (
  //                 <React.Fragment>
  //                   <Login getUser={this.getUser}></Login>
  //                   <Signup getUser={this.getUser}></Signup>
  //                   <GoogleAuth getUser={this.getUser}></GoogleAuth>
  //                   <a href="http://localhost:3010/auth/google">
  //                     Sign In with Google
  //                   </a>
  //                   <Button variant="contained" color="primary"></Button>
  //                 </React.Fragment>
  //               );
  //             }
  //           }}
  //         />
  //         <Route
  //           exact
  //           path="/login"
  //           render={() => {
  //             if (this.state.loggedInUser) {
  //               return (
  //                 <React.Fragment>
  //                   <CssBaseline />
  //                   <Redirect to="/home" />
  //                   <h1>Wellcome home</h1>
  //                   <button onClick={this.logout}>Logout</button>
  //                 </React.Fragment>
  //               );
  //             } else {
  //               return (
  //                 <React.Fragment>
  //                   <CssBaseline />
  //                   <div className="App">
  //                     <Login getUser={this.getUser}></Login>
  //                     <Signup getUser={this.getUser}></Signup>
  //                     <GoogleAuth getUser={this.getUser}></GoogleAuth>
  //                     <a href="http://localhost:3010/auth/google">
  //                       Sign In with Google
  //                     </a>
  //                     <Button variant="contained" color="primary">
  //                       Hello World
  //                     </Button>
  //                   </div>
  //                 </React.Fragment>
  //               );
  //             }
  //           }}
  //         />
  //       </Switch>
  //     </div>
  //   );

  //   // if(this.state.loggedInUser) {
  //   //   return (
  //   //     <React.Fragment>
  //   //       <CssBaseline />
  //   //     <Redirect to="/home"/>
  //   //     <h1>Wellcome home</h1>
  //   //     <button onClick={this.logout}>Logout</button>
  //   //   </React.Fragment>
  //   //   )
  //   // }
  //   // else {
  //   //   return (
  //   //     <React.Fragment>
  //   //       <CssBaseline />
  //   //     <div className="App">
  //   //       <Login getUser={this.getUser}></Login>
  //   //       <Signup getUser={this.getUser}></Signup>
  //   //       <GoogleAuth getUser={this.getUser}></GoogleAuth>
  //   //       <a href="http://localhost:3010/auth/google">Sign In with Google</a>
  //   //       <Button variant="contained" color="primary">
  //   //   Hello World
  //   // </Button>

  //   //     </div>
  //   //   </React.Fragment>
  //   //     )

  //   // }
  // }
}
