---
title: 408计组——4.指令系统
slug: 408-planning-4-the-instruction-system-23mvyh
url: /post/408-planning-4-the-instruction-system-23mvyh.html
date: '2024-09-10 13:39:42+08:00'
lastmod: '2024-09-11 22:23:26+08:00'
toc: true
tags:
  - '408'
  - 计算机组成原理
categories:
  - 提桶跑路笔记
keywords: 408,计算机组成原理
isCJKLanguage: true
---





## 指令系统

### 指令集体系结构（ISA）

ISA 规定内容主要包括：

1. 指令格式
2. 操作数类型
3. 程序可访问的寄存器编号、个数、位数，存储空间大小和编址方式
4. 指令执行过程的控制方式

### 指令的基本格式

指令基本结构包括**操作码**和**地址码**

【操作码】指令应该执行的操作

【地址码】给出被操作的信息的地址

* 按指令长度

  <u>指令长度与取指令的时间相关</u>，表示指令长度是机器字长的多少倍，单字长只需一次访存，双字长两次

  * 单字长指令
  * 双字长指令
  * 半字长指令
* 指令是否定长

  * 定长指令字结构：所有指令长度相等，速度快，控制简单
  * 变长指令字结构：指令长度随功能变化

#### 按地址码数目分类

1. **零地址指令**

   1. **不需要操作数**，如空操作、停机、关中断等指令
   2. **堆栈计算机**，两个操作数隐含存放在栈顶和次栈顶，计算结果压回栈顶
2. **一地址指令**

   1. 进⾏ **⾃身操作**的数(⽐如⾃增、⾃减、取反，求补)

      OP(A1)→A1、取指 → 读 A1→ 写 A1
   2. 需要两个操作数，但其中一个操作数**隐含在某个寄存器**（如隐含在 ACC）

      (ACC)OP(A1)→ACC、取指 → 读 A1
3. 二**地址指令**

   对两个数进⾏操作完后结果覆盖到原来的地址上的数

   (A1)OP(A2)---\>A1、取指 → 读 A1→ 读 A2→ 写 A1
4. **三地址指令**

   两个操作数的算术运算、逻辑运算相关指令

   (A1)OP(A2)→A3、取指 → 读 A1→ 读 A2→ 写 A3
5. **四地址指令**

   在三地址基础上，A4 表示下一条要执行的指令的地址

在指令总长度不变基础上，地址码数量越多，寻址能力越差

### 操作码指令格式

* 定长操作码

  操作码长度不变，可简化硬件设计，提高译码效率

  指令数量增加时会占用更多固定位，留给表示操作数地址的位数受限
* 可变长度操作码

  在指令字长有限的情况下保持比较丰富的指令种类

  增加译码难度，控制器设计复杂化

定长指令字结构 + 可变长度操作码 = 扩展操作码指令格式

---

* 扩展操作码指令格式设计

  1. 短码不能是长码前缀
  2. 操作码不能重复

​![image-20240901204732-32pleze](https://image-host-pkj.oss-cn-guangzhou.aliyuncs.com/image-20240901204732-32pleze.png)​

‍

### 指令的操作类型

1. **数据传送**

   MOV 寄存器之间传送

   LOAD 内存读入寄存器、STORE 寄存器写入内存

   PUSH 进栈、POP 出栈
2. **算术和逻辑运算**

   算术-----加、减、乘、除、增 1、减 1、求补、浮点运算、⼗进制运算

   逻辑-----与、或、⾮、异或、位操作、位测试、位清除、位求反

   移位操作---算术移位、逻辑移位、循环移位(带进位和不带进位)
3. **转移操作**

   * JMP 无条件转移
   * BRANCH 条件转移
   * CALL 调用

     转移操作不返回，调用操作需要结束后返回主程序
   * RET 返回
   * TRAP 陷阱
4. **输入输出操作**

   进⾏ CPU 和 I/0 设备之间的数据传送，传送控制命令和状态信息

## 指令的寻址方式

### 指令寻址

寻找下一条要执行的**指令地址，指令地址由 PC 给出**

1. **顺序寻址**

   程序计数器 PC 增加本条指令的指令字长，自动形成下一条指令的地址

   (PC) + “1” → PC ，其中 1 为一条指令字长，与指令长度，编址方式有关

   <span data-type="text" id="">主存按字节编址</span>，假设指令字长=存储字长=16bit=2B，则 PC+2

   主存按字编址，则 PC+1
2. **跳跃寻址**

   由转移指令指出 PC 的值，分为相对转移和绝对转移

   转移指令的执行结果为修改 PC 值，下条指令仍由 PC 指出

### ⭐ **数据寻址**

数据寻址就是确认本条指令的地址码的真实地址

#### 访问主存空间

1. **直接寻址**

   ​![image-20240903170543-tadnx66](https://image-host-pkj.oss-cn-guangzhou.aliyuncs.com/202409031705044.png)​

   * 地址码直接给出操作数内存地址
   * **访存**

     取指令 1 次，执⾏指令 1 次
   * **优点**

     简单，不需要专门计算操作数地址
   * **缺点**

     A 的位数决定了寻址范围，操作数地址不易修改
2. **间接寻址**

   ​![image-20240903170710-vvb2f5s](https://image-host-pkj.oss-cn-guangzhou.aliyuncs.com/202409031707314.png)​

   * 地址码给出的地址中指向其他主存地址
   * **访存**

     一次间址，取指令 1 次，执⾏指令 2 次
   * **优点**

     扩大寻址范围，便于编写子程序返回相关程序
   * **缺点**

     需要多次访存，速度慢，由存储字最高位确定访存次数
3. **隐含寻址**

   ​![image](https://image-host-pkj.oss-cn-guangzhou.aliyuncs.com/image-20240908110147-6l4s1n4.png)​

   * 不直接给出操作数的地址，⽽是在指令中就隐含操作数的地址
   * **访存**

     一次间址，取指令 1 次，执⾏指令 2 次
   * **优点**

     扩大寻址范围，便于编写子程序返回相关程序
   * **缺点**

     需要多次访存，速度慢，由存储字最高位确定访存次数
4. **立即寻址**

   * 形式地址 A 即操作数本身，一般使用补码，#表示立即寻址
   * **访存**

     取指令 1 次
   * **优点**

     指令执行时间最短
   * **缺点**

     A 的位数限制了立即数的范围

#### 访问寄存器空间

1. **寄存器寻址**

   ​![image](https://image-host-pkj.oss-cn-guangzhou.aliyuncs.com/202409091410211.png)​

   * 和直接寻址原理⼀样，只是把访问主存改为访问寄存器
   * **访存**

     取指令 1 次
   * **优点**

     简单，快速，支持向量运算，指令字短
   * **缺点**

     价格贵，寄存器个数有限
2. **寄存器间接寻址**

   ​![image](https://image-host-pkj.oss-cn-guangzhou.aliyuncs.com/202409091411690.png)​

   * 和访问主存的间接寻址原理相同，主存改为寄存器，寄存器内指向主存
   * **访存**

     取指令 1 次，执行指令 1 次
   * **优点**

     比一般间接寻址更快，但需要访问主存

#### 偏移寻址

1. **基址寻址**

   ​![image](https://image-host-pkj.oss-cn-guangzhou.aliyuncs.com/202409091520769.png)​

   * CPU 中基址寄存器 BR 的内容 + 形式地址 A＝ 有效地址

     或使用通用寄存器，但需要指定使用的通用寄存器

     即<u>相对于一个基地址进行偏移</u>
   * **优点**

     1. 扩大寻址范围
     2. 有利于多道程序设计
     3. 可用于编制浮动程序
2. **变址寻址**

   ​![image](https://image-host-pkj.oss-cn-guangzhou.aliyuncs.com/202409091527110.png)​

   * IX 寄存器用户可以修改，同样也可以分为专用 IX 寄存器和通用寄存器

     例：循环累加 A[0]~A[9]过程中，设定 A[0]为首地址，IX 在每次加法后 +1，即可依次得到数组地址
   * **优点**

     * 常用于有规律操作，如遍历
     * 变址寄存器作为偏移量可被改变
     * 形式地址 A 作为基地址保持不变
3. **相对寻址**

   ​![image](https://image-host-pkj.oss-cn-guangzhou.aliyuncs.com/202409091625053.png)​

   * 基址寻址的变种，将基址寄存器 BR 改为**程序计数器 PC**

     地址码 A 表示**相对 PC 的偏移量**，使用补码表示，可正可负
   * **优点**

     * 便于程序浮动
     * 广泛用于转移指令

#### 堆栈寻址

操作数存放在堆栈中，隐含的使⽤堆栈指针(SP)作为操作数地址

SP 指针指向栈顶的空单元

⼊栈，先压⼊数据，再修改指针
出栈，先修改指针，再弹出数据

堆栈可使用专门寄存器或直接使用主存

使用寄存器成本高速度快
使用主存成本低速度相对慢

## 程序的机器码表示

### 汇编指令

#### 相关寄存器

1. **通用寄存器**

    如`EAX`​，`EBX`​，`ECX`​，`EDX`​等

    E = Extended = **32bit**

    ​`EAX`​可拆分低两位字节为`AX`​，AX拆分高低字节分别为`AHAL`​

    ​![image](https://image-host-pkj.oss-cn-guangzhou.aliyuncs.com/image-20240910204944-iqbbqhw.png)​
2. **变址寄存器**

    ​`ESI`​、`EDI`​

    S=Source, D=Destination，I=Index

    固定使用**32bit**
3. **堆栈寄存器**

    ​`ESP`​、`EBP`​

    堆栈顶指针(Stack Pointer)、堆栈基指针(Base Pointer)

    固定使用**32bit**

#### 汇编指令格式

```x86asm
;操作码 + 地址码
mov byte ptr [var], 5
;var更换为真实内存地址
```

​`mov`​表示数据传送指令操作，`byte ptr [var], 5`​表示将常数5保存到var内存地址中

其中操作的地址码表示数据的来源，可以是**寄存器、主存、指令给出常量**（立即寻址）

1. **寄存器**：使用**寄存器名**如`EAX`​
2. **主存**：给出**读写长度和地址**

    dword ptr [地址]  #32bit  
    word ptr  [地址]  #16bit  
    byte ptr  [地址]  #8bit
3. **指令**：直接给出数值，使用16进制时使用h结尾

#### Intel与AT&T

​![image](https://image-host-pkj.oss-cn-guangzhou.aliyuncs.com/202409102110250.png)​

### 常用指令

下例中

* ​`<reg32>`​表示32位寄存器
* ​`<mem>`​表示内存地址，如`[var+4]`​、`[eax]`​、`dword ptr [eax+ebx]`​

  未标注长度默认32位
* ​`<con>`​表示常数

---

#### 数据传送指令

1. **mov**

    将第二个操作数复制到第一个操作数中

    ```x86asm
    ;不可两个操作数同时来自内存
    mov <reg>,<reg>
    mov <reg>,<mem>
    mov <mem>,<reg>
    mov <reg>,<con>
    mov <mem>,<con>

    mov eax,ebx             ;将ebx值复制到eax
    mov byte ptr [var], 5   ;将5保存到var值指示的内存地址的一字节中
    ```
2. **push**

    操作数压入栈中，常用于函数调用，入栈前将**ESP-4**

    ```x86asm
    push eax
    push [var]
    push 5
    ```
3. **pop**

    将操作数弹出后储存，出栈后**ESP+4**

    ```x86asm
    pop eax
    pop [var]
    ```

#### 算术和逻辑运算指令

1. **add/sub**

    两操作数相加减，保存到操作数1中

    ```x86asm
    add eax,10  ;eax寄存器值与10相加，保存到eax中
    ```
2. **inc/dec**

    自增，自减

    ```x86asm
    dec eax              ;eax寄存器自减1
    inc dword ptr [var]  ;内存地址4字节值自加1
    ```
3. **imul**

    有符号整数乘法，若溢出则置OF=1

    1. 两个操作数，第一个操作数**必须为寄存器**
    2. 三个操作数，23相乘保存到1,**1必须为寄存器**

    ```x86asm
    imul <reg32>,<reg32>
    imul <reg32>,<mem>
    imul <reg32>,<reg32>,<con>
    imul <reg32>,<mem>,<con>

    imul eax,[var]   ;eax<-eax*[var]
    imul esi,edi,25  ;esi<-edi*25
    ```
4. **idiv**

    有符号整数除法，唯一操作数为**除数**，被除数为**edx:eax**中内容，商送入`eax`​，余数送入`edx`​

    > 在进行除法时，被除数需要转换为64位字长，因此需要两个寄存器储存
    >

    ```x86asm
    idiv <reg32>
    idiv <mem>
    ```
5. **and/or/xor**

    与或异或，操作结果存放于操作数1
6. **not**

    位取反操作
7. **neg**

    取负操作
8. **shl/shr**

    逻辑左移，逻辑右移，操作数2表示移动位数

    ```x86asm
    shl <reg>,<con8>
    shl <mem>,<con8>
    shl <reg>,<cl>
    shl <mem>,<cl>
    ```

#### 控制流指令

一条指令被执行时，IP指针自动指向相邻的下一条指令

可以使用<u>控制流指令通过</u>​<u>**标签**</u>​<u>指示跳转位置</u>

<u>任何指令前都可以加入标签</u>

```x86asm
mov esi, [ebp+8]
begin: xor ecx, ecx
mov eax, [esi]
```

1. **jmp**

    控制IP跳转到指示主存地址

    ```x86asm
    jmp 128    ;<地址>可以用常数给出
    jmp eax    ;<地址>可以来自于寄存器
    jmp [999]  ;<地址>可以来自于主存
    jmp NEXT   ;<地址>可以用“标签”锚定
    ```
2. **j**​***condition***

    条件转移指令，通常需要与`cmp`​指令一起使用

    ```x86asm
    je <label>   ;(jump when equal)
    jz <label>   ;(jump when last result was zero)
    jne <label>  ;(jump when not equal)
    jg <label>   ;(jump when greater than)
    jge <1abel>  ;(jump when greater than or equal to)
    jl <1abel>   ;(jump when less than)
    jle <label>  ;(jump when less than or equal to)
    ;例如
    cmp eax,ebx  ;比较寄存器eax和ebx里的值
    jg NEXT      ;若eax>ebx,则跳转到NEXT:
    ```

    条件转移指令判断psw程序状态字寄存器中数值，因此需要先进行cmp
3. **cmp/test**

    cmp指令比较两个操作数大小，使用补码减法，只保存结果的标志位

    test指令对两个操作数进行与运算，只保存结果标志位

    ```x86asm
    cmp <reg>,<reg>
    cmp <reg>,<mem>
    cmp <mem>,<reg>
    cmp <reg>,<con>
    ```

    通常与2.配合使用
4. **call/ret**

    实现子程序调用和返回

    ```x86asm
    call <1abel>
    ret
    ```

    调用call指令会进行两步操作

    1. 将IP旧值压栈保存（`push IP`​）
    2. 将IP新值设置为被调用函数的第一条指令（`jmp <labal>`​）

    调用ret指令：在栈帧顶找到IP旧值，出栈并恢复IP寄存器

### 选择语句

​![image](https://image-host-pkj.oss-cn-guangzhou.aliyuncs.com/image-20240911151356-h0wlnct.png)​

cmp配合jxxx指令加上mov跳转，可以实现选择语句的分支结构

### 循环语句

​![image](https://image-host-pkj.oss-cn-guangzhou.aliyuncs.com/202409111526445.png)​

* **循环构成**

  1. 循环初始化
  2. 是否进入循环的判断
  3. 循环体
  4. 循环末尾判断是否继续下一次循环

可以使用loop指令代替末尾的下次循环判断，用于定次的循环

​![image](https://image-host-pkj.oss-cn-guangzhou.aliyuncs.com/202409111524228.png)​

### 过程调用

**函数栈帧（Stack Frame）：** 保存函数大括号内定义的**局部变量**、保存**函数调用相关的信息**

当前正在执行的函数位于栈顶，函数调用栈为一片内存区域

栈底位于高位，栈顶位于低位

在汇编语言中，函数名通常作为该函数在汇编语言中的**标记**，标注函数头

#### 访问栈帧数据

‍

​![image](https://image-host-pkj.oss-cn-guangzhou.aliyuncs.com/202409111610719.png)​

​`EBP`​指向当前栈帧**底部**​`ESP`​指向**顶部**

x86 系统中，默认以4字节为栈的操作单位

* 方法1

  * 移动`ESP`​指向压入后的栈帧顶部即-4，再往当前栈帧范围压入一个数值
  * 弹出则相反+4

```x86asm
push eax        ;将寄存器eax的值压栈
push 985        ;将立即数985压栈
push [ebp+8]    ;将主存地址[ebp+8]里的数据压栈
pop eax         ;栈顶元素出栈，写入寄存器eax
pop [ebp+8]     ;栈顶元素出栈，写入主存地址[ebp+8]，即修改栈帧数据
```

* 方法2

  * 使用mov指令结合`EBP`​和`ESP`​指针读取栈帧数据
  * 使用add/sub指令修改`ESP`​指向位置，修改4字节的倍数

```x86asm
sub esp,12          ;栈顶指针-12
mov [esp+8],eax     ;将eax的值复制到主存[esp+8]
mov [esp+4],958     ;将985复制到主存[esp+4]
mov eax, [ebp+8]    ;将主存[ebp+8]的值复制到eax
mov [esp],eax       ;将eax的值复制到主存[esp]
add esp,8           ;栈顶指针+8
```

#### 栈帧切换

调用函数时，使用call指令调用的函数，同时需要切换栈帧

被调用函数的开头会默认包含以下操作

```x86asm
push ebp		;保存上一层函数的栈帧基址（ebp旧值）,esp自动+4
mov ebp,esp		;设置当前函数的栈帧基址（ebp新值）,ebp指向esp所指位置
				;此时已进入新栈帧，以上两条指令可用enter代替
```

​![image](https://image-host-pkj.oss-cn-guangzhou.aliyuncs.com/202409112126942.png)​

每个栈帧底部用于保存上一层栈帧的基址

---

函数返回时，使用leave指令和ret指令

```x86asm
mov esp,ebp		;让esp指向当前栈帧的底部
pop ebp			;将esp所指元素出栈，写入寄存器ebp
				;可用leave代替以上指令
```

ret指令，从函数的栈帧顶部找到IP旧值，将其出栈并恢复IP寄存器

​![image](https://image-host-pkj.oss-cn-guangzhou.aliyuncs.com/202409112144911.png)​

函数框架图如下

​![image](https://image-host-pkj.oss-cn-guangzhou.aliyuncs.com/202409112152066.png)​

#### 栈帧包含内容

1. 编译器设置栈帧大小为16字节的倍数，栈帧内部可能存在未使用区域
2. 局部变量集中存储于栈帧底部
3. 调用参数集中存储于栈帧顶部
4. 栈帧最底部一定是ebp旧值
5. 栈帧最顶部一定是返回地址（正在执行函数栈帧除外）​

​![image](https://image-host-pkj.oss-cn-guangzhou.aliyuncs.com/202409112158278.png)​

​![image](https://image-host-pkj.oss-cn-guangzhou.aliyuncs.com/202409112159233.png)​

​![image](https://image-host-pkj.oss-cn-guangzhou.aliyuncs.com/202409112201722.png)​

> 调用其他函数前，如果有必要，可将某些寄存器(如:eax、edx、ecx)的值入栈放置于上图灰色区域保存，防止中间结果被破坏

​![image](https://image-host-pkj.oss-cn-guangzhou.aliyuncs.com/202409112205519.png)​

## CISC 和 RISC 的基本概念

* CISC：Complex Instruction Set Computer

  设计思路：一条指令完成一个复杂的基本功能，如x86架构
* RISC：Reduced Instruction Set Computer

  一条指令完成一个基本“动作”，多条指令组合完成一个复杂的基本功能，如ARM架构

​![image](https://image-host-pkj.oss-cn-guangzhou.aliyuncs.com/202409112221681.png)​

‍
