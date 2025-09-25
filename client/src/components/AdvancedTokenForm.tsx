import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState } from "react";
import ToggleSection from "./ToggleSection";
import FileUpload from "./FileUpload";
import LoadingSpinner from "./LoadingSpinner";
import { Coins } from "lucide-react";

const tokenFormSchema = z.object({
  // Basic Information
  name: z.string().min(1, "Token name is required").max(32, "Name too long"),
  symbol: z.string().min(1, "Symbol is required").max(10, "Symbol too long").regex(/^[A-Z0-9]+$/, "Symbol must be uppercase letters and numbers only"),
  decimals: z.number().min(0).max(9).default(9),
  totalSupply: z.number().min(1, "Supply must be at least 1").max(1000000000000, "Supply too large"),
  description: z.string().optional(),
  
  // Supply Chain Metadata (optional)
  metadataUri: z.string().url().optional().or(z.literal("")),
  supplyLimit: z.number().optional(),
  
  // Royalty/Creator Information (optional)
  creatorAddress: z.string().optional(),
  royaltyPercentage: z.number().min(0).max(100).optional(),
  
  // Custom Address Metadata (optional) 
  customField1: z.string().optional(),
  customField2: z.string().optional(),
  
  // NFT Additional Details (optional)
  nftCollection: z.string().optional(),
  externalUrl: z.string().url().optional().or(z.literal("")),
  
  // Additional New Features (optional)
  freezeAuthority: z.string().optional(),
  mintAuthority: z.string().optional(),
});

type TokenFormData = z.infer<typeof tokenFormSchema>;

interface AdvancedTokenFormProps {
  onSubmit: (data: TokenFormData & { logoFile?: File }) => void;
  isLoading?: boolean;
}

export default function AdvancedTokenForm({ onSubmit, isLoading = false }: AdvancedTokenFormProps) {
  const [logoFile, setLogoFile] = useState<File | null>(null);
  
  const form = useForm<TokenFormData>({
    resolver: zodResolver(tokenFormSchema),
    defaultValues: {
      name: "",
      symbol: "",
      decimals: 9,
      totalSupply: 1000000,
      description: "",
      metadataUri: "",
      supplyLimit: 0,
      creatorAddress: "",
      royaltyPercentage: 0,
      customField1: "",
      customField2: "",
      nftCollection: "",
      externalUrl: "",
      freezeAuthority: "",
      mintAuthority: "",
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
    <div className="space-y-6">
      {/* Basic Token Information */}
      <Card className="crypto-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <div className="p-2 crypto-gradient rounded-lg">
              <Coins className="h-5 w-5 text-white" />
            </div>
            <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Token Information
            </span>
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

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description (Optional)</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Describe your token..."
                        {...field}
                        data-testid="textarea-description"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div>
                <Label className="text-sm font-medium mb-2 block">
                  Token Logo (Optional)
                </Label>
                <FileUpload onFileSelect={setLogoFile} />
              </div>

              {/* Toggle Sections */}
              <div className="space-y-4">
                {/* Supply Chain Metadata */}
                <ToggleSection
                  title="Supply Chain Metadata"
                  description="Configure metadata URI and supply controls"
                  onToggle={(enabled) => {/* Section toggled */}}
                >
                  <div className="space-y-4">
                    <FormField
                      control={form.control}
                      name="metadataUri"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Metadata URI</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="https://example.com/metadata.json"
                              {...field}
                              data-testid="input-metadata-uri"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="supplyLimit"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Supply Limit</FormLabel>
                          <FormControl>
                            <Input 
                              type="number"
                              placeholder="Maximum supply limit"
                              {...field}
                              onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : 0)}
                              data-testid="input-supply-limit"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </ToggleSection>

                {/* Royalty/Creator Information */}
                <ToggleSection
                  title="Royalty/Creator Information"
                  description="Set up royalties and creator details"
                  onToggle={(enabled) => {/* Section toggled */}}
                >
                  <div className="space-y-4">
                    <FormField
                      control={form.control}
                      name="creatorAddress"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Creator Address</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="Enter creator wallet address"
                              {...field}
                              data-testid="input-creator-address"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="royaltyPercentage"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Royalty Percentage</FormLabel>
                          <FormControl>
                            <Input 
                              type="number"
                              min="0"
                              max="100"
                              placeholder="5"
                              {...field}
                              onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : 0)}
                              data-testid="input-royalty-percentage"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </ToggleSection>

                {/* Custom Address Metadata */}
                <ToggleSection
                  title="Custom Address Metadata"
                  description="Add custom metadata fields"
                  onToggle={(enabled) => {/* Section toggled */}}
                >
                  <div className="space-y-4">
                    <FormField
                      control={form.control}
                      name="customField1"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Custom Field 1</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="Custom metadata field"
                              {...field}
                              data-testid="input-custom-field-1"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="customField2"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Custom Field 2</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="Custom metadata field"
                              {...field}
                              data-testid="input-custom-field-2"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </ToggleSection>

                {/* NFT Additional Details */}
                <ToggleSection
                  title="NFT Additional Details"
                  description="Configure NFT collection and external links"
                  onToggle={(enabled) => {/* Section toggled */}}
                >
                  <div className="space-y-4">
                    <FormField
                      control={form.control}
                      name="nftCollection"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>NFT Collection</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="Collection name or address"
                              {...field}
                              data-testid="input-nft-collection"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="externalUrl"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>External URL</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="https://yourproject.com"
                              {...field}
                              data-testid="input-external-url"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </ToggleSection>

                {/* Additional New Features */}
                <ToggleSection
                  title="Additional New Features"
                  description="Configure advanced token authorities"
                  onToggle={(enabled) => {/* Section toggled */}}
                >
                  <div className="space-y-4">
                    <FormField
                      control={form.control}
                      name="freezeAuthority"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Freeze Authority</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="Freeze authority address"
                              {...field}
                              data-testid="input-freeze-authority"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="mintAuthority"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Mint Authority</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="Mint authority address"
                              {...field}
                              data-testid="input-mint-authority"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </ToggleSection>
              </div>

              <Button 
                type="submit" 
                className="w-full h-12 crypto-button text-white font-semibold"
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
    </div>
  );
}