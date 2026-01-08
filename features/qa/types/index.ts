export interface Question {
  id: string
  caption: string | null
  question_text: string
  image_url: string | null
  tell_me_more: string | null
  display_order: number
}

export interface AnswerOption {
  id: string
  question_id: string
  option_text: string
  option_order: number
}

export interface UserResponse {
  id?: string
  user_id?: string | null
  question_id: string
  answer_option_id: string
  free_text_note?: string | null
  created_at?: string
}

export interface QuestionWithOptions extends Question {
  answer_options: AnswerOption[]
}
