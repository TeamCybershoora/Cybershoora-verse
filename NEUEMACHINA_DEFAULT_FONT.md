# NeueMachina Default Font Configuration

## ✅ Changes Made

### 1. **Updated Global CSS Default Font**
**File**: `styles/common.css`
```css
* {
  font-family: "NeueMachina"; /* Changed from "Helvetica" */
  /* ... other properties */
}
```

### 2. **Updated Font Configuration**
**File**: `styles/fonts-config.css`
```css
* {
  font-family: "NeueMachina", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  /* ... other properties */
}
```

### 3. **Updated Tailwind Configuration**
**File**: `tailwind.config.js`
```javascript
fontFamily: {
  'sans': ['NeueMachina', 'sans-serif'], // Added as default sans font
  'beni': ['Beni', 'sans-serif'],
  'juan': ['Juan', 'sans-serif'],
  'neue-machina': ['NeueMachina', 'sans-serif'],
  'gilroy': ['Gilroy', 'sans-serif'],
  'helvetica': ['Helvetica', 'sans-serif'],
  'source-code': ['SourceCodePro', 'monospace'],
}
```

### 4. **Updated Font Preloading**
**File**: `app/layout.jsx`
```html
<!-- Preload critical NeueMachina fonts instead of Helvetica -->
<link rel="preload" href="https://ik.imagekit.io/sheryians/Fonts/neueMachina/NeueMachina-Regular_DQCmjH1st.ttf?updatedAt=1713347905052" as="font" type="font/ttf" crossOrigin="anonymous" />
<link rel="preload" href="https://ik.imagekit.io/sheryians/Fonts/neueMachina/NeueMachina-Bold_WaMOsLX9Z9.ttf?updatedAt=1713347904936" as="font" type="font/ttf" crossOrigin="anonymous" />
```

## 🎯 Result

Now **NeueMachina** is the default font across the entire application:

- ✅ **All text** will use NeueMachina by default
- ✅ **All components** will inherit NeueMachina font
- ✅ **All pages** will display NeueMachina as the primary font
- ✅ **Tailwind classes** will use NeueMachina as the default sans font

## 📝 Available NeueMachina Weights

- **200** - Ultralight
- **300** - Light  
- **400** - Regular (default)
- **500** - Medium
- **700** - Bold
- **800** - Ultrabold
- **900** - Black

## 🧪 Testing

Visit `/font-test` to see:
- All fonts including NeueMachina
- Default font test section showing NeueMachina in action
- Confirmation that NeueMachina is now the default

## 💡 Usage Examples

### Default Text (NeueMachina)
```html
<p>This text will automatically use NeueMachina</p>
<div>All content uses NeueMachina by default</div>
```

### Specific Font Classes (if needed)
```html
<div class="font-beni">Beni Font</div>
<div class="font-juan">Juan Font</div>
<div class="font-helvetica">Helvetica Font</div>
```

### Tailwind Classes
```html
<div class="font-sans">NeueMachina (default)</div>
<div class="font-neue-machina">NeueMachina (explicit)</div>
<div class="font-bold">NeueMachina Bold</div>
```

## 🚀 Performance

- **Preloaded**: Critical NeueMachina fonts are preloaded for faster rendering
- **Optimized**: Font display swap for better loading performance
- **Fallbacks**: Proper fallback fonts ensure text remains readable during loading

The application now uses **NeueMachina** as the default font everywhere, just like it was before! 🎉 