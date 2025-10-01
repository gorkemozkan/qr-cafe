"use client";

import { AlertTriangle, Download, Trash2 } from "lucide-react";
import { useState } from "react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { GdprDataDeletionDialog } from "@/components/gdpr/GdprDataDeletionDialog";
import { GdprDataExportDialog } from "@/components/gdpr/GdprDataExportDialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { gdprRepository } from "@/lib/repositories/gdpr-repository";
import PageTitle from "../common/PageTitle";

export function GdprCompliance() {
  const t = useTranslations("gdpr");
  const [isExporting, setIsExporting] = useState(false);

  const [isDeleting, setIsDeleting] = useState(false);

  const [showExportDialog, setShowExportDialog] = useState(false);

  const [showDeletionDialog, setShowDeletionDialog] = useState(false);

  const handleDataExport = async () => {
    setIsExporting(true);
    try {
      const response = await fetch("/api/gdpr/export", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to export data");
      }

      const contentDisposition = response.headers.get("Content-Disposition");

      const filename = contentDisposition
        ? contentDisposition.split("filename=")[1]?.replace(/"/g, "")
        : `gdpr-data-export-${new Date().toISOString().split("T")[0]}.json`;

      const blob = await response.blob();

      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);

      toast.success(t("export.exportSuccess"));
    } catch (_error) {
      toast.error(t("export.exportFailed"));
    } finally {
      setIsExporting(false);
    }
  };

  const handleDataDeletion = async (confirmed: boolean) => {
    if (!confirmed) return;

    setIsDeleting(true);
    try {
      const result = await gdprRepository.deleteUserData(true);

      if (result.success) {
        toast.success(t("delete.deleteSuccess"));

        setTimeout(() => {
          window.location.href = "/admin/auth/login";
        }, 2000);
      } else {
        throw new Error(result.message || "Failed to delete data");
      }
    } catch (_error) {
      toast.error(t("delete.deleteFailed"));
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className=" space-y-12">
      <PageTitle showBackButton title={t("page.title")} subtitle={t("page.subtitle")} />
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Download className="h-5 w-5" />
              {t("export.title")}
            </CardTitle>
            <CardDescription>{t("export.description")}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              <Badge variant="secondary">{t("export.badgeAccount")}</Badge>
              <Badge variant="secondary">{t("export.badgeCafes")}</Badge>
              <Badge variant="secondary">{t("export.badgeCategories")}</Badge>
              <Badge variant="secondary">{t("export.badgeProducts")}</Badge>
            </div>
          </CardContent>
          <CardFooter className="flex justify-end mt-auto">
            <Button onClick={() => setShowExportDialog(true)} disabled={isExporting} className="w-full">
              {isExporting ? t("export.exporting") : t("export.exportButton")}
            </Button>
          </CardFooter>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 ">
              <Trash2 className="h-5 w-5" />
              {t("delete.title")}
            </CardTitle>
            <CardDescription>{t("delete.description")}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Alert variant="destructive">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>{t("delete.alertDescription")}</AlertDescription>
              </Alert>
              <Button onClick={() => setShowDeletionDialog(true)} disabled={isDeleting} className="w-full">
                {isDeleting ? t("delete.deleting") : t("delete.deleteAllData")}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
      <GdprDataExportDialog
        open={showExportDialog}
        onOpenChange={setShowExportDialog}
        onConfirm={handleDataExport}
        isLoading={isExporting}
      />
      <GdprDataDeletionDialog
        open={showDeletionDialog}
        onOpenChange={setShowDeletionDialog}
        onConfirm={handleDataDeletion}
        isLoading={isDeleting}
      />
    </div>
  );
}
