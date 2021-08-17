const objectToCSVRow = function (dataObject: any) {
  var dataArray = new Array();
  for (var o in dataObject) {
    var innerValue = dataObject[o] === null ? "" : dataObject[o].toString();
    var result = innerValue.replace(/"/g, '""');
    result = '"' + result + '"';
    dataArray.push(result);
  }
  return dataArray.join(",") + "\r\n";
};

export function exportToCSV(arrayOfObjects: any[]): string {
  if (!arrayOfObjects.length) {
    return "";
  }

  let csvContent = "";

  // headers
  csvContent += objectToCSVRow(Object.keys(arrayOfObjects[0]));

  arrayOfObjects.forEach(function (item) {
    csvContent += objectToCSVRow(item);
  });

  return csvContent;
}
