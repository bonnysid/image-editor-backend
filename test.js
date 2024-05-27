const cv = require('opencv4nodejs');
console.log(cv)
const mat = new cv.Mat(5, 5, cv.CV_8UC3, new cv.Vec(0, 255, 0));
cv.imshow('Green Mat', mat);
cv.waitKey();
