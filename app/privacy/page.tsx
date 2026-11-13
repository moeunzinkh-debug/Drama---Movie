import type { Metadata } from "next";

export const metadata: Metadata = { title: "គោលការណ៍ភាពឯកជន" };

export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <h1 className="text-2xl font-black tracking-tight sm:text-3xl">គោលការណ៍ភាពឯកជន</h1>
      <p className="mt-2 rounded-lg border border-gold/30 bg-gold/5 px-3 py-2 text-xs text-gold/90">
        ឯកសារគំរូ — ត្រូវការការពិនិត្យផ្នែកច្បាប់ និងការបំពេញឲ្យត្រូវនឹងការពិតមុនពេលដាក់ផ្សាយ។
      </p>
      <div className="mt-5 space-y-4 text-sm leading-relaxed text-white/80">
        <h2 className="text-lg font-bold text-white">១. ទិន្នន័យដែលយើងប្រមូល</h2>
        <p className="text-mist">
          នៅពេលអ្នកចូលដោយ Google យើងទទួលបានឈ្មោះ និងអ៊ីមែលរបស់អ្នក។ យើងរក្សាទុកប្រវត្តិមើល
          បញ្ជីរក្សាទុក និងចំណូលចិត្ត ដើម្បីផ្តល់មុខងារបន្តមើល និងការណែនាំ។
        </p>
        <h2 className="text-lg font-bold text-white">២. គោលបំណងប្រើប្រាស់</h2>
        <p className="text-mist">
          ទិន្នន័យត្រូវប្រើសម្រាប់ដំណើរការសេវាកម្ម ការការពារសុវត្ថិភាព និងការវិភាគបែបសមូហភាព។
          យើងមិនលក់ទិន្នន័យផ្ទាល់ខ្លួនរបស់អ្នកទេ។
        </p>
        <h2 className="text-lg font-bold text-white">៣. ពាណិជ្ជកម្ម និងខូគី</h2>
        <p className="text-mist">
          បើយើងបើកការផ្សាយពាណិជ្ជកម្ម អ្នកផ្តល់សេវាអាចប្រើខូគី ដើម្បីវាស់ស្ទង់ និងផ្តល់ពាណិជ្ជកម្ម។
          យើងនឹងបង្ហាញយន្តការយល់ព្រមតាមតម្រូវការច្បាប់ជាធរមាន មុនពេលបើកពាណិជ្ជកម្ម។
          បច្ចុប្បន្ន គ្មានស្គ្រីបពាណិជ្ជកម្មណាមួយត្រូវបានផ្ទុកទេ។
        </p>
        <h2 className="text-lg font-bold text-white">៤. ការរក្សាទុក និងការលុប</h2>
        <p className="text-mist">
          អ្នកអាចស្នើសុំលុបគណនី និងទិន្នន័យរបស់អ្នក។ រយៈពេលរក្សាទុកនឹងត្រូវកំណត់ជាផ្លូវការ
          មុនពេលដាក់ផ្សាយ។
        </p>
        <h2 className="text-lg font-bold text-white">៥. សិទ្ធិរបស់អ្នក</h2>
        <p className="text-mist">
          អ្នកមានសិទ្ធិចូលមើល កែតម្រូវ និងលុបទិន្នន័យផ្ទាល់ខ្លួន តាមច្បាប់ជាធរមាន។
        </p>
      </div>
    </div>
  );
}
