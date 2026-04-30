// ─────────────────────────────────────────────────────────────
//  ALGOPATH — GREEDY ALGORITHM
//  Dijkstra's Shortest Study Path Finder
//  Finds the optimal (lowest difficulty cost) path between topics
// ─────────────────────────────────────────────────────────────

const STUDY_GRAPH = {
  "Arrays":               { "Linked Lists": 2, "Strings": 1 },
  "Strings":              { "Arrays": 1, "Recursion": 3 },
  "Linked Lists":         { "Arrays": 2, "Stacks": 2, "Queues": 2 },
  "Stacks":               { "Linked Lists": 2, "Trees": 4 },
  "Queues":               { "Linked Lists": 2, "Trees": 3 },
  "Recursion":            { "Strings": 3, "Trees": 2, "Dynamic Programming": 5 },
  "Trees":                { "Stacks": 4, "Queues": 3, "Graphs": 4 },
  "Graphs":               { "Trees": 4, "Dynamic Programming": 3 },
  "Dynamic Programming":  { "Recursion": 5, "Graphs": 3 },
};

function dijkstra(graph, start, end) {
  const nodes   = Object.keys(graph);
  const dist    = {};
  const prev    = {};
  const visited = new Set();

  nodes.forEach(n => { dist[n] = Infinity; prev[n] = null; });
  dist[start] = 0;

  const steps = [];
  steps.push(`Start: Set distance of "${start}" = 0, all others = ∞`);

  while (true) {
    let u = null;
    nodes.forEach(n => {
      if (!visited.has(n) && (u === null || dist[n] < dist[u])) u = n;
    });

    if (u === null || dist[u] === Infinity) break;
    if (u === end) break;

    visited.add(u);
    steps.push(`Greedy pick: Visit "${u}" (cost so far: ${dist[u]})`);

    const neighbors = graph[u] || {};
    Object.entries(neighbors).forEach(([v, weight]) => {
      const alt = dist[u] + weight;
      if (alt < dist[v]) {
        dist[v] = alt;
        prev[v] = u;
        steps.push(`  → Relax "${u}" → "${v}": new cost = ${alt}`);
      }
    });
  }

  const path = [];
  let cur = end;
  while (cur !== null) { path.unshift(cur); cur = prev[cur]; }
  if (path[0] !== start) return { path: [], cost: Infinity, steps };
  return { path, cost: dist[end], steps };
}

function runGreedy() {
  const start  = document.getElementById('g-start').value;
  const end    = document.getElementById('g-end').value;
  const resDiv = document.getElementById('greedy-result');

  if (start === end) {
    resDiv.style.display = 'block';
    resDiv.innerHTML = `<h3>Result</h3><p>Start and end topic are the same!</p>`;
    return;
  }

  const { path, cost, steps } = dijkstra(STUDY_GRAPH, start, end);
  resDiv.style.display = 'block';

  if (path.length === 0) {
    resDiv.innerHTML = `<h3>No path found</h3><p>These topics are not connected.</p>`;
    return;
  }

  const pathHTML  = path.map((t, i) =>
    `<span class="step">${i === 0 ? '🟢' : i === path.length - 1 ? '🏁' : '➡️'} ${t}</span>`
  ).join('');
  const stepsHTML = steps.map(s => `<li style="color:#555;font-size:13px">${s}</li>`).join('');

  resDiv.innerHTML = `
    <h3>Optimal Study Path Found</h3>
    <p><strong>From:</strong> ${start} &nbsp;→&nbsp; <strong>To:</strong> ${end}</p>
    <p style="margin:10px 0 6px"><strong>Path (${path.length} topics · total cost: <span class="highlight">${cost}</span>):</strong></p>
    ${pathHTML}
    <details style="margin-top:14px">
      <summary style="cursor:pointer;font-size:13px;color:#0369a1;font-weight:bold">▶ Show algorithm steps</summary>
      <ul style="margin-top:10px">${stepsHTML}</ul>
    </details>
    <p style="margin-top:12px;font-size:13px;color:#666">
      <strong>Why Greedy?</strong> Dijkstra always picks the unvisited topic with the lowest 
      accumulated cost — guaranteeing the shortest path.
    </p>`;
}

function initGreedy() {
  const topics = Object.keys(STUDY_GRAPH);
  ['g-start', 'g-end'].forEach(id => {
    const sel = document.getElementById(id);
    topics.forEach(t => {
      const opt = document.createElement('option');
      opt.value = opt.textContent = t;
      sel.appendChild(opt);
    });
  });
  document.getElementById('g-end').value = 'Dynamic Programming';
}