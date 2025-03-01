# Frontend Documentation

## Overview

The BrickelaCuts frontend is built with React and TypeScript, utilizing modern web technologies for a responsive and interactive user experience. The application follows a component-based architecture with reusable UI components and custom hooks.

## Project Structure

```
src/
├── components/         # Reusable UI components
│   ├── ui/            # Base UI components
│   └── layout/        # Layout components
├── pages/             # Page components
├── hooks/             # Custom React hooks
├── api/               # API integration
├── types/             # TypeScript types
├── utils/             # Utility functions
└── styles/            # Global styles
```

## Key Components

### UI Components

#### Calendar

```typescript
import { Calendar } from "@/components/ui/calendar";

// Usage
<Calendar
  selected={selectedDate}
  onDateSelect={handleDateSelect}
  disabled={disabledDays}
/>;
```

Properties:

- `selected`: Currently selected date
- `onDateSelect`: Callback for date selection
- `disabled`: Array or object of disabled dates

#### Button

```typescript
import { Button } from "@/components/ui/button";

// Usage
<Button variant="default" size="lg" onClick={handleClick}>
  Book Appointment
</Button>;
```

Variants:

- default
- destructive
- outline
- secondary
- ghost
- link

Sizes:

- default
- sm
- lg
- icon

### Form Components

#### BookingForm

```typescript
import BookingForm from "@/components/BookingForm";

// Usage
<BookingForm barberId={selectedBarber} serviceId={selectedService} />;
```

Features:

- Date selection with calendar
- Time slot selection
- Form validation
- Booking submission
- Error handling

#### FormInput

```typescript
import FormInput from "@/components/FormInput";

// Usage
<FormInput
  label="Full Name"
  name="name"
  value={formData.name}
  onChange={handleChange}
  required
/>;
```

## Custom Hooks

### useAuth

```typescript
import { useAuth } from "@/hooks/useAuth";

function MyComponent() {
  const { user, isLoading, login, logout } = useAuth();
  // ...
}
```

Features:

- User authentication state
- Login/logout functions
- Loading state
- Error handling

### useBooking

```typescript
import { useBooking } from "@/hooks/useBooking";

function BookingComponent() {
  const { availableSlots, isLoading, createBooking, checkAvailability } =
    useBooking();
  // ...
}
```

## Utility Functions

### Date Formatting

```typescript
import { formatDate, formatTime } from "@/lib/utils";

const formattedDate = formatDate(new Date()); // "2024. március 1."
const formattedTime = formatTime("14:30"); // "14:30"
```

### Class Names

```typescript
import { cn } from "@/lib/utils";

const className = cn(
  "base-class",
  isActive && "active-class",
  variant === "primary" ? "primary" : "secondary"
);
```

## State Management

The application uses React's built-in state management with Context API for global state:

```typescript
import { useBookingContext } from "@/contexts/BookingContext";

function BookingComponent() {
  const { state, dispatch } = useBookingContext();
  // ...
}
```

## Styling

### TailwindCSS Configuration

```javascript
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        "barber-primary": "#1a1a1a",
        "barber-secondary": "#2a2a2a",
        "barber-accent": "#ffd700",
        // ...
      },
    },
  },
};
```

### Component Styling

```typescript
// Using Tailwind classes with cn utility
const buttonClasses = cn(
  "px-4 py-2 rounded-lg",
  "bg-barber-accent text-barber-primary",
  "hover:bg-barber-accent/90",
  "transition-colors duration-200"
);
```

## Animation

Using Framer Motion for animations:

```typescript
import { motion, AnimatePresence } from "framer-motion";

function AnimatedComponent() {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
      >
        Content
      </motion.div>
    </AnimatePresence>
  );
}
```

## Error Handling

```typescript
function ErrorBoundary({ children }) {
  const [error, setError] = useState<Error | null>(null);

  if (error) {
    return (
      <div className="error-container">
        <h2>Something went wrong</h2>
        <p>{error.message}</p>
      </div>
    );
  }

  return children;
}
```

## Testing

Using Jest and React Testing Library:

```typescript
import { render, screen, fireEvent } from "@testing-library/react";

describe("BookingForm", () => {
  it("should handle date selection", () => {
    render(<BookingForm />);
    const dateInput = screen.getByLabelText("Select Date");
    fireEvent.click(dateInput);
    // ...
  });
});
```

## Performance Optimization

- Use of React.memo for pure components
- Lazy loading of routes
- Image optimization
- Debounced API calls
- Memoized selectors

## Accessibility

- ARIA labels
- Keyboard navigation
- Focus management
- Color contrast
- Screen reader support

## Best Practices

1. Component Organization:

   - One component per file
   - Clear naming conventions
   - Proper type definitions

2. State Management:

   - Lift state up when needed
   - Use context for global state
   - Keep components pure

3. Error Handling:

   - Proper error boundaries
   - User-friendly error messages
   - Fallback UI components

4. Performance:

   - Avoid unnecessary renders
   - Optimize expensive operations
   - Use proper React hooks

5. Code Style:
   - Consistent formatting
   - Clear documentation
   - Meaningful variable names
