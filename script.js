// NPC側の固定画像リスト（ファイル名は自分の環境に合わせて変更OK）
const npcImages = [
  "npc-images/npc1.png",
  "npc-images/npc2.png",
  "npc-images/npc3.png",
];

document.addEventListener("DOMContentLoaded", () => {
  const uploadBtn = document.getElementById("upload-btn");
  const userFile = document.getElementById("user-file");
  const userPreview = document.getElementById("user-preview");
  const npcPreview = document.getElementById("npc-preview");
  const userScoreEl = document.getElementById("user-score");
  const npcScoreEl = document.getElementById("npc-score");
  const resultEl = document.getElementById("battle-result");

  // 「自分の画像を選択」ボタン → 隠れたinputをクリック
  uploadBtn.addEventListener("click", () => userFile.click());

  // ユーザーが画像ファイルを選んだとき
  userFile.addEventListener("change", (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // 画像ファイルか簡易チェック
    if (!file.type.startsWith("image/")) {
      alert("画像ファイルを選択してください。");
      return;
    }

    const reader = new FileReader();

    reader.onload = (event) => {
      const dataUrl = event.target.result;

      // ユーザー画像をプレビュー表示
      userPreview.src = dataUrl;

      // ユーザー画像を採点
      evaluateImage(dataUrl).then((userScore) => {
        userScoreEl.textContent = `${userScore} 点`;
        // NPC側との対戦を開始
        startNpcBattle(userScore);
      });
    };

    reader.readAsDataURL(file);
  });

  // NPC画像をランダムに選んで対戦
  function startNpcBattle(userScore) {
    const npcPath = npcImages[Math.floor(Math.random() * npcImages.length)];
    npcPreview.src = npcPath;

    // NPC画像を採点
    evaluateImage(npcPath).then((npcScore) => {
      npcScoreEl.textContent = `${npcScore} 点`;

      // 勝敗判定
      if (userScore > npcScore) {
        resultEl.textContent = "あなたの勝ち！🎉";
      } else if (userScore < npcScore) {
        resultEl.textContent = "あなたの負け…💦";
      } else {
        resultEl.textContent = "引き分け！🤝";
      }
    });
  }

  /**
   * 画像の解像度・縦横比から簡易スコアを計算する（0〜100点）
   * 今は「技術的な条件」のみを見ています
   */
  function evaluateImage(url) {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        const w = img.naturalWidth;
        const h = img.naturalHeight;
        let score = 50; // ベーススコア

        const minSide = Math.min(w, h);
        const maxSide = Math.max(w, h);
        const ratio = maxSide / minSide;

        // 解像度評価
        if (minSide > 800) {
          score += 20; // 十分な解像度
        } else if (minSide < 400) {
          score -= 20; // 小さすぎ
        }

        // 縦横比評価
        if (ratio < 1.3) {
          score += 10; // ほぼ正方形 → アイコン向き
        } else if (ratio > 2) {
          score -= 10; // 細長すぎ
        }

        // スコアを0〜100にクリップ
        score = Math.max(0, Math.min(100, score));
        resolve(Math.round(score));
      };
      img.src = url;
    });
  }
});