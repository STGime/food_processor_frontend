// Device registration
export interface RegisterDeviceRequest {
  device_id: string;
}

export interface RegisterDeviceResponse {
  device_id: string;
  api_key: string;
  is_premium: boolean;
}

export interface DeviceMeResponse {
  device_id: string;
  is_premium: boolean;
}

// Extraction
export interface ExtractRequest {
  youtube_url: string;
}

export interface ExtractResponse {
  job_id: string;
  status: 'queued';
}

export type JobStatus = 'queued' | 'processing' | 'completed' | 'error';

export interface JobStatusResponse {
  status: JobStatus;
  progress: number;
  current_tier?: number;
  status_message?: string;
}

// Instructions
export interface Instruction {
  step_number: number;
  text: string;
  duration?: string;
  temperature?: string;
  technique?: string;
}

// Ingredients & Results
export interface Ingredient {
  name: string;
  category: string;
  quantity?: string;
  unit?: string;
  emoji?: string;
}

export interface ShoppingListGroup {
  [category: string]: string[];
}

export interface ProcessingMetadata {
  tier: number;
  source: string;
  [key: string]: unknown;
}

export interface ResultsResponse {
  video_id: string;
  recipe_name?: string;
  ingredients: Ingredient[];
  instructions: Instruction[];
  shopping_list: ShoppingListGroup;
  confidence: number;
  processing_metadata: ProcessingMetadata;
  is_truncated: boolean;
  total_ingredient_count: number;
  shown_ingredient_count: number;
  total_instruction_count: number;
  shown_instruction_count: number;
  upgrade_message?: string;
}

// Gallery
export interface GalleryIngredient {
  name: string;
  canonical_name: string;
  quantity: number | null;
  unit: string | null;
  raw_text: string;
  category: string;
  optional: boolean;
  preparation: string | null;
}

export interface SaveCardRequest {
  recipe_name: string;
  video_id?: string;
  video_title?: string;
  channel?: string;
  servings?: number;
  ingredients: GalleryIngredient[];
  instructions?: Instruction[];
  shopping_list: ShoppingListGroup;
  generate_image: boolean;
}

export interface GalleryCard {
  card_id: string;
  recipe_name: string;
  image_url?: string;
  video_id?: string;
  ingredients: GalleryIngredient[];
  instructions?: Instruction[];
  shopping_list?: ShoppingListGroup;
  is_truncated: boolean;
  total_ingredient_count: number;
  shown_ingredient_count: number;
  total_instruction_count?: number;
  shown_instruction_count?: number;
  upgrade_message?: string;
}

export interface ListCardsResponse {
  cards: GalleryCard[];
  limit: number;
  offset: number;
}

export interface GenerateImageResponse {
  card_id: string;
  image_url: string;
  is_truncated: boolean;
}

export interface DeleteCardResponse {
  deleted: boolean;
  card_id: string;
}

// Ingredient Swaps
export interface SwapRequest {
  ingredient: string;
  quantity?: number;
  unit?: string;
  recipe_context?: string;
  dietary_filters?: string[];
  available_ingredients?: string[];
}

export interface SwapSuggestion {
  substitute_name: string;
  quantity_ratio: number;
  quantity_note: string | null;
  confidence: number;
  dietary_tags: string[];
  notes: string;
}

export interface SwapResponse {
  original_ingredient: string;
  suggestions: SwapSuggestion[];
}

// Errors
export interface ApiErrorResponse {
  error: string;
  stack?: string;
}

export class ApiError extends Error {
  constructor(
    message: string,
    public statusCode: number,
    public body?: ApiErrorResponse,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}
