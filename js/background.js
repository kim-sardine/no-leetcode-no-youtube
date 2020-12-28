function isLeetcodeSubmissionURL(url) {
    var reg =  new RegExp(/.*leetcode.com\/problems\/.*\/submissions\//)
    return url.match(reg);
}


function checkSubmissionTable(tabId) {
    setTimeout(() => {
        chrome.tabs.sendMessage(tabId, {message: 'check-submission-table'}, (res) => {
            console.log(res.result)
        });
    }, 1500);
}
    
chrome.tabs.onUpdated.addListener(
    function(tabId, changeInfo, tab) {
        console.log(changeInfo.status);
        if (changeInfo.status == 'complete' && isLeetcodeSubmissionURL(tab.url)) {
            checkSubmissionTable(tabId);
        }
    }
);

chrome.runtime.onMessage.addListener(function(request, sender) {
    if (request.type === 'redirect') {
        chrome.tabs.update(sender.tab.id, {url: request.redirectUrl});
    }
});
