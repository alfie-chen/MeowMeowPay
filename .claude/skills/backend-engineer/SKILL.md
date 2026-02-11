---
name: be
description: Expert backend engineering guidance for API design, database architecture, system design, and code quality. Use this skill whenever users mention backend development, API design, server-side architecture, database optimization, microservices, code review, performance tuning, or ask for technical decisions about backend systems. Also trigger when users discuss RESTful APIs, GraphQL, SQL optimization, caching strategies, authentication, authorization, distributed systems, or want to refactor existing backend code. This skill helps with Node.js, Python, Java, Go, and other backend technologies.
---

# Senior Backend Engineer

## Overview

This skill provides expert-level backend engineering guidance across the full spectrum of server-side development: API design and implementation, database architecture and optimization, system design patterns, code quality assessment, and technical decision-making. It combines practical implementation advice with architectural thinking to help build scalable, maintainable, and performant backend systems.

## Core Capabilities

### 1. API Design & Development

When designing or implementing APIs, follow these principles:

#### REST API Design

- **Resource modeling**: Think in terms of resources (nouns), not actions. Use `/users`, `/orders`, not `/getUser`, `/createOrder`
- **HTTP methods semantically**:
  - GET: Retrieve (idempotent, no side effects)
  - POST: Create new resources
  - PUT: Replace entire resource
  - PATCH: Partial update
  - DELETE: Remove resource
- **Status codes matter**:
  - 200: Success with body
  - 201: Created (include `Location` header)
  - 204: Success, no content
  - 400: Client error (validation failed)
  - 401: Authentication required
  - 403: Forbidden (authenticated but not authorized)
  - 404: Not found
  - 409: Conflict (e.g., duplicate email)
  - 422: Unprocessable entity (semantic errors)
  - 500: Server error
- **Versioning**: Use URL versioning (`/api/v1/users`) for clarity, or header-based for cleaner URLs
- **Pagination**: Always paginate list endpoints using cursor-based (preferred for scale) or offset-based pagination
- **Filtering & sorting**: Support query parameters like `?status=active&sort=-createdAt`
- **Error responses**: Return consistent error structure:
  ```json
  {
    "error": {
      "code": "VALIDATION_ERROR",
      "message": "Invalid input data",
      "details": [{ "field": "email", "message": "Invalid email format" }]
    }
  }
  ```

#### GraphQL Design

- **Schema-first approach**: Design your schema before implementation
- **Avoid N+1 queries**: Use DataLoader pattern for batching
- **Input types for mutations**: Define clear input types, not loose arguments
- **Error handling**: Use unions or interfaces for typed errors
- **Depth limiting**: Protect against deeply nested queries
- **Pagination**: Use relay-style cursor pagination

#### API Documentation

- **OpenAPI/Swagger** for REST: Auto-generate from code annotations when possible
- **GraphQL introspection**: Leverage built-in schema documentation
- **Include examples**: Show request/response examples for common use cases
- **Authentication docs**: Clearly document how to authenticate (API keys, JWT, OAuth)

### 2. Database Design & Optimization

#### Schema Design Principles

- **Normalization vs denormalization**: Normalize to 3NF by default, denormalize strategically for read-heavy workloads
- **Primary keys**: Use auto-incrementing integers for internal IDs, UUIDs for distributed systems or external exposure
- **Foreign keys**: Always define them for referential integrity (even if using NoSQL references)
- **Indexes**: Index foreign keys, frequently queried columns, and columns used in WHERE/ORDER BY
- **Naming conventions**: Use snake_case for PostgreSQL/MySQL, clear descriptive names (`user_id`, not `uid`)

#### Query Optimization

- **EXPLAIN ANALYZE**: Always check query plans for slow queries
- **Avoid SELECT \***: Specify only needed columns
- **Index usage**: Ensure queries use indexes; watch for index scans vs seq scans
- **JOIN optimization**: Keep JOINs on indexed columns, limit JOIN depth
- **Batch operations**: Use batch inserts/updates instead of individual queries
- **Connection pooling**: Always use connection pools (pg-pool, HikariCP, etc.)

#### Database Selection Guide

- **PostgreSQL**: Default choice for most applications (ACID, JSON support, full-text search, great for complex queries)
- **MySQL/MariaDB**: When you need better replication, simpler setup
- **MongoDB**: Document-heavy data, flexible schema, rapid prototyping
- **Redis**: Caching, session storage, pub/sub, rate limiting
- **Elasticsearch**: Full-text search, log aggregation, analytics

#### Migrations

- **Version control**: All schema changes in migrations (Flyway, Liquibase, Alembic, Knex)
- **Reversible**: Write both up and down migrations when possible
- **Zero-downtime**: Use backward-compatible changes (add column as nullable, backfill, add constraint)
- **Data migrations**: Separate from schema migrations for large datasets

### 3. System Architecture & Design Patterns

#### Layered Architecture

- **Controllers**: Handle HTTP, validate input, call services
- **Services**: Business logic, orchestrate repositories
- **Repositories**: Data access layer, abstract database operations
- **Models/Entities**: Data structures, domain objects
- **Middleware**: Cross-cutting concerns (logging, auth, error handling)

#### Design Patterns

- **Repository pattern**: Abstract data access, enable testing
- **Dependency injection**: Invert dependencies, improve testability
- **Factory pattern**: Complex object creation
- **Strategy pattern**: Pluggable algorithms (payment methods, notification channels)
- **Decorator pattern**: Extend behavior (caching, logging)
- **Observer pattern**: Event-driven architecture

#### Microservices Considerations

- **When to use**: Large teams, independent deployment needs, different scaling requirements
- **Communication**: REST/gRPC for synchronous, message queues (RabbitMQ, Kafka) for async
- **Data management**: Each service owns its data, use events for cross-service data needs
- **Service discovery**: Use Consul, etcd, or Kubernetes DNS
- **API gateway**: Single entry point, handles routing, auth, rate limiting
- **Circuit breakers**: Prevent cascade failures (Hystrix, resilience4j)

#### Caching Strategy

- **Cache-aside**: Application checks cache, loads from DB on miss (most common)
- **Write-through**: Write to cache and DB simultaneously
- **Write-behind**: Write to cache, async write to DB (faster writes, risk of data loss)
- **What to cache**: Frequently read, rarely changed data; expensive computations
- **Invalidation**: Time-based (TTL), event-based (on update), or hybrid
- **Layered caching**: Client → CDN → App cache (Redis) → Database

#### Authentication & Authorization

- **JWT tokens**: For stateless auth, include minimal claims, short expiry
- **Refresh tokens**: Long-lived, stored securely, used to get new access tokens
- **OAuth 2.0**: For third-party integrations (Google, GitHub)
- **RBAC**: Role-based access control for permissions
- **Password hashing**: bcrypt or Argon2 (never MD5/SHA1)
- **Rate limiting**: Protect endpoints from abuse (by IP, by user)

### 4. Code Quality & Best Practices

#### Code Review Checklist

When reviewing backend code, check for:

**Correctness**

- Does it solve the problem correctly?
- Are edge cases handled?
- Are error cases properly handled?

**Security**

- Is user input validated and sanitized?
- Are SQL injection risks mitigated (use parameterized queries)?
- Are authentication/authorization checks in place?
- Are secrets kept out of code (use environment variables)?
- Is sensitive data encrypted at rest and in transit?

**Performance**

- Are database queries optimized?
- Is caching used appropriately?
- Are there N+1 query problems?
- Are large datasets paginated?
- Are background jobs used for slow operations?

**Maintainability**

- Is the code readable and well-structured?
- Are functions/methods focused on single responsibilities?
- Are there appropriate comments for complex logic?
- Are naming conventions consistent?
- Is there excessive code duplication?

**Testing**

- Are there unit tests for business logic?
- Are there integration tests for API endpoints?
- Are database operations tested?
- Is test coverage adequate (aim for 70%+ for critical paths)?

#### Error Handling Patterns

- **Fail fast**: Validate input early, return errors immediately
- **Specific exceptions**: Use custom exception types for different error categories
- **Logging**: Log errors with context (user ID, request ID, timestamp)
- **Don't expose internals**: Generic error messages to clients, detailed logs server-side
- **Graceful degradation**: Fallback behavior when dependencies fail

#### Performance Optimization

- **Profile first**: Use profilers to find actual bottlenecks (don't guess)
- **Database optimization**: Usually the bottleneck; optimize queries before code
- **Async operations**: Use async/await for I/O-bound operations
- **Background jobs**: Move slow tasks (emails, reports) to job queues
- **Caching**: Add caching layers strategically
- **Compression**: Enable gzip/brotli for API responses
- **CDN**: Serve static assets via CDN

#### Testing Strategy

- **Unit tests**: Test business logic in isolation (services, utilities)
- **Integration tests**: Test API endpoints, database operations
- **Contract tests**: For microservices, ensure API contracts are maintained
- **Load testing**: Use tools like k6, Apache JMeter for performance testing
- **Test data**: Use factories/fixtures for consistent test data
- **Mocking**: Mock external services, use real database for integration tests

### 5. Technical Decision Making

When faced with technical decisions, consider:

#### Evaluation Framework

1. **Requirements**: What problem are we solving? What are the constraints?
2. **Trade-offs**: What are we optimizing for? (performance, maintainability, cost, time-to-market)
3. **Options**: What are the viable alternatives?
4. **Risks**: What can go wrong? What are the mitigation strategies?
5. **Future**: How does this scale? How easy is it to change later?

#### Common Decisions

**Monolith vs Microservices**

- Start with monolith: Simpler, faster development, easier testing
- Consider microservices when: Multiple teams, clear bounded contexts, different scaling needs
- Avoid premature microservices: Adds complexity, network overhead, debugging difficulty

**SQL vs NoSQL**

- Use SQL when: Complex queries, transactions, relational data, need for consistency
- Use NoSQL when: Flexible schema, horizontal scaling, simple key-value or document access
- Consider hybrid: PostgreSQL with JSONB gives you both

**Synchronous vs Asynchronous**

- Synchronous: Simple, easier to debug, good for user-facing operations needing immediate response
- Asynchronous: Better for long-running tasks, decouples services, handles traffic spikes
- Use async for: Email sending, report generation, data processing, notifications

**Build vs Buy**

- Build when: Core competency, specific requirements, need full control
- Buy when: Commodity feature, faster time-to-market, ongoing maintenance cost
- Examples to buy: Auth (Auth0), email (SendGrid), payments (Stripe), analytics (Segment)

## Implementation Examples

### Example 1: RESTful User Management API

**Task**: Design a user management API

**Response structure**:

````
API Design:
- POST /api/v1/users (create user)
- GET /api/v1/users/:id (get user)
- GET /api/v1/users (list users with pagination)
- PATCH /api/v1/users/:id (update user)
- DELETE /api/v1/users/:id (delete user)

Request validation:
- Email format, required fields
- Password strength requirements

Database schema:
```sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  name VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_users_email ON users(email);
````

Implementation considerations:

- Hash passwords with bcrypt
- Return 201 on creation with Location header
- Implement pagination with limit/offset
- Never return password_hash in responses
- Add rate limiting on registration endpoint

```

### Example 2: Database Query Optimization

**Task**: Optimize slow query for user posts

**Approach**:
```

1. Analyze current query:
   EXPLAIN ANALYZE SELECT \* FROM posts
   WHERE user_id = 123
   ORDER BY created_at DESC;

2. Issues identified:
   - Sequential scan (missing index)
   - SELECT \* fetching unnecessary columns

3. Optimization:
   - Add index: CREATE INDEX idx_posts_user_created
     ON posts(user_id, created_at DESC);
   - Specify columns: SELECT id, title, created_at FROM posts...
   - Add pagination: LIMIT 20 OFFSET 0

4. Verify improvement:
   - Re-run EXPLAIN ANALYZE
   - Check execution time reduction
   - Monitor production performance

```

### Example 3: Caching Strategy

**Task**: Reduce database load for product listings

**Solution**:
```

Caching layer:

1. Cache product list in Redis with 5-minute TTL
2. Cache individual products with 15-minute TTL
3. Invalidate on updates:
   - When product updated → clear specific product cache
   - When new product added → clear product list cache

Implementation pattern:

```javascript
async function getProduct(id) {
  const cacheKey = `product:${id}`;

  // Try cache first
  const cached = await redis.get(cacheKey);
  if (cached) return JSON.parse(cached);

  // Cache miss - fetch from database
  const product = await db.products.findById(id);

  // Store in cache
  await redis.setex(cacheKey, 900, JSON.stringify(product));

  return product;
}
```

Trade-offs:

- Reduced DB load (80% cache hit rate expected)
- Slight data staleness (acceptable for product data)
- Additional Redis infrastructure needed

```

## Common Patterns by Technology Stack

### Node.js/TypeScript
- **Framework**: Express for simplicity, NestJS for larger apps with DI
- **ORM**: Prisma (modern, type-safe), TypeORM (feature-rich)
- **Validation**: Zod, Joi for runtime validation
- **Testing**: Jest for unit/integration, Supertest for API testing
- **Structure**: Controllers → Services → Repositories

### Python
- **Framework**: FastAPI (modern, async, auto-docs), Django (batteries-included)
- **ORM**: SQLAlchemy (SQL), Django ORM, Tortoise (async)
- **Validation**: Pydantic (with FastAPI), Marshmallow
- **Testing**: pytest, unittest
- **Structure**: Routes → Services → Models

### Java/Kotlin
- **Framework**: Spring Boot (industry standard)
- **ORM**: JPA/Hibernate
- **Validation**: Bean Validation (JSR-303)
- **Testing**: JUnit, Mockito, TestContainers
- **Structure**: Controllers → Services → Repositories → Entities

## Decision Trees

### When to Optimize
```

Is there a performance problem?
├─ No → Don't optimize (premature optimization is the root of all evil)
└─ Yes → Is it impacting users?
├─ No → Monitor, don't optimize yet
└─ Yes → Profile to find bottleneck
├─ Database → Optimize queries, add indexes, consider caching
├─ API → Add caching, async processing, rate limiting
└─ Code → Profile code, optimize hot paths

```

### When to Refactor
```

Is the code working correctly?
├─ No → Fix bugs first
└─ Yes → Is it hard to maintain/extend?
├─ No → Don't refactor
└─ Yes → Do you have tests?
├─ No → Write tests first
└─ Yes → Refactor with confidence
→ Extract functions/classes
→ Remove duplication
→ Improve naming
→ Simplify complex logic

```

## Working Approach

When helping with backend engineering tasks:

1. **Understand the context**: Ask about existing architecture, constraints, scale, team size
2. **Clarify requirements**: What problem are we solving? What are success criteria?
3. **Consider trade-offs**: Explicitly discuss pros/cons of different approaches
4. **Provide concrete examples**: Show code snippets, schema designs, API structures
5. **Think about scale**: Will this work at 10x the current load?
6. **Security first**: Always consider security implications
7. **Maintainability matters**: Code is read more than written
8. **Test coverage**: Suggest testing approaches for the solution
9. **Documentation**: Recommend what documentation is needed

## Resources

For complex scenarios, this skill can reference:

### references/
- `database_patterns.md` - Advanced database design patterns and normalization guides
- `api_best_practices.md` - Detailed API versioning, security, and design guidelines
- `scalability_checklist.md` - System design checklist for high-scale applications

### scripts/
- `generate_migration.py` - Template generator for database migrations
- `api_scaffold.py` - Scaffold REST API boilerplate code

These resources are available when deeper technical details are needed beyond the core guidance provided above.
```
