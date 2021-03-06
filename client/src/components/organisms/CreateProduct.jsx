import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import { NavLink } from "react-router-dom";
import { withRouter } from 'react-router-dom'

import RoutesService from "../../RoutesService";
import ButtonAdd from "../atoms/ButtonAdd";

class CreateProduct extends Component {
  constructor(props) {
    super(props);
    this.state = {
      file: null,
      imgPath1: "https://screenshotlayer.com/images/assets/placeholder.png",
      // imgPath2: "https://screenshotlayer.com/images/assets/placeholder.png",
      // imgPath3: "https://screenshotlayer.com/images/assets/placeholder.png",
      bid: null,
    };
    this.routes = new RoutesService();
  }
  updateFormData(e, field) {
    let newState = {
      ...this.state
    };
    newState[field] = e.target.value;

    this.setState(newState);
  }

  sendState(e) {
    e.preventDefault();
    this.routes.createProduct(this.state)
    .then(() =>{
      this.props.fromApp();
      this.props.fromAppRefreshProducts();
      this.props.history.push('/your-bid')
      //  return <Redirect to='/your-bid' />
    
    }) 
  }
  handleChange(e) {


    this.setState({
      ...this.state,
      file: e.target.files[0]
    });
  }

  handleSubmit(e, photo) {
    e.preventDefault();
    this.routes.addPicture(this.state.file).then(photoData => {
      this.setState({
        ...this.state,
        [photo]: photoData
      });

    });
  }

  componentDidMount () {
    this.routes.getMyBids()
    .then(response => {

      this.setState({
        ...this.state,
        bid: response[0]._id,


      })
    })
  }
  goBack =()=> {
    this.props.history.goBack()
  }

  render() {
    if(this.props.bid) {
      return (
        <div className="container-create-product">
          <a className="back-btn"><i class="medium material-icons" onClick={this.goBack}>arrow_back</i></a>
          <h1>CONTENIDO DE LA CAJA</h1>
          <div className="box-form">
          <div className="create-photo">
          <h2>Foto</h2>
          <div className="photo-container">
          <img src={this.state.imgPath1} alt="product picture" />
          </div>
          <div className="container-photo-input">
            
  
            <form onSubmit={e => this.handleSubmit(e, "imgPath1")}>
              <input className="load-image" type="file" onChange={e => this.handleChange(e)} /> <br />
              <button type="submit" className="save-photo">Guardar foto</button>
            </form>
            </div>
          </div>
          <form>
            <h2>Etiqueta</h2>
            <label htmlFor="name">Nombre</label>
            <input
              type="text"
              placeholder="Contenido de la caja a la venta"
              name="name"
              id="input-name"
              onChange={e => this.updateFormData(e, "name")}
            ></input>
            <label htmlFor="description">Descripción</label>
            <input
              type="text"
              placeholder="Breve descripción"
              name="description"
              onChange={e => this.updateFormData(e, "description")}
              maxlength="100"
            ></input>
            <label htmlFor="price">Precio</label>
            <input
              type="number"
              placeholder="Precio"
              name="price"
              onChange={e => this.updateFormData(e, "price")}
            ></input>

            <a className="btn-crear send-product" onClick={e => this.sendState(e)}>Crear caja</a>
          </form>
          </div>
        </div>
      );
    }
    else 
    {
      return (
      <React.Fragment>
        <h1>Tienes que crear una mudanza para poder tener cajas con productos</h1>
        <ButtonAdd bid={true}></ButtonAdd>
      </React.Fragment>
      )
    }

  }
}


export default withRouter(CreateProduct)
