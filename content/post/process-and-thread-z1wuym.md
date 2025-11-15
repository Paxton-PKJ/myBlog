---
title: 408操作系统—2.进程与线程
slug: process-and-thread-z1wuym
url: /post/process-and-thread-z1wuym.html
date: '2024-04-23 11:57:14+08:00'
lastmod: '2024-05-12 20:00:39+08:00'
toc: true
tags:
  - '408'
  - 操作系统
categories:
  - 提桶跑路笔记
keywords: 408,操作系统
isCJKLanguage: true
---





## 进程和线程

### 进程的概念

- **定义**

  - 是程序（进程实体）的一次<u>执行运行过程</u>
  - 是具有独立功能的程序在一个数据集合上运行的过程
  - 是系统进行<u>资源分配和调度</u>的一个<u>独立单位</u>
- **特征**

  1. **动态性**

     进程具有一定<u>生命周期</u>，能够创建活动暂停终止，动态性是其<u>最基本特征</u>
  2. **并发性**

     多个进程能够在一段时间内同时运行
  3. **独立性**

     进程是<u>独立运行、获得资源、接受调度</u>的基本单位
  4. **异步性**

     进程的执行不是严格按照程序指定的顺序进行的，但是程序可以独立地、不连续地执行，而且执行的速度不由指令本身决定，通常受整个系统中资源调度和分配的影响
- **组成**

  1. **进程控制块**（Process Control Block,PCB）

     <u>进程存在的唯一标志</u>，在进程创建时新建 PCB，进程结束时删除 PCB

     - PCB 包含信息：

       1. **进程描述信息**

          - **进程标识符** PID：每个进程都有一个唯一的标识符
          - **用户标识符** UID：标识进程归属的用户，用于保护和共享服务
       2. **进程控制和管理信息**

          - **进程当前状态**
          - **进程优先级**
       3. **资源分配清单**

          - 有关<u>内存地址空间</u>或<u>虚拟地址空间</u>的信息
          - <u>打开文件的列表</u>和所使用的 <u>I/O 设备信息</u>
       4. **CPU 相关信息**

          - CPU 中各寄存器的值
     - 组织 PCB：

       - **链接方式**

         统一状态的 PCB 链成队列，如就绪队列阻塞队列，也可以将阻塞态进程 PCB 依据原因排成多个阻塞队列
       - **索引方式**

         统一状态的进程组织在索引表中，如就绪索引表、阻塞索引表
  2. **程序段**

     能够被进程调度程序调度到 CPU 执行的<u>程序代码段</u>，<u>多个进程可以运行同一个程序</u>，即程序是对象，进程是对象的实例
  3. **数据段**

     进程对应程序加工处理的<u>原始数据</u>

     程序执行时产生的<u>中间或最终结果</u>

### 进程的状态与转换

#### 进程的状态

1、2、3 为基本状态

1. **运行态 Running**

    该时刻进程占用 CPU
2. **就绪态 Ready**

    进程获得了除 CPU 外的一切所需资源，一旦得到 CPU，就可以立即运行
3. **阻塞态 Blocked**

    该进程正在<u>等待某一事件发生（等待资源分配或等待 I/O）</u>而暂停运行，即使具备 CPU 资源也无法运行
4. **创建态 New**

   进程正在被创建时的状态
5. **结束态 Exit**

   进程正在从系统中消失时的状态

---

- **挂起态**

  <u>系统资源紧张或需要等待事件</u>，优先级较低的进程将被设为挂起，并<u>移到内存外</u>  
  等待条件允许，将重新调回内存，使其进入就绪态

  - **阻塞挂起态**

    进程在外存等待某事件出现

    进程在等待某些条件满足，例如等待 I/O 操作完成或其他事件发生
  - **就绪挂起态**

    进程在外存，但已被分配资源，只要进入内存即可运行

    进程已经准备好运行，但由于某些原因（例如内存不足），暂时无法被调度执行

#### 状态的转换

![image](https://image-host-pkj.oss-cn-guangzhou.aliyuncs.com/20250731104255679.png)

- **就绪态--&gt;运行态**

  - 进程被调度，获得 CPU 资源（分派 CPU 时间片）
- **运行态--&gt;就绪态**

  - <u>时间片用完</u>
  - 高优先级程序进程就绪时，调度程序将正在执行的进程转为就绪
- **运行态--&gt;阻塞态**

  **主动行为**，进程以系统调用的方式请求 OS 提供服务，或等待某一事件发生

  - 进程请求某一资源的使用和分配
  - 等待某一事件发生（I/O 操作的完成）
- **阻塞态--&gt;就绪态**

  **被动行为**，需要其他相关进程<u>发送唤醒语句</u>

  - 中断结束或 I/O 操作结束

### 进程控制

操作系统中使用原语控制进程的创建、终止、阻塞、唤醒

#### 进程创建

- 引起事件

  - 用户登录系统
  - 作业调度
  - 系统提供服务
  - 用户程序应用请求
  - 父进程创建子进程

    子进程可以继承父进程的资源，被撤销时返还资源

    父进程撤销，子进程也被撤销
- 创建进程的过程

  1. 申请空白 PCB
  2. 向 PCB 填写进程信息
  3. 分配资源
  4. PCB 插入就绪队列，等待调度运行

#### 进程结束

- 引起事件

  - **正常结束**
  - **异常结束**

    程序运行时发生了异常事件无法继续运行（和内中断部分有关但不等同）存储区越界、保护错、非法指令、特权指令错、运行超时、算术运算错、I/O 故障等
  - **外界干预**

    进程应外界请求终止运行  
    如操作员或操作系统干预、父进程请求和父进程终止

  在 Linux 中父进程被终止，则子进程成为**<u>孤儿进程</u>**
- 进程结束的过程

  1. 查找需要结束进程的 PCB
  2. 若处于执行状态则立刻终止，释放其 CPU 资源
  3. 若具有子进程，子进程交给 1 号进程（kernel_init）接管，避免孤儿进程
  4. 归还进程拥有的资源
  5. 将 PCB 由队列删除

#### 进程阻塞

- 引起事件

  进程必须等<u>待某一事件完成</u>时，可以<u>**主动调用**</u>​<u>阻塞语句</u>使自身阻塞等待，<u>一旦被阻塞等待，只能由其他进程唤醒</u>

  - 当进程需要等待某事件完成时
  - 请求系统资源失败
  - 新数据尚未到达，或没有新任务
- 阻塞进程的过程

  1. 找到被阻塞进程<u>标识号对应的 PCB</u>
  2. 若处于运行态，则保护现场并将其转换为阻塞态
  3. 将 PCB 加入到阻塞队列中

#### 进程唤醒

- 引起事件

  进程等待的事件完成后，由其他进程发送消息唤醒该进程，<u>进程</u>​<u>**不可能自我唤醒**</u>

  - 由于等待 I/O 设备阻塞时，需要由释放该 I/O 设备的进程发送唤醒语句唤醒
  - 由于等待数据阻塞时，由提供数据的进程发送唤醒语句唤醒
  - ...
- 唤醒进程的过程

  - 在阻塞队列中找到需唤醒队列的 PCB
  - **移出阻塞**队列，由阻塞态转换为就绪态
  - **插入就绪**队列，等待调度

### 进程内存空间

![进程内存空间-20251114220809-erwlxfk.drawio](assets/进程内存空间-20251114220809-erwlxfk.drawio-20251114223542-1y9thex.svg)

- **用户空间**：进程执行的用户程序代码和数据

  1. **代码**

      <span data-type="text" style="background-color: var(--b3-card-error-background); color: var(--b3-card-error-color);">只读</span>存储 **进程** 的可执行代码，包括程序的指令和只读数据，可共享
  2. **数据区**

      - **初始化数据区**：存放已初始化的全局变量、静态变量。程序运行前分配变量
      - **未初始化数据区：** 没有初始化值的全局变量、静态变量。程序启动时OS将这个区域内存初始化为零
  3. **堆区**

      动态分配内存，程序运行时的临时变量和数据结构存放于此。堆使用malloc分配的内存需要手动释放，以避免内存泄漏
  4. **内存映射区域**

      动态链接库映射，磁盘文件内容映射到内存
  5. **栈区**

      存储函数调用时的**局部（自动）变量**、**函数参数**、**返回地址**、**寄存器值**等。以**栈帧**的形式为每个函数调用分配空间
- **内核空间**

  - 进程特定数据结构

    - **页表：** 记录进程虚拟地址到物理地址的映射关系
    - **TCB：**  包含进程的状态、优先级、打开的文件列表等信息
    - **内核栈：** 进程在内核态运行时使用的栈空间

### 进程通信

指进程之间的信息交换，低级通信方式使用 PV 操作，<u>高级通信方式</u>主要有三类

#### 共享存储

两个通信进程之间存在一块可以直接访问的<u>共享空间</u>

进程对共享空间读写时，需要使用<u>同步互斥工具</u>控制共享空间读写

- **低级共享**：基于<u>数据结构</u>的共享
- **高级共享**：基于<u>存储区</u>共享

操作系统为通信进程提供可共享使用的空间和同步互斥工具，数据交换指令由用户使用读写指令完成

#### 消息传递

若不能使用共享存储，则必须利用操作系统提供的消息传递实现进程通信

进程间数据交互以格式化的<u>消息</u>为单位，进程通过发送消息和接收消息两个原语进行数据交换

- 特点

  - <u>隐藏了通信实现细节</u>，实现由操作系统完成
  - <u>不存在中间部分</u>，通信过程对用户透明，简化了通讯程序的设计

微内核与服务器之间的通信即采用了消息传递机制

![image](https://image-host-pkj.oss-cn-guangzhou.aliyuncs.com/202404242135984.png "共享存储与消息传递")

#### 管道通信

- **定义**

  **管道**特殊共享**文件**（pipe 文件），管道中的数据<u>**先进先出，管道存在于内存中，单独构成一种文件系统**</u>

  <u>不满</u>，写进程一直写入数据  
  <u>非空</u>，读进程一直读取数据
- 管道机制提供的协调能力

  1. **互斥**：当一个进程对管道进行读写时，其他进程<u>必须等待</u>
  2. **同步**：

      - 写进程写入一定量数据到管道后，写进程阻塞，直到<u>读进程读取数据后将写进程唤醒</u>
      - 读进程将管道数据读空后，读进程阻塞，直到<u>写进程写入数据到管道后将读进程唤醒</u>
      - 即读写进程<u>相互轮流阻塞与唤醒</u>
  3. **确定对方的存在**
- **优点**

  1. <u>管道大小有所限制</u>

      管道文件是固定大小的缓冲区，Linux 中为 4KB。缓冲区满时，下一个写操作将被阻塞，等待读操作腾出足够的空间
  2. <u>读进程可以比写进程写入的数据读取的更多</u>

      当缓冲区数据读取完还有读操作没执行完，下一个读操作将被阻塞，等待写操作写入数据
  3. 管道只能由创建进程访问，由于管道属于文件，子进程可以继承父进程的资源，因此子进程也可以继承父进程的管道
- **注意**

  - <u>仅允许</u>​<u>**单向通讯**</u>​<u>，若需要两个进程双向通信，则需要定义两个管道</u>

    ![image](https://image-host-pkj.oss-cn-guangzhou.aliyuncs.com/202404242152405.png)

### 线程和多线程模型

#### 线程的概念与特征

- **线程**

  - 进程中的一条执行流程，一个基本的 CPU 执行单元
  - 是进程的一个实体，是被独立调度和分派的基本单位
  - 线程自己<u>不拥有系统资源</u>，与同属一个进程的其他线程<u>共享进程的资源</u>
  - 同一进程中的多个线程可以<u>并发执行</u>且共享相同的地址空间
  - 线程可以<u>创建和撤销另一个进程</u>
  - 线程具有<u>三种基本状态：</u>​<u>**就绪运行阻塞**</u>，状态转换与进程基本一致
- **线程的组成**

  由<u>线程 ID、程序计数器、寄存器集合、堆栈组成</u>

引入线程的目的是为了减少程序在<u>并发执行时所付出的时空开销，提高系统并发性能</u>

引入线程后，线程作为 CPU 的分配单元，而进程作为除 CPU 外的其他系统资源分配单元

若线程切换发生在一个进程内部，则时空开销比进程切换少，使得更多线程能够参与并发

#### 线程与进程的比较

||进程|线程|
| --| --------------------------------------------| -----------------------------------------------------------------|
|**调度**|<u>无线程系统的基本调度单位</u>，每次调度都进行上下文切换|独立调度基本单位，进程内调度开销小，进程外调度开销大|
|**是什么的单位**|**资源分配**的基本单位|**调度**的基本单位|
|**资源**|拥有资源的基本单位|共享所属进程的资源|
|**独立性**|独立的地址空间和资源，不允许其他进程访问<br />|同进程的不同线程共享进程的地址空间和资源<br />不同进程的线程不可见|
|**系统开销**|创建撤销进程需要分配或回收 PCB 及其他资源|线程切换只需要保存和设置少量寄存器内容|
|**多处理器系统的支持**|只能运行在一个 CPU 上|多个线程分配到多个 CPU 中，同时占用不同的 CPU，缩短进程处理时间|

#### 线程的组织与控制

- **线程控制块（PCB）**

  与进程类似，每个线程都有一个线程控制块 TCB，用于记录控制和管理线程的信息

  1. **线程标识符**
  2. **一组寄存器**

     包括程序计数器、状态寄存器、通用寄存器
  3. **线程运行状态**
  4. **优先级**
  5. **线程专有存储区**

     线程切换时用于保存现场
  6. **堆栈指针**

     过程调用时保存局部变量及返回地址等
- **线程创建**
- **线程终止**

#### 线程的实现方式

- **用户级线程（User-Level Thread, ULT）**

  ![image](https://image-host-pkj.oss-cn-guangzhou.aliyuncs.com/20250731101406739.png)

  - **定义**：由<u>用户级线程库函数</u>完成整个进程的管理和调度，在用户空间里创建和管理
  - **模型**：多对一模型
  - **优点**：

    1. TCB 由用户线程库函数维护，<u>**可用于不支持线程技术的 OS**</u>
    2. 线程切换无需用户态和内核态的切换，速度快
  - **缺点**：

    1. <u>一个线程</u>发起系统调用被阻塞，**<u>则整个进程都被阻塞</u>**
    2. 多线程执行时，实际上是由多个线程按照用户调度程序<u>分配一个时间片，执行慢</u>
    3. <u>跨进程切换</u>线程需要内核参与
  - **其他**：

    实质上就是由**用户自己模拟实现的多线程**，一个进程中的多个线程按照用户编写的调度程序分配一个时间片，因此**<u>进程中每次只能有一个线程执行</u>**，线程执行阻塞命令则整个进程被阻塞
- **内核级线程（Kernel—Level Thread，KLT）**

  ![image](https://image-host-pkj.oss-cn-guangzhou.aliyuncs.com/image-20250731101330-avi2u7q.png)

  - **定义**：OS内核完成线程的创建管理终止
  - **模型**：一对一模型
  - **优点**：

    1. 内核线程被阻塞，<u>不影响其他内核线程</u>，内核可以<u>调度同一进程的其他线程占用 CPU</u>
    2. 内核调度同一进程中的多个线程<u>并发执行</u>
    3. 内核可以采用多线程技术，提高系统的执行速度和效率
  - **缺点**：

    1. 同一进程的线程切换需要核心态，系统开销较大
    2. 用户进程的线程在用户态运行，线程调度和管理在内核态
- **组合方式**

  - **定义**：内核支持多个内核级线程的建立、调度和管理，同时允许用户程序建立、调度和管理用户级线程
  - **模型**：多对多模型

#### 多线程模型

||多对一模型|一对一模型|多对多模型|
| -| -------------------------------------------------------------------------------------------------------| ------------------------------------------------------| ------------------------------------------------------------------------------------------------|
|**定义**|多个 ULT 映射到一个 KLT|每个 ULT 映射到一个 KLT|n 个 ULT 映射到 m 个 KLT，n>=m|
|**优点**|线程管理在用户空间进行，效率高|一个线程被阻塞，内核调度另一个线程运行，并发能力强|1. 克服了多对一模型的并发度不高的缺点<br />2. 克服了一对一模型一个用户进程占用太多内核线程开销大的缺点|
|**缺点**|1. 一个线程阻塞，其他线程都被阻塞<br />2. 任何时刻只有一个线程能访问内核<br />3. 多个线程不能同时在多个处理机上运行|每创建一个用户线程，就要创建一个对应的内核线程，开销大|<br />|

![image](https://image-host-pkj.oss-cn-guangzhou.aliyuncs.com/202404252203571.png)

## CPU 调度

### CPU 调度的基本概念和分类

- **调度层次分类**

  ![image](https://image-host-pkj.oss-cn-guangzhou.aliyuncs.com/202404261501250.png)

  1. **高级调度/作业调度**

     - <u>外存到内存</u>的调度，从<u>后备队列</u>中调度作业
     - 每个作业只在后备队列中<u>调入调出一次</u>
     - 通常存在于<u>多道批处理系统</u>，用户提交的作业都存在外存中，由作业调度按算法调入内存
  2. **中级调度/内存调度**

     - 目的是提高内存运用率和系统吞吐量
     - 将暂时不能运行的进程<u>调到外存等待</u>，设为挂起态
     - 是存储器管理中的对换功能
  3. **低级调度/进程调度**

     - 从就绪队列中选取一个进程进入 CPU 运行，使用频率很高
     - 各种 OS 都必须配置这种调度
- **三种调度的联系**

  1. 调用频率：作业调度 < 内存调度 < 进程调度
  2. <u>进程调度是基本的，不可或缺</u>

### 调度的目标

1. CPU利用率=$\frac{CPU有效工作时间}{CPU有效工作时间+CPU等待时间}$
2. **系统吞吐量**：单位时间内 CPU <u>完成作业的数量</u>
3. **周转时间**

   - **周转时间**：作业<u>提交到完成</u>所花费时间的总和
   - **平均周转时间**：多个作业周转时间的<u>平均值</u>
   - **带权周转时间**：作业周转时间与作业实际运行时间的<u>比值</u>
   - **平均带权周转时间**：多个作业<u>带权周转时间的平均值</u>
4. **等待时间**：进程处于等待 CPU 的时间之和（<u>调度算法优劣评价指标</u>）
5. **响应时间**：用户提交请求到<u>系统首次产生响应</u>所用的时间（<u>交互式系统的重要评价指标</u>）

调度的最终目标要考虑的因素：特定用户需求 + 系统整体效率 + 调度算法开销

### 调度的实现

#### 调度程序

用于调度和分派 CPU 的组件称为调度程序，由三部分组成

- **排队器**

  按策略给就绪进程<u>排出</u>一个或多个队列
- **分派器**

  从就绪队列中<u>取出</u>进程并分配给 CPU
- **上下文切换器**

  对处理机进行切换时，会发生两对上下文的切换操作

  1. 第一对，将当前进程的到 PCB 中，再装入分派程序的上下文，以便分派程序运行
  2. 第二对，移出分派程序的上下文，将新选进程的 CPU 现场信息装入 CPU 的各个相应寄存器

在上下文切换时，需要执行大量 load 和 store 指令，以保存寄存器的内容，因此会花费较多时间

通常采用两组寄存器，其中一组供内核使用，一组供用户使用。这样，上下文切换时，只需改变指针，让其指向当前寄存器组即可

![image](https://image-host-pkj.oss-cn-guangzhou.aliyuncs.com/202404261723418.png)

#### 调度的时机、切换与过程

- **调度的时机**

  进程由<u>一个状态到另一个状态变化</u>时，就会触发一次调度

  1. **创建新进程**后
  2. 进程**正常结束**后或者**异常终止**后，必须从就绪队列选择一个进程运行，若无则运行一个系统提供的<u>闲逛进程</u>
  3. 进程因 I/O 请求、信号量操作或其他原因而**被阻塞**时，必须调度其他进程运行
  4. 当原先等待事件发生的进程由**阻塞态变为就绪态**，需要决定是让中断发生时运行的进程继续执行，还是让新就绪进程运行
  5. **高优先级进程**进入就绪队列时
- **进程的切换**

  - **不能进行调度与切换的过程**

    1. 处理中断的过程中
    2. 进程在 OS 内核临界区中
    3. 其他需要完全屏蔽中断的原语中

    若在上述过程中发生了引起调度的条件，需要置上<u>请求调度标志</u>，待过程结束再进行
  - **可以进行调度与切换的过程**

    1. 发生引起调度条件且当前进程无法继续执行下去时
    2. 中断结束处理或自陷处理结束后，被置上请求调度标志
    3. 进程结束时
    4. 创建新进程后
    5. 系统调用完成并返回用户态时
    6. 进程处于临界区时，不破坏临界资源的使用规则时

       - **临界资源**

         一个时间段内<u>只允许一个进程使用的资源</u>。各进程需要互斥地访问的资源叫做临界资源
       - **临界区**

         访问临界资源资源的那段代码
- **进程切换的过程**

  进程切换要求保存原进程在断点的现场信息，恢复被调度进程的现场信息

  1. 原进程的信息推入到当前进程的内核堆栈中保存现场信息，更新堆栈指针
  2. 内核从新进程的内核栈中装入新进程的信息
  3. 内核更新当前运行的进程空间指针，重设 PC 寄存器后开始运行新的进程
- **进程调度方式**

  1. **非抢占调度方式（非剥夺方式）**

     - 优点：实现简单，系统开销小，适合批处理系统
     - 缺点：紧急任务无法优先执行，不适合分时和大多数实时系统
  2. **抢占调度方式（剥夺方式）**

     - 优点：有利于提高系吞吐率和响应效率
     - 缺点：必须遵循一定的准则（如优先级，短进程优先，时间片原则）
- **闲逛进程**

  PID 为 0 的优先级最低的进程，没有其他进程就绪，该进程就一直运行

  闲逛进程不需要 CPU 以外的资源，**不会被阻塞**
- **两种线程的调度**

  1. 用户级线程调度

     线程调度由用户控制，在同一进程中调度
  2. 内核级线程调度

     内核选择一个线程运行，不考虑线程所属进程，调度需要完整的上下文切换

### 进程切换

- **上下文切换**

  切换 CPU 到另一个进程需要<u>保存当前进程状态并恢复另一个进程的状态</u>，这个任务称为上下文切换。

  进程上下文采用进程 PCB 表示，包括 **CPU 寄存器的值、进程状态和内存管理信息**等

  当进行上下文切换时，内核将旧进程状态保存在其 PCB 中，然后加载经调度而要执行的新进程的上下文
- **上下文切换的消耗**

  消耗大量的 CPU 时间，<u>纳秒级别</u>

  通过提供多个寄存器组，可以简单改变寄存器组指针来简单切换上下文

### 典型调度算法

![image](https://image-host-pkj.oss-cn-guangzhou.aliyuncs.com/20250802111949837.png)

||FCFS|SJF|高响应比|RR|多级反馈队列|
| ---------------------| ---------------------------------------------------------------------| -------------------------------------------------------------------------------------------------| -----------------------------------------------------------------------| ----------------------------------------------------------------------------------------------------------------------------------| ------------------------------------------------------------------------|
|简述|- 先来先服务算法，即按<u>队列模式</u>调度<br />- 往往对多个<u>相同优先级进程</u>按 FCFS 处理|- 短作业优先算法（SJF）<br />- 短进程优先算法（SPF）<br />- 若不做特别说明即默认非抢占式|- 前两者的总和平衡<br />- 等待时间越长响应比越高，越优先<br />|- 时间片轮转算法<br />- 按 FCFS 排好队列后依次分配时间片，用完即换<br />- 时间片过大时即为 FCFS<br />- 时间片过小则开销大<br /><br />|RR 和 FCFS 的综合与发展<br />动态调整进程优先级和时间片大小|
|可抢占|❌|✅|✅|✅|❔队列内算法不一定|
|不可被抢占|✅|✅|✅|❌|❔队列内算法不一定|
|特点&优点|1.公平<br />2.实现简单<br />3.<u>利于长作业</u><br />4.利于 CPU 繁忙作业<br />|1.平均等待时间最少<br />2.平均周转时间最少<br />2.**效率最高**<br />|1.兼顾长短作业<br />2.**满足短作业优先且不发生饥饿现象**|1.兼顾长短作业<br />2.**绝对可抢占**|1.兼顾长短作业<br />2.有较好的响应时间<br />3.可行性强|
|缺点|1.<u>不利于短作业</u><br />2.不利于 IO 繁忙作业|1.可能产生长时间饥饿现象，<u>不利长作业</u><br />2.估计时间不易确定<br />3.不能保证紧迫作业及时处理<br />|1.计算响应比开销大|1.平均等待时间最长<br />2.上下文切换浪费时间|-|
|适用|-|1.作业调度<br />2.批处理系统|-|1.分时系统<br />2.人机交互系统|通用|
|默认决策方式|非抢|非抢|非抢|抢占|抢占|

$响应比R_p=\frac{等待时间+要求服务时间}{要求服务时间}$

#### 优先级调度算法

依据进程创建后优先级是否改变划分两种优先级

- **静态优先级**

  创建进程时确定，整个运行期间不变，由进程类型、对资源的要求、用户要求确定

  - **缺点**

    - 不够精确
    - 可能导致优先级低进程长期得不到调度（饥饿）
- **动态优先级**

  创建时赋予优先级，随进程推进或等待时间增加而改变

通常而言，**系统进程** > 用户进程，**交互进程** > 非交互进程，**I/O 型进程** > 非 I/O 型进程

#### 多级反馈队列调度算法

实现思想如下：

1. **设置多个**​**就绪队列** **，每个队列赋予不同优先级**

    1队列优先级最高，<u>逐个降低</u>
2. **各队列的进程运行时间片的大小不同**

    优先级越高，时间片越小
3. **每个队列都采用 FCFS 算法**

    新进程放入 1 队列末尾，FCFS等待调度

    执行时，如它能在**时间片内完成，便可撤离**

    若尚**未完成，转入 2 队列末尾**等待，以此类推

    最后降到 n 队列，采用<u>时间片轮转方式</u>运行
4. **按队列优先级调度**

    1 队列为空,才调度 2 队列，以此类推

    执行 i 队列中进程时，**优先级较高**的队列进入新进程，立即将**正在运行进程放回到该队列的末尾**，而将 CPU 分配给新到的高优先级进程

## 同步与互斥

|方法名称|类型|可靠互斥？|是否支持同步|是否阻塞等待|是否忙等|适用进程数|是否避免死锁|特点备注|
| ----------| ----------| ------------| --------------| --------------| ----------| ------------| ---------------| ------------------------------|
|~~单标志法~~|软件|✘ 否|✘ 否|✘ 否|✔ 是|2|✘ 否|不安全，有竞态，教学用|
|~~双标志先检查法~~|软件|✘ 否|✘ 否|✘ 否|✔ 是|2|✘ 否|容易活锁|
|~~双标志后检查法~~|软件|一定程度|✘ 否|✘ 否|✔ 是|2|✘ 否|可实现互斥，但有活锁风险|
|Peterson 算法|软件|✔ 是|✘ 否|✘ 否|✔ 是|2|✔ 是|理论完美互斥，教学常用|
|~~中断屏蔽法~~|硬件|✔ 是|✘ 否|✘ 否|✔ 是|1（单核）|✘ 否|仅限内核，禁止中断|
|TestandSet指令|硬件|✔ 是|✘ 否|✘ 否|✔ 是|多|✘ 否|原子操作，但忙等严重|
|Swap指令|硬件|✔ 是|✘ 否|✘ 否|✔ 是|多|✘ 否|原子性交换|
|互斥锁|硬件|✔ 是|✘ 否|✘ 否|✔ 是|多|✘ 否|简化的互斥应用|
|整型信号量（P/V）|操作系统|✔ 是|✔ 是|✘ 否|✔ 是|多|✘ 否|可同步、互斥，但可能死锁|
|记录型信号量|操作系统|✔ 是|✔ 是|✔ 是|✘ 否|多|✘ 否|整型基础上增加阻塞队列|
|管程|高级语言|✔ 是|✔ 是|✔ 是|✘ 否|多|✔ 可设计避免|高级抽象，结构清晰，自动互斥|

### 同步与互斥的基本概念

- **同步**

  <u>**直接制约**</u>​<u>关系</u>，需要协调多个进程的<u>运行次序</u>而等待、传递信息所产生的制约关系
- **互斥**

  <u>**间接制约**</u>​<u>关系</u>，轮流访问临界区资源
- **临界资源**

  一次仅允许一个进程使用的资源，如**物理设备**（打印机），**共享变量**等

  临界资源的访问**必须互斥**
- **共享资源**

  可被多个进程同时使用的资源，如可重入代码/纯代码，共享程序段，磁盘，非共享数据
- **临界区**

  <span data-type="text">一个程序中仅允许 </span>​**一个线程**​<span data-type="text"> 或 </span>​**进程**​<span data-type="text"> 访问的代码片段</span>
- **临界区互斥的遵循准则**

  **1.2.3.必要**，4非必须

  1. **空闲让进**
  2. **忙则等待**
  3. **有限等待**

      对请求访问的进程，应保证能在有限时间内进入临界区，防止死等

      - **忙等**：未能进入 **临界区**，但反复检查判断是否能够进入临界区
      - **死等**：由于调度、优先级等问题，即使有资源空闲也永远等不到
  4. 让权等待

      进程不能进入临界区时，应立即释放处理器，防止长时间忙等

### 互斥

#### 软件方法

适用于**两进程互斥**

1. 单标志法

    **公共**布尔变量**turn**，表示进程<u>是否在执行临界区操作</u>

    ![image](https://image-host-pkj.oss-cn-guangzhou.aliyuncs.com/202405091440447.png)

    - **工作原理**：

      - 进入临界区前检查标志位，标志位显示可以进入，则进程进入临界区
      - 如果标志位表示不能进入，进程就会等待，直到标志位被设置为可进入的状态
    - **缺点**：这种方法可能会导致进程一直在检查标志位，浪费CPU资源
2. 双标志先检查法

    两个公共变量flag，表示两个进程进入某临界区的意愿

    重复**检查**意愿**直到没有进程想进入临界区**，将自身置为想进入，进入临界区

    ![image](https://image-host-pkj.oss-cn-guangzhou.aliyuncs.com/202405091441492.png)

    - **缺陷**：若在<u>检查对方后，修改自己前</u>，发生了进程切换，则双方都会检查通过，同时进入临界区产生死锁
3. 双标志后检查法

    先**设置自己的意愿flag，再检查其他人**的意愿

    ![image](https://image-host-pkj.oss-cn-guangzhou.aliyuncs.com/202405091440654.png)

    - 缺陷：在<u>设置意愿后发生进程切换</u>，导致在检查标志时，两个进程<u>同时想要进入</u>，导致都无法进入
4. **Peterson算法**

    - **两个bool变量**：flag，表示两个进程进入临界区的意愿
    - **使用一个共享变量**​**​`turn`​**​：`turn`变量决定当前哪个进程可以进入临界区

    初始时，均设置<u>自身期望访问</u>，均<u>设置turn变量为对方</u>

    若两个进程同时想要进入，则依据turn的最终值决定进入的进程

    ```c++
    // 初始化
    bool flag[2] = {false, false};  // 两个线程的意愿
    int turn = 0;                   // 当前运行的线程（0 或 1）
    ```

    ```c++
    // 线程 1 希望进入临界区
    void thread0() {
        flag[0] = true;
        turn = 1; // 线程 2 可以运行
        while (flag[1] && turn == 1) {
        // 等待线程 2 退出临界区或让出 CPU
        }
        // 进入临界区
        // ...
        // 退出临界区
        flag[0] = false;
    }
    ```

    ```c++
    // 线程 2 希望进入临界区
    void thread1() {
        flag[1] = true;
        turn = 0; // 线程 1 可以运行
        while (flag[0] && turn == 0) {
        // 等待线程 1 退出临界区或让出 CPU
        }
        // 进入临界区
        // ...
        // 退出临界区
        flag[1] = false;
    }
    ```

#### 硬件方法

1. **中断屏蔽方法**

    屏蔽中断以保证当前进程能够让临界区代码顺利执行完毕

    - **缺点**

      1. <u>限制CPU交替执行程序</u>的能力，明显降低系统效率
      2. 若进程无法开中断，系统可能终止运行
      3. <u>不适用于多处理器</u>
2. **硬件指令方法**

    所有操作都由硬件完成，以下仅为功能描述

    - **TestAndSet指令**

      简称TAS指令，为<u>原子操作</u>，用于读出共享布尔变量`lock`的值，后将该标志设置为真

      相比软件方法，TAS指令为**无法中断的原子操作**，必然可以实现互斥访问

      ```cpp
      // 以下函数原子性执行，每次都将一个锁设置为1，并返回设置前值
      int test_and_set(bool *lock) {
          bool old = *lock;
          *lock = true;
          return old;
      }
      ```

      ```cpp
      mutex = 0;

      thread() {
      	// 返回值 为 1 被占用，则循环等待
          while (test_and_set(&mutex) == 1); 
          /* 临界区代码 */
      	/* 临界区代码 */
          mutex = 0; // 解锁
      }
      ```
    - **Swap指令**

      - 每个临界资源有`bool lock`，false表示无占用
      - 每个进程有`bool key`

      使用原子`swap`​指令交换 **共享锁变量** 和 **进程 key 变量**，来判断是否获得进入权限。如果失败就**忙等**直到成功。

      ```cpp
      bool lock = false; 	// 临界资源标志

      // 进程A 代码
      bool key = true;	// 进程变量key
      while (key == true)
      	swap key,lock; 	// 交换过程为原子操作
      /* 临界区代码 */
      /* 临界区代码 */
      lock = false;
      ```
    - **优点**

      1. 简单、容易验证
      2. 适用于任意数目进程，支持多处理器
      3. 支持多个临界区
    - **缺点**

      1. 等待进入临界区的进程<span data-type="text" style="color: var(--b3-font-color6);">会保持while循环</span>，**无法让权等待**
      2. 可能**导致饥饿现象**

#### 互斥锁

互斥锁（mutex lock）是解决临界区互斥的最简单工具，操作系统提供的 **同步原语**

布尔变量`available`表示锁可用性

​`acquire()`​获得锁，`release()`​释放锁，检查锁状态到获得锁为连续**原子操作**，常使用**硬件机制实现**

### 同步

互斥实际上是特殊的同步

#### 信号量

信号量的不同值表示一个临界资源的不同状态，且只能被⬇️访问

|操作|作用|关键步骤|
| ------| ------------------------| ---------------------------------------------|
|**P（wait）**|申请资源<br />尝试将资源-1|- 信号量<span data-type="text">&gt;</span>0 → 减1，继续<br />- 信号量<span data-type="text">=</span>0 → 阻塞|
|**V（signal）**|释放资源<br />资源+1|- 信号量+1<br />- 若原值为0 → 唤醒一个阻塞线程|

信号量也是一种**低级的进程通信语言**

---

- **两个进程互斥**

  <span data-type="text">当 </span>​**信号量**​<span data-type="text"> 的初始值为 1 时，可以把 </span>​**信号量**​<span data-type="text"> 当作 </span>​**锁**​<span data-type="text"> 使用：</span>

  - 注意

    1. <u>**不同临界资源需要不同的互斥信号量**</u>
    2. 有多少资源初始值就是多少
    3. PV操作必须成对出现

  ```cpp
  semaphore S = 1;

  P1() {
      P(S);
      // critical section
      V(S);
  }

  P2() {
      P(S);
      // critical section
      V(S);
  }
  ```
- **两个进程同步**

  <span data-type="text">利用 </span>​**信号量**​<span data-type="text"> 可以实现线程间的 </span>​**同步**​<span data-type="text">，保证不同线程间某些操作的 </span>​**顺序关系**

  <span data-type="text">保证执行完 </span>​`P1`​<span data-type="text"> 中的 </span>​`code1`​<span data-type="text"> 之后，才会执行 </span>​`P2`​<span data-type="text"> 中的 </span>​`code2`

  ```cpp
  semphore S = 0;  // 将信号量的初始值设置为 0

  P1() {
      code1;       // 先执行 code1
      V(S);        // 告诉线程 P2，code1 已经完成
      ...
  }

  P2() {
      ...
      P(S);        // 检查 code1 是否完成
      code2;       // 检查无误，运行 code2
  }
  ```
- **前驱关系（同步问题）**

  <span data-type="text">多线程并发执行的环境中，某些线程的执行必须依赖于其他线程的完成</span>

  <div>
  <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="" height="" viewBox="-.5 -.5 411 311" content="&lt;mxfile host=&quot;Electron&quot; agent=&quot;Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) draw.io/24.7.17 Chrome/128.0.6613.36 Electron/32.0.1 Safari/537.36&quot; version=&quot;24.7.17&quot; scale=&quot;1&quot; border=&quot;0&quot;&gt;
   &lt;diagram name=&quot;Page-1&quot; id=&quot;7dwTzfdNkKBhSf6s7x-p&quot;&gt;
   &lt;mxGraphModel dx=&quot;673&quot; dy=&quot;1459&quot; grid=&quot;1&quot; gridSize=&quot;10&quot; guides=&quot;1&quot; tooltips=&quot;1&quot; connect=&quot;1&quot; arrows=&quot;1&quot; fold=&quot;1&quot; page=&quot;1&quot; pageScale=&quot;1&quot; pageWidth=&quot;250&quot; pageHeight=&quot;350&quot; math=&quot;0&quot; shadow=&quot;0&quot;&gt;
   &lt;root&gt;
   &lt;mxCell id=&quot;0&quot; /&gt;
   &lt;mxCell id=&quot;1&quot; parent=&quot;0&quot; /&gt;
   &lt;mxCell id=&quot;CEVkP0qSMCo_1s0JZc65-1&quot; value=&quot;&amp;lt;font style=&amp;quot;font-size: 16px;&amp;quot;&amp;gt;S&amp;lt;sub style=&amp;quot;font-size: 16px;&amp;quot;&amp;gt;4&amp;lt;/sub&amp;gt;&amp;lt;/font&amp;gt;&quot; style=&quot;ellipse;whiteSpace=wrap;html=1;aspect=fixed;fontSize=16;fillColor=none;&quot; parent=&quot;1&quot; vertex=&quot;1&quot;&gt;
   &lt;mxGeometry x=&quot;30&quot; y=&quot;-880&quot; width=&quot;40&quot; height=&quot;40&quot; as=&quot;geometry&quot; /&gt;
   &lt;/mxCell&gt;
   &lt;mxCell id=&quot;CEVkP0qSMCo_1s0JZc65-2&quot; value=&quot;&amp;lt;font style=&amp;quot;font-size: 16px;&amp;quot;&amp;gt;S&amp;lt;/font&amp;gt;&amp;lt;font style=&amp;quot;font-size: 16px;&amp;quot;&amp;gt;2&amp;lt;/font&amp;gt;&quot; style=&quot;ellipse;whiteSpace=wrap;html=1;aspect=fixed;fontSize=16;fillColor=none;&quot; parent=&quot;1&quot; vertex=&quot;1&quot;&gt;
   &lt;mxGeometry x=&quot;160&quot; y=&quot;-970&quot; width=&quot;40&quot; height=&quot;40&quot; as=&quot;geometry&quot; /&gt;
   &lt;/mxCell&gt;
   &lt;mxCell id=&quot;CEVkP0qSMCo_1s0JZc65-3&quot; value=&quot;&amp;lt;font style=&amp;quot;font-size: 16px;&amp;quot;&amp;gt;S&amp;lt;/font&amp;gt;&amp;lt;font style=&amp;quot;font-size: 16px;&amp;quot;&amp;gt;6&amp;lt;/font&amp;gt;&quot; style=&quot;ellipse;whiteSpace=wrap;html=1;aspect=fixed;fontSize=16;fillColor=none;&quot; parent=&quot;1&quot; vertex=&quot;1&quot;&gt;
   &lt;mxGeometry x=&quot;115&quot; y=&quot;-770&quot; width=&quot;40&quot; height=&quot;40&quot; as=&quot;geometry&quot; /&gt;
   &lt;/mxCell&gt;
   &lt;mxCell id=&quot;CEVkP0qSMCo_1s0JZc65-4&quot; value=&quot;&amp;lt;font style=&amp;quot;font-size: 16px;&amp;quot;&amp;gt;S&amp;lt;/font&amp;gt;&amp;lt;font style=&amp;quot;font-size: 16px;&amp;quot;&amp;gt;5&amp;lt;/font&amp;gt;&quot; style=&quot;ellipse;whiteSpace=wrap;html=1;aspect=fixed;fontSize=16;fillColor=none;&quot; parent=&quot;1&quot; vertex=&quot;1&quot;&gt;
   &lt;mxGeometry x=&quot;220&quot; y=&quot;-880&quot; width=&quot;40&quot; height=&quot;40&quot; as=&quot;geometry&quot; /&gt;
   &lt;/mxCell&gt;
   &lt;mxCell id=&quot;CEVkP0qSMCo_1s0JZc65-5&quot; value=&quot;&amp;lt;font style=&amp;quot;font-size: 16px;&amp;quot;&amp;gt;S&amp;lt;/font&amp;gt;&amp;lt;font style=&amp;quot;font-size: 16px;&amp;quot;&amp;gt;1&amp;lt;/font&amp;gt;&quot; style=&quot;ellipse;whiteSpace=wrap;html=1;aspect=fixed;fontSize=16;fillColor=none;&quot; parent=&quot;1&quot; vertex=&quot;1&quot;&gt;
   &lt;mxGeometry x=&quot;260&quot; y=&quot;-1040&quot; width=&quot;40&quot; height=&quot;40&quot; as=&quot;geometry&quot; /&gt;
   &lt;/mxCell&gt;
   &lt;mxCell id=&quot;CEVkP0qSMCo_1s0JZc65-7&quot; value=&quot;&quot; style=&quot;endArrow=classic;html=1;rounded=0;exitX=1;exitY=1;exitDx=0;exitDy=0;fontSize=14;&quot; parent=&quot;1&quot; source=&quot;CEVkP0qSMCo_1s0JZc65-1&quot; target=&quot;CEVkP0qSMCo_1s0JZc65-3&quot; edge=&quot;1&quot;&gt;
   &lt;mxGeometry width=&quot;50&quot; height=&quot;50&quot; relative=&quot;1&quot; as=&quot;geometry&quot;&gt;
   &lt;mxPoint x=&quot;90&quot; y=&quot;-820&quot; as=&quot;sourcePoint&quot; /&gt;
   &lt;mxPoint x=&quot;140&quot; y=&quot;-870&quot; as=&quot;targetPoint&quot; /&gt;
   &lt;/mxGeometry&gt;
   &lt;/mxCell&gt;
   &lt;mxCell id=&quot;CEVkP0qSMCo_1s0JZc65-24&quot; value=&quot;c&quot; style=&quot;edgeLabel;html=1;align=center;verticalAlign=middle;resizable=0;points=[];fontSize=14;&quot; parent=&quot;CEVkP0qSMCo_1s0JZc65-7&quot; vertex=&quot;1&quot; connectable=&quot;0&quot;&gt;
   &lt;mxGeometry x=&quot;-0.1172&quot; y=&quot;2&quot; relative=&quot;1&quot; as=&quot;geometry&quot;&gt;
   &lt;mxPoint as=&quot;offset&quot; /&gt;
   &lt;/mxGeometry&gt;
   &lt;/mxCell&gt;
   &lt;mxCell id=&quot;CEVkP0qSMCo_1s0JZc65-8&quot; value=&quot;&quot; style=&quot;endArrow=classic;html=1;rounded=0;exitX=0;exitY=1;exitDx=0;exitDy=0;entryX=1;entryY=0;entryDx=0;entryDy=0;fontSize=14;&quot; parent=&quot;1&quot; source=&quot;CEVkP0qSMCo_1s0JZc65-4&quot; target=&quot;CEVkP0qSMCo_1s0JZc65-3&quot; edge=&quot;1&quot;&gt;
   &lt;mxGeometry width=&quot;50&quot; height=&quot;50&quot; relative=&quot;1&quot; as=&quot;geometry&quot;&gt;
   &lt;mxPoint x=&quot;160&quot; y=&quot;-820&quot; as=&quot;sourcePoint&quot; /&gt;
   &lt;mxPoint x=&quot;202&quot; y=&quot;-778&quot; as=&quot;targetPoint&quot; /&gt;
   &lt;/mxGeometry&gt;
   &lt;/mxCell&gt;
   &lt;mxCell id=&quot;CEVkP0qSMCo_1s0JZc65-25&quot; value=&quot;d&quot; style=&quot;edgeLabel;html=1;align=center;verticalAlign=middle;resizable=0;points=[];fontSize=14;&quot; parent=&quot;CEVkP0qSMCo_1s0JZc65-8&quot; vertex=&quot;1&quot; connectable=&quot;0&quot;&gt;
   &lt;mxGeometry x=&quot;-0.1941&quot; y=&quot;3&quot; relative=&quot;1&quot; as=&quot;geometry&quot;&gt;
   &lt;mxPoint as=&quot;offset&quot; /&gt;
   &lt;/mxGeometry&gt;
   &lt;/mxCell&gt;
   &lt;mxCell id=&quot;CEVkP0qSMCo_1s0JZc65-9&quot; value=&quot;&quot; style=&quot;endArrow=classic;html=1;rounded=0;exitX=0;exitY=1;exitDx=0;exitDy=0;entryX=1;entryY=0;entryDx=0;entryDy=0;fontSize=14;&quot; parent=&quot;1&quot; source=&quot;CEVkP0qSMCo_1s0JZc65-2&quot; target=&quot;CEVkP0qSMCo_1s0JZc65-1&quot; edge=&quot;1&quot;&gt;
   &lt;mxGeometry width=&quot;50&quot; height=&quot;50&quot; relative=&quot;1&quot; as=&quot;geometry&quot;&gt;
   &lt;mxPoint x=&quot;115&quot; y=&quot;-920&quot; as=&quot;sourcePoint&quot; /&gt;
   &lt;mxPoint x=&quot;53&quot; y=&quot;-888&quot; as=&quot;targetPoint&quot; /&gt;
   &lt;/mxGeometry&gt;
   &lt;/mxCell&gt;
   &lt;mxCell id=&quot;CEVkP0qSMCo_1s0JZc65-18&quot; value=&quot;b1&quot; style=&quot;edgeLabel;html=1;align=center;verticalAlign=middle;resizable=0;points=[];fontSize=14;&quot; parent=&quot;CEVkP0qSMCo_1s0JZc65-9&quot; vertex=&quot;1&quot; connectable=&quot;0&quot;&gt;
   &lt;mxGeometry x=&quot;-0.1817&quot; relative=&quot;1&quot; as=&quot;geometry&quot;&gt;
   &lt;mxPoint y=&quot;-1&quot; as=&quot;offset&quot; /&gt;
   &lt;/mxGeometry&gt;
   &lt;/mxCell&gt;
   &lt;mxCell id=&quot;CEVkP0qSMCo_1s0JZc65-10&quot; value=&quot;&quot; style=&quot;endArrow=classic;html=1;rounded=0;exitX=1;exitY=1;exitDx=0;exitDy=0;entryX=0.5;entryY=0;entryDx=0;entryDy=0;fontSize=14;&quot; parent=&quot;1&quot; source=&quot;CEVkP0qSMCo_1s0JZc65-2&quot; target=&quot;CEVkP0qSMCo_1s0JZc65-4&quot; edge=&quot;1&quot;&gt;
   &lt;mxGeometry width=&quot;50&quot; height=&quot;50&quot; relative=&quot;1&quot; as=&quot;geometry&quot;&gt;
   &lt;mxPoint x=&quot;210&quot; y=&quot;-950&quot; as=&quot;sourcePoint&quot; /&gt;
   &lt;mxPoint x=&quot;252&quot; y=&quot;-908&quot; as=&quot;targetPoint&quot; /&gt;
   &lt;/mxGeometry&gt;
   &lt;/mxCell&gt;
   &lt;mxCell id=&quot;CEVkP0qSMCo_1s0JZc65-20&quot; value=&quot;b2&quot; style=&quot;edgeLabel;html=1;align=center;verticalAlign=middle;resizable=0;points=[];fontSize=14;&quot; parent=&quot;CEVkP0qSMCo_1s0JZc65-10&quot; vertex=&quot;1&quot; connectable=&quot;0&quot;&gt;
   &lt;mxGeometry x=&quot;-0.028&quot; y=&quot;2&quot; relative=&quot;1&quot; as=&quot;geometry&quot;&gt;
   &lt;mxPoint as=&quot;offset&quot; /&gt;
   &lt;/mxGeometry&gt;
   &lt;/mxCell&gt;
   &lt;mxCell id=&quot;CEVkP0qSMCo_1s0JZc65-12&quot; value=&quot;&quot; style=&quot;endArrow=classic;html=1;rounded=0;exitX=0;exitY=1;exitDx=0;exitDy=0;entryX=1;entryY=0;entryDx=0;entryDy=0;fontSize=14;&quot; parent=&quot;1&quot; source=&quot;CEVkP0qSMCo_1s0JZc65-5&quot; target=&quot;CEVkP0qSMCo_1s0JZc65-2&quot; edge=&quot;1&quot;&gt;
   &lt;mxGeometry width=&quot;50&quot; height=&quot;50&quot; relative=&quot;1&quot; as=&quot;geometry&quot;&gt;
   &lt;mxPoint x=&quot;240&quot; y=&quot;-990&quot; as=&quot;sourcePoint&quot; /&gt;
   &lt;mxPoint x=&quot;286&quot; y=&quot;-934&quot; as=&quot;targetPoint&quot; /&gt;
   &lt;/mxGeometry&gt;
   &lt;/mxCell&gt;
   &lt;mxCell id=&quot;CEVkP0qSMCo_1s0JZc65-16&quot; value=&quot;a1&quot; style=&quot;edgeLabel;html=1;align=center;verticalAlign=middle;resizable=0;points=[];fontSize=14;&quot; parent=&quot;CEVkP0qSMCo_1s0JZc65-12&quot; vertex=&quot;1&quot; connectable=&quot;0&quot;&gt;
   &lt;mxGeometry x=&quot;-0.0799&quot; y=&quot;4&quot; relative=&quot;1&quot; as=&quot;geometry&quot;&gt;
   &lt;mxPoint as=&quot;offset&quot; /&gt;
   &lt;/mxGeometry&gt;
   &lt;/mxCell&gt;
   &lt;mxCell id=&quot;CEVkP0qSMCo_1s0JZc65-13&quot; value=&quot;&amp;lt;font style=&amp;quot;font-size: 16px;&amp;quot;&amp;gt;S&amp;lt;/font&amp;gt;&amp;lt;font style=&amp;quot;font-size: 16px;&amp;quot;&amp;gt;3&amp;lt;/font&amp;gt;&quot; style=&quot;ellipse;whiteSpace=wrap;html=1;aspect=fixed;fontSize=16;fillColor=none;&quot; parent=&quot;1&quot; vertex=&quot;1&quot;&gt;
   &lt;mxGeometry x=&quot;400&quot; y=&quot;-880&quot; width=&quot;40&quot; height=&quot;40&quot; as=&quot;geometry&quot; /&gt;
   &lt;/mxCell&gt;
   &lt;mxCell id=&quot;CEVkP0qSMCo_1s0JZc65-14&quot; value=&quot;&quot; style=&quot;endArrow=classic;html=1;rounded=0;exitX=1;exitY=1;exitDx=0;exitDy=0;entryX=0;entryY=0;entryDx=0;entryDy=0;fontSize=14;&quot; parent=&quot;1&quot; source=&quot;CEVkP0qSMCo_1s0JZc65-5&quot; target=&quot;CEVkP0qSMCo_1s0JZc65-13&quot; edge=&quot;1&quot;&gt;
   &lt;mxGeometry width=&quot;50&quot; height=&quot;50&quot; relative=&quot;1&quot; as=&quot;geometry&quot;&gt;
   &lt;mxPoint x=&quot;276&quot; y=&quot;-996&quot; as=&quot;sourcePoint&quot; /&gt;
   &lt;mxPoint x=&quot;204&quot; y=&quot;-954&quot; as=&quot;targetPoint&quot; /&gt;
   &lt;/mxGeometry&gt;
   &lt;/mxCell&gt;
   &lt;mxCell id=&quot;CEVkP0qSMCo_1s0JZc65-17&quot; value=&quot;a2&quot; style=&quot;edgeLabel;html=1;align=center;verticalAlign=middle;resizable=0;points=[];fontSize=14;&quot; parent=&quot;CEVkP0qSMCo_1s0JZc65-14&quot; vertex=&quot;1&quot; connectable=&quot;0&quot;&gt;
   &lt;mxGeometry x=&quot;-0.0503&quot; y=&quot;1&quot; relative=&quot;1&quot; as=&quot;geometry&quot;&gt;
   &lt;mxPoint as=&quot;offset&quot; /&gt;
   &lt;/mxGeometry&gt;
   &lt;/mxCell&gt;
   &lt;mxCell id=&quot;CEVkP0qSMCo_1s0JZc65-15&quot; value=&quot;&quot; style=&quot;endArrow=classic;html=1;rounded=0;exitX=0;exitY=1;exitDx=0;exitDy=0;entryX=1;entryY=0.5;entryDx=0;entryDy=0;fontSize=14;&quot; parent=&quot;1&quot; source=&quot;CEVkP0qSMCo_1s0JZc65-13&quot; target=&quot;CEVkP0qSMCo_1s0JZc65-3&quot; edge=&quot;1&quot;&gt;
   &lt;mxGeometry width=&quot;50&quot; height=&quot;50&quot; relative=&quot;1&quot; as=&quot;geometry&quot;&gt;
   &lt;mxPoint x=&quot;286&quot; y=&quot;-986&quot; as=&quot;sourcePoint&quot; /&gt;
   &lt;mxPoint x=&quot;214&quot; y=&quot;-944&quot; as=&quot;targetPoint&quot; /&gt;
   &lt;/mxGeometry&gt;
   &lt;/mxCell&gt;
   &lt;mxCell id=&quot;CEVkP0qSMCo_1s0JZc65-26&quot; value=&quot;e&quot; style=&quot;edgeLabel;html=1;align=center;verticalAlign=middle;resizable=0;points=[];fontSize=14;&quot; parent=&quot;CEVkP0qSMCo_1s0JZc65-15&quot; vertex=&quot;1&quot; connectable=&quot;0&quot;&gt;
   &lt;mxGeometry x=&quot;-0.0827&quot; y=&quot;-2&quot; relative=&quot;1&quot; as=&quot;geometry&quot;&gt;
   &lt;mxPoint as=&quot;offset&quot; /&gt;
   &lt;/mxGeometry&gt;
   &lt;/mxCell&gt;
   &lt;/root&gt;
   &lt;/mxGraphModel&gt;
   &lt;/diagram&gt;
  &lt;/mxfile&gt;" style="transition: none;"><defs></defs><g><g data-cell-id="0"><g data-cell-id="1"><g data-cell-id="CEVkP0qSMCo_1s0JZc65-1"><g><ellipse cx="20" cy="180" rx="20" ry="20" fill="none" stroke="rgb(0, 0, 0)" pointer-events="all"></ellipse></g><g><g transform="translate(-0.5 -0.5)"><switch><foreignObject pointer-events="none" width="100%" height="100%" requiredFeatures="http://www.w3.org/TR/SVG11/feature#Extensibility" style="overflow:visible;text-align:left"><div xmlns="http://www.w3.org/1999/xhtml" style="display: flex; align-items: unsafe center; justify-content: unsafe center; width: 38px; height: 1px; padding-top: 180px; margin-left: 1px;"><div data-drawio-colors="color: rgb(0, 0, 0); " style="box-sizing: border-box; font-size: 0px; text-align: center;"><div style="display: inline-block; font-size: 16px; font-family: Helvetica; color: rgb(0, 0, 0); line-height: 1.2; pointer-events: all; white-space: normal; overflow-wrap: normal;"><font style="font-size: 16px;">S<sub style="font-size: 16px;">4</sub></font></div></div></div></foreignObject><image x="1" y="169" width="38" height="27" xlink:href="data:image/png;base64,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 **"></image></switch></g></g></g><g data-cell-id="CEVkP0qSMCo_1s0JZc65-2"><g><ellipse cx="150" cy="90" rx="20" ry="20" fill="none" stroke="rgb(0, 0, 0)" pointer-events="all"></ellipse></g><g><g transform="translate(-0.5 -0.5)"><switch><foreignObject pointer-events="none" width="100%" height="100%" requiredFeatures="http://www.w3.org/TR/SVG11/feature#Extensibility" style="overflow:visible;text-align:left"><div xmlns="http://www.w3.org/1999/xhtml" style="display: flex; align-items: unsafe center; justify-content: unsafe center; width: 38px; height: 1px; padding-top: 90px; margin-left: 131px;"><div data-drawio-colors="color: rgb(0, 0, 0); " style="box-sizing: border-box; font-size: 0px; text-align: center;"><div style="display: inline-block; font-size: 16px; font-family: Helvetica; color: rgb(0, 0, 0); line-height: 1.2; pointer-events: all; white-space: normal; overflow-wrap: normal;"><font style="font-size: 16px;">S</font><font style="font-size: 16px;">2</font></div></div></div></foreignObject><image x="131" y="81" width="38" height="23" xlink:href="data:image/png;base64,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** "></image></switch></g></g></g><g data-cell-id="CEVkP0qSMCo_1s0JZc65-3"><g><ellipse cx="105" cy="290" rx="20" ry="20" fill="none" stroke="rgb(0, 0, 0)" pointer-events="all"></ellipse></g><g><g transform="translate(-0.5 -0.5)"><switch><foreignObject pointer-events="none" width="100%" height="100%" requiredFeatures="http://www.w3.org/TR/SVG11/feature#Extensibility" style="overflow:visible;text-align:left"><div xmlns="http://www.w3.org/1999/xhtml" style="display: flex; align-items: unsafe center; justify-content: unsafe center; width: 38px; height: 1px; padding-top: 290px; margin-left: 86px;"><div data-drawio-colors="color: rgb(0, 0, 0); " style="box-sizing: border-box; font-size: 0px; text-align: center;"><div style="display: inline-block; font-size: 16px; font-family: Helvetica; color: rgb(0, 0, 0); line-height: 1.2; pointer-events: all; white-space: normal; overflow-wrap: normal;"><font style="font-size: 16px;">S</font><font style="font-size: 16px;">6</font></div></div></div></foreignObject><image x="86" y="281" width="38" height="23" xlink:href="data:image/png;base64,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"></image></switch></g></g></g><g data-cell-id="CEVkP0qSMCo_1s0JZc65-4"><g><ellipse cx="210" cy="180" rx="20" ry="20" fill="none" stroke="rgb(0, 0, 0)" pointer-events="all"></ellipse></g><g><g transform="translate(-0.5 -0.5)"><switch><foreignObject pointer-events="none" width="100%" height="100%" requiredFeatures="http://www.w3.org/TR/SVG11/feature#Extensibility" style="overflow:visible;text-align:left"><div xmlns="http://www.w3.org/1999/xhtml" style="display: flex; align-items: unsafe center; justify-content: unsafe center; width: 38px; height: 1px; padding-top: 180px; margin-left: 191px;"><div data-drawio-colors="color: rgb(0, 0, 0); " style="box-sizing: border-box; font-size: 0px; text-align: center;"><div style="display: inline-block; font-size: 16px; font-family: Helvetica; color: rgb(0, 0, 0); line-height: 1.2; pointer-events: all; white-space: normal; overflow-wrap: normal;"><font style="font-size: 16px;">S</font><font style="font-size: 16px;">5</font></div></div></div></foreignObject><image x="191" y="171" width="38" height="23" xlink:href="data:image/png;base64,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"></image></switch></g></g></g><g data-cell-id="CEVkP0qSMCo_1s0JZc65-5"><g><ellipse cx="250" cy="20" rx="20" ry="20" fill="none" stroke="rgb(0, 0, 0)" pointer-events="all"></ellipse></g><g><g transform="translate(-0.5 -0.5)"><switch><foreignObject pointer-events="none" width="100%" height="100%" requiredFeatures="http://www.w3.org/TR/SVG11/feature#Extensibility" style="overflow:visible;text-align:left"><div xmlns="http://www.w3.org/1999/xhtml" style="display: flex; align-items: unsafe center; justify-content: unsafe center; width: 38px; height: 1px; padding-top: 20px; margin-left: 231px;"><div data-drawio-colors="color: rgb(0, 0, 0); " style="box-sizing: border-box; font-size: 0px; text-align: center;"><div style="display: inline-block; font-size: 16px; font-family: Helvetica; color: rgb(0, 0, 0); line-height: 1.2; pointer-events: all; white-space: normal; overflow-wrap: normal;"><font style="font-size: 16px;">S</font><font style="font-size: 16px;">1</font></div></div></div></foreignObject><image x="231" y="11" width="38" height="23" xlink:href="data:image/png;base64,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"></image></switch></g></g></g><g data-cell-id="CEVkP0qSMCo_1s0JZc65-7"><g><path d="M34.14 194.14l55.21 74.64" fill="none" stroke="rgb(0, 0, 0)" stroke-miterlimit="10" pointer-events="stroke"></path><path d="M92.48 273 85.5 269.45 89.35 268.78 91.13 265.29z" fill="rgb(0, 0, 0)" stroke="rgb(0, 0, 0)" stroke-miterlimit="10" pointer-events="all"></path></g><g data-cell-id="CEVkP0qSMCo_1s0JZc65-24"><g><g transform="translate(-0.5 -0.5)"><switch><foreignObject pointer-events="none" width="100%" height="100%" requiredFeatures="http://www.w3.org/TR/SVG11/feature#Extensibility" style="overflow:visible;text-align:left"><div xmlns="http://www.w3.org/1999/xhtml" style="display: flex; align-items: unsafe center; justify-content: unsafe center; width: 1px; height: 1px; padding-top: 228px; margin-left: 62px;"><div data-drawio-colors="color: rgb(0, 0, 0); background-color: rgb(255, 255, 255); " style="box-sizing: border-box; font-size: 0px; text-align: center;"><div style="display: inline-block; font-size: 14px; font-family: Helvetica; color: rgb(0, 0, 0); line-height: 1.2; pointer-events: all; background-color: rgb(255, 255, 255); white-space: nowrap;">c</div></div></div></foreignObject><image x="58.5" y="220" width="7" height="20.5" xlink:href="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABwAAABSCAYAAABHX7SIAAAAAXNSR0IArs4c6QAABDJJREFUaEPtWFkodVEYXdfwIJmHeDKVTEnIk6koEWVK5lKEDJHhwZPyoIQHROTBFCmUKRKJkBQekEgpvFEiQ6b8fefvDts5955zdOmv/6ySsr/9rb3X/vb+lqP6/Pz8xC9CpRAaW21FUmMrCkVSRVLZCihFI1sysQmKpGIKyR5XJJUtmdiEf1vSt7c3HB0d4eDgADc3N3h6eoK1tTUcHBwQGBgIPz8/mJiYGNykpB1ubW2hp6cHs7OzuLu705vQxsYG2dnZKCsrg7+/v2CcQcKzszOUlJRgZWVF7GiYcVNTU1RVVaGpqQkWFhbMmF7Cqakp5OXlcbJ9F5GRkZibm4OVlZUmhSDhxMQEMjMz8fHxIcjl7e3NnZeTkxMeHh6wt7eHk5MTwdjY2FgsLS1BpVJx4zxCmhgaGsol+oqMjAw0NjbC19eXN7a9vY3y8nLs7u7yxtrb21FdXS1MGBcXx61IF+bm5hgYGOAKwhBeX1+RmpqK+fl5Jsze3h4XFxewtLRkd7ixsYGIiAhezsHBQeTn50s6yvv7ewQEBODy8pKJ7+7uRmlpKUtISYeHh5nApKQkzMzMSCJTB/X29nLVrYuEhARu55ozJDlo64+Pj0zg+vq64K4NrYDO39HRES8vLzAzM4O7uzuCg4MxPj6uJRSSkwLPz89l7U4dTPmI1MvLC1QDamh22NbWhtraWiZ5VlYWRkdHv0Wob5KGsLi4GH19fUxcS0sL6urqfoYwPj4ei4uLTPKRkRHk5OT8DGF4eDg2NzeZ5FSdVKXGhEbSkJAQ7onSxfLyMmJiYozJp63SqKgo0BXQBbWjxMTEnyFMTk7G9PQ0k5wqlCrVmNBIWlBQwL2XumhtbUVNTY0x+bSSNjc3o6GhgUlO/XBoaOhbhHQc9OPp6QkPDw/ut4+Pj5ZwbW0N0dHRTHLqe/r6nNgqioqK0N/fz4SNjY1pCZ+fn0GehIySLqi/0TsoB/Q1zc3NjdcxqIMwDTg9PR2Tk5NMbuog1J7kYGFhAdQddEGm6vDwkCWki08PwFfQC0SNWQqoQ5BjoOS66Ozs5BwBz2LQOdJ56oJMEBUA3VVDoBZHruCrSi4uLjg9PeXMFI+QrEBQUBBub2+Z3NTXaIX19fVwdXXl8a6urnJXaH9/nzdGpiwtLY37u6BrI2uXkpKC9/d33mRyXyQZ9Tly3eTAd3Z2cHV1Jbj5iooKdHR0aMb0+lJ6R6mIDDltsTMlm0FeRm0R9e5Qnej4+BiVlZUgcjmg69XV1YXc3Fy+QlK+CJPVp5USMbkyfaAXpbCwkHNndnZ2gmGS/plRz6QzpfOiwrq+vubIbW1t4ezsjLCwMO6yi0EWoVgyKeMKoRSVZMUoksqSS0qwIqkUlWTFKJLKkktK8H8gqRQZjBnz93vUL0IhNLrYiqSKpLIVUIpGtmRiE35d0j/5XHjekRzpOwAAAABJRU5ErkJggg **"></image></switch></g></g></g></g><g data-cell-id="CEVkP0qSMCo_1s0JZc65-8"><g><path d="M195.86 194.14 123.5 271.22" fill="none" stroke="rgb(0, 0, 0)" stroke-miterlimit="10" pointer-events="stroke"></path><path d="M119.91 275.04 122.15 267.54 123.5 271.22 127.25 272.33z" fill="rgb(0, 0, 0)" stroke="rgb(0, 0, 0)" stroke-miterlimit="10" pointer-events="all"></path></g><g data-cell-id="CEVkP0qSMCo_1s0JZc65-25"><g><g transform="translate(-0.5 -0.5)"><switch><foreignObject pointer-events="none" width="100%" height="100%" requiredFeatures="http://www.w3.org/TR/SVG11/feature#Extensibility" style="overflow:visible;text-align:left"><div xmlns="http://www.w3.org/1999/xhtml" style="display: flex; align-items: unsafe center; justify-content: unsafe center; width: 1px; height: 1px; padding-top: 229px; margin-left: 167px;"><div data-drawio-colors="color: rgb(0, 0, 0); background-color: rgb(255, 255, 255); " style="box-sizing: border-box; font-size: 0px; text-align: center;"><div style="display: inline-block; font-size: 14px; font-family: Helvetica; color: rgb(0, 0, 0); line-height: 1.2; pointer-events: all; background-color: rgb(255, 255, 255); white-space: nowrap;">d</div></div></div></foreignObject><image x="163" y="221" width="8" height="20.5" xlink:href="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAABSCAYAAAA1kNY+AAAAAXNSR0IArs4c6QAAA/9JREFUaEPtWFkotVEUXTdTIQmhFCIpFCIpD4YnJS9EiZSIB1NK5jJljBIiY0Q8eFB48SCSEiLCi5QSkSFDJOP921/duud+dzj3Q+rv7Md79z57nXXO3mufT6VWq9X4Q1MJAIIBwYBgQDDw3zIQHh6O7e1tRmUuLi7g7u7O/PZrWiAACAYEA4KBH2fg8/MTBwcH2N3dxc3NDV5fX+Hk5ITAwEBERkbCysqK6XA/BuDs7AydnZ2YmprC1dWV3gHe0dERubm5qK6uhoODg+TzbQD0XGhtbUVjYyNeXl64Xg5eXl4YGxtDTEzM9wAQvSkpKZifn+dKrO1ERzE3N4eamhplYkQ7T05OxuzsrN7kRHFERISkavf39zg8PMTJyQnja2dnB1tbW1xfX5uvht3d3SguLpYld3V1RVtbG9LS0mBjY8P8v7GxgdLSUqytrRllzKQc0+329vbG8/MzsxDd9KWlJbi5uRlMQMyVlZWho6PDoI9JAFVVVWhpaWEWcHFxkcrPWHLtgJycHIyMjOgFYRTA19cXPDw8cHl5yQSPj48jMzOT+zI+Pj4iICAA5+fnshijAFZWVhAbG8sE0bnTQpaWltwAyJHuSkVFhXkAamtr0dDQwAQVFBSgp6fHrOTkTKA9PT1BrGqbUQbi4+OxuLjIBExOTiI9Pd1sABTg7++Po6MjfgA+Pj6yet7f30dQUJAiAKmpqZiZmeEHQB3s4+ODCbi9vZUER4npqyiDR0C9njqXrr29vclUjhcM6UhlZSUfA3d3d7Kd0s1/f3/nzSfz6+vrQ35+Ph8AQwyQKFlbWysC0dvbi8LCQj4A5EWJdHdMYkKdUIk1NTVJishdhn5+fjg+PmYCdnZ2EBoaqiQ/SkpK0NXVxQ8gMTERCwsLTMDQ0BCotyuxuLg4LC8v8wNob29HeXk5E5CRkYGJiQmz81M509E9PDzwA6BhU5duKk2qXc2cx4uEhpmkpCSZu0k5DgkJwd7eHhNYV1cH0gleo7mAZsLV1VXzAYyOjiI7O5sJpA65vr6OsLAwLgz66l8TaJIBmv2Dg4OlOU/bnJ2dJaEyBWJ6elqaHXRbOjcActza2kJUVJSsJ9AcSK2V5kV6B2gbvR3oqIhBY1//TTKgWXRwcBB5eXl6KScgBJDeAKQV1Ds2NzeZxCqVCtHR0aAhh7sR6Wbr7+9HUVGRQTqNXYj6+nqps3KLkaHFaMzOysqSdUhD/hYWFmhubpamY7PU0NhuSB+Gh4cxMDAgK1FNHCVOSEgA7ZxKmezHAGiDOz09BT1CaOZ7enqCvb09fH19pTuhdHD5te+EXE0DgAAgGBAMCAYEA4IBwYCKVzZ/y08AEAwIBgQDggHBwJ8z8A8AKhlwaOWQAQAAAABJRU5ErkJggg** "></image></switch></g></g></g></g><g data-cell-id="CEVkP0qSMCo_1s0JZc65-9"><g><path d="M135.86 104.14 39.59 162.55" fill="none" stroke="rgb(0, 0, 0)" stroke-miterlimit="10" pointer-events="stroke"></path><path d="M35.1 165.28l4.17-6.63L39.59 162.55 42.9 164.64z" fill="rgb(0, 0, 0)" stroke="rgb(0, 0, 0)" stroke-miterlimit="10" pointer-events="all"></path></g><g data-cell-id="CEVkP0qSMCo_1s0JZc65-18"><g><g transform="translate(-0.5 -0.5)"><switch><foreignObject pointer-events="none" width="100%" height="100%" requiredFeatures="http://www.w3.org/TR/SVG11/feature#Extensibility" style="overflow:visible;text-align:left"><div xmlns="http://www.w3.org/1999/xhtml" style="display: flex; align-items: unsafe center; justify-content: unsafe center; width: 1px; height: 1px; padding-top: 129px; margin-left: 95px;"><div data-drawio-colors="color: rgb(0, 0, 0); background-color: rgb(255, 255, 255); " style="box-sizing: border-box; font-size: 0px; text-align: center;"><div style="display: inline-block; font-size: 14px; font-family: Helvetica; color: rgb(0, 0, 0); line-height: 1.2; pointer-events: all; background-color: rgb(255, 255, 255); white-space: nowrap;">b1</div></div></div></foreignObject><image x="87" y="121" width="16" height="20.5" xlink:href="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABSCAYAAADkd9JOAAAAAXNSR0IArs4c6QAABX9JREFUeF7tWmsoZl0UXi4T4ofyA2GQS5L7tVxCcikkokaJXEIkl0RSwkjMDEXkkrsklygNMsmdoZCJ8mOS5FIU/hg/ENN6+3y9h8N73tP77XO+115/z1r7PPvZa6+19tpb5fHx8RHesahQAqgH0C1AY8A7joFAgyDNAjQL0CxAswDNAv8wMDIyArGxsQw+0tPToaWlRbQc9ff3Q3x8/L/4jo6OwNjYmDNeRhr8vxFwcXEBDg4OcHp6+v4IeHh4gIiICJicnGSs9rvxgMzMTGhubn7h6kpPAJYteXl5UF9fz7rPlZqA29tbSEtLg56enleDnNISgIEOM9Tq6uqbEV4pCRgeHoaMjAy4vLyUmd6UioD9/X3IycmBiYkJ1omrq6vD/f298mWBk5MTqKqqgvb2dsB9/1zU1NSgrq4OOjs74devX+QJuLm5geXlZUB3Ozs7Aw0NDfj48SO4uLiAhYWFTDeVpfDp0ycYHBxkVcMqr6+vD/z9/cHJyYksAeiSZWVlMDY2Bn/+/GEFaGVlBampqZCdnQ1aWlqy5sr6nY0AFRUVSE5Ohm/fvoGurq7EjigBDQ0NUFxcDLj6XMTU1FTiptHR0VzUGTrPCfD19YWvX7+Cp6cnQ48YAfr6+lBRUSH3RNCgpqYGCgsL5bJ9IgC3VHl5OYSHh7PaEyEAJ4/7XFrQHd3c3MDS0lKy/w8PD2FlZYU1YKFdbW0t5Ofncyaho6MDrK2tAVf+LSFCwHMAcXFxkghtZmbG+HR1dSWZ6JcvX+Du7o7x7cOHD7C1tQV2dnacSeCiSJQAVVVVSVpKSkp6E9vi4iKEhYXB9fU1Qw/379raGpd5cdYhSkBjYyNkZWVxAjc9PQ2hoaEvdOfm5iTpS1FCjICgoCD48eOHXLjRU7q7uxk2WMsPDQ3JNY4oYgAWPd7e3nIB393dBXt7+xexAGOFtra2XGO9pkzEA2xsbGBvb48XYGdnZ9je3mbYzszMQGBgIK/xnhsRIQBPYWydFy4zYOvaYF4vLS3lYi5ThwgBGPlTUlJkgmFTaGtrA+wqSwsWOQMDA7zGE8QDMKIHBwfzAvz9+3dJ41Ja+ARUQWMA5u7nNThXNrAm8PPzY6hjebu5ucl1iDf1iGwBPG9j752P4ESxZJYWR0fHF4GRz9hoQ4SA9fV18PDw4IVxYWHhReGDhRAWRIoQIgTMzs5CQEAAL7zj4+MQGRnJsI2KioLR0VFe4wkSBLEFnZCQwAsw9hCwpyct2NZubW3lNZ4gBGDOxtzNRxITE6G3t5dhipNHEhQhRLYAVm1YvckreINjbm4u6RVIy87OjsKOxUQI0NTUhOPjY9DT05OLAzw8hYSEMGxwjPPzc8CjtSKECAEItKSkBCorKzljxtXH/L+0tMSwKSoqgurqas7jyFIkRgBeQGDq8vHxkYVJ8h07QwUFBQxd7OUfHByAiYkJpzG4KBEjAMEYGBgAlraurq5vYsP6Hw9Qzx+f4cGoqamJy7w46xAlAFFhPMCMgFH8qTf/hBZXF9vmbBcatra2sLGxwfue4DVGiBCAexkrOmnBhoa7uztg7x8boL9//5ZMkO3JIQa++fl5hUV+aRxECMC9j3sa3V9ewesyPE1iU+W/ECIEYCTHswDu666uLs7ziImJAawEDQ0NOdvIq0iMgKfoPzU1BZ8/f4afP3+yYsUYgb2D3Nxc3ucHeUhQOAFcf47VHZKAt8N4P48ZwsjICLy8vEBHR4frMKLQo8/l6XN5+lyePpenz+VFEY4FAkGzAM0CNAvQLECzgEABWBS/pVmAZoH3ngVEsREFBKEi4L9F8WtKgCiWQUAQ1AMEJF8Uv6YeIIplEBAE9QAByRfFr6kHiGIZBARBPUBA8kXx67+KaiF/yChwFAAAAABJRU5ErkJggg **"></image></switch></g></g></g></g><g data-cell-id="CEVkP0qSMCo_1s0JZc65-10"><g><path d="M164.14 104.14l41.82 50.94" fill="none" stroke="rgb(0, 0, 0)" stroke-miterlimit="10" pointer-events="stroke"></path><path d="M209.29 159.14 202.14 155.95 205.96 155.08 207.55 151.5z" fill="rgb(0, 0, 0)" stroke="rgb(0, 0, 0)" stroke-miterlimit="10" pointer-events="all"></path></g><g data-cell-id="CEVkP0qSMCo_1s0JZc65-20"><g><g transform="translate(-0.5 -0.5)"><switch><foreignObject pointer-events="none" width="100%" height="100%" requiredFeatures="http://www.w3.org/TR/SVG11/feature#Extensibility" style="overflow:visible;text-align:left"><div xmlns="http://www.w3.org/1999/xhtml" style="display: flex; align-items: unsafe center; justify-content: unsafe center; width: 1px; height: 1px; padding-top: 130px; margin-left: 188px;"><div data-drawio-colors="color: rgb(0, 0, 0); background-color: rgb(255, 255, 255); " style="box-sizing: border-box; font-size: 0px; text-align: center;"><div style="display: inline-block; font-size: 14px; font-family: Helvetica; color: rgb(0, 0, 0); line-height: 1.2; pointer-events: all; background-color: rgb(255, 255, 255); white-space: nowrap;">b2</div></div></div></foreignObject><image x="180" y="122" width="16" height="20.5" xlink:href="data:image/png;base64,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** "></image></switch></g></g></g></g><g data-cell-id="CEVkP0qSMCo_1s0JZc65-12"><g><path d="M235.86 34.14 169.65 72.66" fill="none" stroke="rgb(0, 0, 0)" stroke-miterlimit="10" pointer-events="stroke"></path><path d="M165.11 75.3 169.4 68.75l.25 3.91L172.92 74.8z" fill="rgb(0, 0, 0)" stroke="rgb(0, 0, 0)" stroke-miterlimit="10" pointer-events="all"></path></g><g data-cell-id="CEVkP0qSMCo_1s0JZc65-16"><g><g transform="translate(-0.5 -0.5)"><switch><foreignObject pointer-events="none" width="100%" height="100%" requiredFeatures="http://www.w3.org/TR/SVG11/feature#Extensibility" style="overflow:visible;text-align:left"><div xmlns="http://www.w3.org/1999/xhtml" style="display: flex; align-items: unsafe center; justify-content: unsafe center; width: 1px; height: 1px; padding-top: 57px; margin-left: 205px;"><div data-drawio-colors="color: rgb(0, 0, 0); background-color: rgb(255, 255, 255); " style="box-sizing: border-box; font-size: 0px; text-align: center;"><div style="display: inline-block; font-size: 14px; font-family: Helvetica; color: rgb(0, 0, 0); line-height: 1.2; pointer-events: all; background-color: rgb(255, 255, 255); white-space: nowrap;">a1</div></div></div></foreignObject><image x="197" y="49" width="16" height="20.5" xlink:href="data:image/png;base64,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 **"></image></switch></g></g></g></g><g data-cell-id="CEVkP0qSMCo_1s0JZc65-13"><g><ellipse cx="390" cy="180" rx="20" ry="20" fill="none" stroke="rgb(0, 0, 0)" pointer-events="all"></ellipse></g><g><g transform="translate(-0.5 -0.5)"><switch><foreignObject pointer-events="none" width="100%" height="100%" requiredFeatures="http://www.w3.org/TR/SVG11/feature#Extensibility" style="overflow:visible;text-align:left"><div xmlns="http://www.w3.org/1999/xhtml" style="display: flex; align-items: unsafe center; justify-content: unsafe center; width: 38px; height: 1px; padding-top: 180px; margin-left: 371px;"><div data-drawio-colors="color: rgb(0, 0, 0); " style="box-sizing: border-box; font-size: 0px; text-align: center;"><div style="display: inline-block; font-size: 16px; font-family: Helvetica; color: rgb(0, 0, 0); line-height: 1.2; pointer-events: all; white-space: normal; overflow-wrap: normal;"><font style="font-size: 16px;">S</font><font style="font-size: 16px;">3</font></div></div></div></foreignObject><image x="371" y="171" width="38" height="23" xlink:href="data:image/png;base64,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** "></image></switch></g></g></g><g data-cell-id="CEVkP0qSMCo_1s0JZc65-14"><g><path d="M264.14 34.14 371.74 161" fill="none" stroke="rgb(0, 0, 0)" stroke-miterlimit="10" pointer-events="stroke"></path><path d="M375.13 165.01 367.94 161.93 371.74 161 373.28 157.4z" fill="rgb(0, 0, 0)" stroke="rgb(0, 0, 0)" stroke-miterlimit="10" pointer-events="all"></path></g><g data-cell-id="CEVkP0qSMCo_1s0JZc65-17"><g><g transform="translate(-0.5 -0.5)"><switch><foreignObject pointer-events="none" width="100%" height="100%" requiredFeatures="http://www.w3.org/TR/SVG11/feature#Extensibility" style="overflow:visible;text-align:left"><div xmlns="http://www.w3.org/1999/xhtml" style="display: flex; align-items: unsafe center; justify-content: unsafe center; width: 1px; height: 1px; padding-top: 96px; margin-left: 318px;"><div data-drawio-colors="color: rgb(0, 0, 0); background-color: rgb(255, 255, 255); " style="box-sizing: border-box; font-size: 0px; text-align: center;"><div style="display: inline-block; font-size: 14px; font-family: Helvetica; color: rgb(0, 0, 0); line-height: 1.2; pointer-events: all; background-color: rgb(255, 255, 255); white-space: nowrap;">a2</div></div></div></foreignObject><image x="310" y="88" width="16" height="20.5" xlink:href="data:image/png;base64,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 **"></image></switch></g></g></g></g><g data-cell-id="CEVkP0qSMCo_1s0JZc65-15"><g><path d="M375.86 194.14 130.95 287.73" fill="none" stroke="rgb(0, 0, 0)" stroke-miterlimit="10" pointer-events="stroke"></path><path d="M126.04 289.6 131.33 283.83 130.95 287.73 133.83 290.37z" fill="rgb(0, 0, 0)" stroke="rgb(0, 0, 0)" stroke-miterlimit="10" pointer-events="all"></path></g><g data-cell-id="CEVkP0qSMCo_1s0JZc65-26"><g><g transform="translate(-0.5 -0.5)"><switch><foreignObject pointer-events="none" width="100%" height="100%" requiredFeatures="http://www.w3.org/TR/SVG11/feature#Extensibility" style="overflow:visible;text-align:left"><div xmlns="http://www.w3.org/1999/xhtml" style="display: flex; align-items: unsafe center; justify-content: unsafe center; width: 1px; height: 1px; padding-top: 237px; margin-left: 260px;"><div data-drawio-colors="color: rgb(0, 0, 0); background-color: rgb(255, 255, 255); " style="box-sizing: border-box; font-size: 0px; text-align: center;"><div style="display: inline-block; font-size: 14px; font-family: Helvetica; color: rgb(0, 0, 0); line-height: 1.2; pointer-events: all; background-color: rgb(255, 255, 255); white-space: nowrap;">e</div></div></div></foreignObject><image x="256" y="229" width="8" height="20.5" xlink:href="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAABSCAYAAAA1kNY+AAAAAXNSR0IArs4c6QAABFBJREFUaEPtWVkofV8U/q4hSqYMmTKVyJBMD5I3MqYMRfJgSMoDD0gkJYlQxJtkeEEyZXjhyRAyhwwlUzJmSqSQf+vUvf+7nXPv71zRr1/t9XLrnLX2+s63117r213F5+fnJ/6iKTgAzgBngDPAGeAMcAY4A5wBzsA/x8D29jYODg5wdXWFu7s7mJqawtbWFi4uLggODoa+vr5OGluWKt7b20NzczMmJiZwdnamMYGFhQUiIiJQUFCA8PBwWUC0Ari5uUF5eTk6Ozvx8fEha0GlU3R0NFpaWuDh4aE1TiMA+urY2FgcHR3plFjd2dLSEv39/QIrmkwSwOrqqhD08PAgGefp6Qk/Pz9QgqenJ5yenmJpaQnv7+8ifwMDAwwODiIhIUFyLREAShoQEIDj42MmgIorLy8PRUVFcHd3Fy32+PiI9vZ21NTU4P7+nnlvbm6O5eVlye0QAUhJSREQq5uNjY3wTE5hUZHS1m1tbTFrBAUFYWVlRQScAbC2tgZyVDcTExPMzs4KrMg1YoD8T05OmBA6RQRO3RgA6enp6O3tZRwaGhpQXFwsN7fKb3h4GElJSUwcMTgzMyMNgPaeqFYvJDMzM6HhGBsb6wyAbv1OTk44Pz9XxSoUClxfX8Pa2vr/Z8pWTPTEx8cziVJTU9HX16dzcmVAZmYmuru7mfihoSEkJiaKAZSVlaGuro5xrq6uRkVFxbcBNDY2oqSkhImnU0TPlaaqgaioKExOTn47mdzAtLQ0ps5UAKj66RT8tkVGRjIfqgLg5uYmaj6/ASYwMBDUaUVbQG1VU+v9SSD+/v7Y2NgQA7C3t8fl5SWTa2pqCr6+vj+ZH4aGhrCyshID8PHxwc7ODpNsbGxMdDR/FA0AVQ1Ql5qbm2PWJxFSWFj40zmlO2FOTg46OjqYl9QwqHH8pqkY6OrqQlZWFpOLJNbFxcW3WjEt1NTUhIWFBUEvurq6Cr+kI+hXdApI+UjN+ba2NuTm5upMwuvrK5ydnUGyTt2+biszDcPCwjA/P88EEPLNzU1B/epi9fX1KC0tZfdboRBErYODg5gBejIyMsIMCqUXtc+enh7QNJNju7u7CAkJwfPzM+OenJyMgYEB6SKkpzRCqSWvr6+L8mRkZAhFSudYmx0eHgp68quY1dPTE1SSt7e3ZgD0hi4ddMEgjffVvLy8hIkZFxcHEpvq9vLyIgCk6SkVW1lZiaqqKtGakqp4dHQUpA3f3t4kP5ZOR2hoKOzs7IT3pIoXFxdFlCuDY2JiMD4+DmLhq2m8F0xPT4P27Pb2Vs62a/QhWUb1Y2RkJOmj9WZE+0iCgpqRrn+s0Kmpra1Ffn6+1uKVdTek6dXa2irMcW13Q/pEurRQQ8vOzhY05p9MFgD1RejKtr+/LzQY2h46mlQTjo6OwtGjm7IupjMAXRaX48sBcAY4A5wBzgBngDMgT2fLmavf9OEAOAOcAc4AZ4Az8NcZ+A/iaIZhTTKx2wAAAABJRU5ErkJggg** "></image></switch></g></g></g></g></g></g></g></svg>
  </div>

  ```cpp
  semphore a1 = a2 = b1 = b2 = c = d = e = 0;

  S1() {                       S2() {
      ...;                         P(a1);
      V(a1); V(a2);                ...
  }                                V(b1); V(b2);
                               }

  S3() {                       S4() {     
      P(a2);                       P(b1); 
      V(e);                        V(c);  
  }                            }


  S5() {                       S6() {
      P(b2);                       P(c); P(d); P(e);
      V(d);                    }
  }
  ```

### 经典同步问题

#### 生产者——消费者问题

一组生产者和一组消费者围绕着一个货架工作，每次<u>只能有一个人操作货架</u>

生产者在**货架不满**时，将上架产品  
消费者在**货架不空**时，将拿走产品

<div>
<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="" height="" viewBox="-.5 -.5 446 293" content="&lt;mxfile host=&quot;Electron&quot; modified=&quot;2023-11-02T06:04:39.196Z&quot; agent=&quot;Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) draw.io/22.0.3 Chrome/114.0.5735.289 Electron/25.8.4 Safari/537.36&quot; etag=&quot;yNn2mvHMkkoyjVvvE2dS&quot; version=&quot;22.0.3&quot; type=&quot;device&quot;&gt;&lt;diagram name=&quot;Page-1&quot; id=&quot;kvo3RmFM5o9_kwuWurLc&quot;&gt;7VnJcts4EP0aHYXCvhxtx5nkkFQynqrMlSZhiTUUoSEhS87XT1MCRUK7bTkTu6wDRTaWBvq9B7ZaA3Y1WfxRJdPxF5fZYkBxthiwDwNKiWQcvhrLw8pijFkZRlWehU6d4Sb/aYMRB+ssz2wddfTOFT6fxsbUlaVNfWRLqsrN4253roi9TpOR3TLcpEmxbf2RZ37crg539k82H42DZxnsk6TtGgz1OMncvGdi1wN2VTnnV3eTxZUtmtC1UVmN+7indb2sypb+lAHOf76rv/79qU5+0Hp0/X3IP/8c6tUs90kxC9sNi/UP7f5h3dPmNkm9qwbscj7Ovb2ZJmljnAPmYBv7SQFPBG7v8qK4ckXTFUYzu/yAvfaV+8e2LaUrG2PwbitvF3u3RdbBAo5ZN7G+eoAuYcCQCIUkpxobQxQTgoU9BboNTYj/vAOPEwQDlMSMYaG0CE7HPRiFQJTBnCJcA4mTQKbReh1dxOEmBP0RAJgdAMjCN4F0EADg6yrQYP131lDl8q98AnKg+Kudw/VPN0nKrjGCrjU2Mw3rpbAuoAOR08WyazdIjsL30vNta/hWuWyW2qptgB3ebnYG22qlrXmDPoCsjxmSFPmohPsUELYNoxr8cxDcRWiY5FnWDL+sLKw6uV1OheF56vLSLxEQlwPxoZlr5t1qZ8upd5Ksz8hz8k5uEE1S1GdMy8Me71oq9onG8Asxqz0/X7G2iVHICI65EVoqJXUcccI5UpIYzNvr76x0Qn5nqV+5sp5N3qW+k4ZaIWGkFkZgThhoNqah2hC++J+FT48Lf1S52XRvaEIqFeDoUphHnI4KpKkF1YYK0KZuY9KelQSad4iuFzJwirhkhLcvdrUdQkI0woqAwkW4vlRIj0cUAlpmNgv0fdxBmiVW36VbpIYWmWp7e3cqjQ/QYT+5FRyRijCmOMFcakZjcmNEtWaaKE4BMWG2gGIGEcM410JgIznRYhuo5hzXXGiNIT/WRJMXwukE5r9anCgFnEAqUgFmkmH9inFibxcnxRDXSpF1yvGKYeJvFybKEWSVBgsINQNRkdcsJ3EcJ1tmF00xpEuMerjEIG6gRG4TYukulDCW1xcf1y1tdYSucbPZVmnliaj1Ai925FKtrbJF4vP72OmucAcP35oss0cKxGNSiHiG2s2q1IZB/VLL5jx7cpdALmjUxgA9OCYMcwwOYz8+qUbWb/lZcmMdlKfTRb7T5Xl0aQ+JI+nnmehyzM0Ls0W9s+U8h8vzUH4jZw85IadIZ9X9kjANfXrcSoukrvP0EL1isohn5BwH6bXnx++vIdKQMIkM1RzyC0GxlCRCeEgVWnOoucqnEWkoYR7d1d5k5IUT1C+8ESVPohFAmTz0uoUyz4G9Eoko6ZUAYzo3fO6XAPXhLRkBWZ+R0nCYU6uNyO3ZU6eA1erPq4cTcrd3PRzUAxEMTs6u1MTjn1wcztVeUX5j+pOPVSKAh10debMGyA6L7kxyIBojaZaaJ0JhyuXxre7dEdaIEdhIq4dYWUqg6G1En6MFeOz+6Fx17/4sZtf/AQ==&lt;/diagram&gt;&lt;/mxfile&gt;" style="background: 0px 0px; transition: none;"><defs></defs><g><path d="M10.36 55.24c0-22.1.0-33.14 20.71-33.14-13.81.0-13.81-22.1.0-22.1 13.81.0 13.81 22.1.0 22.1 20.72.0 20.72 11.04 20.72 33.14z" fill="#eee" stroke="none" pointer-events="all"></path><rect x="0" y="27.62" width="90" height="30" fill="none" stroke="none" pointer-events="all"></rect><g transform="translate(-0.5 -0.5)"><switch><foreignObject pointer-events="none" width="100%" height="100%" requiredFeatures="http://www.w3.org/TR/SVG11/feature#Extensibility" style="overflow:visible;text-align:left"><div xmlns="http://www.w3.org/1999/xhtml" style="display: flex; align-items: unsafe center; justify-content: unsafe center; width: 1px; height: 1px; padding-top: 43px; margin-left: 45px;"><div data-drawio-colors="color: rgb(0, 0, 0); " style="box-sizing: border-box; font-size: 0px; text-align: center;"><div style="display: inline-block; font-size: 12px; font-family: Helvetica; color: rgb(0, 0, 0); line-height: 1.2; pointer-events: all; white-space: nowrap;"><font style="font-size: 16px;" face="Times New Roman"><b>Producer</b></font></div></div></div></foreignObject><text x="45" y="46" fill="rgb(0, 0, 0)" font-family="Helvetica" font-size="12" text-anchor="middle">Producer</text></switch></g><path d="M365.95 290c0-22.1.0-33.14 20.72-33.14-13.81.0-13.81-22.1.0-22.1s13.81 22.1.0 22.1c20.71.0 20.71 11.04 20.71 33.14z" fill="#eee" stroke="none" pointer-events="all"></path><rect x="355.6" y="262.38" width="90" height="30" fill="none" stroke="none" pointer-events="all"></rect><g transform="translate(-0.5 -0.5)"><switch><foreignObject pointer-events="none" width="100%" height="100%" requiredFeatures="http://www.w3.org/TR/SVG11/feature#Extensibility" style="overflow:visible;text-align:left"><div xmlns="http://www.w3.org/1999/xhtml" style="display: flex; align-items: unsafe center; justify-content: unsafe center; width: 1px; height: 1px; padding-top: 277px; margin-left: 401px;"><div data-drawio-colors="color: rgb(0, 0, 0); " style="box-sizing: border-box; font-size: 0px; text-align: center;"><div style="display: inline-block; font-size: 12px; font-family: Helvetica; color: rgb(0, 0, 0); line-height: 1.2; pointer-events: all; white-space: nowrap;"><font style="font-size: 16px;" face="Times New Roman"><b>Consumer</b></font></div></div></div></foreignObject><text x="401" y="281" fill="rgb(0, 0, 0)" font-family="Helvetica" font-size="12" text-anchor="middle">Consumer</text></switch></g><rect x="264.69" y="85.55" width="39.19" height="97.98" fill="#dae8fc" stroke="#6c8ebf" pointer-events="all"></rect><rect x="215.69" y="85.55" width="39.19" height="97.98" fill="#dae8fc" stroke="#6c8ebf" pointer-events="all"></rect><rect x="166.7" y="85.55" width="39.19" height="97.98" fill="#dae8fc" stroke="#6c8ebf" pointer-events="all"></rect><rect x="117.71" y="85.55" width="39.19" height="97.98" fill="#dae8fc" stroke="#6c8ebf" pointer-events="all"></rect><path d="M95.66 75.26 313.68 75.75" fill="none" stroke="#006eaf" stroke-width="2" stroke-miterlimit="10" pointer-events="stroke"></path><path d="M93.21 193.33H313.68" fill="none" stroke="#006eaf" stroke-width="2" stroke-miterlimit="10" pointer-events="stroke"></path><path d="M313.68 193.33V75.75" fill="none" stroke="#006eaf" stroke-width="2" stroke-miterlimit="10" pointer-events="stroke"></path><path d="M31.07 62.14q20.72 48.34 31.07 58.69 10.36 10.36 24.14 10.36" fill="none" stroke="#6c8ebf" stroke-width="5" stroke-miterlimit="10" pointer-events="stroke"></path><path d="M94.53 131.19l-11 5.5 2.75-5.5-2.75-5.5z" fill="#6c8ebf" stroke="#6c8ebf" stroke-width="5" stroke-miterlimit="10" pointer-events="all"></path><path d="M321.07 138.1q27.62.0 41.43 13.8 13.81 13.81 19.19 62.2" fill="none" stroke="#6c8ebf" stroke-width="5" stroke-miterlimit="10" pointer-events="stroke"></path><path d="M382.6 222.3 375.92 211.98 381.69 214.1 386.85 210.76z" fill="#6c8ebf" stroke="#6c8ebf" stroke-width="5" stroke-miterlimit="10" pointer-events="all"></path></g><switch><g requiredFeatures="http://www.w3.org/TR/SVG11/feature#Extensibility"></g><a transform="translate(0,-5)" xlink:href="https://www.drawio.com/doc/faq/svg-export-text-problems" target="_blank"><text text-anchor="middle" font-size="10" x="50%" y="100%">Text is not SVG - cannot display</text></a></switch></svg>
</div>

可以分析出以下关系：

1. 货架满时，生产者等待消费者消费的**同步关系**
2. 货架空时，消费者等待生产者生成的**同步关系**
3. 消费者和生产者存在临界区**互斥关系**

```cpp
semaphore mutex = 1;          // 临界区互斥信号量
semaphore empty = n;          // 货架空位
semaphore full  = 0;          // 商品数量
```

```cpp
producer() {
    while (1) {
        P(empty)//等待空位置
        P(mutex)//判断互斥锁状态
        ....    //生产者上架
        V(mutex)//释放互斥锁
        V(full) //商品数量+1
    }
}
```

```cpp
consumer() {
    while (1) {
        P(full)
        P(mutex)
        ...     //消费货架商品
        V(mutex)              
        V(empty)//增加一个空货架
    }
}
```

---

1. 每类进程对应一个函数，内部进行事件完全一致为一类进程
2. 函数内，中文描述该函数的动作过程

    - 若为重复动作，加`while(1)`
3. 分析动作是否会消耗临界区资源，动作前加`P操作`，注意有P必有V
4. 定义信号量，及信号量初始值
5. 检查**连续P**是否可能导致死锁

小和尚、老和尚若干，小和尚提水入缸，老和尚饮用。水缸可容10桶水。共3个水桶。一个水井，每次只能一个桶取水。一个水缸，每次只能一个桶取水，入水取水不可同时进行。试给出有关从缸取水、入水的算法描述。

![image](assets/image-20251015162253-ge5rcda.png)

#### 读者——写者问题

读者写者两组并发进程，共享一个文件，读进程共享数据不会有问题，写进程和其他读写进程同时访问则可能导致数据不一致

有以下关系：

1. 读者与读者不互斥
2. 写者与写者**互斥**
3. 写者与读者**互斥**

---

方法1，读进程始终优先

使用`rw互斥信号量`实现读写互斥

使用`count公共计数变量`记录读进程数量，控制读进程对rw信号量的操作  
第一个读进程加锁，最后一个读进程读完解锁

为了避免读进程同时加锁rw导致读进程阻塞  
使用`mutex互斥信号量`控制同时只有一个读进程检查count的数量并加锁

![image](https://image-host-pkj.oss-cn-guangzhou.aliyuncs.com/20250801213533746.png)

---

方法2，先来先服务顺序服务

在方法一的基础上，增加一个`w互斥信号量`，使得当有写进程出现占用w时，新的读进程必须等待写进程完成操作，才能开始操作

![image](https://image-host-pkj.oss-cn-guangzhou.aliyuncs.com/20250801214617639.png)

#### 哲学家进餐问题

5 个哲学家围坐在圆桌旁，每个哲学家面前有一个碗和左手、右手各一只筷子（与相邻哲学家共享）**同时拿到两根筷子**才能进餐

![image](https://image-host-pkj.oss-cn-guangzhou.aliyuncs.com/image-20250802090332-b6varxp.png)

1. 死锁

    所有哲学家都拿起左边的筷子，等待右边的筷子，互相等待，永远无法进餐
2. 饥饿

    有些科学家总是拿不到筷子
3. 筷子为临界资源，多个哲学家争用共享的筷子，需合理安排访问顺序

---

哲学家问题本质为需要占用多种资源才能运行的问题  
只要每次拿资源都满足**要么一次满足要么不拿**即可保证不死锁

1. 定义信号量

    - 大锁`sm Lock=1;`
    - 用`int`定义资源和数量

      进餐问题每支筷子都各为一类资源，故五只筷子定义`int kz[4]={1,1,1,1,1}`
2. 取资源

    ```cpp
    while(1){
    	P(Lock);
    	if(所有资源都够){
    		所有资源减少所需值
    		取资源
    		V(Lock);
    		break;
    	}
    	V(Lock);	//资源不够，重复检查
    }
    ```
3. 进程进行任务
4. 归还所有资源

    ```cpp
    P(Lock);
    归还所有资源，int增加
    V(Lock);
    ```

### 管程

- **管程定义**

  <span data-type="text">本质上是一种 </span>​**对互斥 + 条件同步的高级封装机制**​<span data-type="text">，通过结构化编程方式将“对共享资源的访问”与“同步控制”统一封装成一个模块，提升了程序的安全性和可读性。</span>

  类似于面向对象编程思想
- **管程组成**

  1. **管程名称**
  2. 数据结构**初始化的语句**
  3. **共享数据结构**或**共享变量**
  4. 数据结构**操作函数**或**过程**
- **管程中设置的条件变量**

  若进程进入管程后被阻塞，若不释放管程，则其他进程在其**阻塞解除前无法进入**，<u>因此将阻塞原因定义为</u>​**<u>条件变量</u>**

  阻塞原因多样，故有多个条件变量，每个条件变量保存一个等待队列

  定义条件变量x

  - **x.wait()**

    **x条件不满足**，进程被阻塞时，调用，并将进程插入x条件的**阻塞队列**，释放管程
  - **x.signal()**

    x条件发生变化，**唤醒一个**因x条件阻塞的进程，加入就绪队列中

  - **与信号量的相似点**

    **类似于PV操作**，可以实现进程的阻塞、唤醒
  - **条件变量与信号量的不同点**

    条件变量没有值，**仅实现排队等待**，管程中使用共享数据记录剩余资源数目

    信号量有值，信号量的值反映剩余资源数目

## 死锁

### 死锁概念

- **死锁**

  多个进程<u>互相等待对方手里的资源</u>，使得都被阻塞，无外力干涉则都无法推进
- **死锁产生的充分条件**

  每种资源<u>只有一个</u>，且**资源请求出现了**​**环路**

  例如a占用打印机，b占用输入设备，此时a请求输入设备，b请求打印机，则ab进程将陷入死锁
- **死锁产生的必要条件**

  1. **互斥条件**

      多个线程不能同时使用同一个资源
  2. **不可剥夺条件**

      进程使用资源结束前不能被其他进程获取
  3. **请求并保持条件**

      进程持有资源1并请求被占用的资源2时，资源1不会被释放
  4. **循环等待条件**

      两个线程获取资源的顺序构成环形链
- **死锁产生的原因**

  1. **系统资源的竞争**

      系统拥有的<u>不可剥夺资源不足</u>以满足多进程运行需要

      只有对不可剥夺资源的竞争才可能产生死锁，可剥夺资源则不会
  2. **进程推进顺序非法**

      请求和释放资源的顺序不当，以及信号量使用不当
- **饥饿现象**

  指进程在信号量内**无穷等待**

  - **产生原因**

    资源分配时策略不公平，导致进程等待某种资源（可以是CPU）过久以至于给进程推进带来明显影响
- **死锁与饥饿比较**

  - **共同点**

    1. 进程无法顺利向前推进的现象
  - **不同点**

    1. 可以只有<u>一个进程发生饥饿</u>；死锁一定是<u>两个以上的进程</u>
    2. 饥饿进程<u>可能处于就绪态</u>，也可能<u>处于阻塞态</u>；**死锁**​<u>**必然处于阻塞态**</u>
- **死锁的处理策略**

  1. **死锁预防**
  2. **避免死锁**
  3. **死锁的检测及解除**

### 死锁预防

通过<u>破坏死锁产生的四个必要条件之一</u>预防死锁发生（提前消除死锁产生的环境）

1. **破坏互斥条件**

    将互斥资源**改造为允许共享**的资源

    <u>通常不可行</u>，且为了系统安全必须保护某些互斥性
2. **破坏不可剥夺条件**

    当请求不到新的资源时，使**进程必须**​<u>**释放保持的所有资源**</u>

    实现复杂。常用于<u>**状态易于保存和恢复的资源**</u>，如 <u>CPU 的寄存器及内存资源</u>

    容易增加系统开销，进而降低系统吞吐量
3. **破坏请求并保持条件**

    1. 采用<u>**预先静态分配法**</u>，即**一次性获取所有资源**

        实现简单，但容易严重浪费系统资源，容易导致饥饿现象
    2. 运行进程**只获得运行**​<u>**初期所需的资源**</u>便可以开始运行，在运行过程中逐步释放使用完毕的资源，并获得剩余所需
4. **破坏循环等待条件**

    采用**顺序资源分配法**

### 死锁避免

相比死锁预防的静态限制，死锁避免为运行时的检查，<u>判断请求是否导致死锁，是则拒绝请求</u>

银行家算法，防止资源分配后进入不安全状态

- **安全状态**：一定可以以一个顺序分配资源使得进程都能够顺利完成
- **不安全状态**：无法找到这样的序列
- **<u>不安全状态 ≠ 一定死锁</u>**，进程遇到意外情况导致提前完成也会释放资源

进程已占有的资源数与本次申请的资源数之和不超过对资源的最大需求量，且现存质源量能满足该进程尚需的最大资源量

只限制当前的如何分配策略，而**不事先决定整个分配顺序（为死锁预防的按序分配）**

### 死锁检测及解除

- **资源分配图**

  一个有向图，表示某时刻系统资源与进程之间的状态

  **圆圈**代表**进程**  
  **框**代表一类**资源，框中圈为资源数量**  
  进程->资源叫做**请求边**  
  资源->进程叫**分配边**

  ![image](assets/image-20240512195004-i2vu57f.png)

  资源点的出度表示已分配资源数量，当<u>资源点</u>​<u>**数量大于等于资源点出度**</u>时表示存在剩余资源
- **死锁定理**

  S为死锁的条件是，当且仅当S状态的**资源分配图是不可完全简化**的

  找出既不阻塞又非独立的进程点，去除其请求边和分配边成为孤立点（完成任务释放资源），最终所有进程都变成独立点
- **死锁解除**

  1. **资源剥夺法**

      抢占死锁进程资源，挂起死锁进程，但应防止被挂起进程长时间得不到资源
  2. **撤销进程法**

      强制撤销部分或全部死锁进程并剥夺资源，实现简单但代价可能很大
  3. **进程回退法**

      让死锁进程回退到足以回避死锁的地步，回退时进程自愿释放资源

      方法要求系统保持进程的历史信息，设置还原点

‍
