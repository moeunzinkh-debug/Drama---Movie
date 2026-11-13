import Link from "next/link";

const LINKS = [
  { href: "/browse?type=movie", label: "ភាពយន្ត" },
  { href: "/browse?type=drama", label: "រឿងភាគ" },
  { href: "/calendar", label: "កាលវិភាគភាគថ្មី" },
  { href: "/request", label: "ស្នើសុំរឿង" },
  { href: "/about", label: "អំពីយើង" },
  { href: "/privacy", label: "គោលការណ៍ភាពឯកជន" },
  { href: "/terms", label: "លក្ខខណ្ឌប្រើប្រាស់" },
];

export default function SiteFooter() {
  return (
    <footer className="mt-16 border-t border-line/70 bg-ink-2/60">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
        <div className="flex flex-col gap-8 md:flex-row md:justify-between">
          <div className="max-w-sm">
            <p className="text-lg font-bold">
              CINEMA<span className="text-gold">KH</span>
            </p>
            <p className="mt-2 text-sm leading-relaxed text-mist">
              វេទិកាមើលភាពយន្ត និងរឿងភាគឥតគិតថ្លៃសម្រាប់ទស្សនិកជនខ្មែរ។
              គេហទំព័រនេះជា <span className="text-white/80">គំរូអភិវឌ្ឍន៍</span> —
              មាតិកាទាំងអស់ជារឿងប្រឌិតសម្រាប់ការសាកល្បង។
            </p>
            <p className="mt-3 rounded-lg border border-gold/25 bg-gold/5 px-3 py-2 text-xs leading-relaxed text-gold/90">
              ស្ថានភាព៖ មិនទាន់មានការផ្សាយពាណិជ្ជកម្ម ឬការចូលដោយ Google ពិតប្រាកដទេ។
              សូមមើលឯកសារ docs/ សម្រាប់ជំហានបន្ទាប់។
            </p>
          </div>
          <nav className="grid grid-cols-2 gap-x-10 gap-y-2 text-sm" aria-label="តំណភ្ជាប់ខាងក្រោម">
            {LINKS.map((l) => (
              <Link key={l.href} href={l.href} className="text-mist transition hover:text-gold">
                {l.label}
              </Link>
            ))}
          </nav>
        </div>
        <div className="mt-8 flex flex-col gap-2 border-t border-line/60 pt-6 text-xs text-mist/60 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} CINEMA KH. រក្សាសិទ្ធិគ្រប់យ៉ាង។</p>
          <p>គ្មានមាតិកាណាមួយត្រូវបានផ្សាយដោយគ្មានសិទ្ធិឡើយ។</p>
        </div>
      </div>
    </footer>
  );
}
