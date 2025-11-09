import { apiClient } from './apiClient';

export type ProductClassificationRequest = {
  productName?: string;
  barcode?: string;
  ingredientsText?: string;
  imageBase64?: string;
  captureMode?: 'barcode' | 'logo' | 'ingredients';
};

export type IngredientModelInsight = {
  status: HalalStatus;
  confidence: number;
  raw_scores: Record<string, number>;
};

export type BarcodeModelInsight = {
  status: HalalStatus;
  confidence: number;
  raw_scores: Record<string, number>;
};

export type LogoModelInsight = {
  detected: boolean;
  confidence: number;
};

export type FeatureBreakdown = {
  ingredients?: IngredientModelInsight | null;
  barcode?: BarcodeModelInsight | null;
  logo?: LogoModelInsight | null;
};

export type ProductClassificationResponse = {
  product_name: string;
  barcode: string | null;
  halal_status: 'Halal' | 'Haram' | 'Doubtful';
  confidence: number;
  evidence: string[];
  capture_mode?: 'barcode' | 'logo' | 'ingredients';
  recognized_ingredients_text?: string | null;
  feature_breakdown?: FeatureBreakdown;
};

export async function classifyProduct(
  payload: ProductClassificationRequest,
): Promise<ProductClassificationResponse> {
  const response = await apiClient.post<ProductClassificationResponse>('/api/v1/products/classify', {
    product_name: payload.productName,
    barcode: payload.barcode,
    ingredients_text: payload.ingredientsText,
    image_base64: payload.imageBase64,
    capture_mode: payload.captureMode,
  });

  return response.data;
}

