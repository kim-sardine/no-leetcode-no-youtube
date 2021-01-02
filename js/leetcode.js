function getSubmissionTable() {
    return document.querySelector(".ant-table-tbody");
}

function getResultContainer() {
    return document.querySelector('div[class^="result-container"]');
}

function getSkeletonContainer() {
    return document.querySelector('div[class^="skeleton-container"]');
}

function isSubmissionOnProgress() {
    return getResultContainer() !== null;
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

function waitForSubmissionCompleted(timeoutSeconds, callback) {
    if (timeoutSeconds <= 0 || isSubmissionCompleted()) {
        callback();
        return
    }

    window.setTimeout(function() {
        waitForSubmissionCompleted(timeoutSeconds - 1, callback); 
    }, 1000);
}

function isSubmissionCompleted() {
    var resultContainer = getResultContainer();
    if (resultContainer) {
        var skeletonContainer = getSkeletonContainer();
        if (!skeletonContainer && resultContainer.childNodes.length > 0) {
            return true;
        }
    }
    return false;
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
            if (isSubmissionOnProgress()) {
                console.log("waitForSubmissionCompleted");
                waitForSubmissionCompleted(10, updateSubmission)
            }
            else {
                console.log("No Submission");
            }
        }
    }
);
