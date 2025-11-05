// Backend response types for film digitization reports

export interface ReportResponse {
  version: string;
  run_id: string;
  created_at: string;
  input: {
    type: string;
    uri: string;
    duration_sec: number;
    fps: number;
  };
  selected_models: string[];
  models: ModelResult[];
  errors: string[];
  report: {
    summary: string;
    thumbnails: Array<{
      label: string;
      uri: string;
    }>;
  };
}

export interface ModelResult {
  model_id: string;
  display_name: string;
  version: string;
  task_kind: 'classification' | 'regression' | 'timeseries' | 'text';
  status: 'succeeded' | 'failed' | 'pending';
  outputs: ModelOutput[];
  is_editable: boolean;
}

export type ModelOutput = 
  | ScalarOutput
  | TextOutput
  | TimeseriesOutput
  | SpansOutput
  | ObjectOutput;

export interface ScalarOutput {
  name: string;
  kind: 'scalar/string' | 'scalar/number' | 'scalar/string|nullable';
  value?: string | number;
  confidence?: number;
  unit?: string;
}

export interface TextOutput {
  name: string;
  kind: 'text';
  data: string;
}

export interface TimeseriesOutput {
  name: string;
  kind: 'timeseries/number';
  sampling: {
    unit: string;
    fps: number;
  };
  unit?: string;
  summary?: {
    mean?: number;
    p95?: number;
    max?: number;
    min?: number;
    median?: number;
  };
  preview: number[];
}

export interface SpansOutput {
  name: string;
  kind: 'spans/text';
  data: Array<{
    start: number;
    end: number;
    text: string;
  }>;
}

export interface ObjectOutput {
  name: string;
  kind: 'object';
  data: Record<string, any>;
}

// Helper function to get output by name
export function getOutputByName<T extends ModelOutput>(
  outputs: ModelOutput[],
  name: string
): T | undefined {
  return outputs.find(output => output.name === name) as T | undefined;
}

// Helper function to convert timeseries preview to chart data
export interface ChartDataPoint {
  frame: number;
  value: number;
}

export function timeseriesToChartData(
  output: TimeseriesOutput,
  totalFrames?: number
): ChartDataPoint[] {
  const { preview, sampling } = output;
  const frameStep = totalFrames 
    ? Math.floor(totalFrames / preview.length)
    : 1;
  
  return preview.map((value, index) => ({
    frame: index * frameStep,
    value,
  }));
}
