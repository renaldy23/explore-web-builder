// Core types for the web builder system
export interface ComponentSchema {
  id: string;
  type: string;
  props: Record<string, any>;
  children?: ComponentSchema[];
  layout?: LayoutSettings;
}

export interface ComponentDefinition {
  type: string;
  name: string;
  icon: string;
  category: string;
  defaultProps: Record<string, any>;
  propSchema: PropSchema[];
}

export interface PropSchema {
  key: string;
  label: string;
  type: "text" | "number" | "color" | "select" | "boolean" | "image";
  options?: string[];
  defaultValue: any;
}

export interface PageSchema {
  id: string;
  name: string;
  components: ComponentSchema[];
  layout: LayoutSettings;
  meta: {
    title: string;
    description: string;
  };
}

export interface LayoutSettings {
  type: "stack" | "horizontal" | "grid-2" | "grid-3" | "grid-4";
  gap: "none" | "sm" | "md" | "lg" | "xl";
  alignment: "start" | "center" | "end" | "stretch";
  padding: "none" | "sm" | "md" | "lg" | "xl";
}

export interface ContainerLayoutSettings {
  type: "horizontal" | "vertical" | "grid-2" | "grid-3" | "wrap";
  gap: "none" | "sm" | "md" | "lg" | "xl";
  alignment: "start" | "center" | "end" | "stretch";
  justifyContent: "start" | "center" | "end" | "between" | "around";
  padding: "none" | "sm" | "md" | "lg" | "xl";
}
