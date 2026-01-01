export default function FastFlowPage() {
  return (
    <main className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-4">Fast Flow</h1>
      <p className="text-muted-foreground mb-8">
        Complete your directive in one session. No account required.
      </p>

      {/* TODO: Implement DirectiveForm from features/directive */}
      <div className="border border-dashed border-border p-8 rounded-lg text-center">
        <p className="text-muted-foreground">
          Form will go here - see features/directive/components
        </p>
      </div>
    </main>
  )
}
