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
import FilterBar from '../../components/FilterBar';
import cx from 'classnames';
import s from './PlacesList.css';

import _ from 'lodash';
import moment from 'moment';

class PlacesList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      filterBarSelections: {}
    };
  }

  filterData(collection) {
    console.log('filterData');

    function convertArray(input) {
        var output = [];

        _.forEach(input, function(value) {
          output.push(Number(value));
        });

        return output;
    }

    var inputData = collection;
    var outputData = inputData;
    var filterBar = this.state.filterBarSelections;
    var sortBy = filterBar.sortBy;

    // convert each array of strings to arrays of numbers
    var recommendedLevel = convertArray(filterBar.recommendedLevel);
    var interestLevel = convertArray(filterBar.interestLevel);
    var priceRange = convertArray(filterBar.priceRange);

    // Filter by Category
    // ...

    // Filter by Recommendation Level
    // ...
    outputData = _.filter(outputData, function(place) {
      if(typeof place.recommendedLevel === 'string') {
        return true;
      } else if(typeof place.recommendedLevel === 'number') {
        return recommendedLevel.includes(place.recommendedLevel);
      }
    });

    // console.log('outputData (after recommendedLevel filter): ', outputData);

    // Filter by Interest
    // filter data when interestLevel is less than or equal to selected price
    outputData = _.filter(outputData, function(place) {
      if(typeof place.ryanInterestLevel === 'string') {
        return true;
      } else if(typeof place.ryanInterestLevel === 'number') {
        return interestLevel.includes(place.ryanInterestLevel);
      }
    });

    // console.log('outputData (after ryanInterestLevel filter): ', outputData);

    // Filter by Price
    // if place.priceRange is in priceRange array or if place.priceRange is "" include place in outputData
    outputData = _.filter(outputData, function(place) {
      if(typeof place.priceRange === 'string') {
        return true;
      } else if(typeof place.priceRange === 'number') {
        return priceRange.includes(place.priceRange);
      }
    });

    // console.log('outputData (after priceRange filter): ', outputData);

    // Filter by Distance
    // if place.distanceFromUs is less than or equal to filterBar.distance include place in outputData
    outputData = _.filter(outputData, function(place) {
        // !IMPORTANT need to change this so it is always using the distanceFromUs
        return place.distanceFromHotel <= filterBar.distance;
    });

    // console.log('outputData (after distanceFromHotel filter): ', outputData);
    // console.log('output data: ', _.map(_.sortBy(outputData, sortBy)));

    // Sort Output
    var outputData = _.map(_.sortBy(outputData, sortBy));

    // Return
    if(filterBar.sortBy === 'percentRecommended' || filterBar.sortBy === 'ryanInterestLevel') {
      return _.reverse(outputData);
    } else {
      return outputData;
    }
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
  }

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
  }








  render() {
    console.log('render() ...');
    console.log('\n');

    var component = this;

    // if filterBarSelections isn't populated yet, use the unfiltered data
    var data = _.isEmpty(component.state.filterBarSelections) ? component.props.places : component.filterData(component.props.places) 

    // if open now is set in filter bar show only the locations that are open now otherwise show the entire list, display locations that are closed as more transparent/dim
    var placesOpenNow = component.state.filterBarSelections.openNow === 'true' ? true : false;
    var placesClassNames = cx(s.places, {
      [s.placesOpenNow]: placesOpenNow
    });

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

    var places = data.map(function(place, i) {
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
          <p>percentRecommended: {place.percentRecommended}</p>
          <p>recommendedLevel: {place.recommendedLevel}</p>
          <p>ryanInterestLevel: {place.ryanInterestLevel}</p>
          <p>priceRange: {place.priceRange}</p>
        </li>
      );
    });

    return (
      <div>
        <FilterBar callbackParent={this.onChildChanged.bind(this)} />
        <ul className={placesClassNames}>
          {places}
        </ul>
      </div>
    );
  }
}

export default PlacesList;
