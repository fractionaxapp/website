"use client"

import {
	Area,
	AreaChart,
	Bar,
	BarChart,
	CartesianGrid,
	Cell,
	Pie,
	PieChart,
	ResponsiveContainer,
	Tooltip,
	XAxis,
	YAxis,
} from "recharts"

export function AreaTrend({
	data,
	dataKey = "value",
	height = 220,
	color = "var(--primary)",
	xKey = "label",
}: {
	data: Array<Record<string, string | number>>
	dataKey?: string
	xKey?: string
	height?: number
	color?: string
}) {
	return (
		<div style={{ width: "100%", height }}>
			<ResponsiveContainer>
				<AreaChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
					<defs>
						<linearGradient id={`grad-${dataKey}`} x1="0" y1="0" x2="0" y2="1">
							<stop offset="0%" stopColor={color} stopOpacity={0.35} />
							<stop offset="100%" stopColor={color} stopOpacity={0} />
						</linearGradient>
					</defs>
					<CartesianGrid stroke="var(--border)" strokeDasharray="2 4" vertical={false} opacity={0.5} />
					<XAxis
						dataKey={xKey}
						tickLine={false}
						axisLine={false}
						tick={{ fontSize: 10, fill: "var(--muted-foreground)" }}
						minTickGap={20}
					/>
					<YAxis
						tickLine={false}
						axisLine={false}
						tick={{ fontSize: 10, fill: "var(--muted-foreground)" }}
						width={36}
					/>
					<Tooltip
						cursor={{ stroke: "var(--border)", strokeWidth: 1 }}
						contentStyle={{
							background: "var(--popover)",
							border: "1px solid var(--border)",
							borderRadius: 8,
							fontSize: 11,
							color: "var(--foreground)",
						}}
					/>
					<Area
						type="monotone"
						dataKey={dataKey}
						stroke={color}
						strokeWidth={1.5}
						fill={`url(#grad-${dataKey})`}
					/>
				</AreaChart>
			</ResponsiveContainer>
		</div>
	)
}

export function MiniSparkline({
	data,
	dataKey = "value",
	color = "var(--primary)",
	height = 36,
}: {
	data: Array<Record<string, number>>
	dataKey?: string
	color?: string
	height?: number
}) {
	return (
		<div style={{ width: "100%", height }}>
			<ResponsiveContainer>
				<AreaChart data={data} margin={{ top: 2, right: 0, left: 0, bottom: 0 }}>
					<defs>
						<linearGradient id={`spark-${dataKey}-${color}`} x1="0" y1="0" x2="0" y2="1">
							<stop offset="0%" stopColor={color} stopOpacity={0.45} />
							<stop offset="100%" stopColor={color} stopOpacity={0} />
						</linearGradient>
					</defs>
					<Area
						type="monotone"
						dataKey={dataKey}
						stroke={color}
						strokeWidth={1.5}
						fill={`url(#spark-${dataKey}-${color})`}
					/>
				</AreaChart>
			</ResponsiveContainer>
		</div>
	)
}

export function BarSeries({
	data,
	dataKey = "value",
	xKey = "label",
	height = 220,
	color = "var(--primary)",
}: {
	data: Array<Record<string, string | number>>
	dataKey?: string
	xKey?: string
	height?: number
	color?: string
}) {
	return (
		<div style={{ width: "100%", height }}>
			<ResponsiveContainer>
				<BarChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
					<CartesianGrid stroke="var(--border)" strokeDasharray="2 4" vertical={false} opacity={0.5} />
					<XAxis
						dataKey={xKey}
						tickLine={false}
						axisLine={false}
						tick={{ fontSize: 10, fill: "var(--muted-foreground)" }}
					/>
					<YAxis tickLine={false} axisLine={false} tick={{ fontSize: 10, fill: "var(--muted-foreground)" }} width={36} />
					<Tooltip
						cursor={{ fill: "var(--foreground)", fillOpacity: 0.04 }}
						contentStyle={{
							background: "var(--popover)",
							border: "1px solid var(--border)",
							borderRadius: 8,
							fontSize: 11,
							color: "var(--foreground)",
						}}
					/>
					<Bar dataKey={dataKey} fill={color} radius={[4, 4, 0, 0]} />
				</BarChart>
			</ResponsiveContainer>
		</div>
	)
}

const PIE_COLORS = [
	"var(--primary)",
	"#3b82f6",
	"#f59e0b",
	"#a855f7",
	"#ef4444",
	"#10b981",
]

export function Donut({
	data,
	height = 220,
	innerRadius = 60,
	outerRadius = 90,
}: {
	data: Array<{ label: string; value: number }>
	height?: number
	innerRadius?: number
	outerRadius?: number
}) {
	return (
		<div style={{ width: "100%", height }}>
			<ResponsiveContainer>
				<PieChart>
					<Pie
						data={data}
						dataKey="value"
						nameKey="label"
						innerRadius={innerRadius}
						outerRadius={outerRadius}
						stroke="var(--background)"
						strokeWidth={2}
					>
						{data.map((_, i) => (
							<Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
						))}
					</Pie>
					<Tooltip
						contentStyle={{
							background: "var(--popover)",
							border: "1px solid var(--border)",
							borderRadius: 8,
							fontSize: 11,
							color: "var(--foreground)",
						}}
					/>
				</PieChart>
			</ResponsiveContainer>
		</div>
	)
}
