// popup.js

document.addEventListener('DOMContentLoaded', () => {
  // Listen for messages from background.js
  chrome.runtime.onMessage.addListener((message) => {
      if (message.type === 'RESULT') {
          // Display the analysis result in the 'result' div
          const resultDiv = document.getElementById('result');
          if (resultDiv) {
              resultDiv.innerText = message.content;  // Show the analysis result
          } else {
              console.error("Element 'result' not found in popup.html.");
          }
      }
  });

  // Update instructions if the element exists
  const instructions = document.getElementById('instructions');
  if (instructions) {
      instructions.innerText = "Right-click an image, then select 'Check if image is AI-generated'.";
  } else {
      console.error("Element 'instructions' not found in popup.html.");
  }
});
