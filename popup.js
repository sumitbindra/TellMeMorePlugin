let selectedText;

// Fetch the currently selected text as soon as the script loads
chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
  chrome.scripting.executeScript({
    target: {tabId: tabs[0].id},
    function: () => window.getSelection().toString(),
  }).then((selection) => {
    selectedText = selection[0].result;
    if (selectedText) {
      document.getElementById("tellMeMoreResult").innerText = selectedText;
    }
  }).catch((error) => {
    console.error("Failed to execute script: " + error.message);
  });
});

document.getElementById("tellMeMoreButton").onclick = () => {
  // Only send the message if text has been selected
  if (selectedText) {
    // Change the button text and add the processing class
    let tellMeMoreButton = document.getElementById("tellMeMoreButton");
    tellMeMoreButton.innerText = "Processing...";
    tellMeMoreButton.classList.add("processing");

    // Send the message
    chrome.runtime.sendMessage({tellMeMore: selectedText});
  }
};

document.getElementById("dismissButton").onclick = () => {
  window.close();
};

// Listen for messages from the background script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.tellMeMoreResult) {
    // Reset the button text and remove the processing class
    let tellMeMoreButton = document.getElementById("tellMeMoreButton");
    tellMeMoreButton.innerText = "Tell Me More";
    tellMeMoreButton.classList.remove("processing");

    // Update the selected text
    document.getElementById("tellMeMoreResult").innerText = request.tellMeMoreResult;
  }
});
