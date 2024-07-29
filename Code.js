function onOpen() {
  SpreadsheetApp.getUi().createMenu('One Click')
      .addItem('open', 'showSidebar')
      .addItem('FAQ', 'showFaq')
      .addToUi();
}

function showSidebar() {
  const ui = HtmlService.createHtmlOutputFromFile('sidebar')
      .setTitle('One Click')
      .setWidth(300);
  SpreadsheetApp.getUi().showSidebar(ui);
}

function showFaq() {
  const ui = HtmlService.createHtmlOutputFromFile('faq')
        .setTitle('FAQ')
        .setWidth(300);
    SpreadsheetApp.getUi().showSidebar(ui);
}

function popOutChatApp(){
  var htmlOutput = HtmlService.createHtmlOutputFromFile('chat')
      .setTitle('Chat Asistance')
      .setWidth(500);
  SpreadsheetApp.getUi().showSidebar(htmlOutput);
}