function play(playerChoice) {
  const hands = ["グー", "チョキ", "パー"];
  const computerChoice = hands[Math.floor(Math.random() * hands.length)];

  document.getElementById("player-choice").textContent = `あなたの手: ${playerChoice}`;
  document.getElementById("computer-choice").textContent = `コンピュータの手: ${computerChoice}`;

  let result = "";

  if (playerChoice === computerChoice) {
    result = "あいこです！🤝";
  } else if (
    (playerChoice === "グー" && computerChoice === "チョキ") ||
    (playerChoice === "チョキ" && computerChoice === "パー") ||
    (playerChoice === "パー" && computerChoice === "グー")
  ) {
    result = "あなたの勝ち！🎉";
  } else {
    result = "あなたの負け…💦";
  }

  document.getElementById("winner").textContent = `結果: ${result}`;
}
