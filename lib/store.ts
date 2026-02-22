"use client"

export interface Document {
  id: string
  name: string
  type: "pdf" | "image" | "note"
  status: "idle" | "uploading" | "processing" | "completed"
  progress: number
}

export interface Message {
  id: string
  role: "user" | "ai"
  content: string
}

export interface QuizQuestion {
  id: string
  question: string
  options: string[]
  correctIndex: number
}

export interface Flashcard {
  id: string
  front: string
  back: string
}

export interface Environment {
  id: string
  name: string
  documents: Document[]
  messages: Message[]
  quiz: QuizQuestion[]
  flashcards: Flashcard[]
  lastActivity: string
}

// Sample data
export const sampleEnvironments: Environment[] = [
  {
    id: "env-1",
    name: "Biology 101",
    documents: [
      { id: "doc-1", name: "Cell Structure.pdf", type: "pdf", status: "completed", progress: 100 },
      { id: "doc-2", name: "Genetics Notes.pdf", type: "pdf", status: "completed", progress: 100 },
      { id: "doc-3", name: "Diagram.png", type: "image", status: "completed", progress: 100 },
    ],
    messages: [
      { id: "msg-1", role: "user", content: "What are the main organelles in a eukaryotic cell?" },
      {
        id: "msg-2",
        role: "ai",
        content:
          "**Main Organelles in Eukaryotic Cells**\n\nEukaryotic cells contain several key organelles:\n\n- **Nucleus** - Contains the cell's DNA and controls gene expression\n- **Mitochondria** - Powerhouse of the cell, produces ATP through cellular respiration\n- **Endoplasmic Reticulum (ER)** - Rough ER synthesizes proteins; Smooth ER synthesizes lipids\n- **Golgi Apparatus** - Modifies, packages, and ships proteins\n- **Lysosomes** - Digest waste materials and cellular debris\n- **Ribosomes** - Synthesize proteins from mRNA instructions\n\nThese organelles work together to maintain cellular function and homeostasis.",
      },
    ],
    quiz: [
      {
        id: "q-1",
        question: "Which organelle is known as the 'powerhouse of the cell'?",
        options: ["Nucleus", "Mitochondria", "Golgi Apparatus", "Endoplasmic Reticulum"],
        correctIndex: 1,
      },
      {
        id: "q-2",
        question: "What is the primary function of ribosomes?",
        options: ["Energy production", "Protein synthesis", "Lipid storage", "Cell division"],
        correctIndex: 1,
      },
      {
        id: "q-3",
        question: "Where is DNA primarily located in a eukaryotic cell?",
        options: ["Cytoplasm", "Cell membrane", "Nucleus", "Mitochondria"],
        correctIndex: 2,
      },
    ],
    flashcards: [
      { id: "fc-1", front: "What is the function of the mitochondria?", back: "The mitochondria is the powerhouse of the cell, responsible for producing ATP through cellular respiration." },
      { id: "fc-2", front: "What does the Golgi apparatus do?", back: "The Golgi apparatus modifies, packages, and ships proteins and lipids to their final destinations." },
      { id: "fc-3", front: "Define osmosis", back: "Osmosis is the movement of water molecules through a selectively permeable membrane from an area of lower solute concentration to higher solute concentration." },
    ],
    lastActivity: "2 hours ago",
  },
  {
    id: "env-2",
    name: "Linear Algebra",
    documents: [
      { id: "doc-4", name: "Matrix Operations.pdf", type: "pdf", status: "completed", progress: 100 },
      { id: "doc-5", name: "Eigenvalues.pdf", type: "pdf", status: "completed", progress: 100 },
    ],
    messages: [],
    quiz: [],
    flashcards: [],
    lastActivity: "1 day ago",
  },
  {
    id: "env-3",
    name: "Modern History",
    documents: [
      { id: "doc-6", name: "World War II.pdf", type: "pdf", status: "completed", progress: 100 },
    ],
    messages: [],
    quiz: [],
    flashcards: [],
    lastActivity: "3 days ago",
  },
]
