import React from 'react';
import Picture from './picture';

class Watermark extends React.Component {
  
  constructor(props){
    super(props)
  }

  render() {
    return (
      <div>
        
        <Picture 
        source={"/files" + this.props.watermark}
        >
        </Picture>   
      </div>
    );
  }
}


export default Watermark;