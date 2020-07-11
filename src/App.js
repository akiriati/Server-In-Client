import React from 'react';
import Watermark from './watermark';
import NonWatermarkedSection from './nonWatermarkedSection';
import './App.css';

class App extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      watermark: null,
      nonWatermarkedIds: [],
      watermarkedIds: []
    }

  }

  handleWatermarkChanged = (event) => {
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

  handleUploadNonWatermarkedPictures = (event) => {
    for (let file in event.target.files) {
      fetch("http://localhost:3000/actions/uploadNonWatermarkedPictures", {
        method: 'POST',
        body: file,
        headers: {
          'content-type': 'image/png'
        }
      }).then(response => {
        this.setState({
          nonWatermarkedIds: this.state.nonWatermarkedIds.append(response)
        })
      })
    }
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
        <NonWatermarkedSection
          {...this.state}
        >
        </NonWatermarkedSection>
      </div>
    );
  }
}



export default App;
