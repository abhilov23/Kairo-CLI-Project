export default function CliAuthLoading() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="flex flex-col items-center gap-4 text-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-foreground border-t-transparent" />
        <p className="text-sm text-muted-foreground">
          Authenticating KairoCLI...
        </p>
      </div>
    </div>
  );
}
