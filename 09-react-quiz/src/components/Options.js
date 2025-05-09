function Options({ question, answer, dispatch }) {
  const hasAnswered = answer !== null;

  return (
    <div className="options">
      {question.options.map((option, index) => {
        const isSelected = index === answer;
        const isCorrect = index === question.correctOption;

        const className = `
          btn 
          btn-option 
          ${isSelected ? "answer" : ""}
          ${hasAnswered ? (isCorrect ? "correct" : "wrong") : ""}
        `.trim();

        return (
          <button
            className={className}
            onClick={() => dispatch({ type: "newAnswer", payload: index })}
            key={option}
            disabled={hasAnswered}
          >
            {option}
          </button>
        );
      })}
    </div>
  );
}

export default Options;
