require('./opencv4nodejsConfig');
const { execSync } = require('child_process');

try {
  execSync('npm install opencv4nodejs', { stdio: 'inherit' });
  console.log('opencv4nodejs installed successfully.');
} catch (error) {
  console.error('Failed to install opencv4nodejs:', error);
}
