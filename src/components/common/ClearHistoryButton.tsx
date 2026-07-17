import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';
import { toast } from '@/components/ui/sonner';
import { recordActivity } from '@/hooks/use-toast';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

interface ClearHistoryButtonProps {
  itemLabel: string;
  pageName?: string;
  onConfirm: () => Promise<{ success: boolean }>;
  onCleared?: () => void;
  /** 'clear-all' (default) permanently deletes everything in the collection.
   *  'delete-selected' deletes only the items the caller has already picked out (itemLabel
   *  should describe the count/selection, e.g. "3 selected journal entries"). */
  mode?: 'clear-all' | 'delete-selected';
}

const ClearHistoryButton = ({ itemLabel, pageName = 'ClearHistory', onConfirm, onCleared, mode = 'clear-all' }: ClearHistoryButtonProps) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const isSelectedMode = mode === 'delete-selected';

  const handleConfirm = async () => {
    setIsDeleting(true);
    const result = await onConfirm();
    setIsDeleting(false);

    if (result.success) {
      toast.success(isSelectedMode ? 'Deleted' : 'History cleared', {
        description: isSelectedMode
          ? `${itemLabel} have been permanently deleted.`
          : `All your ${itemLabel} have been permanently deleted.`,
      });
      recordActivity('delete', `${isSelectedMode ? 'Deleted' : 'Cleared'} ${itemLabel}`, pageName);
      onCleared?.();
    } else {
      toast.error(isSelectedMode ? 'Could not delete' : 'Could not clear history', { description: 'Please try again in a moment.' });
    }
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="flex items-center gap-2 text-destructive hover:text-destructive"
        >
          <Trash2 className="h-4 w-4" />
          {isSelectedMode ? 'Delete Selected' : 'Clear History'}
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{isSelectedMode ? `Delete ${itemLabel}?` : `Clear all ${itemLabel}?`}</AlertDialogTitle>
          <AlertDialogDescription>
            {isSelectedMode
              ? `This permanently deletes ${itemLabel} from our servers. This cannot be undone.`
              : `This permanently deletes all of your ${itemLabel} from our servers. It won't disappear on its own — this is the only way it goes away, and it cannot be undone.`}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleConfirm}
            disabled={isDeleting}
            className="bg-destructive hover:bg-destructive/90"
          >
            {isDeleting ? 'Deleting...' : isSelectedMode ? 'Yes, delete selected' : 'Yes, delete everything'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default ClearHistoryButton;
