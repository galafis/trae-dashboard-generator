import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { APP_LOGO, APP_TITLE, getLoginUrl } from "@/const";
import { trpc } from "@/lib/trpc";
import { useState } from "react";
import { useLocation } from "wouter";
import { BarChart3, Upload, Zap, TrendingUp } from "lucide-react";

export default function Home() {
  const { user, isAuthenticated } = useAuth();
  const [, setLocation] = useLocation();

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="container mx-auto px-4 py-12">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-3 mb-4">
              <BarChart3 className="w-10 h-10 text-indigo-600" />
              <h1 className="text-4xl font-bold text-gray-900">{APP_TITLE}</h1>
            </div>
            <p className="text-xl text-gray-600 mb-2">Powered by TRAE.ai</p>
            <p className="text-gray-600">Transform your data into interactive dashboards in seconds</p>
          </div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <Upload className="w-8 h-8 text-indigo-600 mb-2" />
                <CardTitle>Easy Upload</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">Upload CSV files and instantly create professional dashboards with zero coding</p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardHeader>
                <Zap className="w-8 h-8 text-indigo-600 mb-2" />
                <CardTitle>AI-Powered</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">Leveraging TRAE.ai to generate optimized code and smart visualizations automatically</p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardHeader>
                <TrendingUp className="w-8 h-8 text-indigo-600 mb-2" />
                <CardTitle>Interactive Charts</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">Create bar, line, scatter, pie, and area charts with full interactivity</p>
              </CardContent>
            </Card>
          </div>

          {/* CTA */}
          <div className="text-center">
            <Button
              size="lg"
              onClick={() => window.location.href = getLoginUrl()}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-6 text-lg"
            >
              Get Started with TRAE Dashboard Generator
            </Button>
            <p className="text-gray-600 mt-4">Sign in with your account to start creating dashboards</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Welcome, {user?.name}!</h1>
          <p className="text-gray-600">Create and manage your interactive dashboards</p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => setLocation("/datasets")}>
            <CardHeader>
              <CardTitle>My Datasets</CardTitle>
              <CardDescription>Manage your uploaded CSV files</CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" className="w-full">View Datasets</Button>
            </CardContent>
          </Card>

          <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => setLocation("/dashboards")}>
            <CardHeader>
              <CardTitle>My Dashboards</CardTitle>
              <CardDescription>View and edit your dashboards</CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" className="w-full">View Dashboards</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

