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

大模型应用基础：Transformer基础，LLM model

-> RAG 和 MCP : RAG 基础流程（外部文档->解析清洗->分块metadata->向量数据库topK相似度）， 混合检测方案（让回答更准确）， 检索质量优化， Tool Calling， MCP

 -> Agent 工程与框架 ：Agent loop，LangChain 生态

 -> 深入 Agent 原理 ：长期记忆与短期记忆，Agentic RAG，Workflow， Human-in-the-loop， Transformer 架构

 -> 复杂任务与 Agent 产品 ：Agent 在复杂任务下（多工具、computer use、代码执行）的应用，多 agent 协作， Agent Skills ，Agent 全栈交互（\plan \goal、工具调用、SSE）， Agent产品形态（聊天对话框、实时语音、多模态）

 -> 生产级Agent工程：Agent 安全问题处理， Agent性能评测方案（建立测试集、RAG召回率）， Agent 可观测性的问题（知道为什么失败）

-> 扩展：

- 开放 Agent协议：A2A/ACP 
- 模型策略：路由/微调/私有化部署、推理优化

> 传统的前后端开发知识仍是必备。



项目实战：

推荐上手XingClaw,OpenClaw的Python精简版,代码逻辑清晰,适合理解Agent原理。

① docs/00_文件总览.md>理解全局架构 ② src/ai/统一LLM接口层,理解数据怎么流动 

③ src/agent_core/agent_loop.py3 → 核心中的核心,Agent Loop怎么跑 

④ src/coding_agent/builtin_tools.pyl → 内置工具怎么实现的 

⑤ src/im/ → 怎么对接飞书IM
