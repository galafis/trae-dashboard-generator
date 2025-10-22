import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { trpc } from "@/lib/trpc";
import { useLocation } from "wouter";
import { Trash2, Edit2, BarChart3, ArrowLeft } from "lucide-react";

export default function Dashboards() {
  const { isAuthenticated } = useAuth();
  const [, setLocation] = useLocation();
  
  const { data: dashboards, isLoading, refetch } = trpc.dashboard.list.useQuery();
  const deleteMutation = trpc.dashboard.delete.useMutation();

  if (!isAuthenticated) {
    setLocation("/");
    return null;
  }

  const handleDelete = async (id: number) => {
    if (confirm("Are you sure you want to delete this dashboard?")) {
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
            <h1 className="text-3xl font-bold text-gray-900">My Dashboards</h1>
            <p className="text-gray-600">View and manage your interactive dashboards</p>
          </div>
        </div>

        {/* Dashboards List */}
        {isLoading ? (
          <div className="text-center py-12">
            <p className="text-gray-600">Loading dashboards...</p>
          </div>
        ) : dashboards && dashboards.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {dashboards.map((dashboard) => (
              <Card key={dashboard.id} className="hover:shadow-lg transition-shadow flex flex-col">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="flex items-center gap-2">
                        <BarChart3 className="w-5 h-5 text-indigo-600" />
                        {dashboard.name}
                      </CardTitle>
                      <CardDescription>
                        {dashboard.description || "No description"}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="flex-1 flex flex-col justify-between">
                  <p className="text-sm text-gray-600 mb-4">
                    Created {new Date(dashboard.createdAt).toLocaleDateString()}
                  </p>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      className="flex-1"
                      onClick={() => setLocation(`/dashboard/create?dashboardId=${dashboard.id}`)}
                    >
                      <Edit2 className="w-4 h-4 mr-2" />
                      Edit
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(dashboard.id)}
                      disabled={deleteMutation.isPending}
                    >
                      <Trash2 className="w-5 h-5 text-red-500" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="text-center py-12">
            <p className="text-gray-600 mb-4">No dashboards yet</p>
            <p className="text-gray-500 text-sm mb-6">Create your first dashboard by uploading a dataset</p>
            <Button
              onClick={() => setLocation("/datasets")}
              className="bg-indigo-600 hover:bg-indigo-700"
            >
              Go to Datasets
            </Button>
          </Card>
        )}
      </div>
    </div>
  );
}

