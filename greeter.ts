const element = document.getElementById("block");
let start: DOMHighResTimeStamp, previousTimeStamp: DOMHighResTimeStamp;

const slide = document.getElementById('slide');
const sliderDiv = document.getElementById("sliderAmount");
let heartRate = (slide) ? +(slide as HTMLInputElement).value : 60;

slide!.oninput = (event) => {
    if (slide)
    {
        let value = (slide as HTMLInputElement).value;
        sliderDiv!.innerHTML = value;
        heartRate = +value;
    }
}

function systoleDuration(heartRate: number): number {
    return -1.9228 * heartRate + 500.05;
}

function diastoleDuration(heartRate: number): number {
    return 130679 * (heartRate ** -1.3232);
}

function step(timeStamp: DOMHighResTimeStamp) {
    if (start === undefined) {
        start = timeStamp;
        previousTimeStamp = timeStamp;
    }

    const sDuration = systoleDuration(heartRate);
    const dDuration = diastoleDuration(heartRate);
    const beatDuration = sDuration + dDuration;

    if (timeStamp > (previousTimeStamp + beatDuration)) {
        const elapsed = (timeStamp - previousTimeStamp) % beatDuration;
        previousTimeStamp = Math.floor((timeStamp - previousTimeStamp) / beatDuration);

        if (elapsed < sDuration) {
            element!.style.backgroundColor = "red";
        }
        else {
            element!.style.backgroundColor = "white";
        }
    }
    else {
        const elapsed = (timeStamp - previousTimeStamp) % beatDuration;
        if (elapsed < sDuration) {
            element!.style.backgroundColor = "red";
        }
        else {
            element!.style.backgroundColor = "white";
        }
    }

    window.requestAnimationFrame(step);
}


requestAnimationFrame(step)