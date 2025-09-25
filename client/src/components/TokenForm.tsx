import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState } from "react";
import FileUpload from "./FileUpload";
import LoadingSpinner from "./LoadingSpinner";
import { Coins } from "lucide-react";

const tokenFormSchema = z.object({
  name: z.string().min(1, "Token name is required").max(32, "Name too long"),
  symbol: z.string().min(1, "Symbol is required").max(10, "Symbol too long").regex(/^[A-Z0-9]+$/, "Symbol must be uppercase letters and numbers only"),
  decimals: z.number().min(0).max(9).default(9),
  totalSupply: z.number().min(1, "Supply must be at least 1").max(1000000000000, "Supply too large"),
});

type TokenFormData = z.infer<typeof tokenFormSchema>;

interface TokenFormProps {
  onSubmit: (data: TokenFormData & { logoFile?: File }) => void;
  isLoading?: boolean;
}

export default function TokenForm({ onSubmit, isLoading = false }: TokenFormProps) {
  const [logoFile, setLogoFile] = useState<File | null>(null);
  
  const form = useForm<TokenFormData>({
    resolver: zodResolver(tokenFormSchema),
    defaultValues: {
      name: "",
      symbol: "",
      decimals: 9,
      totalSupply: 1000000,
    },
  });

  const handleSubmit = (data: TokenFormData) => {
    const submissionData = {
      ...data,
      logoFile: logoFile || undefined,
    };
    onSubmit(submissionData);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Coins className="h-5 w-5 text-primary" />
          Create Token
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Token Name</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="My Awesome Token" 
                        {...field}
                        data-testid="input-token-name"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="symbol"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Token Symbol</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="MAT" 
                        {...field}
                        onChange={(e) => field.onChange(e.target.value.toUpperCase())}
                        data-testid="input-token-symbol"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="decimals"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Decimals</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        min="0" 
                        max="9"
                        {...field}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                        data-testid="input-decimals"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="totalSupply"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Total Supply</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        min="1"
                        placeholder="1000000"
                        {...field}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                        data-testid="input-total-supply"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div>
              <Label className="text-sm font-medium mb-2 block">
                Token Logo (Optional)
              </Label>
              <FileUpload onFileSelect={setLogoFile} />
            </div>

            <Button 
              type="submit" 
              className="w-full h-12"
              disabled={isLoading}
              data-testid="button-create-token"
            >
              {isLoading ? (
                <LoadingSpinner size="sm" text="Creating Token..." />
              ) : (
                "Create Token"
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}