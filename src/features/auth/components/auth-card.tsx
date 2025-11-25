import Link from "next/link";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/shared/components/card";
import { Button } from "@/shared/components/button";
import { ArrowLeft } from "lucide-react";

interface AuthCardProps {
  title: string;
  description?: string;
  backButtonHref?: string;
  backButtonLabel?: string;
  children: React.ReactNode;
}

export function AuthCard({
  title,
  description,
  backButtonHref,
  backButtonLabel,
  children,
}: AuthCardProps) {
  return (
    <Card className="w-full max-w-md bg-card border shadow-lg">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent>{children}</CardContent>
      {backButtonHref && backButtonLabel && (
        <CardFooter>
          <Button variant="ghost" asChild className="w-full">
            <Link href={backButtonHref}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              {backButtonLabel}
            </Link>
          </Button>
        </CardFooter>
      )}
    </Card>
  );
}
