// Utility for generating optimized placeholder images
export const generatePlaceholderImage = (width: number, height: number, text?: string) => {
  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height
  const ctx = canvas.getContext('2d')!
  
  // Background gradient
  const gradient = ctx.createLinearGradient(0, 0, width, height)
  gradient.addColorStop(0, '#3B82F6')
  gradient.addColorStop(1, '#1E40AF')
  ctx.fillStyle = gradient
  ctx.fillRect(0, 0, width, height)
  
  // Add text if provided
  if (text) {
    ctx.fillStyle = 'white'
    ctx.font = `${Math.min(width / 10, 24)}px Arial`
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText(text, width / 2, height / 2)
  }
  
  return canvas.toDataURL('image/jpeg', 0.8)
}

// Predefined optimized image URLs
export const OPTIMIZED_IMAGES = {
  hero: {
    premium: '/images/hero/premium-eyewear.jpg',
    eyeCare: '/images/hero/eye-care.jpg',
    sunglasses: '/images/hero/sunglasses.jpg'
  },
  products: {
    classicBlack: '/images/products/classic-black.jpg',
    premiumAviator: '/images/products/premium-aviator.jpg',
    designerCatEye: '/images/products/designer-cat-eye.jpg',
    sportSunglasses: '/images/products/sport-sunglasses.jpg',
    kidsColorful: '/images/products/kids-colorful.jpg',
    dailyContacts: '/images/products/daily-contacts.jpg',
    blueLight: '/images/products/blue-light.jpg',
    polarizedFishing: '/images/products/polarized-fishing.jpg'
  },
  categories: {
    eyeglasses: '/images/categories/eyeglasses.jpg',
    sunglasses: '/images/categories/sunglasses.jpg',
    contactLenses: '/images/categories/contact-lenses.jpg',
    kids: '/images/categories/kids.jpg'
  }
}

// Fallback placeholder generator
export const getPlaceholderUrl = (width: number, height: number, text?: string) => {
  return `data:image/svg+xml,%3Csvg width='${width}' height='${height}' xmlns='http://www.w3.org/2000/svg'%3E%3Crect width='100%25' height='100%25' fill='%233B82F6'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='Arial' font-size='${Math.min(width / 10, 24)}' fill='white'%3E${text || 'Image'}%3C/text%3E%3C/svg%3E`
}