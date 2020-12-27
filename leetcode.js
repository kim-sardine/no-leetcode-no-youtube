function getSubmissionTable() {
    return document.querySelector(".ant-table-tbody");

}
function isSubmissionTableGenerated() {
    return getSubmissionTable() !== null;
}

function isAccepted() {
    var table = getSubmissionTable();
    for (let idx = 0; idx < table.childNodes.length; idx++) {
        var tr = table.childNodes[idx];
        if (tr.childNodes.length === 5 &&
                tr.childNodes[0].textContent.startsWith(getToday()) &&
                tr.childNodes[1].textContent === "Accepted") {
            return true
        }        
    }
    return false;
}

chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        if (request.message === 'check-submission-table') {
            if ( ! isSubmissionTableGenerated() ) {
                console.log("Table not generated");
            }
            else if (isAccepted()) {
                var obj = {};
                obj[getToday()] = true;
                chrome.storage.sync.set(obj, () => {
                    // Show today mission cleared. e.g. Change icon?
                    console.log("Mission Clear!");
                });
                console.log(true);
            }
            else {
                console.log("No Accepted exists");
            }
        }
    }
);
