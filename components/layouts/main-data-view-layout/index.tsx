import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTriggerWithoutIcon,
} from "@/components/ui/accordion";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function MainDataViewLayout({
  filter,
  action,
  dataView,
  pagination,
}: {
  filter?: React.ReactNode;
  action?: React.ReactNode;
  dataView: React.ReactNode;
  pagination?: React.ReactNode;
}) {
  return (
    <div className="grid gap-4">
      <div className="grid lg:flex lg:items-end lg:justify-between gap-4">
        <div className="hidden lg:block">{filter}</div>
        <Accordion
          collapsible
          type="single"
          className="w-full block lg:hidden border-b-0"
        >
          <AccordionItem value="Filters" className="border-b-0 ">
            <AccordionTriggerWithoutIcon
              className={cn(
                buttonVariants({ variant: "secondary", size: "sm" }),
                "w-full"
              )}
            >
              Filters
            </AccordionTriggerWithoutIcon>
            <AccordionContent className="py-4 px-1">{filter}</AccordionContent>
          </AccordionItem>
        </Accordion>
        <div className="grid">{action}</div>
      </div>
      {dataView}
      {pagination && pagination}
    </div>
  );
}
