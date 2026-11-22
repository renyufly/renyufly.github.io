---
title: "LLM&Agent学习(1)"
description: ''
date: "2026-10-17"
updatedDate: "2026-10-17"
language: zh-CN
tags:
  - LLM
  - AI agent
categories:
  - LLM
  - AI agent
comments: false
---

# LLM&Agent学习(1)

Input -> Tokenizer -> Token：模型读写文字时使用的基本单位 -> LLM 处理 -> 生成输出（自然语言回答 or 工具调用指令）

https://platform.openai.com/tokenizer

Token影响：

- 模型一次能读取多少内容
- 一次调用需要花多少钱
- 对话太长后，哪些内容需要被删除或压缩

Prompt (提示词)：主动交给模型的任务 和 要求。

Context：包含 system prompt、用户prompt、可调用tool、RAG资料、历史会话等更完整的内容。

Tool：让大模型调用外部能力的东西。（模型只能生成一个 `Tool call`来表达意图，由实际应用代码执行，再把结果返回给context）

MCP：提供**统一方式**，让 AI 可以发现并调用外部能力。（把tool call给抽象出来）通过 MCP 调用 Tool。

> - Tool是“查询订单”的具体能力 
>
> - MCP是不同应用发现和调用这个能力的一套标准方式

Agent Loop：不断判断、执行、拿到结果再继续判断的过程。

Skill：规定在特定场景下应遵循的流程和规则。

Model（模型）：负责思考、推理和生成内容。

Harness：一套让核心系统能够被有效调用、运行、测试和控制的外部框架。负责给模型提供工具、上下文、执行环境和运行规则。

Agent（智能体）：模型与 Harness 结合后，形成能够执行任务的系统。

- Agent Framework ：通常指开发 Agent 的框架，比如 LangGraph、AutoGen 等，提供工作流编排、状态管理和工具集成能力。

- Agent Harness 更强调让一个模型或 Agent 在具体环境中可靠运行的整套机制，包括工具执行、上下文注入、权限控制、反馈循环和评测。

  > 两者并没有严格统一的行业边界，一个 Agent Framework 也可能承担 Harness 的功能

Harness 具体负责：

| 组件           | 作用                             |
| -------------- | -------------------------------- |
| Prompt 管理    | 管理系统提示词、角色和行为规则   |
| Context 管理   | 控制模型能看到哪些信息           |
| Tool Calling   | 让模型调用搜索、终端、API 等工具 |
| Execution Loop | 让模型持续执行、观察结果、再执行 |
| Memory         | 保存任务状态与必要的历史信息     |
| Guardrails     | 管理权限、安全限制和错误处理     |
| Evaluation     | 测试任务完成质量与正确性         |

例如：Codex 和 Claude Code 本身就可以被视为 Harness，更准确地说，是包含 Harness 的完整 Coding Agent 系统。

 Harness Engineering 研究的核心问题：即使模型完全相同，工具设计、上下文策略和执行循环的差异，也可能显著影响最终效果。

> 个人开发一个 Harness，最好的方式是：先实现一个类似 Claude Code / Codex 的最小 Coding Agent，再逐步增加上下文管理、权限控制、任务恢复和评测能力。
>
> 企业级 Harness 解决的是：如何让模型在企业的权限、数据、业务流程和合规约束下，稳定、安全、可观测地完成任务。更关注Runtime、Context、Policy、Observability 和 Evaluation，而不是Agent Loop.



## Agent开发

**Transformer基础，LLM model**

**LLM推理与调用:** 通过API来使用大模型. 需要了解如何调用OpenAI, Anthropic (Claude)或国产大模型的 API, 并理解Token, 温度(Temperature), Top-p等核心参数的含义.

**RAG**：

- RAG 核心流程（外部文档->解析清洗->分块metadata->向量数据库topK相似度）
- 向量数据库 如 Milvus
- 向量索引 如 HNSW 、IVF_PQ
- 混合检测方案（让回答更准确）， 
- 检索质量优化， 
- Tool Calling，
-  MCP
- RAG的优化

**Agent工程工具：**

- LangChain：

  - 不同LLM之间的通用调用
  - Prompt
  - Chain串成流程
  - Memory记住上下文
  - Tools
  - Vector store

  >  Chain ：单次调用怎么标准化 。路径写死在代码里， 从头跑到尾, 一次结束
  >
  > Agent： 要不要多走几步, 要不要用工具 。模型自己决定下一步， 可以反复调工具再回答。

- LangGraph 生态：

  - State： 贯穿全程的共享数据。所有节点读写同一份， 字段自己定义， 决定了流程能记住什么
  - Node ：具体干活的函数。接收当前 State ，返回要更新的字段， 就是普通 Python 函数。
  - Edge ：定义Node之间怎么走。 普通边:固定下一步 ；条件边: 看 State 决定。 这是能分岔的关键
  - Graph： 把节点和边编排成整张图

- LangSmith： LangChain 官方的可观测性平台

> 换成LangGraph不会自动提高回答正确率 。多一层抽象, 就多一处可能出错, 也更难查。

- Agent loop框架
- Llamalndex：专注RAG。数据索引和检索能力极强, 尤其擅长处理复杂文 档(如 PDF, PPT), 与 LangChain 无缝集成.
- AutoGen (Microsoft)：多 Agent 协作框架。擅长通过定义不 同角色的 Agent 并 让它们对话来解决复 杂问题.

**多智能体, React, A2A, ToT, CoT等工程化：**

- ReAct (Reason + Act)：论文 - ReAct: Synergizing Reasoning and Acting in Language Models

- Tree of Thoughts：https://www.promptingguide.ai/techniques/tot

- 多智能体架构是什么,怎么实现。   论文 - CAMEL: Communicative Agents for Mind Exploration

  > AutoGen是目前最有代表性的多智能体框架.

  常见多 Agent 架构：Supervisor 模式、Debate 模式、**loop 模式**

- A2A的具体实现。

- 意图识别、

- Agentic RAG，

- 流程编排Workflow， 

- Human-in-the-loop，

- State持久化

**上下文工程的解决方案：**

> 处理 Agent的记忆与状态  （长期记忆与短期记忆）

- 论文 - MemGPT: Towards LLMs as Operating Systems

  > RAM + Disk + Page Swap

- mem0 (工程化实现)

- 向量数据库与记忆

- 高级的 Context Engineering 包括: 

  1. Prompt 编排 
  2. 动态裁剪 
  3. Memory 压缩 
  4. Summary 机制 
  5. 角色化上下文隔离
  6.  Token 预算调度

**评测, 安全, 监控与链路追踪：**

> "没有度量, 就没有优化."如何客观地评估Agent的表现, 是其能否上线的核心问题.

- Agent 安全问题处理， 
- Agent性能评测方案（建立测试集、RAG召回率）， 
- Agent 可观测性的问题（知道为什么失败）

评测维度：

- RAG质量: 上下文精度(Context Precision), 上下文召回率(Context Recall), 答案忠实度 (Faithfulness), 答案相关性(Answer Relevancy). 
- Agent质量: 任务完成率, 工具使用正确率, 鲁棒性等.

评测方法：

- 人工评估: 最可靠, 但成本高. 
- LLM-as-a-Judge:使用更强大的LLM 来评估Agent的输出, 是目前的主流方案.

| 工具                    |                                                              |      |
| ----------------------- | ------------------------------------------------------------ | ---- |
| LangSmith               | 可视化追踪Agent每一步的 思考和工具调用, 轻松调 试; 支持在线和离线评估, 自定义评估器. |      |
| TruLens                 | 专注于RAG的"三元组"评 估(答案, 上下文, 问题之 间的相关性), 提供细粒度 的可观测性. |      |
| Phoenix (Arize)         | 基于OpenTelemetry的开 源LLM可观测性工具, 支 持日志, 评估, 可视化, 与 各种框架集成良好. |      |
| DeepEval / OpenAl Evals | 更偏向于单元测试和基准测 试的评估框架, 让你像写 Pytest—样编写LLM的评 测用例. |      |

 **复杂任务与 Agent 产品 ：**

- Agent 在复杂任务下（多工具、computer use、代码执行）的应用，
- Sandbox
- Agent 全栈交互（\plan \goal、工具调用、SSE）， 
- Agent产品形态（聊天对话框、实时语音、多模态）

**进阶内容: **

- Lora微调, 
- RL强化学习, 
- BERT 模型, 
- Planner优化

- 模型策略：路由
- 私有化部署、
- 大模型推理优化

> 传统的前后端开发知识仍是必备。



项目实战：

推荐上手XingClaw,OpenClaw的Python精简版,代码逻辑清晰,适合理解Agent原理。

① docs/00_文件总览.md>理解全局架构 ② src/ai/统一LLM接口层,理解数据怎么流动 

③ src/agent_core/agent_loop.py3 → 核心中的核心,Agent Loop怎么跑 

④ src/coding_agent/builtin_tools.pyl → 内置工具怎么实现的 

⑤ src/im/ → 怎么对接飞书IM



- AI 基建：模型网关、用量统计、权限控制，让其他团队更低成本、更稳定地使用 AI。
- 内部 AI 工具：知识库问答、通用 workflow 平台、Skill hub、MCP 管理服务。
- 团队 AI 提效：了解业务，把团队经验沉淀成 Skill，并帮助它真正进入日常开发。



## LLM & AI算法工程师

**数学基础：**  1. 线性代数   2.概率论  3.随机过程   4.统计学原理  5.最优化理论   6.信息论  7.数值分析

> 知道名词的意思。

计算机基础：数据结构、GPU / TPU

**数据工程：**

- 数据类型：时间序列、表格型、图像音频
- 数据清洗：去重、去噪声、修正异常值、统一格式
- 数据标注
- 数据分布 ： 统计学相关

**论文阅读：** 论文的问题、方法、实验怎么做、方法中哪些模块真正有效

**AI 基础理论：**

- 学习范式：1.监督学习  2.半监督学习 （少量label） 3 .无监督学习 4.自监督  5.强化学习 （不断试错+奖励）

> 同一种模型架构如 Transformer可用于多种 学习范式

- 模型评估：指标metric、交叉验证、数据泄露、robustness、Benchmark
- 优化与 训练：loss函数、优化算法、梯度下降、正则化、学习率
- representation learning：特征表示、Embedding、对比学习、迁移学习

**模型方法：**

- 传统 ML model：1. 线性回归  2.逻辑回归 （分类）  3.决策树 （判断） 4.随机森林  （集成学习，有多个决策树） 5.SVM （分类边界，找到一条分界线把不同类别分开）   6. PCA. （找到主成分，更少维度保存更多信息。用于降维、去噪）  7.HMM 隐马尔可夫链 （NLP的基础，序列任务）

> 对于表格型 tabular数据，XGBoost 仍然流行

- 神经网络 NN 基础：MLP、前向传播、反向传播、激活函数 （提供非线性）、损失函数loss、自动求导
- DL 架构：1. CNN （CV领域基础：局部特征卷积、参数共享） 2.RNN （序列建模：长序列为什么梯度消失） 3.LSTM （RNN的改进：使用gating控制信息的保留与遗忘，记住长信息）  4. Attention （主动关注其他重要位置：QKV、为什么能长距离依赖） 5. Transformer （并行处理一整段信息、自注意力） 6.Autoencoder （压缩去噪、生成模型的基础：学到核心的representation） 7. Diffusion （图像视频生成：训练时加噪声，生成时去噪）

> 因为不同数据的结构不一样，就产生了不同的 架构。

**曾经的经典架构：**

- LeNet （早期CNN）、AlexNet（图像分类）、VGG、ResNet（残差连接，学习变化量）、Seq2Seq、Word2Vec（把词变成向量）、GAN（生成器+判别器，曾经的图像生成）、VAE（latent空间）

**AI 主流方向：**

1. NLP：预训练模型、LLM架构、微调、对齐、RAG、Agent
   - 深入 Transformer、Bert、GPT、Llama、RAG、InstructGPT、DPO
2. CV：SAM
3. 具身智能





## 具身智能+机器人

算法侧：强化学习、LLM、运动控制

软件：底层软件、ROS开发

感知与环境：视觉、力控、触觉

硬件：关节、高速、传感器、整机集成

- 项目为王
- 精准学习

> 软件 / AI + 补充 机器人的建模、运动学基础 → 感知规划算法岗
>
> 后端 → 机器人通信/架构岗
>
> 汽车智能座舱 → 机器人视觉 感知

模型架构：

- Vision- Language- Action, VLA：结合视觉, 语言, 动作的大模型。 先理解图像和指令，泛化强, 适合通用机器人助手 （算力消耗大, 推理可能较慢）
- 世界动作模型 World Model：预测动作影响的下一时刻画面。 对动作语义理解更强； 数据来源更广, 网络视频可用
- 传统视觉算法：多个模块拼起来控制机器人-YOLO识别目标、 GraspNet 计算抓取姿态。 工业界常用, 稳定可靠。  （泛化较差, 开发成本高）

训练策略：

- 行为克隆 BC ：人示范一次, 机器人跟着学   （遇到新情况, 可能不会处理）
- 强化学习 RL：不断尝试+奖励反馈。适合奖励信号清晰的场景, 例如运动控制  （训练成本高, 常先仿真再sim2real）

2026年方向：

世界动作模型值得关注, 但落地仍看传统方法 。

世界动作模型: 很好的研究切入点 。机器人+视频生成都可用； 生态目前不如 VLA 成熟。 

机器人落地仍以传统方法为主。



具身大模型 ：面向机器人, 智能驾驶等实体系统； 不仅会说, 会看, 还要会做 。需要感知, 决策与执行。



机器人数据：通常是一条连续轨迹。每一时刻都记录观察, 指令, 状态与动作。  包含：

- 视觉数据 ：彩色图像、 深度图像、 第一人称视频
- 语言数据 ：任务指令 、文本描述
- 动作数据：关节角度、 夹爪状态 、底盘速度

> 视觉数据 十 语言数据 十 动作数据 共同构成一次  机器人轨迹(Trajectory)

五种常见采集方式：

- 示教  ：直接拖动机械臂   （长时间拖动较累 采集效率有限）
-  遥操  ：通过手柄, VR或主从机械臂远程控制机器人。 （设备要求较高 通信延迟敏感 依赖操作者熟练度）
- UMI便携采集 ： 手持夹爪在真实环境中直接完成操作  （不必一直占用真实机器人 降低采集成本 提高采集速度 适合大量人类操作数据）
- 仿真 ：在虚拟环境中自动生成大量机器人数据  （存在虚实差距 通常需要真实数据微调）
- 第一人称 Ego 数据：用头戴, 胸前或手腕相机记录人类操作过程   （通常没有准确机器人关节数据 需要动作估计, 轨迹重建或联合训练）



机器人移动：

- 视觉语言导航(VLN)：结合自然语言指令与视觉感知 直接理解并执行导航任务
- 传统模块化导航 ：基于SLAM建图, 定位与路径规划 实现自主避障与到达目标。 感知环境-定位-建图-路径规划



传统机器人手臂控制：手眼标定（相机坐标→机械臂坐标） → 视觉定位（目标检测+位姿估计）  → 抓取规划  → 逆运动学（位置换成关节角度）

工厂流水线常见。
