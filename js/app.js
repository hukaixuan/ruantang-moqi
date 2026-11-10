/* 软糖情侣默契测试 — static H5, no third-party libs */
(function () {
  "use strict";

  var FONT =
    '"Noto Sans CJK SC", "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", "Heiti SC", "Source Han Sans SC", sans-serif';

  var STICKER_FILES = {
    s01: "assets/stickers/s01.png",
    s03: "assets/stickers/s03.png",
    s05: "assets/stickers/s05.png",
    s07: "assets/stickers/s07.png",
    s08: "assets/stickers/s08.png",
    s09: "assets/stickers/s09.png",
    s10: "assets/stickers/s10.png",
    s12: "assets/stickers/s12.png",
    s17: "assets/stickers/s17.png",
    s19: "assets/stickers/s19.png",
    s23: "assets/stickers/s23.png",
    s24: "assets/stickers/s24.png"
  };

  var QUESTIONS = [
    {
      sticker: "s01",
      text: "周末两个人终于都有空，第一反应是？",
      options: [
        { text: "一起赖床，睡到自然醒", score: 10 },
        { text: "出门觅食，早饭直接吃成午饭", score: 8 },
        { text: "先把攒了很久的家务一次性清掉", score: 6 },
        { text: "各自忙一会儿，晚上再会合", score: 3 }
      ]
    },
    {
      sticker: "s10",
      text: "对方说「我没事」，你通常会？",
      options: [
        { text: "先信，但还是再轻轻确认一句", score: 9 },
        { text: "立刻端上零食和一杯热水", score: 10 },
        { text: "先观察三秒，再决定要不要追问", score: 7 },
        { text: "回一句「那我先去洗澡了」", score: 3 }
      ]
    },
    {
      sticker: "s05",
      text: "点外卖卡在「你想吃什么」已经三分钟了？",
      options: [
        { text: "甩出三家收藏店，让对方挑", score: 10 },
        { text: "说「你定，我都好」，然后开始否决", score: 6 },
        { text: "直接复购上次那家，不再犹豫", score: 8 },
        { text: "干脆自己下楼买，顺便带一杯奶茶", score: 3 }
      ]
    },
    {
      sticker: "s17",
      text: "空调遥控器在谁手里，房间最可能变成？",
      options: [
        { text: "两个人轮流改，来回拔河", score: 6 },
        { text: "夏天的冰箱，盖着被子吹风", score: 7 },
        { text: "冬天的火锅店，短袖也能出汗", score: 3 },
        { text: "谁先睡着，谁就暂时说了算", score: 10 }
      ]
    },
    {
      sticker: "s03",
      text: "发现对方把你的自拍设成了壁纸，你会？",
      options: [
        { text: "偷偷高兴，再发一张过去", score: 9 },
        { text: "说「能不能换张好看的」，嘴上嫌弃", score: 7 },
        { text: "默默也把对方设成壁纸", score: 10 },
        { text: "装作没看见，心里已经转了三圈", score: 4 }
      ]
    },
    {
      sticker: "s19",
      text: "晚饭后最容易一起做的事是？",
      options: [
        { text: "窝着刷同一部剧，还要同步进度条", score: 10 },
        { text: "出门散步，一边走一边点评今天", score: 8 },
        { text: "打游戏，输的人负责洗碗", score: 7 },
        { text: "各玩各的，但坐在同一张沙发上", score: 3 }
      ]
    },
    {
      sticker: "s12",
      text: "收到「到家了吗」这条消息，你觉得这是？",
      options: [
        { text: "关心，必须秒回", score: 10 },
        { text: "想我了，可以顺便撒个娇", score: 8 },
        { text: "报个平安，回个表情包就好", score: 6 },
        { text: "日常问候，和「吃饭了吗」差不多", score: 3 }
      ]
    },
    {
      sticker: "s05",
      text: "两个人同时盯着冰箱，最可能先说出的是？",
      options: [
        { text: "「好像没什么能吃的」（其实还有菜）", score: 7 },
        { text: "「要不要叫外卖？」", score: 8 },
        { text: "「今晚谁做饭？」然后陷入短暂沉默", score: 3 },
        { text: "「走，我们去逛超市吧」", score: 9 }
      ]
    },
    {
      sticker: "s10",
      text: "对方今天心情不太好，你会先做哪件？",
      options: [
        { text: "递上抱枕和一杯热水", score: 10 },
        { text: "安静陪着，等对方想说再听", score: 9 },
        { text: "讲个不太高明的笑话，试试效果", score: 5 },
        { text: "提议出门走走，换换空气", score: 8 }
      ]
    },
    {
      sticker: "s24",
      text: "如果用一种食物形容你们的相处，更像？",
      options: [
        { text: "软糖，甜软还有点黏", score: 10 },
        { text: "火锅，热热闹闹什么都煮得下", score: 8 },
        { text: "茶叶蛋，要慢慢入味", score: 7 },
        { text: "柠檬茶，酸甜刚好解腻", score: 3 }
      ]
    }
  ];

  var TIERS = [
    {
      id: "soul",
      min: 95,
      title: "灵魂伴侣",
      sticker: "s24",
      comments: [
        "你们大概连对方想喝什么奶茶都不用问。",
        "这种默契，属于软糖夹心都是同一味道的那种。",
        "不必炫耀，但今晚可以小小得意一下。"
      ]
    },
    {
      id: "telepathy",
      min: 87,
      title: "心有灵犀",
      sticker: "s08",
      comments: [
        "一个眼神过去，答案已经到了。",
        "还算不上读心术，但已经很接近了。",
        "日常里那些对上的瞬间，比想象中多。"
      ]
    },
    {
      id: "sweet",
      min: 78,
      title: "甜蜜搭档",
      sticker: "s07",
      comments: [
        "一个负责甜，一个负责黏，刚刚好。",
        "不必事事相同，一起笑就已经很加分。",
        "像两颗并排的软糖，挤一挤更甜。"
      ]
    },
    {
      id: "justRight",
      min: 66,
      title: "刚刚好的缘分",
      sticker: "s12",
      comments: [
        "不必完美同步，节奏对上就很好。",
        "你们是那种越处越对味的组合。",
        "默契还在发酵，味道已经挺香了。"
      ]
    },
    {
      id: "adjusting",
      min: 52,
      title: "还在磨合中",
      sticker: "s17",
      comments: [
        "遥控器还在拔河，但晚饭已经会一起点了。",
        "分歧都是小事，重要的是还想往一块儿凑。",
        "磨合期不可怕，可怕的是没人先递软糖。"
      ]
    },
    {
      id: "reverse",
      min: 38,
      title: "反向默契担当",
      sticker: "s19",
      comments: [
        "一个向左一个向右，最后还是会碰上。",
        "意见相反也没关系，笑点居然还能对上。",
        "你们的默契藏在抬杠里，也挺可爱。"
      ]
    },
    {
      id: "bickering",
      min: 0,
      title: "欢喜冤家",
      sticker: "s10",
      comments: [
        "天天拌嘴，偏偏谁也离不开谁。",
        "默契值先欠着，下顿火锅再补回来。",
        "答案不太一样，但还是想把这张卡片发给对方。"
      ]
    }
  ];

  var images = {};
  var els = {};
  var state = {
    mode: "start",
    index: 0,
    answers: [],
    result: null,
    date: new Date(),
    computeTimer: 0
  };

  function $(id) {
    return document.getElementById(id);
  }

  function clamp(n, a, b) {
    return Math.max(a, Math.min(b, n));
  }

  function hashAnswers(answers) {
    var h = 2166136261;
    for (var i = 0; i < answers.length; i++) {
      h ^= (answers[i] + 1) * (i + 17);
      h = Math.imul(h, 16777619);
    }
    return h >>> 0;
  }

  function tierFor(percent) {
    for (var i = 0; i < TIERS.length; i++) {
      if (percent >= TIERS[i].min) return TIERS[i];
    }
    return TIERS[TIERS.length - 1];
  }

  function computeResult(answers) {
    if (!answers || answers.length !== QUESTIONS.length) {
      throw new Error("answers length must be " + QUESTIONS.length);
    }
    var sum = 0;
    for (var i = 0; i < answers.length; i++) {
      var q = QUESTIONS[i];
      var idx = answers[i];
      if (idx < 0 || idx >= q.options.length) {
        throw new Error("invalid option at question " + (i + 1));
      }
      sum += q.options[idx].score;
    }
    var h = hashAnswers(answers);
    var jitter = (h % 7) - 3;
    var percent = clamp(sum + jitter, 28, 100);
    var tier = tierFor(percent);
    var comment = tier.comments[h % tier.comments.length];
    return {
      percent: percent,
      sum: sum,
      jitter: jitter,
      hash: h,
      title: tier.title,
      tier: tier,
      comment: comment,
      sticker: tier.sticker
    };
  }

  function formatDate(d) {
    d = d || new Date();
    return d.getFullYear() + "年" + (d.getMonth() + 1) + "月" + d.getDate() + "日";
  }

  function dateStamp(d) {
    d = d || new Date();
    var m = String(d.getMonth() + 1);
    var day = String(d.getDate());
    if (m.length < 2) m = "0" + m;
    if (day.length < 2) day = "0" + day;
    return String(d.getFullYear()) + m + day;
  }

  function shareText(result, date) {
    return (
      "我刚测了「软糖情侣默契测试」，我们的默契值是 " +
      result.percent +
      "%，称号是「" +
      result.title +
      "」。\n" +
      result.comment +
      "\n你也来测测？"
    );
  }

  function fileNameFor(result, date) {
    return "软糖默契-" + result.percent + "-" + result.title + "-" + dateStamp(date) + ".png";
  }

  /* ---------- canvas helpers ---------- */
  function roundedRect(ctx, x, y, w, h, r) {
    var rr = Math.min(r, w / 2, h / 2);
    ctx.beginPath();
    ctx.moveTo(x + rr, y);
    ctx.arcTo(x + w, y, x + w, y + h, rr);
    ctx.arcTo(x + w, y + h, x, y + h, rr);
    ctx.arcTo(x, y + h, x, y, rr);
    ctx.arcTo(x, y, x + w, y, rr);
    ctx.closePath();
  }

  function isHangPunct(ch) {
    return /[，。！？、；：…—』」》)）]/.test(ch);
  }

  function wrapText(ctx, text, maxWidth) {
    var chars = String(text).split("");
    var lines = [];
    var line = "";
    for (var i = 0; i < chars.length; i++) {
      var next = line + chars[i];
      if (line && ctx.measureText(next).width > maxWidth) {
        if (isHangPunct(chars[i])) {
          line = next;
        } else {
          lines.push(line);
          line = chars[i];
        }
      } else {
        line = next;
      }
    }
    if (line) lines.push(line);
    return lines;
  }

  function drawHeart(ctx, x, y, s, fill, stroke) {
    ctx.save();
    ctx.translate(x, y);
    ctx.beginPath();
    ctx.moveTo(0, s * 0.3);
    ctx.bezierCurveTo(-s * 0.15, -s * 0.2, -s * 0.7, -s * 0.05, -s * 0.7, s * 0.28);
    ctx.bezierCurveTo(-s * 0.7, s * 0.7, -s * 0.1, s * 0.95, 0, s * 1.25);
    ctx.bezierCurveTo(s * 0.1, s * 0.95, s * 0.7, s * 0.7, s * 0.7, s * 0.28);
    ctx.bezierCurveTo(s * 0.7, -s * 0.05, s * 0.15, -s * 0.2, 0, s * 0.3);
    ctx.closePath();
    if (fill) {
      ctx.fillStyle = fill;
      ctx.fill();
    }
    if (stroke) {
      ctx.strokeStyle = stroke;
      ctx.lineWidth = Math.max(1.5, s * 0.06);
      ctx.stroke();
    }
    ctx.restore();
  }

  function mulberry32(a) {
    return function () {
      a |= 0;
      a = (a + 0x6d2b79f5) | 0;
      var t = Math.imul(a ^ (a >>> 15), 1 | a);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  function renderCard(canvas, result, date) {
    var ctx = canvas.getContext("2d");
    var W = canvas.width;
    var H = canvas.height;
    var rng = mulberry32(result.hash || 1);

    ctx.clearRect(0, 0, W, H);

    var bg = ctx.createLinearGradient(0, 0, 0, H);
    bg.addColorStop(0, "#fff7f4");
    bg.addColorStop(0.48, "#ffe8ee");
    bg.addColorStop(1, "#e8f4ef");
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, W, H);

    var i;
    for (i = 0; i < 18; i++) {
      var dx = 60 + rng() * (W - 120);
      var dy = 70 + rng() * (H - 140);
      var rad = 10 + rng() * 22;
      ctx.beginPath();
      ctx.fillStyle = rng() > 0.5 ? "rgba(242, 138, 160, 0.11)" : "rgba(126, 184, 168, 0.13)";
      ctx.arc(dx, dy, rad, 0, Math.PI * 2);
      ctx.fill();
    }
    for (i = 0; i < 6; i++) {
      drawHeart(
        ctx,
        80 + rng() * (W - 160),
        90 + rng() * (H - 180),
        14 + rng() * 16,
        rng() > 0.5 ? "rgba(232, 90, 122, 0.12)" : "rgba(126, 184, 168, 0.14)",
        null
      );
    }

    var m = 56;
    roundedRect(ctx, m, m, W - m * 2, H - m * 2, 48);
    ctx.fillStyle = "rgba(255, 255, 255, 0.42)";
    ctx.fill();
    ctx.lineWidth = 6;
    ctx.strokeStyle = "rgba(232, 90, 122, 0.28)";
    ctx.stroke();
    roundedRect(ctx, m + 14, m + 14, W - (m + 14) * 2, H - (m + 14) * 2, 38);
    ctx.lineWidth = 3;
    ctx.strokeStyle = "rgba(126, 184, 168, 0.28)";
    ctx.stroke();

    ctx.font = "700 32px " + FONT;
    ctx.fillStyle = "#4e8f82";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.letterSpacing = "8px";
    if (ctx.letterSpacing !== undefined) ctx.letterSpacing = "8px";
    ctx.fillText("软糖情侣默契测试", W / 2, 128);
    ctx.letterSpacing = "0px";

    ctx.beginPath();
    ctx.strokeStyle = "rgba(232, 90, 122, 0.35)";
    ctx.lineWidth = 2;
    ctx.moveTo(W / 2 - 220, 164);
    ctx.lineTo(W / 2 - 36, 164);
    ctx.moveTo(W / 2 + 36, 164);
    ctx.lineTo(W / 2 + 220, 164);
    ctx.stroke();
    drawHeart(ctx, W / 2, 152, 16, "#f28aa0", null);

    var sticker = images[result.sticker];
    var stickerArea = { x: 180, y: 190, w: W - 360, h: 400 };
    if (sticker && sticker.complete && sticker.naturalWidth) {
      var iw = sticker.naturalWidth;
      var ih = sticker.naturalHeight;
      var s = Math.min(stickerArea.w / iw, stickerArea.h / ih);
      var dw = iw * s;
      var dh = ih * s;
      var sx = stickerArea.x + (stickerArea.w - dw) / 2;
      var sy = stickerArea.y + (stickerArea.h - dh) / 2;
      ctx.drawImage(sticker, sx, sy, dw, dh);
    }

    ctx.font = "700 30px " + FONT;
    ctx.fillStyle = "#8a6f69";
    ctx.textAlign = "center";
    ctx.fillText("默契值", W / 2, 630);

    ctx.font = "900 200px " + FONT;
    ctx.fillStyle = "#e85a7a";
    ctx.textBaseline = "middle";
    var pct = String(result.percent);
    var numW = ctx.measureText(pct).width;
    ctx.font = "800 72px " + FONT;
    var unitW = ctx.measureText("%").width;
    var totalW = numW + unitW + 10;
    var numX = W / 2 - totalW / 2 + numW / 2;
    ctx.font = "900 200px " + FONT;
    ctx.fillText(pct, numX, 760);
    ctx.font = "800 72px " + FONT;
    ctx.fillStyle = "#c74365";
    ctx.fillText("%", numX + numW / 2 + unitW / 2 + 10, 712);

    var pillW = Math.min(W - 280, 560);
    var pillH = 86;
    var pillX = (W - pillW) / 2;
    var pillY = 900;
    roundedRect(ctx, pillX, pillY, pillW, pillH, 43);
    var pillBg = ctx.createLinearGradient(pillX, pillY, pillX + pillW, pillY);
    pillBg.addColorStop(0, "#f28aa0");
    pillBg.addColorStop(1, "#e85a7a");
    ctx.fillStyle = pillBg;
    ctx.fill();
    ctx.font = "800 44px " + FONT;
    ctx.fillStyle = "#fff";
    ctx.textBaseline = "middle";
    ctx.fillText(result.title, W / 2, pillY + pillH / 2 + 2);

    var boxX = 130;
    var boxY = 1028;
    var boxW = W - 260;
    var boxH = 200;
    roundedRect(ctx, boxX, boxY, boxW, boxH, 28);
    ctx.fillStyle = "rgba(255, 255, 255, 0.86)";
    ctx.fill();
    ctx.lineWidth = 3;
    ctx.strokeStyle = "rgba(74, 53, 50, 0.08)";
    ctx.stroke();

    ctx.font = "600 36px " + FONT;
    ctx.fillStyle = "#4a3532";
    ctx.textAlign = "center";
    ctx.textBaseline = "top";
    var lines = wrapText(ctx, result.comment, boxW - 80);
    var lineH = 52;
    var textH = lines.length * lineH;
    var ty = boxY + (boxH - textH) / 2;
    for (i = 0; i < lines.length; i++) {
      ctx.fillText(lines[i], W / 2, ty + i * lineH);
    }

    ctx.font = "600 28px " + FONT;
    ctx.fillStyle = "#8a6f69";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(formatDate(date) + "    作者 hukx", W / 2, H - 108);
  }

  /* ---------- UI ---------- */
  function toast(msg) {
    els.toast.hidden = false;
    els.toast.textContent = msg;
    clearTimeout(toast._t);
    toast._t = setTimeout(function () {
      els.toast.hidden = true;
    }, 1600);
  }

  function showScreen(mode) {
    state.mode = mode;
    var map = {
      start: els.start,
      quiz: els.quiz,
      compute: els.compute,
      result: els.result
    };
    Object.keys(map).forEach(function (key) {
      var node = map[key];
      var on = key === mode;
      if (on) {
        node.hidden = false;
        requestAnimationFrame(function () {
          node.classList.add("active");
        });
      } else {
        node.classList.remove("active");
        node.hidden = true;
      }
    });
  }

  function buildDots() {
    els.dots.innerHTML = "";
    for (var i = 0; i < QUESTIONS.length; i++) {
      var span = document.createElement("span");
      els.dots.appendChild(span);
    }
  }

  function renderProgress() {
    var n = QUESTIONS.length;
    var current = state.index;
    var done = state.answers.length;
    els.progressLabel.textContent = current + 1 + " / " + n;
    els.progressBar.style.width = ((current + 1) / n) * 100 + "%";
    var spans = els.dots.querySelectorAll("span");
    for (var i = 0; i < spans.length; i++) {
      spans[i].className = i < done ? "done" : i === current ? "current" : "";
    }
  }

  function renderQuestion() {
    var q = QUESTIONS[state.index];
    var img = els.quizSticker;
    img.style.animation = "none";
    void img.offsetWidth;
    img.style.animation = "";
    img.src = STICKER_FILES[q.sticker];
    img.alt = "";
    els.question.textContent = q.text;
    els.options.innerHTML = "";
    q.options.forEach(function (opt, i) {
      var btn = document.createElement("button");
      btn.type = "button";
      btn.className = "opt";
      btn.textContent = opt.text;
      btn.addEventListener("click", function () {
        onPick(i, btn);
      });
      els.options.appendChild(btn);
    });
    renderProgress();
  }

  var picking = false;
  function onPick(optionIndex, btn) {
    if (picking || state.mode !== "quiz") return;
    picking = true;
    btn.classList.add("picked");
    state.answers[state.index] = optionIndex;
    state.answers = state.answers.slice(0, state.index + 1);
    renderProgress();
    setTimeout(function () {
      picking = false;
      if (state.index >= QUESTIONS.length - 1) {
        finishQuiz(true);
      } else {
        state.index += 1;
        renderQuestion();
      }
    }, 220);
  }

  function finishQuiz(animate) {
    try {
      state.result = computeResult(state.answers);
    } catch (err) {
      toast("计算失败，请再试一次");
      goToStart();
      return;
    }
    state.date = new Date();
    hideSaveOverlay();
    hideCopyOverlay();
    if (animate === false) {
      renderCurrentCard();
      showScreen("result");
      return;
    }
    showScreen("compute");
    clearTimeout(state.computeTimer);
    state.computeTimer = setTimeout(function () {
      renderCurrentCard();
      showScreen("result");
    }, 900);
  }

  function renderCurrentCard() {
    if (!state.result) return;
    renderCard(els.card, state.result, state.date);
  }

  function goToStart() {
    clearTimeout(state.computeTimer);
    state.index = 0;
    state.answers = [];
    state.result = null;
    hideSaveOverlay();
    hideCopyOverlay();
    showScreen("start");
  }

  function goToQuestion(index, answersSoFar) {
    clearTimeout(state.computeTimer);
    hideSaveOverlay();
    hideCopyOverlay();
    var i = clamp(index == null ? 0 : index, 0, QUESTIONS.length - 1);
    state.answers = Array.isArray(answersSoFar) ? answersSoFar.slice(0, i) : [];
    state.index = i;
    state.result = null;
    renderQuestion();
    showScreen("quiz");
  }

  function startQuiz() {
    goToQuestion(0, []);
  }

  function showResult(answers, opt) {
    opt = opt || {};
    if (!answers || answers.length !== QUESTIONS.length) {
      throw new Error("showResult needs " + QUESTIONS.length + " answers");
    }
    state.answers = answers.slice();
    state.index = QUESTIONS.length - 1;
    finishQuiz(opt.animate === true);
  }

  function canAutoDownload() {
    var ua = navigator.userAgent || "";
    if (/MicroMessenger/i.test(ua)) return false;
    if (/iPhone|iPad|iPod/i.test(ua)) return false;
    if (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1) return false;
    return true;
  }

  function showSaveOverlay(url) {
    els.saveImg.src = url;
    els.saveOverlay.hidden = false;
  }

  function hideSaveOverlay() {
    els.saveOverlay.hidden = true;
    els.saveImg.removeAttribute("src");
  }

  function showCopyOverlay(text) {
    els.copyText.value = text;
    els.copyOverlay.hidden = false;
    setTimeout(function () {
      try {
        els.copyText.focus();
        els.copyText.select();
      } catch (e) {}
    }, 50);
  }

  function hideCopyOverlay() {
    els.copyOverlay.hidden = true;
  }

  function saveCard() {
    if (!state.result) return;
    var url;
    try {
      url = els.card.toDataURL("image/png");
    } catch (err) {
      toast("保存失败，请截屏试试");
      return;
    }
    if (!canAutoDownload()) {
      showSaveOverlay(url);
      return;
    }
    try {
      var a = document.createElement("a");
      a.href = url;
      a.download = fileNameFor(state.result, state.date);
      a.rel = "noopener";
      document.body.appendChild(a);
      a.click();
      a.remove();
      toast("已保存");
    } catch (err2) {
      showSaveOverlay(url);
    }
  }

  function copyShare() {
    if (!state.result) return;
    var text = shareText(state.result, state.date);
    var copied = false;

    function fallback() {
      showCopyOverlay(text);
    }

    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(
        function () {
          toast("已复制分享文案");
        },
        function () {
          fallback();
        }
      );
      return;
    }

    try {
      var ta = document.createElement("textarea");
      ta.value = text;
      ta.setAttribute("readonly", "");
      ta.style.position = "fixed";
      ta.style.left = "-9999px";
      document.body.appendChild(ta);
      ta.select();
      copied = document.execCommand("copy");
      ta.remove();
    } catch (err) {
      copied = false;
    }
    if (copied) toast("已复制分享文案");
    else fallback();
  }

  function preloadStickers() {
    var keys = Object.keys(STICKER_FILES);
    return Promise.all(
      keys.map(function (key) {
        return new Promise(function (resolve) {
          var img = new Image();
          img.onload = function () {
            images[key] = img;
            resolve(true);
          };
          img.onerror = function () {
            resolve(false);
          };
          img.src = STICKER_FILES[key];
        });
      })
    );
  }

  function bind() {
    els.btnStart.addEventListener("click", startQuiz);
    els.btnAgain.addEventListener("click", goToStart);
    els.btnSave.addEventListener("click", saveCard);
    els.btnShare.addEventListener("click", copyShare);
    els.btnCloseSave.addEventListener("click", hideSaveOverlay);
    els.btnCloseCopy.addEventListener("click", hideCopyOverlay);
    els.saveOverlay.addEventListener("click", function (ev) {
      if (ev.target === els.saveOverlay) hideSaveOverlay();
    });
    els.copyOverlay.addEventListener("click", function (ev) {
      if (ev.target === els.copyOverlay) hideCopyOverlay();
    });
  }

  function boot() {
    els.start = $("screen-start");
    els.quiz = $("screen-quiz");
    els.compute = $("screen-compute");
    els.result = $("screen-result");
    els.card = $("card");
    els.btnStart = $("btn-start");
    els.btnAgain = $("btn-again");
    els.btnSave = $("btn-save");
    els.btnShare = $("btn-share");
    els.saveOverlay = $("save-overlay");
    els.saveImg = $("save-img");
    els.btnCloseSave = $("btn-close-save");
    els.copyOverlay = $("copy-overlay");
    els.copyText = $("copy-text");
    els.btnCloseCopy = $("btn-close-copy");
    els.toast = $("toast");
    els.progressLabel = $("progress-label");
    els.progressBar = $("progress-bar");
    els.dots = $("progress-dots");
    els.quizSticker = $("quiz-sticker");
    els.question = $("quiz-question");
    els.options = $("quiz-options");

    buildDots();

    var ready = document.fonts && document.fonts.ready ? document.fonts.ready : Promise.resolve();
    Promise.all([ready, preloadStickers()]).then(function () {
      bind();
      showScreen("start");
    });
  }

  var API = {
    QUESTIONS: QUESTIONS,
    TIERS: TIERS,
    computeResult: computeResult,
    renderCard: renderCard,
    goToStart: goToStart,
    goToQuestion: goToQuestion,
    startQuiz: startQuiz,
    showResult: showResult,
    shareText: shareText,
    formatDate: formatDate
  };

  if (typeof window !== "undefined") {
    window.Ruantang = API;
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", boot);
    } else {
      boot();
    }
  }

  if (typeof module === "object" && module.exports) {
    module.exports = API;
  }
})();
