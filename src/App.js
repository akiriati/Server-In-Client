import React from 'react';
import Gallery from './gallery';
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
            <input type="file" onChange={this.handleWatermarkChanged}/>
            <Gallery
              {...this.state}
              path="/watermark/"
              picsIds={this.state.watermark}
              handleDeleteFile={this.handleDeleteFile}
            ></Gallery>
          </Grid>
          <Grid container item xs={4} direction="column"> 
          <h2>Processing 🔄 ({this.state.withoutWatermark.length} files)</h2>
          <input type="file" multiple onChange={this.handleUploadNonWatermarkedPictures}/>
          <Gallery
            {...this.state}
            path="/withoutWatermark/"
            picsIds={this.state.withoutWatermark}
            handleDeleteFile={this.handleDeleteFile}
          >
          </Gallery>
          </Grid>
          <Grid container item xs={4} direction="column"> 
          <h2>Done! ✅ ({this.state.withWatermark.length} files)</h2>
          <Gallery
            {...this.state}
            path="/withWatermark/"
            picsIds={this.state.withWatermark}
            handleDeleteFile={this.handleDeleteFile}
          >
          </Gallery>
          </Grid>
        </Grid>
        <form action="download_all" method="POST">
          <input class="button" type="submit" id="download" value="Download all files"/>
        </form>
        </div>
      );
    }
  }



  export default App;
