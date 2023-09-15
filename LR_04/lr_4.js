const cv = require("opencv.js");

const REAL_IMG = "./img.png";
const REAL_IMG_2 = "./img.png";
const REAL_IMG_3 = "./img.png";

let src_gray;
let thresh = 100;

const main = async () => {
  // Task 1
  const src = await cv.imread(REAL_IMG_3);
  src_gray = new cv.Mat();
  cv.cvtColor(src, src_gray, cv.COLOR_RGBA2GRAY);
  cv.blur(src_gray, src_gray, new cv.Size(3, 3));

  cv.imshow("Source", src);
  cv.waitKey();

  const source_window = "Source";
  const max_thresh = 255;
  cv.createTrackbar(
    "Canny thresh:",
    source_window,
    thresh,
    max_thresh,
    countours
  );
  countours(0, 0);
  cv.waitKey();

  // Task 2
  const mImage = await cv.imread(REAL_IMG_2);
  cv.blur(mImage, mImage, new cv.Size(5, 5));
  cv.imshow("The original image", mImage);
  cv.waitKey();

  const mMiddle = new cv.Mat();
  cv.cvtColor(mImage, mMiddle, cv.COLOR_RGBA2GRAY);
  cv.Canny(mMiddle, mMiddle, 50, 150, 3);
  const mResult = mImage.clone();

  const lines = new cv.Mat();
  cv.HoughLines(mMiddle, lines, 1, Math.PI / 180, 120, 0, 0);
  const alpha = 1000;

  for (let i = 0; i < lines.rows; i++) {
    const rho = lines.data32F[i * 2];
    const theta = lines.data32F[i * 2 + 1];
    const cs = Math.cos(theta);
    const sn = Math.sin(theta);
    const x = rho * cs;
    const y = rho * sn;
    const pt1 = new cv.Point(
      Math.round(x + alpha * -sn),
      Math.round(y + alpha * cs)
    );
    const pt2 = new cv.Point(
      Math.round(x - alpha * -sn),
      Math.round(y - alpha * cs)
    );
    cv.line(mResult, pt1, pt2, new cv.Scalar(0, 0, 255, 0), 1, cv.LINE_AA, 0);
  }

  cv.imshow("The processed image", mResult);
  cv.waitKey();

  // Task 3
  const img3 = await cv.imread(REAL_IMG_3);
  const gray = new cv.Mat();
  cv.cvtColor(img3, gray, cv.COLOR_RGBA2GRAY);
  cv.medianBlur(gray, gray, 5);
  const circles = new cv.Mat();

  cv.HoughCircles(
    gray,
    circles,
    cv.HOUGH_GRADIENT,
    2,
    gray.rows / 4,
    100,
    100,
    250,
    500
  );

  for (let i = 0; i < circles.rows; i++) {
    const c = circles.data32F[i * 3];
    const center = new cv.Point(
      circles.data32F[i * 3],
      circles.data32F[i * 3 + 1]
    );
    const radius = circles.data32F[i * 3 + 2];
    cv.circle(img3, center, 1, new cv.Scalar(0, 100, 100, 0), 3, cv.LINE_AA, 0);
    cv.circle(
      img3,
      center,
      radius,
      new cv.Scalar(255, 0, 255, 0),
      3,
      cv.LINE_AA,
      0
    );
  }

  cv.imshow("Detected circles", img3);
  cv.waitKey();
};

const countours = (val, _) => {
  const canny_output = new cv.Mat();
  cv.Canny(src_gray, canny_output, thresh, thresh * 2);
  const contours = new cv.MatVector();
  const hierarchy = new cv.Mat();

  cv.findContours(
    canny_output,
    contours,
    hierarchy,
    cv.RETR_EXTERNAL,
    cv.CHAIN_APPROX_SIMPLE
  );

  const drawing = cv.Mat.zeros(canny_output.size(), cv.CV_8UC3);
  const rng = new cv.RNG(12345);

  for (let i = 0; i < contours.size(); i++) {
    const color = new cv.Scalar(
      rng.uniform(0, 256),
      rng.uniform(0, 256),
      rng.uniform(0, 256),
      0
    );
    cv.drawContours(drawing, contours, i, color, 2, cv.LINE_8, hierarchy, 0);
  }

  cv.imshow("Contours", drawing);
};

main();
