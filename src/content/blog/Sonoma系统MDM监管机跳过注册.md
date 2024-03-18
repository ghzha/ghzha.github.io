---
title: 'MacOS Sonoma MDM监管机跳过注册'
description: 'MacOS Sonoma MDM监管机跳过注册方法'
pubDate: 'Mar 17 2024'
---
> 该方法出处：bilibili，[MacOS Sonoma MDM监管机跳过注册](https://www.bilibili.com/read/cv27632085/?spm_id_from=333.999.collection.opus.click) 作者：太阳还不困。在此做个备份。

前言 距离上次的教程已经有几个月,sonoma的正式版也已经推送一段时间了.本次就更新一下mdm机器在14系统跳过注册的方法.

之前的版本是12 激活时可以通过断网进桌面 然后使用屏蔽指令实现跳过

有些朋友可能是通过OTA到14 无痛跳过了

但是大版本更新我习惯DFU抹盘重装 本次升级14.1.1后发现 强制需要联网 


于是找到了这种使用脚本跳过的方法  步骤相对简单

此也是源自于上贴教程中 海外大神的楼中楼回复 

详见 https://gist.github.com/sghiassy/a3927405cf4ffe81242f4ecb01c382ac?permalink_comment_id=4706379#gistcomment-4706379




将Mac关机 然后长按电源键 选择 恢复模式


选择沙发浏览器 打开地址 skipmdm.com


翻到中间 点击网页中的 Copy AutoByPass (即复制指令到粘贴板

然后退出浏览器 ( 右上角退出 或使用command+Q



回到下图的页面 点击实用工具打开终端




按 command+v 将指令粘贴上去 并回车





此时输入1 回车




后面还需要填写三条信息

(可以直接按三次回车 开机密码就是1234  或者自定义

电脑的用户名 (默认为Apple 我这里写的是M1Mac14

用户的文件夹名(默认为Apple 我这里写了1234 其实写错了

用户的密码(默认为1234 密码如果定义了一定不要忘记了 否则GG

做好这一切就可以愉快玩耍了 

当然 信息填写错了 进入系统后再新增一个账户 也是可以的 
