import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">Coin Not Found</h1>
        <p className="text-muted-foreground mb-6">
          The cryptocurrency you're looking for doesn't exist or couldn't be found.
        </p>
        <Button asChild>
          <Link href="/dashboard">Back to Dashboard</Link>
        </Button>
      </div>
    </div>
  );
}