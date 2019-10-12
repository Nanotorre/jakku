import React, { Component } from 'react'
import { NavLink } from "react-router-dom";

import { withRouter } from 'react-router-dom'
import AllProducts from '../organisms/AllProducts';

 class HomeLogged extends Component {
  render() {
    if(!this.props.user.bid) {
      return (
        <div>
          <h1>Hola, {this.props.user.username}</h1>
        <h1>Si te acabas de mudar o estás a punto de mudarte, podemos ayudarte</h1>
        <NavLink to={"/create-bid"}>Me voy a mudar</NavLink>
        <NavLink to={"/create-bid"}>Me acabo de mudar</NavLink>
      </div>

      )
    }
    else {
      return (
        <React.Fragment>
          <h1>Hola, {this.props.user.username}</h1>
          <a>campo de busqueda</a>
          <NavLink to={"/your-bid"}>Panel de control de mudanza</NavLink>
          <AllProducts products={this.props.products}></AllProducts>
        </React.Fragment>  
        )
    }  
  }
}

export default withRouter(HomeLogged)
