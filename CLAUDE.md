# Simple TODO App

一个简单的个人任务管理器，用于提高日常工作效率。目标用户是需要管理日常任务的个人用户，解决任务组织和跟踪的问题。

## Tech Stack

- Node.js
- Express
- MongoDB
- React
- CSS3
- HTML5

## Functional Requirements

1. 添加新任务（包含标题）
2. 标记任务为完成/未完成状态
3. 删除任务
4. 按创建时间排序（最新优先）
5. 按状态筛选任务（全部/进行中/已完成）

## Non-functional Requirements

- 响应时间小于500毫秒
- 移动端响应式设计

## API Endpoints

| Method | Path | Description | Auth |
|--------|------|-------------|------|
| GET | /api/tasks | 获取所有任务，支持状态筛选 | No |
| POST | /api/tasks | 创建新任务 | No |
| PUT | /api/tasks/:id | 更新任务状态 | No |
| DELETE | /api/tasks/:id | 删除任务 | No |

## User Stories

### US001: 添加新任务
- **As a** 用户
- **I want** 添加新的待办任务
- **So that** 我可以记录需要完成的工作
- **Acceptance criteria:**
  - 可以输入任务标题
  - 任务自动标记为未完成状态
  - 新任务显示在列表顶部

### US002: 管理任务状态
- **As a** 用户
- **I want** 标记任务为完成或未完成
- **So that** 我可以跟踪任务进度
- **Acceptance criteria:**
  - 可以点击切换任务状态
  - 已完成任务有视觉区分
  - 状态变更立即生效

### US003: 删除任务
- **As a** 用户
- **I want** 删除不需要的任务
- **So that** 保持任务列表整洁
- **Acceptance criteria:**
  - 可以删除任何任务
  - 删除操作不可撤销
  - 删除后任务从列表消失

### US004: 筛选和排序
- **As a** 用户
- **I want** 筛选和排序任务
- **So that** 更好地组织和查看任务
- **Acceptance criteria:**
  - 可以按全部/进行中/已完成筛选
  - 任务按创建时间排序（最新优先）
  - 筛选结果实时更新

## Deployment


## Development Guide

- Implement features in user story order
- For each feature: API → Tests → Frontend
- Verify tests pass before moving to next feature

## Coding Standards

- Use TypeScript strict mode when applicable
- Error handling: try-catch + proper HTTP status codes
- Validation: always validate request parameters
- Testing: write tests for every module
- Security: prevent SQL injection, XSS, CSRF
- Create README.md with setup instructions
- Create .env.example with all required environment variables
- Create seed data script for database initialization
