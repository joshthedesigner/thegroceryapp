# Ingredients Page Header Styling Guide

## 1. Header Alignment
- **Left-aligned**: The main header ("Ingredients") is left-aligned within the header container.
- **Responsive Behavior**: On all screen sizes, the header remains left-aligned. The header and action elements (filters, CTA) stack vertically on smaller screens and align horizontally on larger screens.

## 2. Padding and Margin
- **Header Container**:
  - Top and bottom margin: `0` (header sits flush with the top of the section)
  - Left and right margin: `0`
- **Header Text**:
  - No extra padding or margin applied directly to the header text.
- **Spacing Contribution**:
  - Generous horizontal and vertical spacing between the header, filters, and CTA button creates a clear visual hierarchy and improves readability.

## 3. Font Styling
- **Font Family**: Inherits from the Ant Design system default (typically `-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Helvetica Neue', Arial, sans-serif`).
- **Font Weight**: `700` (bold) for the main header (H2).
- **Font Size**: `2rem` (Ant Design H2 default) for the main header.
- **Line Height**: `1.1` for the main header.
- **Letter Spacing**: `-0.5px` for a modern, tight look.
- **Text Transform**: No uppercase or lowercase transformation; title case is used.

## 4. Spacing Between Elements
- **Vertical Spacing**:
  - 16px margin below the header section to separate it from filters and content.
  - 12px vertical padding inside filter containers and CTA buttons for touch-friendly targets and visual balance.
- **Horizontal Spacing**:
  - 16px gap between header, filters, and CTA button in the flex container.
  - 8px gap between elements inside filter containers (e.g., arrows and date text).

## 5. Color and Background
- **Header Text Color**: `#222` (dark gray/black for strong contrast).
- **Background**: Transparent for the header area; filter containers use `#fff` (white) with a subtle border (`1px solid #e5e7eb`).
- **Hover/Focus States**: Not applicable to the header text. Interactive elements (e.g., buttons) use Ant Design defaults.

## 6. Responsiveness
- **Layout**:
  - On desktop/tablet: Header, filters, and CTA button are arranged in a horizontal flex row with gaps.
  - On mobile/small screens: Elements stack vertically with preserved spacing for clarity.
- **Font Size**: Header font size remains consistent across breakpoints for brand consistency.
- **Touch Targets**: 12px vertical padding ensures buttons and filters are easily tappable on mobile.

---

_This guide documents the visual and responsive design system for the Ingredients page header. For updates or changes, please revise this file to maintain design consistency across the project._ 