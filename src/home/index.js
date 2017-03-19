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
import s from './styles.css';
import { title, html } from './index.md';

// import $ from 'jquery';
import _ from 'lodash';
import moment from 'moment';
// import Tabletop from 'tabletop';

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
      places: []
    };
  };

  init() {
    console.log('init() ...');
    console.log('\n');

    document.title = title;

    var component = this;

    component.getCurrentLocation();

    // console.log('component.state: ', component.state);

    // console.log('component.state.currentTime: ', component.state.currentTime);
    // console.log('component.state.currentDay: ', component.state.currentDay);

    component.getData();
  };

  componentWillMount() {
    console.log('componentWillMount() ...');
    console.log('\n');

    var component = this;

    component.init();

    // console.log('component.state: ', component.state);
  };

  // componentDidMount() {
  //   console.log('componentDidMount() ...');
  //   console.log('\n');

  //   var component = this;
  //   console.log('component.state: ', component.state);
  // };

  // componentDidUpdate() {
  //     console.log('componentDidUpdate() ...');
  //     console.log('\n');

  //     var component = this;
  //     console.log('component.state: ', component.state);
  // };

  getData() {
    console.log('getData() ...');
    console.log('\n');

    var component = this;

    var googleSheets = require('./googleSheets.json');
    var hours = require('./hours.json');
    // console.log('googleSheets: ', googleSheets);
    // console.log('hours: ', hours);

    _.forEach(googleSheets, function(value) {
      var matchingObject = _.find(hours, ['id', value.id]);

      value.hoursDataSource = matchingObject.hoursDataSource;
      value.hours = matchingObject.hours;
    });

    component.setState({
      places: googleSheets
    });
  };

  getCurrentLocation() {
    console.log('getCurrentLocation() ...');
    console.log('\n');

    var component = this;

    navigator.geolocation.getCurrentPosition(function(position) {
      component.setState({
        currentLocation: {
          'latitude': position.coords.latitude,
          'longitude': position.coords.longitude,
          'accuracy': position.coords.accuracy
        }
      });
    });
  };

  // checkIfOpen goes here

  render() {
    console.log('render() ...');
    console.log('\n');

    var component = this;

    var now = moment(),
        today = now.day(),
        tomorrow = today + 1;

    if(tomorrow === 7) {
        tomorrow = 0;
    }

    console.log('now: ', now);
    console.log('today: ', today);
    console.log('tomorrow: ', tomorrow);
    console.log('component.state.places: ', component.state.places);

    var places = component.state.places.map(function(place, i) {
      return (
        <li className="place" key={i}>
          <h1 className="place__name">{place.name}</h1>
          <p className="place__address">{place.address}</p>
          <p className="place__neighborhood">{place.neighborhood}</p>
          {typeof place.hours === 'string' ? (
            <div className="place__">
              <p className="place__">{place.hours}</p>
            </div>
          ) : (
            <div className="place__">
              <p className="place__">{place.hours[today].day} – {place.hours[today].format_12}</p>
              <p className="place__">{place.hours[tomorrow].day} – {place.hours[tomorrow].format_12}</p>
            </div>
          )}
        </li>
      );
    });

    return (
      <Layout className={s.content}>
        <ul>
          {places}
        </ul>
      </Layout>
    );
  }
}

export default HomePage;
