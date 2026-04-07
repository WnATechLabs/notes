export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center px-4 py-16">
      <pre className="text-2xl leading-tight font-mono select-none" aria-label="Claude Code mascot">
        {`
    /\\_/\\
   ( o.o )
    > ^ <
   /|   |\\
  (_|   |_)
        `}
      </pre>
      <h1 className="mt-4 text-4xl font-bold">Claude Code</h1>
      <p className="mt-2 text-lg text-gray-500">Your AI-powered coding companion</p>

      <section className="mt-12 w-full max-w-2xl">
        <h2 className="text-2xl font-semibold mb-6">
          Advantages of Using AI for Development
        </h2>
        <ul className="space-y-4 list-disc list-inside text-lg">
          <li>
            <strong>Faster prototyping</strong> — go from idea to working code
            in minutes instead of hours
          </li>
          <li>
            <strong>Reduced boilerplate</strong> — let AI generate repetitive
            code so you can focus on business logic
          </li>
          <li>
            <strong>Instant code reviews</strong> — get real-time feedback on
            code quality, security, and best practices
          </li>
          <li>
            <strong>Accelerated debugging</strong> — identify and fix bugs
            faster with AI-assisted analysis
          </li>
          <li>
            <strong>Knowledge on demand</strong> — access expertise across
            languages, frameworks, and libraries without context-switching
          </li>
          <li>
            <strong>Consistent code style</strong> — maintain uniform patterns
            and conventions across your codebase
          </li>
          <li>
            <strong>Lower barrier to entry</strong> — learn new technologies
            faster with guided, contextual explanations
          </li>
          <li>
            <strong>Automated refactoring</strong> — safely restructure code
            with AI understanding the full context
          </li>
        </ul>
      </section>
    </div>
  );
}
