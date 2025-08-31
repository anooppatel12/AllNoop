
import { EmiCalculator } from '@/components/financial/emi-calculator';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function EmiCalculatorPage() {
  return (
    <div className="container mx-auto max-w-4xl p-4 md:p-8">
      <div className="flex flex-col items-center justify-center space-y-4 text-center">
        <h1 className="font-headline text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
          EMI Calculator for Loans
        </h1>
        <p className="max-w-[700px] text-muted-foreground md:text-xl">
          Calculate your Equated Monthly Instalment (EMI) for home loans, car loans, or personal loans with ease.
        </p>
      </div>

      <EmiCalculator />

       <Card className="mt-8">
        <CardHeader>
          <CardTitle>What is an EMI?</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-muted-foreground">
          <p>
            An Equated Monthly Instalment (EMI) is a fixed payment amount made by a borrower to a lender at a specified date each calendar month. EMIs are used to pay off both interest and principal each month, so that over a specified number of years, the loan is paid off in full.
          </p>
          <h3 className="font-semibold text-foreground">Why Use an EMI Calculator?</h3>
          <p>
            Planning your finances for a major purchase like a car or house requires careful budgeting. An EMI calculator is an essential tool that helps you:
          </p>
          <ul className="list-disc pl-5 space-y-2">
            <li><strong>Understand Affordability:</strong> Quickly determine the monthly payment for a loan to see if it fits within your budget.</li>
            <li><strong>Compare Loan Offers:</strong> Input different interest rates and tenures from various lenders to find the most cost-effective loan option.</li>
            <li><strong>Plan Repayments:</strong> See a clear picture of your total interest payable and the total amount you will repay over the loan's lifetime.</li>
          </ul>
           <h3 className="font-semibold text-foreground">How to Use the Calculator</h3>
           <p>
            Simply enter the total loan amount you wish to borrow, the annual interest rate offered by the lender, and the loan tenure in years. The tool will instantly calculate your monthly EMI, the total interest you'll pay, and the total amount repayable.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
