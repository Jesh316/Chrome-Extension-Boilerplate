// Handle messages from background script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === 'ANALYZE_IMAGE') {
    const imageUrl = request.payload.imageUrl;
    
    // Forward to background for analysis and wait for response
    chrome.runtime.sendMessage({
      type: "ANALYZE_IMAGE",
      payload: { imageUrl }
    }, (response) => {
      if (response && response.result) {
        displayOverlay(imageUrl, response.result);
      }
      sendResponse(); // Acknowledge message
    });
    
    return true; // Keep message channel open
  }
});

function displayOverlay(imageUrl, message) {
  const images = document.querySelectorAll(`img[src="${imageUrl}"]`);
  
  images.forEach((img) => {
    // Remove existing overlay
    const existingOverlay = img.parentElement.querySelector('.ai-detection-overlay');
    if (existingOverlay) existingOverlay.remove();

    // Create overlay
    const overlay = document.createElement('div');
    overlay.className = 'ai-detection-overlay';
    overlay.textContent = message;
    
    // CENTERED POSITIONING
    overlay.style.position = 'absolute';
    overlay.style.top = '50%';
    overlay.style.left = '50%';
    overlay.style.transform = 'translate(-50%, -50%)';
    
    // STYLING (customize these as needed)
    overlay.style.padding = '10px 20px';
    overlay.style.fontSize = '18px';
    overlay.style.fontWeight = 'bold';
    overlay.style.borderRadius = '8px';
    overlay.style.zIndex = '9999';
    overlay.style.pointerEvents = 'none';
    overlay.style.textAlign = 'center';
    overlay.style.minWidth = '40%'; // Prevents too narrow on small images
    
    // Dynamic colors
    if (message === "AI-Generated") {
      overlay.style.backgroundColor = 'rgba(255, 50, 50, 0.85)';
      overlay.style.color = 'white';
      overlay.style.textShadow = '1px 1px 3px #000';
    } else {
      overlay.style.backgroundColor = 'rgba(50, 200, 50, 0.85)';
      overlay.style.color = 'black';
    }

    // Ensure parent can contain the overlay
    if (window.getComputedStyle(img.parentElement).position === 'static') {
      img.parentElement.style.position = 'relative';
    }

    img.parentElement.appendChild(overlay);
  });
}