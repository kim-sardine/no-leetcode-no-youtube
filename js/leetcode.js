function getSubmissionTable() {
    return document.querySelector(".ant-table-tbody");
}

function getResultContainer() {
    return document.querySelector('div[class^="result-container"]');
}

function getSkeletonContainer() {
    return document.querySelector('div[class^="skeleton-container"]');
}

function getDesctiption() {
    return document.querySelector('div[class^="description"]');
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
    chrome.storage.sync.get({
        features: {
            autoRedirection: {
                hourUnit: 12
            }
        },
        lastAcceptedDatetime: null,
    }, function(option) {
        var lastAcceptedDatetimeOfThisSubmission = getLastAcceptedDatetime();
        if (lastAcceptedDatetimeOfThisSubmission) {
            console.log("lastAcceptedDatetimeOfThisSubmission", lastAcceptedDatetimeOfThisSubmission)
            if (new Date(lastAcceptedDatetimeOfThisSubmission) > new Date(option.lastAcceptedDatetime)) {
                if (getHourDiffFromNow(lastAcceptedDatetimeOfThisSubmission) < option.features.autoRedirection.hourUnit) {
                    chrome.runtime.sendMessage({message: "mission-clear"});
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

function convertToMarkdown(description) {
    var title = description.childNodes[0].childNodes[0].innerText;
    var difficulty = description.childNodes[0].childNodes[1].childNodes[0].innerText.toLowerCase();
    var content = description.childNodes[1].childNodes[0];

    var turndownService = new TurndownService();
    turndownService.use(turndownPluginGfm.tables)
    turndownService = turndownService.keep(['pre']);
    content = turndownService.turndown(content);

    return `${title} (${difficulty})\n\n` + content;
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
        else if (request.message === 'copy-problem-to-clipboard') {
            var description = getDesctiption();
            if (description) {
                try {
                    var markdown = convertToMarkdown(description);
                    sendResponse({markdown: markdown});
                } catch (error) {
                    sendResponse({error: error.message});
                }
            }
            else {
                sendResponse({error: "Can't find problem description"});
            }
        }
    }
);
