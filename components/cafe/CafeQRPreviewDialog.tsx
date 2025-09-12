"use client";

import { Copy, Download, ExternalLink, MessageCircle, QrCode } from "lucide-react";
import Image from "next/image";
import QRCode from "qrcode";
import { FC, useCallback, useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import CopyButton from "@/components/common/CopyButton";
import ExternalLinkButton from "@/components/common/ExternalLinkButton";
import { Button } from "@/components/ui/button";
import { ContextMenu, ContextMenuContent, ContextMenuItem, ContextMenuSeparator, ContextMenuTrigger } from "@/components/ui/context-menu";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface Props {
  open: boolean;
  slug: string;
  onOpenChange: (open: boolean) => void;
}

const CafeQRPreviewDialog: FC<Props> = ({ slug, open, onOpenChange }) => {
  const t = useTranslations("cafe.qrCode");
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

  const shareWhatsApp = (text: string) => {
    const message = `Check out this cafe menu: ${text}`;
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, "_blank", "noopener,noreferrer");
  };

  const handleCopyLink = useCallback(async () => {
    if (!cafeUrl) return;

    try {
      await navigator.clipboard.writeText(cafeUrl);
      toast.success(t("linkCopied"));
    } catch (_error) {
      toast.error(t("failedToCopy"));
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
      ctx.fillText(t("qrCodeForCafe"), canvas.width / 2, 60);

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
        ctx.fillText(t("scanToVisit"), canvas.width / 2, 620);
        ctx.fillText(`${t("generatedOn")} ${new Date().toLocaleDateString()}`, canvas.width / 2, 650);

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
            toast.success(t("exportSuccess"));
          }
        }, "image/png");
      };
      img.src = qrCodeDataUrl;
    } catch (_error) {
      toast.error(t("exportFailed"));
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <QrCode className="h-5 w-5" />
            {t("title")}
          </DialogTitle>
          <DialogDescription>{t("description")}</DialogDescription>
        </DialogHeader>
        <div>
          <div className="bg-background p-4 rounded-lg border">
            <div className="flex items-start justify-between flex-wrap gap-2">
              <div>
                <p className="text-sm font-medium mb-1">{t("menuUrl")}</p>
                <a href={cafeUrl} target="_blank" rel="noopener noreferrer" className="text-sm hover:underline underline-offset-4 line-clamp-2 ">
                  {cafeUrl}
                </a>
              </div>
              <div className="flex items-center gap-2 ">
                <CopyButton text={cafeUrl} />
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
                          <Image src={qrCodeDataUrl} alt={`QR Code for ${slug}`} fill className="object-contain" unoptimized />
                        </div>
                      </ContextMenuTrigger>
                      <ContextMenuContent>
                        <ContextMenuItem onClick={() => shareWhatsApp(cafeUrl)} disabled={!cafeUrl}>
                          <MessageCircle className="mr-2 h-4 w-4" />
                          {t("sendToWhatsApp")}
                        </ContextMenuItem>
                        <ContextMenuItem onClick={handleExportPDF} disabled={!qrCodeDataUrl || isExporting}>
                          <Download className="mr-2 h-4 w-4" />
                          {t("export")}
                        </ContextMenuItem>
                        <ContextMenuSeparator />
                        <ContextMenuItem onClick={handleGoToMenu} disabled={!cafeUrl}>
                          <ExternalLink className="mr-2 h-4 w-4" />
                          {t("goToMenu")}
                        </ContextMenuItem>
                        <ContextMenuItem onClick={handleCopyLink} disabled={!cafeUrl}>
                          <Copy className="mr-2 h-4 w-4" />
                          {t("copyLink")}
                        </ContextMenuItem>
                      </ContextMenuContent>
                    </ContextMenu>
                  </div>
                  <div className="text-center space-y-2">
                    <p className="text-sm font-medium">{t("scanThisQrCode")}</p>
                    <p className="text-xs text-muted-foreground">{t("qrCodeDescription")}</p>
                  </div>
                </div>
              ) : (
                <div className="w-[300px] h-[300px] flex items-center justify-center text-muted-foreground">
                  <div className="text-center space-y-2">
                    <p className="text-sm font-medium text-red-500">{t("failedToGenerate")}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-2">
              <Button
                size="lg"
                variant="outline"
                onClick={() => shareWhatsApp(cafeUrl)}
                disabled={!cafeUrl}
                className="flex items-center gap-2 w-full"
              >
                <MessageCircle className="h-4 w-4" />
                {t("sendToWhatsApp")}
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={handleExportPDF}
                disabled={!qrCodeDataUrl || isExporting}
                className="flex items-center gap-2 w-full"
              >
                <Download className="h-4 w-4" />
                {isExporting ? t("exporting") : t("export")}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CafeQRPreviewDialog;
