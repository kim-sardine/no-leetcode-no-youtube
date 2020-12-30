function getSubmissionTable() {
    return document.querySelector(".ant-table-tbody");

}
function isSubmissionTableGenerated() {
    return getSubmissionTable() !== null;
}

function getLastAcceptedDatetime() {
    var table = getSubmissionTable();
    for (let idx = 0; idx < table.childNodes.length; idx++) {
        var tr = table.childNodes[idx];
        if (tr.childNodes.length === 5 && tr.childNodes[1].textContent === "Accepted") {
            return tr.childNodes[0].textContent;
        }        
    }
    return null;
}

function waitUntilOneRowGenerated(maxSeconds, callback) {
    if (maxSeconds === 0 || isOneRowExisted()) {
        callback();
        return
    }

    window.setTimeout(function() {
        waitUntilOneRowGenerated(maxSeconds - 1, callback); 
    }, 1000);
}

function isOneRowExisted() {
    var table = getSubmissionTable();
    return table.childNodes.length > 0;
}

function updateSubmission() {
    chrome.storage.sync.get({lastAcceptedDatetime: null, hourUnit: 12}, function(option) {
        var lastAcceptedDatetimeOfThisSubmission = getLastAcceptedDatetime();
        if (lastAcceptedDatetimeOfThisSubmission) {
            console.log("lastAcceptedDatetimeOfThisSubmission", lastAcceptedDatetimeOfThisSubmission)
            if (new Date(lastAcceptedDatetimeOfThisSubmission) > new Date(option.lastAcceptedDatetime)) {
                if (getHourDiffFromNow(lastAcceptedDatetimeOfThisSubmission) < option.hourUnit) {
                    // Status : Mission Clear. change icon color to blue?
                    console.log("Mission Clear!");
                }
                chrome.storage.sync.set({
                    lastAcceptedDatetime: lastAcceptedDatetimeOfThisSubmission
                }, () => {
                    console.log("Update Latest record")
                });
            }
        }
    });
}

chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        if (request.message === 'check-submission-table') {
            if ( ! isSubmissionTableGenerated() ) {
                console.log("Table not generated -> No Submission");
            }
            else {
                console.log("waitUntilOneRowGenerated");
                waitUntilOneRowGenerated(3, updateSubmission)
            }
        }
    }
);
