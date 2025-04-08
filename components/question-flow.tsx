"use client"

import { useState, useRef, useEffect } from "react"
import ReactFlow, {
  type Node,
  type Edge,
  Background,
  Controls,
  MiniMap,
  type NodeTypes,
  useNodesState,
  useEdgesState,
  Panel,
  MarkerType,
  useReactFlow,
  Handle,
  Position,
} from "reactflow"
import { createPortal } from "react-dom"
import "reactflow/dist/style.css"
import { Card } from "@/components/ui/card"

// Enhanced CustomNode component with handles for each field
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const CustomNode = ({ data }: { data: any }) => {
  const [showTooltip, setShowTooltip] = useState(false)
  const nodeRef = useRef<HTMLDivElement>(null)
  const { getViewport } = useReactFlow()
  const [tooltipPosition, setTooltipPosition] = useState({
    top: 0,
    left: 0,
    placement: "top" as "top" | "bottom" | "left" | "right",
  })

  // Calculate tooltip position when it becomes visible
  useEffect(() => {
    if (showTooltip && nodeRef.current) {
      const nodeRect = nodeRef.current.getBoundingClientRect()

      // Get window dimensions
      const windowWidth = window.innerWidth
      const windowHeight = window.innerHeight

      // Calculate available space in each direction
      const spaceTop = nodeRect.top
      const spaceBottom = windowHeight - nodeRect.bottom
      const spaceLeft = nodeRect.left
      const spaceRight = windowWidth - nodeRect.right

      // Determine best placement based on available space
      let placement: "top" | "bottom" | "left" | "right"
      let top = 0
      let left = 0

      // Estimate tooltip dimensions (can be adjusted based on content)
      const estimatedTooltipWidth = 300
      const estimatedTooltipHeight = 150

      if (spaceTop > estimatedTooltipHeight && spaceTop > spaceBottom) {
        placement = "top"
        top = nodeRect.top - estimatedTooltipHeight - 10
        left = nodeRect.left + nodeRect.width / 2 - estimatedTooltipWidth / 2
      } else if (spaceBottom > estimatedTooltipHeight) {
        placement = "bottom"
        top = nodeRect.bottom + 10
        left = nodeRect.left + nodeRect.width / 2 - estimatedTooltipWidth / 2
      } else if (spaceLeft > estimatedTooltipWidth && spaceLeft > spaceRight) {
        placement = "left"
        top = nodeRect.top + nodeRect.height / 2 - estimatedTooltipHeight / 2
        left = nodeRect.left - estimatedTooltipWidth - 10
      } else {
        placement = "right"
        top = nodeRect.top + nodeRect.height / 2 - estimatedTooltipHeight / 2
        left = nodeRect.right + 10
      }

      // Adjust to ensure tooltip stays within viewport
      if (left < 10) left = 10
      if (left + estimatedTooltipWidth > windowWidth - 10) left = windowWidth - estimatedTooltipWidth - 10
      if (top < 10) top = 10
      if (top + estimatedTooltipHeight > windowHeight - 10) top = windowHeight - estimatedTooltipHeight - 10

      setTooltipPosition({ top, left, placement })
    }
  }, [showTooltip, getViewport])

  const handleMouseEnter = () => {
    setShowTooltip(true)
  }

  const handleMouseLeave = () => {
    setShowTooltip(false)
  }

  // Get pointer style based on placement
  const getPointerStyle = () => {
    const { placement } = tooltipPosition

    switch (placement) {
      case "top":
        return {
          bottom: "-6px",
          left: "50%",
          marginLeft: "-6px",
          transform: "rotate(45deg)",
          borderTop: "none",
          borderLeft: "none",
          borderRight: "1px solid #e5e7eb",
          borderBottom: "1px solid #e5e7eb",
        }
      case "bottom":
        return {
          top: "-6px",
          left: "50%",
          marginLeft: "-6px",
          transform: "rotate(45deg)",
          borderTop: "1px solid #e5e7eb",
          borderLeft: "1px solid #e5e7eb",
          borderRight: "none",
          borderBottom: "none",
        }
      case "left":
        return {
          right: "-6px",
          top: "50%",
          marginTop: "-6px",
          transform: "rotate(45deg)",
          borderTop: "none",
          borderLeft: "none",
          borderRight: "1px solid #e5e7eb",
          borderBottom: "1px solid #e5e7eb",
        }
      case "right":
        return {
          left: "-6px",
          top: "50%",
          marginTop: "-6px",
          transform: "rotate(45deg)",
          borderTop: "1px solid #e5e7eb",
          borderLeft: "1px solid #e5e7eb",
          borderRight: "none",
          borderBottom: "none",
        }
    }
  }

  return (
    <div ref={nodeRef} className="relative" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
      <Card className="px-4 py-2 min-w-[180px] border border-gray-200 shadow-sm">
        <div className="text-sm font-medium">{data.title}</div>
        {data.subtitle && <div className="text-xs text-gray-500">{data.subtitle}</div>}
        {data.fields && (
          <div className="mt-2 space-y-1">
            {data.fields.map((field: string, index: number) => (
              <div key={index} className="flex items-center relative">
                <div className="w-full h-6 bg-gray-100 rounded text-xs px-2 py-1">{field}</div>
                {/* Add source handle on the right side of each field */}
                <Handle
                  type="source"
                  position={Position.Right}
                  id={`${field.toLowerCase()}-source`}
                  style={{
                    background: field.toLowerCase() === "success" ? "#22c55e" : "#ef4444",
                    width: 8,
                    height: 8,
                    right: -4,
                  }}
                />
                {/* Add target handle on the left side of each field */}
                <Handle
                  type="target"
                  position={Position.Left}
                  id={`${field.toLowerCase()}-target`}
                  style={{
                    background: field.toLowerCase() === "success" ? "#22c55e" : "#ef4444",
                    width: 8,
                    height: 8,
                    left: -4,
                  }}
                />
              </div>
            ))}
          </div>
        )}
      </Card>

      {showTooltip &&
        data.description &&
        typeof document !== "undefined" &&
        createPortal(
          <div
            className="fixed bg-white border border-gray-200 rounded-md shadow-lg p-3 text-sm"
            style={{
              top: tooltipPosition.top,
              left: tooltipPosition.left,
              width: "300px",
              maxHeight: "200px",
              // overflowY: "auto",
              boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
              zIndex: 99999,
            }}
          >
            <div className="text-gray-800">{data.description}</div>
            {/* Triangle pointer */}
            <div className="absolute w-3 h-3 bg-white border transform" style={getPointerStyle()}></div>
          </div>,
          document.body,
        )}
    </div>
  )
}

const nodeTypes: NodeTypes = {
  custom: CustomNode,
}

export default function QuestionFlow() {
  // Define the initial nodes
  const initialNodes: Node[] = [
    {
      id: "1",
      type: "custom",
      position: { x: 0, y: 300 },
      data: {
        title: "Welcome",
        subtitle: "Entry Point",
        fields: ["Success", "Error"],
        description:
          "مرحبًا، هذه شركة الرمز للإنشاءات. نأمل أن تستمتع بمنزلك الجديد! نود أن نسمع رأيك في تجربتك معنا. ستستغرق هذه المكالمة أقل من دقيقتين. يرجى الرد برقم من 1 إلى 5، حيث 1 يعني (غير راض تمامًا) و5 يعني (راضي تمامًا). فلنبدأ",
      },
    },
    {
      id: "2",
      type: "custom",
      position: { x: 200, y: 200 },
      data: {
        title: "Beep",
        subtitle: "Prompt Beep.wav",
        fields: ["Success", "Error"],
        description: "Beep Sound",
      },
    },
    {
      id: "4",
      type: "custom",
      position: { x: 400, y: 100 },
      data: {
        title: "Question 1",
        subtitle: "Custom",
        fields: ["Success", "Error"],
        description: "مامدى رضاك عن جودة منزلكالجديد بشكل عام؟",
      },
    },
    {
      id: "5",
      type: "custom",
      position: { x: 450, y: 300 },
      data: {
        title: "Question 2",
        subtitle: "Custom",
        fields: ["Success", "Error"],
        description: "كيفتقيم احترافية واستجابة فريقنا؟",
      },
    },
    {
      id: "6",
      type: "custom",
      position: { x: 600, y: 500 },
      data: {
        title: "Error Handling",
        subtitle: "If User Press Invalid Input",
        fields: ["Success", "Error"],
        description: "تم إدخال رقم خاطئ",
      },
    },
    {
      id: "7",
      type: "custom",
      position: { x: 650, y: 100 },
      data: {
        title: "Question 3",
        subtitle: "Custom",
        fields: ["Success", "Error"],
        description: "هلتم تسليم منزلك في الوقت المحددكما وعدنا؟",
      },
    },
    {
      id: "8",
      type: "custom",
      position: { x: 700, y: 300 },
      data: {
        title: "Questions 4",
        subtitle: "Custom",
        fields: ["Success", "Error"],
        description: "كيفتقيم مستوى النظافة والتشطيبات عند استلام منزلك؟",
      },
    },
    {
      id: "9",
      type: "custom",
      position: { x: 900, y: 200 },
      data: {
        title: "Question 5",
        subtitle: "Custom",
        fields: ["Success", "Error"],
        description: "هل توصي بالرمز لأصدقائك وعائلتك؟",
      },
    },
    {
      id: "10",
      type: "custom",
      position: { x: 1100, y: 350 },
      data: {
        title: "Store",
        subtitle: "This Response will be store to S3",
        fields: ["Saving The Response"],
        description: "All the inputs provided by customer will be captured and stored in S3",
      },
    },
    {
      id: "11",
      type: "custom",
      position: { x: 1300, y: 200 },
      data: {
        title: "Disconnect",
        subtitle: "Termination Event",
        fields: ["End"],
        description: "This Session will be Ended",
      },
    },
  ]

  // Define the connections between nodes with specific source and target handles
  const initialEdges: Edge[] = [
    {
      id: "e1-2-success",
      source: "1",
      target: "2",
      sourceHandle: "success-source",
      targetHandle: "success-target",
      animated: true,
      style: { stroke: "#22c55e" },
      markerEnd: { type: MarkerType.ArrowClosed, color: "#22c55e" },
    },
    {
      id: "e1-6-error",
      source: "1",
      target: "6",
      sourceHandle: "error-source",
      targetHandle: "error-target",
      animated: true,
      style: { stroke: "#ef4444" },
      markerEnd: { type: MarkerType.ArrowClosed, color: "#ef4444" },
    },
    {
      id: "e2-4-success",
      source: "2",
      target: "4",
      sourceHandle: "success-source",
      targetHandle: "success-target",
      animated: true,
      style: { stroke: "#22c55e" },
      markerEnd: { type: MarkerType.ArrowClosed, color: "#22c55e" },
    },
    {
      id: "e4-5-success",
      source: "4",
      target: "5",
      sourceHandle: "success-source",
      targetHandle: "success-target",
      animated: true,
      style: { stroke: "#22c55e" },
      markerEnd: { type: MarkerType.ArrowClosed, color: "#22c55e" },
    },
    {
      id: "e4-6-error",
      source: "4",
      target: "6",
      sourceHandle: "error-source",
      targetHandle: "error-target",
      animated: true,
      style: { stroke: "#ef4444" },
      markerEnd: { type: MarkerType.ArrowClosed, color: "#ef4444" },
    },
    {
      id: "e5-7-success",
      source: "5",
      target: "7",
      sourceHandle: "success-source",
      targetHandle: "success-target",
      animated: true,
      style: { stroke: "#22c55e" },
      markerEnd: { type: MarkerType.ArrowClosed, color: "#22c55e" },
    },
    {
      id: "e5-6-error",
      source: "5",
      target: "6",
      sourceHandle: "error-source",
      targetHandle: "error-target",
      animated: true,
      style: { stroke: "#ef4444" },
      markerEnd: { type: MarkerType.ArrowClosed, color: "#ef4444" },
    },
    {
      id: "e7-8-success",
      source: "7",
      target: "8",
      sourceHandle: "success-source",
      targetHandle: "success-target",
      animated: true,
      style: { stroke: "#22c55e" },
      markerEnd: { type: MarkerType.ArrowClosed, color: "#22c55e" },
    },
    {
      id: "e7-6-error",
      source: "7",
      target: "6",
      sourceHandle: "error-source",
      targetHandle: "error-target",
      animated: true,
      style: { stroke: "#ef4444" },
      markerEnd: { type: MarkerType.ArrowClosed, color: "#ef4444" },
    },
    {
      id: "e8-9-success",
      source: "8",
      target: "9",
      sourceHandle: "success-source",
      targetHandle: "success-target",
      animated: true,
      style: { stroke: "#22c55e" },
      markerEnd: { type: MarkerType.ArrowClosed, color: "#22c55e" },
    },
    {
      id: "e8-6-error",
      source: "8",
      target: "6",
      sourceHandle: "error-source",
      targetHandle: "error-target",
      animated: true,
      style: { stroke: "#ef4444" },
      markerEnd: { type: MarkerType.ArrowClosed, color: "#ef4444" },
    },
    {
      id: "e9-10-success",
      source: "9",
      target: "10",
      sourceHandle: "success-source",
      targetHandle: "saving the response-target",
      animated: true,
      style: { stroke: "#22c55e" },
      markerEnd: { type: MarkerType.ArrowClosed, color: "#22c55e" },
    },
    {
      id: "e9-6-error",
      source: "9",
      target: "6",
      sourceHandle: "error-source",
      targetHandle: "error-target",
      animated: true,
      style: { stroke: "#ef4444" },
      markerEnd: { type: MarkerType.ArrowClosed, color: "#ef4444" },
    },
    {
      id: "e10-11",
      source: "10",
      target: "11",
      sourceHandle: "saving the response-source",
      targetHandle: "end-target",
      animated: true,
      style: { stroke: "#22c55e" },
      markerEnd: { type: MarkerType.ArrowClosed, color: "#22c55e" },
    },
    {
      id: "e6-10-success",
      source: "6",
      target: "10",
      sourceHandle: "success-source",
      targetHandle: "saving the response-target",
      animated: true,
      style: { stroke: "#22c55e" },
      markerEnd: { type: MarkerType.ArrowClosed, color: "#22c55e" },
    },
  ]

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes)
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges)

  return (
    <div className="w-full h-[500px] bg-white rounded-lg shadow-sm border">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        nodeTypes={nodeTypes}
        fitView
        attributionPosition="bottom-right"
      >
        <Background />
        <Controls />
        <MiniMap />
        <Panel position="top-left" className="bg-white p-2 rounded shadow-sm z-[1]">
          <div className="flex gap-4 text-sm">
            <div className="flex items-center">
              <div className="w-4 h-1 bg-green-500 mr-2"></div>
              <span>Success Path</span>
            </div>
            <div className="flex items-center">
              <div className="w-4 h-1 bg-red-500 mr-2"></div>
              <span>Error Path</span>
            </div>
          </div>
        </Panel>
      </ReactFlow>
    </div>
  )
}