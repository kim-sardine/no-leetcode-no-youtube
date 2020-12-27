function isLeetcodeSubmissionURL(url) {
    var reg =  new RegExp(/.*leetcode.com\/problems\/.*\/submissions\//)
    return url.match(reg);
}


function checkSubmissionTable(tabId) {
    console.log('checkSubmissionTable');
    setTimeout(() => {
        chrome.tabs.sendMessage(tabId, {message: 'check-submission-table'});
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