
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Gamepad2, RefreshCcw, Check, Clock } from "lucide-react";
import { toast } from "sonner";

type GameLevel = {
  id: number;
  difficulty: "easy" | "medium" | "hard";
  gridSize: { rows: number; cols: number };
  timeLimit: number; // in seconds
};

interface Cell {
  letter: string;
  isSelected: boolean;
  rowIndex: number;
  colIndex: number;
}

const DIRECTIONS = [
  { row: -1, col: 0 }, // up
  { row: 1, col: 0 }, // down
  { row: 0, col: -1 }, // left
  { row: 0, col: 1 }, // right
  { row: -1, col: -1 }, // up-left
  { row: -1, col: 1 }, // up-right
  { row: 1, col: -1 }, // down-left
  { row: 1, col: 1 }, // down-right
];

const LEVELS: GameLevel[] = [
  {
    id: 1,
    difficulty: "easy",
    gridSize: { rows: 6, cols: 6 },
    timeLimit: 180, // 3 minutes
  },
  {
    id: 2,
    difficulty: "medium",
    gridSize: { rows: 8, cols: 8 },
    timeLimit: 240, // 4 minutes
  },
  {
    id: 3,
    difficulty: "hard",
    gridSize: { rows: 10, cols: 10 },
    timeLimit: 300, // 5 minutes
  },
];

const WORD_CATEGORIES = [
  { id: "calm", name: "Calm Words", words: ["PEACE", "CALM", "RELAX", "REST", "BREATHE", "SERENE", "STEADY", "GENTLE", "QUIET", "STILL"] },
  { id: "positive", name: "Positive Words", words: ["HAPPY", "JOY", "SMILE", "LOVE", "HOPE", "DREAM", "KIND", "BRAVE", "STRONG", "GLOW"] },
  { id: "nature", name: "Nature Words", words: ["TREE", "RIVER", "LEAF", "FLOWER", "GRASS", "OCEAN", "STONE", "CLOUD", "STAR", "MOON"] },
];

const formatTime = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
};

const WordZenGame = () => {
  const [selectedLevel, setSelectedLevel] = useState<GameLevel>(LEVELS[0]);
  const [currentCategory, setCurrentCategory] = useState(WORD_CATEGORIES[0]);
  const [grid, setGrid] = useState<Cell[][]>([]);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameCompleted, setGameCompleted] = useState(false);
  const [hiddenWords, setHiddenWords] = useState<string[]>([]);
  const [foundWords, setFoundWords] = useState<string[]>([]);
  const [selectedCells, setSelectedCells] = useState<Cell[]>([]);
  const [timeLeft, setTimeLeft] = useState(0);
  const [score, setScore] = useState(0);

  // Initialize game grid with given level
  const initializeGame = () => {
    const { rows, cols } = selectedLevel.gridSize;
    setTimeLeft(selectedLevel.timeLimit);
    setFoundWords([]);
    setScore(0);
    
    // Create list of words to hide
    const wordsToHide = [...currentCategory.words].sort(() => 0.5 - Math.random()).slice(0, 5);
    setHiddenWords(wordsToHide);
    
    // Create empty grid
    let newGrid: Cell[][] = [];
    for (let i = 0; i < rows; i++) {
      newGrid[i] = [];
      for (let j = 0; j < cols; j++) {
        newGrid[i][j] = {
          letter: "",
          isSelected: false,
          rowIndex: i,
          colIndex: j
        };
      }
    }
    
    // Place words in grid
    for (const word of wordsToHide) {
      let placed = false;
      let attempts = 0;
      while (!placed && attempts < 100) {
        attempts++;
        const direction = DIRECTIONS[Math.floor(Math.random() * DIRECTIONS.length)];
        const startRow = Math.floor(Math.random() * rows);
        const startCol = Math.floor(Math.random() * cols);
        
        // Check if word fits in this direction
        if (canPlaceWord(newGrid, word, startRow, startCol, direction, rows, cols)) {
          // Place the word
          placeWord(newGrid, word, startRow, startCol, direction);
          placed = true;
        }
      }
      
      // If we couldn't place the word after many attempts, try another approach
      if (!placed) {
        console.log(`Couldn't place word: ${word}`);
      }
    }
    
    // Fill remaining empty cells with random letters
    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < cols; j++) {
        if (newGrid[i][j].letter === "") {
          newGrid[i][j].letter = String.fromCharCode(65 + Math.floor(Math.random() * 26)); // A-Z
        }
      }
    }
    
    setGrid(newGrid);
    setGameStarted(true);
    setGameCompleted(false);
  };

  const canPlaceWord = (grid: Cell[][], word: string, startRow: number, startCol: number, direction: { row: number, col: number }, rows: number, cols: number): boolean => {
    const length = word.length;
    
    for (let i = 0; i < length; i++) {
      const rowPos = startRow + i * direction.row;
      const colPos = startCol + i * direction.col;
      
      // Check bounds
      if (rowPos < 0 || rowPos >= rows || colPos < 0 || colPos >= cols) {
        return false;
      }
      
      // Check if cell is occupied by different letter
      if (grid[rowPos][colPos].letter !== "" && grid[rowPos][colPos].letter !== word[i]) {
        return false;
      }
    }
    
    return true;
  };

  const placeWord = (grid: Cell[][], word: string, startRow: number, startCol: number, direction: { row: number, col: number }) => {
    const length = word.length;
    
    for (let i = 0; i < length; i++) {
      const rowPos = startRow + i * direction.row;
      const colPos = startCol + i * direction.col;
      grid[rowPos][colPos].letter = word[i];
    }
  };

  // Handle cell selection
  const handleCellClick = (rowIndex: number, colIndex: number) => {
    if (!gameStarted || gameCompleted) return;
    
    const cell = grid[rowIndex][colIndex];
    let newSelectedCells = [...selectedCells];
    
    if (selectedCells.length === 0) {
      // First cell selection
      newSelectedCells = [cell];
    } else if (selectedCells.includes(cell)) {
      // If clicking on a selected cell
      if (cell === selectedCells[selectedCells.length - 1]) {
        // If it's the last cell, remove it
        newSelectedCells.pop();
      } else if (cell === selectedCells[0]) {
        // If it's the first cell, reverse the selection
        newSelectedCells.reverse();
      } else {
        // If it's in the middle, truncate the selection up to this cell
        const index = selectedCells.indexOf(cell);
        newSelectedCells = selectedCells.slice(0, index + 1);
      }
    } else {
      // Check if the new cell is adjacent to the last selected cell
      const lastCell = selectedCells[selectedCells.length - 1];
      const isAdjacent = Math.abs(lastCell.rowIndex - rowIndex) <= 1 && 
                            Math.abs(lastCell.colIndex - colIndex) <= 1;
      
      if (isAdjacent) {
        // Check if the direction is consistent
        if (selectedCells.length === 1) {
          // Second cell, establish direction
          newSelectedCells.push(cell);
        } else {
          // Check if new cell follows the established direction
          const directionRow = selectedCells[1].rowIndex - selectedCells[0].rowIndex;
          const directionCol = selectedCells[1].colIndex - selectedCells[0].colIndex;
          
          const newDirRow = cell.rowIndex - lastCell.rowIndex;
          const newDirCol = cell.colIndex - lastCell.colIndex;
          
          // Only add cell if direction is consistent
          if ((directionRow === 0 && newDirRow === 0) || 
              (directionCol === 0 && newDirCol === 0) ||
              (directionRow !== 0 && directionCol !== 0 && 
               (directionRow / Math.abs(directionRow) === newDirRow) && 
               (directionCol / Math.abs(directionCol) === newDirCol))) {
            newSelectedCells.push(cell);
          }
        }
      }
    }
    
    setSelectedCells(newSelectedCells);
    
    // Update grid to show selection
    const newGrid = [...grid.map(row => [...row])];
    for (let i = 0; i < newGrid.length; i++) {
      for (let j = 0; j < newGrid[i].length; j++) {
        newGrid[i][j] = { ...newGrid[i][j], isSelected: false };
      }
    }
    
    for (const selectedCell of newSelectedCells) {
      newGrid[selectedCell.rowIndex][selectedCell.colIndex].isSelected = true;
    }
    
    setGrid(newGrid);
    
    // Check if a word is formed
    checkWord(newSelectedCells);
  };

  const checkWord = (cells: Cell[]) => {
    if (cells.length < 3) return; // Words must be at least 3 letters
    
    const word = cells.map(cell => cell.letter).join("");
    const reversedWord = [...word].reverse().join("");
    
    // Check if the word (or its reverse) is in our hidden words list
    for (const hiddenWord of hiddenWords) {
      if (word === hiddenWord || reversedWord === hiddenWord) {
        if (!foundWords.includes(hiddenWord)) {
          // Word found!
          const newFoundWords = [...foundWords, hiddenWord];
          setFoundWords(newFoundWords);
          
          // Calculate score based on word length and game level
          const wordScore = hiddenWord.length * (selectedLevel.id * 10);
          setScore(prevScore => prevScore + wordScore);
          
          toast.success(`You found ${hiddenWord}! +${wordScore} points`);
          
          // Clear selection
          setSelectedCells([]);
          
          // Check if all words are found
          if (newFoundWords.length === hiddenWords.length) {
            setGameCompleted(true);
            toast.success("Congratulations! You found all words!", {
              duration: 5000
            });
          }
          
          return;
        }
      }
    }
  };

  // Handle game timer
  useEffect(() => {
    let timer: number;
    
    if (gameStarted && !gameCompleted && timeLeft > 0) {
      timer = window.setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            clearInterval(timer);
            setGameCompleted(true);
            toast.error("Time's up! Game over.");
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    
    return () => clearInterval(timer);
  }, [gameStarted, gameCompleted, timeLeft]);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="space-y-1">
          <h2 className="text-2xl font-semibold">Word Zen</h2>
          <p className="text-muted-foreground">
            Find hidden words to improve mindfulness and vocabulary
          </p>
          {!gameCompleted && (
            <div className="flex justify-start">
              <Button variant="outline" onClick={initializeGame}>
                <RefreshCcw className="mr-2 h-4 w-4" />
                Restart Game
              </Button>
            </div>
          )}
        </div>
        {gameStarted && (
          <div className="flex items-center gap-4">
            <div className="flex items-center space-x-1">
              <Gamepad2 className="h-4 w-4 text-primary" />
              <span className="font-medium">{score}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Clock className="h-4 w-4 text-amber-500" />
              <span className={`font-medium ${timeLeft < 30 ? "text-red-500 animate-pulse" : ""}`}>
                {formatTime(timeLeft)}
              </span>
            </div>
          </div>
        )}
      </div>

      {!gameStarted ? (
        <Card>
          <CardContent className="pt-6 space-y-6">
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-medium mb-2">Select Difficulty</h3>
                <div className="flex space-x-2">
                  {LEVELS.map((level) => (
                    <Button
                      key={level.id}
                      variant={selectedLevel.id === level.id ? "default" : "outline"}
                      onClick={() => setSelectedLevel(level)}
                    >
                      {level.difficulty.charAt(0).toUpperCase() + level.difficulty.slice(1)}
                    </Button>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium mb-2">Select Word Category</h3>
                <div className="flex space-x-2">
                  {WORD_CATEGORIES.map((category) => (
                    <Button
                      key={category.id}
                      variant={currentCategory.id === category.id ? "default" : "outline"}
                      onClick={() => setCurrentCategory(category)}
                    >
                      {category.name}
                    </Button>
                  ))}
                </div>
              </div>

              <div className="pt-4">
                <Button onClick={initializeGame} className="w-full">
                  Start Game
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Card>
              <CardContent className="pt-4">
                <h3 className="text-sm font-medium mb-2">Words to Find ({foundWords.length}/{hiddenWords.length})</h3>
                <div className="space-y-1.5">
                  {hiddenWords.map((word) => (
                    <div
                      key={word}
                      className={`flex items-center space-x-2 ${
                        foundWords.includes(word) ? "text-green-500" : "text-muted-foreground"
                      }`}
                    >
                      {foundWords.includes(word) && <Check className="h-4 w-4" />}
                      <span className={foundWords.includes(word) ? "line-through" : ""}>
                        {foundWords.includes(word) ? word : `${word.length} letters`}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-4">
                <h3 className="text-sm font-medium mb-2">Game Info</h3>
                <div className="space-y-1.5 text-sm">
                  <div className="flex items-center justify-between">
                    <span>Difficulty:</span>
                    <Badge>
                      {selectedLevel.difficulty.charAt(0).toUpperCase() + selectedLevel.difficulty.slice(1)}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Grid Size:</span>
                    <span>
                      {selectedLevel.gridSize.rows} x {selectedLevel.gridSize.cols}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Category:</span>
                    <span>{currentCategory.name}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="overflow-hidden">
            <CardContent className="p-0">
              <div 
                className="grid gap-1 p-2 bg-primary/5"
                style={{
                  gridTemplateColumns: `repeat(${selectedLevel.gridSize.cols}, 1fr)`,
                }}
              >
                {grid.flat().map((cell, index) => (
                  <button
                    key={index}
                    className={`aspect-square flex items-center justify-center rounded text-lg font-medium transition-colors ${
                      cell.isSelected
                        ? "bg-primary text-primary-foreground"
                        : "bg-background hover:bg-primary/10"
                    }`}
                    onClick={() => handleCellClick(cell.rowIndex, cell.colIndex)}
                    disabled={gameCompleted}
                  >
                    {cell.letter}
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>

          {gameCompleted && (
            <div className="bg-primary/10 p-4 rounded-lg text-center">
              <h3 className="text-xl font-semibold mb-1">
                Game {foundWords.length === hiddenWords.length ? "Completed!" : "Over"}
              </h3>
              <p className="mb-4">
                You found {foundWords.length} out of {hiddenWords.length} words
                <br />
                <span className="text-lg font-medium">Score: {score}</span>
              </p>
              <Button onClick={initializeGame}>
                <RefreshCcw className="mr-2 h-4 w-4" />
                Play Again
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default WordZenGame;
