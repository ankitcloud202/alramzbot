"use client"

import type React from "react"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Plus, X, Check, ArrowRight, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
// import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import HeroImage from '@/public/hero-image.png'
import axios from "axios"
import { FileUploader } from '@aws-amplify/ui-react-storage';
import '@aws-amplify/ui-react/styles.css';
import toast from "react-hot-toast"
import { SurveyResponses } from "@/components/SurveyResponses"
import { SurveyResponsesChart } from "@/components/SurveyResponseChart"
import { SurveyResponsesLineChart } from "@/components/SurveyResponseChart2"
import QuestionForm from "@/components/DefineSurvey"
import QuestionFlow from "@/components/question-flow"


export default function Home() {
  
  const [phoneInputs, setPhoneInputs] = useState([{ id: 1, countryCode: "+966", phoneNumber: "" }])

  const addPhoneInput = () => {
    const newId = phoneInputs.length > 0 ? Math.max(...phoneInputs.map((input) => input.id)) + 1 : 1
    setPhoneInputs([...phoneInputs, { id: newId, countryCode: "", phoneNumber: "" }])
  }

  const removePhoneInput = (id: number) => {
    if (phoneInputs.length > 1) {
      setPhoneInputs(phoneInputs.filter((input) => input.id !== id))
    }
  }

  const updatePhoneInput = (id: number, field: "countryCode" | "phoneNumber", value: string) => {
    setPhoneInputs(phoneInputs.map((input) => (input.id === id ? { ...input, [field]: value } : input)))
  }

  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true);
    console.log("Submitted data:", phoneInputs)

    if(phoneInputs.some((input) => !input.phoneNumber)){
      toast.error("Please fill in all phone numbers.")
      setSubmitting(false);
      return;
    }

    const formattedInputs = phoneInputs.map((input) => (
      input.countryCode + input.phoneNumber.replace(/\D/g, '')
    ))

    console.log("Formatted Inputs:", formattedInputs);

    try{
      const res = await axios.post('/api/call', {
        phoneNumbers: formattedInputs
      });
      
      console.log("Response:", res)
      toast.success("Call initialization started!");
      setPhoneInputs([{ id: 1, countryCode: "+966", phoneNumber: "" }]); // Reset the form
    }catch(e){
      console.error("Error submitting data:", e)
    }finally{
      setSubmitting(false);
    }
    // Handle form submission logic here
  }


  return (
    <>

      {/* Hero Section */}
      <section className="relative mx-20 overflow-hidden from-gray-50 to-gray-100">
        <div className="absolute inset-0 bg-gradient-to-br  z-0"></div>
        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1/2 h-1/2 bg-gray-100 rounded-full blur-3xl opacity-50"></div>
        <div className="container relative z-10 mx-auto px-4 py-12 md:py-24">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div className="inline-block px-3 py-1 rounded-full bg-gray-100 border text-sm font-medium">
                Introducing Al Ramzbot
              </div>
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
              Al RamzBot – AI Voice Assistant
              </h1>
              <p className="text-lg md:text-lg text-gray-600 max-w-lg">
              An intelligent AI voice bot designed to communicate effortlessly in Arabic, conduct automated voice surveys, and instantly capture responses with real-time sentiment analysis.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link href="#start"> 
                <Button size="lg" className="rounded-full">
                  Initialize Survey <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
                </Link>

                <Link href="#survey-responses">
                <Button size="lg" variant="outline" className="rounded-full">
                  Survey Responses
                </Button>
                </Link>
              </div>
            </div>
            <div className="relative">
              <div className="absolute -inset-4 bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl blur opacity-70"></div>
              <div className="relative bg-white p-2 rounded-xl shadow-lg">
                <Image
                  src={HeroImage.src}
                  alt="Al Ramzbot X Cloud202 Dashboard"
                  width={500}
                  height={500}
                  className="rounded-lg w-full"
                />
              </div>
            </div>
          </div>
        </div>
      </section>




      {/* Define Survey flow */}
      <section id="start" className="py-12 bg-white" >
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-12 items-center w-full px-10 lg:px-20" >
            <div className="col-span-1">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Define Survey flow</h2>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center">
                    <Check className="h-5 w-5 text-purple-600" />
                  </div>
                  <p className="font-medium">Upload your survey document.</p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center">
                    <Check className="h-5 w-5 text-purple-600" />
                  </div>
                  <p className="font-medium">Or create your survey</p>
                </div>
              </div>
            </div>
            <div className="col-span-2">
            <QuestionForm/>
            </div>
          </div>
        </div>
      </section>

      {/* QUESTION FLOW Section */}
      <section id="question-flow" className="py-4 md:py-10 bg-gray-50">
        <div className="container mx-auto px-10 lg:px-28">
          <div className="text-start max-w-3xl mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Question flow</h2>
            <p className="text-lg text-gray-600">Visual representation of the survey question flow.</p>
          </div>
 
          <div className="mb-16">
            <QuestionFlow />
          </div>

          {/* <div className="max-w-3xl mx-auto">
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="item-1">
                <AccordionTrigger>How does Al Ramzbot X Cloud202 work?</AccordionTrigger>
                <AccordionContent>
                  Al Ramzbot X Cloud202 is a comprehensive cloud platform that combines advanced infrastructure, security
                  protocols, and user-friendly interfaces. It works by providing a distributed network of servers that
                  handle computing, storage, and networking resources, which you can access and manage through our
                  intuitive dashboard.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-2">
                <AccordionTrigger>What features are included in the basic package?</AccordionTrigger>
                <AccordionContent>
                  The Basic package includes 5TB of storage, support for up to 10 users, basic analytics capabilities,
                  and 24/7 customer support. You&apos;ll also get access to our core cloud infrastructure, security features,
                  and collaboration tools.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-3">
                <AccordionTrigger>Is there a free trial available?</AccordionTrigger>
                <AccordionContent>
                  Yes, we offer a 14-day free trial for all new customers. This gives you full access to our Pro plan
                  features so you can thoroughly test the platform before making a commitment. No credit card is
                  required to start your trial.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-4">
                <AccordionTrigger>How secure is the cloud storage?</AccordionTrigger>
                <AccordionContent>
                  Al Ramzbot X Cloud202 employs military-grade encryption (AES-256) for all data, both in transit and at
                  rest. We maintain compliance with major security standards including SOC 2, ISO 27001, and GDPR. Our
                  infrastructure includes multiple redundancies, regular security audits, and advanced threat detection
                  systems.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-5">
                <AccordionTrigger>Can I access my data from multiple devices?</AccordionTrigger>
                <AccordionContent>
                  Yes, Al Ramzbot X Cloud202 is designed for multi-device access. You can securely access your data from
                  any device with an internet connection, including desktops, laptops, tablets, and smartphones. Our
                  responsive web interface and dedicated mobile apps ensure a consistent experience across all your
                  devices.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-6">
                <AccordionTrigger>How does billing work?</AccordionTrigger>
                <AccordionContent>
                  We offer both monthly and annual billing options. Annual billing provides a 20% discount compared to
                  monthly billing. You can upgrade, downgrade, or cancel your plan at any time. For enterprise
                  customers, we also offer customized billing arrangements to suit your specific needs.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div> */}
        </div>
      </section> 

            {/* Contact Section */}
            <section id="start" className="py-14 bg-gray-50" >
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-12 items-center w-full px-10 lg:px-20" >
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Initialize Survey calls</h2>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center">
                    <Check className="h-5 w-5 text-purple-600" />
                  </div>
                  <p className="font-medium">Select country code</p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center">
                    <Check className="h-5 w-5 text-purple-600" />
                  </div>
                  <p className="font-medium">Enter the phone number</p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center">
                    <Check className="h-5 w-5 text-purple-600" />
                  </div>
                  <p className="font-medium">Add more if needed</p>
                </div>

                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center">
                    <Check className="h-5 w-5 text-purple-600" />
                  </div>
                  <p className="font-medium">Or directly upload using csv file</p>
                </div>
              </div>
            </div>

            <Card className="border-0 shadow-lg">
              <CardHeader>
                {/* <CardTitle>Contact Us</CardTitle> */}
                <CardDescription>Fill out the form below.</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <Label>Phone Number</Label>
                    <div className="space-y-4">
                      {phoneInputs.map((input) => (
                        <div key={input.id} className="flex gap-2">
                          <div className="space-y-2">
                            <Select
                              value={input.countryCode}
                              onValueChange={(value) => updatePhoneInput(input.id, "countryCode", value)}
                            >
                              <SelectTrigger id={`country-code-${input.id}`}>
                                <SelectValue placeholder="Code" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="+966">+966 (SA)</SelectItem>
                                <SelectItem value="+44">+44 (UK)</SelectItem>
                                <SelectItem value="+1">+1 (US/CA)</SelectItem>
                                <SelectItem value="+91">+91 (IN)</SelectItem>
                                <SelectItem value="+971">+971 (UAE)</SelectItem>
                                <SelectItem value="+61">+61 (AU)</SelectItem>
                                <SelectItem value="+86">+86 (CN)</SelectItem>
                                <SelectItem value="+33">+33 (FR)</SelectItem>
                                <SelectItem value="+49">+49 (DE)</SelectItem>
                                <SelectItem value="+81">+81 (JP)</SelectItem>
                                <SelectItem value="+52">+52 (MX)</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>

                          <div className="space-y-2 flex-1">
                            <Input
                              id={`phone-${input.id}`}
                              type="tel"
                              placeholder="Phone number"
                              value={input.phoneNumber}
                              onChange={(e) => updatePhoneInput(input.id, "phoneNumber", e.target.value)}
                            />
                          </div>

                          {phoneInputs.length > 1 && (
                            <Button
                              type="button"
                              variant="outline"
                              size="icon"
                              onClick={() => removePhoneInput(input.id)}
                              className="mb-0.5"
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      ))}

                      <Button
                        type="button"
                        variant="outline"
                        onClick={addPhoneInput}
                        className="flex items-center gap-1"
                      >
                        <Plus className="h-4 w-4" /> Add More
                      </Button>
                    </div>
                  </div>

                  <Button type="submit" className="w-full" disabled={submitting}>
                    {submitting ? <Loader2 className="animate-spin" /> : "Submit"}
                  </Button>
                </form>
              </CardContent>
            </Card>
            

            <Card className="border-0 shadow-lg">
              <CardHeader>
                {/* <CardTitle>Contact Us</CardTitle> */}
                <CardDescription>Upload your csv file.</CardDescription>
              </CardHeader>
              <CardContent>
                <FileUploader
                  acceptedFileTypes={['image/*','text/csv']}
                  path="public/"
                  maxFileCount={1}
                  isResumable
                />
              </CardContent>
            </Card>

          </div>
        </div>
      </section>

            {/* Post call analysis */}
      <section id="faq" className="py-4 md:py-10 bg-gray-50">
        <div className="container lg:px-28 px-10 mx-auto">
          <div className="text-start max-w-3xl mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Post call analysis</h2>
            <p className="text-lg text-gray-600">Responses of survey calls.</p> 
          </div>
          <div className="grid md:grid-cols-2 gap-10">
          <SurveyResponsesChart/>
          <SurveyResponsesLineChart/>
          </div>

        </div>
      </section>  

            {/* SURVEY RESPONSES Section */}
      <section id="survey-responses" className="py-4 md:py-10 bg-gray-50">
        <div className="container lg:px-28 px-10 mx-auto">
          <div className="text-start max-w-3xl mb-10">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Survey responses</h2>
            <p className="text-lg text-gray-600">Responses of survey calls.</p> 
          </div>
          <SurveyResponses/>
        </div>
      </section>  

    </>
  )
}

