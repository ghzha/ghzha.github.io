---
title: 'IRRA论文笔记'
description: ''
pubDate: 'Mar 18 2024'
tags: ["深度学习"]
---
这周阅读论文《Cross-Modal Implicit Relation Reasoning and Aligning for Text-to-Image Person Retrieval》

行人搜索任务存在挑战：

1）模态/身份内差异(intra-identity)，即由于位姿，视点，光照等因素的不同，同一个人(indentity)具有不同的视觉外观，而文本描述也会因为语序和歧义而不同 

2）模态间异质性(modality heterogeneity)，即视觉-语言间的固有差异。为了解决这两个问题，现有工作的核心是表征学习，通过全局匹配(global match)和局部匹配(local match)**在联合嵌入空间中对齐跨模态特征**。然而，**大多数方法利用human segmentation, body parts, color information 和 text phrase 等需要显式提取的信息促进局部匹配，可能引入噪声和不确定性，并引入额外的计算开销。**因此，本文提出一种隐式的细粒度局部对齐方法，无需额外的监督和推理成本。具体而言，本文提出了Implicit Relation Reasoning (IRR) 模块，设计跨模态交互模块，并通过**MLM**代理任务隐式实现模态内和模态间的细粒度关系学习。同时，为了指导全局图文匹配，提出image-text similarity distribution matching (SDM) 损失，最小化图文相似度得分和GT分布（一个人可能对应多个图，因此GT中不仅是对角线的有值）间的KL散度（引入了温度超参数控制分布的紧凑性）。本文也利用CLIP初始化模型主干，并进行全微调。实现了全面的SOTA。

创新点：

1. 提出了一种跨模态隐式关系推理和对齐的方法
2. 提出了图像文本相似度分布匹配（SDM）损失。 

以前的方法：全局匹配方法通过设计跨模态匹配损失函数将图像和文本对齐到联合嵌入空间中。通过建立身体部位和文本实体之间的对应关系引入了局部匹配的实践。这篇论文计了一个隐式关系推理模块，该模块通过自注意力和交叉注意力机制有效地构建视觉和文本表示之间的关系。而不需要任何额外的监督和推理成本。

SDM 损失最小化了归一化图像文本相似度得分分布和归一化地面真值标签匹配分布之间的 KL 散度。利用对比语言图像预训练（CLIP）作为模型的初始化。



- 模型结构：CLIP backbone+4层跨模态交互模块（cross-attention+4层Transformer）

- Implicit Relation Reasoning（IRR, 模态间和模态内的隐式细粒度对齐

- 引入跨模态交互模块，multi-head cross attention（文本局部特征为Q，视觉局部特征为K，V）+4层随机初始化的Transformer

- 随机mask15%的文本token，其中80%为[mask], 10%为其他词，10%不变。

- 优化目标：恢复MASK的单词，即MLM任务，有助于对齐跨模态表征

- Similarity Distribution Matching (SDM, 全局图文匹配)

- 同一batch不同样本间的余弦相似度分布和真实图文对分布间的KL散度

  ```python
  # 真实图文配对分布，pid是person id，一个id可能对应多个图
  pid = pid.reshape((batch_size, 1)) # make sure pid size is [batch_size, 1]
  pid_dist = pid - pid.t()
  labels = (pid_dist == 0).float()
  .....
  .....
  labels_distribute = labels / labels.sum(dim=1)
  i2t_pred = F.softmax(image_proj_text, dim=1)
  ## KL散度, i2t_pred 是预测的分布，经过温度系数控制
  i2t_loss = i2t_pred * (F.log_softmax(image_proj_text, dim=1) - torch.log(labels_distribute + epsilon)) # KL divergence
  t2i_pred = F.softmax(text_proj_image, dim=1)
  t2i_loss = t2i_pred * (F.log_softmax(text_proj_image, dim=1) - torch.log(labels_distribute + epsilon))
   
  ```

  

- ID Loss (模态内紧凑性）确保同一id的图像或文本在嵌入空间中紧凑的聚合在一起

  ```python
  # self.classifier 转换特征维度到person id的个数，如11，003
  image_logits = self.classifier(i_feats.half()).float()
  text_logits = self.classifier(t_feats.half()).float()
  
  criterion = nn.CrossEntropyLoss(reduction="mean")
  # 拉近模态内同一id的表征
  loss = criterion(image_logits, labels) + criterion(text_logits, labels)
  ```

  优化目标：最终的优化目标为3个loss之和


IRR 旨在隐式地利用细粒度信息来学习有区别的全局表示。 SDM最小化图像文本相似度得分分布与真实标签匹配分布之间的KL散度，可以有效放大非匹配对之间的方差和匹配对之间的相关性。采用ID损失来聚合同一身份的特征表示，进一步提高检索性能。 

核心点在于提出了一个IRR模块，利用MLM任务隐式完成局部跨模态交互，无需显示提取局部特征进行对齐，本文指出其IRR模块只学习词级别而不是短语级别的信息，因此未来的工作还可以考虑到实现短语级别的对齐。

