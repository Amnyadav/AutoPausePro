chrome.tabs.onActivated.addListener(async (activeInfo) => {
    let tabs = await chrome.tabs.query({active: true, lastFocusedWindow: true});
    if (tabs[0]) {
      chrome.scripting.executeScript({
        target: {tabId: tabs[0].id},
        function: resumeVideo
      });
    }
  });
  
  chrome.windows.onFocusChanged.addListener(async (windowId) => {
    if (windowId !== chrome.windows.WINDOW_ID_NONE) {
      let tabs = await chrome.tabs.query({active: true, lastFocusedWindow: true});
      if (tabs[0]) {
        chrome.scripting.executeScript({
          target: {tabId: tabs[0].id},
          function: resumeVideo
        });
      }
    }
  });
  
  chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (tab.active && changeInfo.status === 'complete') {
      chrome.scripting.executeScript({
        target: {tabId: tabId},
        function: resumeVideo
      });
    }
  });
  
  chrome.tabs.onRemoved.addListener((tabId, removeInfo) => {
    chrome.scripting.executeScript({
      target: {tabId: tabId},
      function: pauseVideo
    });
  });
  
  chrome.windows.onFocusChanged.addListener(async (windowId) => {
    if (windowId === chrome.windows.WINDOW_ID_NONE) {
      let tabs = await chrome.tabs.query({active: true, lastFocusedWindow: true});
      if (tabs[0]) {
        chrome.scripting.executeScript({
          target: {tabId: tabs[0].id},
          function: pauseVideo
        });
      }
    }
  });
  
  function pauseVideo() {
    const video = document.querySelector('video');
    if (video && !video.paused) {
      video.pause();
    }
  }
  
  function resumeVideo() {
    const video = document.querySelector('video');
    if (video && video.paused) {
      video.play();
    }
  }
  



  chrome.tabs.onActivated.addListener(async (activeInfo) => {
    const tab = await chrome.tabs.get(activeInfo.tabId);
    if (tab.url.includes("youtube.com/watch")) {
      chrome.scripting.executeScript({
        target: { tabId: tab.id },
        files: ['content.js']
      }, () => {
        chrome.tabs.sendMessage(tab.id, { action: "resume" });
      });
    }
  });
  
  chrome.windows.onFocusChanged.addListener(async (windowId) => {
    if (windowId === chrome.windows.WINDOW_ID_NONE) return;
    const [tab] = await chrome.tabs.query({ active: true, windowId });
    if (tab && tab.url.includes("youtube.com/watch")) {
      chrome.scripting.executeScript({
        target: { tabId: tab.id },
        files: ['content.js']
      }, () => {
        chrome.tabs.sendMessage(tab.id, { action: "resume" });
      });
    }
  });
  
  chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (changeInfo.status === 'complete' && tab.url.includes("youtube.com/watch")) {
      chrome.scripting.executeScript({
        target: { tabId: tab.id },
        files: ['content.js']
      }, () => {
        chrome.tabs.sendMessage(tabId, { action: "check" });
      });
    }
  });
  