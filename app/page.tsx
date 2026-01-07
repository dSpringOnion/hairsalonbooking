import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function Home() {
  return (
    <main className="min-h-screen pb-20 overflow-x-hidden selection:bg-terracotta-100 selection:text-terracotta-700">
      {/* Navigation */}
      <nav className="flex items-center justify-between px-6 py-6 md:px-12 sticky top-0 z-50 bg-cream-50/80 backdrop-blur-md border-b border-cream-200/50">
        <div className="text-3xl font-serif font-bold text-charcoal-900 tracking-tighter">
          AURA
        </div>
        <Link
          href="/book"
          className="group relative px-6 py-2.5 rounded-full overflow-hidden bg-charcoal-900 text-cream-50 transition-all hover:scale-105"
        >
          <span className="relative z-10 font-medium text-sm flex items-center gap-2">
            Book Appointment
            <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
          </span>
          <div className="absolute inset-0 bg-terracotta-500 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-500 ease-out" />
        </Link>
      </nav>

      {/* Hero Section */}
      <section className="relative px-6 pt-12 md:px-12 md:pt-24 lg:pt-32 max-w-[1400px] mx-auto">
        <div className="grid lg:grid-cols-12 gap-12 items-center">
          {/* Text Content */}
          <div className="lg:col-span-7 flex flex-col items-center lg:items-start text-center lg:text-left z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-charcoal-900/10 bg-white/50 backdrop-blur-sm mb-6">
              <span className="w-2 h-2 rounded-full bg-terracotta-500 animate-pulse" />
              <span className="text-xs font-bold tracking-widest uppercase text-charcoal-800/80">Est. 2024 • SoHo NY</span>
            </div>

            <h1 className="text-6xl md:text-8xl lg:text-[7rem] font-serif font-light text-charcoal-900 leading-[0.9] mb-8 tracking-tight">
              Artistry in <br />
              <span className="italic font-normal text-terracotta-500 ml-4 lg:ml-12">Texture</span> & Form
            </h1>

            <p className="text-charcoal-800/80 text-xl font-light max-w-lg mb-12 leading-relaxed text-balance">
              An intimate studio dedicated to the craft of hair. Sustainable products, bespoke cuts, and an atmosphere of calm.
            </p>

            <div className="flex gap-4">
              <Link href="/book" className="bg-terracotta-500 text-white px-8 py-4 rounded-full text-lg font-medium hover:bg-terracotta-700 transition-colors shadow-lg shadow-terracotta-500/20">
                Book Your Visit
              </Link>
              <button className="px-8 py-4 rounded-full text-lg font-medium text-charcoal-900 border border-charcoal-900/10 hover:bg-white transition-colors">
                View Lookbook
              </button>
            </div>
          </div>

          {/* Hero Image */}
          <div className="lg:col-span-5 relative">
            <div className="relative aspect-[3/4] rounded-[2rem] overflow-hidden shadow-2xl rotate-2 hover:rotate-0 transition-transform duration-700 ease-out">
              <Image
                src="/hero.png"
                alt="Salon Interior"
                fill
                className="object-cover scale-105 hover:scale-100 transition-transform duration-[2s]"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-60" />
            </div>
            {/* Decorative Elements */}
            <div className="absolute -z-10 -bottom-12 -left-12 w-64 h-64 bg-terracotta-100 rounded-full blur-3xl opacity-60" />
            <div className="absolute -z-10 top-12 -right-12 w-64 h-64 bg-sage-500/20 rounded-full blur-3xl opacity-60" />
          </div>
        </div>
      </section>

      {/* Marquee / Brand Line */}
      <div className="w-full bg-charcoal-900 text-cream-50 py-4 mt-24 overflow-hidden whitespace-nowrap">
        <div className="inline-flex gap-8 animate-infinite-scroll">
          {Array(10).fill("LUXURY HAIR • ORGANIC CARE • BESPOKE STYLING • ").map((text, i) => (
            <span key={i} className="text-sm font-bold tracking-widest uppercase opacity-80">{text}</span>
          ))}
        </div>
      </div>

      {/* Services Preview - List Style for "Editorial" feel */}
      <section className="px-6 py-24 md:px-12 max-w-5xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 border-b border-charcoal-900/10 pb-8">
          <div>
            <h2 className="text-4xl md:text-5xl font-serif text-charcoal-900 mb-2">Our Menu</h2>
            <p className="text-charcoal-800/60">Curated services for every hair type.</p>
          </div>
          <Link href="/book" className="text-terracotta-500 font-medium hover:text-charcoal-900 transition-colors hidden md:block">
            View All Services →
          </Link>
        </div>

        <div className="grid gap-6">
          {[
            { name: "Signature Cut", time: "60m", price: "$85+", desc: "Consultation, wash, precision cut & blowout." },
            { name: "Dimensional Balayage", time: "3h", price: "$280+", desc: "Hand-painted lightening for effortless growth." },
            { name: "Gloss & Tone", time: "45m", price: "$65", desc: "Refresher for color and shine." },
            { name: "Relaxing Treatment", time: "30m", price: "$45", desc: "Scalp massage and deep conditioning mask." },
          ].map((s) => (
            <div key={s.name} className="group relative bg-white p-8 rounded-2xl border border-transparent hover:border-cream-200 shadow-sm hover:shadow-xl transition-all duration-300">
              <div className="flex justify-between items-baseline mb-3">
                <h3 className="font-serif text-2xl text-charcoal-900 group-hover:text-terracotta-500 transition-colors">{s.name}</h3>
                <span className="font-sans font-medium text-lg text-charcoal-900">{s.price}</span>
              </div>
              <div className="flex items-center gap-4 text-sm text-charcoal-800/50 mb-4">
                <span>{s.time}</span>
                <span className="w-1 h-1 rounded-full bg-charcoal-800/30" />
                <span>Styling</span>
              </div>
              <p className="text-charcoal-800/80 max-w-xl font-light">{s.desc}</p>

              <div className="absolute right-8 bottom-8 opacity-0 group-hover:opacity-100 transition-opacity -translate-x-2 group-hover:translate-x-0 duration-300">
                <ArrowRight className="text-terracotta-500" />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Visual Footer */}
      <footer className="px-6 py-20 bg-charcoal-900 text-cream-50 rounded-t-[3rem] mt-12">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="font-serif text-5xl md:text-7xl mb-8 leading-none">
              Ready for <br /> <span className="text-terracotta-500 italic">your look?</span>
            </h2>
            <Link href="/book" className="inline-block bg-cream-50 text-charcoal-900 px-8 py-4 rounded-full font-medium text-lg hover:bg-terracotta-500 hover:text-white transition-colors">
              Book Appointment
            </Link>
          </div>

          <div className="space-y-8 md:text-right font-light text-lg text-white/80">
            <div>
              <p>123 Artisan Avenue, SoHo</p>
              <p>New York, NY 10012</p>
            </div>
            <div>
              <p>hello@aurasalon.com</p>
              <p>(212) 555-0123</p>
            </div>
            <div className="flex gap-4 md:justify-end text-sm font-bold tracking-widest uppercase text-white/40">
              <a href="#" className="hover:text-white transition-colors">Instagram</a>
              <a href="#" className="hover:text-white transition-colors">Tiktok</a>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}
