import './index.html';
import React from 'react';
import ReactDOM from 'react-dom';
import uuidv4 from 'uuid/v4';

import { POP_IS_CLOSED, SETTINGS_KEY } from './script/constants/constants';
import Button from './script/components/ActionButton/ActionButton.js';
import './index.pcss';

// TODO: wrap with a function
if (!tableau || !tableau.extensions)
  throw Error('Your current version of Tableau does not support Extension API.');

const popupNames = {
  configTour: 'config-tour',
  startedTour: 'started-tour',
};

const environmentModes = {
  authoring: 'authoring',
  viewing: 'viewing',
};


class App extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      openedPopupName: '',      // '' or popupNames item
      isDashBoardLoaded: false,
    };
    this.popup = null;

    tableau.extensions.initializeAsync({configure: this.openOrCloseConfigTourPopup}).then(this.onDashboardLoad);

    window.onunload = (event) => {
      if (!this.popup)
        return;
      this.closePopup();
    }
  }

  openPopup = (popupName) => {
    const configWindowWidth = Math.floor(window.outerWidth / 2);
    const configWindowHeight = Math.floor(window.outerHeight / 2);
    const configWindowOptions = {
      width: configWindowWidth + 'px',
      height: configWindowHeight + 'px',
      left: Math.floor((window.outerWidth - configWindowWidth) / 2) + 'px',
      top: Math.floor((window.outerHeight - configWindowHeight) / 2) + 'px',
      menubar: 'no',
      status: 'yes',
      centerscreen: 'yes',
      chrome: 'yes',
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
        throw Error(`Unknown popup name "${popupName}" is provided.`);
    }
    this.setState({
      openedPopupName: popupName
    });

    this.popup.onmessage = (eventMsg) => {
      if (eventMsg.data === POP_IS_CLOSED) {
        this.setState({
          openedPopupName: ''
        });
        this.popup = null;
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
    console.log(dashboardSettings);
    if (dashboardSettings.hasOwnProperty(SETTINGS_KEY)) {
      // Both for Authoring and Viewing modes
      console.log('found:', dashboardSettings[SETTINGS_KEY]);
    } else {
      if (environmentMode === environmentModes.authoring) {
        // Authoring mode
        var tourUuid = uuidv4();
        settings.set(SETTINGS_KEY, tourUuid);
        settings.saveAsync()
          .then(result => {
            console.log('Settings are saved', result);
            //return fetch('serverUrl', options);
          })
          .catch(error => {
            throw error;
          });
        console.log('generated:', tourUuid);
      } else {
        // Viewing mode
        console.log('There is no tour embedded into the dashboard. Switch to the authoring mode to add a new tour.');
        // tableau.extensions.ui.displayDialogAsync(url)
      }
    }
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
            hidden: environmentMode !== environmentModes.authoring,
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
