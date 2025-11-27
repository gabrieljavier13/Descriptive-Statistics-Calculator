const popCheckbox = document.getElementById('population');
const sampCheckbox = document.getElementById('sample');
const historyPanel = document.getElementById('history');
const historyList = document.getElementById('historyList');
const inputBox = document.getElementById('dataInput');

const resBox = document.getElementById('result');
const stepsBox = document.getElementById('steps');
const solBox = document.getElementById('solution');

popCheckbox.addEventListener('change', () => {
  if (popCheckbox.checked) sampCheckbox.checked = false;
});

sampCheckbox.addEventListener('change', () => {
  if (sampCheckbox.checked) popCheckbox.checked = false;
});

function parseInput() {
  const raw = inputBox.value.trim();
  if (raw === '') return [];
  return raw.split(/[,\s]+/).map(Number).filter(n => !isNaN(n));
}

function mean(arr) {
  return arr.reduce((a, b) => a + b, 0) / arr.length;
}

function median(arr) {
  const sorted = [...arr].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;
}

function mode(arr) {
  const freq = {};
  arr.forEach(n => freq[n] = (freq[n] || 0) + 1);
  const highestFreq = Math.max(...Object.values(freq));
  const modes = Object.keys(freq).filter(k => freq[k] == highestFreq);
  return modes.length === arr.length ? 'No mode' : modes.join(', ');
}

function range(arr) {
  return Math.max(...arr) - Math.min(...arr);
}

function variance(arr, type) {
  const m = mean(arr);
  const squared = arr.map(x => (x - m) ** 2);
  const divisor = type === 'sample' ? arr.length - 1 : arr.length;
  return squared.reduce((a, b) => a + b, 0) / divisor;
}

function stdDev(arr, type) {
  return Math.sqrt(variance(arr, type));
}

function showError(message) {
  resBox.innerHTML = `<h3>Results</h3><p>${message}</p>`;
  stepsBox.innerHTML = `<h3>Steps</h3>`;
  solBox.innerHTML = `<h3>Solution</h3>`;
}

function displayResults(nums, type, stats) {
  const { m, med, mo, r, v, sd } = stats;

  resBox.innerHTML = `
    <h3>Results</h3>
    <p><b>Mean:</b> ${m}</p>
    <p><b>Median:</b> ${med}</p>
    <p><b>Mode:</b> ${mo}</p>
    <p><b>Range:</b> ${r}</p>
    <p><b>Variance (${type}):</b> ${v}</p>
    <p><b>Std Dev (${type}):</b> ${sd}</p>
  `;

  stepsBox.innerHTML = `
    <h3>Steps</h3>
    <p><b>Data:</b> [${nums.join(', ')}]</p>
    <p><b>Mean:</b> Sum ÷ N</p>
    <p><b>Variance:</b> ${type === 'sample' ? "Σ(x–x̄)² / (n–1)" : "Σ(x–x̄)² / n"}</p>
    <p><b>Std Dev:</b> √Variance</p>
  `;

  solBox.innerHTML = `
    <h3>Solution</h3>
    <p><b>Mean:</b> Average of data values.</p>
    <p><b>Median:</b> Middle value when sorted.</p>
    <p><b>Mode:</b> Most frequent number(s).</p>
    <p><b>Range:</b> Highest minus lowest.</p>
    <p><b>Variance:</b> Spread of data around mean.</p>
    <p><b>Standard Deviation:</b> How far values deviate from mean.</p>
  `;
}

function addHistory(nums, stats, type) {
  const { m, med, mo, r, v, sd } = stats;
  const entry = document.createElement('div');
  entry.classList.add('history-entry');
  entry.innerHTML = `
    <b>Data:</b> ${nums.join(', ')}<br>
    Mean: ${m} | Median: ${med}<br>
    Mode: ${mo} | Range: ${r}<br>
    Variance (${type}): ${v} | SD: ${sd}
  `;
  historyList.prepend(entry);
}

function computeAll() {
  const nums = parseInput();
  if (nums.length === 0) {
    showError('Please enter valid numbers.');
    return;
  }

  const type = sampCheckbox.checked ? 'sample' : 'population';

  const stats = {
    m: mean(nums).toFixed(2),
    med: median(nums),
    mo: mode(nums),
    r: range(nums),
    v: variance(nums, type).toFixed(2),
    sd: stdDev(nums, type).toFixed(2)
  };

  displayResults(nums, type, stats);
  addHistory(nums, stats, type);
}

function clearAll() {
  inputBox.value = '';
  resBox.innerHTML = `<h3>Results</h3>`;
  stepsBox.innerHTML = `<h3>Steps</h3>`;
  solBox.innerHTML = `<h3>Solution</h3>`;
}

function toggleHistory() {
  historyPanel.classList.toggle('visible');
}

const themeSwitch = document.getElementById("themeSwitch");
const modeLabel = document.getElementById("modeLabel");

// Load saved mode
const savedTheme = localStorage.getItem("theme");
if (savedTheme === "dark") {
  document.body.classList.add("dark");
  themeSwitch.checked = true;
  modeLabel.textContent = "Dark Mode";
}

// When toggled
themeSwitch.addEventListener("change", () => {
  if (themeSwitch.checked) {
    document.body.classList.add("dark");
    modeLabel.textContent = "Dark Mode";
    localStorage.setItem("theme", "dark");
  } else {
    document.body.classList.remove("dark");
    modeLabel.textContent = "Light Mode";
    localStorage.setItem("theme", "light");
  }
});
