---
name: react-builder
description: Build modern React applications with TypeScript, Tailwind CSS, and shadcn/ui components. Use for React components, pages, dashboards, and full applications with state management and routing.
---

# React Builder

Build powerful React applications using modern frontend technologies.

**Stack**: React 18 + TypeScript + Vite + Tailwind CSS + shadcn/ui

## Design & Style Guidelines

**IMPORTANT**: To avoid "AI slop", avoid using:
- Excessive centered layouts
- Purple gradients
- Uniform rounded corners
- Inter font everywhere

## Project Setup

### Initialize New React Project

```bash
npm create vite@latest my-app -- --template react-ts
cd my-app
npm install
```

### Add Tailwind CSS

```bash
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

Configure `tailwind.config.js`:
```js
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: { extend: {} },
  plugins: [],
}
```

### Add shadcn/ui

```bash
npx shadcn@latest init
npx shadcn@latest add button card dialog
```

## Component Patterns

### Functional Component Template

```tsx
import { useState } from 'react'

interface Props {
  title: string
  onAction?: () => void
}

export function MyComponent({ title, onAction }: Props) {
  const [state, setState] = useState(false)

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold">{title}</h2>
      <button onClick={onAction}>Action</button>
    </div>
  )
}
```

### Custom Hook Template

```tsx
import { useState, useEffect } from 'react'

export function useCustomHook<T>(initialValue: T) {
  const [value, setValue] = useState(initialValue)

  useEffect(() => {
    // side effects here
  }, [value])

  return { value, setValue }
}
```

## Best Practices

- Use TypeScript for type safety
- Prefer functional components with hooks
- Use React.memo() for expensive renders
- Keep components small and focused
- Use custom hooks for reusable logic
- Implement error boundaries for production
- Use React Query or SWR for data fetching
- Lazy load routes with React.lazy()

## State Management

For simple state: `useState`, `useReducer`, Context API

For complex state:
- Zustand (lightweight)
- Jotai (atomic)
- Redux Toolkit (enterprise)

## Testing

```bash
npm install -D vitest @testing-library/react @testing-library/jest-dom
```

```tsx
import { render, screen } from '@testing-library/react'
import { MyComponent } from './MyComponent'

test('renders title', () => {
  render(<MyComponent title="Hello" />)
  expect(screen.getByText('Hello')).toBeInTheDocument()
})
```

## Resources

- [React Docs](https://react.dev)
- [shadcn/ui](https://ui.shadcn.com)
- [Tailwind CSS](https://tailwindcss.com)
