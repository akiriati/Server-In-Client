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
            return <Picture key={picId}
              {...this.props}
              source={"/files" + picId}
            >
            </Picture>
          })
        }
      </div>
    );
  }
}

export default NonWatermarkedSection
