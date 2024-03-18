"use client";
import React from "react";
import parse from "html-react-parser";

import Image from "next/image";
import styles from "./page.module.css";
import {
  calculateWinner,
  indexElementDifferent,
  squaresPositionWinner,
} from "./functions";

function Square(props) {
  return (
    <button
      style={
        props.winner &&
        squaresPositionWinner(props.winner).includes(props.position)
          ? { backgroundColor: "#FFDF00" }
          : { backgroundColor: "white" }
      }
      className={styles.square}
      onClick={props.onClick}
    >
      {props.value}
    </button>
  );
}

class Board extends React.Component {
  renderSquare(i) {
    return (
      <Square
        winner={this.props.winner}
        key={i}
        position={i}
        value={this.props.squares[i]}
        onClick={() => this.props.onClick(i)}
      />
    );
  }

  render() {
    return (
      <div className={styles["contenedor-board"]}>
        {[0, 1, 2].map((i) => (
          <div key={i} className={styles["board-row"]}>
            {[0, 1, 2].map((j) => this.renderSquare(j + 3 * i))}
          </div>
        ))}
      </div>
    );
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [
        {
          squares: Array(9).fill(null),
        },
      ],
      xIsNext: true,
      indexStep: 0,
      indexSeleccionado: null,
      toggleListPosition: true,
    };
  }
  handleClick(i) {
    const history = this.state.history.slice(0, this.state.indexStep + 1);
    const current = history[history.length - 1];
    const squares = [...current.squares];
    if (squares[i] || calculateWinner(squares)) {
      return;
    }
    squares[i] = this.state.xIsNext ? "X" : "O";
    this.setState({
      history: [...history, { squares: squares }],
      xIsNext: !this.state.xIsNext,
      indexStep: this.state.indexStep + 1,
    });
  }
  jumpTo(step) {
    this.setState({
      indexSeleccionado: step,
      indexStep: step,
      xIsNext: step % 2 === 0,
    });
  }
  handleToggleList() {
    this.setState({
      toggleListPosition: !this.state.toggleListPosition,
    });
  }
  render() {
    const history = this.state.history;
    const current = history[this.state.indexStep];
    const winner = calculateWinner(current.squares);
    const moves = history.map((step, move) => {
      const desc = move ? "Go to move #" + move : "Go to game start";
      const stylesButton =
        this.state.indexSeleccionado == move
          ? styles["button-list-selected"]
          : undefined;
      return (
        <li key={move}>
          {move == this.state.indexStep ? (
            <div
              className={`${styles["actual-list-time"]}
            ${stylesButton}`}
              onClick={() => this.jumpTo(move)}
            >
              You are in move {move + 1}
              {move
                ? "- Position: " +
                  indexElementDifferent(
                    history[move - 1].squares,
                    step.squares
                  ).join(",")
                : ""}
            </div>
          ) : (
            <button
              className={`${styles["button-list_time"]}
            ${stylesButton}`}
              onClick={() => this.jumpTo(move)}
            >
              {desc}
              {move
                ? "- Position: " +
                  indexElementDifferent(
                    history[move - 1].squares,
                    step.squares
                  ).join(",")
                : ""}
            </button>
          )}
        </li>
      );
    });

    let status;
    if (winner) {
      status = "🏆 Winner: " + `<strong>${winner}</strong>`;
    } else {
      if (current.squares.filter((e) => e).length == 9) {
        status = "Draw ⚖️";
      } else {
        status =
          "Next player: " +
          (this.state.xIsNext ? "<strong>X</strong>" : "<strong>O</strong>");
      }
    }
    return (
      <div className={styles.game}>
        <div className={styles["game-board"]}>
          <Board
            winner={winner ? current.squares : null}
            squares={current.squares}
            onClick={(i) => this.handleClick(i)}
          />
        </div>
        <div className={styles["game-info"]}>
          <div className={styles["status-contenedor"]}>{parse(status)}</div>
          <button
            className={styles["button-toggle"]}
            onClick={() => this.handleToggleList()}
          >
            Toggle List Order
          </button>
          <ol
            reversed={!this.state.toggleListPosition}
            className={styles["container-time-list"]}
          >
            {this.state.toggleListPosition ? moves : moves.reverse()}
          </ol>
        </div>
      </div>
    );
  }
}
export default function Home() {
  return (
    <main className={styles.main}>
      <Game />
    </main>
  );
}
