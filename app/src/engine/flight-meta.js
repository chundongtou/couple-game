/* ==========================================================================
 * 今晚飞行棋 · 心动值 / 连击 / 里程碑（V6，纯函数）
 * 口径：docs/v6/impl-freeze.md §2.3（最高优先级）+ docs/v6/spec.md §5.1/§5.2
 *
 * 只做展示与激励投影，不参与任何规则判定：
 *   - 计分：题卡「做了」+8 /「放过」+3；小游戏完成 +5 / 跳过 +0；
 *           收尾卡「做了」+10 /「放过」+3；命运卡选了「做了」+8 /「放过」+3。
 *   - 任何操作不得减少 heat（只增不降），上限 100。
 *   - streak：「做了」+1；「放过」不变（不清零）；每 3 的倍数发 milestone。
 *   - stage：cold 0–19 / warm 20–39 / charged 40–59 / burning 60–79 / blazing 80–100。
 *
 * 纯函数：不读 DOM / localStorage / Date 以外的环境；不修改入参。
 * 引擎在 resolvePrompt / resolveMinigame 的结算点调用 apply*，把结果写回 state.meta，
 * 事件 heat/streak/milestone 随本次 Result.events 一起返回（UI 只读）。
 * ========================================================================== */
(function (global) {
  'use strict';

  var root = global.App = global.App || {};

  var HEAT_MAX = 100;
  var MILESTONE_EVERY = 3;

  var STAGE_ORDER = ['cold', 'warm', 'charged', 'burning', 'blazing'];
  var THRESHOLDS = { warm: 20, charged: 40, burning: 60, blazing: 80 };
  var STAGE_LABELS = {
    cold: '灯刚亮',
    warm: '有点热',
    charged: '靠近了',
    burning: '很近了',
    blazing: '今晚可以更近'
  };

  /* 记为 heat 的「操作类别」，见文件头。 */
  var HEAT_GAIN = {
    promptDone: 8,
    promptSkipped: 3,
    endingDone: 10,
    endingSkipped: 3,
    minigameDone: 5,
    minigameSkipped: 0,
    fateDone: 8,
    fateSkipped: 3
  };

  var CATEGORY_GAIN = {
    prompt: { done: HEAT_GAIN.promptDone, skipped: HEAT_GAIN.promptSkipped },
    ending: { done: HEAT_GAIN.endingDone, skipped: HEAT_GAIN.endingSkipped },
    minigame: { done: HEAT_GAIN.minigameDone, skipped: HEAT_GAIN.minigameSkipped },
    fate: { done: HEAT_GAIN.fateDone, skipped: HEAT_GAIN.fateSkipped }
  };

  function clampHeat(n) {
    var heat = Math.round(Number(n));
    if (!isFinite(heat)) heat = 0;
    return Math.max(0, Math.min(HEAT_MAX, heat));
  }

  function stageOf(heat) {
    var h = clampHeat(heat);
    if (h >= THRESHOLDS.blazing) return 'blazing';
    if (h >= THRESHOLDS.burning) return 'burning';
    if (h >= THRESHOLDS.charged) return 'charged';
    if (h >= THRESHOLDS.warm) return 'warm';
    return 'cold';
  }

  function stageLabel(stage) {
    return STAGE_LABELS[stage] || STAGE_LABELS.cold;
  }

  function init(state) {
    return {
      heat: 0,
      stage: 'cold',
      streak: 0,
      streakBest: 0,
      milestones: [],
      updatedAt: (state && Number(state.ts)) || 0
    };
  }

  /* 容错归一：缺失/脏字段补默认；heat 只夹不降；stage 永远由 heat 重算（唯一真源）。 */
  function normalize(meta) {
    if (!meta || typeof meta !== 'object') return init();
    var heat = clampHeat(meta.heat);
    var streak = Math.max(0, Math.round(Number(meta.streak) || 0));
    var best = Math.max(streak, Math.round(Number(meta.streakBest) || 0));
    var milestones = [];
    if (Array.isArray(meta.milestones)) {
      meta.milestones.forEach(function (id) {
        if (typeof id === 'string' && id && milestones.indexOf(id) < 0) milestones.push(id);
      });
    }
    return {
      heat: heat,
      stage: stageOf(heat),
      streak: streak,
      streakBest: best,
      milestones: milestones,
      updatedAt: Number(meta.updatedAt) || 0
    };
  }

  function gainFor(category, outcome) {
    var table = CATEGORY_GAIN[category] || CATEGORY_GAIN.prompt;
    return outcome === 'skipped' ? table.skipped : table.done;
  }

  /* 一次结算：返回 { meta, events }。不修改入参。 */
  function apply(base, category, outcome) {
    var prev = normalize(base);
    var how = outcome === 'skipped' ? 'skipped' : 'done';
    var delta = gainFor(category, how);
    var next = {
      heat: prev.heat,
      stage: prev.stage,
      streak: prev.streak,
      streakBest: prev.streakBest,
      milestones: prev.milestones.slice(),
      updatedAt: prev.updatedAt
    };
    var events = [];
    var now = Date.now();

    if (delta !== 0) {
      var heat = Math.min(HEAT_MAX, Math.max(prev.heat, prev.heat + delta));
      var applied = heat - prev.heat;
      var stage = stageOf(heat);
      next.heat = heat;
      next.stage = stage;
      next.updatedAt = now;
      if (applied !== 0) {
        var ev = { type: 'heat', delta: applied, heat: heat, stage: stage };
        /* 跨阶段才带 prevStage（视图据此播「升温」演出）。 */
        if (stage !== prev.stage) ev.prevStage = prev.stage;
        events.push(ev);
      }
    }

    if (how === 'done' && category !== 'minigame') {
      next.streak = prev.streak + 1;
      next.streakBest = Math.max(prev.streakBest, next.streak);
      next.updatedAt = now;
      events.push({ type: 'streak', count: next.streak, best: next.streakBest });
      if (next.streak > 0 && next.streak % MILESTONE_EVERY === 0) {
        var id = 'streak-' + next.streak;
        if (next.milestones.indexOf(id) < 0) {
          next.milestones.push(id);
          events.push({ type: 'milestone', id: id, label: '连击 ×' + next.streak });
        }
      }
    }

    return { meta: next, events: events };
  }

  function kindCategory(kind) {
    if (kind === 'ending') return 'ending';
    if (kind === 'fate') return 'fate';
    if (kind === 'minigame-thermo' || kind === 'minigame-wheel') return 'minigame';
    return 'prompt';
  }

  /* 引擎结算点入口：按 prompt.kind 归类。 */
  function applyPrompt(meta, kind, outcome) {
    return apply(meta, kindCategory(kind), outcome);
  }

  /* V5 存档迁移 / V6 缺 meta 时：按 log 顺序重放，重建 heat 与 streak。 */
  function fromLog(log) {
    var meta = init();
    (Array.isArray(log) ? log : []).forEach(function (entry) {
      if (!entry || typeof entry !== 'object') return;
      var outcome = entry.outcome === 'skipped' ? 'skipped' : (entry.outcome === 'done' ? 'done' : null);
      if (!outcome) return;
      if (entry.kind === 'minigame-thermo' || entry.kind === 'minigame-wheel') {
        meta = apply(meta, 'minigame', outcome).meta;
        return;
      }
      if (!entry.kind) return;
      meta = apply(meta, kindCategory(entry.kind), outcome).meta;
    });
    return meta;
  }

  /* 视图投影：heatStage 兼容 api-contract §6.4 字段名，stage 为冻结单字段名。 */
  function view(meta) {
    var m = normalize(meta);
    return {
      heat: m.heat,
      stage: m.stage,
      heatStage: m.stage,
      stageLabel: stageLabel(m.stage),
      streak: m.streak,
      streakBest: m.streakBest,
      milestones: m.milestones.slice(),
      updatedAt: m.updatedAt,
      thresholds: { warm: THRESHOLDS.warm, charged: THRESHOLDS.charged, burning: THRESHOLDS.burning, blazing: THRESHOLDS.blazing },
      max: HEAT_MAX
    };
  }

  root.FlightMeta = {
    DEFAULTS: {
      HEAT_MAX: HEAT_MAX,
      MILESTONE_EVERY: MILESTONE_EVERY,
      STAGE_ORDER: STAGE_ORDER.slice(),
      THRESHOLDS: { warm: THRESHOLDS.warm, charged: THRESHOLDS.charged, burning: THRESHOLDS.burning, blazing: THRESHOLDS.blazing },
      STAGE_LABELS: {
        cold: STAGE_LABELS.cold,
        warm: STAGE_LABELS.warm,
        charged: STAGE_LABELS.charged,
        burning: STAGE_LABELS.burning,
        blazing: STAGE_LABELS.blazing
      },
      HEAT_GAIN: {
        promptDone: HEAT_GAIN.promptDone,
        promptSkipped: HEAT_GAIN.promptSkipped,
        endingDone: HEAT_GAIN.endingDone,
        endingSkipped: HEAT_GAIN.endingSkipped,
        minigameDone: HEAT_GAIN.minigameDone,
        minigameSkipped: HEAT_GAIN.minigameSkipped,
        fateDone: HEAT_GAIN.fateDone,
        fateSkipped: HEAT_GAIN.fateSkipped
      }
    },
    init: init,
    normalize: normalize,
    stageOf: stageOf,
    stageLabel: stageLabel,
    gainFor: gainFor,
    apply: apply,
    applyPrompt: applyPrompt,
    kindCategory: kindCategory,
    fromLog: fromLog,
    view: view
  };
})(typeof window !== 'undefined' ? window : this);
