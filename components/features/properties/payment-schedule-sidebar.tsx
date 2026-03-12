"use client";

import { type Property, type PlanType, fmt, fmtK } from "@/lib/data";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Calendar } from "lucide-react";

interface PaymentScheduleSidebarProps {
  property: Property;
  plan: PlanType;
  children: React.ReactNode;
}

export function PaymentScheduleSidebar({ property: p, plan, children }: PaymentScheduleSidebarProps) {
  const final = plan === "custom" ? p.customFinal : p.standardFinal;
  const installments = plan === "custom" ? p.customInstallments : p.standardInstallments;
  const duration = plan === "custom" ? p.customDuration : p.standardDuration;
  const downPayment = plan === "custom" ? p.downPaymentCustom : p.downPaymentStd;
  
  const remaining = final - downPayment;
  const perInstallment = remaining / installments;
  
  // Generate mock dates starting from Feb 2026
  const schedule = [];
  const startDate = new Date(2026, 1, 1); // Feb 2026

  // 1. Down Payment
  schedule.push({
    date: startDate.toLocaleDateString("en-US", { month: "short", year: "numeric" }),
    amount: downPayment,
    type: "Down Payment",
    description: "Contract Signing",
  });

  // 2. Installments
  for (let i = 1; i <= installments; i++) {
    const date = new Date(startDate);
    const monthsToAdd = plan === "custom" ? i * 3 : i; // Quarterly vs Monthly
    date.setMonth(startDate.getMonth() + monthsToAdd);
    
    schedule.push({
      date: date.toLocaleDateString("en-US", { month: "short", year: "numeric" }),
      amount: perInstallment,
      type: "Installment",
      description: `Payment ${i} of ${installments}`,
    });
  }

  // 3. Maintenance (usually due at delivery/start)
  schedule.push({
    date: "At Delivery",
    amount: p.maintenanceAmount,
    type: "Maintenance",
    description: `One-time ${p.maintenancePct}% fee`,
  });

  return (
    <Sheet>
      <SheetTrigger asChild>
        {children}
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-md p-0 flex flex-col">
        <SheetHeader className="p-6 border-b">
          <SheetTitle className="flex items-center gap-2">
            <Calendar className="size-5 text-primary" />
            Payment Schedule
          </SheetTitle>
          <SheetDescription>
            {p.project} · {p.type} · {plan === "custom" ? "Customized" : "Standard"} Plan
          </SheetDescription>
        </SheetHeader>
        
        <div className="flex-1 overflow-hidden">
          <ScrollArea className="h-full">
            <div className="p-6">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[100px]">Date</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {schedule.map((item, idx) => (
                    <TableRow key={idx} className={item.type === "Down Payment" || item.type === "Maintenance" ? "bg-muted/50 font-semibold" : ""}>
                      <TableCell className="text-xs">{item.date}</TableCell>
                      <TableCell>
                        <div className="text-xs">{item.description}</div>
                        <div className="text-[10px] text-muted-foreground">{item.type}</div>
                      </TableCell>
                      <TableCell className="text-right font-mono text-xs">
                        {fmtK(Math.round(item.amount))}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </ScrollArea>
        </div>
        
        <div className="p-6 border-t bg-muted/20">
          <div className="flex justify-between items-center text-sm">
            <span className="font-semibold">Total Price</span>
            <span className="font-mono font-bold text-primary">{fmt(Math.round(final + p.maintenanceAmount))} EGP</span>
          </div>
          <p className="text-[10px] text-muted-foreground mt-2 italic">
            * Maintenance included. Chronological order may vary by contract specifics.
          </p>
        </div>
      </SheetContent>
    </Sheet>
  );
}
