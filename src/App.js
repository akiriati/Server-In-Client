import React from 'react';
import Watermark from './watermark';
import Gallery from './gallery';
import './App.css';
import ImagesUpload from './images_upload';

class App extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      watermark: [],
      withoutWatermark: [],
      withWatermark: [],
    }
    let timer = null;
  }

  handleWatermarkChanged = (event) => {
    fetch("/files/watermark.png", {
      method: 'POST',
      body: event.target.files[0],
      headers: {
        'content-type': 'image/png'
      }
    }).then(
      this.setState({
        watermark: [window.URL.createObjectURL(event.target.files[0])]
      })
    )
  }

  handleUploadNonWatermarkedPictures = (event) => {
    for (let file of Array.from(event.target.files)) {
      fetch("/files/withoutWatermark/" + file.name, {
        method: 'POST',
        body: file,
        headers: {
          'content-type': 'image/png'
        }
      })
    }
  }

    componentDidMount = () => {
      this.activateFetchFromServer()
    }

    activateFetchFromServer = () => (
      this.timer = setTimeout(() => {
        this.fetchImageListFromServer()
        this.activateFetchFromServer()
      }, 3000)
    )
    

    convertDataToStateAndSetState = (data) => {
      let watermarkPaths = []
      const withtoutWatermarkPaths = []
      const withWatermarkPaths = []
      for (let filePath of data.files){
        if (filePath.startsWith("/watermark")) {
          watermarkPaths.push(filePath);
        }
        else if(filePath.startsWith("/withoutWatermark")){
          withtoutWatermarkPaths.push(filePath)
        }
        else if (filePath.startsWith("/withWatermark")){
          withWatermarkPaths.push(filePath)
        }else{
          console.error("unkown filepath " + filePath)
        }
      }
      return this.setState({
        watermark:watermarkPaths,
        withWatermark:withWatermarkPaths,
        withoutWatermark: withtoutWatermarkPaths
      })
      
    }

    fetchImageListFromServer = () => {
      fetch("/list", {
        method: 'POST',
        body: JSON.stringify({ path: "/" }),
        headers: {
          'Content-Type': 'application/json'
        },
      }).then(respons=> respons.json()).then(this.convertDataToStateAndSetState) 
    }

    render() {
      return (
        <div>
            <h2>Watermark</h2>
            <input type="file" onChange={this.handleWatermarkChanged}/>
            <Gallery
              {...this.state}
              path="/watermark/"
              picsIds={this.state.watermark}
            ></Gallery>
          <ImagesUpload {...this.state} handleUploadNonWatermarkedPictures={this.handleUploadNonWatermarkedPictures}>
          </ImagesUpload>
          <Gallery
            {...this.state}
            path="/withoutWatermark/"
            picsIds={this.state.withoutWatermark}
          >
          </Gallery>
          <h2>Done! ✅ </h2>
          <Gallery
            {...this.state}
            path="/withWatermark/"
            picsIds={this.state.withWatermark}
          >
          </Gallery>
        </div>
      );
    }
  }



  export default App;
