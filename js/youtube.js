chrome.storage.sync.get({
    enabled: true,
    hourUnit: 12,
    lastAcceptedDatetime: null
}, function(option) {
    if (option.enabled) {
        if (option.lastAcceptedDatetime == null ||
                getHourDiffFromNow(option.lastAcceptedDatetime) >= option.hourUnit) {
            chrome.runtime.sendMessage({
                type: 'redirect',
                redirectUrl: chrome.extension.getURL('redirect_to_leetcode.html')}
            )
        }
    }
});
