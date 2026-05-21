import { Countdown } from './Countdown'

export function Header() {
  return (
    <header className="relative overflow-hidden bg-gradient-to-b from-[#fff9e8] via-[#fcfcfc] to-[#f5fafb]">
      <div
        className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-accent-purple/10 blur-3xl"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -bottom-20 -left-16 h-64 w-64 rounded-full bg-accent-teal/15 blur-3xl"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute left-1/2 top-1/3 h-40 w-40 -translate-x-1/2 rounded-full bg-primary/25 blur-3xl"
        aria-hidden
      />

      <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-gradient-to-r from-accent-purple via-primary to-accent-teal" />

      <div className="relative mx-auto max-w-lg px-4 pb-7 pt-8 sm:pt-10">
        <div className="flex flex-col items-center gap-5">
          <img
            src="/metzum.png"
            alt="Metzum"
            className="h-14 w-auto max-w-[min(100%,280px)] object-contain drop-shadow-[0_4px_20px_rgba(17,24,26,0.08)] sm:h-[4.5rem] md:h-20"
          />

          <div className="text-center">
            <p className="inline-block rounded-full bg-primary/25 px-3 py-1 text-xs font-bold uppercase tracking-[0.18em] text-warning">
              Konkurranse 2026
            </p>
            <h1 className="mt-3 bg-gradient-to-br from-secondary via-[#2a3a3d] to-accent-teal bg-clip-text text-4xl font-extrabold tracking-tight text-transparent sm:text-[2.75rem]">
              Svette-stafetten
            </h1>
            <p className="mx-auto mt-2 max-w-sm text-sm leading-relaxed text-gray-500">
              26. mai – 26. juni
              <br />
              Tur-retur <strong className="text-warning">2</strong> poeng
              <span className="mx-1 text-gray-300">·</span>
              En vei <strong className="text-warning">1</strong> poeng
            </p>
          </div>

          <div className="metzum-card w-full !shadow-[0_12px_40px_rgba(7,162,168,0.12)] !ring-primary/20">
            <Countdown />
          </div>
        </div>
      </div>
    </header>
  )
}
