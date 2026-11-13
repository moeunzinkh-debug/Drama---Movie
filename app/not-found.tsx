import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-md px-4 py-24 text-center">
      <p className="text-6xl font-black text-gold">404</p>
      <h1 className="mt-2 text-xl font-bold">រកមិនឃើញទំព័រនេះទេ</h1>
      <p className="mt-2 text-sm text-mist">ទំព័រដែលអ្នកស្វែងរកអាចត្រូវលុប ឬផ្លាស់ប្តូរតំណ។</p>
      <Link href="/" className="mt-6 inline-block rounded-full bg-gold px-6 py-3 text-sm font-bold text-ink">
        ត្រឡប់ទៅទំព័រដើម
      </Link>
    </div>
  );
}
