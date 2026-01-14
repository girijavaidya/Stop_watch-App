

const display = document.getElementById('display');
const startBtn = document.getElementById('startBtn');
const stopBtn = document.getElementById('stopBtn');
const resetBtn = document.getElementById('resetBtn');
const lapBtn = document.getElementById('lapBtn');

let intervalId = null;       // reference to setInterval
let startTimestamp = 0;      // when the current run started (performance.now())
let elapsed = 0;             // accumulated elapsed ms across runs
const tickMs = 31;          // update every ~31ms (about 30fps). Use 10 for 100Hz.

function formatTime(ms){
  const totalHundredths = Math.floor(ms / 10); // hundredths of second
  const hundredths = totalHundredths % 100;
  const totalSeconds = Math.floor(ms / 1000);
  const seconds = totalSeconds % 60;
  const minutes = Math.floor(totalSeconds / 60) % 60;
  const hours = Math.floor(totalSeconds / 3600);
  // Format as HH:MM:SS:hh (we'll show HH:MM:SS if hours=0)
  const two = v => String(v).padStart(2,'0');
  if(hours > 0){
    return `${two(hours)}:${two(minutes)}:${two(seconds)}`;
  }else{
    return `${two(minutes)}:${two(seconds)}:${two(hundredths)}`;
  }
}

function updateDisplay(){
  const now = performance.now();
  const currentElapsed = elapsed + (startTimestamp ? (now - startTimestamp) : 0);
  display.textContent = formatTime(Math.floor(currentElapsed));
}

function start(){
  if(intervalId) return; // already running
  startTimestamp = performance.now();
  intervalId = setInterval(updateDisplay, tickMs);
  // update UI
  startBtn.disabled = true;
  stopBtn.disabled = false;
  resetBtn.disabled = false;
  lapBtn.disabled = false;
}

function stop(){
  if(!intervalId) return;
  clearInterval(intervalId);
  intervalId = null;
  // accumulate elapsed
  const now = performance.now();
  elapsed += (now - startTimestamp);
  startTimestamp = 0;
  updateDisplay();
  // update UI
  startBtn.disabled = false;
  stopBtn.disabled = true;
  lapBtn.disabled = true;
}

function reset(){
  // stop first
  if(intervalId) clearInterval(intervalId);
  intervalId = null;
  startTimestamp = 0;
  lapCount = 0; // 👈 reset lap numbering
  elapsed = 0;
  display.textContent = '00:00:00';
  // clear laps
  lapsList.innerHTML = '';
  // update UI
  startBtn.disabled = false;
  stopBtn.disabled = true;
  resetBtn.disabled = true;
  lapBtn.disabled = true;
}



// hook up events
startBtn.addEventListener('click', start);
stopBtn.addEventListener('click', stop);
resetBtn.addEventListener('click', reset);
lapBtn.addEventListener('click', lap);

// keyboard shortcuts: Space to start/stop, L to lap, R to reset
document.addEventListener('keydown', (e) => {
  if(e.key === ' '){ // space start/stop
    e.preventDefault();
    if(intervalId) stop(); else start();
  } else if(e.key.toLowerCase() === 'l'){
    if(!lapBtn.disabled) lap();
  } else if(e.key.toLowerCase() === 'r'){
    reset();
  }
});

// initialize
reset(); // sets initial UI state
