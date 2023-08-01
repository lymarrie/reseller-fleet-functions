const axios = require('axios');
require('dotenv').config();

module.exports = {
  createSite,
  createSubaccount,
  fetchSites,
  fetchAccounts,
  createRepository,
  deleteSite,
  summarizeResponses
};

const YEXT_API_KEY = process.env.YEXT_API_KEY;

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
};


// Fetches all accounts in your account-structure.
// Refer to https://hitchhikers.yext.com/docs/managementapis/agreements/accounts/#operation/listAccounts for documentation.
async function fetchAccounts() {
  try {
    const start = Date.now();
    const resultsPerPage = 100;
    let offset = 0;
    let totalAccounts = [];
    let responseCount = 0;
      
    // Make API requests with pagination until all accounts are fetched
    do {
      const apiUrl = `https://api.yext.com/v2/accounts?v=20230714&api_key=${YEXT_API_KEY}&offset=${offset}`;

      const response = await axios.get(apiUrl);
      const accounts = response.data.response.accounts || [];

      totalAccounts.push(...accounts);
      responseCount = accounts.length;
      offset += resultsPerPage;
    } while (responseCount === resultsPerPage);

    const end = Date.now();
    const duration = end - start;

    return {
      success: true,
      uuid: response.data.meta.uuid,
      totalAccounts: totalAccounts,
      duration: `${duration} ms`
    };
  } catch (error) {
      return { 
        success: false,
        uuid: error.response.data.meta.uuid,
        statusCode: error.response.status,
        errorMessage: error.response.data.meta.errors[0],
        duration: `${duration} ms`
      };
  }
};

// Fetches all sites in your account-structure.
async function fetchSites() {
  try {
    // const start = Date.now();
    const resultsPerPage = 100;
    let pageToken = '';
    let allSites = [];
    let responseCount = 0;
  
      // Make API requests with pagination until all sites are fetched
    do {
      const apiUrl = `https://api.yext.com/v2/accounts/all/sites?v=20230714&api_key=${YEXT_API_KEY}${pageToken ? `&pageToken=${pageToken}` : ''}`;
      console.log(apiUrl);

      const response = await axios.get(apiUrl);
      const sites = response.data.response.sites || [];

      allSites.push(...sites);
      responseCount = sites.length;
      pageToken = response.data.meta.pagination.pageToken;
    } while (responseCount === resultsPerPage);

    // const end = Date.now();
    // const duration = end - start;

    console.log("Fetched " +  allSites.length + " sites.");
    return allSites;
  } catch (error) {
    console.error({ 
      success: false,
      uuid: error.response.data.meta.uuid,
      statusCode: error.response.status,
      errorMessage: error.response.data.meta.errors[0],
      // duration: `${duration} ms`
    });
    throw error;
  }
};


// Creates a GitHub repository object in a Yext account
async function createRepository(accountId, repoId, repoUrl) {
  const postUrl = `https://api.yext.com/v2/accounts/${accountId}/config/resources/pages/repository?v=20230714&api_key=${YEXT_API_KEY}`; 

    const body = {
      "$id": repoId,
      "$schema": "https://schema.yext.com/config/pages/repository/v1",
      "repoUrl": repoUrl
    };

  try {
      const start = Date.now();
      const response = await axios.post(postUrl, body);
      const end = Date.now();
      const duration = end - start;
      return { 
        success: true,
        uuid: response.data.meta.uuid,
        accountId: accountId,
        response: response.data.response[0],
        duration: `${duration} ms`
      };
    } catch (error) {
      // console.log(error.response.data);
      return { 
        success: false,
        uuid: error.response.data.meta.uuid,
        accountId: accountId,
        statusCode: error.response.status,
        errorMessage: error.response.data.meta.errors[0],
        duration: `${duration} ms`
      };
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
        return { 
          success: true,
          uuid: response.data.meta.uuid,
          accountId: accountId,
          response: response.data.response[0],
          duration: `${duration} ms`
        };
      } catch (error) {
        return {
          success: false,
          uuid: error.response.data.meta.uuid,
          accountId: accountId,
          statusCode: error.response.status,
          errorMessage: error.response.data.meta.errors[0],
          duration: `${duration} ms`
        };
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
    return { 
      success: true,
      uuid: response.data.meta.uuid,
      accountId: accountId,
      response: response.data.response[0],
      duration: `${duration ? `${duration} ms` : ''}`
    };
  } catch (error) {
    return {
      success: false,
      uuid: error.response.data.meta.uuid,
      accountId: accountId,
      statusCode: error.response.status,
      errorMessage: error.response.data.meta.errors[0],
      duration: `${duration ? `${duration} ms` : ''}`
    };
  }
};

  // Given a set of API responses, returns total count of successes vs. failures
function summarizeResponses(responses) {
  let successfulRequests, failedRequests = 0;

  responses.forEach((response) => {
    if (response.success) {
      successfulRequests++;
    } else {
      failedRequests++;
    }
  });

  console.log('\nSuccessful requests:', successfulRequests);
  console.log('Failed requests:', failedRequests);

  return {
    successful: successfulRequests,
    failed: failedRequests,
  };
};
  

