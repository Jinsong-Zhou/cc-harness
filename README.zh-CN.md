<p align="center">
  <strong>🌐 Language / 语言</strong><br>
  <a href="README.md">English</a> •
  <a href="README.zh-CN.md">简体中文</a> •
  <a href="README.ja.md">日本語</a> •
  <a href="README.ko.md">한국어</a>
</p>

# cc-harness

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Claude Code Plugin](https://img.shields.io/badge/Claude_Code-Plugin-orange)](https://github.com/Jinsong-Zhou/cc-harness)

**面向长时间应用开发的多智能体协作框架，Claude Code 插件。**

基于 Anthropic 研究论文：[面向长时间应用开发的 Harness 设计](https://www.anthropic.com/engineering/harness-design-long-running-apps)

---

## 为什么需要这个插件

单智能体在处理复杂编码任务时，往往会产出表面光鲜但实际上**功能不完整**的结果。两个核心问题：

1. **自我评估偏差** — 模型会自信地夸奖自己的平庸作品。将"创造"和"评估"分离是提升质量最有效的手段。
2. **上下文退化** — 长时间会话中模型会失去连贯性。结构化的状态交接和上下文管理策略可以保持多小时构建的质量。

本插件实现了一套受 GAN 启发的**生成器-评估器架构**，通过迭代反馈循环驱动真正的质量提升。

## 架构

```
用户提示（1-4 句话）
        │
        ▼
┌──────────────┐
│   规划器      │──→ SPEC.md（产品规格说明）
│  (只读)       │
└──────────────┘
        │
        ▼
┌──────────────┐       基于文件的通信         ┌──────────────┐
│   生成器      │◄──────────────────────────►│   评估器      │
│  (构建)       │                            │  (测试)       │
└──────────────┘                             └──────────────┘
        │                                           │
   git 提交                                    通过 Playwright/
        ▲                                    浏览器测试实际应用
        └────────如果 FAIL 则迭代──────────────
```

## 快速开始

### 安装

```bash
# 添加 marketplace
/plugin marketplace add Jinsong-Zhou/cc-harness

# 安装插件
/plugin install cc-harness@cc-harness-marketplace
```

然后重启 Claude Code。

### 使用

```bash
# 启动一个 harness 开发会话
/harness 构建一个基于 Web Audio API 的浏览器端 DAW

# 随时评估当前工作
/evaluate
/evaluate 登录流程
/evaluate 前端设计

# 查看会话进度
/harness-status
```

## 目录结构

```
cc-harness/
├── .claude-plugin/
│   ├── plugin.json                              # 插件元数据
│   └── marketplace.json                         # Marketplace 分发配置
│
├── agents/
│   ├── planner.md                               # 将简短提示扩展为产品规格
│   ├── generator.md                             # 逐个功能构建，提交到 git
│   └── evaluator.md                             # 持怀疑态度的 QA — 测试实际应用并评分
│
├── skills/
│   ├── harness-loop/
│   │   ├── SKILL.md                             # 核心生成器-评估器迭代循环
│   │   └── references/
│   │       ├── sprint-contract-examples.md      # Sprint 合约示例
│   │       └── evaluation-examples.md           # 校准后的 QA 反馈示例
│   ├── context-management/
│   │   └── SKILL.md                             # 长会话的压缩与重置策略
│   └── harness-tuning/
│       ├── SKILL.md                             # 评估器校准与 harness 简化
│       └── references/
│           └── audit-template.md                # Harness 组件审计模板
│
├── commands/
│   ├── harness.md                               # /harness — 启动 harness 开发会话
│   ├── evaluate.md                              # /evaluate — 触发独立评估
│   └── harness-status.md                        # /harness-status — 查看进度和评分
│
├── rules/
│   └── common/
│       ├── harness-workflow.md                  # 必须遵循的流水线：规划 → 合约 → 构建 → 评估
│       ├── evaluator-discipline.md              # 评估器纪律 — 怀疑优于礼貌
│       ├── context-strategy.md                  # 上下文管理的时机和方法
│       └── file-communication.md                # 基于文件的智能体通信协议
│
├── hooks/
│   └── hooks.json                               # 生命周期钩子
│
├── scripts/
│   └── hooks/
│       ├── run-with-flags.js                    # 基于配置文件的钩子运行器
│       └── track-iteration.js                   # 迭代计数器和会话摘要
│
├── package.json
├── LICENSE                                       # MIT
└── README.md
```

## 组件

### 智能体

| 智能体 | 模型 | 权限 | 用途 |
|-------|------|------|------|
| `harness-planner` | Opus | 只读 | 将 1-4 句提示转化为产品规格 |
| `harness-generator` | Opus | 完全读写 | 逐个功能迭代构建，提交到 git |
| `harness-evaluator` | Opus | 读 + Bash | 持怀疑态度的 QA — 通过 Playwright/浏览器测试 |

### 技能

| 技能 | 触发条件 | 用途 |
|------|---------|------|
| `harness-loop` | 自主构建复杂应用 | 编排完整的 规划器 → 生成器 → 评估器 循环 |
| `context-management` | 长会话接近上下文限制 | 压缩与重置策略，结构化状态交接 |
| `harness-tuning` | 优化 harness 性能 | 评估器校准、组件移除、提示工程 |

### 命令

| 命令 | 用途 |
|------|------|
| `/harness <提示>` | 启动 harness 开发会话 |
| `/evaluate [范围]` | 触发独立评估 |
| `/harness-status` | 查看会话进度和评分 |

### 规则

始终加载的规范性指南：
- **harness-workflow** — 复杂构建的必须流水线
- **evaluator-discipline** — QA 中怀疑优于礼貌
- **context-strategy** — 何时以及如何管理上下文
- **file-communication** — 智能体间基于文件的通信协议

### 钩子

| 事件 | 配置级别 | 用途 |
|------|---------|------|
| `SessionStart` | minimal+ | 初始化或恢复 harness 状态（仅当 SPEC.md 或 harness/ 存在时） |
| `PreCompact` | minimal+ | 上下文压缩前保存状态 |
| `Stop` | minimal+ | 写入包含指标的会话摘要 |

**钩子配置级别：** 通过 `CC_HARNESS_PROFILE` 环境变量控制：
- `minimal` — 仅状态持久化
- `standard`（默认）— 状态 + 迭代跟踪
- `strict` — 所有钩子，包括详细日志

## 评分标准

### 全栈应用

| 标准 | 权重 | 衡量内容 |
|------|------|---------|
| 产品深度 | 高 | 真实功能 vs 空壳 — 用户能否完成工作流？ |
| 功能性 | 高 | 是否真的能用？Bug、边界情况、错误处理？ |
| 视觉设计 | 中 | 精致、一致、全视口的 UI，连贯的视觉风格 |
| 代码质量 | 低 | 基本能力检查 — 仅检查根本性问题 |

### 前端设计

| 标准 | 权重 | 衡量内容 |
|------|------|---------|
| 设计质量 | 高 | 整体连贯 vs 零散拼凑 — 氛围和风格 |
| 原创性 | 高 | 自主设计决策 vs AI 模式/模板默认值 |
| 工艺 | 中 | 字体层次、间距一致性、配色和谐、对比度 |
| 功能性 | 中 | 与美观无关的可用性 |

## 基于文件的通信

智能体通过 `harness/` 目录中的文件进行通信，而非对话上下文：

```
harness/
├── sprint-contract.md       # 生成器 → 评估器：定义"完成"的标准
├── sprint-result.md         # 生成器 → 评估器：构建内容和测试方法
├── qa-feedback.md           # 评估器 → 生成器：评分 + 问题列表
├── iteration-log.md         # 所有迭代的运行日志
├── context-handoff.md       # 上下文重置时的结构化状态
└── .harness-state.json      # 机器可读的会话指标
```

## 成本参考

| 方式 | 时长 | 成本 | 质量 |
|------|------|------|------|
| 单智能体（无 harness） | ~20 分钟 | ~$9 | 核心功能不可用 |
| 完整 harness（含 sprint） | ~6 小时 | ~$200 | 可用、精致 |
| 简化 harness（无 sprint） | ~4 小时 | ~$125 | 可用、质量相当 |

> 完整 harness 的成本是单智能体的 ~20 倍，但能产出**真正可用**的应用。

## 适配新模型

每个 harness 组件都编码了对模型局限性的假设。使用 `harness-tuning` 技能来系统性审计哪些组件仍然是必要的：

| 组件 | Opus 4.6 状态 |
|------|--------------|
| 规划器 | **保留** — 模型不会自然地将范围扩展得足够宏大 |
| 评估器 | **保留** — 自我评估偏差在所有版本中持续存在 |
| Sprint 分解 | **移除** — 模型可在 2+ 小时构建中保持连贯性 |
| 上下文重置 | **移除** — 近期模型无上下文焦虑 |

## 致谢

基于 Anthropic 的 Prithvi Rajasekaran 的研究：
[面向长时间应用开发的 Harness 设计](https://www.anthropic.com/engineering/harness-design-long-running-apps)

## 许可证

MIT
