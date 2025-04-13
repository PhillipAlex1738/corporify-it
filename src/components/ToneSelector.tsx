
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { Label } from "@/components/ui/label"
import { 
  BadgeCheck,
  Sparkles, 
  MessageSquare,
  FileText, 
  Feather
} from 'lucide-react';
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { type ToneOption } from "@/hooks/useCorporify";

type ToneSelectorProps = {
  selectedTone: ToneOption;
  onChange: (tone: ToneOption) => void;
};

const toneOptions: {
  value: ToneOption;
  label: string;
  icon: React.ElementType;
  description: string;
}[] = [
  { 
    value: 'professional', 
    label: 'Professional', 
    icon: BadgeCheck,
    description: 'Polished business language suitable for most workplace communications'
  },
  { 
    value: 'formal', 
    label: 'Formal', 
    icon: FileText,
    description: 'Strictly formal language for official documents and communications'
  },
  { 
    value: 'friendly', 
    label: 'Friendly', 
    icon: MessageSquare,
    description: 'Warm and personable tone while maintaining professionalism'
  },
  { 
    value: 'concise', 
    label: 'Concise', 
    icon: Sparkles,
    description: 'Brief and to-the-point without unnecessary details'
  },
  { 
    value: 'diplomatic', 
    label: 'Diplomatic', 
    icon: Feather,
    description: 'Tactful language for sensitive situations and negotiations'
  }
];

const ToneSelector = ({ selectedTone, onChange }: ToneSelectorProps) => {
  return (
    <div className="mb-4">
      <div className="flex items-center justify-between mb-2">
        <Label htmlFor="tone-selector" className="text-sm font-medium">
          Select Tone
        </Label>
      </div>
      <ToggleGroup 
        type="single" 
        value={selectedTone}
        onValueChange={(value) => {
          if (value) onChange(value as ToneOption);
        }}
        className="flex flex-wrap gap-2 justify-start"
        id="tone-selector"
      >
        {toneOptions.map((option) => (
          <Tooltip key={option.value} delayDuration={300}>
            <TooltipTrigger asChild>
              <ToggleGroupItem 
                value={option.value}
                aria-label={option.label}
                className="data-[state=on]:bg-corporate-100 data-[state=on]:text-corporate-900 border border-muted whitespace-nowrap"
              >
                <option.icon className="h-4 w-4 mr-1.5" />
                {option.label}
              </ToggleGroupItem>
            </TooltipTrigger>
            <TooltipContent>
              <p className="max-w-xs">{option.description}</p>
            </TooltipContent>
          </Tooltip>
        ))}
      </ToggleGroup>
    </div>
  );
};

export default ToneSelector;
