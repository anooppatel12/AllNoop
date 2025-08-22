
import { SudokuGame } from '@/components/games/sudoku';

export default function SudokuPage() {
  return (
    <div className="container mx-auto max-w-4xl p-4 md:p-8">
      <div className="flex flex-col items-center justify-center space-y-4 text-center">
        <h1 className="font-headline text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
          Sudoku
        </h1>
        <p className="max-w-[700px] text-muted-foreground md:text-xl">
          Fill the grid so that every row, column, and 3x3 box contains the digits 1 through 9.
        </p>
      </div>

      <SudokuGame />
    </div>
  );
}
