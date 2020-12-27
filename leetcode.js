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

chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        if (request.message === 'check-submission-table') {
            var result = "NOT_ACCEPTED";;
            if ( ! isSubmissionTableGenerated() ) {
                console.log("Table not generated");
                result = "NO_TABLE";
            }
            else {
                chrome.storage.sync.get({lastAcceptedDatetime: null, hourUnit: 12}, function(option) {
                    console.log(option);
                    var lastAcceptedDatetimeOfThisSubmission = getLastAcceptedDatetime();
                    if (lastAcceptedDatetimeOfThisSubmission) {
                        console.log("lastAcceptedDatetimeOfThisSubmission", lastAcceptedDatetimeOfThisSubmission)
                        if (getHourDiffFromNow(lastAcceptedDatetimeOfThisSubmission) < option.hourUnit) {
                            // Show today mission cleared. e.g. blue icon
                            console.log("Mission Clear!");
                            result = "ACCEPTED";
                            if (new Date(lastAcceptedDatetimeOfThisSubmission) > option.lastAcceptedDatetime) {
                                chrome.storage.sync.set({
                                    lastAcceptedDatetime: lastAcceptedDatetimeOfThisSubmission
                                }, () => {
                                    consolg.log("Update Latest record")
                                });
                            }
                        }
                    }
                });
            }
            sendResponse({
                result: result
            });
        }
    }
);
