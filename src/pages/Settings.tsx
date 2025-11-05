import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Settings as SettingsIcon, Save, RotateCcw, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { toast } from "@/hooks/use-toast";

const Settings = () => {
  const navigate = useNavigate();

  const [settings, setSettings] = useState({
    // Input/Output
    video: "data/raw/16mm_PositiveNews.mp4",
    
    // Frame extraction
    fpsExtract: 4,
    secondsPerFrame: 60,
    sampleEveryNthFrame: 1,
    
    // Preprocessing toggles
    denoise: true,
    denoiseStrength: 3,
    doGrayWorld: true,
    doMsrcr: true,
    msrSigmas: "15,80,250",
    msrGain: 1.0,
    msrOffset: 0.0,
    doClahe: true,
    claheClip: 2.0,
    claheGrid: 8,
    doGamma: true,
    targetMean: 0.5,
    doUnsharp: true,
    unsharpSigma: 1.0,
    unsharpAmount: 1.0,
    doUnsharpH: true,
    unsharpHKsize: 9,
    unsharpHAmount: 0.7,
    edgeBoost: true,
    edgeKsize: 3,
    edgeXAmount: 0.4,
    edgeYAmount: 0.0,
    
    // Models
    modelPerforations: true,
    modelAspectRatio: true,
  });

  const defaultSettings = { ...settings };

  const handleSave = () => {
    toast({
      title: "Settings saved",
      description: "Your configuration parameters have been updated successfully",
    });
  };

  const handleReset = () => {
    setSettings(defaultSettings);
    toast({
      title: "Settings reset",
      description: "All parameters have been restored to default values",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/20">
      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8 animate-fade-in">
          <Button
            variant="ghost"
            onClick={() => navigate("/")}
            className="mb-4 hover:bg-accent/10"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Button>
          <div className="flex items-center gap-3 mb-2">
            <SettingsIcon className="w-8 h-8 text-accent" />
            <h1 className="text-4xl font-bold text-foreground">Analysis Settings</h1>
          </div>
          <p className="text-muted-foreground text-lg">
            Configure film processing and analysis parameters
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Input/Output Settings */}
          <Card className="animate-fade-in bg-gradient-card shadow-medium">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Upload className="w-5 h-5 text-accent" />
                Input/Output Settings
              </CardTitle>
              <CardDescription>
                Configure video input and frame extraction
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="video" className="text-base font-semibold">
                  Video Path
                </Label>
                <Input
                  id="video"
                  type="text"
                  value={settings.video}
                  onChange={(e) => setSettings({ ...settings, video: e.target.value })}
                  className="font-mono text-sm"
                />
                <p className="text-xs text-muted-foreground">
                  Path to input MP4 file (absolute or relative)
                </p>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="fpsExtract" className="text-base font-semibold">
                      Frame Extraction Rate
                    </Label>
                    <p className="text-xs text-muted-foreground">Frames per second to extract</p>
                  </div>
                  <Input
                    id="fpsExtract"
                    type="number"
                    value={settings.fpsExtract}
                    onChange={(e) => setSettings({ ...settings, fpsExtract: Number(e.target.value) })}
                    className="w-20 text-right"
                    min={1}
                    max={60}
                  />
                </div>
                <Slider
                  value={[settings.fpsExtract]}
                  onValueChange={(value) => setSettings({ ...settings, fpsExtract: value[0] })}
                  min={1}
                  max={60}
                  step={1}
                />
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="secondsPerFrame" className="text-base font-semibold">
                      Seconds Per Frame
                    </Label>
                    <p className="text-xs text-muted-foreground">Sampling interval in seconds</p>
                  </div>
                  <Input
                    id="secondsPerFrame"
                    type="number"
                    value={settings.secondsPerFrame}
                    onChange={(e) => setSettings({ ...settings, secondsPerFrame: Number(e.target.value) })}
                    className="w-20 text-right"
                    min={1}
                    max={120}
                  />
                </div>
                <Slider
                  value={[settings.secondsPerFrame]}
                  onValueChange={(value) => setSettings({ ...settings, secondsPerFrame: value[0] })}
                  min={1}
                  max={120}
                  step={1}
                />
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="sampleEveryNthFrame" className="text-base font-semibold">
                      Sample Every Nth Frame
                    </Label>
                    <p className="text-xs text-muted-foreground">1 = keep all frames</p>
                  </div>
                  <Input
                    id="sampleEveryNthFrame"
                    type="number"
                    value={settings.sampleEveryNthFrame}
                    onChange={(e) => setSettings({ ...settings, sampleEveryNthFrame: Number(e.target.value) })}
                    className="w-20 text-right"
                    min={1}
                    max={10}
                  />
                </div>
                <Slider
                  value={[settings.sampleEveryNthFrame]}
                  onValueChange={(value) => setSettings({ ...settings, sampleEveryNthFrame: value[0] })}
                  min={1}
                  max={10}
                  step={1}
                />
              </div>
            </CardContent>
          </Card>

          {/* Model Selection */}
          <Card className="animate-fade-in bg-gradient-card shadow-medium">
            <CardHeader>
              <CardTitle>Active Models</CardTitle>
              <CardDescription>
                Select which detection models to run
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 rounded-lg bg-secondary/50">
                <div className="flex-1">
                  <Label htmlFor="modelPerforations" className="text-base font-semibold cursor-pointer">
                    Perforation Detection
                  </Label>
                  <p className="text-sm text-muted-foreground mt-1">
                    Detect sprocket holes using sprocket_holes.pt model
                  </p>
                </div>
                <Switch
                  id="modelPerforations"
                  checked={settings.modelPerforations}
                  onCheckedChange={(checked) => setSettings({ ...settings, modelPerforations: checked })}
                />
              </div>

              <div className="flex items-center justify-between p-4 rounded-lg bg-secondary/50">
                <div className="flex-1">
                  <Label htmlFor="modelAspectRatio" className="text-base font-semibold cursor-pointer">
                    Aspect Ratio Detection
                  </Label>
                  <p className="text-sm text-muted-foreground mt-1">
                    Detect frame boundaries using frame_model.pt
                  </p>
                </div>
                <Switch
                  id="modelAspectRatio"
                  checked={settings.modelAspectRatio}
                  onCheckedChange={(checked) => setSettings({ ...settings, modelAspectRatio: checked })}
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Preprocessing Operations */}
        <Card className="mt-6 animate-fade-in-delayed bg-gradient-card shadow-medium">
          <CardHeader>
            <CardTitle>Preprocessing Operations</CardTitle>
            <CardDescription>
              Configure image enhancement and preprocessing steps
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Denoise */}
              <div className="space-y-4 p-4 rounded-lg bg-secondary/30">
                <div className="flex items-center justify-between">
                  <Label htmlFor="denoise" className="text-base font-semibold cursor-pointer">
                    Denoise
                  </Label>
                  <Switch
                    id="denoise"
                    checked={settings.denoise}
                    onCheckedChange={(checked) => setSettings({ ...settings, denoise: checked })}
                  />
                </div>
                {settings.denoise && (
                  <div className="space-y-2 pl-4 border-l-2 border-accent/50">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="denoiseStrength" className="text-sm">Strength</Label>
                      <Input
                        id="denoiseStrength"
                        type="number"
                        value={settings.denoiseStrength}
                        onChange={(e) => setSettings({ ...settings, denoiseStrength: Number(e.target.value) })}
                        className="w-16 h-8 text-sm"
                        min={1}
                        max={10}
                      />
                    </div>
                    <Slider
                      value={[settings.denoiseStrength]}
                      onValueChange={(value) => setSettings({ ...settings, denoiseStrength: value[0] })}
                      min={1}
                      max={10}
                      step={1}
                    />
                  </div>
                )}
              </div>

              {/* Gray World */}
              <div className="space-y-4 p-4 rounded-lg bg-secondary/30">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="doGrayWorld" className="text-base font-semibold cursor-pointer">
                      Gray World Color Balance
                    </Label>
                    <p className="text-xs text-muted-foreground mt-1">Auto white balance</p>
                  </div>
                  <Switch
                    id="doGrayWorld"
                    checked={settings.doGrayWorld}
                    onCheckedChange={(checked) => setSettings({ ...settings, doGrayWorld: checked })}
                  />
                </div>
              </div>

              {/* MSRCR */}
              <div className="space-y-4 p-4 rounded-lg bg-secondary/30">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="doMsrcr" className="text-base font-semibold cursor-pointer">
                      Multi-Scale Retinex (MSRCR)
                    </Label>
                    <p className="text-xs text-muted-foreground mt-1">Color restoration</p>
                  </div>
                  <Switch
                    id="doMsrcr"
                    checked={settings.doMsrcr}
                    onCheckedChange={(checked) => setSettings({ ...settings, doMsrcr: checked })}
                  />
                </div>
                {settings.doMsrcr && (
                  <div className="space-y-3 pl-4 border-l-2 border-accent/50">
                    <div className="space-y-2">
                      <Label htmlFor="msrSigmas" className="text-sm">Sigmas</Label>
                      <Input
                        id="msrSigmas"
                        type="text"
                        value={settings.msrSigmas}
                        onChange={(e) => setSettings({ ...settings, msrSigmas: e.target.value })}
                        className="h-8 text-sm font-mono"
                      />
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="msrGain" className="text-sm">Gain</Label>
                        <Input
                          id="msrGain"
                          type="number"
                          step="0.1"
                          value={settings.msrGain}
                          onChange={(e) => setSettings({ ...settings, msrGain: Number(e.target.value) })}
                          className="w-20 h-8 text-sm"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="msrOffset" className="text-sm">Offset</Label>
                        <Input
                          id="msrOffset"
                          type="number"
                          step="0.1"
                          value={settings.msrOffset}
                          onChange={(e) => setSettings({ ...settings, msrOffset: Number(e.target.value) })}
                          className="w-20 h-8 text-sm"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* CLAHE */}
              <div className="space-y-4 p-4 rounded-lg bg-secondary/30">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="doClahe" className="text-base font-semibold cursor-pointer">
                      CLAHE
                    </Label>
                    <p className="text-xs text-muted-foreground mt-1">Contrast enhancement</p>
                  </div>
                  <Switch
                    id="doClahe"
                    checked={settings.doClahe}
                    onCheckedChange={(checked) => setSettings({ ...settings, doClahe: checked })}
                  />
                </div>
                {settings.doClahe && (
                  <div className="space-y-3 pl-4 border-l-2 border-accent/50">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="claheClip" className="text-sm">Clip Limit</Label>
                        <Input
                          id="claheClip"
                          type="number"
                          step="0.1"
                          value={settings.claheClip}
                          onChange={(e) => setSettings({ ...settings, claheClip: Number(e.target.value) })}
                          className="w-20 h-8 text-sm"
                        />
                      </div>
                      <Slider
                        value={[settings.claheClip]}
                        onValueChange={(value) => setSettings({ ...settings, claheClip: value[0] })}
                        min={0.5}
                        max={5}
                        step={0.1}
                      />
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="claheGrid" className="text-sm">Grid Size</Label>
                        <Input
                          id="claheGrid"
                          type="number"
                          value={settings.claheGrid}
                          onChange={(e) => setSettings({ ...settings, claheGrid: Number(e.target.value) })}
                          className="w-16 h-8 text-sm"
                        />
                      </div>
                      <Slider
                        value={[settings.claheGrid]}
                        onValueChange={(value) => setSettings({ ...settings, claheGrid: value[0] })}
                        min={4}
                        max={16}
                        step={1}
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Gamma */}
              <div className="space-y-4 p-4 rounded-lg bg-secondary/30">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="doGamma" className="text-base font-semibold cursor-pointer">
                      Gamma Correction
                    </Label>
                    <p className="text-xs text-muted-foreground mt-1">Brightness adjustment</p>
                  </div>
                  <Switch
                    id="doGamma"
                    checked={settings.doGamma}
                    onCheckedChange={(checked) => setSettings({ ...settings, doGamma: checked })}
                  />
                </div>
                {settings.doGamma && (
                  <div className="space-y-2 pl-4 border-l-2 border-accent/50">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="targetMean" className="text-sm">Target Mean</Label>
                      <Input
                        id="targetMean"
                        type="number"
                        step="0.1"
                        value={settings.targetMean}
                        onChange={(e) => setSettings({ ...settings, targetMean: Number(e.target.value) })}
                        className="w-20 h-8 text-sm"
                      />
                    </div>
                    <Slider
                      value={[settings.targetMean]}
                      onValueChange={(value) => setSettings({ ...settings, targetMean: value[0] })}
                      min={0.1}
                      max={1}
                      step={0.05}
                    />
                  </div>
                )}
              </div>

              {/* Unsharp Mask */}
              <div className="space-y-4 p-4 rounded-lg bg-secondary/30">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="doUnsharp" className="text-base font-semibold cursor-pointer">
                      Unsharp Mask
                    </Label>
                    <p className="text-xs text-muted-foreground mt-1">Sharpening filter</p>
                  </div>
                  <Switch
                    id="doUnsharp"
                    checked={settings.doUnsharp}
                    onCheckedChange={(checked) => setSettings({ ...settings, doUnsharp: checked })}
                  />
                </div>
                {settings.doUnsharp && (
                  <div className="space-y-3 pl-4 border-l-2 border-accent/50">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="unsharpSigma" className="text-sm">Sigma</Label>
                        <Input
                          id="unsharpSigma"
                          type="number"
                          step="0.1"
                          value={settings.unsharpSigma}
                          onChange={(e) => setSettings({ ...settings, unsharpSigma: Number(e.target.value) })}
                          className="w-20 h-8 text-sm"
                        />
                      </div>
                      <Slider
                        value={[settings.unsharpSigma]}
                        onValueChange={(value) => setSettings({ ...settings, unsharpSigma: value[0] })}
                        min={0.5}
                        max={3}
                        step={0.1}
                      />
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="unsharpAmount" className="text-sm">Amount</Label>
                        <Input
                          id="unsharpAmount"
                          type="number"
                          step="0.1"
                          value={settings.unsharpAmount}
                          onChange={(e) => setSettings({ ...settings, unsharpAmount: Number(e.target.value) })}
                          className="w-20 h-8 text-sm"
                        />
                      </div>
                      <Slider
                        value={[settings.unsharpAmount]}
                        onValueChange={(value) => setSettings({ ...settings, unsharpAmount: value[0] })}
                        min={0.5}
                        max={2}
                        step={0.1}
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Unsharp Horizontal */}
              <div className="space-y-4 p-4 rounded-lg bg-secondary/30">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="doUnsharpH" className="text-base font-semibold cursor-pointer">
                      Horizontal Unsharp
                    </Label>
                    <p className="text-xs text-muted-foreground mt-1">Directional sharpening</p>
                  </div>
                  <Switch
                    id="doUnsharpH"
                    checked={settings.doUnsharpH}
                    onCheckedChange={(checked) => setSettings({ ...settings, doUnsharpH: checked })}
                  />
                </div>
                {settings.doUnsharpH && (
                  <div className="space-y-3 pl-4 border-l-2 border-accent/50">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="unsharpHKsize" className="text-sm">Kernel Size</Label>
                        <Input
                          id="unsharpHKsize"
                          type="number"
                          value={settings.unsharpHKsize}
                          onChange={(e) => setSettings({ ...settings, unsharpHKsize: Number(e.target.value) })}
                          className="w-16 h-8 text-sm"
                        />
                      </div>
                      <Slider
                        value={[settings.unsharpHKsize]}
                        onValueChange={(value) => setSettings({ ...settings, unsharpHKsize: value[0] })}
                        min={3}
                        max={15}
                        step={2}
                      />
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="unsharpHAmount" className="text-sm">Amount</Label>
                        <Input
                          id="unsharpHAmount"
                          type="number"
                          step="0.1"
                          value={settings.unsharpHAmount}
                          onChange={(e) => setSettings({ ...settings, unsharpHAmount: Number(e.target.value) })}
                          className="w-20 h-8 text-sm"
                        />
                      </div>
                      <Slider
                        value={[settings.unsharpHAmount]}
                        onValueChange={(value) => setSettings({ ...settings, unsharpHAmount: value[0] })}
                        min={0.1}
                        max={2}
                        step={0.1}
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Edge Boost */}
              <div className="space-y-4 p-4 rounded-lg bg-secondary/30">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="edgeBoost" className="text-base font-semibold cursor-pointer">
                      Edge Boost
                    </Label>
                    <p className="text-xs text-muted-foreground mt-1">Edge enhancement</p>
                  </div>
                  <Switch
                    id="edgeBoost"
                    checked={settings.edgeBoost}
                    onCheckedChange={(checked) => setSettings({ ...settings, edgeBoost: checked })}
                  />
                </div>
                {settings.edgeBoost && (
                  <div className="space-y-3 pl-4 border-l-2 border-accent/50">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="edgeKsize" className="text-sm">Kernel Size</Label>
                        <Input
                          id="edgeKsize"
                          type="number"
                          value={settings.edgeKsize}
                          onChange={(e) => setSettings({ ...settings, edgeKsize: Number(e.target.value) })}
                          className="w-16 h-8 text-sm"
                        />
                      </div>
                      <Slider
                        value={[settings.edgeKsize]}
                        onValueChange={(value) => setSettings({ ...settings, edgeKsize: value[0] })}
                        min={3}
                        max={9}
                        step={2}
                      />
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="edgeXAmount" className="text-sm">X Amount</Label>
                        <Input
                          id="edgeXAmount"
                          type="number"
                          step="0.1"
                          value={settings.edgeXAmount}
                          onChange={(e) => setSettings({ ...settings, edgeXAmount: Number(e.target.value) })}
                          className="w-20 h-8 text-sm"
                        />
                      </div>
                      <Slider
                        value={[settings.edgeXAmount]}
                        onValueChange={(value) => setSettings({ ...settings, edgeXAmount: value[0] })}
                        min={0}
                        max={1}
                        step={0.1}
                      />
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="edgeYAmount" className="text-sm">Y Amount</Label>
                        <Input
                          id="edgeYAmount"
                          type="number"
                          step="0.1"
                          value={settings.edgeYAmount}
                          onChange={(e) => setSettings({ ...settings, edgeYAmount: Number(e.target.value) })}
                          className="w-20 h-8 text-sm"
                        />
                      </div>
                      <Slider
                        value={[settings.edgeYAmount]}
                        onValueChange={(value) => setSettings({ ...settings, edgeYAmount: value[0] })}
                        min={0}
                        max={1}
                        step={0.1}
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex gap-4 justify-end mt-6 animate-fade-in-delayed">
          <Button
            variant="outline"
            onClick={handleReset}
            className="hover:bg-destructive/10 hover:text-destructive hover:border-destructive"
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            Reset to Defaults
          </Button>
          <Button
            onClick={handleSave}
            className="bg-gradient-accent hover:opacity-90 text-primary-foreground font-semibold"
          >
            <Save className="w-4 h-4 mr-2" />
            Save Configuration
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Settings;
