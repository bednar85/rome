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
import cx from 'classnames';
import s from './styles.css';
import { title, html } from './index.md';

import $ from 'jquery';
import _ from 'lodash';
import moment from 'moment';
// import Tabletop from 'tabletop';

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
      places: googleSheetsData
    };
  };

  init() {
    console.log('init() ...');
    console.log('\n');

    // document.title = title;

    var component = this;

    // component.getCurrentLocation();

    component.getData();
    // component.refreshLocationData();
  };

  componentWillMount() {
    console.log('componentWillMount() ...');
    console.log('\n');

    // attach helper method to Number prototype
    Number.prototype.toRad = function() {
      return this * Math.PI / 180;
    };

    // console.log('Number.prototype: ', Number.prototype);

    var component = this;

    component.init();

    // console.log('component.state: ', component.state);
  };

  getData() {
    console.log('getData() ...');
    console.log('\n');

    var component = this;
    
    _.forEach(googleSheetsData, function(place) {
      var matchingObject = _.find(hoursData, ['id', place.id]);

      place.hoursDataSource = matchingObject.hoursDataSource;
      place.hours = matchingObject.hours;
    });

    component.setState({
      places: googleSheetsData
    });

    component.refreshLocationData();
  };

  calculateDistance(lat1, lon1, lat2, lon2) {
    var R = 6371; // kilometers
    var dLat = (lat2 - lat1).toRad();
    var dLon = (lon2 - lon1).toRad(); 
    var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1.toRad()) * Math.cos(lat2.toRad()) * 
    Math.sin(dLon / 2) * Math.sin(dLon / 2); 
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)); 
    var d = R * c;

    // convert to miles, then round to 1 decimal point
    var output = Math.round((d * 0.621371) * 10) / 10;

    return output;
  };

  getCurrentLocation() {
    console.log('getCurrentLocation() ...');
    console.log('\n');

    var deferred = $.Deferred();

    function success(position) {
      console.log('getCurrentLocation succeeded');

      // resolve the deferred with your object as the data
      deferred.resolve({
        longitude: position.coords.longitude,
        latitude: position.coords.latitude
      });
    }

    function error(error) {
      console.warn('getCurrentLocation error(' + error.code + '): ' + error.message);
    };

    var options = {
      enableHighAccuracy: true,
      timeout: 5000,
      maximumAge: 0
    };

    navigator.geolocation.getCurrentPosition(success, error, options);

    return deferred.promise();
  };

  setDistances(hotel, us, places) {
    console.log('setDistances() ...');
    console.log('\n');

    var component = this;

    // console.log('hotel.latitude: ', hotel.latitude);
    // console.log('hotel.longitude: ', hotel.longitude);
    // console.log('us.latitude: ', us.latitude);
    // console.log('us.longitude: ', us.longitude);

    _.forEach(places, function(place) {
      if(typeof place.latitude === 'number' && typeof place.latitude === 'number') {
        // calculate distance from "hotel"
        place.distanceFromHotel = component.calculateDistance(place.latitude, place.longitude, hotel.latitude, hotel.longitude);

        // calculate distance from current location
        place.distanceFromUs = component.calculateDistance(place.latitude, place.longitude, us.latitude, us.longitude);
      }
    });

    // store places in state
    component.setState({
      places: places
    });

    // console.log('places: ', places);
  };

  refreshLocationData() {
    console.log('refreshLocation() ...');
    console.log('\n');

    var component = this;

    var hotel = component.props.airbnbLocation;
    var places = component.state.places;
    
    component.getCurrentLocation().then(
      function(currentLocation) {
        var us = currentLocation;
        component.setDistances(hotel, us, places);
      },
      function(reason) {
        console.warn('component.getCurrentLocation().then error: ', reason);
      }
    );
  };

  checkIfOpen(now, today, todayMorning, yesterday, place) {
    // console.log('place.name: ', place.name);

    if(typeof place.hours === 'string') {
      // console.log('place.hours: ', place.hours);

      if(place.hours === 'Always Open') {
        // if place.hours is "Always Open" return true
        return true;
      } else {
        // if place.hours is "No Hours Data" exit out of this function
        return;
      }
    } else {
      // store moment comparison results
      var results = [];

      // for each range in ranges
      _.forEach(place.hours[today].ranges, function(range) {
        // console.log('range: ', range);

        // if now is before 5am, set day var to yesterday
        var day = now.isBefore(todayMorning) ? yesterday : today;

        var range_open = moment().set({
          'day': day,
          'hour': range[0].h,
          'minute': range[0].m || 0,
          'second': 0
        }),
        range_close = moment().set({
          'day': day,
          'hour': range[1].h,
          'minute': range[1].m || 0,
          'second': 0
        });

        // console.log('now: ' + now.format("dddd Do H:mm:ss"));
        // console.log('range_open: ' + range_open.format("dddd Do H:mm:ss"));
        // console.log('range_close: ' + range_close.format("dddd Do H:mm:ss"));
        // console.log('now.isBetween(range_open, range_close): ', now.isBetween(range_open, range_close));

        // push new moment comparison result to results var
        results.push(now.isBetween(range_open, range_close));
      });

      // console.log('results: ', results);
      
      // if(results.includes(true)) {
      //   console.log('A \'true\' was found');
      // } else {
      //   console.log('No \'true\' found.');
      // }

      // return true if place is open
      return results.includes(true);
    }
  };

  render() {
    console.log('render() ...');
    console.log('\n');

    var component = this;

    console.log('component.state: ', component.state);

    // set moment related data
    // for tomorrow var if today + 1 = 7 set tomorrow to 0 (Sunday)
    // for yesterday var if today - 1 < 0 set yesterday to 6 (Saturday)
    var now = moment(),
        today = now.day(),
        todayMorning = moment().set({
          'day': today,
          'hour': 5,
          'minute': 0,
          'second': 0
        }),
        tomorrow = today + 1 === 7 ? 0 : today + 1,
        yesterday = today - 1 < 0 ? 6 : today - 1;

    var places = component.state.places.map(function(place, i) {

      // check if place is open
      var placeIsOpen = component.checkIfOpen(now, today, todayMorning, yesterday, place);

      // console.log('placeIsOpen: ', placeIsOpen);
      // console.log('\n');

      // if a place is closed add placeIsClosed class to place
      var placeClassNames = cx(s.place, {
        [s.placeIsClosed]: !placeIsOpen
      });

      return (
        <li className={placeClassNames} key={i}>
          <h1 className={s.place__name}>{place.nameInItalian}</h1>
          <p className={s.place__address}>{place.address}</p>
          <p className={s.place__neighborhood}>{place.neighborhood}</p>
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
          {typeof place.latitude === 'string' || typeof place.longitude === 'string' ? (
            <div className="place__">
              <p>No latlong.net Data Yet</p>
            </div>
          ) : (
            <div className="place__">
              <p>distanceFromHotel: {place.distanceFromHotel} miles</p>
              <p>distanceFromUs: {place.distanceFromUs} miles</p>
            </div>
          )}
        </li>
      );
    });

    return (
      <Layout className={s.content}>
        <ul className={s.placesList}>
          {places}
        </ul>
      </Layout>
    );
  }
}

export default HomePage;
