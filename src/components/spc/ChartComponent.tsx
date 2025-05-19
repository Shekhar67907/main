import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ReferenceLine, ResponsiveContainer, BarChart, Bar
} from "recharts";
import { 
  ControlChartData,
  SSAnalysis,
  ProcessInterpretation
} from "@/types/spc";

// Animation variants
const fadeIn = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.3 }
};

export function ControlCharts({ chartData }: { chartData: ControlChartData }) {
  return (
    <motion.div {...fadeIn}>
      <Card className="mt-4">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg text-blue-600">Control Charts</CardTitle>
          <CardDescription>X-Bar and Range Charts</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {[
              {
                title: "X-Bar Chart",
                data: chartData.xBarData,
                limits: {
                  ucl: chartData.limits.xBarUcl,
                  mean: chartData.limits.xBarMean,
                  lcl: chartData.limits.xBarLcl
                },
                dataKey: "Value",
                stroke: "#8884d8",
                yLabel: "Value"
              },
              {
                title: "Range Chart",
                data: chartData.rangeData,
                limits: {
                  ucl: chartData.limits.rangeUcl,
                  mean: chartData.limits.rangeMean,
                  lcl: chartData.limits.rangeLcl
                },
                dataKey: "Range",
                stroke: "#82ca9d",
                yLabel: "Range"
              }
            ].map((chart, i) => (
              <div key={i} className="h-56">
                <h3 className="text-sm font-medium mb-1">{chart.title}</h3>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chart.data} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="x" label={{ value: 'Sample', position: 'insideBottomRight', offset: -5 }} />
                    <YAxis 
                      label={{ value: chart.yLabel, angle: -90, position: 'insideLeft' }} 
                      domain={i === 0 ? 
                        [Math.floor(chart.limits.lcl - (chart.limits.ucl - chart.limits.lcl) * 0.2), 'auto'] : 
                        [0, 'auto']} 
                      ticks={[chart.limits.lcl, chart.limits.mean, chart.limits.ucl]}
                      tickFormatter={(value) => {
                        // Format tick to show the value
                        if (value === chart.limits.ucl) return `UCL: ${value.toFixed(3)}`;
                        if (value === chart.limits.lcl) return `LCL: ${value.toFixed(3)}`;
                        if (value === chart.limits.mean) return `${i === 0 ? "Xbar" : "Rbar"}: ${value.toFixed(3)}`;
                        return value.toFixed(3);
                      }}
                    />
                    <Tooltip />
                    <Legend />
                    <ReferenceLine y={chart.limits.ucl} stroke="red" strokeDasharray="3 3" label="UCL" />
                    <ReferenceLine y={chart.limits.mean} stroke="blue" label={i === 0 ? "X-Bar" : "R-Bar"} />
                    <ReferenceLine y={chart.limits.lcl} stroke="red" strokeDasharray="3 3" label="LCL" />
                    <Line type="monotone" dataKey="y" name={chart.dataKey} stroke={chart.stroke} dot={{ r: 2 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
export function Histogram({ data, stats, lsl, usl }: {
  data: Array<{x: number; y: number}>;
  stats: {mean: number; stdDev: number; target: number; ucl: number; lcl: number};
  lsl: number;
  usl: number;
}) {
  return (
    <motion.div {...fadeIn}>
      <Card className="mt-4">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg text-blue-600">Histogram</CardTitle>
          <CardDescription>Distribution of measurements</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="x" 
                  label={{ value: 'Value', position: 'insideBottomRight', offset: -5 }} 
                />
                <YAxis 
                  label={{ value: 'Frequency', angle: -90, position: 'insideLeft' }} 
                />
                <Tooltip />
                {/* Specification Limits */}
                <ReferenceLine x={lsl} stroke="red" label={{ value: "LSL", position: "top" }} />
                <ReferenceLine x={usl} stroke="red" label={{ value: "USL", position: "top" }} />
                
                {/* Control Limits */}
                <ReferenceLine 
                  x={stats.ucl} 
                  stroke="#ff8c00" 
                  strokeDasharray="3 3" 
                  label={{ value: "UCL", position: "top" }} 
                />
                <ReferenceLine 
                  x={stats.lcl} 
                  stroke="#ff8c00" 
                  strokeDasharray="3 3" 
                  label={{ value: "LCL", position: "top" }} 
                />
                
                {/* Target and Mean */}
                <ReferenceLine 
                  x={stats.target} 
                  stroke="green" 
                  label={{ value: "Target", position: "top" }} 
                />
                <ReferenceLine 
                  x={stats.mean} 
                  stroke="blue" 
                  label={{ value: "Mean", position: "top" }} 
                />
                
                <Bar 
                  dataKey="y" 
                  fill="#8884d8"
                  opacity={0.8}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
          
          {/* Legend */}
          <div className="mt-4 flex flex-wrap gap-4 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-4 h-0.5 bg-red-500" />
              <span>Spec Limits (LSL/USL)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-0.5 bg-[#ff8c00] border-dashed" />
              <span>Control Limits (LCL/UCL)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-0.5 bg-green-500" />
              <span>Target</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-0.5 bg-blue-500" />
              <span>Process Mean</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}


export function AnalysisCards({ ssAnalysis, processInterpretation }: {
  ssAnalysis: SSAnalysis;
  processInterpretation: ProcessInterpretation;
}) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
      <motion.div {...fadeIn}>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg text-blue-600">3S Analysis</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {Object.entries(ssAnalysis).map(([key, value]) => (
                <div key={key} className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">
                    {key.replace(/([A-Z])/g, " $1").trim()}
                  </span>
                  <span className={cn(
                    "font-medium",
                    value.toLowerCase().includes("detected") || value === "Yes" ? "text-red-500" : "text-green-500"
                  )}>
                    {value}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div {...fadeIn}>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg text-blue-600">Process Interpretation</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {Object.entries(processInterpretation).map(([key, value]) => (
                <div key={key} className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">
                    {key.replace(/([A-Z])/g, " $1").trim()}
                  </span>
                  <span className="font-medium text-blue-500">{value}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}