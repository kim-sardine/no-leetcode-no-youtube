
const LEETCODE_SHUFFLE_LINK = "https://leetcode.com/problems/random-one-question/algorithms";

function getHourDiffFromNow(target) {
    var targetDate = new Date(target);
    var now = new Date();
    var diffInHours = Math.floor(Math.abs(now-targetDate) / 3.6e6);
    return diffInHours;
}
