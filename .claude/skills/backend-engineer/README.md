# Senior Backend Engineer Skill

一个资深后端工程师 AI Skill，提供专业的后端开发指导和最佳实践建议。

## 功能概述

这个 skill 涵盖后端工程的核心领域：

- **API 设计与开发**: REST/GraphQL API 设计模式、版本控制、错误处理、文档化
- **数据库设计与优化**: Schema 设计、查询优化、索引策略、迁移管理
- **系统架构设计**: 分层架构、微服务模式、缓存策略、认证授权
- **代码质量审查**: 安全性检查、性能优化、可维护性评估、测试覆盖
- **技术决策**: 技术选型框架、权衡分析、架构决策

## 支持的技术栈

- Node.js/TypeScript (Express, NestJS, Fastify)
- Python (FastAPI, Django, Flask)
- Java/Kotlin (Spring Boot)
- Go (Gin, Echo)
- 以及其他后端技术栈

## 自动触发场景

Skill 会在以下情况自动激活：
- 用户提到"后端"、"API"、"服务器端"、"微服务"
- 讨论数据库设计、SQL 优化、NoSQL
- 代码审查、重构、性能优化
- 缓存策略、分布式系统
- 认证、授权、安全性问题
- RESTful API、GraphQL 设计

## 文件结构

```
senior-backend-engineer/
├── SKILL.md              # Skill 主文件（AI 指令）
├── README.md             # 本说明文件
├── evals/                # 测试用例
│   └── evals.json        # 5 个典型后端场景测试
├── scripts/              # 辅助脚本（未来扩展）
├── references/           # 参考文档（未来扩展）
└── assets/               # 资源文件（未来扩展）
```

## 测试用例

包含 5 个测试场景验证 skill 性能：

1. **JWT 认证 API 设计** - 设计注册、登录、登出功能
2. **SQL 查询优化** - 分析和优化慢查询
3. **架构性能优化** - 解决 API 超时和扩展性问题
4. **安全代码审查** - 识别 SQL 注入、密码安全等问题
5. **数据库技术选型** - MongoDB vs PostgreSQL 对比分析

## 安装方法

### 方法 1: 使用 Skill 文件夹

1. 将整个 `senior-backend-engineer` 文件夹复制到您的 skills 目录：
   ```bash
   cp -r senior-backend-engineer ~/.claude/skills/
   ```

2. 重启 Claude 或重新加载 skills

### 方法 2: 使用 .skill 包文件

如果您有 `senior-backend-engineer.skill` 文件：
```bash
# 具体安装命令取决于您的 Claude 环境
```

## 使用示例

### 示例 1: API 设计咨询
```
用户: 我需要设计一个用户认证 API，包括注册、登录和登出功能。使用 JWT token。

Skill 会提供:
- 完整的 API 端点设计
- JWT token 结构和过期策略
- 密码哈希建议
- 安全最佳实践
- 数据库 schema
- 代码示例
```

### 示例 2: 性能优化
```
用户: 这个 SQL 查询很慢，帮我优化：
     SELECT * FROM orders JOIN users ON orders.user_id = users.id
     WHERE orders.status = 'pending' ORDER BY orders.created_at DESC LIMIT 20

Skill 会提供:
- 查询问题诊断
- 索引优化建议
- 重写的优化查询
- 性能验证方法
```

### 示例 3: 代码审查
```
用户: Review this Express.js code for security issues:
     [粘贴代码]

Skill 会识别:
- SQL 注入风险
- 密码存储问题
- 输入验证缺失
- 权限提升风险
- 并提供修复建议
```

## 设计理念

这个 skill 遵循以下原则：

1. **实用性优先**: 提供可直接应用的建议和代码示例
2. **安全第一**: 始终考虑安全影响
3. **权衡分析**: 明确讨论不同方案的利弊
4. **最佳实践**: 基于行业标准和生产经验
5. **可扩展性**: 考虑系统未来的增长需求

## 版本信息

- **Version**: 1.0.0
- **Created**: 2026-02-11
- **Language**: 中文/English（双语支持）

## 反馈与改进

如果您在使用过程中有任何建议或发现问题，欢迎提供反馈以帮助改进这个 skill。

## 许可

此 skill 仅供学习和参考使用。
