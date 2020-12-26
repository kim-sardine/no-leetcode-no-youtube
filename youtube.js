
// 1. Delete older history

// 2. if you don't solve today leetcode -> redirect
today = getToday();
chrome.storage.sync.get(today, (done) => {
    if (Object.keys(done).length === 0) {
        console.log("Redirect!")
        window.location.href = LEETCODE_SHUFFLE_LINK;
    } 
    else {
        console.log("Today problem solved")
    }
});
