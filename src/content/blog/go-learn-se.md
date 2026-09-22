---
title: "Go语言-后端开发相关技术"
description: ''
date: "2026-09-22"
language: zh-CN
tags:
  - Golang
  - 后端开发
categories:
  - Golang
  - 后端开发
comments: false
---

# Go语言-后端开发相关技术

## 测试

TDD（Test Driven Development）

Go语言中的测试依赖go test命令。编写测试代码和编写普通的Go代码过程是类似的。

go test命令是一个按照一定约定和组织的测试代码的驱动程序。在包目录内，所有以_test.go为后缀名的源代码文件都是go test测试的一部分，不会被go build编译到最终的可执行文件中。

在`*_test.go`文件中有三种类型的函数，单元测试函数、基准测试函数和示例函数。

| 类型     | 格式                  | 作用                           |
| -------- | --------------------- | ------------------------------ |
| 测试函数 | 函数名前缀为Test      | 测试程序的一些逻辑行为是否正确 |
| 基准函数 | 函数名前缀为Benchmark | 测试函数的性能                 |
| 示例函数 | 函数名前缀为Example   | 为文档提供示例文档             |

go test命令会遍历所有的`*_test.go`文件中符合上述命名规则的函数，然后生成一个临时的main包用于调用相应的测试函数，然后构建并运行、报告测试结果，最后清理测试中生成的临时文件。

### 单元测试

Golang单元测试对文件名和方法名，参数都有很严格的要求：

- 文件名必须以xx_test.go命名 
- 方法必须是Test[ ^ a-z]开头 
- 方法参数必须`t *testing.T` 
- 使用go test执行单元测试

go test是go语言自带的测试工具，其中包含的是两类，单元测试和性能测试

通过go help test可以看到go test的使用说明：

格式形如： go test [-c] [-i] [build flags] [packages] [flags for test binary]



每个测试函数必须导入testing包，测试函数的基本格式（签名）如下：

```go
func TestName(t *testing.T){
    // ...
}
```

测试函数的名字必须以Test开头，可选的后缀名必须以大写字母开头。其中参数t用于报告测试失败和附加的日志信息。

```go
func TestAdd(t *testing.T){ ... }
func TestSum(t *testing.T){ ... }
```

一个软件程序也是由很多单元组件构成的。单元组件可以是函数、结构体、方法和最终用户可能依赖的任意东西。

单元测试是一些利用各种方法测试单元组件的程序，它会将结果与预期输出进行比较。



测试覆盖率是你的代码被测试套件覆盖的百分比。通常我们使用的都是语句的覆盖率，也就是在测试中至少被运行一次的代码占总代码的比例。

Go提供内置功能来检查你的代码覆盖率。我们可以使用go test -cover来查看测试覆盖率。



### 基准压力测试

基准测试就是在一定的工作负载之下检测程序性能的一种方法。基准测试的基本格式如下：

```go
func BenchmarkName(b *testing.B){
    // ...
}
```

基准测试以Benchmark为前缀，需要一个`*testing.B`类型的参数b，基准测试必须要执行b.N次，这样的测试才有对照性，b.N的值是系统根据实际情况去调整的，从而保证测试的稳定性。



性能比较函数通常是一个带有参数的函数，被多个不同的Benchmark函数传入不同的值来调用。



`func (b *B) RunParallel(body func(*PB))`会以并行的方式执行给定的基准测试。

RunParallel会创建出多个goroutine，并将b.N分配给这些goroutine执行， 其中goroutine数量的默认值为GOMAXPROCS。用户如果想要增加非CPU受限（non-CPU-bound）基准测试的并行性， 那么可以在RunParallel之前调用SetParallelism 。RunParallel通常会与-cpu标志一同使用。



### 压力测试

Go语言中自带有一个轻量级的测试框架testing和自带的go test命令来实现单元测试和性能测试，testing框架和其他语言中的测试框架类似，你可以基于这个框架写针对相应函数的测试用例，也可以基于该框架写相应的压力测试用例。

注意：go test命令只能在一个相应的目录下执行所有文件



## Gin框架

- Gin是一个golang的微框架，封装比较优雅，API友好，源码注释比较明确，具有快速灵活，容错方便等特点
- 对于golang而言，web框架的依赖要远比Python，Java之类的要小。自身的`net/http`足够简单，性能也非常不错
- 借助框架开发，不仅可以省去很多常用的封装带来的时间，也有助于团队的编码风格和形成规范

```go
func main() {
    // 1.创建路由
   r := gin.Default()
   // 2.绑定路由规则，执行的函数
   // gin.Context，封装了request和response
   r.GET("/", func(c *gin.Context) {
      c.String(http.StatusOK, "hello World!")
   })
   
   r.POST("/xxxpost",getting)
   r.PUT("/xxxput")
   // 3.监听端口，默认在8080
   // Run("里面不指定端口号默认为8080") 
   r.Run(":8000")
}
```

Restful API (Representational State Transfer):URL定位资源，用HTTP描述操作

1.获取文章 /blog/getXxx Get blog/Xxx

2.添加 /blog/addXxx POST blog/Xxx

3.修改 /blog/updateXxx PUT blog/Xxx

4.删除 /blog/delXxxx DELETE blog/Xxx























































## 微服务

- 使用一套小服务来开发单个应用的方式，每个服务运行在独立的进程里，一般采用轻量级的通讯机制互联，并且它们可以通过自动化的方式部署

- 单一功能
- 微服务是设计思想，不是量的体现

特点：

- 单一职责
- 轻量级的通信，通信与平台和语言无关，http是轻量的，例如java的RMI属于重量的
- 隔离性，数据隔离
- 有自己的数据
- 技术多样性



使用技术栈：

1. 硬件层：用docker+k8s去解决

2. 通信层：

   1. 网络传输，用RPC（远程过程调用）

      - HTTP传输，GET POST PUT DELETE

      - 基于TCP，更靠底层，RPC基于TCP，Dubbo，gRPC，Thrift

   2. 知道调用谁，用服务注册和发现

   3. 分布式数据同步：etcd，consul，zk     
   
3. 应用平台层：云管理平台、监控平台、日志管理平台；服务管理平台，测试发布平台；服务治理平台
4. 微服务层：微服务框架实现业务逻辑

### RPC

- 远程过程调用（Remote Procedure Call，RPC）是一个计算机通信协议:允许运行于一台计算机的程序调用另一台计算机的子程序，而程序员无需额外地为这个交互作用编程

- golang写RPC程序，必须符合4个基本条件，不然RPC用不了
  - 结构体字段首字母要大写，可以别人调用
  - 函数名必须首字母大写
  - 函数第一参数是接收参数，第二个参数是返回给客户端的参数，必须是指针类型
  - 函数还必须有一个返回值error

微服务架构下数据交互一般是对内 RPC，对外 REST
将业务按功能模块拆分到各个微服务，具有提高项目协作效率、降低模块耦合度、提高系统可用性等优点，但是开发门槛比较高，比如 RPC 框架的使用、后期的服务监控等工作
一般情况下，我们会将功能代码在本地直接调用，微服务架构下，我们需要将这个函数作为单独的服务运行，客户端通过网络调用



### Raft

Raft是consoul和etcd的核心算法. 提供了一种在计算系统集群中分布状态机的通用方法，确保集群中的每个节点都同意一系列相同的状态转换。 有许多开源参考实现。

- 一个Raft集群包含若干个服务器节点，通常是5个，这允许整个系统容忍2个节点的失效，每个节点处于以下三种状态之一
  - follower（跟随者） ：所有节点都以 follower 的状态开始。如果没收到 leader消息则会变成 candidate状态
  - candidate（候选人）：会向其他节点“拉选票”，如果得到大部分的票则成为leader，这个过程就叫做Leader选举(Leader Election)
  - leader（领导者）：所有对系统的修改都会先经过leader

Raft一致性算法：通过选出一个leader来简化日志副本的管理，例如，日志项(log entry)只允许从leader流向follower。

- 基于leader的方法，Raft算法可以分解成三个子问题
  - Leader election (领导选举)：原来的leader挂掉后，必须选出一个新的leader
  - Log replication (日志复制)：leader从客户端接收日志，并复制到整个集群中
  - Safety (安全性)：如果有任意的server将日志项回放到状态机中了，那么其他的server只会回放相同的日志项

Leader election (领导选举)：

使用一种心跳机制来触发领导人选举。

- 当服务器程序启动时，节点都是 follower(跟随者) 身份
- 如果一个跟随者在一段时间里没有接收到任何消息，也就是选举超时，然后他就会认为系统中没有可用的领导者然后开始进行选举以选出新的领导者
- 要开始一次选举过程，follower 会给当前term加1并且转换成candidate状态，然后它会并行的向集群中的其他服务器节点发送请求投票的 RPCs 来给自己投票。
- 候选人的状态维持直到发生以下任何一个条件发生的时候
  - 他自己赢得了这次的选举
  - 其他的服务器成为领导者
  - 一段时间之后没有任何一个获胜的人

Log replication (日志复制)：

- 当选出 leader 后，它会开始接收客户端请求，每个请求会带有一个指令，可以被回放到状态机中
- leader 把指令追加成一个log entry，然后通过AppendEntries RPC并行地发送给其他的server，当该entry被多数server复制后，leader 会把该entry回放到状态机中，然后把结果返回给客户端
- 当 follower 宕机或者运行较慢时，leader 会无限地重发AppendEntries给这些follower，直到所有的follower都复制了该log entry
- raft的log replication要保证如果两个log entry有相同的index和term，那么它们存储相同的指令
- leader在一个特定的term和index下，只会创建一个log entry



### gRPC

gRPC由google开发，是一款语言中立、平台中立、开源的远程过程调用系统。gRPC客户端和服务端可以在多种环境中运行和交互，例如用java写一个服务端，可以用go语言写客户端调用。

- 微服务架构中，由于每个服务对应的代码库是独立运行的，无法直接调用，彼此间的通信就是个大问题
- gRPC可以实现微服务，将大的项目拆分为多个小且独立的业务模块，也就是服务，**各服务间使用高效的protobuf协议**进行RPC调用，gRPC默认使用protocol buffers，这是google开源的一套成熟的结构数据序列化机制（当然也可以使用其他数据格式如JSON）
- 可以用proto files创建gRPC服务，用message类型来定义方法参数和返回类型



### protobuf协议

文件以.proto做为文件后缀，除结构定义外的语句以分号结尾
结构定义可以包含：message、service、enum
rpc方法定义结尾的分号可有可无
Message命名采用驼峰命名方式，字段命名采用小写字母加下划线分隔方式

```
message SongServerRequest {
      required string song_name = 1;
  }
```

Enums类型名采用驼峰命名方式，字段命名采用大写字母加下划线分隔方式‘

```
enum Foo {
      FIRST_VALUE = 1;
      SECOND_VALUE = 2;
  }
```

Service与rpc方法名统一采用驼峰式命名





