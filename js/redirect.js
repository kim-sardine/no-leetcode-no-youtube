function redirect() {
    window.location.href = LEETCODE_SHUFFLE_LINK;
}

function timer(seconds, callback) {
    if (seconds === 0) {
        callback();
        return
    }
    document.getElementById('time-left').textContent = seconds;

    window.setTimeout(function() {
        timer(seconds - 1, callback); 
    }, 1000);
}

chrome.storage.sync.get('lastAcceptedDatetime', (res) => {
    var text = "It's Leecode time..";
    if (res.lastAcceptedDatetime) {
        text += " Your last submission : " + res.lastAcceptedDatetime;
    }
    document.getElementById('banner').textContent = text;
});

window.addEventListener("load", function(){
    timer(3, redirect);
});
