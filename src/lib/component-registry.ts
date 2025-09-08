import type { ComponentDefinition } from "@/types/builder";

// Registry of available components for the builder
export const componentRegistry: ComponentDefinition[] = [
  {
    type: "hero",
    name: "Hero Section",
    icon: "🎯",
    category: "Layout",
    defaultProps: {
      title: "Welcome to Our Website",
      subtitle: "Build amazing experiences with our platform",
      buttonText: "Get Started",
      buttonLink: "#",
      backgroundImage: "/abstract-hero-background.png",
      alignment: "center",
    },
    propSchema: [
      {
        key: "title",
        label: "Title",
        type: "text",
        defaultValue: "Welcome to Our Website",
      },
      {
        key: "subtitle",
        label: "Subtitle",
        type: "text",
        defaultValue: "Build amazing experiences",
      },
      {
        key: "buttonText",
        label: "Button Text",
        type: "text",
        defaultValue: "Get Started",
      },
      {
        key: "buttonLink",
        label: "Button Link",
        type: "text",
        defaultValue: "#",
      },
      {
        key: "backgroundImage",
        label: "Background Image",
        type: "image",
        defaultValue: "",
      },
      {
        key: "alignment",
        label: "Alignment",
        type: "select",
        options: ["left", "center", "right"],
        defaultValue: "center",
      },
    ],
  },
  {
    type: "text",
    name: "Text Block",
    icon: "📝",
    category: "Content",
    defaultProps: {
      content: "This is a text block. You can edit this content.",
      fontSize: "base",
      textAlign: "left",
      color: "foreground",
      customColor: "",
    },
    propSchema: [
      {
        key: "content",
        label: "Content",
        type: "text",
        defaultValue: "This is a text block",
      },
      {
        key: "fontSize",
        label: "Font Size",
        type: "select",
        options: ["sm", "base", "lg", "xl", "2xl"],
        defaultValue: "base",
      },
      {
        key: "textAlign",
        label: "Text Align",
        type: "select",
        options: ["left", "center", "right"],
        defaultValue: "left",
      },
      {
        key: "color",
        label: "Color",
        type: "color",
        defaultValue: "foreground",
      },
      {
        key: "customColor",
        label: "Custom Color (hex)",
        type: "color",
        defaultValue: "",
      },
    ],
  },
  {
    type: "button",
    name: "Button",
    icon: "🔘",
    category: "Interactive",
    defaultProps: {
      text: "Click Me",
      variant: "default",
      size: "default",
      link: "#",
      textColor: "",
      backgroundColor: "",
      borderWidth: 0,
      borderColor: "",
      borderRadius: "md",
    },
    propSchema: [
      {
        key: "text",
        label: "Button Text",
        type: "text",
        defaultValue: "Click Me",
      },
      {
        key: "variant",
        label: "Variant",
        type: "select",
        options: ["default", "secondary", "outline", "ghost"],
        defaultValue: "default",
      },
      {
        key: "size",
        label: "Size",
        type: "select",
        options: ["sm", "default", "lg"],
        defaultValue: "default",
      },
      { key: "link", label: "Link", type: "text", defaultValue: "#" },
      {
        key: "textColor",
        label: "Text Color",
        type: "color",
        defaultValue: "",
      },
      {
        key: "backgroundColor",
        label: "Background Color",
        type: "color",
        defaultValue: "",
      },
      {
        key: "borderWidth",
        label: "Border Width (px)",
        type: "number",
        defaultValue: 0,
      },
      {
        key: "borderColor",
        label: "Border Color",
        type: "color",
        defaultValue: "",
      },
      {
        key: "borderRadius",
        label: "Border Radius",
        type: "select",
        options: ["none", "sm", "md", "lg", "full"],
        defaultValue: "md",
      },
    ],
  },
  {
    type: "image",
    name: "Image",
    icon: "🖼️",
    category: "Media",
    defaultProps: {
      src: "/abstract-geometric-shapes.png",
      alt: "Sample image",
      width: 400,
      height: 300,
      rounded: false,
      mode: "intrinsic",
      objectFit: "cover",
    },
    propSchema: [
      { key: "src", label: "Image URL", type: "image", defaultValue: "" },
      { key: "alt", label: "Alt Text", type: "text", defaultValue: "Image" },
      { key: "width", label: "Width", type: "number", defaultValue: 400 },
      { key: "height", label: "Height", type: "number", defaultValue: 300 },
      {
        key: "rounded",
        label: "Rounded",
        type: "boolean",
        defaultValue: false,
      },
      {
        key: "mode",
        label: "Sizing Mode",
        type: "select",
        options: ["intrinsic", "fill"],
        defaultValue: "intrinsic",
      },
      {
        key: "objectFit",
        label: "Object Fit",
        type: "select",
        options: ["cover", "contain", "fill", "none", "scale-down"],
        defaultValue: "cover",
      },
    ],
  },
  {
    type: "container",
    name: "Container",
    icon: "📦",
    category: "Layout",
    defaultProps: {
      layout: "horizontal",
      gap: "md",
      alignment: "center",
      justifyContent: "start",
      padding: "md",
      backgroundColor: "transparent",
      borderRadius: "none",
    },
    propSchema: [
      {
        key: "layout",
        label: "Layout Type",
        type: "select",
        options: ["horizontal", "vertical", "grid-2", "grid-3", "wrap"],
        defaultValue: "horizontal",
      },
      {
        key: "gap",
        label: "Gap",
        type: "select",
        options: ["none", "sm", "md", "lg", "xl"],
        defaultValue: "md",
      },
      {
        key: "alignment",
        label: "Alignment",
        type: "select",
        options: ["start", "center", "end", "stretch"],
        defaultValue: "center",
      },
      {
        key: "justifyContent",
        label: "Justify Content",
        type: "select",
        options: ["start", "center", "end", "between", "around"],
        defaultValue: "start",
      },
      {
        key: "padding",
        label: "Padding",
        type: "select",
        options: ["none", "sm", "md", "lg", "xl"],
        defaultValue: "md",
      },
      {
        key: "backgroundColor",
        label: "Background Color",
        type: "color",
        defaultValue: "transparent",
      },
      {
        key: "borderRadius",
        label: "Border Radius",
        type: "select",
        options: ["none", "sm", "md", "lg", "full"],
        defaultValue: "none",
      },
    ],
  },
  {
    type: "section",
    name: "Section",
    icon: "📄",
    category: "Layout",
    defaultProps: {
      layout: "vertical",
      gap: "lg",
      alignment: "stretch",
      justifyContent: "start",
      padding: "xl",
      backgroundColor: "background",
      borderRadius: "none",
      title: "",
      showTitle: false,
    },
    propSchema: [
      {
        key: "showTitle",
        label: "Show Title",
        type: "boolean",
        defaultValue: false,
      },
      { key: "title", label: "Section Title", type: "text", defaultValue: "" },
      {
        key: "layout",
        label: "Layout Type",
        type: "select",
        options: ["horizontal", "vertical", "grid-2", "grid-3", "wrap"],
        defaultValue: "vertical",
      },
      {
        key: "gap",
        label: "Gap",
        type: "select",
        options: ["none", "sm", "md", "lg", "xl"],
        defaultValue: "lg",
      },
      {
        key: "alignment",
        label: "Alignment",
        type: "select",
        options: ["start", "center", "end", "stretch"],
        defaultValue: "stretch",
      },
      {
        key: "justifyContent",
        label: "Justify Content",
        type: "select",
        options: ["start", "center", "end", "between", "around"],
        defaultValue: "start",
      },
      {
        key: "padding",
        label: "Padding",
        type: "select",
        options: ["none", "sm", "md", "lg", "xl"],
        defaultValue: "xl",
      },
      {
        key: "backgroundColor",
        label: "Background Color",
        type: "color",
        defaultValue: "background",
      },
      {
        key: "borderRadius",
        label: "Border Radius",
        type: "select",
        options: ["none", "sm", "md", "lg", "full"],
        defaultValue: "none",
      },
    ],
  },
];

export function getComponentDefinition(
  type: string
): ComponentDefinition | undefined {
  return componentRegistry.find((comp) => comp.type === type);
}

export function getComponentsByCategory() {
  const categories: Record<string, ComponentDefinition[]> = {};

  componentRegistry.forEach((comp) => {
    if (!categories[comp.category]) {
      categories[comp.category] = [];
    }
    categories[comp.category].push(comp);
  });

  return categories;
}
