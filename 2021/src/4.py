from typing import NewType

# bingo
# need data structure to store horizontal, vertical position, number and whether marked or not
# dict or tuple in a 2d list
# (num, marked_bool) in [row][col]
# need get_winner function
# need is_complete function
# need calculate_score function

ROWS = 5
COLS = 5

# need type system
BingoCell = NewType('BingoCell', (int, bool))
BingoBoard = NewType('BingoBoard', [[BingoCell]])

def is_complete(board: BingoBoard):
    for row in board:
        marked_count = len(list(filter(lambda cell : cell[1], row )))
        # print('row marked count', marked_count)
        if marked_count == COLS:
            return True
    for i in range(0, COLS):
        col_cells = map(lambda row: row[i], board)
        marked_count = len(list(filter(lambda cell : cell[1], col_cells)))
        # print('col marked count', marked_count)
        if marked_count == ROWS:
            return True

def read_row(row_str: str):
    return list(
        map(
            lambda val : BingoCell((int(val), False)),
            row_str.split()
        )
    )

# read input
def read_board(board_str: str):
    row_strs = list(map(str.strip, board_str.split('\n')))
    board: BingoBoard = list(map(read_row, row_strs))
    return board

def play_round(number: int, boards):
    for board in boards:
        for nRow in range(0, ROWS):
            for nCol in range(0, COLS):
                # print(board[nRow][nCol], number)
                if board[nRow][nCol][0] == number:
                    # print("match")
                    board[nRow][nCol] = (board[nRow][nCol][0], True)
        # print(board)
        if is_complete(board):
            return board

def calculate_score(board: BingoBoard, number):
    concat = lambda acc, x: acc + x
    accumulator = []
    cells = [accumulator := concat(accumulator, x) for x in board]
    print(cells)
    unmarked_cells = list(filter(lambda cell : not cell[1], accumulator))
    print('unmarked', unmarked_cells)
    unmarked_sum = sum([ a for a,_ in unmarked_cells ])
    print(unmarked_sum)
    return unmarked_sum * number

def part1():
    inputs = open('../inputs/4.txt').read().split('\n\n')
    numbers = list(map(int, inputs[0].split(',')))
    boards = list(map(read_board, inputs[1:]))
    for number in numbers:
        winning_board = play_round(number, boards)
        if winning_board is not None:
            # print(winning_board, number)
            print(calculate_score(winning_board, number))
            return

part1()

# Check for a better solution, using python better