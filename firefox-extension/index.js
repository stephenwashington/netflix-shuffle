let buttons = require('sdk/ui/button/action');
let tabs = require('sdk/tabs');
let data = require('sdk/self').data;
let url = require('sdk/url');
let showList = JSON.parse(data.load('shows.json'));

let button = buttons.ActionButton({
    id: "shuffle-button",
    label: "Shuffle Netflix",
    icon: {
        "16": './icon-16.png',
        "32": './icon-32.png',
        "64": './icon-64.png'
    },
    onClick: getRandomEpisode
});

//return true if we're on netflix.com
function currentTabURL(){
    return tabs.activeTab.url;
}

//return the hostname (e.g. 'www.netflix.com')
function getURLHostname(){
    let hostname = url.URL(currentTabURL()).hostname;
    console.log("Hostname: " + hostname);
    return hostname;
}

//return the pathname (e.g. '/title/12345678')
function getURLPathname(){
    let pathname = url.URL(currentTabURL()).pathname;
    console.log("Pathname: " + pathname);
    return pathname;
}

//return the search parameters (e.g. /browse?jbv=[12345678]&jbp=0&jbr=0)
function getURLParameters(){
    let parameters = url.URL(currentTabURL()).search;
    console.log("Parameters: " + parameters);
    return parameters.substring(1);

}

//gets the parameters in a URL, returns a JSON containing the keys and values
function parseURL() {
    console.log("parsing URL");
    let queryString = getURLParameters();
    let params = queryString.split("&");
    let paramsAndValues = {};
    for (let i = 0; i < params.length; i++) {
        let val = params[i].split("=");
        paramsAndValues[decodeURIComponent(val[0])] = decodeURIComponent(
            val[1]); //using decodeURIComponent to be on the safe side
    }
    return paramsAndValues;
}

//Parse the URL the user is on, returns the showID
//(or an empty string if we're not on a valid url)
// multiple cases of valid URLs:
// 1. netflix.com/title/[showID]
// 2. netflix.com/browse?jbv=[showID]&jbp=0&jbr=0
// 3. netflix.com/title/[otherShowID]?jbv=[showID]&jbp=0&jbr=1
// 4. netflix.com/search/[otherShowID]?jbv=[showID]&jbp=0&jbr=2
// 5. netflix.com/watch/[episodeID]
function getShowID() {
    console.log("Getting show ID");
    let showID = null;
    let currentLocation = getURLPathname();
    if (currentLocation.indexOf("browse") > -1) {
        let params = parseURL();
        console.log("On browse with params, params are: " + JSON.stringify(params, null, 2));
        showID = params["jbv"];
    } else if (currentLocation.indexOf("title") > -1) {
        if (currentLocation.indexOf("?") == -1) {
            console.log("on /title, no params");
            showID = currentLocation.split("/").pop();
        } else {
            let params = parseURL();
            console.log("On title with params, params are: " + JSON.stringify(params, null, 2));
            showID = params["jbv"];
        }
    } else if (currentLocation.indexOf("search") > -1){
        let params = parseURL();
        console.log("On search with params, params are: " + JSON.stringify(params, null, 2));
        showID = params["jbv"];
    } else if (currentLocation.indexOf("watch") > -1){
        let episodeID = currentLocation.split("/").pop();
        console.log("On /watch/, episodeID = " + episodeID);
        for (let show in showList){
            let episodes = showList[show]["episodes"];
            if (episodes.indexOf(episodeID) > -1){
                showID = show;
                console.log("Show is from " + showList[show]["showTitle"]);
                break;
            }
        }
    }
    console.log("showID is " + showID);
    return showID;
}

//The main function - triggered when the addon button is clicked
//Redirects the current tab to a random episode of the show the user is on
function getRandomEpisode() {
    console.log("==== BUTTON CLICKED ====");
    //check to see if we're on a valid page
    if (getURLHostname() != "www.netflix.com") {
        console.log("We're not on netflix.com");
        return;
    }

    //check if showList got loaded properly
    if (showList == null){
        console.log("shows.json didn't load!");
        return;
    }

    let showID = getShowID();

    //check if showID was found
    if (showID == null) {
        console.log("showID could not parsed from " + currentTabURL());
        return;
    }

    //check if showID is in shows.json
    if (!showList.hasOwnProperty(showID)){
        console.log("Show with ID " + showID + " could not be found in shows.json");
        return;
    }


    //Play a random episode
    let episodeList = showList[showID]["episodes"];
    let randomEpisodeID = episodeList[Math.floor(Math.random()*episodeList.length)];
    console.log("Episode " + randomEpisodeID +  " from the show " + showList[showID]["showTitle"] + " has been selected");
    let randomEpisodeURL = "http://netflix.com/watch/" + randomEpisodeID;
    tabs.activeTab.url = randomEpisodeURL;
}
