---
title: 408计组——5.中央处理器
slug: 408-plan-5-central-processor-zvbu26
url: /post/408-plan-5-central-processor-zvbu26.html
date: '2024-09-12 13:12:46+08:00'
lastmod: '2024-09-16 21:39:48+08:00'
toc: true
tags:
  - '408'
  - 计算机组成原理
categories:
  - 提桶跑路笔记
keywords: 408,计算机组成原理
isCJKLanguage: true
---





## CPU的功能和基本结构

### CPU的功能

1. **指令控制**

    完成取指令、分析指令和执行指令的操作，即程序的顺序控制
2. **操作控制**

    一条指令的功能往往是由若干操作信号的组合来实现的。CPU管理并产生由内存取出的每条指令的操作信号，把各种操作信号送往相应的部件，从而控制这些部件按指令的要求进行动作
3. **时间控制**

    对各种操作加以时间上的控制。时间控制要为每条指令按时间顺序提供应有的控制信号
4. **数据加工**

    对数据进行算术和逻辑运算
5. **中断处理** 

    对计算机运行过程中出现的异常情况和特殊请求进行处理

### CPU的组成

CPU \= 运算器 + 控制器

#### 运算器

对数据进行加工处理

1. **算术逻辑单元ALU**
2. **程序状态字寄存器PSW**

    **状态标志**、**控制标志**

    溢出标志OF，符号标志SF，零标志ZF，进位标志CF

    中断标志，陷阱标志
3. **累加寄存器ACC**

    暂放ALU运算的结果信息
4. **通用寄存器组GPRS**
5. **暂存寄存器**
6. **移位器SR**
7. **计数器**

    控制乘除运算的操作步数

#### 控制器

从主存中取出指令，分析指令并产⽣有关的操作控制信号

1. **程序计数器PC**

    用于指出下一条指令在主存中的存放地址

    PC有自增功能，在intelx86架构中也称为IP
2. **指令寄存器IR**

    用于保存当前<u>正在执行</u>的那条指令
3. **指令译码器ID**

    仅对操作码字段进行译码，向控制器提供特定的操作信号
4. **微操作信号发生器**

    根据IR的内容（指令）、PSW的内容（状态信息）及时序信号，产生控制整个计算机系统所需的各种控制信号

    下图中如ACC<sup>in</sup>即为控制信号，MDR<sub>out</sub>​<sup>E</sup>为控制输出到CPU外部的控制信号

    其结构有<u>组合逻辑型</u>和<u>存储逻辑型</u>两种
5. **时序系统**

    用于产生各种时序信号，它们都是由统一时钟（CLOCK)分频得到
6. **存储器地址寄存器MAR**

    用于存放所要访问的主存单元的地址
7. **存储器数据寄存器MDR**

    用于存放向主存写入的信息或从主存中读出的信息

​![image](https://image-host-pkj.oss-cn-guangzhou.aliyuncs.com/202409121514824.png)​

**其中用户可见寄存器为PSW、通用寄存器、PC、ACC**

## 指令执行过程

### 指令周期

<u>CPU从主存中每</u>​<u>**取出并执行**</u>​<u>一条指令所需的全部时间</u>

指令周期常常用若干**机器周期**来表示，机器周期又叫**CPU周期**

一个机器周期又包含若干时钟周期

每个指令周期内机器周期数可以不等，每个机器周期内的节拍数也可以不等

​![image](https://image-host-pkj.oss-cn-guangzhou.aliyuncs.com/202409121600199.png)​

> 容易混淆的知识点
>
> * 周期
>
>   1. 指令周期
>
>       CPU从主存中取出并执⾏⼀条指令的时间，⼀个指令周期由多个机器周期组成
>   2. CPU周期
>
>       ⼀个机器周期包含若⼲时钟周期
>   3. 时钟周期
>
>       计算机最小时间周期，CPU操作基本单位，时钟周期内不会改变操作
>   4. 存取周期
>
>       连续启动两次独⽴的读/写操作所需要的最短时间

### 指令周期的数据流

​![image](https://image-host-pkj.oss-cn-guangzhou.aliyuncs.com/202409121704472.png)​

​![image](https://image-host-pkj.oss-cn-guangzhou.aliyuncs.com/202409121705638.png)​

#### 取指周期

1. 当前指令地址送至存储器地址寄存器

    (PC)→MAR
2. CU发出控制信号，经控制总线传到主存，本例读信号

    1→R
3. 将MAR所指主存中的内容经数据总线送入MDR

    M(MAR)→MDR
4. 将MDR中的内容（此时是指令）送入IR，<u>这一步为复制，MDR中仍保存完整指令</u>

    (MDR)→IR
5. CU发出控制信号，形成下一条指令地址

    (PC)+1→PC

​![image](https://image-host-pkj.oss-cn-guangzhou.aliyuncs.com/202409121710470.png)​

#### 间址周期

1. 将指令的地址码送入MAR

    Ad(IR)→MAR 或 Ad(MDR)→MAR
2. CU发出控制信号，启动主存做读操作

    1→R
3. 将MAR所指主存中的内容经数据总线送入MDR

    M(MAR)→MDR
4. 将有效地址送至指令的地址码字段

    (MDR)→Ad(IR)

​![image](https://image-host-pkj.oss-cn-guangzhou.aliyuncs.com/202409121713251.png)​

#### 执行周期

不同指令周期的操作不同，没有统一数据流向

#### 中断周期

**中断**：暂停当前任务去完成其他任务。为了能够恢复当前任务，需要**使用堆栈保存断点**

用SP表示栈顶地址，假设**SP指向栈顶元素**，进栈操作是先修改指针，后存入数据

1. CU控制将SP减1,修改后的地址送入MAR

    (SP)-1→SP，(SP)→MAR

    本质上是将断点存入某个存储单元，假设其地址为a,故可记做：a→MAR
2. CU发出控制信号，启动主存做写操作

    1→W
3. 将断点（PC内容）送入MDR

    (PC)→MDR
4. CU控制将中断服务程序的入口地址（由向量地址形成部件产生）送入PC

    向量地址→PC

即先将SP移位得到断点保存位置，再将断点的任务内容保存到SP指向位置

​![image](https://image-host-pkj.oss-cn-guangzhou.aliyuncs.com/202409122042922.png)​

### 指令执行方案

1. **单指令周期**

    指令在**固定**的时钟周期内完成

    取决于<u>执⾏时间最⻓</u>的指令的执⾏时间
2. **多指令周期**

    指令需要⼏个周期就为其分配⼏个周期

    可以选⽤不同个数的时钟周期来完成不同指令的执⾏过程
3. **流水线方案**

    每个时钟周期启动一条指令

    尽量让多条指令同时运⾏，但各⾃处在不同的执⾏步骤中

    指令**并行执行**

## 数据通路的功能和基本结构

**数据通路**：数据在功能部件之间传送的路径，包括数据通路上流经的部件

实现CPU内部的**运算器与寄存器**及**寄存器之间**的数据交换

* **内部总线**  
  指**同一部件**，如CPU内部连接各寄存器及运算部件之间的总线
* **系统总线**  
  指同一台计算机系统的**各部件**，如CPU、内存、通道和各类I/O接口间互相连接的总线

### 数据通路的基本结构

数据在指令执行过程中经过的路径包括路径上的组件都是数据通路的一部分

**数据通路**由**控制部件**控制，可视为CPU由这两大部分组成

* **数据通路的组成元件**

  1. **组合逻辑元件（操作元件）**

      不含存储单元，不受时钟信号控制，信号单向，输出取决于当下输入

      如ALU、译码器等
  2. **时序逻辑元件（状态元件**）

      输出与当下和之前的输出都有关，**必然包含存储单元**

      <u>必须在时钟信号下工作</u>

      如寄存器、存储器、程序计数器等
* **数据通路的结构分类**

  1. **CPU内部单总线方式**

      所有寄存器的输⼊端与输出端都连接到⼀条公共通路上

      结构⽐较简单，数据传输存在较多的冲突现象，**性能较低**

      同一时间只能进行一个操作的数据传输
  2. **CPU内部多总线方式**

      将所有寄存器的输⼊端与输出端都连接到多条公共通路上

      相较单总线结构，**效率提⾼**
  3. **专用数据通路方式**

      根据指令执⾏过程中的数据和地址的流动⽅向安排连接线路

      性能好，硬件总量大

### 数据传输

#### 寄存器之间数据传送

例如**PC送至MAR**

1. (PC) → Bus	PCout有效，PC内容送总线
2. Bus → MAR	MARin有效，总线内容送MAR

​![image](https://image-host-pkj.oss-cn-guangzhou.aliyuncs.com/image-20240913102547-dtsobuj.png)​

#### 主存与CPU之间数据传送

例如**CPU从主存读取指令**

1. (PC) → Bus → MAR	PCout和MARin有效，现行指令地址进入MAR
2. 1 → R			CU发读命令(通过控制总线发出，图中未画出)
3. MEM(MAR) → MDR		MDRin有效
4. MDR → Bus → IR		MDRout和IRin有效，现行指令进入IR

​![image](https://image-host-pkj.oss-cn-guangzhou.aliyuncs.com/202409131028374.png)​

#### 执行算术或逻辑运算

例如**加法指令**

1. Ad(IR) → Bus → MAR		AdIRout和MARin有效，Ad(IR)取指令地址码部分

    Ad(MDR) → Bus → MAR 或MDRout和MARin有效
2. 1 → R				CU发读命令
3. MEM(MAR) → 数据线 → MDR 	MDRin有效
4. MDR → Bus → Y 			MDRout和Yin有效，操作数→Y，暂存寄存器保存一个加数
5. (ACC)+(Y) → Z 			ACCout和ALUin有效，CU向ALU发加命令，结果→Z
6. Z → ACC 			Zout和ACCin有效，结果→ACC

​![image](https://image-host-pkj.oss-cn-guangzhou.aliyuncs.com/202409131034642.png)​

## 控制器的功能和工作原理

### 控制器的结构和功能

​![image](https://image-host-pkj.oss-cn-guangzhou.aliyuncs.com/image-20240916205207-s964shg.png)​

* 控制器的主要功能

  * 从主存中取出⼀条命令，并指出下⼀条指令在主存中的位置
  * 对指令进⾏编码或测试，产⽣相应的操作控制信号，以便启动规定的动作
  * 指挥并控制CPU、主存、输⼊和输出设备之间的数据流动⽅向

||硬布线控制器|微程序控制器|
| ----------| ---------------------------------------------------------------------------| -----------------------------------------------------------------------------------------------|
|工作原理|逻辑门电路和触发器，结合时序安排|按照节拍的安排，顺序执⾏微操作|
|特点|• 采⽤硬件电路，速度快<br />• 设计难度⼤，成本⾼，不易扩展<br />• 时序系统复杂|• 速度较慢（主要是因为增加了从CM读取微指令的时间）<br />• 灵活性⾼，易扩充修改<br />• 时序系统简单|
|应用场合|RISC|CISC|

* **常考点**

  1. 微操作控制信号的形成主要与指令译码信号和时钟信号有关
  2. 微的关系

      1. 每条机器指令编写成⼀个微程序
      2. 每个微程序包含若⼲微指令
      3. 每条微指令对应⼀个或⼏个微操作命令
      4. 机器指令---->微程序---->微指令----->微操作命令
  3. 微程序⼊⼝地址是机器指令的操作码字段
  4. 控制存储器CM采⽤ROM组成，⼀条微指令存放在CM单元中；CM属于CPU的⼀部分
  5. 微指令计数器决定微指令执⾏顺序
  6. 字段直接编码法每个互斥类为⼀个字段，每个字段需要留出⼀个状态
  7. 微指令的编码⽅式中，直接编码⽅式效率最⾼
  8. 兼容性微命令是指可以同时产⽣，同时完成某些某操作的微命令
  9. 若指令系统中有n种机器指令，则控制存储器中的微程序数⾄少是n+2个
  10. ⽔平型微指令和垂直线微指令的对⽐

       ​![image](https://image-host-pkj.oss-cn-guangzhou.aliyuncs.com/202409162116022.png)​

## 异常和中断机制

### 异常和中断的概念

见操作系统1.计算机系统概述——中断和异常的概念

### 异常和中断响应过程

1. **关中断**

    禁止响应新的中断，保证保存断点期间不被打断

    通过设置中断允许触发器（IF）实现，1为开中断
2. **保存断点和程序状态**

    保证处理后正确返回到被中断的程序中继续运⾏  

    通常**保存在栈**中，这是为了<u>⽀持异常或中断的嵌套</u>
3. **识别异常和中断并转到相应的处理程序**

    识别有两种⽅式——**软件识别**和**硬件识别**  

    1. **软件识别**

        CPU内设置异常状态寄存器，在其中查询异常和中断类型
    2. **硬件识别（向量中断）**

        异常或中断处理程序的**首地址**称为**中断向量**，所有中断向量都存放在**中断向量表**中

        每个异常或中断都被指定一个**中断类型号**

        在中断向量表中，类型号和中断向量一一对应

## 指令流水线

‍

## 多处理器的基本概念
