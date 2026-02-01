import { apiClient } from './client';
import { endpoints } from '../constants/api';
import {
  SaveCardRequest,
  GalleryCard,
  ListCardsResponse,
  GenerateImageResponse,
  DeleteCardResponse,
} from './types';

export async function saveCard(
  body: SaveCardRequest,
): Promise<GalleryCard> {
  return apiClient.post<GalleryCard>(endpoints.gallery.save, body);
}

export async function listCards(
  limit = 20,
  offset = 0,
): Promise<ListCardsResponse> {
  return apiClient.get<ListCardsResponse>(
    `${endpoints.gallery.list}?limit=${limit}&offset=${offset}`,
  );
}

export async function getCard(cardId: string): Promise<GalleryCard> {
  return apiClient.get<GalleryCard>(endpoints.gallery.get(cardId));
}

export async function generateImage(
  cardId: string,
): Promise<GenerateImageResponse> {
  return apiClient.post<GenerateImageResponse>(
    endpoints.gallery.generateImage(cardId),
  );
}

export async function deleteCard(
  cardId: string,
): Promise<DeleteCardResponse> {
  return apiClient.delete<DeleteCardResponse>(
    endpoints.gallery.delete(cardId),
  );
}
