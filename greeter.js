"use strict";
var Jitter = /** @class */ (function () {
    function Jitter() {
        this.currentJitter = 0;
    }
    Jitter.prototype.sampleUniform = function (range) {
        return 2 * Math.random() * range - range;
    };
    Jitter.prototype.getJitter = function () {
        var range = 8;
        var sample = this.sampleUniform(range + 0.5);
        sample = Math.round(sample);
        if (sample < this.currentJitter) {
            this.currentJitter = Math.max(this.currentJitter - 1, -range);
        }
        else if (sample > this.currentJitter) {
            this.currentJitter = Math.min(this.currentJitter + 1, range);
        }
        return this.currentJitter;
    };
    return Jitter;
}());
var element = document.getElementById("block");
var slide = document.getElementById('slide');
var sliderDiv = document.getElementById("sliderAmount");
var currentHeartRateDiv = document.getElementById("currentHeartRate");
var startTime = 0;
var heartBeatStartTime = 0;
var heartBeatEndTime = 0;
var sDuration = 0;
var dDuration = 0;
var beatDuration = sDuration + dDuration;
var jitter = new Jitter();
var jitterArray = Array();
for (var i = 0; i < 5000; i++) {
    jitterArray.push(jitter.getJitter());
}
var heartRateBaseline = (slide) ? +slide.value : 60;
var heartRate = heartRateBaseline;
slide.oninput = function (event) {
    if (slide) {
        var value = slide.value;
        if (sliderDiv)
            sliderDiv.innerHTML = "Heart rate baseline: " + value;
        heartRateBaseline = +value;
    }
};
function systoleDuration(heartRate) {
    return -1.9228 * heartRate + 500.05;
}
function diastoleDuration(heartRate) {
    return 130679 * (Math.pow(heartRate, -1.3232));
}
function step(timeStamp) {
    if (startTime === undefined) {
        startTime = timeStamp;
        heartBeatStartTime = timeStamp - 1;
    }
    while (timeStamp > heartBeatStartTime + beatDuration) {
        // Start time of next beat
        heartBeatStartTime += beatDuration;
        // Duration of next beat
        var index = Math.floor(heartBeatStartTime / 1000.0);
        heartRate = heartRateBaseline + jitterArray[index];
        sDuration = systoleDuration(heartRate);
        dDuration = diastoleDuration(heartRate);
        beatDuration = sDuration + dDuration;
        if (currentHeartRateDiv)
            currentHeartRateDiv.innerHTML = "Current heart rate: " + heartRate;
    }
    if (timeStamp < (heartBeatStartTime + sDuration)) {
        if (element)
            element.style.backgroundColor = "red";
    }
    else {
        if (element)
            element.style.backgroundColor = "white";
    }
    window.requestAnimationFrame(step);
}
requestAnimationFrame(step);
