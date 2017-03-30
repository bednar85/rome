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
// import FilterBar from '../../components/FilterBar';
import PlacesList from '../../components/PlacesList';
import s from './styles.css';
import { title, html } from './index.md';

import $ from 'jquery';
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
      places: googleSheetsData
    };
  }

  init() {
    console.log('init() ...');
    console.log('\n');

    var component = this;

    component.getData();
  }

  componentWillMount() {
    console.log('componentWillMount() ...');
    console.log('\n');

    var component = this;

    component.init();

    // attach helper method to Number prototype
    Number.prototype.toRad = function() {
      return this * Math.PI / 180;
    };
  }

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

    component.refreshLocationData();
  }

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
  }

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
  }

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

        // console.log('Name: ', place.nameInItalian);
        // console.log('Distance From Hotel: ', place.distanceFromHotel);
        // console.log('Distance From Us: ', place.distanceFromUs);
        // console.log('\n');
      }
    });

    // store places in state
    component.setState({
      places: places
    });

    // console.log('places: ', places);
  }

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
  }
































  render() {
    console.log('render() ...');
    console.log('\n');

    var component = this;

    // console.log('component.state: ', component.state);

    return (
      <Layout className={s.content}>
        <PlacesList places={component.state.places} />
      </Layout>
    );
  }
}

export default HomePage;
