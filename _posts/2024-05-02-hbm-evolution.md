---
layout: single
title: "從 HBM1 到 HBM2：頻寬提升與容量擴張"
date: 2024-05-02 08:00:00 +0800
categories: [HBM]
tags: [HBM, HBM2, 頻寬]
author_profile: true
excerpt: "整理 HBM 初代與 HBM2 的規格差異，快速掌握升級重點。"
---

首代 HBM 強調低功耗與超寬匯流排，適合 GPU 與高階運算；HBM2 則在相同 1024-bit 介面下提升時脈，讓單堆疊頻寬突破 256 GB/s，並支援更高的 8-Hi 堆疊容量。

| 代際 | 最高堆疊 | 單堆疊頻寬 | 特點 |
| --- | --- | --- | --- |
| HBM | 4-Hi | ~128 GB/s | 低功耗、近距離封裝 |
| HBM2 | 8-Hi | ~256 GB/s | 更高時脈、容量翻倍 |

採用 HBM2 時，可搭配更寬的控制器通道或多顆堆疊以線性拉升系統頻寬，適用資料中心與 AI 訓練工作負載。
