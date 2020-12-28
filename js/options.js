function displaySaveMessage() {
    var status = document.getElementById('status');
    status.textContent = 'Options saved.';
    setTimeout(function() {
        status.textContent = '';
    }, 2500);
}

function setEnableButtons(enable) {
    if (enable) {
        document.getElementById('nlny-status').textContent = "Enabled";
        document.getElementById('enable-nlny').hidden = true;
        document.getElementById('disable-nlny').hidden = false;
    }
    else {
        document.getElementById('nlny-status').textContent = "Disabled";
        document.getElementById('enable-nlny').hidden = false;
        document.getElementById('disable-nlny').hidden = true;
    }
}

function enableNLNY(enable) {
    setEnableButtons(enable)

    chrome.storage.sync.set({
        enabled: enable,
    }, () => {
        displaySaveMessage();
    });
}

function updateHourUnit() {
    var hourUnit = document.getElementById('hour-unit').value;
    chrome.storage.sync.set({
        hourUnit: hourUnit,
    }, () => {
        displaySaveMessage();
    });
}

function restoreOptions() {
    chrome.storage.sync.get({
        enabled: true,
        hourUnit: 12,
        lastAcceptedDatetime: "DOES NOT EXIST"
    }, function(option) {
        setEnableButtons(option.enabled);
        document.getElementById('hour-unit').value = option.hourUnit;
        document.getElementById('lastAcceptedSubmission').textContent = option.lastAcceptedDatetime;
    });
}

document.addEventListener('DOMContentLoaded', restoreOptions);

document.getElementById('enable-nlny').addEventListener('click', () => enableNLNY(true));
document.getElementById('disable-nlny').addEventListener('click', () => enableNLNY(false));
document.getElementById('hour-unit').addEventListener('change', () => updateHourUnit());
