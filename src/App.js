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
        watermark: window.URL.createObjectURL(event.target.files[0])
      })
    )
  }

  handleUploadNonWatermarkedPictures = (event) => {
    for (let file of Array.from(event.target.files)) {
      let picId = this.uuidv4()
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
      }, 1000)
    )
    

    convertDataToStateAndSetState = (data) => {
      let watermarkPath = ""
      const withtoutWatermarkPaths = []
      const withWatermarkPaths = []
      for (let filePath of data.files){
        if (filePath.startsWith("/watermark")) {
          watermarkPath = filePath;
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
        watermark:watermarkPath,
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
