/**
 * React Static Boilerplate
 * https://github.com/kriasoft/react-static-boilerplate
 *
 * Copyright © 2015-present Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import React from 'react';
import {Checkbox, CheckboxGroup} from 'react-checkbox-group';
import {Radio, RadioGroup} from 'react-radio-group';
import s from './FilterBar.css';

class FilterBar extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      sortBy: 'distanceFromUs',
      distance: '100',
      recommendationLevel: ['1', '2', '3', '4'],
      interestLevel: ['1', '2', '3', '4'],
      priceRange: '4'
    };
  }

  // componentDidMount() {
  //   // var component = this;
  // };

  sortByChanged(newState) {
    this.setState({
      sortBy: newState
    });

    this.props.callbackParent(this.state);

    // console.log('newState: ', newState);
    // console.log('this.state: ', this.state);
    // console.log('\n');
  };

  distanceChanged(newState) {
    this.setState({
      distance: newState
    });

    this.props.callbackParent(this.state);

    // console.log('newState: ', newState);
    // console.log('this.state: ', this.state);
    // console.log('\n');
  };

  recommendationLevelChanged(newState) {
    this.setState({
      recommendationLevel: newState
    });

    this.props.callbackParent(this.state);

    // console.log('newState: ', newState);
    // console.log('this.state: ', this.state);
    // console.log('\n');
  };

  interestLevelChanged(newState) {
    this.setState({
      interestLevel: newState
    });

    this.props.callbackParent(this.state);

    // console.log('newState: ', newState);
    // console.log('this.state: ', this.state);
    // console.log('\n');
  };

  priceRangeChanged(newState) {
    this.setState({
      priceRange: newState
    });

    this.props.callbackParent(this.state);

    // console.log('newState: ', newState);
    // console.log('this.state: ', this.state);
    // console.log('\n');
  };

  // updateSelections() {    
  //   console.log('sortByGroup: ', this.refs.sortByGroup.state.value);
  //   console.log('distanceGroup: ', this.refs.distanceGroup.state.value);
  //   console.log('recommendationLevelGroup: ', this.refs.recommendationLevelGroup.state.value);
  //   console.log('interestLevelGroup: ', this.refs.interestLevelGroup.state.value);
  //   console.log('priceRangeGroup: ', this.refs.priceRangeGroup.state.value);
  //   console.log('\n');

  //   var newState = {
  //     sortByGroup: this.refs.sortByGroup.state.value,
  //     distanceGroup: this.refs.distanceGroup.state.value,
  //     recommendationLevelGroup: this.refs.recommendationLevelGroup.state.value,
  //     interestLevelGroup: this.refs.interestLevelGroup.state.value,
  //     priceRangeGroup: this.refs.priceRangeGroup.state.value
  //   };

  //   this.setState(newState);

    // console.log('newState: ', newState);
  //   console.log('\n');

  //   console.log('this.state: ', this.state);
  //   console.log('\n');
  // };








  render() {
    var component = this;

    return (
      <div>
        <RadioGroup
          name="sortBy"
          ref="sortByGroup"
          selectedValue={this.state.sortBy}
          onChange={this.sortByChanged.bind(this)}>
          <label><Radio value="distanceFromUs" />Distance From Us</label>
          <label><Radio value="distanceFromHotel" />Distance From Hotel</label>
          <label><Radio value="mostRecommended" />Most Recommended</label>
          <label><Radio value="mostInteresting" />Most Interesting</label>
          <label><Radio value="priceRange" />Price Range</label>
        </RadioGroup>
        <RadioGroup
          name="distance"
          ref="distanceGroup"
          selectedValue={this.state.distance}
          onChange={this.distanceChanged.bind(this)}>
          <label><Radio value="0.5" />Within 4 Blocks</label>
          <label><Radio value="1.5" />Walking (1.5 mi)</label>
          <label><Radio value="5" />Bus/Subway (5 mi)</label>
          <label><Radio value="100" />All</label>
        </RadioGroup>
        <CheckboxGroup
          name="recommendationLevel"
          ref="recommendationLevelGroup"
          value={this.state.recommendationLevel}
          onChange={this.recommendationLevelChanged.bind(this)}>
          <label><Checkbox value="1" />Somewhat Recommended</label>
          <label><Checkbox value="2" />Recommended</label>
          <label><Checkbox value="3" />Highly Recommended</label>
          <label><Checkbox value="4" />Very Highly Recommended</label>
        </CheckboxGroup>
        <CheckboxGroup
          name="interestLevel"
          ref="interestLevelGroup"
          value={this.state.interestLevel}
          onChange={this.interestLevelChanged.bind(this)}>
          <label><Checkbox value="1" />Visit If Possible</label>
          <label><Checkbox value="3" />Try Hard To Visit</label>
          <label><Checkbox value="2" />Try To Visit</label>
          <label><Checkbox value="4" />Must Visit</label>
        </CheckboxGroup>
        <RadioGroup
          name="priceRange"
          ref="priceRangeGroup"
          selectedValue={this.state.priceRange}
          onChange={this.priceRangeChanged.bind(this)}>
          <label><Radio value="1" />€</label>
          <label><Radio value="2" />€€</label>
          <label><Radio value="3" />€€€</label>
          <label><Radio value="4" />€€€€</label>
        </RadioGroup>
      </div>
    );
  }
}

export default FilterBar;
