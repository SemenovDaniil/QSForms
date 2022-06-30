const doGet = (e) => {
  var sheet = SpreadsheetApp.getActiveSheet();
  var data = sheet.getDataRange().getValues();
  var json = e.parameter;
  var osUser = json.osUser;
  var formId = json.formId;
  var exists = false;
  for(var i = 1; i<data.length;i++){
    if(data[i][2] == osUser && data[i][0] == formId){ 
      exists = true;
    }
  }

  return ContentService.createTextOutput(
    JSON.stringify({ method: "GET", eventObject: e, isExists: exists, osUser: osUser, formId: formId})//
  ).setMimeType(ContentService.MimeType.JSON);
}
  
const doPost = (e) => {
  var json = JSON.parse(e.postData.contents)
  var formId = json.formId
  var submitDate = json.submitDate
  var osUSer = json.osUser
  var qlikDocumentId = json.document.id
  var qlikDocumentTitle = json.document.title

  var sheetId = json.sheet.id
  var sheetName = json.sheet.title
  var currentSelections = json.currentSelections

  var sheet = SpreadsheetApp.getActiveSheet();
  if(sheet.getRange(1,1).getValue() == '') {
     sheet.appendRow(['formId', 'submitDate', 'user', 'documentId', 'documentTitle', 'sheetId', 'sheetName', 'currentSelections', 'questionIndex', 'questionType', 'question', 'answer'  ])
  }

  json.answers.forEach(function( answer, index ) {
    sheet.appendRow([formId, submitDate, osUSer, qlikDocumentId, qlikDocumentTitle, sheetId, sheetName, currentSelections, answer.questionIndex, answer.questionType, answer.question, answer.answer  ])
 
  }) 
  
  return ContentService.createTextOutput(
    JSON.stringify({ method: "POST", eventObject: e.postData.contents })
  ).setMimeType(ContentService.MimeType.JSON);

}
