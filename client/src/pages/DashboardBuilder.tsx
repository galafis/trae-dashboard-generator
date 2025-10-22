import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { trpc } from "@/lib/trpc";
import { useLocation, useSearch } from "wouter";
import { useState, useMemo } from "react";
import { ArrowLeft, Plus, Trash2 } from "lucide-react";

export default function DashboardBuilder() {
  const { isAuthenticated } = useAuth();
  const [, setLocation] = useLocation();
  const search = useSearch();
  const params = new URLSearchParams(search);
  const datasetId = parseInt(params.get("datasetId") || "0");
  const dashboardId = parseInt(params.get("dashboardId") || "0");

  const [dashboardName, setDashboardName] = useState("My Dashboard");
  const [charts, setCharts] = useState<any[]>([]);
  const [selectedChart, setSelectedChart] = useState<string | null>(null);

  if (!isAuthenticated) {
    setLocation("/");
    return null;
  }

  const { data: dataset } = trpc.dataset.getById.useQuery(
    { id: datasetId },
    { enabled: datasetId > 0 }
  );

  const { data: dashboard } = trpc.dashboard.getById.useQuery(
    { id: dashboardId },
    { enabled: dashboardId > 0 }
  );

  const createMutation = trpc.dashboard.create.useMutation();
  const updateMutation = trpc.dashboard.update.useMutation();

  const COLORS = ["#4f46e5", "#7c3aed", "#db2777", "#ea580c", "#ca8a04", "#16a34a", "#0891b2", "#0284c7"];

  const handleAddChart = () => {
    const newChart = {
      id: `chart-${Date.now()}`,
      type: "bar",
      title: "New Chart",
      xAxis: dataset?.columns[0] || "",
      yAxis: dataset?.columns[1] || "",
      color: COLORS[charts.length % COLORS.length],
    };
    setCharts([...charts, newChart]);
    setSelectedChart(newChart.id);
  };

  const handleDeleteChart = (id: string) => {
    setCharts(charts.filter((c) => c.id !== id));
    if (selectedChart === id) setSelectedChart(null);
  };

  const handleSaveDashboard = async () => {
    try {
      if (dashboardId > 0) {
        await updateMutation.mutateAsync({
          id: dashboardId,
          config: {
            title: dashboardName,
            charts,
            theme: "light",
          },
        });
      } else {
        await createMutation.mutateAsync({
          datasetId,
          name: dashboardName,
          config: {
            title: dashboardName,
            charts,
            theme: "light",
          },
        });
      }
      setLocation("/dashboards");
    } catch (error) {
      console.error("Save failed:", error);
    }
  };

  const currentChart = charts.find((c) => c.id === selectedChart);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setLocation("/datasets")}
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <input
                type="text"
                value={dashboardName}
                onChange={(e) => setDashboardName(e.target.value)}
                className="text-3xl font-bold text-gray-900 bg-transparent border-b-2 border-transparent hover:border-indigo-300 focus:border-indigo-600 outline-none"
              />
              <p className="text-gray-600">Build your interactive dashboard</p>
            </div>
          </div>
          <Button
            onClick={handleSaveDashboard}
            disabled={createMutation.isPending || updateMutation.isPending}
            className="bg-indigo-600 hover:bg-indigo-700"
          >
            Save Dashboard
          </Button>
        </div>

        <div className="grid grid-cols-4 gap-6">
          {/* Chart List */}
          <div className="col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Charts</CardTitle>
              </CardHeader>
              <CardContent>
                <Button
                  onClick={handleAddChart}
                  variant="outline"
                  className="w-full mb-4"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Chart
                </Button>
                <div className="space-y-2">
                  {charts.map((chart) => (
                    <div
                      key={chart.id}
                      className={`p-3 rounded-lg cursor-pointer transition-colors ${
                        selectedChart === chart.id
                          ? "bg-indigo-100 border-2 border-indigo-600"
                          : "bg-gray-100 border-2 border-transparent hover:bg-gray-200"
                      }`}
                      onClick={() => setSelectedChart(chart.id)}
                    >
                      <p className="font-medium text-sm">{chart.title}</p>
                      <p className="text-xs text-gray-600 capitalize">{chart.type}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Chart Editor & Preview */}
          <div className="col-span-3">
            {currentChart ? (
              <div className="grid grid-cols-2 gap-6">
                {/* Editor */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Chart Settings</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Title
                      </label>
                      <input
                        type="text"
                        value={currentChart.title}
                        onChange={(e) => {
                          const updated = charts.map((c) =>
                            c.id === currentChart.id
                              ? { ...c, title: e.target.value }
                              : c
                          );
                          setCharts(updated);
                        }}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Chart Type
                      </label>
                      <select
                        value={currentChart.type}
                        onChange={(e) => {
                          const updated = charts.map((c) =>
                            c.id === currentChart.id
                              ? { ...c, type: e.target.value }
                              : c
                          );
                          setCharts(updated);
                        }}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600"
                      >
                        <option value="bar">Bar Chart</option>
                        <option value="line">Line Chart</option>
                        <option value="scatter">Scatter Plot</option>
                        <option value="pie">Pie Chart</option>
                        <option value="area">Area Chart</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        X-Axis Column
                      </label>
                      <select
                        value={currentChart.xAxis}
                        onChange={(e) => {
                          const updated = charts.map((c) =>
                            c.id === currentChart.id
                              ? { ...c, xAxis: e.target.value }
                              : c
                          );
                          setCharts(updated);
                        }}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600"
                      >
                        <option value="">Select column</option>
                        {dataset?.columns.map((col) => (
                          <option key={col} value={col}>
                            {col}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Y-Axis Column
                      </label>
                      <select
                        value={currentChart.yAxis}
                        onChange={(e) => {
                          const updated = charts.map((c) =>
                            c.id === currentChart.id
                              ? { ...c, yAxis: e.target.value }
                              : c
                          );
                          setCharts(updated);
                        }}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600"
                      >
                        <option value="">Select column</option>
                        {dataset?.columns.map((col) => (
                          <option key={col} value={col}>
                            {col}
                          </option>
                        ))}
                      </select>
                    </div>

                    <Button
                      variant="destructive"
                      className="w-full"
                      onClick={() => handleDeleteChart(currentChart.id)}
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Delete Chart
                    </Button>
                  </CardContent>
                </Card>

                {/* Preview */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Preview</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="w-full h-80 bg-gray-100 rounded-lg flex items-center justify-center">
                      <p className="text-gray-600 text-center">
                        Chart preview will appear here when data is loaded
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            ) : (
              <Card className="text-center py-12">
                <p className="text-gray-600 mb-4">No chart selected</p>
                <Button onClick={handleAddChart} className="bg-indigo-600 hover:bg-indigo-700">
                  Create Your First Chart
                </Button>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

