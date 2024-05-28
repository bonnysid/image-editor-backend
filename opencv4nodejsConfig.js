const path = require('path');

const opencvInclude = path.resolve(
  __dirname,
  'C:/opencv/build/include'
);

const opencvLibDir = path.resolve(
  __dirname,
  'C:/opencv/build/x64/vc16/lib'
);

const opencvBinDir = path.resolve(
  __dirname,
  'C:/opencv/build/x64/vc16/bin'
);

process.env.OPENCV4NODEJS_DISABLE_AUTOBUILD = 1;
process.env.OPENCV_INCLUDE_DIR = opencvInclude;
process.env.OPENCV_LIB_DIR = opencvLibDir;
process.env.OPENCV_BIN_DIR = opencvBinDir;

module.exports = {
  OPENCV4NODEJS_DISABLE_AUTOBUILD: 1,
  OPENCV_INCLUDE_DIR: opencvInclude,
  OPENCV_LIB_DIR: opencvLibDir,
  OPENCV_BIN_DIR: opencvBinDir,
};
