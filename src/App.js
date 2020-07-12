import React from 'react';
import Watermark from './watermark';
import NonWatermarkedSection from './nonWatermarkedSection';
import './App.css';
import ImagesUpload from './images_upload';

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
      let picId = this.uuidv4()
      fetch("http://localhost:3000/files/" + picId + ".png", {
        method: 'POST',
        body: file,
        headers: {
          'content-type': 'image/png'
        }
      }).then(response => {
        fetch("http://localhost:3000/addNewPicId", {
          method: 'POST',
          body: { picId: picId },
        }).then(response =>
          this.setState({
            nonWatermarkedIds: [...this.state.nonWatermarkedIds, picId]
          })
        )
      })
    }
  }

  uuidv4 = () => {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
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
          <ImagesUpload {...this.state} handleUploadNonWatermarkedPictures={this.handleUploadNonWatermarkedPictures}>
          </ImagesUpload>
          <NonWatermarkedSection
            {...this.state}
          >
          </NonWatermarkedSection>
        </div>
      );
    }
  }



  export default App;
