import { useApp } from "@/context/AppContext";
import { Icons } from "@/components/Icons";
import { Button } from "@/components/ui/button";

export function LanguageToggle() {
  const { language, setLanguage, t } = useApp();

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={() => setLanguage(language === "en" ? "hi" : "en")}
      className="gap-2"
    >
      <Icons.language className="h-4 w-4" />
      <span className="text-sm font-medium">
        {language === "en" ? "हिंदी" : "English"}
      </span>
    </Button>
  );
}
