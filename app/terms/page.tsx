import type { Metadata } from "next";

export const metadata: Metadata = { title: "លក្ខខណ្ឌប្រើប្រាស់" };

export default function TermsPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <h1 className="text-2xl font-black tracking-tight sm:text-3xl">លក្ខខណ្ឌប្រើប្រាស់</h1>
      <p className="mt-2 rounded-lg border border-gold/30 bg-gold/5 px-3 py-2 text-xs text-gold/90">
        ឯកសារគំរូ — ត្រូវការការពិនិត្យផ្នែកច្បាប់មុនពេលដាក់ផ្សាយ។
      </p>
      <div className="mt-5 space-y-4 text-sm leading-relaxed">
        <h2 className="text-lg font-bold text-white">១. ការប្រើប្រាស់សេវាកម្ម</h2>
        <p className="text-mist">
          អ្នកអាចរកមើលគេហទំព័រដោយសេរី។ ការចាក់វីដេអូត្រូវការគណនី Google។ អ្នកត្រូវមានអាយុគ្រប់គ្រាន់
          តាមច្បាប់ក្នុងតំបន់របស់អ្នក ឬមានការយល់ព្រមពីអ្នកអាណាព្យាបាល។
        </p>
        <h2 className="text-lg font-bold text-white">២. សិទ្ធិមាតិកា</h2>
        <p className="text-mist">
          មាតិកាទាំងអស់ត្រូវតែមានការអនុញ្ញាតពីម្ចាស់សិទ្ធិ។ យើងមិនផ្សាយ មិនចម្លង និងមិនចែកចាយ
          មាតិកាដែលគ្មានសិទ្ធិឡើយ។ ការបង្ហោះឡើងវិញ ឬការទាញយកដោយផ្ទាល់ពីប្រភពវីដេអូត្រូវបានហាមឃាត់។
        </p>
        <h2 className="text-lg font-bold text-white">៣. អាកប្បកិរិយាត្រូវហាមឃាត់</h2>
        <ul className="list-disc space-y-1 pl-5 text-mist">
          <li>ការបង្កើតចរាចរណ៍មិនត្រឹមត្រូវ ឬការចុចពាណិជ្ជកម្មស្វ័យប្រវត្តិ។</li>
          <li>ការបំពានសិទ្ធិអ្នកដទៃ ការប្រមាថ ឬមាតិកាខុសច្បាប់ក្នុងមតិយោបល់។</li>
          <li>ការប៉ុនប៉ងចូលប្រព័ន្ធដោយគ្មានការអនុញ្ញាត។</li>
        </ul>
        <h2 className="text-lg font-bold text-white">៤. ពាណិជ្ជកម្ម</h2>
        <p className="text-mist">
          សេវាកម្មនេះឥតគិតថ្លៃ និងអាចបង្ហាញពាណិជ្ជកម្ម។ អ្នកមិនត្រូវបានតម្រូវឲ្យចុចពាណិជ្ជកម្មឡើយ។
          ចំណូលមិនត្រូវបានធានាទេ។
        </p>
        <h2 className="text-lg font-bold text-white">៥. ការផ្លាស់ប្តូរ</h2>
        <p className="text-mist">
          យើងអាចកែប្រែលក្ខខណ្ឌទាំងនេះ។ ការប្រើប្រាស់បន្តបន្ទាប់មានន័យថាអ្នកយល់ព្រមនឹងការកែប្រែ។
        </p>
      </div>
    </div>
  );
}
