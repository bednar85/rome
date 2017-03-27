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
import cx from 'classnames';
import s from './PlacesList.css';

import moment from 'moment';

class PlacesList extends React.Component {
  // constructor(props) {
  //   super(props);
  //   this.state = {
  //     places: []
  //   };
  // };

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

    console.log('component.props.places: ', component.props.places);

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

    var places = component.props.places.map(function(place, i) {
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
        </li>
      );
    });

    return (
      <div className={s.places}>
        {places}
      </div>
    );
  }

}

export default PlacesList;
