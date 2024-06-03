---
title: 'Python函数的参数类型'
description: ''
pubDate: 'July 3 2024'
tags:
  - programming
  - Python
---

Python 函数的参数类型主要有以下几种：

1. **位置参数（Positional Arguments）**：
   - 按照参数在函数定义中的位置传递值。
   ```python
   def func(a, b):
       return a + b

   result = func(1, 2)  # 1 和 2 是位置参数
   ```

2. **关键字参数（Keyword Arguments）**：
   - 通过参数名传递值，可以不按照参数在函数定义中的位置传递。
   ```python
   def func(a, b):
       return a + b

   result = func(a=1, b=2)  # a 和 b 是关键字参数
   ```

3. **默认参数（Default Arguments）**：
   - 在函数定义时为参数指定默认值，调用函数时可以不传递这些参数。
   ```python
   def func(a, b=2):
       return a + b

   result = func(1)  # 这里 b 使用了默认值 2
   ```

4. **可变长度参数（Variable-length Arguments）**：
   - 用于接收任意数量的参数，有两种形式：
     - *args（可变位置参数）：接收任意数量的位置参数，并将其作为元组传递给函数。
     - **kwargs（可变关键字参数）：接收任意数量的关键字参数，并将其作为字典传递给函数。
   ```python
   def func(*args):
       return sum(args)

   result = func(1, 2, 3)  # args 是 (1, 2, 3)

   def func(**kwargs):
       return kwargs

   result = func(a=1, b=2)  # kwargs 是 {'a': 1, 'b': 2}
   ```

5. **仅限关键字参数（Keyword-only Arguments）**：
   - 定义在 `*` 之后的参数，必须通过关键字传递。
   ```python
   def func(a, *, b):
       return a + b

   result = func(1, b=2)  # b 必须作为关键字参数传递
   ```

6. **仅限位置参数（Positional-only Arguments）**（在 Python 3.8 及以上版本）：
   - 定义在 `/` 之前的参数，必须通过位置传递。
   ```python
   def func(a, b, /, c, d):
       return a + b + c + d

   result = func(1, 2, c=3, d=4)  # a 和 b 必须作为位置参数传递
   ```

通过这些参数类型，Python 函数可以实现灵活多变的参数传递方式，满足不同的需求。