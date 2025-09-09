import type { PageSchema } from "@/types/builder";

const STORAGE_KEY = "web-builder-projects";

export interface Project {
  id: string;
  name: string;
  schema: PageSchema;
  createdAt: string;
  updatedAt: string;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function migratePageSchema(schema: any): PageSchema {
  // If layout is missing, add default layout settings
  if (!schema.layout) {
    return {
      ...schema,
      layout: {
        type: "stack",
        gap: "md",
        alignment: "stretch",
        padding: "md",
      },
    };
  }
  return schema;
}

export function saveProject(
  project: Omit<Project, "id" | "createdAt" | "updatedAt">
): Project {
  const projects = getProjects();
  const now = new Date().toISOString();

  const newProject: Project = {
    id: `project-${Date.now()}`,
    ...project,
    schema: migratePageSchema(project.schema),
    createdAt: now,
    updatedAt: now,
  };

  const updatedProjects = [...projects, newProject];
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedProjects));

  return newProject;
}

export function updateProject(
  id: string,
  updates: Partial<Omit<Project, "id" | "createdAt">>
): Project | null {
  const projects = getProjects();
  const projectIndex = projects.findIndex((p) => p.id === id);

  if (projectIndex === -1) return null;

  const updatedProject: Project = {
    ...projects[projectIndex],
    ...updates,
    schema: updates.schema
      ? migratePageSchema(updates.schema)
      : projects[projectIndex].schema,
    updatedAt: new Date().toISOString(),
  };

  projects[projectIndex] = updatedProject;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));

  return updatedProject;
}

export function getProjects(): Project[] {
  if (typeof window === "undefined") return [];

  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    const projects = stored ? JSON.parse(stored) : [];

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return projects.map((project: any) => ({
      ...project,
      schema: migratePageSchema(project.schema),
    }));
  } catch (error) {
    console.error("Error loading projects:", error);
    return [];
  }
}

export function getProject(id: string): Project | null {
  const projects = getProjects();
  const project = projects.find((p) => p.id === id);

  if (!project) return null;

  return {
    ...project,
    schema: migratePageSchema(project.schema),
  };
}

export function deleteProject(id: string): boolean {
  const projects = getProjects();
  const filteredProjects = projects.filter((p) => p.id !== id);

  if (filteredProjects.length === projects.length) return false;

  localStorage.setItem(STORAGE_KEY, JSON.stringify(filteredProjects));
  return true;
}

export function exportProject(project: Project): void {
  const dataStr = JSON.stringify(project, null, 2);
  const dataBlob = new Blob([dataStr], { type: "application/json" });

  const url = URL.createObjectURL(dataBlob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `${project.name.replace(/\s+/g, "-").toLowerCase()}.json`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export function importProject(file: File): Promise<Project> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    reader.onload = (e) => {
      try {
        const project = JSON.parse(e.target?.result as string) as Project;

        // Validate project structure
        if (!project.schema || !project.name) {
          throw new Error("Invalid project file format");
        }

        // Save imported project with migration
        const savedProject = saveProject({
          name: `${project.name} (Imported)`,
          schema: migratePageSchema(project.schema),
        });

        resolve(savedProject);
      } catch (error) {
        reject(new Error("Failed to parse project file"));
      }
    };

    reader.onerror = () => reject(new Error("Failed to read file"));
    reader.readAsText(file);
  });
}
