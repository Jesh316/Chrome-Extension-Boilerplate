// Create context menu on install
chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "checkImage",
    title: "Check if image is AI-generated",
    contexts: ["image"],
  });
});

// Handle context menu clicks
chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === "checkImage") {
    const imageUrl = info.srcUrl;
    
    // Send to content script for processing
    chrome.tabs.sendMessage(tab.id, {
      type: "ANALYZE_IMAGE",
      payload: { imageUrl }
    });
  }
});

// Handle messages from content script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === "ANALYZE_IMAGE") {
    const imageUrl = request.payload.imageUrl;
    checkImage(imageUrl, sender.tab, sendResponse);
    return true; // Keep message channel open
  }
});

function checkImage(imageUrl, tab, sendResponse) {
  if (!imageUrl.startsWith('http')) {
    console.warn('Invalid image URL:', imageUrl);
    sendResponse({ result: null, isAIGenerated: false });
    return;
  }

  fetch(imageUrl)
    .then(response => response.blob())
    .then(blob => {
      const formData = new FormData();
      formData.append("file", blob, "image.jpg");

      return fetch("http://localhost:5000/upload_ext", {
        method: 'POST',
        body: formData,
      });
    })
    .then(response => response.json())
    .then(data => {
      const score = data.score;
      const message = score >= 0.5 ? "AI-Generated" : "Not AI-Generated";
      const isAIGenerated = score >= 0.7;

      // Send result back to content script
      sendResponse({ result: message, isAIGenerated });

      // Optional: Show notification for AI images
      if (isAIGenerated) {
        chrome.notifications.create({
          type: "basic",
          iconUrl: "assets/icon128.png",
          title: "AI Detection Result",
          message: message
        });
      }
    })
    .catch(error => {
      console.error("Error analyzing image:", error);
      sendResponse({ result: null, isAIGenerated: false });
    });
}