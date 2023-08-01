const axios = require('axios');
const { 
    createSite,
    deleteSite,
    createSubaccount,
    fetchSites,
    fetchAccounts,
    createRepository,
    summarizeResponses
} = require('./utils');
require('dotenv').config();


const YEXT_PARENT_ACCOUNT_ID = process.env.YEXT_PARENT_ACCOUNT_ID;
const EXTERNAL_DB_BASE_URL = process.env.EXTERNAL_DB_BASE_URL;
const EXTERNAL_DB_API_KEY = process.env.EXTERNAL_DB_API_KEY;
const repoId = "reseller-starter-v2";
const repoUrl = "https://github.com/lymarrie/reseller-starter";

// Test function to fetch data from an external database
async function getExternalData() {
    try {
        const url = `${EXTERNAL_DB_BASE_URL}?apikey=${EXTERNAL_DB_API_KEY}`;
        const response = await axios.get(url);
        return response.data;
    } catch (error) {
        throw new Error(`Failed to make GET request: ${error.message}`);
    }
}

async function test() {
    try {
    // Fetches account information from my external DB
        // const data = await getExternalData();
        // console.log("Fetched " + data.length + " accounts.");

     //   Creates sub accounts
        // console.log('\n --------- Creating Sub-accounts ---------\n')
        // const subaccountResponses = await Promise.all(data.map(object => createSubaccount(YEXT_PARENT_ACCOUNT_ID, object.yextAccountId, object.name, object.address.countryCode)));
        // console.log('Subaccount Creation responses:', subaccountResponses);
        // summarizeResponses(subaccountResponses);


    //   Creates repo in all sub-accounts
        // console.log('\n --------- Creating Repositories ---------\n')
        // const createRepoResponses = await Promise.all(data.map(object => createRepository(object.yextAccountId, repoId, repoUrl)));
        // console.log('Repo creation responses:', createRepoResponses);
        // summarizeResponses(createRepoResponses);

    //   Applies site to all sub-accounts
        // console.log('\n --------- Creating Sites ---------\n')
        // const createSiteResponses = await Promise.all(data.map(object => {
        //     // JSON site object
        //     let siteBody = {
        //         "$id": `${object.siteId}`,
        //         "$schema": "https://schema.yext.com/config/pages/yextsite-config/v1",
        //         "siteName": `${object.name} - Website`,
        //         "repoConfig": `${repoId}`,
        //         "siteSettings": {
        //             "autoDeploy": true,
        //             "autoStage": true,
        //             "autoPublish": false,
        //             "pullRequestsEnabled": false,
        //             "stagingCredentials": {
        //                 "password": "",
        //                 "username": ""
        //             }
        //         },
        //         "branches": [
        //             {
        //                 "name": "master",
        //                 "envVars": [
        //                     {
        //                         "key": "YEXT_PUBLIC_LOCATION_ENTITY_ID",
        //                         "value": "test-location"
        //                     },
        //                     {
        //                         "key": "YEXT_PUBLIC_LOCATION_LOCALE_CODE",
        //                         "value": "en"
        //                     }
        //                 ],
        //                 "isProductionBranch": true
        //             }
        //         ]
        //     };
        //     return createSite(object.yextAccountId, siteBody)
        // })); 
        // console.log('Site Creation responses:', createSiteResponses);
        // summarizeResponses(createSiteResponses);

    // Fetch all sites across accounts
        // const sites = await fetchSites();
        // console.table(sites["siteId", "siteName", "accountId", "accountName"]);

    // Deletes all sites across accounts
        // console.log('\n --------- Deleting Sites ---------\n')
        // const siteDeleteResponses = await Promise.all(sites.map(site => deleteSite(site.accountId, site.siteId)));
        // console.log('Site Deletion responses:', siteDeleteResponses);
        // summarizeResponses(siteDeleteResponses);



    } catch (error) {
        console.error('An error occurred:', error.message);
    }
}

test();
