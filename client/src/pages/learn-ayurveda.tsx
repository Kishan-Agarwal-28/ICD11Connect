import AyurvedaLearning from "@/components/ayurveda-learning";
import AppNavigation from "@/components/app-navigation";

export default function LearnAyurvedaPage() {
  return (
    <div className="min-h-screen bg-background">
      <AppNavigation />
      <div className="container mx-auto p-6 space-y-6">
        <div className="space-y-2 text-center">
          <h1 className="text-3xl font-bold tracking-tight">Learn Ayurveda</h1>
          <p className="text-muted-foreground">
            Master Ayurvedic concepts through interactive lessons with dual-coding references
          </p>
        </div>
        <AyurvedaLearning />
      </div>
    </div>
  );
}
