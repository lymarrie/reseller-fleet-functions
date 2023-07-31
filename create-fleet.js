const axios = require('axios');

async function sendAPIRequests() {
  const requests = [];

  for (let i = 0; i < 1000; i++) {
    const url = `https://api.yext.com/v2/accounts/luc-reseller-test/createsubaccount?v=20230714&api_key=${YEXT_API_KEY}`;

    const requestBody = {
            newSubAccountId: `created-via-api-${i}`,
            newSubAccountName: `Created Via API ${i}`,
            countryCode: `US`
    };

    // Create a request promise but do not execute it yet
    const requestPromise = axios.post(url, requestBody)
      .then(response => {
        // Process the API response here if needed
        return response.data;
      })
      .catch(error => {
        // Handle any errors that occurred during the API request
        console.error(`Error while making API request ${i}:`, error.message);
        return null; // You can return some default value or rethrow the error
      });

    requests.push(requestPromise);
  }

  try {
    // Execute all the requests in parallel and wait for all to finish
    const responses = await Promise.all(requests);
    return responses;
  } catch (error) {
    console.error('Error while making API requests:', error.message);
    return null; // You can return an empty array or handle the error as needed
  }
}

// Example usage:
sendAPIRequests()
  .then(responses => {
    // Handle the API responses here
    console.log(responses);
  })
  .catch(error => {
    console.error('Something went wrong:', error.message);
  });
