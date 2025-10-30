// Accessibility utilities for Metro Optics

// ARIA label generators
export const generateAriaLabel = (action: string, object?: string) => {
  const labels: { [key: string]: string } = {
    search: 'Search products',
    menu: 'Navigation menu',
    cart: 'Shopping cart',
    favorites: 'Favorites',
    account: 'Account',
    login: 'Sign in',
    logout: 'Sign out',
    close: 'Close',
    next: 'Next slide',
    previous: 'Previous slide',
    play: 'Play video',
    pause: 'Pause video',
    filter: 'Filter products',
    sort: 'Sort products',
    view: 'View details',
    add: 'Add to cart',
    remove: 'Remove from cart',
    edit: 'Edit',
    delete: 'Delete',
    save: 'Save changes',
    cancel: 'Cancel',
    submit: 'Submit form',
    clear: 'Clear selection',
    select: 'Select option',
    expand: 'Expand section',
    collapse: 'Collapse section'
  }

  const baseLabel = labels[action] || action
  return object ? `${baseLabel} for ${object}` : baseLabel
}

// Keyboard navigation utilities
export const handleKeyboardNavigation = (
  event: React.KeyboardEvent,
  actions: {
    onEnter?: () => void
    onSpace?: () => void
    onEscape?: () => void
    onArrowUp?: () => void
    onArrowDown?: () => void
    onArrowLeft?: () => void
    onArrowRight?: () => void
    onTab?: () => void
    onHome?: () => void
    onEnd?: () => void
  }
) => {
  const { key } = event

  switch (key) {
    case 'Enter':
      event.preventDefault()
      actions.onEnter?.()
      break
    case ' ':
    case 'Space':
      event.preventDefault()
      actions.onSpace?.()
      break
    case 'Escape':
      event.preventDefault()
      actions.onEscape?.()
      break
    case 'ArrowUp':
      event.preventDefault()
      actions.onArrowUp?.()
      break
    case 'ArrowDown':
      event.preventDefault()
      actions.onArrowDown?.()
      break
    case 'ArrowLeft':
      event.preventDefault()
      actions.onArrowLeft?.()
      break
    case 'ArrowRight':
      event.preventDefault()
      actions.onArrowRight?.()
      break
    case 'Tab':
      actions.onTab?.()
      break
    case 'Home':
      event.preventDefault()
      actions.onHome?.()
      break
    case 'End':
      event.preventDefault()
      actions.onEnd?.()
      break
  }
}

// Focus management utilities
export const trapFocus = (element: HTMLElement) => {
  const focusableElements = element.querySelectorAll(
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
  ) as NodeListOf<HTMLElement>

  const firstElement = focusableElements[0]
  const lastElement = focusableElements[focusableElements.length - 1]

  const handleTabKey = (e: KeyboardEvent) => {
    if (e.key === 'Tab') {
      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          lastElement.focus()
          e.preventDefault()
        }
      } else {
        if (document.activeElement === lastElement) {
          firstElement.focus()
          e.preventDefault()
        }
      }
    }
  }

  element.addEventListener('keydown', handleTabKey)
  firstElement?.focus()

  return () => {
    element.removeEventListener('keydown', handleTabKey)
  }
}

// Screen reader announcements
export const announceToScreenReader = (message: string) => {
  const announcement = document.createElement('div')
  announcement.setAttribute('aria-live', 'polite')
  announcement.setAttribute('aria-atomic', 'true')
  announcement.className = 'sr-only'
  announcement.textContent = message

  document.body.appendChild(announcement)

  setTimeout(() => {
    document.body.removeChild(announcement)
  }, 1000)
}

// Skip link utility
export const createSkipLink = (targetId: string, text: string) => {
  const skipLink = document.createElement('a')
  skipLink.href = `#${targetId}`
  skipLink.textContent = text
  skipLink.className = 'sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-blue-600 text-white px-4 py-2 rounded-md z-50 focus:outline-none focus:ring-2 focus:ring-blue-500'
  
  return skipLink
}

// Color contrast utilities
export const getContrastColor = (backgroundColor: string): 'black' | 'white' => {
  // Simple contrast calculation (in production, use a proper library)
  const hex = backgroundColor.replace('#', '')
  const r = parseInt(hex.substr(0, 2), 16)
  const g = parseInt(hex.substr(2, 2), 16)
  const b = parseInt(hex.substr(4, 2), 16)
  
  const brightness = (r * 299 + g * 587 + b * 114) / 1000
  return brightness > 128 ? 'black' : 'white'
}

// Accessibility testing utilities
export const checkAccessibility = (element: HTMLElement) => {
  const issues: string[] = []

  // Check for alt text on images
  const images = element.querySelectorAll('img')
  images.forEach((img, index) => {
    if (!img.alt) {
      issues.push(`Image ${index + 1} is missing alt text`)
    }
  })

  // Check for form labels
  const inputs = element.querySelectorAll('input, textarea, select')
  inputs.forEach((input, index) => {
    const hasLabel = element.querySelector(`label[for="${input.id}"]`) || 
                     input.getAttribute('aria-label') || 
                     input.getAttribute('aria-labelledby')
    
    if (!hasLabel) {
      issues.push(`Input ${index + 1} is missing a label`)
    }
  })

  // Check for button text
  const buttons = element.querySelectorAll('button')
  buttons.forEach((button, index) => {
    const hasText = button.textContent?.trim() || 
                   button.getAttribute('aria-label') || 
                   button.getAttribute('aria-labelledby')
    
    if (!hasText) {
      issues.push(`Button ${index + 1} is missing accessible text`)
    }
  })

  // Check for heading hierarchy
  const headings = element.querySelectorAll('h1, h2, h3, h4, h5, h6')
  let previousLevel = 0
  
  headings.forEach((heading) => {
    const currentLevel = parseInt(heading.tagName.charAt(1))
    if (currentLevel > previousLevel + 1) {
      issues.push(`Heading level skipped: from h${previousLevel} to h${currentLevel}`)
    }
    previousLevel = currentLevel
  })

  return issues
}

// Touch target size utilities
export const ensureTouchTargetSize = (element: HTMLElement, minSize: number = 44) => {
  const rect = element.getBoundingClientRect()
  const width = rect.width
  const height = rect.height

  if (width < minSize || height < minSize) {
    const scale = Math.max(minSize / width, minSize / height)
    element.style.transform = `scale(${scale})`
    element.style.transformOrigin = 'center'
  }
}

// Reduced motion utilities
export const prefersReducedMotion = () => {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

export const createAnimation = (keyframes: Keyframe[], options?: KeyframeAnimationOptions) => {
  if (prefersReducedMotion()) {
    return { duration: 0, fill: 'forwards' as const }
  }
  return options
}

// High contrast mode utilities
export const prefersHighContrast = () => {
  return window.matchMedia('(prefers-contrast: high)').matches
}

// Focus visible utilities
export const createFocusVisibleStyles = () => {
  const style = document.createElement('style')
  style.textContent = `
    .focus-visible {
      outline: 2px solid #3b82f6;
      outline-offset: 2px;
      border-radius: 0.25rem;
    }
    
    .focus-visible:not(:focus-visible) {
      outline: none;
    }
    
    @media (prefers-reduced-motion: reduce) {
      * {
        animation-duration: 0.01ms !important;
        animation-iteration-count: 1 !important;
        transition-duration: 0.01ms !important;
      }
    }
  `
  document.head.appendChild(style)
}

// Landmark utilities
export const generateLandmarkRoles = () => {
  const landmarks = {
    header: 'banner',
    nav: 'navigation',
    main: 'main',
    aside: 'complementary',
    footer: 'contentinfo',
    section: 'region',
    form: 'form',
    search: 'search'
  }

  Object.entries(landmarks).forEach(([tag, role]) => {
    const elements = document.getElementsByTagName(tag)
    Array.from(elements).forEach(element => {
      if (!element.getAttribute('role')) {
        element.setAttribute('role', role)
      }
    })
  })
}

// Live region utilities
export const createLiveRegion = (polite: boolean = true) => {
  const region = document.createElement('div')
  region.setAttribute('aria-live', polite ? 'polite' : 'assertive')
  region.setAttribute('aria-atomic', 'true')
  region.className = 'sr-only'
  return region
}

// Keyboard shortcut utilities
export const createKeyboardShortcuts = (shortcuts: { [key: string]: () => void }) => {
  const handleKeyDown = (event: KeyboardEvent) => {
    const key: string[] = []
    
    if (event.ctrlKey) key.push('ctrl')
    if (event.altKey) key.push('alt')
    if (event.shiftKey) key.push('shift')
    key.push(event.key.toLowerCase())
    
    const shortcut = key.join('+')
    const action = shortcuts[shortcut]
    
    if (action) {
      event.preventDefault()
      action()
    }
  }

  document.addEventListener('keydown', handleKeyDown)
  
  return () => {
    document.removeEventListener('keydown', handleKeyDown)
  }
}