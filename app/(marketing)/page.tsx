export default function HomePage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-8">
      <h1 className="text-4xl font-bold mb-4">
        Advance Care Directive
      </h1>
      <p className="text-lg text-muted-foreground mb-8 text-center max-w-2xl">
        Create your legally compliant Advance Care Directive for NSW, Australia.
        Take your time or complete it quickly - your choice.
      </p>

      <div className="flex gap-4">
        <a
          href="/paced"
          className="px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90"
        >
          Start Paced Flow
        </a>
        <a
          href="/fast"
          className="px-6 py-3 border border-border rounded-lg hover:bg-accent"
        >
          Start Fast Flow
        </a>
      </div>
    </main>
  )
}
