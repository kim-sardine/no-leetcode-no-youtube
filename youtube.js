
chrome.storage.sync.get({
    enabled: true,
    hourUnit: 12,
    lastAcceptedDatetime: null
}, function(option) {
    console.log(option);
    if (option.enabled) {
        if (option.lastAcceptedDatetime == null ||
                getHourDiffFromNow(option.lastAcceptedDatetime) >= option.hourUnit) {
            window.location.href = LEETCODE_SHUFFLE_LINK;
        }
    }
});
