"use client";

import { FC, useEffect, useState, useRef, useCallback } from "react";
import { Download, QrCode, MessageCircle, ExternalLink, Copy } from "lucide-react";
import { useTranslations } from "next-intl";
import QRCode from "qrcode";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { CopyButton } from "@/components/ui";
import {
  ContextMenu,
  ContextMenuTrigger,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
} from "@/components/ui/context-menu";
import Image from "next/image";
import { toast } from "sonner";
import { shareWhatsApp } from "@/lib/utils";
import ExternalLinkButton from "@/components/ExternalLinkButton";

interface Props {
  open: boolean;
  slug: string;
  onOpenChange: (open: boolean) => void;
}

const CafeQRPreviewDialog: FC<Props> = ({ slug, open, onOpenChange }) => {
  const t = useTranslations("cafe");

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
      toast.success(t("qr.share.linkCopied"));
    } catch (_error) {
      toast.error(t("qr.share.copyFailed"));
    }
  }, [cafeUrl, t]);

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
      ctx.fillText(t("qr.export.pdfTitle"), canvas.width / 2, 60);

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
        ctx.fillText(t("qr.export.pdfInstruction"), canvas.width / 2, 620);
        ctx.fillText(t("qr.export.pdfGenerated", { date: new Date().toLocaleDateString() }), canvas.width / 2, 650);

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
            toast.success(t("qr.export.successMessage"));
          }
        }, "image/png");
      };
      img.src = qrCodeDataUrl;
    } catch (_error) {
      toast.error(t("qr.export.failedMessage"));
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
            {t("qr.preview.title")}
          </DialogTitle>
          <DialogDescription>{t("qr.preview.description")}</DialogDescription>
        </DialogHeader>
        <div>
          <div className="bg-background p-4 rounded-lg border">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div>
                <p className="text-sm font-medium mb-1">{t("qr.preview.menuUrl")}:</p>
                <a
                  href={cafeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm hover:underline underline-offset-4 line-clamp-2 "
                >
                  {cafeUrl}
                </a>
              </div>
              <div className="flex items-center gap-2 ">
                <CopyButton noText text={cafeUrl} variant="outline" size="sm" />
                <ExternalLinkButton url={cafeUrl} />
              </div>
            </div>
          </div>

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
                          <Image
                            src={qrCodeDataUrl}
                            alt={`QR Code for ${slug}`}
                            fill
                            className="object-contain"
                            unoptimized
                          />
                        </div>
                      </ContextMenuTrigger>
                      <ContextMenuContent>
                        <ContextMenuItem onClick={() => shareWhatsApp(cafeUrl)} disabled={!cafeUrl}>
                          <MessageCircle className="mr-2 h-4 w-4" />
                          {t("qr.share.sendToWhatsApp")}
                        </ContextMenuItem>
                        <ContextMenuItem onClick={handleExportPDF} disabled={!qrCodeDataUrl || isExporting}>
                          <Download className="mr-2 h-4 w-4" />
                          {t("qr.export.button")}
                        </ContextMenuItem>
                        <ContextMenuSeparator />
                        <ContextMenuItem onClick={handleGoToMenu} disabled={!cafeUrl}>
                          <ExternalLink className="mr-2 h-4 w-4" />
                          {t("qr.share.goToMenu")}
                        </ContextMenuItem>
                        <ContextMenuItem onClick={handleCopyLink} disabled={!cafeUrl}>
                          <Copy className="mr-2 h-4 w-4" />
                          {t("qr.share.copyLink")}
                        </ContextMenuItem>
                      </ContextMenuContent>
                    </ContextMenu>
                  </div>
                  <div className="text-center space-y-2">
                    <p className="text-sm font-medium">{t("qr.preview.scanInstruction")}</p>
                    <p className="text-xs text-muted-foreground">{t("qr.preview.scanDescription")}</p>
                  </div>
                </div>
              ) : (
                <div className="w-[300px] h-[300px] flex items-center justify-center text-muted-foreground">
                  <div className="text-center space-y-2">
                    <p className="text-sm font-medium text-red-500">{t("qr.preview.failedGeneration")}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-2">
              <Button
                variant="outline"
                onClick={() => shareWhatsApp(cafeUrl)}
                disabled={!cafeUrl}
                className="flex items-center gap-2 w-full"
              >
                <MessageCircle className="h-4 w-4" />
                {t("qr.share.whatsApp")}
              </Button>
              <Button
                variant="outline"
                onClick={handleExportPDF}
                disabled={!qrCodeDataUrl || isExporting}
                className="flex items-center gap-2 w-full"
              >
                <Download className="h-4 w-4" />
                {isExporting ? t("qr.export.exporting") : t("qr.export.button")}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CafeQRPreviewDialog;
