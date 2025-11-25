"use client";

import { useState } from "react";
import { Button } from "@/shared/components/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/shared/components/dialog";
import { ProfileForm } from "./ProfileForm";
import { Edit2 } from "lucide-react";

interface ProfileFormDialogProps {
  initialName?: string | null;
  initialImage?: string | null;
}

export function ProfileFormDialog({
  initialName,
  initialImage,
}: ProfileFormDialogProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <Edit2 className="mr-2 h-4 w-4" />
          Editar Perfil
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Editar Perfil</DialogTitle>
          <DialogDescription>
            Atualize suas informações pessoais abaixo.
          </DialogDescription>
        </DialogHeader>
        <ProfileForm
          initialName={initialName}
          initialImage={initialImage}
          onSuccess={() => setIsOpen(false)}
        />
      </DialogContent>
    </Dialog>
  );
}

