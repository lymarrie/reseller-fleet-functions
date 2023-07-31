const axios = require('axios');

const apiKey = YEXT_API_KEY;

// Function to make the GET request to fetch all objects with pagination
async function fetchSubaccounts() {
    try {
        const resultsPerPage = 100;
        let offset = 0;
        let totalObjects = [];
        let responseCount = 0;
        
    const baseUrl = 'https://api.yext.com/v2/accounts?v=20230714';
    // Make API requests with pagination until all objects are fetched
    do {
      const apiUrl = `${baseUrl}&api_key=${apiKey}&offset=${offset}`;

      const response = await axios.get(apiUrl);
      const objects = response.data.response.accounts || [];

      totalObjects.push(...objects);
      responseCount = objects.length;
      offset += resultsPerPage;
    } while (responseCount === resultsPerPage);

    console.log("Fetched " +  totalObjects.length + " sub-accounts.");
    return totalObjects;
  } catch (error) {
    console.error('Error while fetching the objects:', error.message);
    throw error;
  }
}

// Function to make the GET request to fetch all sites with pagination
async function fetchSites() {
    try {
      const resultsPerPage = 100;
      let pageToken = '';
      let totalSites = [];
      let responseCount = 0;
  
      // Make API requests with pagination until all sites are fetched
      do {
        const apiUrl = `https://api.yext.com/v2/accounts/all/sites?v=20230714&api_key=${apiKey}${pageToken ? `&pageToken=${pageToken}` : ''}`;
  
        const response = await axios.get(apiUrl);
        const sites = response.data.response.sites || [];
  
        totalSites.push(...sites);
        responseCount = sites.length;
        pageToken = response.data.meta.pagination.pageToken;
      } while (responseCount === resultsPerPage);
      
      console.log("Fetched " + totalSites.length + " sites.");
      return totalSites;
    } catch (error) {
      console.error('Error while fetching the sites:', error.message);
      throw error;
    }
  }



// Function to make the POST request using the ID of each object
async function createRepositories(object) {
  const accountId = object.accountId;
  const accountName = object.accountName;
  const postUrl = `https://api.yext.com/v2/accounts/${accountId}/config/resources/pages/repository?v=20230414&api_key=a750ad829f901b2806f2327df1e5da56`; 

    const body = {
        "$id": "basic-starter-repo-applied-via-api",
        "$schema": "https://schema.yext.com/config/pages/repository/v1",
        "repoUrl": "https://github.com/lymarrie/reseller-starter"
    };

  try {
    const response = await axios.post(postUrl, body);
    console.log(`posted repo to ${accountId}`);
    return { success: true, data: `Success | ${accountId}` };
  } catch (error) {
    console.error(`Error while making POST request for object with ID ${accountId}:`, error.message);
    return { success: false, error: `Error | ${accountId} | ${error.message}` };
}
}

// Function to make the POST request using the ID of each object
async function createSites(object) {
    const accountId = object.accountId;
    const accountName = object.accountName;
    const postUrl = `https://api.yext.com/v2/accounts/${accountId}/config/resources/pages/yextsite-config?v=20230414&api_key=a750ad829f901b2806f2327df1e5da56`;

    let today = new Date();
    let todayString = `${today.getMonth()}-${today.getDate()}-${today.getFullYear()}`;

    const body = {
      "$id": `${todayString}-${accountId}`,
      "$schema": "https://schema.yext.com/config/pages/yextsite-config/v1",
      "siteName": `${accountName} - Site created via API`,
      "repoConfig": "basic-starter-repo-applied-via-api",
      "siteSettings": {
        "autoDeploy": true,
        "autoStage": true,
        "autoPublish": false,
        "pullRequestsEnabled": false,
        "stagingCredentials": {
          "password": "",
          "username": ""
        }
      },
      "branches": [
        {
          "name": "master",
          "envVars": [
                {
                    "key": "YEXT_PUBLIC_LOCATION_ENTITY_ID",
                    "value": "test-location"
                },
                {
                    "key": "YEXT_PUBLIC_LOCATION_LOCALE_CODE",
                    "value": "en"
                }
            ],
          "isProductionBranch": true
        }
      ]
    };
  
    try {
        const start = Date.now();
        const response = await axios.post(postUrl, body);
        const end = Date.now();
        const duration = end - start;
        // console.log(`posted site to ${accountId}`)
        console.log(`created site in ${accountId} | took ${duration}`)
        return { success: true, data: `Success | ${accountId}` };
    } catch (error) {
        console.error(`Error making site in ${accountId}:`, error.message);
        return { success: false, error: `Error | ${accountId} | ${error.message}` };
    }
  }

  // Function to DELETE each site
async function deleteSites(object) {
    const accountId = object.accountId;
    const siteId = object.siteId;
    const url = `https://api.yext.com/v2/accounts/${accountId}/config/resources/pages/yextsite-config/${siteId}?v=20230414&api_key=a750ad829f901b2806f2327df1e5da56`;

  
    try {
        const start = Date.now();
        const response = await axios.delete(url);
        const end = Date.now();
        const duration = end - start;
        console.log(`deleted ${siteId} from ${accountId} | took ${duration}`)
      return { success: true, data: `Deletion Success | ${siteId} | ${accountId} | ${response.data} |  ${duration}` };
    } catch (error) {
      console.error(`Error while making DELETE request for object with ID ${accountId} | ${error.message} | ${duration}`,);
      return { success: false, error: `Deletion Error | ${siteId} | ${accountId} | ${error.message}`, duration };
    }
  }



// Main function to fetch objects and make POST requests
async function main() {
  try {

    // Fetches list of all sub-accounts
    // const subaccounts = await fetchSubaccounts();

    // // Applies repo to all sub-accounts
    // const repoPostResponses = await Promise.all(subaccounts.map(object => createRepositories(object)));
    // console.log('Repo POST request responses:', repoPostResponses);

    // Applies site to all sub-accounts
    // const sitePostResponses = await Promise.all(subaccounts.map(object => createSites(object)));
    // console.log('Site POST request responses:', sitePostResponses);
    // let successfulSiteCreates = 0;
    // let failedSiteCreates = 0;
    // // Count the number of successful and failed POST responses
    // for (const response of sitePostResponses) {
    //     if (response.success) {
    //         successfulSiteCreates++;
    //     } else {
    //         failedSiteCreates++;
    //     }
    //   }
    // console.log('Number of successful Site POST responses:', successfulSiteCreates);
    // console.log('Number of failed Site POST responses:', failedSiteCreates);

    // Fetches list of all sites
    const sites = await fetchSites();

    // Deletes all sites
    const siteDeleteResponses = await Promise.all(sites.map(site => deleteSites(site)));
    console.log('Site DELETE responses:', siteDeleteResponses);
    let successfulDeletions = 0;
    let failedDeletions = 0;
    // Count the number of successful and failed POST responses
    for (const response of siteDeleteResponses) {
        if (response.success) {
            successfulDeletions++;
        } else {
            failedDeletions++;
        }
      }
      console.log('DELETION request responses:', siteDeleteResponses);
      console.log('Number of successful DELETE responses:', successfulDeletions);
      console.log('Number of failed DELETE responses:', failedDeletions);

  } catch (error) {
    console.error('An error occurred:', error.message);
  }
}

// Run the main function
main();
