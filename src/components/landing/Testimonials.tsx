const testimonials = [
  { quote: "GrowthOS replaced three tools and 10 hours of weekly grunt work. We booked 2x more demos in our first month.", name: "Maya Chen", role: "Founder, Drift Analytics" },
  { quote: "The cold email generator is scary good. Our reply rate went from 8% to 31% almost overnight.", name: "Tom Becker", role: "Agency Owner, Northstar" },
  { quote: "As a solo freelancer, the AI sales assistant is like having a growth advisor on call 24/7.", name: "Priya Nair", role: "Independent Consultant" },
];

export function Testimonials() {
  return (
    <section id="testimonials" className="bg-slate-50 py-24">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-slate-900 md:text-4xl">
            Loved by founders and teams
          </h2>
          <p className="mt-4 text-lg text-slate-600">Join thousands growing with GrowthOS.</p>
        </div>
        <div className="mt-16 grid gap-6 md:grid-cols-3">
          {testimonials.map((t) => (
            <figure key={t.name} className="card p-6">
              <blockquote className="text-slate-700">“{t.quote}”</blockquote>
              <figcaption className="mt-6 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-600 font-semibold text-white">
                  {t.name[0]}
                </div>
                <div>
                  <div className="text-sm font-semibold text-slate-900">{t.name}</div>
                  <div className="text-xs text-slate-500">{t.role}</div>
                </div>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
