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
      inProgress:[],      
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
      fetch("/files/" + picId + ".png", {
        method: 'POST',
        body: file,
        headers: {
          'content-type': 'image/png'
        }
      }).then(response => {
        fetch("/addNewPicId", {
          method: 'POST',
          body: { picId: picId },
        })
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
      fetch("files/watermark.png")
        .then(response => response.blob())
        .then(blob =>{
          return this.setState({
            watermark: window.URL.createObjectURL(new File([blob], "name"))
          })
        }
      )
      // this.activateFetchFromServer()
    }

    activateFetchFromServer = () => (
      this.timer = setTimeout(() => {
        this.fetchFromServer()
        this.activateFetchFromServer()
      }, 1000)
    )
    
    fillMockedData = ()=> {

    }

    fetchFromServer = () => {
      fetch("/data/with_watermark").then(
        response => response.json()
      ).then(withWatermark =>  this.setState({
        withWatermark:withWatermark
      })
      )
      fetch("/data/without_watermark").then(response => response.json()).then(withoutWatermark =>
        this.setState({withoutWatermark:withoutWatermark})
      )

      fetch("/data/in_progress").then(response => response.json()).then(inProgress =>
        this.setState({inProgress:inProgress})
      )
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
