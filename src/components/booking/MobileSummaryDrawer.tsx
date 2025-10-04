import { Button } from "@/components/ui/button";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerTrigger } from "@/components/ui/drawer";
import { BookingSummary } from "./BookingSummary";
import { useBookingState } from "@/hooks/use-booking-state";
import { ChevronUp } from "lucide-react";

export const MobileSummaryDrawer = () => {
  const { getSummary } = useBookingState();
  const summary = getSummary();

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-background border-t shadow-lg">
      <Drawer>
        <DrawerTrigger asChild>
          <Button variant="ghost" className="w-full rounded-none h-16 justify-between px-6">
            <div className="text-left">
              <p className="text-xs text-muted-foreground">Total</p>
              <p className="text-xl font-bold text-primary">₦{summary.total.toLocaleString()}</p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm">View Summary</span>
              <ChevronUp className="h-4 w-4" />
            </div>
          </Button>
        </DrawerTrigger>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>Booking Summary</DrawerTitle>
          </DrawerHeader>
          <div className="p-4">
            <BookingSummary />
          </div>
        </DrawerContent>
      </Drawer>
    </div>
  );
};
