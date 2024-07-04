const video = document.querySelector('video');

if (video) {
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      video.pause();
    } else {
      video.play();
    }
  });
}



let isPaused = false;

function pauseVideo() {
  const video = document.querySelector('video');
  if (video && !video.paused) {
    video.pause();
    isPaused = true;
  }
}

function resumeVideo() {
  const video = document.querySelector('video');
  if (video && isPaused) {
    video.play();
    isPaused = false;
  }
}

chrome.runtime.onMessage.addListener((request) => {
  if (request.action === 'resume') {
    resumeVideo();
  } else if (request.action === 'check') {
    const video = document.querySelector('video');
    if (video && video.paused) {
      isPaused = true;
    }
  }
});

window.addEventListener('blur', pauseVideo);
