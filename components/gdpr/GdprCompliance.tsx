"use client";

import { AlertTriangle, Download, Trash2 } from "lucide-react";
import { useState } from "react";
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

      // Get the filename from the response headers
      const contentDisposition = response.headers.get("Content-Disposition");
      const filename = contentDisposition
        ? contentDisposition.split("filename=")[1]?.replace(/"/g, "")
        : `gdpr-data-export-${new Date().toISOString().split("T")[0]}.json`;

      // Create a blob from the response
      const blob = await response.blob();

      // Create a download link and trigger the download
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);

      toast.success("Data export completed successfully");
    } catch (_error) {
      toast.error("Failed to export data. Please try again.");
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
        toast.success("Your data has been permanently deleted");
        // Redirect to login page after a short delay
        setTimeout(() => {
          window.location.href = "/admin/auth/login";
        }, 2000);
      } else {
        throw new Error(result.message || "Failed to delete data");
      }
    } catch (error) {
      toast.error("Failed to delete data. Please try again.");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className=" space-y-12">
      <PageTitle showBackButton title="User Settings" subtitle="Manage your account and preferences " />

      <div className="grid gap-6 md:grid-cols-2">
        {/* Data Export Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Download className="h-5 w-5" />
              Export Your Data
            </CardTitle>
            <CardDescription>Download a complete copy of all your personal data in JSON format.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              <Badge variant="secondary">User Account</Badge>
              <Badge variant="secondary">Cafes</Badge>
              <Badge variant="secondary">Categories</Badge>
              <Badge variant="secondary">Products</Badge>
            </div>
          </CardContent>
          <CardFooter className="flex justify-end mt-auto">
            <Button onClick={() => setShowExportDialog(true)} disabled={isExporting} className="w-full">
              {isExporting ? "Exporting..." : "Export Data"}
            </Button>
          </CardFooter>
        </Card>

        {/* Data Deletion Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 ">
              <Trash2 className="h-5 w-5" />
              Delete Your Data
            </CardTitle>
            <CardDescription>Permanently delete all your data. This action cannot be undone.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Alert variant="destructive">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  This will permanently delete all your cafes, categories, products, and account data. You will be logged out and cannot access your
                  account anymore.
                </AlertDescription>
              </Alert>
              <Button onClick={() => setShowDeletionDialog(true)} disabled={isDeleting} className="w-full">
                {isDeleting ? "Deleting..." : "Delete All Data"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
      <GdprDataExportDialog open={showExportDialog} onOpenChange={setShowExportDialog} onConfirm={handleDataExport} isLoading={isExporting} />
      <GdprDataDeletionDialog open={showDeletionDialog} onOpenChange={setShowDeletionDialog} onConfirm={handleDataDeletion} isLoading={isDeleting} />
    </div>
  );
}
