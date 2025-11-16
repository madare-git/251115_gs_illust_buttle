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
  const userDetailsEl = document.getElementById("user-details");
  const npcDetailsEl = document.getElementById("npc-details");

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

      // ユーザー画像を採点（スコア + ブレイクダウン）
      evaluateImage(dataUrl).then((userResult) => {
        userScoreEl.textContent = `${userResult.score} 点`;
        renderDetails(userDetailsEl, userResult.details);

        // NPC側との対戦を開始
        startNpcBattle(userResult.score);
      });
    };

    reader.readAsDataURL(file);
  });

  // NPC画像をランダムに選んで対戦
  function startNpcBattle(userScore) {
    const npcPath = npcImages[Math.floor(Math.random() * npcImages.length)];
    npcPreview.src = npcPath;

    // NPC画像を採点
    evaluateImage(npcPath).then((npcResult) => {
      npcScoreEl.textContent = `${npcResult.score} 点`;
      renderDetails(npcDetailsEl, npcResult.details);

      // 勝敗判定
      if (userScore > npcResult.score) {
        resultEl.textContent = "あなたの勝ち！🎉";
      } else if (userScore < npcResult.score) {
        resultEl.textContent = "あなたの負け…💦";
      } else {
        resultEl.textContent = "引き分け！🤝";
      }
    });
  }

  /**
   * 画像の解像度・縦横比から簡易スコアを計算する（0〜100点）
   * ＋ 評価ポイント（コメントの配列）を返す
   */
  function evaluateImage(url) {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        const w = img.naturalWidth;
        const h = img.naturalHeight;
        let score = 50; // ベーススコア
        const details = [];

        const minSide = Math.min(w, h);
        const maxSide = Math.max(w, h);
        const ratio = maxSide / minSide;

        // 元解像度の情報
        details.push(`元の解像度: ${w} × ${h} px`);

        // 解像度評価
        if (minSide >= 1000) {
          score += 20;
          details.push("解像度がとても高く、大きな表示にも適しています。");
        } else if (minSide >= 600) {
          score += 10;
          details.push("解像度はWeb用途として十分なレベルです。");
        } else if (minSide >= 400) {
          details.push("解像度はやや控えめですが、サムネイル用途なら問題ありません。");
        } else {
          score -= 15;
          details.push("解像度が低く、大きく表示すると粗く見える可能性があります。");
        }

        // 縦横比評価
        if (ratio < 1.2) {
          score += 10;
          details.push("ほぼ正方形で、アイコンやSNSプロフィール画像に向いています。");
        } else if (ratio < 1.8) {
          score += 5;
          details.push("標準的な縦横比で、汎用的に扱いやすい画像です。");
        } else if (ratio < 2.5) {
          details.push("やや細長い縦横比です。用途によってはトリミングも検討できます。");
        } else {
          score -= 5;
          details.push("かなり細長い縦横比で、使える場面が限られる可能性があります。");
        }

        // 最終コメント（総評）
        let summary;
        if (score >= 80) {
          summary = "総合的にバランスの良い画像です。さまざまな用途にそのまま使えそうです。";
        } else if (score >= 60) {
          summary =
            "おおむね問題ない品質です。用途に応じてサイズ調整やトリミングをするとさらに良くなります。";
        } else {
          summary =
            "用途によっては解像度や縦横比の見直しをすると、より使いやすい画像になります。";
        }
        details.push(summary);

        // スコアを0〜100にクリップ
        score = Math.max(0, Math.min(100, score));
        resolve({
          score: Math.round(score),
          details,
        });
      };
      img.src = url;
    });
  }

  // 評価コメント（details配列）を <ul> に描画
  function renderDetails(listElement, details) {
    listElement.innerHTML = "";
    details.forEach((text) => {
      const li = document.createElement("li");
      li.textContent = text;
      listElement.appendChild(li);
    });
  }
});