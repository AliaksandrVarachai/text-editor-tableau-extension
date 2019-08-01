import './index.html';

tableau.extensions.initializeAsync({configure: onConfigure}).then(onDashboardLoad);

const configWindowWidth = window.outerWidth / 2;
const configWindowHeight = window.outerHeight / 2;

const configWindowOptions = {
  width: configWindowWidth + 'px',
  height: configWindowHeight + 'px',
  left: (window.outerWidth - configWindowWidth) / 2 + 'px',
  top: (window.outerHeight - configWindowHeight) / 2 + 'px',
  menubar: 'no',
  status: 'yes',
  // alwaysRaised: 'yes',
};

const stringConfigWindowOptions = Object.keys(configWindowOptions).map(key => `${key}=${configWindowOptions[key]}`).join(',');
console.log(stringConfigWindowOptions);
function onConfigure() {
  const configProxy = window.open('/config.html', 'Configure', stringConfigWindowOptions);
  // TODO: disable until closing the child config window
}

function onDashboardLoad() {}
