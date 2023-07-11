class Jitter {
    currentJitter: number = 0

    sampleUniform(range: number): number {
        return 2 * Math.random() * range - range;
    }

    getJitter() {
        let range = 8
        let sample = this.sampleUniform(range + 0.5)
        sample = Math.round(sample)

        if (sample < this.currentJitter) {
            this.currentJitter = Math.max(this.currentJitter - 1, -range)
        }
        else if (sample > this.currentJitter) {
            this.currentJitter = Math.min(this.currentJitter + 1, range)
        }
        return this.currentJitter
    }
}

const element = document.getElementById("block");
const slide = document.getElementById('slide');
const sliderDiv = document.getElementById("sliderAmount");
const currentHeartRateDiv = document.getElementById("currentHeartRate");

let startTime: DOMHighResTimeStamp = 0;
let heartBeatStartTime: DOMHighResTimeStamp = 0;
let heartBeatEndTime: DOMHighResTimeStamp = 0;

let sDuration = 0;
let dDuration = 0;
let beatDuration = sDuration + dDuration;

const jitter = new Jitter();
let jitterArray: Array<number> = Array<number>();
for (let i = 0; i < 5000; i++) {
    jitterArray.push(jitter.getJitter())
}

let heartRateBaseline = (slide) ? +(slide as HTMLInputElement).value : 60;
let heartRate: number = heartRateBaseline

slide!.oninput = (event) => {
    if (slide) {
        let value = (slide as HTMLInputElement).value;
        if (sliderDiv) sliderDiv.innerHTML = "Heart rate baseline: " + value;
        heartRateBaseline = +value;
    }
}

function systoleDuration(heartRate: number): number {
    return -1.9228 * heartRate + 500.05;
}

function diastoleDuration(heartRate: number): number {
    return 130679 * (heartRate ** -1.3232);
}

function step(timeStamp: DOMHighResTimeStamp) {
    if (startTime === undefined) {
        startTime = timeStamp;
        heartBeatStartTime = timeStamp - 1;
    }

    while (timeStamp > heartBeatStartTime + beatDuration) {
        // Start time of next beat
        heartBeatStartTime += beatDuration;

        // Duration of next beat
        const index = Math.floor(heartBeatStartTime / 2000.0);
        heartRate = heartRateBaseline + jitterArray[index];
        sDuration = systoleDuration(heartRate);
        dDuration = diastoleDuration(heartRate);
        beatDuration = sDuration + dDuration;

        if (currentHeartRateDiv) currentHeartRateDiv.innerHTML = "Current heart rate: " + heartRate; 
    }

    if (timeStamp < (heartBeatStartTime + sDuration)) {
        if (element) element.style.backgroundColor = "red";
    }
    else {
        if (element) element.style.backgroundColor = "white";
    }

    window.requestAnimationFrame(step);
}


requestAnimationFrame(step)