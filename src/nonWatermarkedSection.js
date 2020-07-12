import React from 'react';
import Picture from './picture'

class NonWatermarkedSection extends React.Component {

  constructor(props) {
    super(props)
  }

  render() {
    return (
      <div>
        {
          this.props.withoutWatermark.map((picId) => {
            return <Picture
              {...this.props}
              source={"http://localhost:3000/files/" + picId}
            >
            </Picture>
          })
        }
      </div>
    );
  }
}

export default NonWatermarkedSection
