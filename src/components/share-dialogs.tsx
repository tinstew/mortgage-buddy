import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Copy, Check, Mail, Code } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface ShareDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ShareDialog({ open, onOpenChange }: ShareDialogProps) {
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  const embedCode = `<iframe src="${window.location.origin}" width="100%" height="800" frameborder="0" style="border-radius:12px;box-shadow:0 4px 24px rgba(0,0,0,0.08);"></iframe>`;

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    toast({ title: "Copied!", description: "Copied to clipboard." });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Share Calculator</DialogTitle>
          <DialogDescription>
            Share this calculator via link, email, or embed it on your site.
          </DialogDescription>
        </DialogHeader>
        <Tabs defaultValue="link" className="mt-2">
          <TabsList className="w-full">
            <TabsTrigger value="link" className="flex-1">Link</TabsTrigger>
            <TabsTrigger value="embed" className="flex-1">Embed</TabsTrigger>
          </TabsList>
          <TabsContent value="link" className="space-y-4 pt-2">
            <div className="flex gap-2">
              <Input readOnly value={window.location.href} className="text-sm" />
              <Button
                variant="outline"
                size="icon"
                onClick={() => copyToClipboard(window.location.href)}
              >
                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              </Button>
            </div>
            <Button
              className="w-full gold-gradient text-accent-foreground font-semibold"
              onClick={() => {
                window.open(
                  `mailto:?subject=Private Mortgage Calculator&body=Check out this calculator: ${window.location.href}`,
                  "_blank"
                );
              }}
            >
              <Mail className="w-4 h-4 mr-2" /> Send via Email
            </Button>
          </TabsContent>
          <TabsContent value="embed" className="space-y-3 pt-2">
            <div className="bg-muted rounded-lg p-3">
              <code className="text-xs text-foreground break-all font-mono">
                {embedCode}
              </code>
            </div>
            <Button
              variant="outline"
              className="w-full"
              onClick={() => copyToClipboard(embedCode)}
            >
              {copied ? <Check className="w-4 h-4 mr-2" /> : <Code className="w-4 h-4 mr-2" />}
              {copied ? "Copied!" : "Copy Embed Code"}
            </Button>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
