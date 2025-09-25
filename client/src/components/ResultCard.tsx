import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, ExternalLink, ArrowLeft } from "lucide-react";
import CopyButton from "./CopyButton";

interface TokenResult {
  mintAddress: string;
  tokenName: string;
  tokenSymbol: string;
  totalSupply: number;
  decimals: number;
  transactionSignature: string;
  explorerUrl: string;
  network: "devnet" | "mainnet";
}

interface ResultCardProps {
  result: TokenResult;
  onCreateAnother: () => void;
}

export default function ResultCard({ result, onCreateAnother }: ResultCardProps) {
  const formatSupply = (supply: number, decimals: number) => {
    return new Intl.NumberFormat().format(supply / Math.pow(10, decimals));
  };

  return (
    <Card className="crypto-card border-green-400/30 crypto-glow">
      <CardHeader>
        <CardTitle className="flex items-center gap-3 text-green-400">
          <div className="p-2 bg-green-500/20 rounded-lg">
            <CheckCircle className="h-6 w-6 text-green-400" />
          </div>
          <span className="bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
            Token Created Successfully!
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Token Details */}
        <div className="bg-green-500/10 border border-green-400/20 p-6 rounded-lg crypto-glow">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-lg">{result.tokenName}</h3>
            <div className="flex items-center gap-2">
              <Badge variant="secondary">{result.tokenSymbol}</Badge>
              <Badge variant="outline">
                {result.network === "devnet" ? "Devnet" : "Mainnet"}
              </Badge>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-muted-foreground">Total Supply</p>
              <p className="font-mono">{formatSupply(result.totalSupply, result.decimals)}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Decimals</p>
              <p className="font-mono">{result.decimals}</p>
            </div>
          </div>
        </div>

        {/* Mint Address */}
        <div>
          <Label className="text-sm font-medium mb-2 block">Token Mint Address</Label>
          <div className="flex items-center gap-3 p-4 bg-muted/30 border border-primary/20 rounded-lg crypto-glow">
            <code className="flex-1 text-sm font-mono break-all text-primary">
              {result.mintAddress}
            </code>
            <CopyButton text={result.mintAddress} data-testid="copy-mint-address" />
          </div>
        </div>

        {/* Transaction Signature */}
        <div>
          <Label className="text-sm font-medium mb-2 block">Transaction Signature</Label>
          <div className="flex items-center gap-3 p-4 bg-muted/30 border border-primary/20 rounded-lg crypto-glow">
            <code className="flex-1 text-sm font-mono break-all text-primary">
              {result.transactionSignature}
            </code>
            <CopyButton text={result.transactionSignature} data-testid="copy-transaction" />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3">
          <Button
            variant="outline"
            className="flex-1 border-primary/30 hover:bg-primary/10"
            onClick={() => window.open(result.explorerUrl, '_blank')}
            data-testid="button-view-explorer"
          >
            <ExternalLink className="h-4 w-4 mr-2" />
            View on Solscan
          </Button>
          <Button
            className="flex-1 crypto-button text-white font-semibold"
            onClick={onCreateAnother}
            data-testid="button-create-another"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Create Another Token
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

function Label({ children, className }: { children: React.ReactNode; className?: string }) {
  return <label className={className}>{children}</label>;
}