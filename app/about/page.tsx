import type { Metadata } from "next";

export const metadata: Metadata = { title: "អំពីយើង" };

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <h1 className="text-2xl font-black tracking-tight sm:text-3xl">អំពី CINEMA KH</h1>
      <div className="mt-5 space-y-4 text-sm leading-relaxed text-white/80">
        <p>
          CINEMA KH គឺជាគម្រោងវេទិកាមើលភាពយន្ត និងរឿងភាគសម្រាប់ទស្សនិកជនខ្មែរ។
          ការរកមើលគឺឥតគិតថ្លៃ និងមិនត្រូវការគណនី — ប៉ុន្តែអ្នកត្រូវចូលដោយ Google ដើម្បីចាក់វីដេអូ។
        </p>
        <p>
          គេហទំព័រនេះស្ថិតក្នុង <strong className="text-gold">ដំណាក់កាលអភិវឌ្ឍន៍</strong>។
          មាតិកាទាំងអស់ដែលអ្នកឃើញជារឿងប្រឌិតសម្រាប់ការសាកល្បងរចនា មិនមែនជាការផ្សាយពិតប្រាកដទេ។
        </p>

        <h2 className="pt-4 text-lg font-bold text-white">គោលការណ៍របស់យើង</h2>
        <ul className="list-disc space-y-2 pl-5 text-mist">
          <li>គ្មានការផ្សាយមាតិកាដោយគ្មានសិទ្ធិ — គ្រប់ចំណងជើងត្រូវតែមានការអនុញ្ញាតច្បាស់លាស់។</li>
          <li>ការផ្សាយពាណិជ្ជកម្មត្រូវមានតុល្យភាព និងគោរពគោលការណ៍របស់អ្នកផ្តល់សេវា។</li>
          <li>មិនមានការបង្ខំឲ្យចុចពាណិជ្ជកម្ម ឬការបង្កើតចំណូលមិនត្រឹមត្រូវឡើយ។</li>
          <li>ទិន្នន័យអ្នកប្រើត្រូវបានការពារ និងកំណត់ត្រឹមអ្វីដែលចាំបាច់។</li>
        </ul>

        <h2 className="pt-4 text-lg font-bold text-white">ទំនាក់ទំនង</h2>
        <p className="text-mist">
          ព័ត៌មានទំនាក់ទំនងផ្លូវការនឹងត្រូវបានបន្ថែមមុនពេលដាក់ផ្សាយជាសាធារណៈ
          (ត្រូវការសម្រាប់ការពិនិត្យរបស់អ្នកផ្តល់សេវាពាណិជ្ជកម្ម)។
        </p>
      </div>
    </div>
  );
}
