"use client"

import { useState } from "react"
import { Plus, Trash2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { FileUploader } from "@aws-amplify/ui-react-storage"
import GenerationalChatBot from "./GenerationalChatBot"


interface Option {
  id: string
  text: string
}

interface Question {
  id: string
  text: string
  options: Option[]
}

export default function QuestionForm() {
  const [questions, setQuestions] = useState<Question[]>([
    {
      id: "1",
      text: "",
      options: [{ id: "1-1", text: "" }],
    },
  ])

  const addQuestion = () => {
    const newId = String(questions.length + 1)
    setQuestions([
      ...questions,
      {
        id: newId,
        text: "",
        options: [{ id: `${newId}-1`, text: "" }],
      },
    ])
  }

  const addOption = (questionId: string) => {
    setQuestions(
      questions.map((question) => {
        if (question.id === questionId) {
          const newOptionId = `${questionId}-${question.options.length + 1}`
          return {
            ...question,
            options: [...question.options, { id: newOptionId, text: "" }],
          }
        }
        return question
      }),
    )
  }

  const updateQuestionText = (questionId: string, text: string) => {
    setQuestions(questions.map((question) => (question.id === questionId ? { ...question, text } : question)))
  }

  const updateOptionText = (questionId: string, optionId: string, text: string) => {
    setQuestions(
      questions.map((question) => {
        if (question.id === questionId) {
          return {
            ...question,
            options: question.options.map((option) => (option.id === optionId ? { ...option, text } : option)),
          }
        }
        return question
      }),
    )
  }

  const removeOption = (questionId: string, optionId: string) => {
    setQuestions(
      questions.map((question) => {
        if (question.id === questionId) {
          return {
            ...question,
            options: question.options.filter((option) => option.id !== optionId),
          }
        }
        return question
      }),
    )
  }

  const removeQuestion = (questionId: string) => {
    setQuestions(questions.filter((question) => question.id !== questionId))
  }

  return (

    <div className="grid gap-4 md:grid-cols-3">
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardDescription>Fill out the form below.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {questions.map((question, qIndex) => (
              <div key={question.id} className="space-y-4 p-4 border border-gray-200 rounded-lg">
                <div className="flex items-center gap-2">
                  <div className="flex-1">
                    <Label htmlFor={`question-${question.id}`}>Question {qIndex + 1}</Label>
                    <Input
                      id={`question-${question.id}`}
                      value={question.text}
                      onChange={(e) => updateQuestionText(question.id, e.target.value)}
                      placeholder="Enter your question"
                      className="mt-1"
                    />
                  </div>
                  {questions.length > 1 && (
                    <Button variant="outline" size="icon" className="mt-6" onClick={() => removeQuestion(question.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>

                <div className="space-y-3 pl-4">
                  <Label>Options</Label>
                  {question.options.map((option) => (
                    <div key={option.id} className="flex items-center gap-2">
                      <Input
                        value={option.text}
                        onChange={(e) => updateOptionText(question.id, option.id, e.target.value)}
                        placeholder="Enter an option"
                        className="flex-1"
                      />
                      {question.options.length > 1 && (
                        <Button variant="outline" size="icon" onClick={() => removeOption(question.id, option.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  ))}
                  <Button variant="outline" size="sm" className="mt-2" onClick={() => addOption(question.id)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Option
                  </Button>
                </div>
              </div>
            ))}

            <Button onClick={addQuestion} className="w-full">
              <Plus className="h-4 w-4 mr-2" />
              Add Another Question
            </Button>

            <Button className="w-full" type="submit">
              Save Questions
            </Button>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardDescription>Upload your survey file.</CardDescription>
          </CardHeader>
          <CardContent>
           <FileUploader
             acceptedFileTypes={['doc', 'docx', 'pdf', 'csv','txt']}
             path="public/"
             maxFileCount={1}
             isResumable
            />
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardDescription>Use AI to generate survey.</CardDescription>
          </CardHeader>
          <CardContent>
            <GenerationalChatBot/>
          </CardContent>
        </Card>
    </div>
    

  )
}
