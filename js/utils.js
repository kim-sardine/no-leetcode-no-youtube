
const LEETCODE_SHUFFLE_LINK = "https://leetcode.com/problems/random-one-question/all";

function getToday() {
    var today = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0');
    var yyyy = today.getFullYear();
    return mm + '/' + dd + '/' + yyyy;
}

function getHourDiffFromNow(target) {
    var targetDate = new Date(target);
    var now = new Date();
    var diffInHours = Math.floor(Math.abs(now-targetDate) / 3.6e6);
    console.log(diffInHours);
    return diffInHours;
}
