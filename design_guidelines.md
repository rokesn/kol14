# Solana Token Creator Design Guidelines

## Design Approach
**Reference-Based Approach** - Drawing inspiration from **modern DeFi platforms** like Uniswap, Phantom Wallet, and Jupiter Exchange for their futuristic crypto aesthetic while maintaining the utility-focused functionality of the original design.

## Core Design Elements

### Color Palette
**Dark Mode Primary** (default):
- Background: `240 15% 8%` (deep space blue-black)
- Surface: `240 12% 12%` (elevated cards with subtle blue undertone)
- Primary: `262 83% 58%` (vibrant Solana purple)
- Secondary: `220 91% 65%` (electric blue accent)
- Text Primary: `240 25% 95%` (near white with cool tone)
- Text Secondary: `240 15% 70%` (muted blue-gray)
- Success: `158 64% 52%` (cyan-green)
- Error: `0 91% 71%` (bright error red)

### Typography
- **Primary**: Inter (Google Fonts CDN)
- **Monospace**: JetBrains Mono (for addresses, technical data)
- **Accent**: Orbitron (for headers - futuristic feel)
- Scale: text-sm, text-base, text-lg, text-xl, text-2xl, text-3xl

### Layout System
**Tailwind Spacing**: Units 2, 4, 6, 8, 12, 16, 24
- Micro: `p-2, gap-2`
- Standard: `p-4, gap-4`
- Cards: `p-6, gap-6`
- Sections: `p-8, gap-8`
- Major: `p-12, gap-12`
- Hero: `py-24`

## Visual Treatment

### Gradients & Effects
**Primary Gradients**:
- Hero background: `240 15% 8%` to `262 25% 15%` (deep space to purple)
- Card backgrounds: `240 12% 12%` to `262 15% 18%` (subtle purple elevation)
- Button gradients: `262 83% 58%` to `220 91% 65%` (purple to blue)

**Visual Effects**:
- Subtle grid overlay patterns on backgrounds
- Glowing borders on active/focus states using box-shadow
- Animated gradient borders on primary cards
- Frosted glass effect (backdrop-blur) on floating elements
- Subtle particle/dot patterns in hero section

### Component Library

**Hero Section**:
- Full viewport height with animated gradient background
- Floating glass-morphism cards
- Animated connecting lines/nodes pattern
- Central logo with glow effect

**Wallet Connection**:
- Glass-morphism card with gradient border
- Wallet icons with subtle glow on hover
- Connection status with animated pulse indicator

**Token Creation Form**:
- Multi-step wizard with progress indicators
- Glass cards with gradient borders
- Floating labels with neon accent colors
- Upload area with animated border glow

**Navigation**:
- Minimal top bar with frosted glass background
- Network selector with gradient pill design
- Wallet status with connection indicator glow

## Modern Crypto Elements

### Blockchain Visual Language
- Hexagonal patterns and geometric shapes
- Connected node networks in backgrounds
- Animated data streams or flowing particles
- Circuit board inspired line patterns
- Holographic text effects on key elements

### Interactive States
- Glow effects on hover (box-shadow with primary colors)
- Smooth micro-animations using transform/translate
- Loading states with animated gradient progress bars
- Success states with expanding ring animations
- Copy feedback with flash/glow effects

## Layout Structure
**Single-page application** with state-based sections:
1. **Hero section** - Futuristic introduction with animated background
2. **Connection section** - Wallet connection with glass-morphism design
3. **Creation form** - Multi-step process with progress visualization
4. **Results section** - Success state with glowing mint address display

## Mobile Considerations
- Simplified gradient effects for performance
- Larger touch targets (min 48px)
- Reduced animation intensity
- Stacked layout with maintained visual hierarchy
- Optimized glass effects for mobile GPUs

## Images
**Background Textures**:
- Subtle dot matrix or circuit patterns as CSS background
- No large hero images - rely on gradients and CSS effects
- Icon assets from crypto-focused icon libraries

This design creates a futuristic, crypto-native experience while maintaining the utility-focused approach essential for blockchain tooling.