"use client";

import React from "react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

import { Input } from "@/components/ui/input";
import { ImportTable } from "./Import-table";
import { importTableColumns } from "./import-table-columns";
import { resultColumns } from "./components/results-columns";
import { Label } from "@/components/ui/label";
import {
  FileSpreadsheet,
  Loader2,
  Sheet,
  X,
  File,
  Download,
  Upload,
  CheckCircle2,
  XCircle,
} from "lucide-react";

import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useForm } from "react-hook-form";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Tooltip,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { TooltipContent } from "@radix-ui/react-tooltip";
import { axiosInstance } from "@/lib/axios";
import { ResultsTable } from "./components/resultsTable";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";

type Props = {
  schoolId: string;
};

type Student = {
  imie: string;
  nazwisko: string;
  email: string;
  telefon: string;
};

type Results = {
  name_surname: string;
  username: string;
  email: string;
  password: string;
  created: boolean;
  error?: string;
};

const schema = z.object({
  file: z
    .string()
    .refine((value) => {
      return value.endsWith(".xlsx") || value.endsWith(".csv");
    }, "Niepoprawny format pliku")
    .nullable()
    .optional(),
});

const ImportStudents = (props: Props) => {
  const [submitting, setSubmitting] = React.useState<boolean>(false);
  const [importedList, setImportedList] = React.useState<Student[]>([]);
  const [disabled, setDisabled] = React.useState<boolean>(false);
  const [downloaded, setDownloaded] = React.useState<boolean>(false);
  const [file, setFile] = React.useState<File | null>(null);
  const [results, setResults] = React.useState<Results[]>([]);
  const [dialogOpen, setDialogOpen] = React.useState<boolean>(false);
  const router = useRouter();

  const fileForm = useForm({
    resolver: zodResolver(schema),
  });

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

  const testFile = (file: File) => {
    const type = file.type;
    if (
      type ===
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ||
      type === "application/vnd.ms-excel" ||
      type === "xlsx"
    )
      return true;

    fileForm.setError("file", {
      type: "manual",
      message: "Niepoprawny typ pliku",
    });
    return false;
  };

  const testHeaders = (headers: string[]) => {
    const requiredHeaders = ["imie", "nazwisko", "email", "telefon"];
    const missingHeaders = requiredHeaders.filter(
      (requiredHeader) => !headers.includes(requiredHeader)
    );
    if (missingHeaders.length > 0) {
      fileForm.setError("file", {
        type: "manual",
        message: `Plik może zawierać tylko nagłówki: ${requiredHeaders.join(
          ", "
        )}`,
      });
      return false;
    }
    return true;
  };

  const importExcel = async (file: File) => {
    if (!testFile(file)) {
      return;
    }
    const XLSX = await import("xlsx");
    const reader = new FileReader();
    reader.onload = async (event) => {
      if (!event.target) return;
      const bstr = event.target.result;
      const wb = XLSX.read(bstr, { type: "binary" });
      const wsname = wb.SheetNames[0];
      const ws = wb.Sheets[wsname];
      const data = XLSX.utils.sheet_to_json(ws, { header: 1 });
      data.splice(0, 0);
      if (!testHeaders(data[0] as string[])) {
        return;
      }
      convertToJSON(data);
    };
    reader.readAsBinaryString(file);
  };

  const removeFile = () => {
    setDisabled(true);
    setFile(null);
    setImportedList([]);
    fileForm.clearErrors();
    setTimeout(() => {
      setDisabled(false);
    }, 500);
  };

  const handleDownloadFile = () => {
    const href =
      "https://uploadthing.com/f/67ae16e5-afad-4e20-b168-e0d3a80bebf4-jlea8r.xlsx";

    const link = document.createElement("a");
    link.href = href;
    link.setAttribute("download", "import.xlsx");
    document.body.appendChild(link);
    link.click();
    link.remove();
    setDownloaded(true);
  };

  const handleImport = async () => {
    try {
      setSubmitting(true);
      const response = await axiosInstance.post("api/students/import", {
        school: props.schoolId,
        students: importedList,
      });
      setResults(response.data.results);
    } catch (error) {
      console.error(error);
    } finally {
      setSubmitting(false);
    }
  };

  const createdCount = results.filter((r) => r.created).length;
  const failedCount = results.filter((r) => !r.created).length;

  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2">
          <FileSpreadsheet className="h-4 w-4" />
          Importuj z Excela
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-auto">
        {results && results.length > 0 ? (
          <div className="space-y-4">
            <DialogHeader>
              <DialogTitle>Wyniki importu</DialogTitle>
              <DialogDescription>
                Podsumowanie importu uczniów z pliku Excel.
              </DialogDescription>
            </DialogHeader>

            {/* Results summary */}
            <div className="flex items-center gap-3">
              {createdCount > 0 && (
                <Badge variant="success" className="gap-1.5 py-1 px-3">
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  Utworzono: {createdCount}
                </Badge>
              )}
              {failedCount > 0 && (
                <Badge variant="destructive" className="gap-1.5 py-1 px-3">
                  <XCircle className="h-3.5 w-3.5" />
                  Błędy: {failedCount}
                </Badge>
              )}
            </div>

            <ResultsTable
              columns={resultColumns}
              data={results}
              className="overflow-auto"
            />
            <Button
              onClick={() => {
                setResults([]);
                setImportedList([]);
                setFile(null);
                setDialogOpen(false);
                router.refresh();
              }}
            >
              Wróć do listy uczniów
            </Button>
          </div>
        ) : (
          <div className="space-y-6">
            <DialogHeader>
              <DialogTitle>Import uczniów z Excela</DialogTitle>
              <DialogDescription>
                Pobierz szablon, uzupełnij dane i prześlij plik.
              </DialogDescription>
            </DialogHeader>

            {/* Steps */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Step 1: Download */}
              <div className="flex flex-col items-center gap-3 p-4 rounded-lg border border-border/50 bg-muted/20">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary text-sm font-semibold">
                  1
                </div>
                <div className="text-center">
                  <h3 className="text-sm font-medium">Pobierz szablon</h3>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Plik <span className="font-mono">import.xlsx</span>
                  </p>
                </div>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        disabled={downloaded}
                        onClick={handleDownloadFile}
                        className="gap-2"
                      >
                        <Download className="h-3.5 w-3.5" />
                        {downloaded ? "Pobrano" : "Pobierz"}
                      </Button>
                    </TooltipTrigger>
                    {downloaded && (
                      <TooltipContent side="bottom">
                        <span className="text-xs text-muted-foreground">
                          Szablon został już pobrany
                        </span>
                      </TooltipContent>
                    )}
                  </Tooltip>
                </TooltipProvider>
              </div>

              {/* Step 2: Upload */}
              <div className="md:col-span-2 flex flex-col gap-3 p-4 rounded-lg border border-border/50 bg-muted/20">
                <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary text-sm font-semibold shrink-0">
                    2
                  </div>
                  <div>
                    <h3 className="text-sm font-medium">Prześlij plik</h3>
                    <p className="text-xs text-muted-foreground">
                      Uzupełniony szablon w formacie .xlsx
                    </p>
                  </div>
                </div>
                <Form {...fileForm}>
                  <form>
                    <FormField
                      control={fileForm.control}
                      name="file"
                      render={() => (
                        <FormItem>
                          <FormControl>
                            <Label
                              htmlFor="import"
                              className={`flex flex-col items-center justify-center rounded-lg border-2 border-dashed transition-all duration-200 ${
                                !file
                                  ? "cursor-pointer border-border hover:border-primary/50 hover:bg-primary/5"
                                  : "border-emerald-500/30 bg-emerald-500/5"
                              } ${
                                fileForm.formState.errors.file
                                  ? "border-destructive"
                                  : ""
                              } h-28`}
                              onDrop={(e) => {
                                e.preventDefault();
                                importExcel(e.dataTransfer.files[0]);
                                setFile(e.dataTransfer.files[0]);
                              }}
                              onDragOver={(e) => {
                                e.preventDefault();
                              }}
                            >
                              {file ? (
                                <div className="flex items-center gap-3">
                                  <Sheet className="h-8 w-8 text-emerald-600" />
                                  <div className="text-sm">
                                    <p className="font-medium">{file.name}</p>
                                    <button
                                      type="button"
                                      className="text-xs text-destructive hover:underline flex items-center gap-1 mt-0.5"
                                      onClick={removeFile}
                                    >
                                      <X className="h-3 w-3" /> Usuń plik
                                    </button>
                                  </div>
                                </div>
                              ) : (
                                <div className="flex flex-col items-center gap-2 p-4">
                                  <Upload className="h-6 w-6 text-muted-foreground" />
                                  <span className="text-xs text-muted-foreground text-center">
                                    Przeciągnij plik tutaj lub kliknij, aby
                                    wybrać
                                  </span>
                                </div>
                              )}
                              <Input
                                type="file"
                                id="import"
                                disabled={!!file || disabled}
                                onClick={(e) => {
                                  e.currentTarget.value = "";
                                }}
                                onChange={(e) => {
                                  e.target.files &&
                                    importExcel(e.target.files[0]);
                                  e.target.files &&
                                    setFile(e.target.files[0]);
                                }}
                                className="hidden"
                                accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
                              />
                            </Label>
                          </FormControl>
                          <FormDescription className="text-xs">
                            Wymagane nagłówki: imie, nazwisko, email, telefon
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </form>
                </Form>
              </div>
            </div>

            {/* Step 3: Preview & Import */}
            {importedList.length > 0 && (
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary text-sm font-semibold shrink-0">
                    3
                  </div>
                  <div>
                    <h3 className="text-sm font-medium">
                      Podgląd i import
                    </h3>
                    <p className="text-xs text-muted-foreground">
                      Sprawdź dane przed importem ({importedList.length}{" "}
                      {importedList.length === 1 ? "uczeń" : "uczniów"})
                    </p>
                  </div>
                </div>

                <ImportTable
                  columns={importTableColumns}
                  data={importedList}
                  className="overflow-auto"
                />
                <Button
                  onClick={handleImport}
                  disabled={submitting}
                  className="gap-2"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Importowanie {importedList.length} uczniów...
                    </>
                  ) : (
                    <>
                      <Upload className="h-4 w-4" />
                      Importuj {importedList.length}{" "}
                      {importedList.length === 1 ? "ucznia" : "uczniów"}
                    </>
                  )}
                </Button>
              </div>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ImportStudents;
