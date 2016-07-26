//https://gist.github.com/thiagodebastos/08ea551b97892d585f17
function loadJSON(callback) {
    let xobj = new XMLHttpRequest();
    xobj.overrideMimeType("application/json");
    xobj.open('GET', chrome.extension.getURL('data/shows.json'), true);
    xobj.onreadystatechange = function() {
        if (xobj.readyState == 4 && xobj.status == "200") {
            callback(xobj.responseText); //need callback since this is async
        }
    }
    xobj.send(null);
}

//gets the parameters in a URL, returns a JSON containing the keys and values
function parseURL(url) {
    console.log("parsing URL");
    let urlParams = {};
    let parser = document.createElement('a');
    parser.href = url;
    urlParams["url"] = url;
    urlParams["hostname"] = parser.hostname;
    urlParams["pathname"] = parser.pathname;
    let queryParamsAndValues = {};
    let queryString = parser.search.substring(1);
    let queryParams = queryString.split("&");

    for (let i = 0; i < queryParams.length; i++) {
        let val = queryParams[i].split("=");
        queryParamsAndValues[decodeURIComponent(val[0])] = decodeURIComponent(
            val[1]); //using decodeURIComponent to be on the safe side
    }
    urlParams["search"] = queryParamsAndValues;
    return urlParams;
}

//Parse the URL the user is on, returns the showID
//(or an empty string if we're not on a valid url)
// multiple cases of valid URLs:
// 1. netflix.com/title/[showID]
// 2. netflix.com/browse?jbv=[showID]&jbp=0&jbr=0
// 3. netflix.com/title/[otherShowID]?jbv=[showID]&jbp=0&jbr=1
// 4. netflix.com/search/[otherShowID]?jbv=[showID]&jbp=0&jbr=2
// 5. netflix.com/watch/[episodeID]
function getShowID(url, urlParams, showList) {
    console.log("Getting show ID");
    let showID = null;
    let currentLocation = urlParams["pathname"];
    if (currentLocation.indexOf("browse") > -1) {
        let params = urlParams["search"];
        console.log("On browse with params, params are: " + JSON.stringify(params, null, 2));
        showID = params["jbv"];
    } else if (currentLocation.indexOf("title") > -1) {
        if (currentLocation.indexOf("?") == -1) {
            console.log("on /title, no params");
            showID = currentLocation.split("/").pop();
        } else {
            let params = urlParams["search"];
            console.log("On title with params, params are: " + JSON.stringify(params, null, 2));
            showID = params["jbv"];
        }
    } else if (currentLocation.indexOf("search") > -1){
        let params = urlParams["search"];
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

chrome.browserAction.onClicked.addListener(function(tab){
    console.log("==== BUTTON CLICKED ====");
    let url = tab.url;
    let urlParams = parseURL(url);
    loadJSON(function(response){
        let showList = JSON.parse(response);
        //check to see if we're on a valid page
        if (urlParams["hostname"] != "www.netflix.com") {
            console.log("We're not on netflix.com");
            return;
        }

        //check if showList got loaded properly
        if (showList == null){
            console.log("shows.json didn't load!");
            return;
        }

        let showID = getShowID(url, urlParams, showList);

        //check if showID was found
        if (showID == null) {
            console.log("showID could not parsed from " + url);
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
        chrome.tabs.query({currentWindow: true, active: true}, function (tab) {
            chrome.tabs.update(tab.id, {url: randomEpisodeURL});
        });
    });
});
