import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Download,
  Film,
  Calendar,
  BarChart3,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Edit3,
  SendHorizonal,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  ReportResponse,
  getOutputByName,
  TimeseriesOutput,
  ScalarOutput,
  TextOutput,
  ObjectOutput,
  timeseriesToChartData,
} from "@/types/report";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";

/** ---- Local type extension to add report.rating without touching shared types ---- */
type ReportResponseWithRating = Omit<ReportResponse, "report"> & {
  report: ReportResponse["report"] & {
    rating: number; // 1-10
  };
};

/** ---- Mock data now includes report.rating ---- */
const mockReportData: ReportResponseWithRating = {
  version: "1.0",
  run_id: "b2e6c1d6-7f8a-4f0b-90a9-1f9b0e1f3a21",
  created_at: "2025-10-25T13:10:00Z",
  input: { type: "video", uri: "s3://bucket/session123/video.mp4", duration_sec: 612.4, fps: 24 },
  selected_models: ["perforations","aspect_ratio","transcript","syncformer","dirt_debris","noise"],
  models: [
    {
      model_id: "perforations",
      display_name: "Perforations Classifier",
      version: "2.1.0",
      task_kind: "classification",
      status: "succeeded",
      is_editable: true,
      outputs: [{ name: "class", kind: "scalar/string", value: "2R", confidence: 0.982 }],
    },
    {
      model_id: "aspect_ratio",
      display_name: "Aspect Ratio Detector",
      version: "1.4.3",
      task_kind: "classification",
      status: "succeeded",
      is_editable: true,
      outputs: [{ name: "aspect_ratio", kind: "scalar/string|nullable", value: "1.33:1" }],
    },
    {
      model_id: "transcript",
      display_name: "ASR Transcript",
      version: "0.9.0",
      task_kind: "text",
      status: "succeeded",
      is_editable: true,
      outputs: [
        { name: "language", kind: "scalar/string", value: "en" },
        { name: "full_text", kind: "text", data: "This is the complete transcript text from the film audio..." },
        { name: "segments", kind: "spans/text", data: [
            { start: 0.12, end: 3.48, text: "Hello everyone" },
            { start: 3.60, end: 7.02, text: "Welcome to our presentation" },
        ]},
      ],
    },
    {
      model_id: "syncformer",
      display_name: "Syncformer Score",
      version: "3.0.1",
      task_kind: "regression",
      status: "succeeded",
      is_editable: true,
      outputs: [{ name: "sync_score", kind: "scalar/number", unit: "ms_offset", value: 12.7 }],
    },
    {
      model_id: "dirt_debris",
      display_name: "Dirt & Debris Detector",
      version: "1.2.0",
      task_kind: "timeseries",
      status: "succeeded",
      is_editable: false,
      outputs: [{
        name: "per_frame_count",
        kind: "timeseries/number",
        sampling: { unit: "frame", fps: 24 },
        summary: { mean: 3.2, p95: 9, max: 17 },
        preview: Array.from({ length: 50 }, () => Math.floor(Math.random() * 15) + 1),
      }],
    },
    {
      model_id: "noise",
      display_name: "Noise Estimator",
      version: "0.7.5",
      task_kind: "timeseries",
      status: "succeeded",
      is_editable: false,
      outputs: [
        {
          name: "per_frame_sigma",
          kind: "timeseries/number",
          sampling: { unit: "frame", fps: 24 },
          unit: "sigma",
          preview: Array.from({ length: 50 }, () => Math.random() * 0.1 + 0.05),
        },
        {
          name: "overall_metrics",
          kind: "object",
          data: { median_sigma: 6.1, snr_db: 18.9, noisiest_span: { start: 241.0, end: 265.5 } },
        },
      ],
    },
  ],
  errors: [],
  report: {
    summary: "Run completed: 6/6 models succeeded.",
    thumbnails: [{ label: "input_preview", uri: "https://placeholder.svg" }],
    rating: 5, // <-- set 1-10
  },
};

type CorrectionsState = Record<string, Record<string, string | number>>;
type EditingState = Record<string, boolean>;

/** --- Circular gauge with centered number --- */
const CircularGauge = ({ value, size = 120 }: { value: number; size?: number }) => {
  const clamped = Math.max(1, Math.min(10, value)); // 1..10
  const pct = clamped / 10;
  const stroke = 10;
  const r = (size - stroke) / 2;
  const C = 2 * Math.PI * r;
  const dash = pct * C;

  const colorStroke =
    clamped >= 7 ? "stroke-emerald-500"
    : clamped >= 4 ? "stroke-amber-500"
    : "stroke-rose-500";

  const colorText =
    clamped >= 7 ? "text-emerald-600"
    : clamped >= 4 ? "text-amber-600"
    : "text-rose-600";

  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      {/* SVG ring */}
      <svg width={size} height={size} className="absolute inset-0">
        <g transform={`rotate(-90 ${size / 2} ${size / 2})`}>
          {/* Track */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={r}
            fill="none"
            stroke="hsl(var(--border))"
            strokeWidth={stroke}
          />
          {/* Progress */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={r}
            fill="none"
            className={colorStroke}
            strokeWidth={stroke}
            strokeLinecap="round"
            strokeDasharray={`${dash} ${C - dash}`}
          />
        </g>
      </svg>

      {/* Centered number */}
      <div className={`flex flex-col items-center ${colorText}`}>
        <div className="text-4xl font-bold leading-none">{clamped}</div>
      </div>
    </div>
  );
};


const ReportDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  // Use the rating-enabled type throughout this component
  const reportData = mockReportData;

  const totalFrames = Math.floor(reportData.input.duration_sec * reportData.input.fps);

  const handleExport = () => {
    const dataStr = JSON.stringify(reportData, null, 2);
    const dataBlob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `report_${reportData.run_id}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const [editing, setEditing] = useState<EditingState>({});
  const [corrections, setCorrections] = useState<CorrectionsState>({});

  useEffect(() => {
    const init: CorrectionsState = {};
    for (const m of reportData.models) {
      if (!m.is_editable) continue;
      const scalars = m.outputs.filter((o) => o.kind.startsWith("scalar"));
      if (scalars.length) {
        init[m.model_id] = {};
        for (const s of scalars) {
          init[m.model_id][s.name] = (s as ScalarOutput).value as any;
        }
      }
    }
    setCorrections(init);
  }, [reportData.models]);

  const toggleEditing = (modelId: string) =>
    setEditing((prev) => ({ ...prev, [modelId]: !prev[modelId] }));

  const setCorrectionValue = (
    modelId: string,
    outputName: string,
    raw: string,
    isNumber: boolean
  ) => {
    const value = isNumber ? (raw === "" ? "" : Number(raw)) : raw;
    setCorrections((prev) => ({
      ...prev,
      [modelId]: { ...(prev[modelId] || {}), [outputName]: value as any },
    }));
  };

  const correctionPayload = useMemo(() => {
    const items = Object.entries(corrections).map(([model_id, outputs]) => {
      const m = reportData.models.find((x) => x.model_id === model_id);
      return { model_id, display_name: m?.display_name ?? model_id, outputs };
    });
    return {
      run_id: reportData.run_id,
      corrected_at: new Date().toISOString(),
      corrections: items,
    };
  }, [corrections, reportData.run_id, reportData.models]);

  const handlePostCorrections = async () => {
    try {
      const resp = await fetch(
        `/api/reports/${encodeURIComponent(reportData.run_id)}/corrections`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(correctionPayload),
        }
      );
      if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
      alert("Corrections posted successfully.");
    } catch {
      const dataStr = JSON.stringify(correctionPayload, null, 2);
      const blob = new Blob([dataStr], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `corrections_${reportData.run_id}.json`;
      a.click();
      URL.revokeObjectURL(url);
    }
  };

  const dirtDebrisModel = reportData.models.find((m) => m.model_id === "dirt_debris");
  const noiseModel = reportData.models.find((m) => m.model_id === "noise");
  const syncModel = reportData.models.find((m) => m.model_id === "syncformer");
  const transcriptModel = reportData.models.find((m) => m.model_id === "transcript");

  const dirtDebrisData = dirtDebrisModel
    ? timeseriesToChartData(
        getOutputByName<TimeseriesOutput>(dirtDebrisModel.outputs, "per_frame_count")!,
        totalFrames
      )
    : [];
  const noiseData = noiseModel
    ? timeseriesToChartData(
        getOutputByName<TimeseriesOutput>(noiseModel.outputs, "per_frame_sigma")!,
        totalFrames
      )
    : [];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "succeeded":
        return <CheckCircle2 className="w-5 h-5 text-green-500" />;
      case "failed":
        return <XCircle className="w-5 h-5 text-red-500" />;
      default:
        return <AlertCircle className="w-5 h-5 text-yellow-500" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/20">
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8 animate-fade-in">
          <Button variant="ghost" onClick={() => navigate("/reports")} className="mb-4 hover:bg-accent/10">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Reports
          </Button>

          <div className="flex items-start justify-between flex-wrap gap-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <Film className="w-8 h-8 text-accent" />
                <h1 className="text-4xl font-bold text-foreground">
                  Report: {reportData.run_id.slice(0, 8)}
                </h1>
              </div>
              <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  <span>Processed: {new Date(reportData.created_at).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Film className="w-4 h-4" />
                  <span>{(reportData.input.duration_sec * reportData.input.fps).toLocaleString()} frames • {reportData.input.fps} FPS</span>
                </div>
                <div className="flex items-center gap-2">
                  <BarChart3 className="w-4 h-4" />
                  <span>Duration: {Math.floor(reportData.input.duration_sec / 60)}m {Math.floor(reportData.input.duration_sec % 60)}s</span>
                </div>
              </div>
              <div className="mt-4">
                <Badge variant="outline" className="text-sm">{reportData.report.summary}</Badge>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <Button
                onClick={handlePostCorrections}
                className="bg-gradient-accent hover:opacity-90 text-primary-foreground font-semibold"
                title="Post corrections to server"
              >
                <SendHorizonal className="w-4 h-4 mr-2" />
                Post Corrections
              </Button>
              <Button onClick={handleExport} className="bg-gradient-accent hover:opacity-90 text-primary-foreground font-semibold">
                <Download className="w-4 h-4 mr-2" />
                Export Report
              </Button>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex flex-col lg:flex-row gap-6">
          {/* LEFT: Rating + Model Results */}
          <div className="lg:w-2/5 max-h-[80vh] overflow-y-auto">
            <div className="flex flex-col gap-4">

              {/* --- NEW: Report Rating gauge --- */}
              <Card className="bg-gradient-card shadow-medium">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-sm text-muted-foreground mb-1">Overall</div>
                      <div className="text-lg font-semibold text-foreground">Quality Rating</div>
                    </div>
                    <CircularGauge value={reportData.report.rating} />
                  </div>
                </CardContent>
              </Card>

              {/* Model cards */}
              {reportData.models.map((model) => {
                const canEdit = !!model.is_editable;
                const isEditing = canEdit && !!editing[model.model_id];

                return (
                  <Card key={model.model_id} className="bg-gradient-card shadow-medium">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <h3 className="font-semibold text-foreground">{model.display_name}</h3>
                            {canEdit && (
                              <button
                                type="button"
                                className="rounded p-1 hover:bg-accent/10"
                                aria-label={`Edit ${model.display_name}`}
                                onClick={() => toggleEditing(model.model_id)}
                                title={isEditing ? "Stop editing" : "Edit this result"}
                              >
                                <Edit3 className={`w-4 h-4 ${isEditing ? "text-accent" : "text-muted-foreground"}`} />
                              </button>
                            )}
                          </div>
                          <p className="text-xs text-muted-foreground">v{model.version}</p>
                        </div>
                        {getStatusIcon(model.status)}
                      </div>

                      <div className="space-y-2 text-sm">
                        {model.outputs.slice(0, 2).map((output, idx) => {
                          if (!output.kind.startsWith("scalar")) return null;
                          const scalarOutput = output as ScalarOutput;
                          const current =
                            (corrections[model.model_id]?.[output.name] as any) ??
                            scalarOutput.value;

                          const isNumber = output.kind.includes("number");
                          const unit = "unit" in scalarOutput && scalarOutput.unit ? scalarOutput.unit : "";

                          return (
                            <div key={idx} className="grid grid-cols-2 gap-3 items-center">
                              <span className="text-muted-foreground">{output.name}:</span>
                              {isEditing ? (
                                <div className="flex items-center gap-1">
                                  <Input
                                    type={isNumber ? "number" : "text"}
                                    value={current === undefined || current === null ? "" : String(current)}
                                    onChange={(e) =>
                                      setCorrectionValue(model.model_id, output.name, e.target.value, isNumber)
                                    }
                                    className="h-8"
                                  />
                                  {unit && <span className="text-xs text-muted-foreground ml-1">{unit}</span>}
                                </div>
                              ) : (
                                <span className="font-medium text-foreground truncate">
                                  {String(current)} {unit}
                                </span>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>

          {/* RIGHT: Analysis tabs (unchanged) */}
          <div className="flex-1 lg:w-3/5 min-w-0 space-y-4">
            {(() => {
              const dirtDebrisModel = reportData.models.find((m) => m.model_id === "dirt_debris");
              const noiseModel = reportData.models.find((m) => m.model_id === "noise");
              const syncModel = reportData.models.find((m) => m.model_id === "syncformer");
              const transcriptModel = reportData.models.find((m) => m.model_id === "transcript");

              const views = [
                { id: "dirt", label: "Dirt & Debris", available: Boolean(dirtDebrisModel && dirtDebrisData.length > 0) },
                { id: "noise", label: "Noise", available: Boolean(noiseModel && noiseData.length > 0) },
                { id: "sync", label: "Audio Sync", available: Boolean(syncModel) },
                { id: "transcript", label: "Transcript", available: Boolean(transcriptModel) },
              ].filter(v => v.available);

              const defaultTab = views[0]?.id ?? "none";
              if (defaultTab === "none") {
                return (
                  <Card className="bg-gradient-card shadow-medium">
                    <CardContent className="p-8 text-center text-muted-foreground">No analysis sections available.</CardContent>
                  </Card>
                );
              }

              return (
                <Tabs defaultValue={defaultTab} className="w-full min-w-0">
                  <div className="hidden sm:flex justify-between items-center gap-3">
                    <TabsList className="flex flex-wrap gap-2">
                      {views.map((v) => (
                        <TabsTrigger key={v.id} value={v.id}>{v.label}</TabsTrigger>
                      ))}
                    </TabsList>
                  </div>

                  <div className="sm:hidden">
                    <Select defaultValue={defaultTab} onValueChange={(val) => {
                      const el = document.querySelector<HTMLButtonElement>(`button[data-value="${val}"]`);
                      el?.click();
                    }}>
                      <SelectTrigger><SelectValue placeholder="Select view" /></SelectTrigger>
                      <SelectContent>
                        {views.map((v) => (
                          <SelectItem key={v.id} value={v.id}>{v.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Dirt & Debris */}
                  <TabsContent value="dirt" className="mt-4">
                    <Card className="animate-fade-in bg-gradient-card shadow-medium">
                      <CardHeader>
                        <CardTitle className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <BarChart3 className="w-5 h-5 text-accent" />
                            {dirtDebrisModel!.display_name}
                          </div>
                          <Badge variant="outline">
                            Mean: {getOutputByName<TimeseriesOutput>(dirtDebrisModel!.outputs, "per_frame_count")?.summary?.mean?.toFixed(1)}
                          </Badge>
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ResponsiveContainer width="100%" height={300}>
                          <AreaChart data={dirtDebrisData}>
                            <defs>
                              <linearGradient id="dirtGradient" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="hsl(var(--accent))" stopOpacity={0.3} />
                                <stop offset="95%" stopColor="hsl(var(--accent))" stopOpacity={0} />
                              </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                            <XAxis dataKey="frame" stroke="hsl(var(--muted-foreground))" />
                            <YAxis stroke="hsl(var(--muted-foreground))" />
                            <Tooltip contentStyle={{ backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "0.5rem" }} />
                            <Area type="monotone" dataKey="value" stroke="hsl(var(--accent))" strokeWidth={2} fill="url(#dirtGradient)" />
                          </AreaChart>
                        </ResponsiveContainer>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  {/* Noise */}
                  <TabsContent value="noise" className="mt-4">
                    <Card className="animate-fade-in-delayed bg-gradient-card shadow-medium">
                      <CardHeader>
                        <CardTitle className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <BarChart3 className="w-5 h-5 text-accent" />
                            {noiseModel!.display_name}
                          </div>
                          {getOutputByName<ObjectOutput>(noiseModel!.outputs, "overall_metrics") && (
                            <div className="flex gap-2">
                              <Badge variant="outline">SNR: {getOutputByName<ObjectOutput>(noiseModel!.outputs, "overall_metrics")?.data.snr_db} dB</Badge>
                              <Badge variant="outline">Median σ: {getOutputByName<ObjectOutput>(noiseModel!.outputs, "overall_metrics")?.data.median_sigma}</Badge>
                            </div>
                          )}
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ResponsiveContainer width="100%" height={300}>
                          <AreaChart data={noiseData}>
                            <defs>
                              <linearGradient id="noiseGradient" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                                <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                              </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                            <XAxis dataKey="frame" stroke="hsl(var(--muted-foreground))" />
                            <YAxis stroke="hsl(var(--muted-foreground))" />
                            <Tooltip contentStyle={{ backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "0.5rem" }} />
                            <Area type="monotone" dataKey="value" stroke="hsl(var(--primary))" strokeWidth={2} fill="url(#noiseGradient)" />
                          </AreaChart>
                        </ResponsiveContainer>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  {/* Audio Sync */}
                  <TabsContent value="sync" className="mt-4">
                    <Card className="animate-fade-in-delayed bg-gradient-card shadow-medium">
                      <CardHeader>
                        <CardTitle className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <BarChart3 className="w-5 h-5 text-accent" />
                            {syncModel!.display_name}
                          </div>
                          <Badge variant="outline">
                            Offset: {getOutputByName<ScalarOutput>(syncModel!.outputs, "sync_score")?.value} {getOutputByName<ScalarOutput>(syncModel!.outputs, "sync_score")?.unit}
                          </Badge>
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-center py-8">
                          <div className="text-6xl font-bold text-accent mb-2">
                            {getOutputByName<ScalarOutput>(syncModel!.outputs, "sync_score")?.value}
                          </div>
                          <p className="text-muted-foreground">milliseconds offset</p>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  {/* Transcript */}
                  <TabsContent value="transcript" className="mt-4">
                    <Card className="animate-fade-in-delayed bg-gradient-card shadow-medium">
                      <CardHeader>
                        <CardTitle className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <BarChart3 className="w-5 h-5 text-accent" />
                            {transcriptModel!.display_name}
                          </div>
                          <Badge variant="outline">
                            Language: {getOutputByName<ScalarOutput>(transcriptModel!.outputs, "language")?.value}
                          </Badge>
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="max-h-60 overflow-y-auto rounded-lg bg-secondary/50 p-4">
                          <p className="text-sm text-foreground leading-relaxed">
                            {getOutputByName<TextOutput>(transcriptModel!.outputs, "full_text")?.data}
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>
                </Tabs>
              );
            })()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportDetail;
