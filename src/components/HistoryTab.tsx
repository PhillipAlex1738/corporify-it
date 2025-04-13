
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Clock, Copy, Star, Trash2 } from 'lucide-react';
import { type CorporifyHistory } from '@/hooks/useCorporify';

type HistoryTabProps = {
  history: CorporifyHistory[];
  onSelect: (text: string) => void;
  savedMessages: CorporifyHistory[];
  onToggleSave: (item: CorporifyHistory) => void;
  onRemoveFromSaved: (id: string) => void;
};

const HistoryTab = ({ 
  history, 
  onSelect, 
  savedMessages,
  onToggleSave,
  onRemoveFromSaved
}: HistoryTabProps) => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<'history' | 'saved'>('history');
  
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      description: "Copied to clipboard!",
    });
  };

  const isSaved = (id: string) => {
    return savedMessages.some(item => item.id === id);
  };

  const displayItems = activeTab === 'history' ? history : savedMessages;

  return (
    <div className="mt-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex space-x-2">
          <Button
            variant={activeTab === 'history' ? "secondary" : "outline"}
            size="sm"
            onClick={() => setActiveTab('history')}
            className="text-sm"
          >
            <Clock className="h-4 w-4 mr-2" />
            Recent History
          </Button>
          <Button
            variant={activeTab === 'saved' ? "secondary" : "outline"}
            size="sm"
            onClick={() => setActiveTab('saved')}
            className="text-sm"
          >
            <Star className="h-4 w-4 mr-2" />
            Saved Messages
          </Button>
        </div>
        <span className="text-sm text-muted-foreground">
          {displayItems.length} {activeTab === 'history' ? 'items' : 'saved'}
        </span>
      </div>
      
      <ScrollArea className="h-[400px] pr-4">
        {displayItems.length === 0 ? (
          <Card>
            <CardContent className="pt-6 text-center text-muted-foreground">
              {activeTab === 'history' ? 'Your message history will appear here.' : 'Your saved messages will appear here.'}
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {displayItems.map((item) => {
              const date = new Date(item.timestamp);
              const formattedDate = date.toLocaleDateString();
              const formattedTime = date.toLocaleTimeString();
              
              return (
                <Card key={item.id} className="border shadow-sm">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between text-sm font-medium text-muted-foreground mb-2">
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        <span>{formattedDate} at {formattedTime}</span>
                      </div>
                      <div className="flex space-x-1">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="h-8 w-8 p-0"
                          onClick={() => activeTab === 'saved' ? onRemoveFromSaved(item.id) : onToggleSave(item)}
                        >
                          {activeTab === 'saved' ? (
                            <Trash2 className="h-4 w-4 text-red-500" />
                          ) : (
                            <Star className={`h-4 w-4 ${isSaved(item.id) ? 'text-yellow-500 fill-yellow-500' : ''}`} />
                          )}
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="h-8 w-8 p-0"
                          onClick={() => copyToClipboard(item.corporateText)}
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <p className="text-sm">{item.corporateText}</p>
                    <div className="flex justify-end mt-3">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => onSelect(item.originalText)}
                      >
                        Use Again
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </ScrollArea>
    </div>
  );
};

export default HistoryTab;
