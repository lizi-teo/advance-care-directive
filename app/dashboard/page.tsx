export default function DashboardPage() {
  return (
    <main className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-4">Your Directives</h1>
      <p className="text-muted-foreground mb-8">
        View and manage your saved advance care directives.
      </p>

      {/* TODO: Implement saved directives list */}
      <div className="border border-dashed border-border p-8 rounded-lg text-center">
        <p className="text-muted-foreground">
          Dashboard will go here - see features/directive/components
        </p>
      </div>
    </main>
  )
}
