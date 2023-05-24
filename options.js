// Load the OpenAI key from storage
chrome.storage.local.get("openAIKey", (result) => {
    document.getElementById("openAIKey").value = result.openAIKey || "";
  });
  
  // Save the OpenAI key to storage when the save button is clicked
  document.getElementById("saveButton").onclick = () => {
    let openAIKey = document.getElementById("openAIKey").value;
    chrome.storage.local.set({openAIKey: openAIKey});
  };
  