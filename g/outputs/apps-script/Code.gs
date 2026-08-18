/**
 * 人間観察BOX アンケート 回答収集用 Google Apps Script
 *
 * このスクリプトは、フォームから送られてきた回答を
 * スプレッドシートに1行ずつ追記します。
 *
 * ── セットアップ手順 ──────────────────────────────
 * 1. https://sheets.new で新しいスプレッドシートを作成
 * 2. メニュー「拡張機能」→「Apps Script」を開く
 * 3. 既定の Code.gs の中身を全部消し、このファイルの内容を貼り付けて保存
 * 4. 右上「デプロイ」→「新しいデプロイ」→ 種類「ウェブアプリ」を選択
 *      - 説明: 任意
 *      - 実行するユーザー: 自分
 *      - アクセスできるユーザー: 全員
 * 5. デプロイして表示される「ウェブアプリのURL」(末尾 /exec) をコピー
 * 6. peep-card.html の RESPONSE_ENDPOINT に貼り付け → 再デプロイ
 * ──────────────────────────────────────────────
 */

// 記録先スプレッドシートのシート名（存在しなければ自動作成）
var SHEET_NAME = '回答';

// 質問の見出し（列の並び順）
var HEADERS = ['タイムスタンプ', 'q1', 'q2', 'q3'];

function doPost(e) {
  try {
    var sheet = getSheet_();
    var p = (e && e.parameter) ? e.parameter : {};
    sheet.appendRow([
      new Date(),
      p.q1 || '',
      p.q2 || '',
      p.q3 || ''
    ]);
    return json_({ ok: true });
  } catch (err) {
    return json_({ ok: false, error: String(err) });
  }
}

// 動作確認用（ブラウザでURLを開くと表示される）
function doGet() {
  return json_({ ok: true, message: 'endpoint alive' });
}

function getSheet_() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);
    sheet.appendRow(HEADERS);
  } else if (sheet.getLastRow() === 0) {
    sheet.appendRow(HEADERS);
  }
  return sheet;
}

function json_(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
