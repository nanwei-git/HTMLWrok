<!--
姓名：杨庆鸿 | 学号：24002120509
时间：2026-11-12 | 大模型：DeepSeek V4.1 Flash Free
-->

# 云栖数据工坊数据字典

## 订单明细表 yan_order_facts

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `yan_order_id` | VARCHAR(32) | 订单唯一编号 |
| `yan_user_id` | BIGINT | 用户编号 |
| `yan_channel` | VARCHAR(20) | 下单渠道：APP、小程序、门店 |
| `yan_order_amount` | DECIMAL(12,2) | 订单实付金额 |
| `yan_refund_status` | VARCHAR(20) | 退款状态 |
| `yan_created_at` | DATETIME | 下单时间 |

## 用户增长快照 yan_growth_snapshots

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `yan_snapshot_date` | DATE | 快照日期 |
| `yan_new_users` | INT | 当日新增用户 |
| `yan_active_users` | INT | 当日活跃用户 |
| `yan_retention_rate` | DECIMAL(5,4) | 次周留存率 |

## 数据质量规则

1. 订单主键必须唯一。
2. 支付金额不得为负数。
3. 手机号必须符合中国大陆号码格式。
4. 退款状态必须属于预定义枚举集合。
5. 商品类目与门店编码必须能在维表中找到映射。
