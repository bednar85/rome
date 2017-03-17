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

import $ from 'jquery';
import moment from 'moment';
import Tabletop from 'tabletop';

class HomePage extends React.Component {
  static propTypes = {
    airbnbLocation: PropTypes.object.isRequired,
    places: PropTypes.array.isRequired
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
      places: props.places
    };
  };

  init() {
    console.log('FUNCTION init');
    console.log('\n');

    document.title = title;

    var component = this;

    // component.getCurrentTime();
    component.getCurrentLocation();

    console.log('component: ', component);
    // console.log('component.state.currentTime: ', component.state.currentTime);
    // console.log('component.state.currentDay: ', component.state.currentDay);

    component.getDataFromSheets('https://docs.google.com/spreadsheets/d/1cLTMAeroSyfZX9x5Izl-sfWTXjtz1Tkr6K2PnlPdlzM/pubhtml?gid=1300394552&single=true').done(function(data) {
      console.log('getDataFromSheets data: ', data);
      // this.setState({
      //   googleSheetsData: data
      // });
    });
  };

  componentWillMount() {
    console.log('FUNCTION componentWillMount');
    console.log('\n');

    var component = this;

    component.init();
  };

  componentDidMount() {
    console.log('FUNCTION componentDidMount');
    console.log('\n');

    var component = this;

    // component.checkIfOpen();
  };

  componentDidUpdate() {
      console.log('FUNCTION componentDidUpdate');
      console.log('\n');
  };

  // getCurrentTime() {
  //   console.log('FUNCTION getCurrentTime');
  //   console.log('\n');

  //   var component = this;

  //   component.setState({
  //     currentTime: moment(),
  //     currentDay: moment().day()
  //   });
  // };

  getDataFromSheets(url) {
    console.log('FUNCTION getDataFromSheets');
    console.log('\n');

    var deferred = $.Deferred();

    Tabletop.init({
      key: url,
      callback: function(data, tabletop) {
        deferred.resolve(data);
      },
      simpleSheet: true
    });

    return deferred.promise();
  };

  getCurrentLocation() {
    console.log('FUNCTION getCurrentLocation');
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

  checkIfOpen(now, today, place) {
    // console.log('FUNCTION checkIfOpen');
    // console.log('\n');

    console.log(place.name);
    console.log(place.hours[today].day + ': ' + place.hours[today].format_24);

    var todaysHours = place.hours[today];

    if(typeof place.hours[today].ranges !== 'undefined') {
      // console.log('ranges exists');

      if(place.hours[today].ranges === null) {
        console.log('Open?: ' + false);
        console.log('\n');

        return false;
      } else {
        // if there are two ranges
        if(place.hours[today].ranges.length === 2) {
          // store references for each range object
          var range1 = todaysHours.ranges[0],
              range2 = todaysHours.ranges[1];

          // capture specific values of each range
          var range1_openHour = range1[0].h,
              range1_openMinute = range1[0].m || 0,
              range1_closeHour = range1[1].h,
              range1_closeMinute = range1[1].m || 0;

          // capture specific values of each range
          var range2_openHour = range2[0].h,
              range2_openMinute = range2[0].m || 0,
              range2_closeHour = range2[1].h,
              range2_closeMinute = range2[1].m || 0;

          // create moment objects for each range
          var range1_open = moment().set({'day': today, 'hour': range1_openHour, 'minute': range1_openMinute, 'second': 0}),
              range1_close = moment().set({'day': today, 'hour': range1_closeHour, 'minute': range1_closeMinute, 'second': 0});

          // create moment objects for each range
          var range2_open = moment().set({'day': today, 'hour': range2_openHour, 'minute': range2_openMinute, 'second': 0}),
              range2_close = moment().set({'day': today, 'hour': range2_closeHour, 'minute': range2_closeMinute, 'second': 0});

          // console.log(place.hours[today].day + ': ' + range1_openHour + ':' + range1_openMinute + ' - ' + range1_closeHour + ':' + range1_closeMinute + ', ' + range2_openHour + ':' + range2_openMinute + ' - ' + range2_closeHour + ':' + range2_closeMinute);

          // figure out if place is open based on range data
          console.log('Open?: ' + (now.isBetween(range1_open, range1_close) || now.isBetween(range2_open, range2_close)));
          console.log('\n');

          return now.isBetween(range1_open, range1_close) || now.isBetween(range2_open, range2_close);
        } else {
          // store references for each range object
          var range1 = todaysHours.ranges[0];

          // capture specific values of each range
          var range1_openHour = range1[0].h,
              range1_openMinute = range1[0].m || 0,
              range1_closeHour = range1[1].h,
              range1_closeMinute = range1[1].m || 0;

          // console.log(place.hours[today].day + ': ' + range1_openHour + ':' + range1_openMinute + ' - ' + range1_closeHour + ':' + range1_closeMinute);

          // create moment objects for each range
          var range1_open = moment().set({'day': today, 'hour': range1_openHour, 'minute': range1_openMinute, 'second': 0}),
              range1_close = moment().set({'day': today, 'hour': range1_closeHour, 'minute': range1_closeMinute, 'second': 0});

          // figure out if place is open based on range data
          console.log('Open?: ' + now.isBetween(range1_open, range1_close));
          console.log('\n');

          return now.isBetween(range1_open, range1_close);
        } 
      }
    }

    console.log('\n');
  };

  render() {
    // var component = this;

    // component.state.places.forEach(function(place) {
    //   var now = moment(),
    //       today = now.day();

    //   component.checkIfOpen(now, today, place);
    // });

    return (
      <Layout className={s.content}>
        <h4>Places</h4>
        <ul>
          {this.props.places.map((place, i) =>
            <li key={i}>
              <p>{place.name}</p>
              <p>{place.address}</p>
              <p>{place.neighborhood}</p>
              <ul>
                {place.hours.map((dayObject, i) =>
                  <li key={i}>
                    <p>{dayObject.day}</p>
                    <p>{dayObject.format_12}</p>
                  </li>
                )}
              </ul>
            </li>
          )}
        </ul>
        <p>
          <br /><br />
        </p>
      </Layout>
    );
  }
}

export default HomePage;
