var buttons = require('sdk/ui/button/action');
var tabs = require('sdk/tabs');
var data = require('sdk/self').data;
var url = require('sdk/url');
var showList = JSON.parse(data.load('shows.json'));

var button = buttons.ActionButton({
    id: "shuffle-button",
    label: "Shuffle Netflix",
    icon: {
        "16": './icon-16.png',
        "32": './icon-32.png',
        "64": './icon-64.png'
    },
    onClick: getEpisode
});

//return true if we're on netflix.com
function currentTabURL(){
    return tabs.activeTab.url;
}

//return the hostname (e.g. 'www.netflix.com')
function getURLHostname(){
    var hostname = url.URL(currentTabURL()).hostname;
    console.log("Hostname: " + hostname);
    return hostname;
}

//return the pathname (e.g. '/title/12345678')
function getURLPathname(){
    var pathname = url.URL(currentTabURL()).pathname;
    console.log("Pathname: " + pathname);
    return pathname;
}

//return the search parameters (e.g. /browse?jbv=[12345678]&jbp=0&jbr=0)
function getURLParameters(){
    var parameters = url.URL(currentTabURL()).search;
    console.log("Parameters: " + parameters);
    return parameters.substring(1);

}

//shuffle an array, returns shuffled array
//from: https://stackoverflow.com/a/2450976
function shuffle(array) {
    var currentIndex = array.length,
        temporaryValue, randomIndex;
    // While there remain elements to shuffle...
    while (0 !== currentIndex) {
        // Pick a remaining element...
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        // And swap it with the current element.
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }
    return array;
}

//gets the parameters in a URL, returns a JSON containing the keys and values
function parseURL() {
    console.log("parsing URL");
    var queryString = getURLParameters();
    var params = queryString.split("&");
    var paramsAndValues = {};
    for (var i = 0; i < params.length; i++) {
        var val = params[i].split("=");
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
    var showID = "";
    var currentLocation = getURLPathname();
    if (currentLocation.indexOf("browse") > -1) {
        var params = parseURL();
        console.log("On browse with params, params are: " + JSON.stringify(params, null, 2));
        showID = params["jbv"];
    } else if (currentLocation.indexOf("title") > -1) {
        if (currentLocation.indexOf("?") == -1) {
            console.log("on /title, no params");
            showID = currentLocation.split("/").pop();
        } else {
            var params = parseURL();
            console.log("On title with params, params are: " + JSON.stringify(params, null, 2));
            showID = params["jbv"];
        }
    } else if (currentLocation.indexOf("search") > -1){
        var params = parseURL();
        console.log("On search with params, params are: " + JSON.stringify(params, null, 2));
        showID = params["jbv"];
    } else if (currentLocation.indexOf("watch") > -1){
        for (var show = 0; show < showList.length; show++){
            
        }
    }
    console.log("showID is " + showID);
    return showID;
}

//The main function - triggered when the addon button is clicked
//Opens a new tab with a random episode of the show the user is on
function getEpisode() {
    var showID = "";
    //check to see if we're on a valid page
    if (getURLHostname() == "www.netflix.com") {
        showID = getShowID();
        if (showID.length == 0) {
            console.log("No showID found!");
            return;
        }

        //Retrieve the episode list
        if (showList == null){
            console.log("shows.json didn't load!");
            return;
        }
        console.log("shows.json successfully loaded");
        if (!showList.hasOwnProperty(showID)){
            console.log("Show with ID " + showID + " is not in shows.json");
            return;
        }

        //and play a random episode
        var episodeList = shuffle(showList[showID]["episodes"]);
        var randomEpisodeID = episodeList.shift();
        console.log("Episode " + randomEpisodeID +  " from the show " + showList[showID]["showTitle"] + " has been selected");
        var randomEpisodeURL = "http://netflix.com/watch/" + randomEpisodeID;
        tabs.activeTab.url = randomEpisodeURL;
    }
    else{
        console.log("We're not on netflix.com :(")
    }
}
