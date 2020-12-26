chrome.tabs.onUpdated.addListener(
    // FIXME: submission 에서 새로고침한건 어떻게 알아낼것인가?
    function(tabId, changeInfo, tab) {
        if (changeInfo.url) {
            var reg =  new RegExp(/.*leetcode.com\/problems\/.*\/submissions\//)
            var found = changeInfo.url.match(reg);
            if (found) {
                chrome.tabs.sendMessage(tabId, {
                    message: 'submission',
                    url: changeInfo.url
                })
            }
        }
    }
);