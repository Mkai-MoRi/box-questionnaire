/**
 * 人間観察BOX アンケート 回答収集用 Google Apps Script
 *
 * フォームからの送信を、種別ごとに別シートへ1行ずつ追記します。
 *   - type=answer → 「回答」シート（タイムスタンプ / q1 / q2 / q3 / id）
 *   - type=share  → 「シェア」シート（タイムスタンプ / チャネル / id）
 * id は回答とシェアを突き合わせるためのセッションIDです。
 *
 * ── セットアップ / 更新手順 ─────────────────────────
 * 【初回】
 * 1. https://sheets.new で新しいスプレッドシートを作成
 * 2. メニュー「拡張機能」→「Apps Script」を開く
 * 3. Code.gs の中身を全部消し、このファイルの内容を貼り付けて保存
 * 4. 右上「デプロイ」→「新しいデプロイ」→ 種類「ウェブアプリ」
 *      - 実行するユーザー: 自分
 *      - アクセスできるユーザー: 全員
 * 5. 表示された「ウェブアプリのURL」(末尾 /exec) を控える
 *
 * 【コードを更新して再デプロイするとき（URLを変えたくない場合）】
 * 1. このファイルの内容を貼り付けて保存
 * 2. 右上「デプロイ」→「デプロイを管理」
 * 3. 既存デプロイの右上の鉛筆(編集)→ バージョン「新バージョン」→「デプロイ」
 *    ※「新しいデプロイ」ではなく既存を編集すると URL が変わりません
 * ──────────────────────────────────────────────
 */

function doPost(e) {
  try {
    var p = (e && e.parameter) ? e.parameter : {};
    if ((p.type || '') === 'share') {
      var shareSheet = getSheet_('シェア', ['タイムスタンプ', 'チャネル', 'id']);
      shareSheet.appendRow([new Date(), p.channel || '', p.id || '']);
    } else {
      var answerSheet = getSheet_('回答', ['タイムスタンプ', 'q1', 'q2', 'q3', 'id']);
      answerSheet.appendRow([new Date(), p.q1 || '', p.q2 || '', p.q3 || '', p.id || '']);
    }
    return json_({ ok: true });
  } catch (err) {
    return json_({ ok: false, error: String(err) });
  }
}

// 動作確認用（ブラウザでURLを開くと表示される）
function doGet() {
  return json_({ ok: true, message: 'endpoint alive' });
}

function getSheet_(name, headers) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(name);
  if (!sheet) {
    sheet = ss.insertSheet(name);
    sheet.appendRow(headers);
  } else if (sheet.getLastRow() === 0) {
    sheet.appendRow(headers);
  }
  return sheet;
}

function json_(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
