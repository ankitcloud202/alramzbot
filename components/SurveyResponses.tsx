"use client"

import { format } from "date-fns"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Amplify } from 'aws-amplify';
import outputs from '../amplify_outputs.json';
import useSWR from "swr";
import { generateClient } from "aws-amplify/api";
import { Schema } from "@/amplify/data/resource";
Amplify.configure(outputs);

const client = generateClient<Schema>();

export const fetcher = async ()=>{
  try{
    const res = await client.models.Todo.list();
    return res.data;
  }catch(e){
    console.error("Error fetching data:", e)
  }
}


// Sample data based on the provided JSON structure
// const recentResponses = [
//   {
//     id: 1,
//     timestamp: 1744093339.29118,
//     customer_phone: "+918770486996",
//     Attributes: {
//       Question1: "1",
//       Question2: "2",
//       Question3: "3",
//       Question4: "4",
//       Question5: "5",
//     },
//   },
//   {
//     id: 2,
//     timestamp: 1744093200.12345,
//     customer_phone: "+918770123456",
//     Attributes: {
//       Question1: "4",
//       Question2: "4",
//       Question3: "5",
//       Question4: "3",
//       Question5: "4",
//     },
//   },
//   {
//     id: 3,
//     timestamp: 1744092900.54321,
//     customer_phone: "+918770789012",
//     Attributes: {
//       Question1: "3",
//       Question2: "3",
//       Question3: "2",
//       Question4: "4",
//       Question5: "3",
//     },
//   },
//   {
//     id: 4,
//     timestamp: 1744092600.98765,
//     customer_phone: "+918770345678",
//     Attributes: {
//       Question1: "5",
//       Question2: "4",
//       Question3: "5",
//       Question4: "5",
//       Question5: "5",
//     },
//   },
//   {
//     id: 5,
//     timestamp: 1744092300.2468,
//     customer_phone: "+918770901234",
//     Attributes: {
//       Question1: "2",
//       Question2: "1",
//       Question3: "3",
//       Question4: "2",
//       Question5: "2",
//     },
//   },
// ]

export function SurveyResponses() {
    const {data, error} = useSWR(`/api/Calls`, fetcher)
  if(error) return <div>Error fetching data</div>

  if(data){
    console.log("Data:", data);
  }
  // Calculate average rating for each response
  const getAverageRating = (attributes: Record<string, string | null>) => {
      const values = Object.values(attributes)
        .filter((v): v is string => v !== null) // Filter out null values
        .map((v) => Number.parseInt(v));
      const sum = values.reduce((acc, val) => acc + val, 0);
      return (sum / values.length).toFixed(1);
  }

  return (
    <div className="space-y-4">
    
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Date - <span className="text-muted-foreground text-sm">dd/MM/yyyy</span></TableHead>
            <TableHead>Phone</TableHead>
            <TableHead className="text-center">Q1</TableHead>
            <TableHead className="text-center">Q2</TableHead>
            <TableHead className="text-center">Q3</TableHead>
            <TableHead className="text-center">Q4</TableHead>
            <TableHead className="text-center">Q5</TableHead>
            <TableHead className="text-right">Sentiment Score</TableHead>
            <TableHead className="text-right">Avg</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data && data.map((response) => {
            const avgRating = response.Attributes 
              ? Number.parseFloat(getAverageRating(response.Attributes)) 
              : 0;
            return (
              <TableRow key={response.id}>
                <TableCell className="font-medium">
                  {format(new Date(response.createdAt), "dd/MM/yyyy")}
                </TableCell>
                <TableCell>{response.customer_phone}</TableCell>
                <TableCell className="text-center">{response.Attributes?.Question1}</TableCell>
                <TableCell className="text-center">{response.Attributes?.Question2}</TableCell>
                <TableCell className="text-center">{response.Attributes?.Question3}</TableCell>
                <TableCell className="text-center">{response.Attributes?.Question4}</TableCell>
                <TableCell className="text-center">{response.Attributes?.Question5}</TableCell>
                <TableCell className="text-right">{response.sentimentScore}</TableCell>
                <TableCell className="text-right">
                <Badge variant={
                    isNaN(avgRating)
                        ? "outline"
                        : avgRating < 3
                        ? "destructive"
                        : avgRating > 4
                        ? "default"
                        : "outline"
                    }>
                    {isNaN(avgRating) ? "N/A" : avgRating.toFixed(1)}
                    </Badge>
                </TableCell>
              </TableRow>
            )
          })}
        </TableBody>
      </Table>
    </div>
  )
}
