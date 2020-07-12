import React from 'react';
import './App.css';

class ImagesUpload extends React.Component {
  
  constructor(props){
    super(props)
  }

  render() {
    return (
      <div>
        <div>Upload your images</div>
        <input type="file" multiple onChange={this.props.handleUploadNonWatermarkedPictures}/>
        
      </div>
    );
  }

}



export default ImagesUpload;