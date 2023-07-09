var element = document.getElementById("block");
var start, previousTimeStamp;
var slide = document.getElementById('slide');
var sliderDiv = document.getElementById("sliderAmount");
var heartRate = (slide) ? +slide.value : 60;
slide.oninput = function (event) {
    if (slide) {
        var value = slide.value;
        sliderDiv.innerHTML = value;
        heartRate = +value;
    }
};
function systoleDuration(heartRate) {
    return -1.9228 * heartRate + 500.05;
}
function diastoleDuration(heartRate) {
    return 130679 * (Math.pow(heartRate, -1.3232));
}
function step(timeStamp) {
    if (start === undefined) {
        start = timeStamp;
        previousTimeStamp = timeStamp;
    }
    var sDuration = systoleDuration(heartRate);
    var dDuration = diastoleDuration(heartRate);
    var beatDuration = sDuration + dDuration;
    if (timeStamp > (previousTimeStamp + beatDuration)) {
        var elapsed = (timeStamp - previousTimeStamp) % beatDuration;
        previousTimeStamp = Math.floor((timeStamp - previousTimeStamp) / beatDuration);
        if (elapsed < sDuration) {
            element.style.backgroundColor = "red";
        }
        else {
            element.style.backgroundColor = "white";
        }
    }
    else {
        var elapsed = (timeStamp - previousTimeStamp) % beatDuration;
        if (elapsed < sDuration) {
            element.style.backgroundColor = "red";
        }
        else {
            element.style.backgroundColor = "white";
        }
    }
    window.requestAnimationFrame(step);
}
requestAnimationFrame(step);
