const axios = require('axios');

const YEXT_API_KEY = process.env.YEXT_API_KEY;

module.exports = {
  createSite,
  createSubaccount,
  fetchSites,
  fetchAccounts,
  createRepository,
  deleteSite,
  summarizeResponses
};

// Creates sub-account in your account structure
async function createSubaccount(accountId, subAccountId, subAccountName, subAccountCountryCode) {
  const url = `https://api.yext.com/v2/accounts/me/createsubaccount?v=20230714&api_key=${YEXT_API_KEY}`;

  const body = {
          newSubAccountId: `${subAccountId}`,
          newSubAccountName: `${subAccountName}`,
          countryCode: `${subAccountCountryCode}`
  };

  try {
    const response = await axios.post(url, body);

    // Optionally, you can check for specific HTTP status codes here
    // if (!response.status === 200) {
    //   throw new Error(`Failed with status ${response.status}: ${response.statusText}`);
    // }
    return { success: true, data: `Success | ${accountId}`, yextResponse: {response} };
  } catch (error) {
    console.error('Error while making POST API request:', error.message);
    return { success: false, error: `Error | ${accountId} | ${error.message}`, yextResponse: {response} };
  }
}


// Fetches all accounts in your account-structure.
// Refer to https://hitchhikers.yext.com/docs/managementapis/agreements/accounts/#operation/listAccounts for documentation.
async function fetchAccounts() {
  try {
        const resultsPerPage = 100;
        let offset = 0;
        let totalObjects = [];
        let responseCount = 0;
        
    const baseUrl = 'https://api.yext.com/v2/accounts?v=20230714';
    // Make API requests with pagination until all accounts are fetched
    do {
      const apiUrl = `${baseUrl}&api_key=${YEXT_API_KEY}&offset=${offset}`;

      const response = await axios.get(apiUrl);
      const objects = response.data.response.accounts || [];

      totalObjects.push(...objects);
      responseCount = objects.length;
      offset += resultsPerPage;
    } while (responseCount === resultsPerPage);

    console.log("Fetched " +  totalObjects.length + " sub-accounts.");
    return totalObjects;
  } catch (error) {
    console.error('Error while fetching accounts:', error.message);
    throw error;
  }
}

// Fetches all sites in your account-structure.
async function fetchSites() {
  try {
      const resultsPerPage = 100;
      let pageToken = '';
      let totalSites = [];
      let responseCount = 0;
  
      // Make API requests with pagination until all sites are fetched
      do {
        const apiUrl = `https://api.yext.com/v2/accounts/all/sites?v=20230714&api_key=${YEXT_API_KEY}${pageToken ? `&pageToken=${pageToken}` : ''}`;
  
        const response = await axios.get(apiUrl);
        const sites = response.data.response.sites || [];
  
        totalSites.push(...sites);
        responseCount = sites.length;
        pageToken = response.data.meta.pagination.pageToken;
      } while (responseCount === resultsPerPage);
      
      console.log("Fetched " + totalSites.length + " sites.");
      return totalSites;
    } catch (error) {
      console.error('Error while fetching sites:', error.message);
      throw error;
    }
  }


// Creates a GitHub repository object in a Yext account
async function createRepository(accountId, repoId, repoUrl) {
  const postUrl = `https://api.yext.com/v2/accounts/${accountId}/config/resources/pages/repository?v=20230714&api_key=${YEXT_API_KEY}`; 

    // const body = {
    //     "$id": "basic-starter-repo-applied-via-api",
    //     "$schema": "https://schema.yext.com/config/pages/repository/v1",
    //     "repoUrl": "https://github.com/lymarrie/reseller-starter"
    // };
    const body = {
      "$id": repoId,
      "$schema": "https://schema.yext.com/config/pages/repository/v1",
      "repoUrl": repoUrl
    };

  try {
      const response = await axios.post(postUrl, body);
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: `Error | ${accountId} | ${error.message}`, data: response.data };
  }
};

// Creates a site in a Yext account
async function createSite(accountId, body) {
    const apiUrl = `https://api.yext.com/v2/accounts/${accountId}/config/resources/pages/yextsite-config?v=20230414&api_key=${YEXT_API_KEY}`;
    
    try {
        const start = Date.now();
        const response = await axios.post(apiUrl, body);
        const end = Date.now();
        const duration = end - start;
        return { success: true, data: response.data };
      } catch (error) {
        return { success: false, error: `Error | ${accountId} | ${error.message}`, data: response.data };
    }
};

  // Deletes a site from a Yext account.
async function deleteSite(accountId, siteId) {
    const url = `https://api.yext.com/v2/accounts/${accountId}/config/resources/pages/yextsite-config/${siteId}?v=20230414&api_key=${YEXT_API_KEY}`;

  
    try {
        const start = Date.now();
        const response = await axios.delete(url);
        const end = Date.now();
        const duration = end - start;
      return { success: true, data: `Deletion Success | ${siteId} | ${accountId} | ${response.data}`, duration: `${duration} ms` };
    } catch (error) {
      return { success: false, error: `Deletion Error | ${siteId} | ${accountId} | ${error.message}`, duration: `${duration} ms` };
    }
};

  // Given a set of API responses, returns total count of successes vs. failures
  function summarizeResponses(responses) {
    let successfulRequests = 0;
    let failedRequests = 0;
  
    responses.forEach((response) => {
      if (response.status >= 200 && response.status < 300) {
        successfulRequests++;
      } else {
        failedRequests++;
      }
    });
  
    return {
      successful: successfulRequests,
      failed: failedRequests,
    };
  }
  

