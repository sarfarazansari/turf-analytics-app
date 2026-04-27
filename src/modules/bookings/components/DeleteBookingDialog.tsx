"use client";

import { useState } from "react";
import { Trash2 } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

type DeleteBookingDialogProps = {
  bookingId: string;
  open: boolean;
  onClose: () => void;
  onConfirm: (payload: { bookingId: string; reason: string }) => Promise<void>;
};

export default function DeleteBookingDialog({
  bookingId,
  open,
  onClose,
  onConfirm,
}: DeleteBookingDialogProps) {
  const [reason, setReason] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  const handleConfirm = async () => {
    const trimmedReason = reason.trim();

    if (!trimmedReason || isDeleting) return;

    try {
      setIsDeleting(true);
      await onConfirm({
        bookingId,
        reason: trimmedReason,
      });
      setReason("");
      onClose();
    } finally {
      setIsDeleting(false);
    }
  };

  const handleOpenChange = (nextOpen: boolean) => {
    if (!nextOpen && !isDeleting) {
      setReason("");
      onClose();
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={handleOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2">
            <Trash2 className="h-5 w-5 text-destructive" />
            Delete Booking
          </AlertDialogTitle>

          <AlertDialogDescription>
            This will soft delete the booking, void all linked payments, and
            remove it from active reports. This action is logged and can be
            audited later.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <div className="space-y-2">
          <Label htmlFor="delete-reason">Reason</Label>
          <Textarea
            id="delete-reason"
            placeholder="Enter delete reason..."
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            disabled={isDeleting}
          />
        </div>

        <AlertDialogFooter>
          <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>

          <AlertDialogAction
            onClick={(e) => {
              e.preventDefault();
              void handleConfirm();
            }}
            disabled={!reason.trim() || isDeleting}
            className="bg-destructive text-white hover:bg-destructive/90"
          >
            {isDeleting ? "Deleting..." : "Delete Booking"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}