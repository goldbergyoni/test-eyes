// apps/test-processing/scripts/aggregate.js
import { readFileSync, writeFileSync, readdirSync, existsSync } from "fs";
var DATA_DIR = process.argv[2] || "data";
var OUTPUT_FILE = `${DATA_DIR}/main-test-data.json`;
function loadExistingData() {
  if (existsSync(OUTPUT_FILE)) {
    return JSON.parse(readFileSync(OUTPUT_FILE, "utf-8"));
  }
  return {
    schemaVersion: "1.0.0",
    meta: {
      totalRuns: 0,
      lastAggregatedAt: null,
      processedFiles: []
    },
    tests: {}
  };
}
function findNewFiles(processedFiles) {
  const allFiles = readdirSync(DATA_DIR).filter(
    (f) => f.endsWith(".json") && f !== "main-test-data.json" && f !== "index.json"
  );
  return allFiles.filter((f) => !processedFiles.includes(f));
}
function calculateP95(values) {
  if (values.length === 0) return 0;
  const sorted = [...values].sort((a, b) => a - b);
  const index = Math.ceil(0.95 * sorted.length) - 1;
  return sorted[Math.max(0, index)];
}
function aggregate() {
  const data = loadExistingData();
  const newFiles = findNewFiles(data.meta.processedFiles);
  if (newFiles.length === 0) {
    console.log("No new files to process");
    return false;
  }
  console.log(`Processing ${newFiles.length} new files...`);
  const durations = {};
  for (const [testName, stats] of Object.entries(data.tests)) {
    durations[testName] = Array(stats.totalRuns).fill(stats.avgDurationMs);
  }
  for (const filename of newFiles) {
    const filepath = `${DATA_DIR}/${filename}`;
    let runData;
    try {
      runData = JSON.parse(readFileSync(filepath, "utf-8"));
    } catch (e) {
      console.warn(`Skipping ${filename}: invalid JSON`);
      continue;
    }
    if (!Array.isArray(runData.tests)) {
      console.warn(`Skipping ${filename}: missing tests array`);
      continue;
    }
    data.meta.totalRuns++;
    data.meta.processedFiles.push(filename);
    for (const test of runData.tests) {
      const name = test.name;
      if (!data.tests[name]) {
        data.tests[name] = {
          totalRuns: 0,
          passCount: 0,
          failCount: 0,
          avgDurationMs: 0,
          p95DurationMs: 0
        };
        durations[name] = [];
      }
      const stats = data.tests[name];
      stats.totalRuns++;
      if (test.status === "passed") {
        stats.passCount++;
      } else {
        stats.failCount++;
      }
      durations[name].push(test.durationMs);
    }
  }
  for (const [testName, stats] of Object.entries(data.tests)) {
    const testDurations = durations[testName];
    stats.avgDurationMs = Math.round(
      testDurations.reduce((a, b) => a + b, 0) / testDurations.length
    );
    stats.p95DurationMs = calculateP95(testDurations);
  }
  data.meta.lastAggregatedAt = (/* @__PURE__ */ new Date()).toISOString();
  writeFileSync(OUTPUT_FILE, JSON.stringify(data, null, 2));
  console.log(`Aggregated ${data.meta.totalRuns} runs, ${Object.keys(data.tests).length} tests`);
  console.log(`Output: ${OUTPUT_FILE}`);
  return true;
}
aggregate();
