import React from 'react';
import Gallery from './gallery';
import Progress from './progress';
import './App.css';
import Grid from '@material-ui/core/Grid';

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
      }, 1000)
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

    handleDeleteFile = (path) => {
      fetch(path, {method: 'DELETE'}).then(this.fetchImageListFromServer())
    }

    render() {
      return (
        <div style={{ padding: 100 }}>
        <Grid container spacing={4}>
          <Grid container item xs={4} direction="column"> 
            <h2>Watermark</h2>      
            <Gallery
              {...this.state}
              path="/watermark/"
              picsIds={this.state.watermark}
              handleDeleteFile={this.handleDeleteFile}
            ></Gallery>
            <div className="upload-btn-wrapper">
              <button className="btn">Upload Watermark</button>
              <input type="file" onChange={this.handleWatermarkChanged}/>       
            </div>
            
          </Grid>
          <Grid container item xs={4} direction="column"> 
          <h2>Photos</h2>
          <Gallery
            {...this.state}
            path="/withoutWatermark/"
            picsIds={this.state.withoutWatermark}
            handleDeleteFile={this.handleDeleteFile}
          >
          </Gallery>
          <div className="upload-btn-wrapper">
            <button className="btn">Upload Photos</button>
            <input id="file-upload" type="file" multiple onChange={this.handleUploadNonWatermarkedPictures}/>          
          </div>
          </Grid>
          <Grid container item xs={4} direction="column"> 
          <h2>Ready to Download</h2>
          <Gallery
            {...this.state}
            path="/withWatermark/"
            picsIds={this.state.withWatermark}
            handleDeleteFile={this.handleDeleteFile}
          >
          </Gallery>
          </Grid>
        </Grid>      

        </div>
      );
    }
  }

  /*
          <Progress
                {...this.state}
                numWithWatermark={this.state.withWatermark.length}
                number={(this.state.withWatermark.length*100)/(this.state.withWatermark.length+this.state.withoutWatermark.length)}
                value={(this.state.withWatermark.length*100)/(this.state.withWatermark.length+this.state.withoutWatermark.length)}
              >
        </Progress>
  */


  export default App;
