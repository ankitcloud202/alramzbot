"use client"

import {
  BarChart,
  Bar,
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
const ratingScale = ["1", "2", "3", "4", "5"]
// type SurveyResponse = Schema['Todo']['type']

export function SurveyResponsesChart() {
  const { data: responses, error } = useSWR(`/api/Calls`, fetcher)
  if (error) return <div>Error fetching data</div>
  if (!responses) return <div>Loading...</div>

  // Initialize rating counts
  const ratingCounts: Record<string, Record<string, number>> = {}
  questions.forEach((q) => {
    ratingCounts[q] = {}
    ratingScale.forEach((r) => {
      ratingCounts[q][`Rating ${r}`] = 0
    })
  })

  // Aggregate the ratings
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  responses.forEach((res: any) => {
    const attrs = res.Attributes || {}
    questions.forEach((q) => {
      const rating = attrs[q]
      if (rating && ratingCounts[q][`Rating ${rating}`] !== undefined) {
        ratingCounts[q][`Rating ${rating}`] += 1
      }
    })
  })

  // Transform into chartData format
  const chartData = questions.map((q, index) => ({
    name: `Q${index + 1}`,
    ...ratingCounts[q],
  }))

  return (
    <ResponsiveContainer width="100%" height={350}>
      <BarChart
        data={chartData}
        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="Rating 1" stackId="a" fill="#ff8042" />
        <Bar dataKey="Rating 2" stackId="a" fill="#ffc658" />
        <Bar dataKey="Rating 3" stackId="a" fill="#82ca9d" />
        <Bar dataKey="Rating 4" stackId="a" fill="#8884d8" />
        <Bar dataKey="Rating 5" stackId="a" fill="#0088fe" />
      </BarChart>
    </ResponsiveContainer>
  )
}
