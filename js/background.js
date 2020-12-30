function isAccessingYoutube(changeInfo, tab) {
    // from other page to youtube
    if (changeInfo.status == 'loading' && changeInfo.url && isYoutubeURL(changeInfo.url)) {
        return true;
    }
    // refresh in youtube
    else if (changeInfo.status == 'loading' && isYoutubeURL(tab.url)) {
        return true;
    }
    return false;
}

function isYoutubeURL(url) {
    var reg =  new RegExp(/https?:\/\/(www\.)?youtube.com\/.*/)
    return url.match(reg);
}

function isTimeOver(lastAcceptedDatetime, hourUnit) {
    console.log(lastAcceptedDatetime);
    console.log(hourUnit);
    if (lastAcceptedDatetime) {
        var lastAcceptedDate = new Date(lastAcceptedDatetime);
        var now = new Date();
        var diffInHours = Math.floor(now-lastAcceptedDate / 3.6e6);
        console.log(diffInHours);
        if (diffInHours < hourUnit) {
            return false; // can watch youtube
        }
    }
    return true;
}

function isLeetcodeSubmissionURL(url) {
    var reg =  new RegExp(/https?:\/\/(www\.)?leetcode.com\/problems\/.*\/submissions\/?/)
    return url.match(reg);
}

function checkSubmissionTable(tabId) {
    setTimeout(() => {
        chrome.tabs.sendMessage(tabId, {message: 'check-submission-table'});
    }, 2000);
}

chrome.tabs.onUpdated.addListener(
    function(tabId, changeInfo, tab) {
        console.log(changeInfo)
        console.log(tab)
        if (isAccessingYoutube(changeInfo, tab)) { // 1. if user access youtube
            chrome.storage.sync.get({
                enabled: true,
                hourUnit: 12,
                lastAcceptedDatetime: null
            }, function(option) {
                if (option.enabled) { // 2. If nlny is enabled
                    if (isTimeOver(option.lastAcceptedDatetime, option.hourUnit)) { // 3. If timeover
                        chrome.tabs.update(tabId, {url: chrome.extension.getURL('redirect_to_leetcode.html')});
                    }
                }
            });
        }
        else if (changeInfo.status == 'complete' && isLeetcodeSubmissionURL(tab.url)) {
            checkSubmissionTable(tabId);
        }
    }
);
