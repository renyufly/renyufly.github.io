---
title: "Go语言学习"
description: ''
date: "2026-09-22"
language: zh-CN
tags:
  - Golang
categories:
  - Golang
comments: false
---

# Go语言基础学习

> https://www.topgoer.com/

Go语言在多核并发上拥有原生的设计优势，Go语言从底层原生支持并发，无须第三方库、开发者的编程技巧和开发经验。主要目标是“兼具Python 等动态语言的开发速度和C/C++等编译型语言的性能与安全性”

经过 Go 语言重构的系统能使用更少的硬件资源获得更高的并发和I/O吞吐表现。

Go语言的并发是基于 `goroutine` 的，`goroutine` 类似于线程，但并非线程。可以将 `goroutine` 理解为一种虚拟线程。Go 语言运行时会参与调度 `goroutine`，并将 `goroutine` 合理地分配到每个 CPU 中，最大限度地使用CPU性能。开启一个goroutine的消耗非常小（大约2KB的内存），你可以轻松创建数百万个`goroutine`。

```
`goroutine`的启动时间比线程快。
`goroutine`原生支持利用channel安全地进行通信。
`goroutine`共享数据结构时无需使用互斥锁。
```

适合：

- 服务端开发
- 分布式系统，微服务
- 网络编程
- 区块链开发
- 内存KV数据库，例如boltDB、levelDB
- 云平台



```go
package main  // 声明 main 包，表明当前是一个可执行程序

import (
    "fmt"  // 导入内置 fmt 
)

func main(){  // main函数，是程序执行的入口
    fmt.Println("Hello World!")  // 在终端打印 Hello World!
}
```

Go优点：

- 自带gc。
- 静态编译，编译好后，扔服务器直接运行。
- 简单的思想，没有继承，多态，类等。
- 语法层支持并发，和拥有同步并发的channel类型，使并发开发变得非常方便。
- 简洁的语法，提高开发效率。
- 超级简单的交叉编译，仅需更改环境变量

```
1.自动立即回收。
    2.更丰富的内置类型。
    3.函数多返回值。
    4.错误处理。
    5.匿名函数和闭包。
    6.类型和接口。
    7.并发编程。
    8.反射。
    9.语言交互性。
```

## 基础语法

可见性：

```
  1）声明在函数内部，是函数的本地值，类似private
    2）声明在函数外部，是对当前包可见(包内所有.go文件都可见)的全局值，类似protect
    3）声明在函数外部且首字母大写是所有包可见的全局值,类似public
```



Go的程序是保存在多个.go文件中，文件的第一行就是package XXX声明，用来说明该文件属于哪个包(package)，package声明下来就是import声明，再下来是类型，变量，常量，函数的声明。

```
 var（声明变量）, const（声明常量）, type（声明类型） ,func（声明函数）。
```



声明变量：

```go
var name string  // 变量名  变量类型
var (
  b int
  c bool
)     // 批量变量声明

// 声明时就初始化
var sex int = 1
var name, sex = "hello", 1

// 如果在函数内部，比如main()，可以简略写
m := 200   // 声明并初始化

x, _ := foo()  // _ 表示“匿名变量”，常被忽略

// 常量在定义的时候必须赋值
const pi = 3.1415
const (
  pi = 3.1415
  e = 2.7182
)
const (  // 省略了值则表示和上面一行的值相同
        n1 = 100
        n2
        n3
    )
```

Go语言在声明变量的时候，会自动对变量对应的内存区域进行初始化操作。每个变量会被初始化成其类型的默认值，例如： 整型和浮点型变量的默认值为0。 字符串变量的默认值为空字符串。 布尔型变量默认为`false`。 切片、函数、指针变量的默认为`nil`。

> 函数外的每个语句都必须以关键字开始（var、const、func等）
>
> `:=` 不能使用在函数外。
>
> `_` 多用于占位，表示忽略值。



### 数组array

**同一种数据类型**的**固定长度**的序列。

```go
var a [len]int   // len数组长度必须是常量; 一旦定义，长度不能变

var arr0 [5]int = [5]int{1, 2, 3}
var arr1 = [5]int{1, 2, 3, 4, 5}
var arr2 = [...]int{1, 2, 3, 4, 5, 6}
var str = [5]string{3: "hello world", 4: "tom"}
// 在函数内部，简写
a := [3]int{1, 2}           // 未初始化元素值为 0。
b := [...]int{1, 2, 3, 4}   // 通过初始化值确定数组长度。
c := [5]int{2: 100, 4: 200} // 使用索引号初始化元素。
d := [...]struct {
    name string
    age  uint8
}{
    {"user1", 10}, // 可省略元素类型。
    {"user2", 20}, // 别忘了最后一行的逗号。
}

// 多维
var arr0 [5][3]int
var arr1 [2][3]int = [...][3]int{{1, 2, 3}, {7, 8, 9}}

a := [2][3]int{{1, 2, 3}, {4, 5, 6}}
b := [...][2]int{{1, 1}, {2, 2}, {3, 3}} // 第 2 纬度不能用 "..."。
```

长度是数组类型的一部分，因此，`var a[5] int` 和 `var a[10]int` 是不同的类型

```GO
// 下标是从0开始，最后一个元素下标是：len-1
for i := 0; i < len(a); i++ {
}
for index, v := range a {
}

// 指针数组 
[n]*T
//数组指针 
*[n]T
```

访问越界，如果下标在数组合法范围之外，则触发访问越界，会panic

数组是值类型，赋值和传参会**复制整个数组**，而不是指针。因此改变副本的值，不会改变本身的值

注意：值拷贝行为会造成性能问题，通常会建议使用 slice，或数组指针。

```go
func test(x [2]int) {
    fmt.Printf("x: %p\n", &x)
    x[1] = 1000
}
```

```go
func printArr(arr *[5]int) {
    arr[0] = 10
    for i, v := range arr {
        fmt.Println(i, v)
    }
}

func main() {
    var arr1 [5]int
    printArr(&arr1)  // 传地址 (指针)
    fmt.Println(arr1)
    arr2 := [...]int{2, 4, 6, 8, 10}
    printArr(&arr2)
    fmt.Println(arr2)
}
```



### 切片slice

slice 并不是数组或数组指针。它通过内部指针和相关属性引用数组片段，以实现变长方案。

切片是数组的一个引用，因此切片是引用类型。但自身是结构体，值拷贝传递。

切片的长度可以改变，因此，切片是一个可变的数组。

切片遍历方式和数组一样，可以用 `len()` 求长度。表示可用元素数量，读写操作不能超过该限制。 

cap可以求出slice最大扩张容量，不能超出数组限制。`0 <= len(slice) <= len(array)`，其中array是slice引用的数组。
```go
var str []string 

func main() {
   //1.声明切片
   var s1 []int
   if s1 == nil {
      fmt.Println("是空")
   } 
   // 2.:=
   s2 := []int{}
   // 3.make()
   var s3 []int = make([]int, 0)  
   fmt.Println(s1, s2, s3)
   // 4.初始化赋值
   var s4 []int = make([]int, 0, 0)
   fmt.Println(s4)
   s5 := []int{1, 2, 3}
   fmt.Println(s5)
   // 5.从数组切片
   arr := [5]int{1, 2, 3, 4, 5}
   var s6 []int
   s6 = arr[1:4]  //  前包后不包 [ , )
   fmt.Println(s6)
}

// 多维
data := [][]int{
        []int{1, 2, 3},
        []int{100, 200},
        []int{11, 22, 33, 44},
    }
```

```go
var arr = [...]int{0, 1, 2, 3, 4, 5, 6, 7, 8, 9}
var slice0 []int = arr[start:end]  // start ~ end (不包含 arr[end])
var slice1 []int = arr[:end]       // 0 ~ end  
var slice2 []int = arr[start:]     // start ~ len-1
var slice3 []int = arr[:]  // 0 ~ len-1
var slice4 = arr[:len(arr)-1]      //去掉切片的最后一个元素
// 局部：
arr2 := [...]int{9, 8, 7, 6, 5, 4, 3, 2, 1, 0}
slice5 := arr[start:end]
slice6 := arr[:end]        
slice7 := arr[start:]     
slice8 := arr[:]  
slice9 := arr[:len(arr)-1] //去掉切片的最后一个元素
```

使用 make 动态创建slice，避免了数组必须用常量做长度的麻烦。还可用指针直接访问底层数组，退化成普通数组操作。

```GO
var slice0 []int = make([]int, 10)  // [0 0 0 0 0 0 0 0 0 0]
var slice1 = make([]int, 10)        // [0 0 0 0 0 0 0 0 0 0]
var slice2 = make([]int, 10, 10)    // [0 0 0 0 0 0 0 0 0 0]
slice3 := make([]int, 10)
slice4 := make([]int, 10)     // 省略cap，则 len=cap
slice5 := make([]int, 10, 10) // len-长度, cap-容量
```

如果超出原 slice.cap 限制，就会重新分配底层数组，即便原数组并未填满。重新分配了底层数组，并复制数据。（使用时仍然用原变量名）通常以 2 倍容量重新分配底层数组。在大批量添加数据时，建议一次性分配足够大的空间，以减少内存分配和数据复制开销。或初始化足够长的 len 属性，改用索引号进行操作。及时释放不再使用的 slice 对象，避免持有过期数组，造成 GC 无法回收。

```go
data := [...]int{0, 1, 2, 3, 4, 5, 6, 7, 8, 9}
s1 := data[8:]
s2 := data[:5]
copy(s2, s1)
```

copy ：函数 copy 在两个 slice 间复制数据，复制长度以 len 小的为准。两个 slice 可指向同一底层数组，允许元素区间重叠。

应及时将所需数据 copy 到较小的 slice，以便释放超大号底层数组内存

```go
// 遍历
 data := [...]int{0, 1, 2, 3, 4, 5, 6, 7, 8, 9}
slice := data[:]
for index, value := range slice {
    fmt.Printf("inde : %v , value : %v\n", index, value)
}
```

string底层就是一个byte的数组，因此，也可以进行切片操作。

```go
str := "hello world"
s1 := str[0:5]
// string本身是不可变的
str := "Hello world"
s := []byte(str)   //中文字符需要用[]rune(str)
s[6] = 'G'
s = s[:8]
s = append(s, '!')
str = string(s)  // Hello Go!
```

 `data[6:8]`，从第6位到第8位（返回6， 7），长度len为2， 最大可扩充长度cap为4（6-9）

另一种写法：` data[:6:8] `每个数字前都有个冒号， slice内容为data从0到第6位，长度len为6，最大扩充项cap设置为8

`a[x:y:z]`： 切片内容 [x:y] 切片长度: y-x 切片容量:z-x



### Go指针, make

Go语言中的指针不能进行偏移和运算，是安全指针。

Go语言中的函数传参都是值拷贝，当我们想要修改某个变量的时候，我们可以创建一个指向该变量地址的指针变量。传递数据使用指针，而无须拷贝数据。类型指针不能进行偏移和运算。

Go的指针操作只需要记住两个符号：`&`（取地址）和`*`（根据地址取值）。

```go
ptr := &v  // 取地址
```

每个变量在运行时都拥有一个地址，这个地址代表变量在内存中的位置。

对指针使用`*`操作，也就是指针取值

```go
 a := 10
b := &a // 取变量a的地址，将指针保存到b中
c := *b // 指针取值（根据指针去内存取值）
```

```go
func modify2(x *int) {
    *x = 100
}
modify2(&a)
```

空指针：当一个指针被定义后没有分配到任何变量时，它的值为 `nil`

```go
var p *string
if p != nil {
    fmt.Println("非空")
} else {
    fmt.Println("空值")
}
```

Go语言对于**引用类型的变量**，在使用的时候**不仅要声明，还要为它分配内存空间**，否则我们的值就没办法存储。

而对于值类型的声明不需要分配内存空间，是因为它们在声明的时候已经默认分配好了内存空间。

`new`和`make`是内建的两个函数，主要用来分配内存.

new函数不太常用，使用new函数得到的是一个类型的指针，并且该指针对应的值为该类型的零值。

```go
a := new(int)
b := new(bool)
fmt.Printf("%T\n", a) // *int
fmt.Printf("%T\n", b) // *bool
fmt.Println(*a)       // 0
fmt.Println(*b)       // false

var a *int  // 只声明，没初始化，无法赋值
a = new(int) // 使用new初始化
*a = 10
fmt.Println(*a)
```

`make`也是用于内存分配的，区别于new，它**只用于slice、map以及chan的内存创建**，而且它返回的类型就是这三个类型本身，而不是他们的指针类型，因为这三种类型就是引用类型。

最常用：在使用slice、map以及channel的时候，都需要使用make进行初始化，然后才可以对它们进行操作。

```go
var b map[string]int
b = make(map[string]int, 10)
```



### Map

map是一种**无序**的**基于key-value**的数据结构，Go语言中的map是引用类型，必须初始化才能使用。

map类型的变量默认初始值为nil，需要使用make()函数来分配内存

```go
map[KeyType]ValueType
make(map[KeyType]ValueType, [cap])  
// cap表示map的容量，不是必须，但是我们应在初始化map的时候就为其指定一个合适的容量
```

```go
scoreMap := make(map[string]int, 8)
scoreMap["张三"] = 90
scoreMap["小明"] = 100
fmt.Println(scoreMap)
fmt.Println(scoreMap["小明"])

// 声明时就赋值
userInfo := map[string]string{
    "username": "pprof.cn",
    "password": "123456",
}
fmt.Println(userInfo) //
```

判断某个键key是否存在：

```go
value, ok := map[key] // 如果key存在ok为true,v为对应的值
// 不存在 ok 为 false, v 为值类型的零值
scoreMap := make(map[string]int)
scoreMap["张三"] = 90
v, ok := scoreMap["张三"]
if ok {
    fmt.Println(v)
}
```

使用for range遍历map

```go
scoreMap := make(map[string]int)
scoreMap["张三"] = 90
scoreMap["小明"] = 100
for k, v := range scoreMap {
    fmt.Println(k, v)
}

// 只想遍历key
for k := range scoreMap {
    fmt.Println(k)
}
```

注意： 遍历map时的元素顺序与添加键值对的顺序无关。 （本身是无序的）

可以在遍历前先对key排序 `sort.Strings(keys)` ，之后再遍历。

使用delete()内建函数从map中删除一组键值对：

```go
delete(map, key)

scoreMap := make(map[string]int)
scoreMap["小明"] = 100
delete(scoreMap, "小明")
```



```go
// 切片中的元素为map类型
var mapSlice = make([]map[string]string, 3)
mapSlice[0] = make(map[string]string, 10)
mapSlice[0]["name"] = "王五"
mapSlice[0]["password"] = "123456"
// map中值为切片类型
var sliceMap = make(map[string][]string, 3)
key := "中国"
value, ok := sliceMap[key]
if !ok {
    value = make([]string, 0, 2)
}
value = append(value, "北京", "上海")
sliceMap[key] = value
```

### 结构体struct

Go语言中**没有“类”的概念**，也不支持“类”的继承等面向对象的概念。Go语言中**通过结构体的内嵌再配合接口**比面向对象具有更高的扩展性和灵活性。

Go语言中可以使用type关键字来定义自定义类型：可以基于内置的基本类型定义，也可以通过struct定义

```go
//将MyInt定义为int类型
type MyInt int
```

类型别名规定：TypeAlias只是Type的别名，本质上TypeAlias与Type是同一个类型。

```go
type TypeAlias = Type
type byte = uint8
type rune = int32
```

```go
//类型定义
type NewInt int

//类型别名
type MyInt = int

func main() {
    var a NewInt
    var b MyInt
    fmt.Printf("type of a:%T\n", a) //type of a:main.NewInt
    fmt.Printf("type of b:%T\n", b) //type of b:int
}
```

Go语言提供了结构体，英文名称struct，可以封装多个基本数据类型。

结构体中**字段大写开头表示可公开访问**，**小写表示私有**（仅在定义当前结构体的包中可访问）。

Go语言中**通过struct来实现面向对象**。

```go
type 类型名 struct {
    字段名 字段类型
    字段名 字段类型
    …
}
```

- 类型名：标识自定义结构体的名称，在**同一个包内不能重复**。
- 字段名：表示结构体字段名。结构体中的字段名必须唯一。
- 字段类型：表示结构体字段的具体类型。

```go
type person struct {
    name string
    city string
    age  int8
}
// or
type person1 struct {
    name, city string
    age        int8
}
```

语言内置的基础数据类型是用来描述一个值的，而结构体是用来描述一组值的。

只有**当结构体实例化时，才会真正地分配**内存。也就是**必须实例化后才能使用结构体的字段**。

结构体本身也是一种类型，我们可以像声明内置类型一样使用var关键字**声明结构体类型**。

```go
type person struct {
    name string
    city string
    age  int8
}

func main() {
    var p1 person  // 
    p1.name = "pprof.cn"
    p1.city = "北京"
    p1.age = 18
    fmt.Printf("p1=%s\n", p1.name)  //
}
```

定义一些临时数据结构等场景下还可以使用匿名结构体。

```go
var user struct{Name string; Age int}
user.Name = "pprof.cn"
user.Age = 18
```

可以通过使用new关键字对结构体进行实例化，得到的是结构体的地址。

> 在Go语言中支持对结构体指针直接使用 `.` 来访问结构体的成员

```go
var p2 = new(person)
p2.name = "测试"
p2.age = 18
```

使用&对结构体进行取地址操作相当于对该结构体类型进行了一次new实例化操作。

```go
p3 := &person{}
fmt.Printf("%T\n", p3)     //*main.person
fmt.Printf("p3=%#v\n", p3) //p3=&main.person{name:"", city:"", age:0}
p3.name = "博客"  // 语法糖：(*p3).name = "博客"
```

使用键值对对结构体进行初始化时，键对应结构体的字段，值对应该字段的初始值。

```go
p5 := person{
    name: "pprof.cn",
    city: "北京",
    age:  18,
}
```

当某些字段没有初始值的时候，该字段可以不写。此时，没有指定初始值的字段的值就是该字段类型的零值。

初始化结构体的时候可以简写，也就是初始化的时候不写键，直接写值：

```go
p8 := &person{
    "pprof.cn",
    "北京",
    18,
}
```

但注意

- 必须初始化结构体的所有字段。
- 初始值的填充顺序必须与字段在结构体中的声明顺序一致。
- 该方式不能和键值初始化方式混用



Go语言的结构体没有构造函数，可以自己实现。

```go
func newPerson(name, city string, age int8) *person {
    return &person{
        name: name,
        city: city,
        age:  age,
    }
}
// p9 := newPerson("pprof.cn", "测试", 90)
```



Go语言中的方法（Method）是一种**作用于特定类型变量**的函数。这种特定类型变量叫做接收者（Receiver）。接收者的概念就类似于其他语言中的this或者 self。

方法与函数的区别是，函数不属于任何类型，方法属于特定的类型。

```go
func (接收者变量 接收者类型) 方法名(参数列表) (返回参数) {
    函数体
}
```

- 接收者变量：接收者中的参数变量名在命名时，官方建议使用接收者类型名的第一个小写字母，而不是self、this之类的命名。例如，Person类型的接收者变量应该命名为 p。
- 接收者类型：接收者类型和参数类似，可以是指针类型和非指针类型。

```go
//Person 结构体
type Person struct {
    name string
    age  int8
}
//NewPerson 构造函数
func NewPerson(name string, age int8) *Person {
    return &Person{
        name: name,
        age:  age,
    }
}

//Dream-Person做梦的method
func (p Person) Dream() {
    fmt.Printf("%s的梦想！\n", p.name)
}

func main() {
    p1 := NewPerson("测试", 25)
    p1.Dream()
}
```

**指针类型的接收者由一个结构体的指针**组成，由于指针的特性，**调用方法时修改接收者指针的任意成员变量**，在方法结束后，修改**都是有效**的。这种方式就十分接近于其他语言中面向对象中的this或者self。

```go
// SetAge 设置p的年龄
// 使用指针接收者
func (p *Person) SetAge(newAge int8) {
    p.age = newAge
}

func main() {
    p1 := NewPerson("测试", 25)
    fmt.Println(p1.age) // 25
    p1.SetAge(30)
    fmt.Println(p1.age) // 30
}
```

- 需要修改接收者中的值
- 接收者是拷贝代价比较大的大对象
- 保证一致性，如果有某个方法使用了指针接收者，那么其他的方法也应该使用指针接收者。

当**方法作用于值类型接收者**时，Go语言会在代码运行时将接收者的值复制一份。在值类型接收者的方法中可以获取接收者的成员值，但**修改操作只是针对副本**，**无法修改接收者变量本身**。

```go
func (p Person) SetAge2(newAge int8) {
    p.age = newAge
}

func main() {
    p1 := NewPerson("测试", 25)
    p1.Dream()
    fmt.Println(p1.age) // 25
    p1.SetAge2(30) // (*p1).SetAge2(30)
    fmt.Println(p1.age) // 25
}
```

Go语言中，接收者的类型可以是任何类型，不仅仅是结构体，**任何类型都可以拥有方法**。

```go
//MyInt 将int定义为自定义MyInt类型
type MyInt int

//SayHello 为MyInt添加一个SayHello的方法
func (m MyInt) SayHello() {
    fmt.Println("Hello, 我是一个int。")
}
func main() {
    var m1 MyInt
    m1.SayHello() //Hello, 我是一个int。
    m1 = 100
    fmt.Printf("%#v  %T\n", m1, m1) //100  main.MyInt
}
```

注意： 非本地类型不能定义方法，也就是说我们**不能给别的包的类型定义方法**。



结构体允许其成员字段在声明时没有字段名而只有类型，这种没有名字的字段就称为匿名字段。

```go
type Person struct {
    string
    int
}

p1 := Person{
    "pprof.cn",
    18,
}
```

匿名字段默认采用类型名作为字段名，结构体要求字段名称必须唯一，因此一个结构体中同种类型的匿名字段只能有一个。



一个结构体中可以嵌套包含另一个结构体或结构体指针。

```go
//Address 地址结构体
type Address struct {
    Province string
    City     string
}
//User 用户结构体
type User struct {
    Name    string
    Gender  string
    Address Address  // 使用结构体
}

func main() {
    user1 := User{
        Name:   "pprof",
        Gender: "女",
        Address: Address{
            Province: "黑龙江",
            City:     "哈尔滨",
        },
    }
}

// 匿名结构体
//Address 地址结构体
type Address struct {
    Province string
    City     string
}

//User 用户结构体
type User struct {
    Name    string
    Gender  string
    Address //匿名结构体 
}

func main() {
    var user2 User
    user2.Name = "pprof"
    user2.Gender = "女"
    user2.Address.Province = "黑龙江"    //通过匿名结构体.字段名访问
    user2.City = "哈尔滨"                //直接访问匿名结构体的字段名
}
```

当访问结构体成员时会先在结构体中查找该字段，找不到再去匿名结构体中查找。

注意：嵌套结构体内部可能存在相同的字段名。这个时候为了避免歧义需要指定具体的内嵌结构体的字段。

```go
//Address 地址结构体
type Address struct {
    Province   string
    City       string
    CreateTime string  //
}

//Email 邮箱结构体
type Email struct {
    Account    string
    CreateTime string  //
}

//User 用户结构体
type User struct {
    Name   string
    Gender string
    Address
    Email
}

func main() {
    var user3 User
    user3.Name = "pprof"
    user3.Gender = "女"
    // user3.CreateTime = "2019" //ambiguous selector user3.CreateTime
    user3.Address.CreateTime = "2000" //指定Address结构体中的CreateTime
    user3.Email.CreateTime = "2000"   //指定Email结构体中的CreateTime
}
```

Go语言中**使用结构体**也可以实现其他编程语言中**面向对象的继承**。

```go
//Animal 动物
type Animal struct {
    name string
}

func (a *Animal) move() {
    fmt.Printf("%s会动！\n", a.name)
}

//Dog 狗
type Dog struct {
    Feet    int8
    *Animal //通过嵌套匿名结构体实现继承
}

func (d *Dog) woof() {
    fmt.Printf("%s会汪汪汪~\n", d.name)
}

func main() {
    d1 := &Dog{
        Feet: 4,
        Animal: &Animal{ //注意嵌套的是结构体指针
            name: "乐乐",
        },
    }
    d1.woof() //乐乐会汪汪汪~
    d1.move() //乐乐会动！
}
```



Tag是**结构体的元信息**，可以在运行的时候**通过反射的机制读取**出来。

Tag在结构体字段的后方定义，由一对反引号包裹起来

```go
`key1:"value1" key2:"value2"`
```

结构体 Tag 由一个或多个键值对组成。键与值使用冒号分隔，值用双引号括起来。键值对之间使用一个空格分隔。 

注意：为结构体编写Tag时，必须严格遵守键值对的规则。结构体标签的解析代码的容错能力很差，一旦格式写错，编译和运行时都不会提示任何错误，通过反射也无法正确取值。例如**不要在key和value之间添加空格**。

```go
// 为Student结构体的每个字段定义json序列化时使用的Tag
type Student struct {
    ID     int    `json:"id"` //通过指定tag实现json序列化该字段时的key
    Gender string //json序列化是默认使用字段名作为key
    name   string //私有不能被json包访问
}
```



### json序列化

JSON(JavaScript Object Notation) 是一种轻量级的数据交换格式。易于人阅读和编写。同时也易于机器解析和生成。JSON键值对是用来保存JS对象的一种方式，键/值对组合中的键名写在前面并用双引号""包裹，使用冒号:分隔，然后紧接着值；多个键值之间使用英文,分隔。

```go
//Student 学生
type Student struct {
    ID     int
    Gender string
    Name   string
}
//Class 班级
type Class struct {
    Title    string
    Students []*Student
}

c := &Class{
    Title:    "101",
    Students: make([]*Student, 0, 200),
}
for i := 0; i < 4; i++ {
    stu := &Student{
        Name:   fmt.Sprintf("stu%02d", i),
        Gender: "男",
        ID:     i,
    }
    c.Students = append(c.Students, stu)
}

//JSON序列化：结构体-->JSON格式的字符串
data, err := json.Marshal(c)
//JSON反序列化：JSON格式的字符串-->结构体
str := `{"Title":"101","Students":[{"ID":0,"Gender":"男","Name":"stu00"},{"ID":1,"Gender":"男","Name":"stu01"},{"ID":2,"Gender":"男","Name":"stu02"},{"ID":3,"Gender":"男","Name":"stu03"}]}`
c1 := &Class{}
err = json.Unmarshal([]byte(str), c1)
```



### if,switch

```go
if 布尔表达式 {
    /* 在布尔表达式为 true 时执行 */
}

if n := "abc"; x > 0 {   // 初始化语句未必就是定义变量， 如 println("init") 也是可以的。
    println(n[2])
} else if x < 0 {    // 注意 else if 和 else 左大括号位置。
    println(n[1])
} else {
    println(n[0])
}
```

- 可省略条件表达式括号。
- 初始化语句，可定义代码块局部变量。 
- 代码块左 括号必须在条件表达式尾部
- 不支持三元操作符(三目运算符) `a > b ? a : b`

switch 语句用于基于不同条件执行不同动作，**每一个 case 分支都是唯一的，从上直下逐一测试**，直到匹配为止。 Golang switch 分支表达式可以是任意类型，不限于常量。**可省略 break，默认自动终止**。

```GO
var marks int = 90

switch marks {
    case 90: grade = "A"
    case 80: grade = "B"
    case 50,60,70 : 
    	grade = "C"
    default: grade = "D"  
}
```

变量 var1 可以是任何类型，而 val1 和 val2 则可以是同类型的任意值。类型不被局限于常量或整数，但必须是相同的类型；或者最终结果为相同类型的表达式。

switch 语句还可以被用于 type-switch 来判断某个 interface 变量中实际存储的变量类型。

```go
switch x.(type){
    case type:
       statement(s)      
    case type:
       statement(s)
    /* 你可以定义任意个数的case */
    default: /* 可选 */
       statement(s)
}

func main() {
    var x interface{}
    //写法一：
    switch i := x.(type) { // 带初始化语句
    case nil:
        fmt.Printf(" x 的类型 :%T\r\n", i)
    case int:
        fmt.Printf("x 是 int 型")
    case func(int) float64:
        fmt.Printf("x 是 func(int) 型")
    case bool, string:
        fmt.Printf("x 是 bool 或 string 型")
    default:
        fmt.Printf("未知型")
    }
    //写法二
    var j = 0
    switch j {
    case 0:
    case 1:
        fmt.Println("1")
    case 2:
        fmt.Println("2")
    default:
        fmt.Println("def")
    }
    //写法三
    var k = 0
    switch k {
    case 0:
        println("fallthrough")
        fallthrough
        /*
            Go的switch非常灵活，表达式不必是常量或整数，执行的过程从上至下，直到找到匹配项；
            如果switch没有表达式，它会匹配true。
            Go里面switch默认相当于每个case最后带有break，
            匹配成功后不会自动向下执行其他case，而是跳出整个switch,
            但是可以使用fallthrough强制执行后面的case代码。
        */
    case 1:
        fmt.Println("1")
    case 2:
        fmt.Println("2")
    default:
        fmt.Println("def")
    }
    //写法四
    var n = 0
    switch { //省略条件表达式，可当 if...else if...else
    case n > 0 && n < 10:
        fmt.Println("i > 0 and i < 10")
    case n > 10 && n < 20:
        fmt.Println("i > 10 and i < 20")
    default:
        fmt.Println("def")
    }
}
```

### select

select 语句类似于 switch 语句，但是select**会随机执行一个可运行的case**。如果**没有case可运行，它将阻塞**，直到有case可运行。

select 是Go中的一个控制结构，类似于用于通信的switch语句。**每个case必须是一个通信操作**，**要么是发送要么是接收**。

一个默认的子句应该总是可运行的。

```go
select {
    case communication clause  :
       statement(s);      
    case communication clause  :
       statement(s);
    /* 你可以定义任意数量的 case */
    default : /* 可选 */
       statement(s);
}
```

- 每个case都必须是一个通信  (每个case语句里必须是一个IO操作)
- 所有channel表达式都会被求值
- 所有被发送的表达式都会被求值
- 如果任意某个通信可以进行，它就执行；其他被忽略。
- 如果有多个case都可以运行，Select会随机公平地选出一个执行。其他不会执行。
- 否则：
- ​    如果有default子句，则执行该语句。
- ​    如果没有default字句，select将阻塞，直到某个通信可以运行；Go不会重新对channel或值进行求值。

```go
var c1, c2, c3 chan int
var i1, i2 int
select {
    case i1 = <-c1:
    fmt.Printf("received ", i1, " from c1\n")
    case c2 <- i2:
    fmt.Printf("sent ", i2, " to c2\n")
    case i3, ok := (<-c3):  // same as: i3, ok := <-c3
    if ok {
        fmt.Printf("received ", i3, " from c3\n")
    } else {
        fmt.Printf("c3 is closed\n")
    }
    default:
    fmt.Printf("no communication\n")
}  
```

select可以监听channel的数据流动.

在一个select语句中，Go会按顺序从头到尾评估每一个发送和接收的语句。

```go
select { //不停的在这里检测
    case <-chanl : //检测有没有数据可以读
    //如果chanl成功读取到数据，则进行该case处理语句
    case chan2 <- 1 : //检测有没有可以写
    //如果成功向chan2写入数据，则进行该case处理语句


    //假如没有default，那么在以上两个条件都不成立的情况下，就会在此阻塞
    //一般default不写在里面，select中的default子句总是可运行的，因为会很消耗CPU资源
    default:
    //如果以上都没有符合条件，那么则进行default处理流程
}
```

select是Go中的一个控制结构，类似于switch语句，用于处理异步IO操作。select会监听case语句中channel的读写操作，当case中channel读写操作为非阻塞状态（即能读写）时，将会触发相应的动作。 select中的case语句必须是一个channel操作

select中的default子句总是可运行的。

如果有多个case都可以运行，select会随机公平地选出一个执行，其他不会执行。

如果没有可运行的case语句，且有default语句，那么就会执行default的动作。

如果没有可运行的case语句，且没有default语句，select将阻塞，直到某个case通信可以运行

[典型用法]

```go
// 1.超时判断
// 使用全局resChan来接受response，如果时间超过3S,resChan中还没有数据返回，则第二条case将执行
var resChan = make(chan int)
// do request
func test() {
    select {
    case data := <-resChan:
        doData(data)
    case <-time.After(time.Second * 3):
        fmt.Println("request time out")
    }
}

func doData(data int) {
    //...
}

// 2. 退出
//主线程（协程）中如下：
var shouldQuit=make(chan struct{})
fun main(){
    {
        //loop
    }
    //...out of the loop
    select {
        case <-c.shouldQuit:
            cleanUp()
            return
        default:
        }
    //...
}

//再另外一个协程中，如果运行遇到非法操作或不可处理的错误，就向shouldQuit发送数据通知程序停止运行
close(shouldQuit)

// 3.判断channel阻塞
//在某些情况下是存在不希望channel缓存满了的需求的，可以用如下方法判断
ch := make (chan int, 5)
//...
data：=0
select {
case ch <- data:
default:
    //做相应操作，比如丢弃data。视需求而定
}
```

### for, range

for支持三种循环方式，包括类似 while 的语法。

```go
for init; condition; post { }
for condition { }
for { }
```

- init： 一般为赋值表达式，给控制变量赋初值；
- condition： 关系表达式或逻辑表达式，循环控制条件；
- post： 一般为赋值表达式，给控制变量增量或减量。

​    for语句执行过程如下：
​    ①先对表达式 init 赋初值；
​    ②判别赋值表达式 init 是否满足给定 condition 条件，若其值为真，满足循环条件，则执行循环体内语句，然后执行 post，进入第二次循环，再判别 condition；否则判断 condition 的值为假，不满足条件，就终止for循环，执行循环体外语句。

```go
s := "abc"

for i, n := 0, len(s); i < n; i++ { // 常见的 for 循环，支持初始化语句。
    println(s[i])
}

n := len(s)
for n > 0 {                // 替代 while (n > 0) {}
    println(s[n])        // 替代 for (; n > 0;) {}
    n-- 
}

for {                    // 替代 while (true) {}
    println(s)            // 替代 for (;;) {}
}
```

for 循环中嵌套一个或多个 for 循环:

```go
for [condition |  ( init; condition; increment ) | Range]
{
   for [condition |  ( init; condition; increment ) | Range]
   {
      statement(s)
   }
   statement(s)
}
```

如过循环中条件语句永远不为 false 则会进行无限循环

```go
for true  {
    fmt.Printf("这是无限循环。\n");
}
```



## 函数

-   • 无需声明原型。
- ​    • 支持不定 变参。
- ​    • 支持多返回值。
- ​    • 支持命名返回参数。 
- ​    • 支持匿名函数和闭包。
- ​    • 函数也是一种类型，一个函数可以赋值给变量。

- 不支持 嵌套 (nested) 一个包不能有两个名字一样的函数。
- • 不支持 重载 (overload) 
- • 不支持 默认参数 (default parameter)。

函数声明包含一个函数名，参数列表， 返回值列表和函数体。如果函数没有返回值，则返回列表可以省略。函数从第一条语句开始执行，直到执行return语句或者执行函数的最后一条语句。

注意：类型在变量名之后 

当两个或多个连续的函数命名参数是同一类型，则除了最后一个类型之外，其他都可以省略。

函数可以返回任意数量的返回值。有返回值的函数，必须有明确的终止语句，否则会引发编译错误。

使用关键字 func 定义函数，左大括号依旧不能另起一行。

```go
func test(x, y int, s string) (int, string) {
    // 类型相同的相邻参数，参数类型可合并。 多返回值必须用括号。
    n := x + y          
    return n, fmt.Sprintf(s, n)
}
```

函数是第一类对象，可作为参数传递。建议将复杂签名定义为函数类型，以便于阅读：

```go
func test(fn func() int) int {
    return fn()
}
// 定义函数类型。
type FormatFunc func(s string, x, y int) string 

func format(fn FormatFunc, s string, x, y int) string {
    return fn(s, x, y)
}

func main() {
    s1 := test(func() int { return 100 }) // 直接将匿名函数当参数。

    s2 := format(func(s string, x, y int) string {
        return fmt.Sprintf(s, x, y)
    }, "%d, %d", 10, 20)

    println(s1, s2)
}
```



> 偶尔遇到没有函数体的函数声明，这表示该函数不是以Go实现的。这样的声明定义了函数标识符。
>
> ```go
> func Sin(x float64) float //implemented in assembly language
> ```



### 延迟调用 defer

- 关键字 defer 用于注册延迟调用。
-    这些调用直到 return 前才被执行。因此，可以用来做资源清理。
- ​    多个defer语句，按先进后出的方式执行。
- ​    defer语句中的变量，在defer声明时就决定了。

defer用途：

1. 关闭文件句柄
2. 锁资源释放
3. 数据库连接释放

go 语言的defer功能强大，对于资源管理非常方便，defer 是先进后出。后面的语句会依赖前面的资源，因此如果先前面的资源先释放了，后面的语句就没法执行了。

```go
func main() {
    var whatever [5]struct{}

    for i := range whatever {
        defer fmt.Println(i)  // 4 3 2 1 0
    }
}
// 闭包
func main() {
    var whatever [5]struct{}
    for i := range whatever {
        defer func() { 
            fmt.Println(i)   // 4 4 4 4 4
        }()   
    }
    // Each time a "defer" statement executes, the function value and parameters to the call are evaluated as usualand saved anew but the actual function is not invoked.
    // 函数正常执行,由于闭包用到的变量 i 在执行的时候已经变成4,所以输出全都是4.
}
```

defer f.Close

```go
type Test struct {
    name string
}

func (t *Test) Close() {
    fmt.Println(t.name, " closed")
}
func Close(t Test) {
    t.Close()
}
func main() {
    ts := []Test{{"a"}, {"b"}, {"c"}}
    for _, t := range ts {
        defer Close(t)
    }
}
```

defer后面的语句在执行的时候，函数调用的参数会被保存起来，但是不执行。也就是复制了一份。但是并没有说struct这里的this指针如何处理。

多个 defer 注册，按 FILO 次序执行 ( 先进后出 )。哪怕函数或某个延迟调用发生错误，这些调用依旧会被执行。

延迟调用参数在注册时求值或复制，可用指针或闭包 "延迟" 读取。

注意：滥用 defer 可能会导致性能问题，尤其是在一个 "大循环" 里。



### 异常处理

Golang 没有结构化异常，抛出一个panic的异常，然后在defer中通过recover捕获这个异常，然后正常处理。

`panic`

- 内置函数
- 假如函数F中书写了panic语句，会终止其后要执行的代码，在panic所在函数F内如果存在要执行的defer函数列表，按照defer的逆序执行
- 返回函数F的调用者G，在G中，调用函数F语句之后的代码不会执行，假如函数G中存在要执行的defer函数列表，按照defer的逆序执行
- 直到goroutine整个退出，并报告错误

`recover`

- 内置函数
-  用来控制一个goroutine的panicking行为，捕获panic，从而影响应用的行为
- 一般的调用建议：
- a). 在defer函数中，通过recever来终止一个goroutine的panicking过程，从而恢复正常代码的执行
- b). 可以获取通过panic传递的error



## 接口

接口（interface）定义了一个对象的行为规范，只定义规范不实现，由具体的对象来实现规范的细节。

interface是一组method的集合，是duck-type programming的一种体现。接口做的事情就像是定义一个协议（规则）。不关心属性（数据），只关心行为（方法）。

注意：Go语言中接口（interface）是一种类型，一种抽象的类型。

Go语言提倡**面向接口编程**

接口是一个或多个方法签名的集合。**任何类型的方法**集中**只要拥有该接口'对应的全部方法'签名**，就表示它 "实现" 了该接口，**无须**在该类型上**显式声明实现了哪个接口**。称为Structural Typing。

接口只有方法声明，没有实现，没有数据字段。接口可以匿名嵌入其他接口，或嵌入到结构中。

对象赋值给接口时，会发生拷贝，而接口内部存储的是指向这个复制品的指针，既无法修改复制品的状态，也无法获取指针。只有当接口存储的类型和对象都为nil时，接口才等于nil。

接口调用不会做receiver的自动转换。接口同样支持匿名字段方法。接口也可实现类似OOP中的多态。

 空接口可以作为任何类型数据的容器。一个类型可实现多个接口。

接口命名习惯以 er 结尾。

```go
type 接口类型名 interface{
    方法名1( 参数列表1 ) 返回值列表1
    方法名2( 参数列表2 ) 返回值列表2
    …
}

type writer interface{
    Write([]byte) error
}
```

- 接口名：使用type将接口定义为自定义的类型名。Go语言的接口在命名时，一般会在单词后面添加er，如有写操作的接口叫Writer，有字符串功能的接口叫Stringer等。接口名最好要能突出该接口的类型含义。
- 方法名：当 方法名 首字母是大写 且 这个 接口类型名 首字母也是大写时，这个方法可以被接口所在的包（package）之外的代码访问。
- 参数列表、返回值列表：参数列表和返回值列表中的参数变量名可以省略



一个对象只要**全部实现了接口中的方法**，那么就实现了这个接口。换句话说，接口就是一个需要实现的方法列表。

```go
type Sayer interface {
    say()
}
type dog struct {}

// dog实现了Sayer接口
func (d dog) say() {
    fmt.Println("汪汪汪")
}
```

