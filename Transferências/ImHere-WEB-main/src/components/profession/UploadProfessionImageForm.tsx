
"use client";

import { uploadProfessionImage } from "@/actions/upload";
import { Button } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ImageIcon, Loader2 } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { toast } from "sonner";

export function UploadProfessionImageForm({ id, onClose }: { id: string; onClose?: () => void }) {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [resolution, setResolution] = useState<{ width: number; height: number } | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected) {
      setFile(selected);
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new window.Image();
        img.onload = () => {
          setResolution({ width: img.width, height: img.height });
        };
        img.src = event.target?.result as string;
        setPreviewUrl(event.target?.result as string);
      };
      reader.readAsDataURL(selected);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!file) return;

    setIsLoading(true);
    const formData = new FormData();
    formData.append("image", file);

    const result = await uploadProfessionImage(formData, id);

    if (result.success) {
      toast.success("Imagem da profissão enviada com sucesso!");
      onClose?.();
    } else {
      toast.error(result.error || "Erro ao enviar imagem");
    }

    setIsLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} encType="multipart/form-data" className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="file">Selecionar imagem</Label>
        <Input
          id="file"
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          disabled={isLoading}
        />
      </div>

      {previewUrl && (
        <div className="space-y-2">
          <Image
            src={previewUrl}
            alt="Pré-visualização"
            width={200}
            height={200}
            className="rounded-lg border"
          />
          {resolution && (
            <p className="text-sm text-muted-foreground">
              Resolução: {resolution.width} × {resolution.height}px
            </p>
          )}
        </div>
      )}

      <DialogFooter>
        <Button type="submit" disabled={!file || isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Enviando...
            </>
          ) : (
            <>
              <ImageIcon className="mr-2 h-4 w-4" />
              Enviar imagem
            </>
          )}
        </Button>
      </DialogFooter>
    </form>
  );
}
