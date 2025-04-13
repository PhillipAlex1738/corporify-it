
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { FileText } from 'lucide-react';

type Template = {
  id: string;
  name: string;
  category: string;
  text: string;
}

const businessTemplates: Template[] = [
  {
    id: 'meeting-request',
    name: 'Meeting Request',
    category: 'Meetings',
    text: 'I need to discuss something with the team. Can we schedule a meeting this week to go over the project status?'
  },
  {
    id: 'meeting-reschedule',
    name: 'Reschedule Meeting',
    category: 'Meetings',
    text: 'I can\'t make our scheduled meeting. Can we move it to another time?'
  },
  {
    id: 'deadline-extension',
    name: 'Deadline Extension',
    category: 'Projects',
    text: 'I need more time to finish this project. The current deadline is too tight.'
  },
  {
    id: 'project-update',
    name: 'Project Status Update',
    category: 'Projects',
    text: 'Here\'s where we stand with the project. We\'ve finished tasks A and B, but C is delayed.'
  },
  {
    id: 'feedback-request',
    name: 'Feedback Request',
    category: 'Feedback',
    text: 'I\'d like your thoughts on my recent work. Can you provide feedback on what I can improve?'
  },
  {
    id: 'issue-report',
    name: 'Issue Report',
    category: 'Problems',
    text: 'I found a problem with the system that needs to be fixed right away.'
  },
  {
    id: 'vacation-request',
    name: 'Vacation Request',
    category: 'Time Off',
    text: 'I want to take some time off next month. Is that okay with the current project schedule?'
  },
  {
    id: 'introduction',
    name: 'Team Introduction',
    category: 'Networking',
    text: 'I\'m new to the team and want to introduce myself. I\'m excited to work with everyone.'
  },
];

const categories = [...new Set(businessTemplates.map(t => t.category))];

type TemplateSelectorProps = {
  onSelect: (template: string) => void;
};

const TemplateSelector = ({ onSelect }: TemplateSelectorProps) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [isOpen, setIsOpen] = useState(false);

  const filteredTemplates = selectedCategory 
    ? businessTemplates.filter(t => t.category === selectedCategory)
    : businessTemplates;

  const handleTemplateSelect = (text: string) => {
    onSelect(text);
    setIsOpen(false);
  };

  return (
    <div>
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button variant="outline" className="w-full justify-start" size="sm">
            <FileText className="mr-2 h-4 w-4" />
            Select Template
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[300px] p-0" align="start">
          <div className="p-4 border-b">
            <Label htmlFor="category" className="text-sm font-medium mb-1.5 block">Filter by category</Label>
            <Select
              value={selectedCategory}
              onValueChange={(value) => setSelectedCategory(value)}
            >
              <SelectTrigger id="category">
                <SelectValue placeholder="All categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All categories</SelectItem>
                {categories.map(category => (
                  <SelectItem key={category} value={category}>{category}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <ScrollArea className="h-[300px]">
            <div className="p-2">
              {filteredTemplates.map(template => (
                <Button
                  key={template.id}
                  variant="ghost"
                  className="w-full justify-start text-left font-normal p-2 h-auto"
                  onClick={() => handleTemplateSelect(template.text)}
                >
                  <div>
                    <div className="font-medium">{template.name}</div>
                    <div className="text-xs text-muted-foreground truncate max-w-[250px]">
                      {template.text}
                    </div>
                  </div>
                </Button>
              ))}
            </div>
          </ScrollArea>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default TemplateSelector;
