"use client"

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"
import useSWR from "swr"
import { fetcher } from "./SurveyResponses"

const questions = ["Question1", "Question2", "Question3", "Question4", "Question5"]

function getMonthNameFromTimestamp(timestamp: number) {
  const date = new Date(timestamp * 1000) // Convert from seconds to ms
  return date.toLocaleString("default", { month: "short" }) // 'Jan', 'Feb', etc.
}

export function SurveyResponsesLineChart() {
  const { data: responses, error } = useSWR(`/api/Calls`, fetcher)
  if (error) return <div>Error fetching data</div>
  if (!responses) return <div>Loading...</div>

  // Group responses by month
  const monthMap: Record<
    string,
    { [key: string]: number[] } // question -> array of ratings
  > = {}

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  responses.forEach((res: any) => {
    const month = getMonthNameFromTimestamp(res.timestamp)
    if (!monthMap[month]) {
      monthMap[month] = {}
      questions.forEach((q) => {
        monthMap[month][q] = []
      })
    }

    questions.forEach((q) => {
      const rating = parseFloat(res.Attributes?.[q])
      if (!isNaN(rating)) {
        monthMap[month][q].push(rating)
      }
    })
  })

  // Build chartData: average per question per month
  const chartData = Object.entries(monthMap).map(([month, ratings]) => {
    const averages: Record<string, number> = {}
    questions.forEach((q) => {
      const values = ratings[q]
      const avg = values.length > 0 ? values.reduce((a, b) => a + b, 0) / values.length : 0
      averages[`Question ${q.slice(-1)}`] = parseFloat(avg.toFixed(2))
    })
    return {
      name: month,
      ...averages,
    }
  })

  // Sort months in correct order (Jan, Feb, ...)
  const monthOrder = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
  chartData.sort((a, b) => monthOrder.indexOf(a.name) - monthOrder.indexOf(b.name))

  return (
    <ResponsiveContainer width="100%" height={350}>
      <LineChart
        data={chartData}
        margin={{ top: 5, right: 10, left: 10, bottom: 0 }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis domain={[0, 5]} />
        <Tooltip />
        <Legend />
        <Line type="monotone" dataKey="Question 1" stroke="#8884d8" activeDot={{ r: 8 }} />
        <Line type="monotone" dataKey="Question 2" stroke="#82ca9d" />
        <Line type="monotone" dataKey="Question 3" stroke="#ffc658" />
        <Line type="monotone" dataKey="Question 4" stroke="#ff8042" />
        <Line type="monotone" dataKey="Question 5" stroke="#0088fe" />
      </LineChart>
    </ResponsiveContainer>
  )
}
