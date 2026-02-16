---
name: fe
description: Comprehensive frontend development assistance for building web applications, UI components, and debugging frontend issues. Use this skill whenever the user mentions building websites, web apps, React components, Vue applications, UI components, frontend bugs, styling issues, responsive design, state management, routing, forms, or any web development task. Even if they just say "build a dashboard" or "create a login page" or "fix this CSS", this skill should trigger. Also use for setting up build tools like Vite or webpack, configuring TypeScript, or any frontend tooling.
---

# Frontend Engineer

## Overview

This skill enables Claude to build production-quality web applications and components using modern frontend technologies. It covers the full spectrum of frontend development: building complete applications from scratch, creating reusable UI components, debugging issues, optimizing performance, and ensuring accessibility.

The skill adapts to user expertise level - providing educational context for beginners while executing quickly for experienced developers.

## Core Principles

Every frontend solution should follow these principles:

1. **Accessibility First**: All interactive elements must be keyboard accessible with proper ARIA labels and semantic HTML
2. **Responsive by Default**: Code should work across device sizes without being asked
3. **Modern Patterns**: Use current best practices (hooks over classes, composition over inheritance)
4. **Production Ready**: Code should be clean, maintainable, and follow established conventions
5. **Progressive Enhancement**: Start with working HTML, enhance with CSS, then JavaScript

## Workflow Decision Tree

Start here to determine the right approach:

```
Is this a new project or working with existing code?
├─ New project
│  ├─ Framework specified? → Use that framework
│  ├─ Simple/static? → Vanilla HTML/CSS/JS
│  ├─ Interactive app? → Suggest React (most common) or ask preference
│  └─ Output: Create full project structure in /sessions/hopeful-lucid-edison/mnt/outputs/frontend-projects/<project-name>/
│
├─ Existing code
│  ├─ User uploaded files? → Analyze structure, match their patterns
│  ├─ Bug/issue? → Debug workflow (see Debugging section)
│  └─ Adding feature? → Component workflow (see Building Components)
│
└─ Component/feature only
   └─ Create standalone component with usage example
```

## Setting Up Projects

### Project Structure

When creating a new project, use this structure:

```
project-name/
├── index.html           # Entry point
├── package.json         # Dependencies (if using npm)
├── vite.config.js       # Build config (if using Vite)
├── src/
│   ├── main.js/tsx      # App initialization
│   ├── App.js/tsx       # Root component
│   ├── components/      # Reusable components
│   │   ├── Button/
│   │   │   ├── Button.tsx
│   │   │   ├── Button.css
│   │   │   └── index.ts
│   │   └── ...
│   ├── pages/           # Page components (if routing)
│   ├── hooks/           # Custom React hooks
│   ├── utils/           # Helper functions
│   ├── styles/          # Global styles
│   │   ├── reset.css
│   │   └── variables.css
│   └── assets/          # Images, fonts
├── public/              # Static files
└── README.md            # Setup instructions
```

### Technology Selection

**React projects** (most common):

- Use Vite for build tool (faster than CRA)
- TypeScript by default unless user prefers JS
- Functional components with hooks only
- Use modern patterns: `useState`, `useEffect`, `useCallback`, `useMemo`, custom hooks

**Vue projects**:

- Use Vite
- Vue 3 with Composition API
- `<script setup>` syntax for cleaner code
- TypeScript recommended

**Vanilla projects**:

- No build step needed for simple sites
- Use ES6 modules if complexity warrants it
- Consider adding Vite for development server even without frameworks

### Initial Setup Steps

1. **Create project directory** in `/sessions/hopeful-lucid-edison/mnt/outputs/frontend-projects/<project-name>/`
2. **Generate package.json** with appropriate dependencies
3. **Create index.html** as entry point
4. **Set up build configuration** (vite.config.js or similar)
5. **Create basic file structure** with placeholder components
6. **Add README.md** with clear setup and run instructions

**Example package.json for React + Vite + TypeScript:**

```json
{
  "name": "project-name",
  "private": true,
  "version": "0.1.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0"
  },
  "devDependencies": {
    "@types/react": "^18.2.0",
    "@types/react-dom": "^18.2.0",
    "@vitejs/plugin-react": "^4.0.0",
    "typescript": "^5.0.0",
    "vite": "^4.4.0"
  }
}
```

## Building Components

### Component Checklist

Every component should have:

- [ ] **TypeScript types** for props (or PropTypes if JavaScript)
- [ ] **Accessibility**: ARIA labels, semantic HTML, keyboard navigation
- [ ] **Responsive design**: Works on mobile, tablet, desktop
- [ ] **Error states**: Handle loading, error, empty states
- [ ] **Clear prop interface**: Document what props do
- [ ] **Styles**: Co-located CSS or styled-components
- [ ] **Usage example**: Show how to use the component

### React Component Pattern

```tsx
// components/Button/Button.tsx
import { ButtonHTMLAttributes } from "react";
import "./Button.css";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "danger";
  size?: "small" | "medium" | "large";
  isLoading?: boolean;
}

export function Button({
  variant = "primary",
  size = "medium",
  isLoading = false,
  children,
  disabled,
  ...props
}: ButtonProps) {
  return (
    <button
      className={`btn btn--${variant} btn--${size}`}
      disabled={disabled || isLoading}
      aria-busy={isLoading}
      {...props}
    >
      {isLoading ? (
        <>
          <span className="btn__spinner" aria-hidden="true" />
          <span className="sr-only">Loading...</span>
        </>
      ) : (
        children
      )}
    </button>
  );
}
```

### Vue Component Pattern

```vue
<!-- components/Button.vue -->
<script setup lang="ts">
interface Props {
  variant?: "primary" | "secondary" | "danger";
  size?: "small" | "medium" | "large";
  isLoading?: boolean;
}

withDefaults(defineProps<Props>(), {
  variant: "primary",
  size: "medium",
  isLoading: false,
});
</script>

<template>
  <button
    :class="['btn', `btn--${variant}`, `btn--${size}`]"
    :aria-busy="isLoading"
    :disabled="isLoading"
  >
    <span v-if="isLoading" class="btn__spinner" aria-hidden="true" />
    <span v-if="isLoading" class="sr-only">Loading...</span>
    <slot v-else />
  </button>
</template>

<style scoped>
/* Component styles */
</style>
```

### Common Patterns

**Form handling**:

```tsx
function LoginForm() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Validate
      const newErrors = validateForm(formData);
      if (Object.keys(newErrors).length > 0) {
        setErrors(newErrors);
        return;
      }

      // Submit
      await submitForm(formData);
    } catch (error) {
      setErrors({ general: "Something went wrong" });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} noValidate>
      {/* Form fields with error handling */}
    </form>
  );
}
```

**Data fetching**:

```tsx
function useUsers() {
  const [data, setData] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    fetch("/api/users")
      .then((res) => res.json())
      .then(setData)
      .catch(setError)
      .finally(() => setIsLoading(false));
  }, []);

  return { data, isLoading, error };
}
```

## Debugging Frontend Issues

### Debugging Workflow

1. **Understand the problem**
   - What's the expected behavior?
   - What's actually happening?
   - When does it occur? (specific conditions, user actions)
   - Browser/device information if relevant

2. **Locate the issue**
   - Component hierarchy: which component has the problem?
   - State flow: is state being updated correctly?
   - Props: are props being passed correctly?
   - Network: check API calls and responses

3. **Common issue patterns**

**Styling issues**:

- Check CSS specificity and cascade order
- Verify responsive breakpoints
- Look for flexbox/grid misconfigurations
- Check for conflicting styles

**State issues**:

- Verify state updates are immutable
- Check for stale closures in useEffect
- Ensure proper dependency arrays
- Look for race conditions

**Performance issues**:

- Use React DevTools Profiler
- Check for unnecessary re-renders
- Memoize expensive calculations
- Lazy load components/routes

**Accessibility issues**:

- Run keyboard navigation test
- Check ARIA labels and roles
- Verify semantic HTML structure
- Test with screen reader if possible

4. **Fix and verify**
   - Implement the fix
   - Test the specific issue
   - Check for regressions
   - Document the fix if it's non-obvious

## Accessibility Guidelines

Accessibility is not optional. Every component must be accessible because it's the right thing to do and because it makes the product better for everyone.

### Essential Accessibility Practices

**Keyboard Navigation**:

- All interactive elements must be keyboard accessible
- Visible focus indicators on all focusable elements
- Logical tab order (use tabindex=0 or -1, avoid positive values)
- Escape key closes modals/dropdowns
- Arrow keys for navigation in lists/menus

**Semantic HTML**:

```html
<!-- Good: Semantic elements convey meaning -->
<nav>
  <ul>
    <li><a href="/">Home</a></li>
  </ul>
</nav>

<!-- Bad: Divs require extra ARIA -->
<div class="nav">
  <div class="nav-item" onclick="navigate()">Home</div>
</div>
```

**ARIA Labels**:

- Use `aria-label` for elements without visible text
- Use `aria-labelledby` to reference existing text
- Use `aria-describedby` for additional context
- Mark decorative images with `alt=""` or `aria-hidden="true"`
- Use `role` when semantic HTML isn't available

**Form Accessibility**:

```tsx
<label htmlFor="email">Email</label>
<input
  id="email"
  type="email"
  aria-required="true"
  aria-invalid={!!errors.email}
  aria-describedby={errors.email ? "email-error" : undefined}
/>
{errors.email && (
  <span id="email-error" role="alert">
    {errors.email}
  </span>
)}
```

**Screen Reader Support**:

- Use `aria-live` for dynamic content updates
- Use `role="status"` for non-critical updates
- Use `role="alert"` for important messages
- Hide decorative elements with `aria-hidden="true"`
- Provide skip links for navigation

### Common Accessibility Patterns

**Modal Dialog**:

```tsx
function Modal({ isOpen, onClose, title, children }) {
  useEffect(() => {
    if (isOpen) {
      // Trap focus in modal
      const focusableElements = modalRef.current.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
      );
      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];

      firstElement?.focus();

      // Handle escape key
      const handleEscape = (e: KeyboardEvent) => {
        if (e.key === "Escape") onClose();
      };
      document.addEventListener("keydown", handleEscape);

      return () => document.removeEventListener("keydown", handleEscape);
    }
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      className="modal-overlay"
    >
      <div className="modal-content">
        <h2 id="modal-title">{title}</h2>
        {children}
        <button onClick={onClose} aria-label="Close dialog">
          ×
        </button>
      </div>
    </div>
  );
}
```

**Loading States**:

```tsx
<button disabled={isLoading} aria-busy={isLoading}>
  {isLoading ? (
    <>
      <span className="spinner" aria-hidden="true" />
      <span className="sr-only">Loading...</span>
    </>
  ) : (
    "Submit"
  )}
</button>
```

## Styling Best Practices

### CSS Organization

Use this hierarchy for styling:

1. **Reset/Normalize** - Browser default normalization
2. **CSS Variables** - Design tokens (colors, spacing, typography)
3. **Global Styles** - Base element styles
4. **Component Styles** - Scoped to individual components
5. **Utility Classes** - Single-purpose classes (optional, if using Tailwind-like approach)

### Modern CSS Patterns

**CSS Variables for theming**:

```css
:root {
  /* Colors */
  --color-primary: #007bff;
  --color-primary-hover: #0056b3;
  --color-text: #212529;
  --color-background: #ffffff;

  /* Spacing */
  --spacing-xs: 0.25rem;
  --spacing-sm: 0.5rem;
  --spacing-md: 1rem;
  --spacing-lg: 1.5rem;
  --spacing-xl: 2rem;

  /* Typography */
  --font-family-base: system-ui, -apple-system, sans-serif;
  --font-size-base: 1rem;
  --line-height-base: 1.5;

  /* Breakpoints (for reference in media queries) */
  --breakpoint-sm: 640px;
  --breakpoint-md: 768px;
  --breakpoint-lg: 1024px;
}
```

**Flexbox for layouts**:

```css
.container {
  display: flex;
  gap: var(--spacing-md);
  flex-wrap: wrap;
  align-items: center;
}
```

**Grid for complex layouts**:

```css
.grid-layout {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: var(--spacing-lg);
}
```

**Responsive design**:

```css
/* Mobile first approach */
.card {
  padding: var(--spacing-md);
}

@media (min-width: 768px) {
  .card {
    padding: var(--spacing-lg);
  }
}
```

## State Management

### When to Use What

**Local state (useState)**:

- Component-specific data
- UI state (open/closed, active tab)
- Form inputs
- Simple counters or toggles

**Context (React.createContext)**:

- Theme preferences
- User authentication
- Language/locale
- Data needed by many components at different nesting levels

**External state library (Zustand, Redux, etc.)**:

- Complex application state
- State shared across many unrelated components
- State that needs to persist
- State with complex update logic

### Context Pattern

```tsx
// contexts/AuthContext.tsx
interface AuthContextType {
  user: User | null;
  login: (credentials: Credentials) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for existing session
    checkAuth()
      .then(setUser)
      .finally(() => setIsLoading(false));
  }, []);

  const login = async (credentials: Credentials) => {
    const user = await authAPI.login(credentials);
    setUser(user);
  };

  const logout = () => {
    authAPI.logout();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
}
```

## Performance Optimization

### Common Performance Issues

**Unnecessary re-renders**:

```tsx
// Bad: Creates new object on every render
<Component style={{ padding: 10 }} />;

// Good: Stable reference
const style = { padding: 10 };
<Component style={style} />;

// Use memo for expensive calculations
const expensiveValue = useMemo(() => calculateValue(data), [data]);

// Use callback for stable function references
const handleClick = useCallback(() => {
  doSomething(id);
}, [id]);
```

**Large lists**:

```tsx
// Use virtualization for long lists
import { FixedSizeList } from "react-window";

function VirtualizedList({ items }) {
  return (
    <FixedSizeList
      height={600}
      itemCount={items.length}
      itemSize={50}
      width="100%"
    >
      {({ index, style }) => <div style={style}>{items[index].name}</div>}
    </FixedSizeList>
  );
}
```

**Code splitting**:

```tsx
// Lazy load routes
const Dashboard = lazy(() => import("./pages/Dashboard"));
const Settings = lazy(() => import("./pages/Settings"));

function App() {
  return (
    <Suspense fallback={<Loading />}>
      <Routes>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/settings" element={<Settings />} />
      </Routes>
    </Suspense>
  );
}
```

## Output Format

After creating or modifying frontend code:

1. **Create all files** in proper structure
2. **Provide setup instructions** in README.md
3. **Show file structure** with tree view
4. **Give next steps**: How to run, build, deploy
5. **Include computer:// links** to key files

**Example output message**:

> I've created a React + TypeScript dashboard application with user authentication, data visualization, and responsive design. The project includes:
>
> - Modern React patterns (hooks, context, custom hooks)
> - Full TypeScript coverage
> - Accessible components with ARIA labels
> - Responsive design (mobile, tablet, desktop)
> - Vite for fast development
>
> [View the project](computer:///sessions/hopeful-lucid-edison/mnt/outputs/frontend-projects/dashboard/)
>
> To run:
>
> ```bash
> cd /sessions/hopeful-lucid-edison/mnt/outputs/frontend-projects/dashboard
> npm install
> npm run dev
> ```

## Adapting to User Expertise

**Detect expertise level** from context:

- Beginner: Asks basic questions, needs explanations
- Intermediate: Knows syntax, needs guidance on patterns
- Expert: Wants fast execution, minimal explanation

**For beginners**:

- Include code comments explaining why
- Add links to documentation
- Explain architectural decisions
- Provide learning resources

**For experts**:

- Focus on code quality and efficiency
- Use advanced patterns when appropriate
- Minimal explanation unless asked
- Offer optimization suggestions

## Common Scenarios

### "Build me a landing page"

1. Ask about: purpose, target audience, key sections
2. Create responsive HTML/CSS/JS structure
3. Include hero section, features, CTA, footer
4. Ensure accessibility and mobile-first design
5. Provide deployment options

### "Create a dashboard"

1. Ask about: data source, metrics to display, user roles
2. Set up React/Vue with routing
3. Create layout with sidebar navigation
4. Build data visualization components (charts, tables)
5. Add authentication if needed
6. Include loading and error states

### "Fix this bug"

1. Analyze uploaded code or described issue
2. Identify root cause
3. Explain what's wrong and why
4. Provide the fix with explanation
5. Suggest preventative measures

### "Add a feature"

1. Understand existing code structure
2. Match their coding patterns and style
3. Create new components following their conventions
4. Integrate with existing state/routing
5. Update related files (routes, types, etc.)

## Testing Guidance

When the user wants to test their code:

**Unit tests** (for utilities and hooks):

```tsx
// Use Vitest
import { render, screen } from "@testing-library/react";
import { Button } from "./Button";

test("Button renders with text", () => {
  render(<Button>Click me</Button>);
  expect(screen.getByText("Click me")).toBeInTheDocument();
});

test("Button calls onClick when clicked", () => {
  const handleClick = vi.fn();
  render(<Button onClick={handleClick}>Click me</Button>);
  screen.getByText("Click me").click();
  expect(handleClick).toHaveBeenCalledOnce();
});
```

**Integration tests** (for component interactions):

```tsx
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { LoginForm } from "./LoginForm";

test("Login form submits with valid credentials", async () => {
  const user = userEvent.setup();
  render(<LoginForm />);

  await user.type(screen.getByLabelText("Email"), "user@example.com");
  await user.type(screen.getByLabelText("Password"), "password123");
  await user.click(screen.getByRole("button", { name: /log in/i }));

  await waitFor(() => {
    expect(screen.getByText("Welcome!")).toBeInTheDocument();
  });
});
```

**E2E tests** (Feature verification):

- Focus on "Happy Paths" and critical user flows for the features being built.
- Use Playwright or Cypress to ensure the feature adheres to requirements before handover.
- For complex scenarios, regression suites, or test infrastructure, collaborate with QA/Test Engineer.

## Resources

This skill includes reference documentation and starter templates:

### references/

- `react-patterns.md` - Advanced React patterns and hooks
- `vue-patterns.md` - Vue 3 Composition API patterns
- `accessibility-checklist.md` - Comprehensive a11y checklist
- `performance-guide.md` - Detailed performance optimization strategies

### assets/

- `templates/react-vite-ts/` - React + Vite + TypeScript starter
- `templates/vue-vite-ts/` - Vue + Vite + TypeScript starter
- `templates/vanilla/` - Vanilla HTML/CSS/JS starter
- `components/` - Pre-built accessible component examples

These resources are loaded on-demand when relevant to the user's task.
