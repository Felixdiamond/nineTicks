## A tic tac toe game in python

import random

def print_board(board):
    print("  0 1 2")
    for i in range(3):
        print(i, end=" ")
        for j in range(3):
            print(board[i][j], end=" ")
        print()

def check_winner(board):
    for i in range(3):
        if board[i][0] == board[i][1] == board[i][2] and board[i][0] != " ":
            return board[i][0]
        if board[0][i] == board[1][i] == board[2][i] and board[0][i] != " ":
            return board[0][i]
    if board[0][0] == board[1][1] == board[2][2] and board[0][0] != " ":
        return board[0][0]
    if board[0][2] == board[1][1] == board[2][0] and board[0][2] != " ":
        return board[0][2]
    return " "

def check_draw(board):
    for i in range(3):
        for j in range(3):
            if board[i][j] == " ":
                return False
    return True

def get_empty_cells(board):
    empty_cells = []
    for i in range(3):
        for j in range(3):
            if board[i][j] == " ":
                empty_cells.append((i, j))
    return empty_cells

def minimax(board, depth, is_maximizing):
    if check_winner(board) == "X":
        return -1
    if check_winner(board) == "O":
        return 1
    if check_draw(board):
        return 0

    if is_maximizing:
        best_score = -1000
        for cell in get_empty_cells(board):
            board[cell[0]][cell[1]] = "O"
            score = minimax(board, depth + 1, False)
            board[cell[0]][cell[1]] = " "
            best_score = max(score, best_score)
        return best_score
    else:
        best_score = 1000
        for cell in get_empty_cells(board):
            board[cell[0]][cell[1]] = "X"
            score = minimax(board, depth + 1, True)
            board[cell[0]][cell[1]] = " "
            best_score = min(score, best_score)
        return best_score
    
def get_best_move(board):
    best_score = -1000
    best_move = None
    for cell in get_empty_cells(board):
        board[cell[0]][cell[1]] = "O"
        score = minimax(board, 0, False)
        board[cell[0]][cell[1]] = " "
        if score > best_score:
            best_score = score
            best_move = cell
    return best_move

def main():
    board = [[" " for _ in range(3)] for _ in range(3)]
    print_board(board)
    while True:
        x, y = map(int, input("Enter your move: ").split())
        if board[x][y] != " ":
            print("Invalid move")
            continue
        board[x][y] = "X"
        print_board(board)
        if check_winner(board) == "X":
            print("You win!")
            break
        if check_draw(board):
            print("Draw!")
            break
        move = get_best_move(board)
        board[move[0]][move[1]] = "O"
        print_board(board)
        if check_winner(board) == "O":
            print("You lose!")
            break
        if check_draw(board):
            print("Draw!")
            break

if __name__ == "__main__":
    main()

