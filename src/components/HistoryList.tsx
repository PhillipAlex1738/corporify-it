
import { useState } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { type CorporifyHistory } from '@/types/corporify';
import { Clock, ChevronDown, ChevronUp, Copy } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

type HistoryListProps = {
  history: CorporifyHistory[];
};

const HistoryList = ({ history }: HistoryListProps) => {
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());
  const { toast } = useToast();
  
  if (history.length === 0) {
    return (
      <Card className="mt-6">
        <CardContent className="pt-6 text-center text-muted-foreground">
          Your corporified message history will appear here.
        </CardContent>
      </Card>
    );
  }

  const toggleExpand = (id: string) => {
    const newSet = new Set(expandedItems);
    if (newSet.has(id)) {
      newSet.delete(id);
    } else {
      newSet.add(id);
    }
    setExpandedItems(newSet);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      description: "Copied to clipboard!",
    });
  };

  return (
    <div className="mt-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold tracking-tight">History</h2>
        <span className="text-sm text-muted-foreground">{history.length} corporification{history.length !== 1 ? 's' : ''}</span>
      </div>
      
      <ScrollArea className="h-[400px] pr-4">
        <div className="space-y-4">
          {history.map((item) => {
            const isExpanded = expandedItems.has(item.id);
            const date = new Date(item.timestamp);
            const formattedDate = date.toLocaleDateString();
            const formattedTime = date.toLocaleTimeString();
            
            return (
              <Card key={item.id} className="border shadow-sm">
                <CardHeader className="p-4 pb-2">
                  <CardTitle className="text-sm font-medium flex items-center justify-between">
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      <span>{formattedDate} at {formattedTime}</span>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="h-8 w-8 p-0"
                      onClick={() => toggleExpand(item.id)}
                    >
                      {isExpanded ? (
                        <ChevronUp className="h-4 w-4" />
                      ) : (
                        <ChevronDown className="h-4 w-4" />
                      )}
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4 pt-2">
                  <p className="text-sm">{item.output}</p>
                </CardContent>
                {isExpanded && (
                  <CardFooter className="p-4 pt-0 flex flex-col items-start">
                    <div className="w-full">
                      <div className="text-xs font-medium text-muted-foreground mb-1">Original Text:</div>
                      <div className="text-sm bg-muted p-3 rounded-md">
                        {item.input}
                      </div>
                    </div>
                    <div className="flex justify-end w-full mt-3">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="text-xs"
                        onClick={() => copyToClipboard(item.output)}
                      >
                        <Copy className="h-3 w-3 mr-1" /> Copy
                      </Button>
                    </div>
                  </CardFooter>
                )}
              </Card>
            );
          })}
        </div>
      </ScrollArea>
    </div>
  );
};

export default HistoryList;
