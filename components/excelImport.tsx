import React from "react";
import * as XLSX from "xlsx";

const convertToJSON = (data: any) => {
  const headers = data[0];
  const jsonData = data.slice(1, data.length);
  const result = jsonData.map((row: any) => {
    const obj: any = {};
    headers.forEach((header: any, index: any) => {
      obj[header] = row[index];
    });
    return obj;
  });
  console.log(result);
};
export const importExcel = async (file: File) => {
  const reader = new FileReader();
  reader.onload = async (event) => {
    if (!event.target) return;
    const bstr = event.target.result;
    const wb = XLSX.read(bstr, { type: "binary" });
    const wsname = wb.SheetNames[0];
    const ws = wb.Sheets[wsname];
    const data = XLSX.utils.sheet_to_json(ws, { header: 1 });
    data.splice(0, 0);
    convertToJSON(data);
  };
  reader.readAsBinaryString(file);
};
