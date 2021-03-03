import React, { useState } from 'react';

import { Form, Button, Row, Col } from 'react-bootstrap'

function App() {


  //states 

  const [ tramos ] = useState([12, 24, 36, 48, 72]);
  const [ form, setForm ] = useState({
    monto : '',
    tramo : ''
  })

  const [ cuotaFija, setCuotaFija] = useState(0);
  const [ error, setError ] = useState({
    activo : false,
    mensaje : ''
  });

  //desestructuracion states

  const { monto, tramo } = form;
  const { activo, mensaje } = error;

  //***************************************funciones***************************************

  //cambiar estado del form
  const funtionHandleChange = (nombreHandleChange, valorHandleChange) => {
    setForm({
      ...form,
      [nombreHandleChange] : valorHandleChange
    })
  }

  //poner puntuación

  const firstPoints = (value) => {
    let size = value.length
    let tempValue = value.substring(size-2,size);
    let tempValue2 = value.substring(0, size-2);
    let newValue = `${tempValue2}.${tempValue}`
    return newValue;
  }

  const threePoints = (value) => {
    //1000
    let size = value.length //4
    let tempValue = value.substring(size-3,size); //000
    let tempValue2 = value.substring(0, size-3); //1
    let newValue = `${tempValue2}.${tempValue}` //1.000
    return newValue;
  }

  //quitar los puntos

  //cuando digiten algo

  const handleChange = (e) => {

    const { name, value } = e.target

    if(name === 'monto'){

      const numbers = ['0','1','2','3','4','5','6','7','8','9'];
      let sValue = value.replace(/[^0-9]/g, ''); 

      if(numbers.find(element => value[value.length-1] === element)){
        if( value.length === 3 ){
          console.log('es igual a 3')
          console.log(sValue)
          if(sValue.length < 3){
            funtionHandleChange(name, sValue);
            return;
          }
          funtionHandleChange(name, firstPoints(sValue));
        } else {
          if(value.length > 3){
            
            if(sValue.indexOf('.') === -1){

              let newValue = firstPoints(sValue); 
              let withoutPoints = newValue.split('.', 2); 
              let lastValue = newValue; 

              let withoutPointsValor = withoutPoints[0]; 
              let lastPointsValor = `.${withoutPoints[1]}`; 
              let sizeWithoutPointsValor = withoutPointsValor.length;
              while(sizeWithoutPointsValor >= 4){
                lastValue = `${threePoints(withoutPointsValor)}${lastPointsValor}`
                withoutPoints = lastValue.split('.', 2); 
                sizeWithoutPointsValor = withoutPoints[0].length;  
                withoutPointsValor = withoutPoints[0]; 
                lastPointsValor = `.${withoutPoints[1]}${lastPointsValor}` 
              }
              funtionHandleChange( name, lastValue );
            } else {
              funtionHandleChange( name, sValue );
            }
            
          } else {
            funtionHandleChange(name, value);
          }
        }
      } else {
        if(value.length === 0){
          funtionHandleChange(name, '');
        }
      }

    } else {
      //en caso de que no sea monto
      funtionHandleChange(name, value);
    }
  }

  //cuando lo envién

  const toggleSubmit = (e) => {
    e.preventDefault();

    // const valueMonto = monto.replace('.', '');

    if(tramo === '' || tramo === 'Seleccione un mes' ){

      setError({
        activo : true,
        mensaje : 'Todos los campos son obligatorios'
      })
      return;

    } else if ( monto < 1 || monto === '') {

      setError({
        activo : true,
        mensaje : 'El monto tiene que ser mayo a 0'
      })
      return;

    } else { 
      setError(false)
    }

    let Monto = parseFloat(monto.replace(/[^0-9]/g, '')); 
    Monto /= 100;
    let n = parseFloat(tramo);
    const MV = 1.0;
    //setCuotaFija(parseFloat(((Monto * (MV * (1 + MV) ^ n)) / ((1 + MV) ^ n) - 1)).toFixed(2));
    setCuotaFija(parseFloat((Monto * ((((1 + MV)^n) * MV) / (((1 + MV)^n)-1)))).toFixed(2));
  }

  //interfáz

  return (
    <div className="App">
      <Form onSubmit={toggleSubmit}>
        {
          (activo) ?
            <Form.Text className="text-danger">
              ERROR: { mensaje }
            </Form.Text>
          : null
        }
          
        <Row>
          <Col>
            <Form.Group controlId="formBasicEmail">
              <Form.Label>Monto</Form.Label>
              <Form.Control 
                type="text" 
                name="monto"
                value={monto}
                onChange={handleChange}
                placeholder="Ingrese monto" />
            </Form.Group>
          </Col>
          <Col>
            <Form.Group controlId="formGridState">
              <Form.Label>Seleccione mes</Form.Label>
              <Form.Control 
                as="select" 
                name="tramo"
                value={tramo}
                onChange={handleChange}>
                <option>Seleccione un mes</option>
                {
                  tramos.map((tramo, index) => (
                    <option key={index}>{tramo}</option>
                  ))
                }
              </Form.Control>
            </Form.Group>
          </Col>
        </Row>
        <Button variant="outline-primary" type="submit" className="boton-credito">
          Calcular crédito
        </Button>
      </Form>
      <div className="contenedor-cuotafija d-flex justify-content-center">
        {!( cuotaFija === 0) ? (cuotaFija) : 'Calcule la cuota fija'}
      </div>
    </div>
  );
}

export default App;
