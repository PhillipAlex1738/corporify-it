
import { useState, useEffect } from 'react';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious
} from '@/components/ui/carousel';
import { MessageCircle, ArrowRight } from 'lucide-react';

type ExampleMessage = {
  casual: string;
  professional: string;
  tone: string;
};

const exampleMessages: ExampleMessage[] = [
  {
    casual: "Hey team, gonna be late for the meeting today, traffic's awful!",
    professional: "Dear Team,\n\nI wanted to inform you that I will be arriving later than expected for today's meeting due to significant traffic congestion.\n\nThank you for your understanding.\n\nBest regards.",
    tone: "Formal"
  },
  {
    casual: "That deadline doesn't work for me, I need more time to finish this project.",
    professional: "I've reviewed the proposed timeline for the project and believe we may need to discuss adjusting the deadline to ensure we can deliver a quality outcome that meets all the requirements.\n\nCould we schedule a brief conversation to explore options?\n\nThank you for your consideration.",
    tone: "Diplomatic"
  },
  {
    casual: "Found a bug in the app, needs fixing ASAP.",
    professional: "I've identified an issue in the application that requires immediate attention. The problem is affecting core functionality and should be addressed as soon as possible to minimize impact on users.\n\nI've documented the steps to reproduce the issue and am available to provide more details if needed.",
    tone: "Direct"
  },
  {
    casual: "I'm not happy with how the project is going, we need to make some changes.",
    professional: "I'd like to discuss some concerns I have about our current project trajectory. There are several aspects I believe we could optimize to improve our outcomes.\n\nWould it be possible to schedule a team meeting to collaborate on potential adjustments to our approach?\n\nI appreciate your openness to feedback.",
    tone: "Friendly Professional"
  },
  {
    casual: "Can't make the deadline, too much other stuff going on.",
    professional: "After reviewing my current workload and commitments, I need to inform you that I will require additional time to complete the assigned deliverable.\n\nI'd like to propose a revised timeline that would allow me to maintain quality standards while managing competing priorities.\n\nPlease let me know if we can discuss this further.",
    tone: "Concise"
  }
];

const CorporifiedExamples = () => {
  const [activeExample, setActiveExample] = useState(0);

  useEffect(() => {
    // Auto-advance the carousel every 8 seconds
    const interval = setInterval(() => {
      setActiveExample((prev) => (prev + 1) % exampleMessages.length);
    }, 8000);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 relative">
      <h3 className="font-medium text-lg mb-6 text-corporate-800">See how casual messages transform:</h3>
      
      <Carousel className="w-full" 
        setApi={(api) => {
          api?.on('select', () => {
            setActiveExample(api.selectedScrollSnap());
          });
        }}>
        <CarouselContent>
          {exampleMessages.map((example, index) => (
            <CarouselItem key={index}>
              <div className="space-y-6">
                <div className="bg-cream rounded-md p-4 border border-gray-200">
                  <div className="flex items-center gap-2 mb-2">
                    <MessageCircle className="h-4 w-4 text-corporate-700" />
                    <p className="font-medium text-corporate-800">Casual Message:</p>
                  </div>
                  <p className="text-corporate-600">{example.casual}</p>
                </div>

                <div className="flex justify-center">
                  <ArrowRight className="h-6 w-6 text-corporate-500 animate-pulse" />
                </div>

                <div className="bg-corporate-50 rounded-md p-4 border border-corporate-100">
                  <div className="flex items-center gap-2 mb-2">
                    <MessageCircle className="h-4 w-4 text-corporate-800" />
                    <p className="font-medium text-corporate-800">Professional Version <span className="text-xs ml-2 text-corporate-500">({example.tone} Tone)</span></p>
                  </div>
                  <p className="text-corporate-700 whitespace-pre-line">{example.professional}</p>
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <div className="absolute -bottom-4 left-0 right-0 flex justify-center gap-2 mt-4">
          {exampleMessages.map((_, index) => (
            <button
              key={index}
              className={`h-2 rounded-full transition-all ${
                index === activeExample ? "w-8 bg-corporate-700" : "w-2 bg-corporate-300"
              }`}
              onClick={() => setActiveExample(index)}
              aria-label={`Go to example ${index + 1}`}
            />
          ))}
        </div>
        <CarouselPrevious className="left-2" />
        <CarouselNext className="right-2" />
      </Carousel>
    </div>
  );
};

export default CorporifiedExamples;
