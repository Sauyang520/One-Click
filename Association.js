// This function is triggered when the association rule button is clicked
function handleAssociationClick() {
  const sheet = SpreadsheetApp.getActiveSheet(); // Get the active sheet
  const selectedRanges = sheet.getActiveRangeList().getRanges(); // Get the selected ranges

  // Check if exactly two columns are selected
  if (selectedRanges.length !== 2) {
    SpreadsheetApp.getUi().alert('Please select exactly two columns.'); // Alert if not exactly two columns
    return;
  }

  // Get the values from the selected ranges and flatten them
  const transactions = selectedRanges.map(range => range.getValues().flat());
  
  // Filter out empty values and ensure both columns have the same number of non-empty rows
  transactions[0] = transactions[0].filter((_, i) => transactions[1][i] !== "").map(String);
  transactions[1] = transactions[1].filter(String);

  if (transactions[0].length !== transactions[1].length) {
    SpreadsheetApp.getUi().alert('Selected columns must have the same number of rows (after removing blanks).'); // Alert if row counts don't match
    return;
  }

  // Create an object to hold the association data
  const data = {};
  for (let i = 0; i < transactions[0].length; i++) {
    const id = transactions[0][i]; // Unique identifier from the first column
    const item = transactions[1][i]; // Associated item from the second column
    if (!data[id]) data[id] = new Set(); // Initialize a new set for this identifier if not already present
    data[id].add(item); // Add the item to the set
  }

  // Convert the data object into an array of transactions
  const transactionData = Object.values(data).map(set => Array.from(set));
  
  // Call the Apriori algorithm to find association rules
  const result = aprioriAlgorithm(transactionData, 0.05, 0.20, 4);
  
  // Create a new sheet for displaying the association rules
  const newSheet = SpreadsheetApp.getActiveSpreadsheet().insertSheet('Association Rules');
  const headers = ['Antecedent', 'Consequent', 'Support', 'Confidence', 'Lift'];
  newSheet.appendRow(headers); // Add headers to the new sheet

  // Add each rule to the new sheet
  result.forEach(rule => {
    newSheet.appendRow([rule.antecedent.join(', '), rule.consequent.join(', '), rule.support, rule.confidence, rule.lift]);
  });

  // Alert the user that association rules have been generated
  SpreadsheetApp.getUi().alert('Association rules have been generated!');
}

// Apriori algorithm implementation to find frequent itemsets and association rules
function aprioriAlgorithm(transactions, minSupport, minConfidence, maxItemsetSize) {
  const supportCount = {}; // To store the support count for each itemset
  const transactionCount = transactions.length; // Total number of transactions
  const rules = []; // To store the association rules

  // Count support for each itemset
  for (const transaction of transactions) {
    const items = transaction.sort(); // Sort items in the transaction
    for (let size = 1; size <= Math.min(maxItemsetSize, items.length); size++) {
      const itemsets = getCombinations(items, size); // Get combinations of items of given size
      for (const itemset of itemsets) {
        const itemsetKey = itemset.join(',');
        if (!supportCount[itemsetKey]) supportCount[itemsetKey] = 0; // Initialize count if not present
        supportCount[itemsetKey]++; // Increment count for the itemset
      }
    }
  }

  // Filter itemsets based on minimum support
  const frequentItemsets = [];
  for (const [itemsetKey, count] of Object.entries(supportCount)) {
    const support = count / transactionCount; // Calculate support for the itemset
    if (support >= minSupport) frequentItemsets.push({ items: itemsetKey.split(','), support });
  }

  // Generate association rules from frequent itemsets
  for (const { items, support } of frequentItemsets) {
    if (items.length < 2) continue; // Skip itemsets with fewer than 2 items
    const antecedents = getCombinations(items, items.length - 1); // Get all possible antecedents
    for (const antecedent of antecedents) {
      const consequent = items.filter(item => !antecedent.includes(item)); // Determine the consequent
      if (consequent.length === 0) continue; // Skip if no consequent
      const antecedentKey = antecedent.join(',');
      const consequentKey = consequent.join(',');
      const confidence = supportCount[items.join(',')] / supportCount[antecedentKey]; // Calculate confidence
      if (confidence >= minConfidence) {
        const lift = confidence / (supportCount[consequentKey] / transactionCount); // Calculate lift
        rules.push({ antecedent, consequent, support, confidence, lift }); // Store the rule
      }
    }
  }

  return rules; // Return the list of association rules
}

// Function to get all combinations of a given size from an array
function getCombinations(array, size) {
  if (size > array.length || size <= 0) return [];
  if (size === array.length) return [array];
  if (size === 1) return array.map(item => [item]);

  const combinations = [];
  for (let i = 0; i < array.length - size + 1; i++) {
    const head = array.slice(i, i + 1);
    const tailCombinations = getCombinations(array.slice(i + 1), size - 1);
    for (const tail of tailCombinations) {
      combinations.push(head.concat(tail));
    }
  }
  return combinations;
}

function doGet() {
  return HtmlService.createHtmlOutputFromFile('Index');
}

function associationFunction() {
  var htmlOutput = HtmlService.createHtmlOutputFromFile('Results')
      .setWidth(600)
      .setHeight(400);
  SpreadsheetApp.getUi().showModalDialog(htmlOutput, 'Association Results');
}

function runMarketBasketAnalysis() {
  // Your market basket analysis logic here
  // Return the results as an array of objects
  var results = [
    { item1: 'Bread', item2: 'Butter', support: 0.6, confidence: 0.8 },
    { item1: 'Milk', item2: 'Cereal', support: 0.5, confidence: 0.7 }
  ];
  return results;
}