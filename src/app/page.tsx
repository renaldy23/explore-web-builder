"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardDescription, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { getProjects, deleteProject, type Project } from "@/lib/storage"
import { Plus, Trash2, Edit, Calendar } from "lucide-react"

export default function HomePage() {
    const [projects, setProjects] = useState<Project[]>([])

    useEffect(() => {
        setProjects(getProjects())
    }, [])

    const handleDeleteProject = (id: string) => {
        if (deleteProject(id)) {
            setProjects(getProjects())
        }
    }

    return (
        <div className="min-h-screen bg-background">
            <div className="container mx-auto px-4 py-16">
                <div className="text-center mb-16">
                    <h1 className="text-4xl font-bold mb-4">Web Builder App</h1>
                    <p className="text-xl text-muted-foreground mb-8">Drag and drop website builder dengan komponen terkurasi</p>
                    <Button asChild size="lg">
                        <Link href="/builder">
                            <Plus className="w-4 h-4 mr-2" />
                            Mulai Membuat Website
                        </Link>
                    </Button>
                </div>

                {/* Recent Projects */}
                {projects.length > 0 && (
                    <div className="mb-16">
                        <h2 className="text-2xl font-bold mb-6">Recent Projects</h2>
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {projects.map((project) => (
                                <Card key={project.id} className="group hover:shadow-lg transition-shadow">
                                    <CardHeader>
                                        <div className="flex items-start justify-between">
                                            <div>
                                                <CardTitle className="text-lg">{project.name}</CardTitle>
                                                <CardDescription className="flex items-center gap-1 mt-1">
                                                    <Calendar className="w-3 h-3" />
                                                    {new Date(project.updatedAt).toLocaleDateString()}
                                                </CardDescription>
                                            </div>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className="opacity-0 group-hover:opacity-100 transition-opacity text-destructive hover:text-destructive"
                                                onClick={() => handleDeleteProject(project.id)}
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm text-muted-foreground">
                                                {project.schema.components.length} components
                                            </span>
                                            <Button asChild size="sm">
                                                <Link href={`/builder?id=${project.id}`}>
                                                    <Edit className="w-4 h-4 mr-2" />
                                                    Edit
                                                </Link>
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </div>
                )}

                <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
                    <Card>
                        <CardHeader>
                            <CardTitle>🎯 Drag & Drop</CardTitle>
                            <CardDescription>Interface intuitif untuk menyusun komponen dengan mudah</CardDescription>
                        </CardHeader>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>⚙️ Customizable</CardTitle>
                            <CardDescription>Setiap komponen memiliki properties yang bisa dikustomisasi</CardDescription>
                        </CardHeader>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>📱 Responsive</CardTitle>
                            <CardDescription>Hasil website otomatis responsive dan SEO-friendly</CardDescription>
                        </CardHeader>
                    </Card>
                </div>
            </div>
        </div>
    )
}
