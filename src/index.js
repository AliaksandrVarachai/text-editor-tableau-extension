import './index.html';
import React from 'react';
import ReactDOM from 'react-dom';
import uuidv4 from 'uuid/v4';

import {POST_MSG_TYPES, SETTINGS_KEY, ENVIRONMENT_MODES, POST_MSG_TYPE_NAME} from './script/constants/constants';
import Button from './script/components/ActionButton/ActionButton.js';
import './index.pcss';

// TODO: wrap with a function
if (!tableau || !tableau.extensions)
  throw Error('Your current version of Tableau does not support Extension API.');

const popupNames = {
  configTour: 'config-tour',
  startedTour: 'started-tour',
};


class App extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      openedPopupName: '',      // '' or popupNames item
      isDashBoardLoaded: false,
    };
    this.popup = null;
    this.tourId = '';

    tableau.extensions.initializeAsync({configure: this.openOrCloseConfigTourPopup}).then(this.onDashboardLoad);

    window.onbeforeunload = (event) => {
      if (this.popup)
        this.closePopup();
    }
  }

  openPopup = (popupName) => {
    const configWindowOptions = {
      width: Math.floor(window.outerWidth / 3),
      height: Math.floor(window.outerHeight / 2),
      left: 0,
      top: 0,
      menubar: 0,
      toolbar: 0,
      location: 1,
      status: 1,
      // centerscreen: 'yes',
      // chrome: 'yes',
      // alwaysRaised: 'yes',
    };
    const stringConfigWindowOptions = Object.keys(configWindowOptions).map(key => `${key}=${configWindowOptions[key]}`).join(',');

    switch(popupName) {
      case popupNames.configTour:
        this.popup = window.open('/config-tour.html', 'Popup', stringConfigWindowOptions);
        break;
      case popupNames.startedTour:
        this.popup = window.open('/started-tour.html', 'Popup', stringConfigWindowOptions);
        break;
      default:
        // throw Error(`Unknown popup name "${popupName}" is provided.`);
    }
    this.setState({
      openedPopupName: popupName
    });

    window.onmessage = (eventMsg) => {
      const data = eventMsg.data;
      if (!data || !data[POST_MSG_TYPE_NAME]) {
        console.warn('Post message has undefined type.');
        return;
      }
      switch (data[POST_MSG_TYPE_NAME]) {
        case POST_MSG_TYPES.popupIsOpened:
          this.popup.postMessage({
            [POST_MSG_TYPE_NAME]: POST_MSG_TYPES.tourIdPassed,
            id: this.tourId,
          }, location.origin);
          break;
        case POST_MSG_TYPES.popupIsClosed:
          this.setState({
            openedPopupName: ''
          });
          this.popup = null;
          break;
        default:
          console.warn(`Unhandled message with "${eventMsg.data[POST_MSG_TYPE_NAME]}" type.`);
      }
    };
  };

  openOrCloseConfigTourPopup = (event) => {
    if (this.popup) {
      this.closePopup();
    } else {
      this.openPopup(popupNames.configTour);
    }
  };

  openOrCloseStartedTourPopup = (event) => {
    if (this.popup) {
      this.closePopup();
    } else {
      this.openPopup(popupNames.startedTour);
    }
  };

  closePopup = () => {
    this.popup.close();
    this.popup = null;
  };

  onDashboardLoad = () => {
    var environmentMode = tableau.extensions.environment.mode;
    this.setState({
      environmentMode,
      isDashBoardLoaded: true
    });

    var settings = tableau.extensions.settings;
    var dashboardSettings = settings.getAll();
    if (dashboardSettings.hasOwnProperty(SETTINGS_KEY)) {
      // Both for Authoring and Viewing modes
      this.tourId = dashboardSettings[SETTINGS_KEY];
      console.log(`Bound tour [${this.tourId}] if found.`);
    } else {
      if (environmentMode === ENVIRONMENT_MODES.authoring) {
        // Authoring mode
        this.tourId = uuidv4();
        settings.set(SETTINGS_KEY, this.tourId);
        settings.saveAsync()
          .then(result => {
            console.log(`Generated tour ID [${this.tourId}] is saved successfully`);
          })
          .catch(err => {
            if (process.env.NODE_ENV === 'development')
              console.log(err);
            console.log('Impossible to save custom settings');
          });
      } else {
        // Viewing mode
        console.log('There is no tour embedded into the dashboard. Switch to the authoring mode to add a new tour.');
        // tableau.extensions.ui.displayDialogAsync(url)
      }
    }
  };

  componentWillUnmount = () => {
    if (this.popup)
      this.closePopup();
  };

  render() {
    const { environmentMode, openedPopupName } = this.state;
    const isOpenedConfigTourPopup = openedPopupName === popupNames.configTour;
    const isOpenedStartedTourPopup = openedPopupName === popupNames.startedTour;

    // TODO: disable buttons until environmentMode is not defined
    return (
      <>
        {/* Config tour button */}
        <Button
          title={isOpenedConfigTourPopup ? 'Close Config' : 'Config Tour'}
          mode={{
            hidden: environmentMode !== ENVIRONMENT_MODES.authoring,
            disabled: !!openedPopupName && !isOpenedConfigTourPopup
          }}
          onClick={this.openOrCloseConfigTourPopup}
        />

        {/* Start tour button */}
        <Button
          title={isOpenedStartedTourPopup ? 'Close Tour' : 'Start Tour'}
          mode={{
            disabled: !!openedPopupName && !isOpenedStartedTourPopup
          }}
          onClick={this.openOrCloseStartedTourPopup}
        />
      </>
    );
  }
}

ReactDOM.render(
  <App />,
  document.getElementById('root')
);
