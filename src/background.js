console.log("Hello, this is background.js and it is working!");

chrome.runtime.onInstalled.addListener(() => {
  console.log("Extension installed and background script is running.");
});
