import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Globe, TestTube } from "lucide-react";
import { useState } from "react";

interface NetworkSelectorProps {
  selectedNetwork?: "devnet" | "mainnet";
  onNetworkChange: (network: "devnet" | "mainnet") => void;
}

export default function NetworkSelector({
  selectedNetwork = "devnet",
  onNetworkChange,
}: NetworkSelectorProps) {
  const [switching, setSwitching] = useState(false);

  const handleNetworkSwitch = (network: "devnet" | "mainnet") => {
    if (network === selectedNetwork) return;
    
    setSwitching(true);
    // Switch network immediately - no artificial delays
    onNetworkChange(network);
    setSwitching(false);
  };

  return (
    <Card className="crypto-card">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="p-3 crypto-gradient rounded-lg">
              {selectedNetwork === "devnet" ? (
                <TestTube className="h-5 w-5 text-white" />
              ) : (
                <Globe className="h-5 w-5 text-white" />
              )}
            </div>
            <div>
              <p className="text-sm font-medium text-primary">Network</p>
              <div className="flex items-center gap-3">
                <Badge variant={selectedNetwork === "devnet" ? "secondary" : "default"} className="crypto-glow">
                  {selectedNetwork === "devnet" ? "Devnet" : "Mainnet"}
                </Badge>
                {switching && (
                  <span className="text-xs text-muted-foreground">Switching...</span>
                )}
              </div>
            </div>
          </div>

          <div className="flex gap-1">
            <Button
              variant={selectedNetwork === "devnet" ? "default" : "ghost"}
              size="sm"
              onClick={() => handleNetworkSwitch("devnet")}
              disabled={switching}
              className={selectedNetwork === "devnet" ? "crypto-button" : "hover:bg-primary/10"}
              data-testid="button-network-devnet"
            >
              <TestTube className="h-3 w-3 mr-1" />
              Devnet
            </Button>
            <Button
              variant={selectedNetwork === "mainnet" ? "default" : "ghost"}
              size="sm"
              onClick={() => handleNetworkSwitch("mainnet")}
              disabled={switching}
              className={selectedNetwork === "mainnet" ? "crypto-button" : "hover:bg-primary/10"}
              data-testid="button-network-mainnet"
            >
              <Globe className="h-3 w-3 mr-1" />
              Mainnet
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}