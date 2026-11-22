---
title: "游戏开发-整体概念&UE入门"
description: ''
date: "2026-11-14"
updatedDate: "2026-11-15"
language: zh-CN
tags:
  - 游戏开发
  - Unreal Engine
categories:
  - 游戏开发
  - Unreal Engine
comments: false
---

# 游戏开发-整体概念&UE入门

**整体流程**

1. 立项与预制作：确定玩法、目标用户、预算、技术方案
2. 原型开发（Prototype）：验证移动、射击、战斗等核心玩法是否有趣
3. 正式开发（Production）：按功能模块并行开发、持续集成
4. 测试与优化
5. 发布上线（Release）
6. 持续运营（LiveOps）

**岗位分工**

| 岗位           | 主要工作                                             | 典型产出                   |
| -------------- | ---------------------------------------------------- | -------------------------- |
| 游戏策划       | 设计规则、玩法、数值、系统                           | 需求文档、配置表           |
| 游戏美术       | 制作角色、枪械、地图、动画、特效、UI 资源            | 模型、贴图、动画、特效     |
| 客户端程序     | 玩家操作、画面表现、UI、动画、部分游戏逻辑、网络交互 | UE C++ / 蓝图代码          |
| 游戏服务端程序 | 权威游戏逻辑、状态同步、房间、战斗结算等             | C++ / Go / Java 等服务代码 |
| 测试（QA）     | 功能验证、回归测试、兼容性测试                       | Bug 报告、测试用例         |
| 技术美术（TA） | 美术工具、Shader、渲染优化、资源管线                 | 工具、材质、技术方案       |
| 运维 / SRE     | 部署、监控、扩容、故障处理                           | 运行中的服务基础设施       |

注意，客户端和服务端的边界不是绝对的。

**一个示例：**

假设正在开发一款多人 FPS 游戏，策划提出一个需求：

> 玩家按下 R 键，可以给当前武器换弹。换弹需要 2 秒，换弹过程中不能开枪。换弹完成后，从背包弹药中补充弹匣。其他玩家也能看到换弹动画。

1. 策划编写需求文档，明确具体规则
2. 由客户端和服务端程序共同讨论技术，**哪些逻辑在客户端执行，哪些逻辑由服务器决定？**
3. 美术制作资源。美术把资源导入 UE 后，动画程序或客户端程序负责将这些资源与代码连接起来。
4. 客户端程序开始写代码
5. 服务器编写权威逻辑
6. 客户端与服务器联调

**两类服务端程序的区别**

| 对比               | 战斗服务器程序           | 游戏后台程序               |
| ------------------ | ------------------------ | -------------------------- |
| 核心职责           | 实时战斗模拟             | 业务系统与数据管理         |
| 典型功能           | 射击、伤害、位置同步     | 登录、匹配、商城、排行     |
| 常用语言           | C++                      | Go、Java、C++              |
| 通信               | UE Replication、RPC 等   | HTTP、gRPC、WebSocket 等   |
| 主要难点           | 延迟、同步、性能、反作弊 | 高并发、数据库、分布式系统 |
| 与互联网后端相似度 | 部分相似                 | 很高                       |

>- 游戏客户端开发通常最有直观的乐趣：写一个 C++ 函数，角色就能冲刺、开枪、滑铲、攀爬。你可以不断调整手感，立即看到效果。
>
>  有趣的技术包括 Gameplay、动画状态机、物理、AI、渲染和交互
>
>- 战斗服务器开发的技术挑战很有意思：网络、算法、性能优化和复杂逻辑
>
>- 游戏后台开发更偏向工程和系统设计：支撑整个游戏的系统



客户端程序员通常还会细分为 Gameplay（玩法）、UI、引擎、渲染、动画、工具等方向。

- 编程基础
- 游戏引擎
- 游戏数学：向量、矩阵、四元数、插值
- 图形学与 Shader：渲染管线、材质、光照
- 动画与物理
- 多人网络：RPC、Replication、预测
- UI 与交互
- 性能优化：CPU、GPU、内存、Profiler

| 知识领域                  | Gameplay 程序  | 渲染程序      | 引擎程序     |
| ------------------------- | -------------- | ------------- | ------------ |
| C++                       | 精通           | 精通          | 精通         |
| **UE Gameplay Framework** | 精通           | 了解          | 熟悉         |
| 数据结构与算法            | 熟练           | 熟练          | 精通         |
| **线性代数**              | 熟练           | 精通          | 熟练         |
| Shader / HLSL             | 了解           | 精通          | 视模块而定   |
| 渲染管线                  | 基础           | 精通          | 熟练         |
| 动画系统                  | 熟练           | 了解          | 视模块而定   |
| 物理碰撞                  | 熟练           | 基础          | 视模块而定   |
| **网络同步**              | 多人项目需熟练 | 基础          | 视模块而定   |
| **性能优化**              | 熟练           | 精通 GPU 优化 | 精通相关模块 |

> **Gameplay 客户端程序员**不要求一开始就会自己写一套渲染引擎，也不要求精通 HLSL。
>
> 但你需要知道 Shader 是什么、材质如何工作、GPU 大致怎样把三维场景绘制到屏幕上。



Shader（着色器）：本质上是运行在 GPU 上的程序，用来参与计算物体如何显示，例如颜色、表面材质和光照效果。

> UE5 提供 Material Editor，可以通过节点编辑材质，通常不需要 Gameplay 程序员亲自编写 HLSL。



目前学习：

- [ ] C++ + UE Gameplay

  https://dev.epicgames.com/documentation/unreal-engine/unreal-engine-5-9-documentation

  https://tomlooman.com/unreal-engine-cpp-guide

  https://tomlooman.com/unreal-engine-cpp-tutorials/

- [ ] 游戏数学 + 动画物理

- [ ] 计算机图形学：Mesh、Shader

- [ ] 多人网络编程

- [ ] 渲染与 Shader 基础

- [ ] 工程与性能优化：分析 CPU/GPU 帧耗时

## UE术语介绍

每个项目都关联一个 `.uproject` 文件

虚幻引擎中的几乎所有东西都继承自 Object（或从中获得一些功能）

在 C++ 中，`UObject `是所有对象的基类；它实现了诸如垃圾回收、元数据 (UProperty) 支持（用于向虚幻编辑器公开变量）以及序列化（用于加载和保存）等功能。

**Class** 定义了特定 Actor 或对象的行为和属性

**Actor** 是可以放置在 level 中的任何object。Actor 支持平移、旋转和缩放等 3D 变换。

`AActor` 是所有 Actor 的基类。

**Component** 是可以添加到 Actor 中的功能模块。将component添加到 Actor 后，Actor 即可使用该组件提供的功能。 component 必须附加到 Actor 上，不能独立存在。

**Pawn** 是 Actor 的一个子类，用作游戏中的化身或角色（例如，游戏中的角色）。Pawn 可以由玩家控制，也可以由游戏的 AI 控制，即非玩家角色 (NPC)。

- Possessed：被玩家（包括人类玩家和AI 玩家）控制
- Unpossessed

**Character** 是 Pawn Actor 的一个子类，旨在用作玩家角色。Character 子类包含碰撞设置、双足行走的输入绑定以及用于玩家控制移动的附加代码。

**Player Controller** 接收玩家输入并将其转化为游戏中的交互。每个游戏至少包含一个。通常会拥有一个Pawn或Character来代表游戏中的玩家。 在多人游戏过程中，服务器会为游戏中的每个玩家维护一个Player Controller实例，因为它需要能够向每个玩家发起网络函数调用。每个客户端都只有与其玩家对应的Player Controller，并且只能使用该Player Controller与服务器通信。

对应C++类是 `PlayerController`

**AI Controller** 拥有一个代表非玩家角色（NPC）的 Pawn。默认情况下，Pawn和Character都会拥有一个基础AI Controller，除非它们被Player Controller明确控制，或者被明确告知不要为自己创建AI Controller。

**Player State** 指游戏中参与者的状态，例如人类玩家或模拟玩家的bot。 非玩家AI没有 Player State。 对于多人游戏，所有玩家的Player State 都存在于 所有机器 上，并且可以将数据从服务器复制到客户端以保持数据同步。**保存某一个玩家的公共状态。**

对应C++ 类是 `PlayerState`

> Player Controller 仅存在于它所代表的玩家的机器上。

**Game Mode** 设定了正在进行的游戏规则。 每个Level都只能使用一种游戏模式。 在多人游戏中，游戏模式**仅存在于服务器**上，规则会复制（发送）到每个连接的客户端。

对应C++ 类是 `GameMode`

**Game State** 是一个容器，用于存储希望复制到游戏中的每个客户端的信息。 **保存整场游戏的公共状态。**对于多人游戏，每个玩家的机器上都有一个本地Game State实例。本地Game State实例从服务器的Game State实例获取更新信息。

对应 C++ 类是 `GameState`

| 对比         | GameState                       | PlayerState                    |
| ------------ | ------------------------------- | ------------------------------ |
| C++ 基类     | `AGameStateBase` / `AGameState` | `APlayerState`                 |
| 管理对象     | 整场比赛                        | 单个玩家                       |
| 每场游戏数量 | 通常 1 个                       | 通常每位玩家 1 个              |
| 存储数据     | 比赛时间、阶段、团队比分        | 玩家名称、击杀、死亡、个人得分 |
| 创建与管理   | 由服务器上的 GameMode 创建      | 通常由服务器为玩家创建         |
| 网络复制     | 服务器 → 客户端                 | 服务器 → 客户端                |

**Level** （Maps）是定义的游戏区域。关卡包含玩家可以看到和互动的所有内容，例如geometry、Pawns和Actors。 UE会将每个关卡保存为单独的 `.umap` 文件

**World** 是 构成游戏的所有Level 的容器。负责处理关卡的流式传输和动态Actor的生成（创建）。

## UE Editor

**Level Editor** 是构建游戏关卡的主要编辑器。默认会自动打开。可以添加不同类型的 Actor 和几何体、蓝图、可视化脚本、Niagara 等

**Static Mesh Editor ** 预览 static mesh (静态网格体) 的外观、碰撞和 UV 贴图(mapping)，以及设置和调整其属性。还可设置 LOD（Level of Detail settings 细节级别设置）。

> 表示三维物体几何形状的一种资源。
>
> - **Mesh**：网格，指由顶点（Vertices）、边（Edges）、面（Faces）组成的三维几何结构。
>
>   Mesh 本意就是“网、网状结构”，而三维模型由顶点、边和面连接形成类似网状的结构。
>
> - **Static**：静态，指这种网格体本身不具有骨骼驱动的变形动画，并不是说它不能移动。
>
>  Static Mesh 的 Static 主要是相对于 **Skeletal Mesh（骨骼网格体）** 而言的：
>
> | 对比           | Static Mesh      | Skeletal Mesh        |
> | -------------- | ---------------- | -------------------- |
> | 是否具有骨骼   | 通常没有         | 有骨骼结构           |
> | 骨骼动画       | 不支持           | 支持                 |
> | 整体移动、旋转 | 支持             | 支持                 |
> | 物理模拟       | 支持             | 支持                 |
> | 典型用途       | 建筑、道具、家具 | 人物、动物、动画武器 |

**Material Editor** 创建和编辑材质。材质是可以应用于 mesh 以控制其视觉效果的asset。

> - **Texture（纹理）**：提供颜色、粗糙度、法线等数据，通常以图片的形式存储。
> - **Material（材质）**：决定物体表面最终如何呈现，包括颜色、金属感、粗糙度、透明度、发光等。
>
> Texture 可以理解为 GPU 在渲染时读取的一组数据。
>
> Material 是一个用于描述物体表面如何渲染的系统。Material 不仅能读取 Texture，还能执行数学计算、混合不同纹理、使用参数以及控制各种渲染属性。
>
> | 对比             | Texture              | Material                     |
> | ---------------- | -------------------- | ---------------------------- |
> | 本质             | 数据资源             | 渲染规则与参数               |
> | 主要作用         | 提供颜色、法线等数据 | 决定物体表面如何显示         |
> | 是否需要 Shader  | 本身不需要           | 通常会编译成 Shader 相关代码 |
> | 是否可以独立存在 | 可以                 | 可以不使用 Texture           |
> | UE 常见命名      | `T_Brick`            | `M_Brick`                    |

**Blueprint Editor** 处理和修改蓝图。可用于创建游戏元素（例如，控制 Actor 或编写事件脚本）、修改材质或实现其他虚幻引擎功能。

**Physics Asset Editor** 创建用于 Skeletal Mesh 的物理资源。可实现变形和碰撞等物理特性。

**Behavior Tree Editor** 通过基于节点的可视化系统（类似于蓝图）为关卡中的Actor编写人工智能 (AI) 脚本。您可以为敌人、非玩家角色 (NPC)、载具等创建任意数量的不同行为。

**Niagara Editor** 利用完全模块化的粒子特效(particle effects) 系统创建特效，该系统由用于每种特效的独立粒子emitter组成。

**UMG (Unreal Motion Graphics) UI Editor** 一个可视化 UI 创作工具，可用于创建 UI 元素，例如游戏内HUD (head's up display)、Menu 或其他与界面相关的图形。

**Sequencer Editor** 使用专门的多轨道编辑器创建游戏内过场动画。

**Animation Editor** 用于编辑Skeleton Assets、Skeleton Meshes、动画蓝图和各种其他动画资源。

**Control Rig** 一套动画工具，可让您直接在引擎内绑定和制作角色动画。

**Sound Cue Editor**  组合和混合多个声音资源，生成一个混合后的输出，并将其保存为Sound Cue。

**Media Editor** 定义媒体文件或 URL，作为虚幻引擎 5 中播放的源媒体。

## UE项目目录

`Engine`目录包含引擎本身及其所有配套工具。每个游戏文件夹包含与该游戏相关的所有文件。

**Engine/** 包含构成引擎的所有源代码、内容等

**Binaries/** 包含编译过程中创建的可执行文件或其他文件

**Build/** 包含构建引擎或游戏所需的文件，包括创建特定平台构建所需的文件。

**Content/**  包含引擎或游戏的内容，包括资源包和地图。

**Intermediate/** 包含引擎或游戏构建过程中生成的临时文件。在游戏目录中，shader(着色器) 就存储在中间目录中。

**Source/** 包含引擎或游戏的所有源文件，包括引擎源代码、工具、游戏玩法类等

- **Game/** 源文件按Module组织；每个模块对应一个目录。每个Module包含以下内容：

  **Classes** 包含所有gameplay class header（.h）。此目录以后不应再添加新内容。

  **Private**  包含所有源 (.cpp) 文件，包括游戏玩法类实现文件和模块实现文件

  **Public** 包含模块头文件



Module 和 Plugin 的主要区别之一在于，模块只包含代码。例如，在虚幻引擎中创建一个项目时，项目源代码会被组织成一个包含 *.Build.cs 文件的模块。

插件则包含自己的源文件、二进制文件和一个 .uplugin 文件。插件还可以包含assets，而模块则不能。

## UE 坐标系

UE 使用笛卡尔坐标系(Cartesian coordinate system) 来表示三维 欧几里得空间(Euclidean space) 中的位置。

坐标系采用**左手坐标系**，**Z 轴向上**。点的位置由其在三个坐标轴（X 轴、Y 轴和 Z 轴）上的位置决定。

- **+X：前方 **  Red    （X-axis: abscissa）
- **+Y：右方 **  Green   (Y-axis: ordinate)
- **+Z：上方**  Blue       (Z-axis: applicate)

<img src="https://dev.epicgames.com/community/api/documentation/image/e0210fee-8b01-478b-82ca-1a49556c1778?resizing_type=fit" alt="img" style="zoom:50%;" />

> Unity和虚幻引擎都使用左手坐标系，但坐标轴的命名方式不同。
>
> Unity中，主要的测量单位是一米。 在虚幻引擎中，主要测量单位是一厘米。

三维欧几里得空间中，两点之间的直线距离可以用勾股定理的三维形式计算：
$$
d=\sqrt{(x_2-x_1)^2+(y_2-y_1)^2+(z_2-z_1)^2}
$$
UE5 中的 `FVector::Dist()` 可用于计算两个三维位置之间的距离

Origin (原点) 是坐标轴的交点，由坐标为 (0, 0, 0) 的点表示。

- Move Tool (W)   位置平移
- Rotate Tool (E)   旋转
- Scale Tool (R)   缩放大小

**Coordinate Space**  每个坐标空间都有其自身的坐标系和原点。坐标轴的交点即为该特定坐标空间的原点。

一个物体的位置是 (100, 0, 0)，表示它在哪里，取决于它使用的是哪个 Coordinate Space：



**World Space** 是整个关卡使用的坐标系。它的原点是场景中心（world grid）。这个坐标系是固定的，无法变换。  用途：玩家、敌人的世界位置

> 不管这个 Actor 自己朝哪个方向旋转，世界坐标系的方向都不会因此改变

**Local Space** 是相对于某个对象自身或父对象的坐标系，它的坐标轴会随着对象的旋转而改变。该空间也称为object space。每个actor在场景中都有一个相对于其 pivot point (枢轴点) 的 local space坐标系。Actor的枢轴点是 local space 的原点。   用途：武器挂点、摄像机相对位置

**Screen space** 把三维世界中的位置转换成二维屏幕坐标。典型用途： HUD、血条、准星、任务标记、屏幕的伤害提示。

**UV Space** / 2D or texture coordinates  将三维表面网格参数化为归一化二维空间（0-1）的坐标系（U，V）。纹理水平方向用U表示，纹理垂直方向用V表示。 用途：把一张二维 Texture 正确地贴到三维 Mesh 表面。用于 Material、Texture Mapping 和 Shader。

> 把一个纸盒拆开，铺平成一张二维纸，然后在纸上印图案，再重新折回纸盒。



Unreal Engine 默认使用以下**国际单位制（SI）计量单位**：

| **物理量**                       | **单位**             |
| -------------------------------- | -------------------- |
| 距离 / 长度（Distance / Length） | **厘米（cm）**       |
| 质量（Mass）                     | 千克（kg）           |
| 时间（Time）                     | 分钟（min）、秒（s） |
| 角度（Angles）                   | 度（deg）            |
| 速率 / 速度（Speed / Velocity）  | 米每秒（m/s）        |
| 温度（Temperature）              | 摄氏度（°C）         |
| 力（Force）                      | 牛顿（N）            |
| 力矩 / 扭矩（Torque）            | 牛顿·米（N·m）       |

**注意：** UE5 中虽然可使用米每秒（m/s）表示速度，但在常见的 C++ Gameplay API 中，距离默认以厘米为单位，因此速度通常使用**厘米每秒（cm/s）**

`GetCharacterMovement()->MaxWalkSpeed = 600.f;`  表示 600 cm/s = 6 m/s。

> 游戏中使用的单位在数值上不一定要符合现实世界。比如FPS 游戏为了操作手感，可以让角色移动速度达到 8 m/s，甚至更快。  游戏里的数值可以不真实，但单位必须保持一致。

## UE Content Browser

UE Editor中用于创建、导入、组织、查看和管理虚幻项目中内容资源的主要区域。

## UE Actor

Actor 是可以放置在关卡中的任何对象，例如摄像机、静态网格体或玩家起始位置。Actor 支持平移、旋转和缩放等 3D 变换。它们可以通过游戏代码（C++ 或蓝图）创建（生成）和销毁。

要创建Level，你需要将 Actor 放置在Level（Map）中，并添加脚本来控制它们的行为。

将 Actor 放置到Level中会创建该 Actor 所基于的对象的一个实例。



Component 是可以添加到 Actor 中的功能模块。

例如：Spot Light Component 会让你的角色像聚光灯一样发光。

Component 不能独立存在，它们必须附加到 Actor 上。

一辆汽车（Actor）可以作为世界（Level）中的一个对象存在，而无需驾驶员（蓝图或 C++ 代码）来告诉它该做什么。之后，可以使用蓝图或 C++ 代码来单独访问汽车的每个组件（例如，如果踩下了油门踏板组件，蓝图逻辑可以使汽车加速）。

在 Actor 中作为子对象创建的 Components 会被实例化，意味着特定类的每个 Actor 实例都会获得其自身唯一的 Components 实例。

## Playing and Simulating

即时预览游戏，无需先将其构建成独立应用程序：

- Play In Editor (PIE)  ： play 始终会从玩家起始位置开始游戏，并赋予玩家角色控制权

  "Frame skip" (跳帧)：使游戏画面前进 1 帧（如果有动画对象，例如粒子发射器，则可很容易地看到）

  > 打开 PIE 控制台，请在 PIE 模式下玩游戏时按波浪号 (~) 键

- Simulate In Editor (SIE)：simulation 不会移动摄像机，也不会生成玩家角色。

  比如 模拟 具有物理特性的球，查看其落下的碰撞情况。
