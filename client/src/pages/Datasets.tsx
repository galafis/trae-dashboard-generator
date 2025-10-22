import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { trpc } from "@/lib/trpc";
import { useLocation } from "wouter";
import { useState, useRef } from "react";
import { Upload, Trash2, BarChart3, ArrowLeft } from "lucide-react";

export default function Datasets() {
  const { isAuthenticated } = useAuth();
  const [, setLocation] = useLocation();
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const { data: datasets, isLoading, refetch } = trpc.dataset.list.useQuery();
  const uploadMutation = trpc.dataset.upload.useMutation();
  const deleteMutation = trpc.dataset.delete.useMutation();

  if (!isAuthenticated) {
    setLocation("/");
    return null;
  }

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const content = await file.text();
      await uploadMutation.mutateAsync({
        fileName: file.name,
        fileContent: content,
        name: file.name.replace(".csv", ""),
        description: `Uploaded on ${new Date().toLocaleDateString()}`,
      });
      
      refetch();
      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch (error) {
      console.error("Upload failed:", error);
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm("Are you sure you want to delete this dataset?")) {
      try {
        await deleteMutation.mutateAsync({ id });
        refetch();
      } catch (error) {
        console.error("Delete failed:", error);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setLocation("/")}
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">My Datasets</h1>
            <p className="text-gray-600">Upload and manage your CSV files</p>
          </div>
        </div>

        {/* Upload Card */}
        <Card className="mb-8 border-2 border-dashed border-indigo-300 bg-indigo-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Upload className="w-5 h-5" />
              Upload CSV File
            </CardTitle>
            <CardDescription>
              Upload a CSV file to create interactive dashboards
            </CardDescription>
          </CardHeader>
          <CardContent>
            <input
              ref={fileInputRef}
              type="file"
              accept=".csv"
              onChange={handleFileSelect}
              disabled={uploading}
              className="hidden"
            />
            <Button
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              className="w-full"
            >
              {uploading ? "Uploading..." : "Select CSV File"}
            </Button>
          </CardContent>
        </Card>

        {/* Datasets List */}
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Your Datasets</h2>
          
          {isLoading ? (
            <div className="text-center py-12">
              <p className="text-gray-600">Loading datasets...</p>
            </div>
          ) : datasets && datasets.length > 0 ? (
            <div className="grid gap-4">
              {datasets.map((dataset) => (
                <Card key={dataset.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="flex items-center gap-2">
                          <BarChart3 className="w-5 h-5 text-indigo-600" />
                          {dataset.name}
                        </CardTitle>
                        <CardDescription>
                          {dataset.rowCount} rows • {dataset.columns.length} columns
                        </CardDescription>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(dataset.id)}
                        disabled={deleteMutation.isPending}
                      >
                        <Trash2 className="w-5 h-5 text-red-500" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        onClick={() => setLocation(`/dashboard/create?datasetId=${dataset.id}`)}
                      >
                        Create Dashboard
                      </Button>
                      <Button
                        variant="ghost"
                        onClick={() => setLocation(`/dataset/${dataset.id}`)}
                      >
                        View Details
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="text-center py-12">
              <p className="text-gray-600 mb-4">No datasets yet</p>
              <p className="text-gray-500 text-sm">Upload a CSV file to get started</p>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}

