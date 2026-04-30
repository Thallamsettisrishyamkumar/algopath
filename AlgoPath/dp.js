// ─────────────────────────────────────────────────────────────
//  ALGOPATH — DYNAMIC PROGRAMMING
//  0/1 Knapsack Study Time Optimizer
//  Selects best topics within limited hours to maximize score
// ─────────────────────────────────────────────────────────────

const DEFAULT_TOPICS = [
  { name: "Arrays",              hours: 2, importance: 9  },
  { name: "Linked Lists",        hours: 3, importance: 8  },
  { name: "Recursion",           hours: 2, importance: 7  },
  { name: "Sorting Algorithms",  hours: 4, importance: 9  },
  { name: "Trees",               hours: 5, importance: 8  },
  { name: "Dynamic Programming", hours: 6, importance: 10 },
  { name: "Graphs",              hours: 5, importance: 9  },
  { name: "Strings",             hours: 2, importance: 6  },
  { name: "Stacks & Queues",     hours: 3, importance: 7  },
];

function knapsack(items, capacity) {
  const n  = items.length;
  const dp = [];
  const steps = [];

  for (let i = 0; i <= n; i++) dp[i] = new Array(capacity + 1).fill(0);

  steps.push(`Built DP table: ${n+1} rows × ${capacity+1} columns`);
  steps.push(`Rule: dp[i][w] = max importance using first i topics within w hours`);

  for (let i = 1; i <= n; i++) {
    const { name, hours, importance } = items[i - 1];
    for (let w = 0; w <= capacity; w++) {
      dp[i][w] = dp[i - 1][w];
      if (hours <= w) {
        const withItem = dp[i - 1][w - hours] + importance;
        if (withItem > dp[i][w]) dp[i][w] = withItem;
      }
    }
    steps.push(`Row ${i} — "${name}" (${hours}h, score:${importance}) → best = ${dp[i][capacity]}`);
  }

  const selected = [];
  let w = capacity;
  for (let i = n; i > 0; i--) {
    if (dp[i][w] !== dp[i - 1][w]) {
      selected.unshift(items[i - 1]);
      w -= items[i - 1].hours;
      steps.push(`Selected: "${items[i - 1].name}" (backtrack)`);
    }
  }

  return {
    selected,
    totalImportance: selected.reduce((s, t) => s + t.importance, 0),
    totalHours:      selected.reduce((s, t) => s + t.hours, 0),
    steps,
  };
}

let userTopics = [...DEFAULT_TOPICS];

function renderTopicRows() {
  const container = document.getElementById('topic-rows');
  container.innerHTML = '';
  userTopics.forEach((t, i) => {
    const row = document.createElement('div');
    row.className = 'topic-row';
    row.innerHTML = `
      <input value="${t.name}"       onchange="userTopics[${i}].name       = this.value" style="flex:3" placeholder="Topic name"/>
      <input value="${t.hours}"      onchange="userTopics[${i}].hours      = +this.value" style="flex:1" type="number" min="1" placeholder="Hours"/>
      <input value="${t.importance}" onchange="userTopics[${i}].importance = +this.value" style="flex:1" type="number" min="1" max="10" placeholder="Score"/>
      <button class="add-btn" style="background:#fee2e2;color:#dc2626;padding:9px 12px" onclick="removeTopic(${i})">✕</button>`;
    container.appendChild(row);
  });
}

function addTopic() {
  userTopics.push({ name: 'New Topic', hours: 2, importance: 5 });
  renderTopicRows();
}

function removeTopic(i) {
  userTopics.splice(i, 1);
  renderTopicRows();
}

function runDP() {
  const capacity = parseInt(document.getElementById('dp-hours').value, 10);
  const resDiv   = document.getElementById('dp-result');

  if (!capacity || capacity < 1) { alert('Enter valid study hours (min 1)'); return; }

  const validTopics = userTopics.filter(t => t.name && t.hours > 0 && t.importance > 0);
  if (validTopics.length === 0) { alert('Add at least one topic'); return; }

  const { selected, totalImportance, totalHours, steps } = knapsack(validTopics, capacity);
  resDiv.style.display = 'block';

  const topicRows = selected.map(t => `
    <tr>
      <td style="padding:8px 12px">${t.name}</td>
      <td style="padding:8px 12px;text-align:center">${t.hours}h</td>
      <td style="padding:8px 12px;text-align:center">
        <span style="background:#e0f2fe;color:#0369a1;padding:2px 10px;border-radius:12px;font-size:12px;font-weight:bold">${t.importance}/10</span>
      </td>
    </tr>`).join('');

  const allRows = validTopics.map(t => {
    const picked = selected.find(s => s.name === t.name);
    return `<tr style="opacity:${picked ? 1 : 0.4}">
      <td style="padding:6px 12px">${picked ? '✅' : '⬜'} ${t.name}</td>
      <td style="padding:6px 12px;text-align:center">${t.hours}h</td>
      <td style="padding:6px 12px;text-align:center">${t.importance}/10</td>
    </tr>`;
  }).join('');

  const stepsHTML = steps.map(s => `<li style="color:#555;font-size:13px;margin:3px 0">${s}</li>`).join('');

  resDiv.innerHTML = `
    <h3>Optimal Study Plan (${capacity} hours available)</h3>
    <table style="width:100%;border-collapse:collapse;margin:14px 0;font-size:14px">
      <thead><tr style="background:#e0f2fe">
        <th style="padding:8px 12px;text-align:left">Selected Topic</th>
        <th style="padding:8px 12px">Hours</th>
        <th style="padding:8px 12px">Importance</th>
      </tr></thead>
      <tbody>${topicRows}</tbody>
      <tfoot><tr style="background:#f8fafc;font-weight:bold">
        <td style="padding:8px 12px">TOTAL</td>
        <td style="padding:8px 12px;text-align:center">${totalHours}h / ${capacity}h</td>
        <td style="padding:8px 12px;text-align:center"><span class="highlight">${totalImportance} pts</span></td>
      </tr></tfoot>
    </table>
    <details style="margin-top:8px">
      <summary style="cursor:pointer;font-size:13px;color:#666;font-weight:bold">▶ All topics (picked vs skipped)</summary>
      <table style="width:100%;border-collapse:collapse;margin-top:8px;font-size:13px">
        <thead><tr style="background:#f1f5f9">
          <th style="padding:6px 12px;text-align:left">Topic</th>
          <th style="padding:6px 12px">Hours</th>
          <th style="padding:6px 12px">Importance</th>
        </tr></thead>
        <tbody>${allRows}</tbody>
      </table>
    </details>
    <details style="margin-top:12px">
      <summary style="cursor:pointer;font-size:13px;color:#0369a1;font-weight:bold">▶ Show DP algorithm steps</summary>
      <ul style="margin-top:10px">${stepsHTML}</ul>
    </details>
    <p style="margin-top:14px;font-size:13px;color:#666">
      <strong>Why DP?</strong> The knapsack table stores sub-problem solutions so they're never 
      recomputed — guaranteeing the globally best topic selection within your time limit.
    </p>`;
}

function initDP() { renderTopicRows(); }