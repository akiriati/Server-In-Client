import React from 'react';
import Watermark from './watermark';
import './App.css';

class App extends React.Component {
  
  constructor(props){
    super(props)
    this.state = {
      watermark: null
    }

  }

  handleWatermarkChanged = (event) => {
    //const formData = new FormData()
    //formData.append('watermark',event.target.files[0]);
    fetch("http://localhost:3000/files/watermark.png", {
      method: 'POST',
      body: event.target.files[0], 
      headers: {
        'content-type': 'image/png'
      }   
    }).then(
      this.setState({
        watermark: window.URL.createObjectURL(event.target.files[0])
      })
    )
  }

  componentDidMount = () => {
    fetch("http://localhost:3000/files/watermark.png")
    .then(response => response.blob())
    .then(blob =>  
      this.setState({
        watermark: window.URL.createObjectURL(new File([blob], "name"))
      }))
    }


  render() {
    return (
      <div>
        <Watermark 
        {...this.state} 
        handleWatermarkChanged={this.handleWatermarkChanged}
        ></Watermark>
      </div>
    );
  }
}



export default App;
