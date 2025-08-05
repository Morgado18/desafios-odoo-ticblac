"use server"
import { api } from "@/lib/axios";

type RatingInput = {
  clientId: string;
  professionalId: string;
  rating: number;
  comment: string;
};

export async function addRating(data: RatingInput) {
  const response = await api.post("/rating", data);
  console.log("rating", response.data)
  return response.data;
}
