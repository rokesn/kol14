import ToggleSection from '../ToggleSection';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function ToggleSectionExample() {
  return (
    <div className="space-y-4">
      <ToggleSection
        title="Supply Chain Metadata"
        description="Configure supply chain and metadata settings"
        defaultEnabled={true}
      >
        <div className="space-y-4">
          <div>
            <Label>Metadata URI</Label>
            <Input placeholder="https://example.com/metadata.json" />
          </div>
          <div>
            <Label>Supply Amount</Label>
            <Input type="number" placeholder="1000000" />
          </div>
        </div>
      </ToggleSection>
      
      <ToggleSection
        title="Royalty/Creator Information"
        description="Set up royalties and creator details"
      >
        <div className="space-y-4">
          <div>
            <Label>Creator Address</Label>
            <Input placeholder="Enter creator wallet address" />
          </div>
          <div>
            <Label>Royalty Percentage</Label>
            <Input type="number" placeholder="5" />
          </div>
        </div>
      </ToggleSection>
    </div>
  );
}