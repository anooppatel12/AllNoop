
import { UnitConverter } from '@/components/math/unit-converter';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function UnitConverterPage() {
  return (
    <div className="container mx-auto max-w-4xl p-4 md:p-8">
      <div className="flex flex-col items-center justify-center space-y-4 text-center">
        <h1 className="font-headline text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
          Universal Unit Converter
        </h1>
        <p className="max-w-[700px] text-muted-foreground md:text-xl">
          Instantly convert between various units of measurement for length, mass, and temperature.
        </p>
      </div>

      <UnitConverter />

      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Why Use a Unit Converter?</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-muted-foreground">
          <p>
            In a globalized world, we constantly encounter different systems of measurement. Whether you're a student working on a physics problem, a chef following a recipe from another country, or a traveler trying to understand distances, a unit converter is an indispensable tool. It eliminates the complexity of manual calculations and provides quick, accurate results.
          </p>
          <h3 className="font-semibold text-foreground">Supported Conversions</h3>
          <p>This tool supports a variety of common conversions:</p>
          <ul className="list-disc pl-5 space-y-2">
            <li><strong>Length:</strong> Convert between meters, kilometers, centimeters, miles, yards, feet, and inches.</li>
            <li><strong>Mass:</strong> Switch between kilograms, grams, milligrams, pounds, and ounces.</li>
            <li><strong>Temperature:</strong> Easily convert between Celsius, Fahrenheit, and Kelvin.</li>
          </ul>
           <h3 className="font-semibold text-foreground">How It Works</h3>
           <p>
            First, select the type of conversion you need (e.g., Length). Then, choose the "From" and "To" units from the dropdown menus. Enter the value you wish to convert in the "From" field, and the converted value will appear instantly in the "To" field.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
