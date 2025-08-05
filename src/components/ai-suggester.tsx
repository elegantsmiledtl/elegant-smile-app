'use client';

import { useState } from 'react';
import { useForm, ControllerRenderProps } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Sparkles } from 'lucide-react';
import { getSmartSuggestions } from '@/ai/flows/smart-input-suggestions';
import { useToast } from '@/hooks/use-toast';

interface AiSuggesterProps {
  field: ControllerRenderProps<any, any>;
  form: ReturnType<typeof useForm<any>>;
  fieldName: string;
  placeholder?: string;
  fieldDescription: string;
  contextualInformation: string;
}

export default function AiSuggester({
  field,
  form,
  fieldName,
  placeholder,
  fieldDescription,
  contextualInformation,
}: AiSuggesterProps) {
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const { toast } = useToast();

  const handleSuggestionClick = async () => {
    setIsLoading(true);
    setSuggestions([]);
    try {
      const result = await getSmartSuggestions({
        fieldDescription,
        existingData: field.value,
        contextualInformation,
      });
      if (result.suggestions && result.suggestions.length > 0) {
        setSuggestions(result.suggestions);
        setIsOpen(true);
      } else {
        toast({
          description: "No suggestions found.",
        });
        setIsOpen(false);
      }
    } catch (error) {
      console.error('Error getting AI suggestions:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Could not fetch AI suggestions.',
      });
      setIsOpen(false);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectSuggestion = (suggestion: string) => {
    form.setValue(fieldName, suggestion, { shouldValidate: true });
    setIsOpen(false);
  };
  
  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <div className="relative">
        <Input placeholder={placeholder} {...field} />
        <PopoverTrigger asChild>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={handleSuggestionClick}
            disabled={isLoading}
            className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7 text-primary"
          >
            <Sparkles className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
          </Button>
        </PopoverTrigger>
      </div>
      <PopoverContent className="w-full p-2" align="start">
        {suggestions.length > 0 && (
          <div className="flex flex-col gap-1">
            {suggestions.map((suggestion, index) => (
              <Button
                key={index}
                variant="ghost"
                className="justify-start"
                onClick={() => handleSelectSuggestion(suggestion)}
              >
                {suggestion}
              </Button>
            ))}
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
}
