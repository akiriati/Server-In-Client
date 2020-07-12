import React from 'react';
import './App.css';

class Picture extends React.Component {
  
  constructor(props){
    super(props)
  }

  render() {
    return (
      <div>
        <img src={this.props.source} className="picture"/>        
      </div>
    );
  }
}



export default Picture;