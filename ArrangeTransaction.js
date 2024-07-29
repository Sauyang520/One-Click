function handleArrangeClick() {
  const sheet = SpreadsheetApp.getActiveSheet();
  const selectedRanges = sheet.getActiveRangeList().getRanges();

  if (selectedRanges.length !== 2) {
    SpreadsheetApp.getUi().alert('Please select exactly two columns.');
    return;
  }

  // Data Preparation
  const transactions = selectedRanges.map(range => range.getValues().flat().slice(1)); // Get flattened arrays and remove the header row
  transactions[0] = transactions[0].filter(value => value !== ""); // Filter empty values
  transactions[1] = transactions[1].filter(value => value !== ""); 

  // Check if columns have equal length after filtering
  if (transactions[0].length !== transactions[1].length) {
    SpreadsheetApp.getUi().alert('Selected columns must have the same number of rows (after removing blanks).');
    return;
  }

  // Combine data into a key-value pair object
  const data = transactions[0].map((value, i) => [value, transactions[1][i]]);
  const transactionMap = {};

  data.forEach(([transactionId, item]) => {
    if (!transactionMap[transactionId]) {
      transactionMap[transactionId] = new Set();
    }
    transactionMap[transactionId].add(item); // Use Set to avoid duplicates
  });

  // Create a new sheet to display the results
  const resultSheet = SpreadsheetApp.getActiveSpreadsheet().insertSheet();
  resultSheet.setName('Transactions');

  // Prepare the results for display
  const resultData = [['Transaction ID', 'Items']];
  for (const [transactionId, items] of Object.entries(transactionMap)) {
    resultData.push([transactionId, Array.from(items).join(', ')]); // Convert Set to array and join items
  }

  // Set the values in the new sheet
  resultSheet.getRange(1, 1, resultData.length, resultData[0].length).setValues(resultData);
}
