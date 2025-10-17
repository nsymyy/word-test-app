const englishInput = document.getElementById("english");
const japaneseInput = document.getElementById("japanese");
const addBtn = document.getElementById("add-btn");
const wordTable = document.getElementById("word-table");
const wordListBody = document.getElementById("word-list");
const printBtn = document.getElementById("print-btn");
const testPrintBtn = document.getElementById("test-print-btn");
const randomBtn = document.getElementById("random-btn");
const testTitleInput = document.getElementById("test-title");
const setTitleBtn = document.getElementById("set-title-btn");
const mainTitle = document.getElementById("main-title");

let wordList = [];
let isComposing = false;

// ✅ タイトル変更
setTitleBtn.addEventListener("click", () => {
  const newTitle = testTitleInput.value.trim();
  mainTitle.textContent = newTitle || "テスト名を入力してください";
});

// ✅ IME入力中のEnterを無視
englishInput.addEventListener("compositionstart", () => (isComposing = true));
englishInput.addEventListener("compositionend", () => (isComposing = false));
japaneseInput.addEventListener("compositionstart", () => (isComposing = true));
japaneseInput.addEventListener("compositionend", () => (isComposing = false));

// ✅ Enterキーで操作
englishInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter" && !isComposing) {
    e.preventDefault();
    japaneseInput.focus();
  }
});
japaneseInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter" && !isComposing) {
    e.preventDefault();
    addBtn.click();
  }
});

// ✅ 追加・編集ボタン処理
addBtn.addEventListener("click", () => {
  const english = englishInput.value.trim();
  const japanese = japaneseInput.value.trim();
  if (!english || !japanese) {
    alert("問題と解答を両方入力してください！");
    return;
  }

  const editIndex = addBtn.dataset.editIndex;
  if (editIndex !== undefined) {
    wordList[editIndex] = { english, japanese };
    delete addBtn.dataset.editIndex;
  } else {
    wordList.push({ english, japanese });
  }

  englishInput.value = "";
  japaneseInput.value = "";
  englishInput.focus();
  renderTableHorizontal();
});

// ✅ 並び替え機能
randomBtn.addEventListener("click", () => {
  for (let i = wordList.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [wordList[i], wordList[j]] = [wordList[j], wordList[i]];
  }
  renderTableHorizontal();
});

// ✅ 表描画（横に25個ずつ）
function renderTableHorizontal() {
  const maxPerColumn = 25;
  wordTable.innerHTML = "";

  const validWords = wordList.filter(w => w.english && w.japanese);
  const numColumns = Math.ceil(validWords.length / maxPerColumn);
  if (numColumns === 0) return;

  // ヘッダー
  const headerRow = document.createElement("tr");
  for (let c = 0; c < numColumns; c++) {
    headerRow.appendChild(createTh("No."));
    headerRow.appendChild(createTh("問題"));
    headerRow.appendChild(createTh("解答"));
    const actionTh = createTh("操作");
    actionTh.classList.add("delete-column");
    headerRow.appendChild(actionTh);
  }
  wordTable.appendChild(headerRow);

  for (let r = 0; r < maxPerColumn; r++) {
    const row = document.createElement("tr");
    let hasContent = false;

    for (let c = 0; c < numColumns; c++) {
      const index = c * maxPerColumn + r;
      if (index < validWords.length) {
        const word = validWords[index];
        row.appendChild(createTd(index + 1));
        row.appendChild(createTd(word.english));

        const answerTd = createTd(word.japanese);
        answerTd.classList.add("answer-column"); // ← 解答セルにクラス追加
        row.appendChild(answerTd);

        const actionTd = document.createElement("td");
        actionTd.classList.add("delete-column");

        const editBtn = document.createElement("button");
        editBtn.textContent = "編集";
        editBtn.addEventListener("click", () => {
          englishInput.value = word.english;
          japaneseInput.value = word.japanese;
          englishInput.focus();
          addBtn.dataset.editIndex = index;
        });

        const deleteBtn = document.createElement("button");
        deleteBtn.textContent = "削除";
        deleteBtn.addEventListener("click", () => {
          wordList.splice(index, 1);
          renderTableHorizontal();
        });

        actionTd.appendChild(editBtn);
        actionTd.appendChild(deleteBtn);
        row.appendChild(actionTd);
        hasContent = true;
      } else {
        row.appendChild(createTd(""));
        row.appendChild(createTd(""));
        row.appendChild(createTd(""));
        const actionTd = document.createElement("td");
        actionTd.classList.add("delete-column");
        row.appendChild(actionTd);
      }
    }

    if (hasContent) wordTable.appendChild(row);
  }
}

function createTh(text) {
  const th = document.createElement("th");
  th.textContent = text;
  return th;
}

function createTd(text) {
  const td = document.createElement("td");
  td.textContent = text;
  return td;
}

// ✅ 印刷機能
printBtn.addEventListener("click", () => {
  document.body.classList.remove("hide-answers");
  window.print();
});

testPrintBtn.addEventListener("click", () => {
  document.body.classList.add("hide-answers");
  window.print();
  document.body.classList.remove("hide-answers");
});
