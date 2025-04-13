
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
  color: string;
}[] = [
  { 
    value: 'professional', 
    label: 'Professional', 
    icon: BadgeCheck,
    description: 'Polished business language suitable for most workplace communications',
    color: 'bg-blue-100 text-blue-800 border-blue-300'
  },
  { 
    value: 'formal', 
    label: 'Formal', 
    icon: FileText,
    description: 'Strictly formal language for official documents and communications',
    color: 'bg-purple-100 text-purple-800 border-purple-300'
  },
  { 
    value: 'friendly', 
    label: 'Friendly', 
    icon: MessageSquare,
    description: 'Warm and personable tone while maintaining professionalism',
    color: 'bg-green-100 text-green-800 border-green-300'
  },
  { 
    value: 'concise', 
    label: 'Concise', 
    icon: Sparkles,
    description: 'Brief and to-the-point without unnecessary details',
    color: 'bg-amber-100 text-amber-800 border-amber-300'
  },
  { 
    value: 'diplomatic', 
    label: 'Diplomatic', 
    icon: Feather,
    description: 'Tactful language for sensitive situations and negotiations',
    color: 'bg-sky-100 text-sky-800 border-sky-300'
  }
];

const ToneSelector = ({ selectedTone, onChange }: ToneSelectorProps) => {
  // Find the selected tone option
  const selectedToneOption = toneOptions.find(option => option.value === selectedTone);
  
  return (
    <div className="mb-4">
      <div className="flex items-center justify-between mb-2">
        <Label htmlFor="tone-selector" className="text-sm font-medium">
          Select Tone
        </Label>
        {selectedToneOption && (
          <span className={`text-xs px-2 py-0.5 rounded-full ${selectedToneOption.color}`}>
            <selectedToneOption.icon className="h-3 w-3 inline mr-1" />
            {selectedToneOption.label}
          </span>
        )}
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
        {toneOptions.map((option) => {
          const isSelected = selectedTone === option.value;
          return (
            <Tooltip key={option.value} delayDuration={300}>
              <TooltipTrigger asChild>
                <ToggleGroupItem 
                  value={option.value}
                  aria-label={option.label}
                  className={`
                    transition-all duration-200
                    ${isSelected ? option.color : 'border border-muted'} 
                    ${isSelected ? 'shadow-sm' : ''}
                    whitespace-nowrap
                  `}
                >
                  <option.icon className="h-4 w-4 mr-1.5" />
                  {option.label}
                </ToggleGroupItem>
              </TooltipTrigger>
              <TooltipContent>
                <p className="max-w-xs">{option.description}</p>
              </TooltipContent>
            </Tooltip>
          );
        })}
      </ToggleGroup>
    </div>
  );
};

export default ToneSelector;
