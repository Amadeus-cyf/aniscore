import React, { Component } from 'react';
import StarRatings from 'react-star-ratings';
 
class NoneditStarRating extends Component {
    render() {
      return (
        <StarRatings
          rating={this.props.average}
          starRatedColor="#ffb400"
          numberOfStars={5}
          name='noneditrating'
          starDimension="18px"
          starSpacing="2px"
        />
      );
    }
}

export default NoneditStarRating;
