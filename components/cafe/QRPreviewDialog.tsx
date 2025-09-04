"use client";

import { FC, useEffect, useState, useRef, useCallback } from "react";
import { Download, QrCode, MessageCircle, Mail } from "lucide-react";
import QRCode from "qrcode";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { CopyButton } from "@/components/ui";
import Image from "next/image";
import { toast } from "sonner";

interface QRPreviewDialogProps {
  open: boolean;
  slug: string;
  onOpenChange: (open: boolean) => void;
}

const QRPreviewDialog: FC<QRPreviewDialogProps> = ({ slug, open, onOpenChange }) => {
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState<string>("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const qrContainerRef = useRef<HTMLDivElement>(null);

  const generateQRCode = useCallback(async () => {
    if (!slug || typeof window === "undefined") return;

    try {
      setIsGenerating(true);

      const cafeUrl = `${window.location.origin}/${slug}`;

      // Generate QR code as data URL
      const qrDataUrl = await QRCode.toDataURL(cafeUrl, {
        width: 300,
        margin: 2,
        color: {
          dark: "#000000",
          light: "#FFFFFF",
        },
      });

      setQrCodeDataUrl(qrDataUrl);
    } catch (_error) {
      setQrCodeDataUrl("");
    } finally {
      setIsGenerating(false);
    }
  }, [slug]);

  // Generate QR code when cafe data changes
  useEffect(() => {
    if (slug && open) {
      generateQRCode();
    }
  }, [slug, open, generateQRCode]);

  const cafeUrl = slug ? (typeof window !== "undefined" ? `${window.location.origin}/${slug}` : `/${slug}`) : "";

  const handleExportPDF = async () => {
    if (!qrCodeDataUrl) return;

    try {
      setIsExporting(true);

      // Create a canvas element to draw the QR code
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      // Set canvas size
      canvas.width = 800;
      canvas.height = 1000;

      // Fill background
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Add title
      ctx.fillStyle = "#000000";
      ctx.font = "bold 32px Arial";
      ctx.textAlign = "center";
      ctx.fillText("QR Code for Cafe", canvas.width / 2, 60);

      // Add cafe slug
      ctx.font = "24px Arial";
      ctx.fillText(`Slug: ${slug}`, canvas.width / 2, 100);

      // Add URL
      ctx.font = "18px Arial";
      ctx.fillText(cafeUrl, canvas.width / 2, 130);

      // Load and draw QR code image
      const img = new window.Image();
      img.onload = () => {
        // Calculate position to center the QR code
        const qrSize = 400;
        const x = (canvas.width - qrSize) / 2;
        const y = 180;

        ctx.drawImage(img, x, y, qrSize, qrSize);

        // Add instructions
        ctx.fillStyle = "#666666";
        ctx.font = "16px Arial";
        ctx.textAlign = "center";
        ctx.fillText("Scan this QR code to visit the cafe page", canvas.width / 2, 620);
        ctx.fillText(`Generated on ${new Date().toLocaleDateString()}`, canvas.width / 2, 650);

        // Convert canvas to blob and download
        canvas.toBlob((blob) => {
          if (blob) {
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = `qr-code-${slug}.png`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
            toast.success("QR Code exported successfully!");
          }
        }, "image/png");
      };
      img.src = qrCodeDataUrl;
    } catch (_error) {
      toast.error("Failed to export QR code");
    } finally {
      setIsExporting(false);
    }
  };

  const handleShareWhatsApp = () => {
    if (!cafeUrl) return;

    const message = `Check out this cafe menu: ${cafeUrl}`;
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;

    window.open(whatsappUrl, "_blank");
    toast.success("Opening WhatsApp...");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <QrCode className="h-5 w-5" />
            QR Code Preview
          </DialogTitle>
          <DialogDescription>QR code for {slug} - Scan to visit the cafe page</DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Cafe URL Display */}
          <div className="bg-background p-4 rounded-lg border">
            <div className="flex items-center justify-between">
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium mb-1">Menu URL:</p>
                <p className="text-sm  truncate">{cafeUrl}</p>
              </div>
              <CopyButton text={cafeUrl} variant="outline" size="sm" className="ml-2 flex-shrink-0" />
            </div>
          </div>

          {/* QR Code Display */}
          <div className="flex justify-center">
            <div ref={qrContainerRef} className="bg-background p-6 rounded-lg">
              {isGenerating ? (
                <div className="w-[300px] h-[300px] flex items-center justify-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
                </div>
              ) : qrCodeDataUrl ? (
                <div className="space-y-4">
                  <div className="relative w-[300px] h-[300px] mx-auto">
                    <Image src={qrCodeDataUrl} alt={`QR Code for ${slug}`} fill className="object-contain" unoptimized />
                  </div>
                  <div className="text-center space-y-2">
                    <p className="text-sm font-medium">Scan this QR code</p>
                    <p className="text-xs text-muted-foreground">Visitors can scan this code to access your cafe page</p>
                  </div>
                </div>
              ) : (
                <div className="w-[300px] h-[300px] flex items-center justify-center text-muted-foreground">
                  <div className="text-center space-y-2">
                    <p className="text-sm font-medium text-red-500">Failed to generate QR code</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="space-y-4">
            {/* Main Actions Row */}
            <div className="flex w-max space-x-2">
              <Button variant="outline" onClick={handleShareWhatsApp} disabled={!cafeUrl} className="flex items-center gap-2 w-full">
                <MessageCircle className="h-4 w-4" />
                WhatsApp
              </Button>
              <Button variant="outline" onClick={handleExportPDF} disabled={!qrCodeDataUrl || isExporting} className="flex items-center gap-2 w-full">
                <Download className="h-4 w-4" />
                {isExporting ? "Exporting..." : "Export"}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default QRPreviewDialog;
