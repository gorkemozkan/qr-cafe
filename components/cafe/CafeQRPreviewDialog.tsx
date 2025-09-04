"use client";

import { FC, useEffect, useState, useRef, useCallback } from "react";
import { Download, QrCode, MessageCircle, ExternalLink, Copy } from "lucide-react";
import QRCode from "qrcode";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { CopyButton } from "@/components/ui";
import { ContextMenu, ContextMenuTrigger, ContextMenuContent, ContextMenuItem, ContextMenuSeparator } from "@/components/ui/context-menu";
import Image from "next/image";
import { toast } from "sonner";
import Link from "next/link";
import { shareWhatsApp } from "@/lib/utils";

interface QRPreviewDialogProps {
  open: boolean;
  slug: string;
  onOpenChange: (open: boolean) => void;
}

const CafeQRPreviewDialog: FC<QRPreviewDialogProps> = ({ slug, open, onOpenChange }) => {
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState<string>("");

  const [isGenerating, setIsGenerating] = useState(false);

  const [isExporting, setIsExporting] = useState(false);

  const qrContainerRef = useRef<HTMLDivElement>(null);

  const generateQRCode = useCallback(async () => {
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

  const handleCopyLink = useCallback(async () => {
    if (!cafeUrl) return;

    try {
      await navigator.clipboard.writeText(cafeUrl);
      toast.success("Link copied to clipboard!");
    } catch (_error) {
      toast.error("Failed to copy link");
    }
  }, [cafeUrl]);

  const handleGoToMenu = useCallback(() => {
    if (cafeUrl && typeof window !== "undefined") {
      window.open(cafeUrl, "_blank");
    }
  }, [cafeUrl]);

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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 animate-in fade-in-0 slide-in-from-top-2 duration-300 delay-100">
            <QrCode className="h-5 w-5" />
            QR Code Preview
          </DialogTitle>
          <DialogDescription>QR code for {slug} - Scan to visit the cafe page</DialogDescription>
        </DialogHeader>
        <div className="space-y-0 animate-in fade-in-0 slide-in-from-bottom-2 duration-300 delay-200">
          <div className="bg-background p-4 rounded-lg border">
            <div className="flex items-center justify-between">
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium mb-1">Menu URL:</p>
                <a href={cafeUrl} target="_blank" rel="noopener noreferrer" className="text-sm hover:underline underline-offset-4 transition-all duration-300   ">
                  {cafeUrl}
                </a>
              </div>
              <CopyButton noText text={cafeUrl} variant="outline" size="sm" className="ml-2 flex-shrink-0" />
              <Button asChild variant="outline" size="sm" className="ml-2 flex-shrink-0">
                <Link href={cafeUrl} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="h-4 w-4" />
                </Link>
              </Button>
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
                  <div className="relative h-[300px] mx-auto">
                    <ContextMenu>
                      <ContextMenuTrigger asChild>
                        <div>
                          <Image src={qrCodeDataUrl} alt={`QR Code for ${slug}`} fill className="object-contain" unoptimized />
                        </div>
                      </ContextMenuTrigger>
                      <ContextMenuContent>
                        <ContextMenuItem onClick={() => shareWhatsApp(cafeUrl)} disabled={!cafeUrl}>
                          <MessageCircle className="mr-2 h-4 w-4" />
                          Send to WhatsApp
                        </ContextMenuItem>
                        <ContextMenuItem onClick={handleExportPDF} disabled={!qrCodeDataUrl || isExporting}>
                          <Download className="mr-2 h-4 w-4" />
                          Export
                        </ContextMenuItem>
                        <ContextMenuSeparator />
                        <ContextMenuItem onClick={handleGoToMenu} disabled={!cafeUrl}>
                          <ExternalLink className="mr-2 h-4 w-4" />
                          Go to Menu
                        </ContextMenuItem>
                        <ContextMenuItem onClick={handleCopyLink} disabled={!cafeUrl}>
                          <Copy className="mr-2 h-4 w-4" />
                          Copy Link
                        </ContextMenuItem>
                      </ContextMenuContent>
                    </ContextMenu>
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
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-2">
              <Button variant="outline" onClick={() => shareWhatsApp(cafeUrl)} disabled={!cafeUrl} className="flex items-center gap-2 w-full">
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

export default CafeQRPreviewDialog;
