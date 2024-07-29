function handleChatClick() {
  // Code for "Chat" button
  SpreadsheetApp.getUi().alert('You click Chat button!');
  // google.script.run.popOutChatApp();
  var htmlOutput = HtmlService.createHtmlOutputFromFile('chat')
    .setTitle('Chat Asistance')
    .setWidth(500);
  SpreadsheetApp.getUi().showSidebar(htmlOutput);
}

