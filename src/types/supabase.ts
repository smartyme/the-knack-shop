export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      faqs: {
        Row: {
          id: string
          question: string
          answer: string
          order_index: number
          created_at: string
        }
        Insert: {
          id?: string
          question: string
          answer: string
          order_index?: number
          created_at?: string
        }
        Update: {
          id?: string
          question?: string
          answer?: string
          order_index?: number
          created_at?: string
        }
      }
      // ... rest of the existing tables
    }
  }
}