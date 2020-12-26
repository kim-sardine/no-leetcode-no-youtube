function isAccepted() {
    var table = document.querySelector(".ant-table-tbody");
    for (let idx = 0; idx < table.childNodes.length; idx++) {
        var tr = table.childNodes[idx];
        if (tr.childNodes.length === 5 && tr.childNodes[1].textContent === "Accepted") {
            return true
        }        
    }
    return false;
}

// FIXME: 바로 들어오는 요청은 못잡는다
chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        if (request.message === 'submission') {
            // FIXME: 제출시점에 로딩이 걸리는데, 이 다음에 검사를 수행해야함. 그렇지 않으면 체크 못한다.
            if (isAccepted() === true) {
                var obj = {};
                obj[getToday()] = true;
                chrome.storage.sync.set(obj, function() {
                    // Show today mission cleared. e.g. Change icon?
                    console.log("Mission Clear");
                });
            }
            else {
                console.log("Not Accepted");
            }
        }
    }
);
