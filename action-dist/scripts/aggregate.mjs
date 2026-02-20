// apps/test-processing/scripts/aggregate.ts
import { readFile, writeFile, readdir } from "fs/promises";
import { existsSync } from "fs";
import path from "path";
function calculateP95(values) {
  if (values.length === 0) return 0;
  const sorted = [...values].sort((a, b) => a - b);
  const index = Math.ceil(0.95 * sorted.length) - 1;
  return sorted[Math.max(0, index)];
}
function isValidRunData(data) {
  if (typeof data !== "object" || data === null) return false;
  const obj = data;
  return typeof obj.runId === "string" && Array.isArray(obj.tests) && obj.tests.every(
    (t) => typeof t === "object" && t !== null && typeof t.name === "string" && typeof t.durationMs === "number" && ["passed", "failed"].includes(t.status)
  );
}
async function loadExistingData(outputFile) {
  if (!existsSync(outputFile)) {
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
  const content = await readFile(outputFile, "utf-8");
  return JSON.parse(content);
}
async function findNewFiles(dataDir2, processedFiles) {
  const allFiles = await readdir(dataDir2);
  return allFiles.filter(
    (f) => f.endsWith(".json") && f !== "main-test-data.json" && f !== "index.json" && !processedFiles.has(f)
  );
}
async function loadRunData(filepath) {
  try {
    const content = await readFile(filepath, "utf-8");
    const data = JSON.parse(content);
    if (!isValidRunData(data)) {
      console.warn(`Invalid data format in ${filepath}, skipping`);
      return null;
    }
    return data;
  } catch (error) {
    console.warn(`Failed to parse ${filepath}: ${error}, skipping`);
    return null;
  }
}
function processTestRun(data, durations, runData, filename) {
  data.meta.totalRuns++;
  data.meta.processedFiles.push(filename);
  for (const test of runData.tests) {
    if (!data.tests[test.name]) {
      data.tests[test.name] = {
        totalRuns: 0,
        passCount: 0,
        failCount: 0,
        avgDurationMs: 0,
        p95DurationMs: 0
      };
      durations.set(test.name, []);
    }
    const stats = data.tests[test.name];
    stats.totalRuns++;
    stats[test.status === "passed" ? "passCount" : "failCount"]++;
    durations.get(test.name).push(test.durationMs);
  }
}
function recalculateStats(data, durations) {
  for (const [testName, stats] of Object.entries(data.tests)) {
    const testDurations = durations.get(testName) || [];
    if (testDurations.length > 0) {
      stats.avgDurationMs = Math.round(
        testDurations.reduce((a, b) => a + b, 0) / testDurations.length
      );
      stats.p95DurationMs = calculateP95(testDurations);
    }
  }
}
async function aggregate(dataDir2) {
  const outputFile = path.join(dataDir2, "main-test-data.json");
  const data = await loadExistingData(outputFile);
  const processedSet = new Set(data.meta.processedFiles);
  const newFiles = await findNewFiles(dataDir2, processedSet);
  if (newFiles.length === 0) {
    console.log("No new files to process");
    return false;
  }
  console.log(`Processing ${newFiles.length} new files...`);
  const durations = /* @__PURE__ */ new Map();
  for (const [testName, stats] of Object.entries(data.tests)) {
    durations.set(testName, Array(stats.totalRuns).fill(stats.avgDurationMs));
  }
  for (const filename of newFiles) {
    const filepath = path.join(dataDir2, filename);
    const runData = await loadRunData(filepath);
    if (runData) {
      processTestRun(data, durations, runData, filename);
    }
  }
  recalculateStats(data, durations);
  data.meta.lastAggregatedAt = (/* @__PURE__ */ new Date()).toISOString();
  await writeFile(outputFile, JSON.stringify(data, null, 2));
  console.log(`Aggregated ${data.meta.totalRuns} runs, ${Object.keys(data.tests).length} tests`);
  console.log(`Output: ${outputFile}`);
  return true;
}
var dataDir = process.argv[2] || "data";
aggregate(dataDir).catch(console.error);
