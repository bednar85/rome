/**
 * React Static Boilerplate
 * https://github.com/kriasoft/react-static-boilerplate
 *
 * Copyright © 2015-present Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import React, { PropTypes } from 'react';
import Layout from '../../components/Layout';
import FilterBar from '../../components/FilterBar';
import PlacesList from '../../components/PlacesList';
import cx from 'classnames';
import s from './styles.css';
import { title, html } from './index.md';

import _ from 'lodash';

import googleSheetsData from './googleSheetsData.json';
import hoursData from './hoursData.json';

class HomePage extends React.Component {
  static propTypes = {
    airbnbLocation: PropTypes.object.isRequired
  };

  static defaultProps = {
    airbnbLocation: {
      latitude:  41.898084,
      longitude: 12.471409
    }
  };

  constructor(props) {
    super(props);
    this.state = {
      places: googleSheetsData,
      filterBarSelections: {}
    };
  };

  init() {
    console.log('init() ...');
    console.log('\n');

    var component = this;

    component.getData();
  };

  componentWillMount() {
    console.log('componentWillMount() ...');
    console.log('\n');

    var component = this;

    component.init();
  };

  getData() {
    console.log('getData() ...');
    console.log('\n');

    var component = this;
    
    // Merge hours data into place object with matching unique id
    _.forEach(googleSheetsData, function(place) {
      var matchingObject = _.find(hoursData, ['id', place.id]);

      place.hoursDataSource = matchingObject.hoursDataSource;
      place.hours = matchingObject.hours;
    });

    component.setState({
      places: googleSheetsData
    });
  };


  onChildChanged(updatedState) {
    console.log('onChildChanged() ...');
    console.log('\n');

    this.setState({
      filterBarSelections: updatedState
    });

    console.log('onChildChanged updatedState argument: ', updatedState);
    console.log('onChildChanged this.state: ', this.state);
    console.log('\n');
  };
  render() {
    console.log('render() ...');
    console.log('\n');

    var component = this;

    console.log('component.state: ', component.state);

    return (
      <Layout className={s.content}>
        <FilterBar callbackParent={this.onChildChanged.bind(this)} />
        <PlacesList places={component.state.places} />
      </Layout>
    );
  }
}

export default HomePage;
