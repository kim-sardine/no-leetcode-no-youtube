var elem_input_autoRedirection = document.getElementById('auto-redirection');
var elem_input_ar_houtUnit = document.getElementById('ar-hour-unit');
var elem_status = document.getElementById('status');;
var elem_lastAcceptedSubmission = document.getElementById('lastAcceptedSubmission');
var elem_copyToClipboard = document.getElementById('copy-problem-to-clipboard');

function displaySaveMessage() {
    elem_status.textContent = 'Options saved.';
    setTimeout(function() {
        elem_status.textContent = '';
    }, 2500);
}

function updateAutoRedirection(value) {
    setAutoRedirection(value);

    var autoRedirection = {
        enabled: elem_input_autoRedirection.checked,
        hourUnit: elem_input_ar_houtUnit.value
    }
    chrome.storage.sync.set({
        features: {
            autoRedirection: autoRedirection
        }
    }, () => {
        displaySaveMessage();
    });
}

function setAutoRedirection(value) {
    if (value.enabled != null) {
        elem_input_autoRedirection.checked = value.enabled;
    }
    if (value.hourUnit != null) {
        elem_input_ar_houtUnit.value = value.hourUnit;
    }
}

function copyProblemToClipboard() {
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        chrome.tabs.sendMessage(tabs[0].id, {message: "copy-problem-to-clipboard"}, (response) => {
            if (chrome.runtime.lastError) {
                alert('This is not a Leetcode problem solving page');
            }
            else if (response.markdown) {
                var tempElem = document.createElement('textarea')
                tempElem.value = response.markdown;
                document.body.appendChild(tempElem);

                tempElem.select();
                document.execCommand("copy");
                document.body.removeChild(tempElem);
                alert('Copied!')
            }
            else if (response.error) {
                alert(response.error)
            }
        });
    });
}

function restoreOptions() {
    chrome.storage.sync.get({
        features: {
            autoRedirection: {
                enabled: true,
                hourUnit: 12
            }
        },
        lastAcceptedDatetime: "DOES NOT EXIST"
    }, function(option) {
        setAutoRedirection(option.features.autoRedirection);

        elem_lastAcceptedSubmission.textContent = option.lastAcceptedDatetime;
    });
}

document.addEventListener('DOMContentLoaded', restoreOptions);

elem_input_autoRedirection.addEventListener('change', (e) => updateAutoRedirection({enabled: e.target.checked}));
elem_input_ar_houtUnit.addEventListener('change', (e) => updateAutoRedirection({hourUnit: e.target.value}));
elem_copyToClipboard.addEventListener('click', () => copyProblemToClipboard());

