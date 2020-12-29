function isLeetcodeSubmissionURL(url) {
    var reg =  new RegExp(/.*leetcode.com\/problems\/.*\/submissions\//)
    return url.match(reg);
}

function isYoutubeURL(url) {
    var reg =  new RegExp(/https?:\/\/(www\.)?youtube.com\/.*/)
    return url.match(reg);
}

function checkSubmissionTable(tabId) {
    setTimeout(() => {
        chrome.tabs.sendMessage(tabId, {message: 'check-submission-table'}, (res) => {
            console.log(res.result)
        });
    }, 2000);
}

chrome.tabs.onUpdated.addListener(
    function(tabId, changeInfo, tab) {
        console.log(tabId);
        console.log(changeInfo);
        console.log(tab);
        if (changeInfo.status == 'loading' && changeInfo.url && isYoutubeURL(changeInfo.url)) {
            chrome.tabs.update(tabId, {url: chrome.extension.getURL('redirect_to_leetcode.html')});
        }
        else if (changeInfo.status == 'complete' && isLeetcodeSubmissionURL(tab.url)) {
            checkSubmissionTable(tabId);
        }
    }
);
