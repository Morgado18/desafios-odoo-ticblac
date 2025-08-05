"use server"
import { api } from "@/lib/axios";


export async function uploadUserFile(formData: FormData) {
  console.log('formData upload', formData);

  try {
    const file = formData.get("image") as File;

    if (!file || !(file instanceof Blob)) {
      throw new Error("Arquivo inválido");
    }

    const allowedImageTypes = ["image/jpeg", "image/png", "image/webp", "image/jpg"];
    if (!allowedImageTypes.includes(file.type)) {
      throw new Error("Apenas imagens são permitidas (jpeg, png, webp)");
    }

    const uploadForm = new FormData();
    uploadForm.append("image", file);
    const response = await api.post("user/upload", uploadForm, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    console.log("[uploadUserFile]:", response.data);
    return { success: true, data: response.data };

  } catch (error: any) {
    console.error("[Erro ao fazer upload]:", error);

    const errorMessage =
      error.response?.data?.message || error.message || "Erro desconhecido no upload";

    return { success: false, error: errorMessage };
  }
}

export async function uploadProfessionImage(formData: FormData, id: string) {


  try {
    const file = formData.get("image") as File;

    if (!file || !(file instanceof Blob)) {
      throw new Error("Arquivo inválido");
    }

    const allowedImageTypes = ["image/jpeg", "image/png", "image/webp", "image/jpg"];
    if (!allowedImageTypes.includes(file.type)) {
      throw new Error("Apenas imagens são permitidas (jpeg, png, webp)");
    }

    const uploadForm = new FormData();
    uploadForm.append("image", file);
    const response = await api.post(`profession/upload/${id}`, uploadForm, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    console.log("[uploadUserFile]:", response.data);
    return { success: true, data: response.data };

  } catch (error: any) {
    console.error("[Erro ao fazer upload]:", error);

    const errorMessage =
      error.response?.data?.message || error.message || "Erro desconhecido no upload";

    return { success: false, error: errorMessage };
  }
}
