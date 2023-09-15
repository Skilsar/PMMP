let video, cap, isVideoPlaying;

function onOpenCvReady() {
   video = document.getElementById('video');
   isVideoPlaying = false;
   stopButton = document.getElementById('stopButton');

   stopButton.addEventListener('click', stopVideo);

   if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices
         .getUserMedia({ video: true })
         .then(function (stream) {
            video.srcObject = stream;
            cap = new cv.VideoCapture(video);
            startVideoProcessing();
         })
         .catch(function (error) {
            console.error('getUserMedia error:', error);
         });
   }
}

function startVideoProcessing() {
   if (!isVideoPlaying) {
      isVideoPlaying = true;
      processVideo();
   }
}

function startVideo() {
   isVideoPlaying = true;
   startButton.disabled = true;
   stopButton.disabled = false;
   recordedChunks = [];

   mediaRecorder = new MediaRecorder(video.srcObject);
   mediaRecorder.ondataavailable = handleDataAvailable;
   mediaRecorder.start();
}

function stopVideo() {
   isVideoPlaying = false;
   video.pause();
}

function processVideo() {

   if (!isVideoPlaying) {
      return;
   }

   const frame = new cv.Mat(video.height, video.width, cv.CV_8UC4);
   cap.read(frame);

   // Примените операторы Собеля, Лапласа и Кэнни
   const gray = new cv.Mat();
   cv.cvtColor(frame, gray, cv.COLOR_RGBA2GRAY);

   const sobel = new cv.Mat();
   cv.Sobel(gray, sobel, cv.CV_8U, 1, 1, 5, 3, 0, cv.BORDER_DEFAULT);

   cv.imshow('sobel__output', sobel);

   const laplacian = new cv.Mat();
   cv.Laplacian(gray, laplacian, cv.CV_8U, 3, 2, 1, cv.BORDER_DEFAULT);

   cv.imshow('laplass__output', laplacian);

   const edges = new cv.Mat();
   const finalEdges = new cv.Mat();
   cv.blur(gray, edges, new cv.Size(1, 1));
   cv.Canny(edges, finalEdges, 10, 200, 3, false);

   cv.imshow('canny_output', finalEdges);

   // Вывести изображение на canvas

   // Освободите память
   frame.delete();
   gray.delete();
   sobel.delete();
   laplacian.delete();
   edges.delete();

   requestAnimationFrame(processVideo);
}
