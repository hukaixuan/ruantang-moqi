#!/usr/bin/env node
/**
 * Local screenshot helper for 软糖情侣默契测试.
 * Forces start / question / result states via injected JS (Ruantang.*), not URL params.
 *
 * Usage:
 *   python3 -m http.server 8769
 *   node tools/screenshot.mjs
 */
import { spawn } from "node:child_process";
import { setTimeout as sleep } from "node:timers/promises";
import fs from "node:fs";
import http from "node:http";

const PORT = process.env.PORT || "8769";
const BASE = (process.env.BASE || `http://127.0.0.1:${PORT}/`).replace(/\/?$/, "/");
const OUT = process.env.OUT || "/tmp/ruantang-shots";
const CHROME = process.env.CHROME || "google-chrome";
const DEBUG_PORT = Number(process.env.DEBUG_PORT || "9335");
const W = 390;
const H = 844;

fs.mkdirSync(OUT, { recursive: true });

function waitHttp(port, path, ms) {
  const start = Date.now();
  return new Promise((resolve, reject) => {
    const tryOnce = () => {
      const req = http.get({ host: "127.0.0.1", port, path, timeout: 600 }, (res) => {
        const chunks = [];
        res.on("data", (c) => chunks.push(c));
        res.on("end", () => resolve({ status: res.statusCode, body: Buffer.concat(chunks).toString("utf8") }));
      });
      req.on("error", () => {
        if (Date.now() - start > ms) reject(new Error("timeout waiting for :" + port + path));
        else setTimeout(tryOnce, 80);
      });
      req.on("timeout", () => {
        req.destroy();
        if (Date.now() - start > ms) reject(new Error("timeout waiting for :" + port + path));
        else setTimeout(tryOnce, 80);
      });
    };
    tryOnce();
  });
}

function connectWs(url) {
  const ws = new WebSocket(url);
  let nextId = 0;
  const pending = new Map();
  const consoleMessages = [];
  const pageErrors = [];
  ws.addEventListener("message", (ev) => {
    const msg = JSON.parse(String(ev.data));
    if (msg.id != null && pending.has(msg.id)) {
      const { resolve, reject } = pending.get(msg.id);
      pending.delete(msg.id);
      if (msg.error) reject(new Error(msg.method + " " + JSON.stringify(msg.error)));
      else resolve(msg.result);
      return;
    }
    const m = msg.method;
    const p = msg.params || {};
    if (m === "Runtime.consoleAPICalled") {
      const text = (p.args || []).map((a) => a.value ?? a.description ?? a.type).join(" ");
      consoleMessages.push({ type: p.type, text });
    } else if (m === "Runtime.exceptionThrown") {
      const d = p.exceptionDetails || {};
      pageErrors.push(d.text || (d.exception && d.exception.description) || "exception");
    }
  });
  const ready = new Promise((resolve, reject) => {
    ws.addEventListener("open", resolve);
    ws.addEventListener("error", reject);
  });
  function send(method, params, sessionId) {
    const id = ++nextId;
    const payload = { id, method, params };
    if (sessionId) payload.sessionId = sessionId;
    return new Promise((resolve, reject) => {
      pending.set(id, { resolve, reject });
      ws.send(JSON.stringify(payload));
      setTimeout(() => {
        if (pending.has(id)) {
          pending.delete(id);
          reject(new Error("CDP timeout: " + method));
        }
      }, 20000);
    });
  }
  return { ws, ready, send, consoleMessages, pageErrors };
}

const userDir = "/tmp/ruantang-chrome-profile-" + process.pid;
fs.mkdirSync(userDir, { recursive: true });

const chrome = spawn(CHROME, [
  "--headless=new",
  "--disable-gpu",
  "--no-sandbox",
  "--disable-dev-shm-usage",
  "--hide-scrollbars",
  "--no-first-run",
  "--no-default-browser-check",
  "--disable-http-cache",
  "--force-device-scale-factor=2",
  `--remote-debugging-port=${DEBUG_PORT}`,
  `--user-data-dir=${userDir}`,
  "about:blank"
], { stdio: ["ignore", "pipe", "pipe"] });

let stderr = "";
chrome.stderr.on("data", (d) => { stderr += d.toString(); });

let failed = false;
try {
  await waitHttp(DEBUG_PORT, "/json/version", 10000);
  const ver = JSON.parse((await waitHttp(DEBUG_PORT, "/json/version", 2000)).body);
  const browser = connectWs(ver.webSocketDebuggerUrl);
  await browser.ready;

  const created = await browser.send("Target.createTarget", { url: "about:blank" });
  const attached = await browser.send("Target.attachToTarget", {
    targetId: created.targetId,
    flatten: true
  });
  const sid = attached.sessionId;
  const send = (method, params) => browser.send(method, params, sid);

  await send("Runtime.enable");
  await send("Page.enable");
  await send("Network.enable");
  await send("Emulation.setDeviceMetricsOverride", {
    width: W,
    height: H,
    deviceScaleFactor: 2,
    mobile: true
  });
  await send("Emulation.setTouchEmulationEnabled", { enabled: true });

  const failedRequests = [];
  browser.ws.addEventListener("message", (ev) => {
    const msg = JSON.parse(String(ev.data));
    if (msg.method === "Network.responseReceived" && msg.sessionId === sid) {
      const r = msg.params.response;
      const status = r.status;
      if (status >= 400) failedRequests.push({ url: r.url, status });
    }
    if (msg.method === "Network.loadingFailed" && msg.sessionId === sid) {
      const p = msg.params;
      failedRequests.push({ url: (p.requestId || "") + " " + (p.errorText || "failed"), status: 0 });
    }
  });

  async function screenshot(name) {
    const res = await send("Page.captureScreenshot", { format: "png", fromSurface: true });
    const file = `${OUT}/${name}.png`;
    fs.writeFileSync(file, Buffer.from(res.data, "base64"));
    console.log("wrote", file, fs.statSync(file).size);
    return file;
  }

  async function evaluate(expression) {
    const res = await send("Runtime.evaluate", {
      expression,
      awaitPromise: true,
      returnByValue: true
    });
    if (res.exceptionDetails) {
      throw new Error("eval failed: " + JSON.stringify(res.exceptionDetails.text || res.exceptionDetails));
    }
    return res.result ? res.result.value : undefined;
  }

  const nav = await send("Page.navigate", { url: BASE + "index.html" });
  await send("Page.loadEventFired").catch(() => {});
  await sleep(250);
  await evaluate(`
    (async function () {
      if (document.fonts) await document.fonts.ready;
      var start = Date.now();
      while (!window.Ruantang && Date.now() - start < 4000) {
        await new Promise(function (r) { setTimeout(r, 50); });
      }
      return !!window.Ruantang;
    })()
  `);
  await sleep(200);

  const startInfo = await evaluate(`({
    title: document.title,
    hasLogo: !!document.querySelector('.logo'),
    screen: document.getElementById('screen-start') && !document.getElementById('screen-start').hidden,
    qCount: window.Ruantang && window.Ruantang.QUESTIONS.length,
    tierCount: window.Ruantang && window.Ruantang.TIERS.length,
    href: location.href,
    search: location.search
  })`);
  console.log("start", JSON.stringify(startInfo));
  if (!startInfo || startInfo.qCount !== 10 || startInfo.tierCount < 6) {
    throw new Error("start API unexpected: " + JSON.stringify(startInfo));
  }
  if (startInfo.search) {
    throw new Error("page opened with query string, refused: " + startInfo.search);
  }
  await screenshot("start");

  const questionInfo = await evaluate(`
    (async function () {
      window.Ruantang.goToQuestion(2, [0, 1]);
      await new Promise(function (r) { setTimeout(r, 80); });
      var q = document.getElementById("quiz-question");
      var opts = document.querySelectorAll("#quiz-options .opt");
      return {
        ok: true,
        question: q && q.textContent,
        optionCount: opts.length,
        quizShown: document.getElementById("screen-quiz") && !document.getElementById("screen-quiz").hidden,
        progress: document.getElementById("progress-label") && document.getElementById("progress-label").textContent
      };
    })()
  `);
  console.log("question", JSON.stringify(questionInfo));
  await sleep(200);
  await screenshot("question");

  const high = [0, 1, 0, 3, 2, 0, 0, 3, 0, 0];
  const resultInfo = await evaluate(`
    (async function () {
      var answers = ${JSON.stringify(high)};
      window.Ruantang.showResult(answers, { animate: false });
      await new Promise(function (r) { setTimeout(r, 160); });
      var card = document.getElementById("card");
      var res = window.Ruantang.computeResult(answers);
      var again = window.Ruantang.computeResult(answers);
      return {
        ok: true,
        resultShown: document.getElementById("screen-result") && !document.getElementById("screen-result").hidden,
        cardSize: card ? [card.width, card.height] : null,
        percent: res.percent,
        title: res.title,
        comment: res.comment,
        deterministic: res.percent === again.percent && res.title === again.title && res.comment === again.comment
      };
    })()
  `);
  console.log("result", JSON.stringify(resultInfo));
  if (!resultInfo || !resultInfo.deterministic) {
    throw new Error("result is not deterministic");
  }
  await sleep(200);
  await screenshot("result");

  const dataUrl = await evaluate(`document.getElementById("card").toDataURL("image/png")`);
  if (typeof dataUrl === "string" && dataUrl.startsWith("data:image/png")) {
    const buf = Buffer.from(dataUrl.split(",")[1], "base64");
    const file = `${OUT}/card-export.png`;
    fs.writeFileSync(file, buf);
    console.log("wrote", file, buf.length, "dims check via header");
  }

  const extra = [
    ["result-mid", [1, 2, 1, 0, 1, 2, 2, 0, 2, 2]],
    ["result-low", [3, 3, 3, 2, 3, 3, 3, 2, 2, 3]]
  ];
  for (const [name, answers] of extra) {
    const info = await evaluate(
      "(async function () { var answers = " + JSON.stringify(answers) + ";" +
      "window.Ruantang.showResult(answers, { animate: false });" +
      "await new Promise(function (r) { setTimeout(r, 160); });" +
      "var res = window.Ruantang.computeResult(answers);" +
      "var url = document.getElementById('card').toDataURL('image/png');" +
      "return { percent: res.percent, title: res.title, comment: res.comment, url: url };" +
      "})()"
    );
    console.log(name, JSON.stringify({ percent: info.percent, title: info.title, comment: info.comment }));
    await sleep(160);
    await screenshot(name);
    if (info && typeof info.url === "string" && info.url.startsWith("data:image/png")) {
      const buf = Buffer.from(info.url.split(",")[1], "base64");
      const file = OUT + "/card-" + name + ".png";
      fs.writeFileSync(file, buf);
      console.log("wrote", file, buf.length);
    }
  }

  const logic = await evaluate(`
    (function () {
      var R = window.Ruantang;
      var n = R.QUESTIONS.length;
      function vec(fill) {
        var a = [];
        for (var i = 0; i < n; i++) a.push(typeof fill === "function" ? fill(i) : fill);
        return a;
      }
      var allHigh = vec(function (i) {
        var opts = R.QUESTIONS[i].options;
        var best = 0;
        for (var j = 1; j < opts.length; j++) if (opts[j].score > opts[best].score) best = j;
        return best;
      });
      var allLow = vec(function (i) {
        var opts = R.QUESTIONS[i].options;
        var worst = 0;
        for (var j = 1; j < opts.length; j++) if (opts[j].score < opts[worst].score) worst = j;
        return worst;
      });
      var mid = vec(1);
      var cases = {
        high: R.computeResult(allHigh),
        low: R.computeResult(allLow),
        mid: R.computeResult(mid)
      };
      var titles = {};
      // brute a bunch of patterns to see reachable tiers
      var reached = {};
      function mark(a) { reached[R.computeResult(a).title] = true; }
      mark(allHigh); mark(allLow); mark(mid);
      for (var p = 0; p < 4; p++) mark(vec(p));
      for (var k = 0; k < 80; k++) {
        mark(vec(function (i) { return (i * 3 + k) % R.QUESTIONS[i].options.length; }));
      }
      var hrefHasDebug = /[?&](shot|debug|autotest|demo|over)=/.test(location.href);
      var srcHasDebug = !!(document.documentElement.innerHTML.match(/location\\.search|URLSearchParams|\\?shot=|\\?autotest/));
      return {
        cases: {
          high: { percent: cases.high.percent, title: cases.high.title },
          mid: { percent: cases.mid.percent, title: cases.mid.title },
          low: { percent: cases.low.percent, title: cases.low.title }
        },
        reached: Object.keys(reached),
        tierCount: R.TIERS.length,
        hrefHasDebug: hrefHasDebug,
        srcLooksLikeDebugParams: srcHasDebug
      };
    })()
  `);
  console.log("logic", JSON.stringify(logic));
  if (logic.reached.length < 6) {
    console.warn("WARNING: fewer than 6 tiers reached in sampling:", logic.reached);
  }
  if (logic.hrefHasDebug || logic.srcLooksLikeDebugParams) {
    failed = true;
    console.error("debug URL params detected");
  }

  const errors = browser.pageErrors.slice();
  const consoleErrs = browser.consoleMessages.filter((m) => m.type === "error" || m.type === "warning");
  console.log("pageErrors", JSON.stringify(errors));
  console.log("console", JSON.stringify(consoleErrs));
  console.log("failedRequests", JSON.stringify(failedRequests));
  fs.writeFileSync(`${OUT}/report.json`, JSON.stringify({
    startInfo, questionInfo, resultInfo, logic, errors,
    console: browser.consoleMessages, failedRequests
  }, null, 2));
  if (errors.length || failedRequests.length) failed = true;
  if (consoleErrs.some((m) => m.type === "error")) failed = true;
} catch (err) {
  failed = true;
  console.error("SCREENSHOT FAILED", err);
  console.error("chrome stderr:", stderr.slice(-2000));
} finally {
  try { chrome.kill("SIGTERM"); } catch (e) {}
  await sleep(200);
  try { chrome.kill("SIGKILL"); } catch (e) {}
}

process.exit(failed ? 1 : 0);
