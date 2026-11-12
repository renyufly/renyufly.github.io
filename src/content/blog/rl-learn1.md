---
title: "强化学习RL-<RL导论>笔记"
description: ''
date: "2026-11-12"
updatedDate: "2026-11-12"
language: zh-CN
tags:
  - Reinforcement Learning
categories:
  - Reinforcement Learning
  - 读书笔记
comments: false
---

# Reinforcement Learning: An Introduction 读书笔记

原著公开于：http://incompleteideas.net/book/the-book-2nd.html

Reinforcement Learning: An Introduction  (Richard S. Sutton, Andrew G. Barto)
Second Edition - MIT Press,  2018

## 第一章.强化学习介绍

强化学习（RL）是一种机器学习方法：让智能体（Agent）通过不断尝试动作、观察结果、获得奖励，并从经验中学习如何做出更好的决策。 

学习应该做什么 (learning what to do) — 学习如何根据不同的情况选择相应的动作，从而最大化一个数值形式的奖励信号 (maximize a numerical reward signal)。

- Learning by Trial and Error（通过试错来学习）
- delayed reward （延迟奖励）：一个动作不仅可能影响当前奖励，还可能影响未来的状态和奖励

| 监督学习（Supervised Learning） | 无监督学习 Unsupervised Learning | 强化学习（Reinforcement Learning） |
| ------------------------------- | -------------------------------- | ---------------------------------- |
| 带正确答案的数据                | 没有标签的数据                   | 与环境交互得到的奖励               |
| 正确标签或目标值                |                                  | 奖励信号 reward signal             |
| 学会准确预测                    | 发现隐藏结构                     | 学会做出高回报的**决策**           |

> 强化学习不是无监督学习的一种，强化学习的目标是最大化奖励，而无监督学习主要是发现数据结构。

| Exploration（探索）    | Exploitation（利用）       |
| ---------------------- | -------------------------- |
| **尝试不熟悉**的动作   | 选择**当前认为最好**的动作 |
| 目的是**获得更多信息** | 目的是获得较高奖励         |
| 可能暂时损失奖励       | 可能错过真正更好的动作     |

- Agent 与 Environment 持续交互
- Actions 会影响未来的 State
- Agent 必须考虑 Delayed Consequences（延迟后果）：正确决策有时需要 Foresight（预见）或 Planning（规划）
- 环境存在 Uncertainty（不确定性），Agent 需要持续监测环境，并根据实际情况调整行为

强化学习的主要组成要素：

- Agent (智能体)

- Environment

- Policy（策略）\(\pi\) ：决定 Agent 下一步采取什么动作 — 定义了学习智能体在某一时刻的行为方式。是一种从环境状态（State）到动作（Action）的映射关系。

  - 确定性策略（Deterministic Policy）：\[ a=\pi(s) \]
  - 随机策略（Stochastic Policy）：为每个动作指定一个选择概率。

- Reward Signal（奖励信号）：告诉 Agent 眼前什么是好的 — 定义了强化学习问题的目标。环境在每个时间步向 Agent 返回一个数值，叫 Reward（奖励）。Reward Signal 是改变 Policy 的主要依据。

- Value Function（价值函数）：从长期来看什么是好的。 Value：从当前状态出发，未来预计能够累计获得多少奖励。 但Value 比 Reward 更难确定，Reward 通常由环境直接给出，而Value 需要根据长期观察和经验不断估计。

  > 所有强化学习算法中，最重要的组成部分之一，就是如何高效地估计 value。
  >
  > 但解决强化学习问题并不一定必须估计 Value Function；例如：Genetic Algorithms（遗传算法）、Genetic Programming（遗传编程）、Simulated Annealing（模拟退火）可以直接寻找表现较好的策略，而不必计算每个状态或动作的 Value。 [直接搜索 Policy：测试多个完整策略，保留表现较好的策略，并产生新的策略继续搜索]
  >

- Model of the Environment（环境模型）：一种模拟环境行为的机制，使 Agent 能够推断环境将如何变化。 能够给定当前状态和动作，预测下一状态和奖励。

- state（状态）：Agent 当前掌握的环境信息，告诉 Agent 当前情况如何。 state 是策略（Policy）和价值函数（Value Function）的输入，同时也是环境模型（Model）的输入和输出。

| State Value                                                  | Action Value                                                 |
| ------------------------------------------------------------ | ------------------------------------------------------------ |
| \(v_\pi(s)\)                                                 | \(q_\pi(s,a)\)                                               |
| 现在处于状态 s ，如果按照策略 \(\pi\) 行动，未来预计总共能获得多少奖励 | 现在处于状态 s ，如果先指定执行动作 \(a\)，然后按照策略 \(\pi\) 行动，未来预计总共能获得多少奖励 |

> 区别在于： 有没有指定当前第一步的动作

| Model-Based RL             | Model-Free RL                      |
| -------------------------- | ---------------------------------- |
| 可以预测未来并规划         | 直接从交互经验中学习               |
| 先模拟可能结果，再决定动作 | 尝试动作，观察奖励，更新策略或价值 |
| 依赖环境模型进行决策       | 不依赖环境模型进行决策             |











## 第二章.Multi-armed Bandits 多臂老虎机

> 名字来源于赌场里的老虎机（Slot Machine）: 传统老虎机有一个操作手柄（Arm），玩家拉动手柄后，机器会随机给出奖励。 它被称为 One-Armed Bandit（独臂强盗）— 因为老虎机通常让赌场赚钱、玩家输钱。
>
> Multi-Armed Bandit 可以想象为有多个手柄的老虎机，每个手柄对应不同的奖励概率或奖励分布。玩家不知道哪个手柄最好，只能通过不断尝试来学习。

Reinforcement Learning（强化学习）中，Multi-Armed Bandit 是一种简化的序贯决策问题。

假设有 \(k\) 个动作：\[ A=\{1,2,\ldots,k\} \] ，每个动作都有一个未知的真实价值：\[ q_*(a)=\mathbb E[R_t\mid A_t=a] \]

其中：

- \(A_t\)：在时间 \(t\) 选择的动作。
- \(R_t\)：选择动作后获得的奖励。
- \(q_*(a)\)：动作 \(a\) 的真实期望奖励。

智能体（Agent）的目标是：

通过不断尝试不同动作，学习哪些动作奖励更高，并最大化长期累计奖励。

> 经典 Multi-Armed Bandit 不考虑状态转移。动作只影响当前获得的奖励，不会改变下一步所处的环境状态。

必要元素：

- Arm（臂）原指老虎机上的操作手柄，在强化学习 中则表示 一个可以选择的动作（Action）
- Action：选择某个 Arm 的行为
- Reward：选择后获得的奖励
- Action Value（动作价值）：选择某个action后，预期能够获得多少奖励 value

| True Action Value | Estimated Action Value     |
| ----------------- | -------------------------- |
| \(q_*(a)\)        | \(Q_t(a)\)                 |
| 真正的期望奖励    | 根据过去观察估计的平均奖励 |
| 通常未知          | 可以通过数据计算           |



三种Action Selection策略：

- Greedy
- ε-greedy
- UCB: Upper-Confidence-Bound 
