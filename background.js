// Listen for messages from the popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.tellMeMore) {
    tellMeMore(request.tellMeMore);
  }
});

async function tellMeMore(text) {

  // Log the selected text to the console
  console.log('Selected Text:', text);

  let openAIKey = await new Promise((resolve) => {
    chrome.storage.local.get("openAIKey", (result) => {
      resolve(result.openAIKey);
    });
  });

  let messages = [
    { "role": "system", content: "You are an encyclopedia of knowledge with all relevant information available to you at all times." },
    { "role": "user", content: `Digest ${text} and provide relevant and non-redundant information on this topic.`}
  ];

  let response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${openAIKey}`
    },
    body: JSON.stringify({
      "model": "gpt-3.5-turbo",
      "messages": messages,
      "max_tokens": 500
    })
  });

  let result = await response.json();

  // Set the right response in the box if there is an error
  if (!response.ok) {
    // If the response status is not 200, the API call failed.
    console.log('Error: ', response.status);

    let errorMessage;
    if (response.status === 401) {
      errorMessage = "Error: Invalid API key.";
    } else if (response.status === 429) {
      errorMessage = "Error: Too many requests. Please try again later.";
    } else {
      errorMessage = `Error: Unexpected error occurred. Status Code: ${response.status}`;
    }
  
    // Send the error message back to the popup
    chrome.runtime.sendMessage({tellMeMoreResult: errorMessage});
    return;
  }

  // Extract the model's response from the result
  let modelResponse = result['choices'][0]['message']['content'];

  // Log the model's response to the console
  console.log('Model Response:', modelResponse);
  //console.log("Response object:",response);
  //console.log("Response data:",result);  

  // Send the result back to the popup
  chrome.runtime.sendMessage({tellMeMoreResult: modelResponse});
}
