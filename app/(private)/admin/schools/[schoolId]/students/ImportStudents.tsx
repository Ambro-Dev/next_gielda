import React from "react";

import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

import * as XLSX from "xlsx";
import { Input } from "@/components/ui/input";
import { ImportTable } from "./Import-table";
import { importTableColumns } from "./import-table-columns";

type Props = {};

type Student = {
  imie: string;
  nazwisko: string;
  email: string;
  telefon: string;
};

const ImportStudents = (props: Props) => {
  const [importedList, setImportedList] = React.useState<Student[]>([]);

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
    setImportedList(result);
  };
  const importExcel = async (file: File) => {
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

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Importuj z Excela</Button>
      </DialogTrigger>
      <DialogContent className="max-w-6xl pt-14">
        <Input
          type="file"
          onChange={(e) => importExcel(e.target.files![0])}
          className="flex w-full"
        />
        <ImportTable
          columns={importTableColumns}
          data={importedList}
          className="overflow-auto sm:px-5 px-0"
        />
      </DialogContent>
    </Dialog>
  );
};

export default ImportStudents;
