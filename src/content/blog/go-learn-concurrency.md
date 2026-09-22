---
title: "Go语言-并发"
description: ''
date: "2026-09-22"
language: zh-CN
tags:
  - Golang
  - 并发
categories:
  - Golang
  - 并发
comments: false
---

# Go语言-并发

进程和线程：

- 进程是程序在操作系统中的一次执行过程，系统进行资源分配和调度的一个独立单位。
- 线程是进程的一个执行实体,是CPU调度和分派的基本单位,它是比进程更小的能独立运行的基本单位。
- 一个进程可以创建和撤销多个线程;同一个进程中的多个线程之间可以并发执行。

并发与并行：

- **多线程**程序在**一个核**的cpu上运行,就是**并发**。
-  多线程程序在多个核的cpu上运行,就是并行。

注意：并发主要由切换时间片来实现"同时"运行，并行则是直接利用多核实现多线程的运行，go可以设置使用核数，以发挥多核计算机的能力。



协程routine 和 线程thread：

- 协程：独立的栈空间，共享堆空间，**调度由用户自己控制**，本质上有点**类似于用户级线程**，这些用户级线程的调度也是自己实现的。
- 线程：**一个线程上可以跑多个协程**，协程是轻量级的线程。



goroutine 只是由官方实现的超级"线程池"。每个实例4~5KB的栈内存占用和由于实现机制而大幅减少的创建和销毁开销是go高并发的根本原因。

> goroutine 提供并发机制；多个 goroutine 在满足条件时可以并行执行。

goroutine 奉行 Do not communicate by sharing memory; instead, **share memory by communicating**.

即：不要让多个 goroutine 一起操作同一个变量来交换信息；尽量通过 channel 把数据传给对方。

核心是**数据的所有权/访问权通过通信进行传递或协调**。

> goroutine 之间需要交换数据时，Go 鼓励优先考虑 channel，而不是大家一起读写一个变量然后到处加锁。
>
> ```
> 传递任务 / 数据 / 事件 => channel
> 
> 保护共享状态 -> sync.Mutex
> ```



## goroutine

go提供了一种机制，程序员只需要定义很多个任务，系统去帮助我们把这些任务分配到CPU上实现并发执行。

> 在Java/c++中我们要实现并发编程的时候，我们通常需要自己维护一个线程池，并且需要自己去包装一个又一个的任务，同时需要自己去调度线程执行任务并维护上下文切换

goroutine的概念类似于线程，但 goroutine是**由Go的运行时（runtime）调度和管理**的。Go程序会**智能地**将 goroutine 中的任务**合理地分配给每个CPU**。

Go语言之所以被称为现代化的编程语言，就是因为它在**语言层面已经内置了调度和上下文切换**的机制。

不需要去自己写进程、线程、协程，你的技能包里只有一个—goroutine，**当你需要让某个任务并发执行的时候，你只需要把这个任务包装成一个函数，开启一个goroutine去执行**这个函数就可以了，就是这么简单粗暴。



只需要在调用函数的时候在前面加上go关键字，就可以为一个函数创建一个goroutine。

一个goroutine必定对应一个函数，可以创建多个goroutine去执行相同的函数。

```go
func main() {
    go hello() // 启动另外一个goroutine去执行hello函数
    fmt.Println("main goroutine done!")
}
// 在程序启动时，Go程序就会为main()函数创建一个默认的goroutine。
// 当main()函数返回的时候, 该goroutine就结束了,所有在main()函数中启动的goroutine会一同结束
```

> 只是告诉 Go：hello() 这个任务，我希望它并发执行。
>
> 至于：
>
> - 创建多少 OS 线程？
>
> - 哪个 goroutine 放到哪个线程？
> - goroutine 什么时候暂停？
> - 什么时候继续运行？
> - 哪个 CPU 核执行？
>
> 这些主要由 Go runtime 的调度器负责。
>
> 注意：Go 不是让“并发问题”变简单了，而是让“创建和调度大量并发任务”变简单了。

```go
var wg sync.WaitGroup  // 实现goroutine的同步

func hello(i int) {
    defer wg.Done() // goroutine结束就登记-1
    fmt.Println("Hello Goroutine!", i)
}
func main() {

    for i := 0; i < 10; i++ {
        wg.Add(1) // 启动一个goroutine就登记+1
        go hello(i)
    }
    wg.Wait() // 等待所有登记的goroutine都结束
}
// 多次执行上面的代码，会发现每次打印的数字的顺序都不一致。这是因为10个goroutine是并发执行的，而goroutine的调度是随机的。
```



OS线程（操作系统线程）一般都有固定的栈内存（通常为2MB）,一个goroutine的栈在其生命周期开始时只有很小的栈（典型情况下2KB），goroutine的栈不是固定的，他可以按需增大和缩小，goroutine的栈大小限制可以达到1GB，虽然极少会用到这个大。所以在Go语言中一次创建十万左右的goroutine也是可以的。

goroutine调度：GPM  (Goroutine Machine Processor)，是Go语言运行时（runtime）层面的实现，go语言自己实现的一套调度系统。区别于操作系统调度OS线程。

- G 里面除了存放本goroutine信息外 还有与所在P的绑定等信息。
- P 管理着一组goroutine队列，P里面会存储当前goroutine运行的上下文环境（函数指针，堆栈地址及地址边界），P会对自己管理的goroutine队列做一些调度（比如把占用CPU时间较长的goroutine暂停、运行后续的goroutine等等）当自己的队列消费完了就去全局队列里取，如果全局队列里也消费完了会去其他P的队列里抢任务。
- M（machine）是Go运行时（runtime）对操作系统内核线程的虚拟， M与内核线程一般是 一 一 映射的关系， 一个groutine最终是要放到M上执行的；

P与M一般也是一一对应的。他们关系是： P管理着一组G挂载在M上运行。当一个G长久阻塞在一个M上时，runtime会新建一个M，阻塞G所在的P会把其他的G 挂载在新建的M上。当旧的G阻塞完成或者认为其已经死掉时 回收旧的M。

P的个数是通过 runtime.GOMAXPROCS 设定（最大256），Go1.5版本之后默认为物理线程数。 在并发量大的时候会增加一些P和M，但不会太多，切换太频繁的话得不偿失。

单从线程调度讲，Go语言相比起其他语言的优势在于OS线程是由OS内核来调度的，goroutine则是由Go运行时（runtime）自己的调度器调度的，这个调度器使用一个称为m:n调度的技术（复用/调度m个goroutine到n个OS线程）。 其一大特点是goroutine的调度是在用户态下完成的， 不涉及内核态与用户态之间的频繁切换，包括内存的分配与释放，都是在用户态维护着一块大的内存池， 不直接调用系统的malloc函数（除非内存池需要改变），成本比调度OS线程低很多。 另一方面充分利用了多核的硬件资源，近似的把若干goroutine均分在物理线程上， 再加上本身goroutine的超轻量，以上种种保证了go调度方面的性能。



## Channel

单纯地将函数并发执行是没有意义的。函数与函数间需要交换数据才能体现并发执行函数的意义。

可以使用共享内存进行数据交换，但是共享内存在不同的goroutine中容易发生竞态问题。为了保证数据交换的正确性，必须使用互斥量对内存进行加锁，这种做法势必造成性能问题。

Go语言的并发模型是CSP（Communicating Sequential Processes），提倡通过通信来共享内存。

goroutine是Go程序并发的执行体，channel就是它们之间的连接。channel是可以让一个goroutine发送特定值到另一个goroutine的通信机制。

channel 像一个队列，总遵循 先入先出（First In First Out）的规则，保证收发数据的顺序。声明channel的时候需要为其指定元素类型。

注意：channel是一种类型，一种引用类型。 空值是 `nil`

```go
 var 变量 chan 元素类型

var ch1 chan int   // 声明一个传递整型的通道
var ch2 chan bool  // 声明一个传递布尔型的通道
var ch3 chan []int // 声明一个传递int切片的通道
```

声明的通道后需要使用make函数初始化之后才能使用。

```go
make(chan 元素类型, [缓冲大小])

ch := make(chan int)  // 创建的是无缓冲的通道
ch <- 10 // 把10发送到ch中

x := <- ch // 从ch中接收值并赋值给变量x
<-ch       // 从ch中接收值，忽略结果

close(ch) // 关闭channel
```

channel 有发送（send）、接收(receive）和关闭（close）三种操作。

发送和接收都使用 `<-` 符号。

注意：只有在通知接收方goroutine所有的数据都发送完毕的时候才需要关闭通道。通道是可以被垃圾回收机制回收的，它和关闭文件是不一样的，在结束操作之后关闭文件是必须要做的，但关闭通道不是必须的。

1. 对一个关闭的通道再发送值就会导致panic。
2. 对一个关闭的通道进行接收会一直获取值直到通道为空。
3. 对一个关闭的并且没有值的通道执行接收操作会得到对应类型的零值。
4. 关闭一个已经关闭的通道会导致panic。



### unbuffered channel

**无缓冲的通道又称为阻塞的**通道。无缓冲的通道只有在有人接收值的时候才能发送值。即：必须有接收才能发送。

无缓冲通道上的发送操作会阻塞，直到另一个goroutine在该通道上执行接收操作，这时值才能发送成功，两个goroutine将继续执行。相反，如果接收操作先执行，接收方的goroutine将阻塞，直到另一个goroutine在该通道上发送一个值。

使用无缓冲通道进行通信将**导致发送和接收的goroutine同步化**。因此，无缓冲通道也被称为**同步通道**。

```go
func recv(c chan int) {  
    ret := <-c  // 
    fmt.Println("接收成功", ret)
}
func main() {
    ch := make(chan int)  // 创建的是无缓冲的通道
    go recv(ch) // 启用goroutine从通道接收值
    ch <- 10   // 把10发送到ch中
    fmt.Println("发送成功")
}
```

### buffered channel

```go
func main() {
    ch := make(chan int, 1) // 创建一个容量为1的有缓冲区通道
    ch <- 10
    fmt.Println("发送成功")
    close (ch)
}
```

只要通道的容量大于零，那么该通道就是有缓冲的通道，通道的容量表示通道中能存放元素的数量。

使用内置的len函数获取通道内元素的数量，使用cap函数获取通道的容量。

> 如果你的管道不往里存值或者取值的时候一定记得关闭管道

判断channel已被关闭： 通常使用for range 来检测

```go
func main() {
    ch1 := make(chan int)
    ch2 := make(chan int)
    go func() { // 开启goroutine将0~100的数发送到ch1中
        for i := 0; i < 100; i++ {
            ch1 <- i
        }
        close(ch1)  // 关闭ch1
    }()
    // 开启goroutine从ch1中接收值，并将该值的平方发送到ch2中
    go func() {
        for {
            i, ok := <-ch1 // ch1关闭后再取值ok=false
            if !ok {
                break
            }
            ch2 <- i * i
        }
        close(ch2)  // 
    }()
    // 在主goroutine中从ch2中接收值打印
    for i := range ch2 { // 通道关闭后会退出for range循环
        fmt.Println(i)
    }
}
```

### 单向channel

限制channel在函数中只能发送或只能接收。

在函数传参及任何赋值操作中将双向通道转换为单向通道是可以的，但反过来是不可以。

```go
func counter(out chan<- int) {  // chan<- int是一个只能发送的通道
    for i := 0; i < 100; i++ {
        out <- i
    }
    close(out)
}

func squarer(out chan<- int, in <-chan int) {
    for i := range in {
        out <- i * i
    }
    close(out)
}
func printer(in <-chan int) {  // <-chan int是一个只能接收的通道
    for i := range in {
        fmt.Println(i)
    }
}

func main() {
    ch1 := make(chan int)
    ch2 := make(chan int)
    go counter(ch1)
    go squarer(ch2, ch1)
    printer(ch2)
}
```

## worker pool（goroutine池）

- 本质上是生产者-消费者模型
- 可以有效控制goroutine数量，防止暴涨

```go
type Job struct {
    Id int
    // 需要计算的随机数
    RandNum int
}

type Result struct {
    // 这里必须传对象实例
    job *Job
    // 求和
    sum int
}

func main() {
    // 需要2个channel
    // 1.job，容量为 128
    jobChan := make(chan *Job, 128)
    // 2.结果
    resultChan := make(chan *Result, 128)
    // 3.创建工作池：创建 64 个 worker goroutine
    createPool(64, jobChan, resultChan)
    // 4.开个打印的routine
    go func(resultChan chan *Result) {
        for result := range resultChan {
            // resultChan → Result → 打印
            // 是 Result 的消费者
            fmt.Printf("job id:%v randnum:%v result:%d\n", result.job.Id,
                result.job.RandNum, result.sum)
        }
    }(resultChan)
    
    var id int
    // Job 的生产者 Producer，循环创建job，输入到channel
    for {
        id++
        r_num := rand.Int()
        job := &Job{
            Id:      id,
            RandNum: r_num,
        }
        jobChan <- job
    }
}

// 创建工作池
// 参数1：开几个协程
func createPool(num int, jobChan chan *Job, resultChan chan *Result) {
    // 根据开协程个数，去跑运行
    for i := 0; i < num; i++ {
        go func(jobChan chan *Job, resultChan chan *Result) {
            // 执行运算
            // 不断从 jobChan 里面拿 Job
            for job := range jobChan {
                r_num := job.RandNum
                // 随机数每一位相加
                // 定义返回值
                var sum int
                for r_num != 0 {
                    tmp := r_num % 10
                    sum += tmp
                    r_num /= 10
                }
                // 创建 Result
                r := &Result{
                    job: job,
                    sum: sum,
                }
                resultChan <- r  // worker 发送到→ channel
            }
        }(jobChan, resultChan)
    }
}
```



## 定时器

- Timer：时间到了，执行只执行1次

```go
func main() {
    // 1.timer基本使用
    //timer1 := time.NewTimer(2 * time.Second)
    //t1 := time.Now()
    //fmt.Printf("t1:%v\n", t1)
    //t2 := <-timer1.C
    //fmt.Printf("t2:%v\n", t2)

    // 2.验证timer只能响应1次
    //timer2 := time.NewTimer(time.Second)
    //for {
    // <-timer2.C
    // fmt.Println("时间到")
    //}

    // 3.timer实现延时的功能
    //(1)
    //time.Sleep(time.Second)
    //(2)
    //timer3 := time.NewTimer(2 * time.Second)
    //<-timer3.C
    //fmt.Println("2秒到")
    //(3)
    //<-time.After(2*time.Second)
    //fmt.Println("2秒到")

    // 4.停止定时器
    //timer4 := time.NewTimer(2 * time.Second)
    //go func() {
    // <-timer4.C
    // fmt.Println("定时器执行了")
    //}()
    //b := timer4.Stop()
    //if b {
    // fmt.Println("timer4已经关闭")
    //}

    // 5.重置定时器
    timer5 := time.NewTimer(3 * time.Second)
    timer5.Reset(1 * time.Second)
    fmt.Println(time.Now())
    fmt.Println(<-timer5.C)

    for {
    }
}
```

- Ticker：时间到了，多次执行

```go
func main() {
    // 1.获取ticker对象
    ticker := time.NewTicker(1 * time.Second)
    i := 0
    // 子协程
    go func() {
        for {
            //<-ticker.C
            i++
            fmt.Println(<-ticker.C)
            if i == 5 {
                //停止
                ticker.Stop()
            }
        }
    }()
    for {
    }
}
```



## select

某些场景下我们需要同时从多个通道接收数据。通道在接收数据时，如果没有数据可以接收将会发生阻塞。

Go内置了select关键字，可以同时响应多个通道的操作。

select的使用类似于switch语句，它有一系列case分支和一个默认的分支。每个case会对应一个通道的通信（接收或发送）过程。select会一直等待，直到某个case的通信操作完成时，就会执行case分支对应的语句。

```go
 select {
     case <-chan1:
     // 如果chan1成功读到数据，则进行该case处理语句
     case chan2 <- 1:
     // 如果成功向chan2写入数据，则进行该case处理语句
     default:
     // 如果上面都没有成功，则进入default处理流程
 }
```

- select可以同时监听一个或多个channel，直到其中一个channel ready

- 如果多个channel同时ready，则随机选择一个执行

```go
func test1(ch chan string) {
   time.Sleep(time.Second * 5)
   ch <- "test1"   // 发送
}
func test2(ch chan string) {
   time.Sleep(time.Second * 2)
   ch <- "test2"
}

func main() {
   // 2个管道
   output1 := make(chan string)
   output2 := make(chan string)
   // 跑2个子协程，写数据
   go test1(output1)
   go test2(output2)
   // 用select监控
   select {
   case s1 := <-output1:
      fmt.Println("s1=", s1)
   case s2 := <-output2:
      fmt.Println("s2=", s2)
   }
}
```



## 并发安全和锁

在Go代码中可能会存在多个goroutine同时操作一个资源（临界区），这种情况会发生竞态问题（数据竞态 data race）。

互斥锁是一种常用的控制共享资源访问的方法，它能够保证**同时只有一个goroutine可以访问共享资源**。Go语言中使用sync包的Mutex类型来实现互斥锁。

```go
var x int64
var wg sync.WaitGroup
var lock sync.Mutex  // Mutex

func add() {
    for i := 0; i < 5000; i++ {
        lock.Lock() // 加锁
        x = x + 1
        lock.Unlock() // 解锁
    }
    wg.Done()
}
func main() {
    wg.Add(2)
    go add()  //
    go add()  // 
    wg.Wait()
    fmt.Println(x)
}
```

使用互斥锁能够保证同一时间有且只有一个goroutine进入临界区，其他的goroutine则在等待锁；当互斥锁释放后，等待的goroutine才可以获取锁进入临界区，多个goroutine同时等待一个锁时，唤醒的策略是随机的。

互斥锁是完全互斥的。

很多实际的场景下是**读多写少**的，当我们**并发的去读取**一个资源**不涉及资源修改**的时候是**没有必要加锁**的，这种场景下使用读写锁是更好的一种选择。读写锁在Go语言中使用sync包中的RWMutex类型。

读写锁分为两种：读锁和写锁。

- 当**一个goroutine获取读锁**之后，其他的goroutine**如果是获取读锁会继续获得锁**，如果是获取**写锁就会等待**；
- 当**一个goroutine获取写锁**之后，**其他**的goroutine无论是获取读锁还是写锁**都会等待**。

```go
var (
    x      int64
    wg     sync.WaitGroup
    lock   sync.Mutex
    rwlock sync.RWMutex
)
func write() {
    // lock.Lock()   // 加互斥锁
    rwlock.Lock() // 加写锁
    x = x + 1
    time.Sleep(10 * time.Millisecond) // 假设读操作耗时10毫秒
    rwlock.Unlock()                   // 解写锁
    // lock.Unlock()                     // 解互斥锁
    wg.Done()
}
func read() {
    // lock.Lock()                  // 加互斥锁
    rwlock.RLock()               // 加读锁
    time.Sleep(time.Millisecond) // 假设读操作耗时1毫秒
    rwlock.RUnlock()             // 解读锁
    // lock.Unlock()                // 解互斥锁
    wg.Done()
}

func main() {
    start := time.Now()
    for i := 0; i < 10; i++ {
        wg.Add(1)
        go write()
    }
    for i := 0; i < 1000; i++ {
        wg.Add(1)
        go read()
    }
    wg.Wait()
    end := time.Now()
    fmt.Println(end.Sub(start))
}
```



## Sync

Go语言中可以使用sync.WaitGroup来实现并发任务的同步。

sync.WaitGroup内部维护着一个计数器，计数器的值可以增加和减少。例如当我们启动了N 个并发任务时，就将计数器值增加N。每个任务完成时通过调用Done()方法将计数器减1。通过**调用Wait()来等待并发任务执行完**，当**计数器值为0时，表示所有并发任务已经完成**。

```go
var wg sync.WaitGroup

func hello() {
    defer wg.Done()
    fmt.Println("Hello Goroutine!")
}
func main() {
    wg.Add(1)
    go hello() // 启动另外一个goroutine去执行hello函数
    fmt.Println("main goroutine done!")
    wg.Wait()
}
```

注意sync.WaitGroup是一个结构体，传递的时候要传递指针。



## 原子操作-atomic包

代码中的加锁操作因为涉及内核态的上下文切换会比较耗时、代价比较高。

针对基本数据类型我们还可以使用原子操作来保证并发安全，因为原子操作是Go语言提供的方法，它在用户态就可以完成。

Go语言中原子操作由内置的标准库sync/atomic提供。

```go
var x int64
var l sync.Mutex
var wg sync.WaitGroup

// 普通版加函数
func add() {
    // x = x + 1
    x++ // 等价于上面的操作
    wg.Done()
}

// 互斥锁版加函数
func mutexAdd() {
    l.Lock()
    x++
    l.Unlock()
    wg.Done()
}

// 原子操作版加函数
func atomicAdd() {
    atomic.AddInt64(&x, 1)
    wg.Done()
}

func main() {
    start := time.Now()
    for i := 0; i < 10000; i++ {
        wg.Add(1)
        // go add()       // 普通版add函数 不是并发安全的
        // go mutexAdd()  // 加锁版add函数 是并发安全的，但是加锁性能开销大
        go atomicAdd() // 原子操作版add函数 是并发安全，性能优于加锁版
    }
    wg.Wait()
    end := time.Now()
    fmt.Println(x)
    fmt.Println(end.Sub(start))
}
```







## CSP理论

- GMP (Goroutine Machine Processor) 是 Go runtime 内部用来**调度 goroutine** 的模型
- CSP (Communicating Sequential Processes) 是并发编程模型，并发程序的设计思想。



Golang 的并发模型基于 **CSP（Communicating Sequential Processes）** 理论，这种并发模型通过 Goroutine 和 Channel 实现，强调通过通信来共享内存，而不是通过共享内存来通信。CSP 是一种由英国计算机科学家 Tony Hoare 在 1978 年提出的并发计算模型。以下是 Golang 中 CSP 并发模型的详细解释：

1. **CSP 概念**

- **CSP 理论**：CSP 关注的是并发进程之间的通信，而不是共享内存。这意味着不同的并发进程（或 Goroutine）之间通过发送和接收消息来进行交互，而不是通过共享变量。
- **进程**：在 CSP 中，进程可以是执行某些任务的实体。在 Golang 中，进程的概念被 Goroutine 所取代。

2. **Goroutine**

- **轻量级线程**：Goroutine 是 Go 语言中的一种轻量级线程，它由 Go 运行时管理。每个 Goroutine 使用更少的内存和资源，启动和停止的开销也比操作系统线程小得多。

- **启动 Goroutine**：使用 `go` 关键字启动一个新的 Goroutine，代码示例：

  ```go
  go func() {
      fmt.Println("Hello, Goroutine!")
  }()
  ```

  这段代码启动了一个新的 Goroutine 来执行匿名函数的内容。

- **并发执行**：Goroutine 是并发执行的，它们之间可以独立运行，并且 Go 运行时会在多个 Goroutine 之间调度。

3. **Channel**

- **通信管道**：Channel 是 Golang 提供的一种用于 Goroutine 之间通信的机制。Channel 是类型安全的管道，通过它可以发送和接收特定类型的数据。

- **Channel 的创建**：使用 `make` 函数创建一个 Channel，代码示例：

  ```go
  ch := make(chan int)
  ```

  这段代码创建了一个传递 `int` 类型数据的 Channel。

- **发送和接收**：

  - **发送**：使用 `<-` 操作符将数据发送到 Channel，例如：`ch <- 42`。
  - **接收**：使用 `<-` 操作符从 Channel 接收数据，例如：`value := <- ch`。

- **同步和阻塞**：

  - 在没有缓冲区的 Channel 上，发送和接收是同步的。当一个 Goroutine 向 Channel 发送数据时，它将被阻塞，直到另一个 Goroutine 从 Channel 接收数据。
  - 缓冲 Channel 可以在发送时不阻塞，直到缓冲区满；接收时不阻塞，直到缓冲区为空。

4. **CSP 模型的核心原则**

- **通过通信共享内存**：在 Golang 中，数据在 Goroutine 之间传递时，通常通过 Channel 进行通信。这种模式避免了多 Goroutine 访问共享内存引发的竞争条件，从而减少了数据竞争和锁的使用。
- **同步机制**：Channel 提供了天然的同步机制。当一个 Goroutine 发送数据到一个无缓冲的 Channel 时，它会阻塞，直到另一个 Goroutine 接收数据。这种机制避免了手动使用锁来同步数据。

5. **`select` 语句**

- **多路复用**：`select` 语句允许一个 Goroutine 同时等待多个 Channel 操作。它的语法与 `switch` 类似，但每个 `case` 都是一个 Channel 操作。

- **非阻塞操作**：`select` 可以用于实现非阻塞的发送、接收或超时控制。

  代码示例：

  ```go
  select {
  case msg := <-ch1:
      fmt.Println("Received", msg)
  case ch2 <- 42:
      fmt.Println("Sent to ch2")
  default:
      fmt.Println("No communication")
  }
  ```

6. **CSP 并发模型的优点**

- **简化并发编程**：通过 Goroutine 和 Channel，Go 语言使得并发编程更加直观，开发者不需要直接处理复杂的锁和条件变量。
- **安全性**：CSP 模型降低了并发操作中数据竞争和死锁的风险。
- **可伸缩性**：由于 Goroutine 是非常轻量级的，Go 的并发模型具有高可伸缩性，可以轻松创建数十万甚至更多的 Goroutine。

7. **应用场景**

- **任务并发执行**：在 Web 服务器、微服务架构、并行计算等需要高并发的场景中，Goroutine 和 Channel 被广泛应用。
- **生产者-消费者模型**：通过 Channel 实现数据的生产和消费，确保在高并发下的安全性和性能。

8. **CSP 模型的限制**

- **不适用于共享内存密集的场景**：在需要频繁访问和修改共享内存的场景中，CSP 模型可能不是最佳选择。
- **理解曲线**：尽管 Go 语言的 CSP 模型使并发编程变得更简单，但对于初学者来说，理解 Channel 的阻塞、缓冲等机制仍有一定的学习曲线。



## 生产者-消费者模型

生产者负责产生数据，消费者负责处理数据，channel 负责在两者之间传递数据。

```go
func producer(ch chan int) {
    for i := 1; i <= 5; i++ {
        ch <- i
    }
    close(ch)  // 一般是 发送方负责关闭 channel
}

func consumer(ch chan int) {
    for value := range ch {
        fmt.Println("消费：", value)
    }
}

func main() {
    ch := make(chan int)

    go producer(ch)
    go consumer(ch)
}
```

生产者负责发现任务：

```
jobs <- file
```

消费者负责真正处理：

```
file := <-jobs
process(file)
```

这样消费者数量还可以控制**最大并发量**。



背压（backpressure）：消费者处理不过来时，生产者会自然慢下来。
