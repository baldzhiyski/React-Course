function Progress({ index, numQuestions, points, allPoints, answer }) {
  return (
    <header className="progress">
      <progress
        max={numQuestions}
        value={index + Number(answer !== null)}
      ></progress>
      <p>
        Question <strong>{index + 1}</strong> / {numQuestions}
      </p>
      <p>
        Points <strong>{points}</strong> / {allPoints}
      </p>
    </header>
  );
}

export default Progress;
