const video = document.querySelector('.player');
const canvas = document.querySelector('.photo');
const ctx = canvas.getContext('2d');
const strip = document.querySelector('.strip');
const snap = document.querySelector('.snap');

function getVideo() {
    navigator.mediaDevices.getUserMedia({video: true, audio: false})
    .then(localMediaStream => {
        console.log(localMediaStream);
        video.src = window.URL.createObjectURL(localMediaStream);
        video.play();
    })
    .catch(err => {
        console.error('No', err)
    })
}

function paintToCanvas() {
    const width = video.videoWidth
    const height = video.videoHeight
    
    canvas.width = width
    canvas.height = height
    
    setInterval(() => {
        ctx.drawImage(video, 0, 0, width, height)
        //Take the pixels out
        let pixels = ctx.getImageData(0, 0, width, height)
        //Do something with them
        // pixels = redEffect(pixels)

        // pixels = rgbSplit(pixels)
        // ctx.globalAlpha = 0.1

        pixels = greenScreen(pixels)
        //Put them back
        ctx.putImageData(pixels, 0, 0)
    }, 16)
}

function takePhoto() {
    //Play sound
    snap.currentTime = 0
    snap.play()

    //Take data out of the canvas
    const data = canvas.toDataURL('image/jpeg')
    const link = document.createElement('a')

    link.href = data
    link.setAttribute('download', 'prettyBoy')
    link.innerHTML = `<img src="${data}" alt="Click to see a pretty boy" />`

    strip.insertBefore(link, strip.firstChild)
}

function redEffect(pixels) {
    for (let i = 0; i < pixels.data.length; i += 4) {
        pixels.data[i + 0] = pixels.data[i + 0] + 50 //red
        pixels.data[i + 1] = pixels.data[i + 1] - 50 //green
        pixels.data[i + 2] = pixels.data[i + 2] * 0.5 //blue
    }
    return pixels
}

function rgbSplit(pixels) {
    for (let i = 0; i < pixels.data.length; i += 4) {
        pixels.data[i - 150] = pixels.data[i + 0] //red
        pixels.data[i + 500] = pixels.data[i + 1] //green
        pixels.data[i + 550] = pixels.data[i + 2] //blue
    }
    return pixels
}

function greenScreen(pixels) {
    const levels = {};

  document.querySelectorAll('.rgb input').forEach((input) => {
    levels[input.name] = input.value;
  });

  for (i = 0; i < pixels.data.length; i = i + 4) {
    red = pixels.data[i + 0];
    green = pixels.data[i + 1];
    blue = pixels.data[i + 2];
    alpha = pixels.data[i + 3];

    if (red >= levels.rmin
      && green >= levels.gmin
      && blue >= levels.bmin
      && red <= levels.rmax
      && green <= levels.gmax
      && blue <= levels.bmax) {
      // take it out!
      pixels.data[i + 3] = 0;
    }
  }

  return pixels;
} 

getVideo();

video.addEventListener('canplay', paintToCanvas)
