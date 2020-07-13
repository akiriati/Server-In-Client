import React from 'react';
import './App.css';

class ImagesUpload extends React.Component {
  
  constructor(props){
    super(props)
  }

  render() {
    return (
      <div>
        <h2>Processing 🔄</h2>
        <input type="file" multiple onChange={this.props.handleUploadNonWatermarkedPictures}/>
        
      </div>
    );
  }

}



export default ImagesUpload;