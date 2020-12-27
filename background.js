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

// chrome.browserAction.setIcon();

// chrome.runtime.onMessage.addListener(
//     function(request, sender, sendResponse) {
//         if (request.type === 'notification') {
//             chrome.notifications.create('', request.options);
//         }
//     }
// );