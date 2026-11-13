/**
 * Maps raw Supabase / Google OAuth error strings to a Khmer explanation and a
 * concrete fix.
 *
 * Without this, a failed sign-in shows "invalid request" with no hint about
 * which of the three settings is wrong — Supabase's redirect allow-list, the
 * Google client's redirect URI, or the Google provider toggle. Those are the
 * only three things that normally break sign-in, so each gets its own message.
 */

export interface AuthErrorHelp {
  /** Short Khmer summary shown to the visitor. */
  message: string;
  /** Actionable steps, in Khmer, for whoever administers the site. */
  steps: string[];
}

const HELP: { match: (m: string) => boolean; help: AuthErrorHelp }[] = [
  {
    // Google's own error when the callback it was given is not registered.
    match: (m) => /redirect_uri_mismatch/i.test(m),
    help: {
      message: "Google មិនទទួលស្គាល់តំណត្រឡប់ (Redirect URI) ដែលគេហទំព័រនេះបានផ្ញើទេ។",
      steps: [
        "Google Cloud Console → APIs & Services → Credentials → OAuth client របស់អ្នក",
        "ក្នុង Authorized redirect URIs ត្រូវមាន ៖ https://<ref>.supabase.co/auth/v1/callback",
        "ត្រូវតែជា Supabase callback — មិនមែនដែនរបស់អ្នក (/auth/callback) ទេ",
        "រង់ចាំ ៥–១០ នាទី បន្ទាប់ពី Save មុននឹងសាកល្បងម្តងទៀត",
      ],
    },
  },
  {
    // Supabase refuses to bounce back to a URL that is not allow-listed.
    match: (m) => /not (in|on) (the )?redirect|redirect.*not.*allow|invalid.*redirect/i.test(m),
    help: {
      message: "Supabase មិនអនុញ្ញាតឲ្យត្រឡប់ទៅអាសយដ្ឋាននេះទេ។",
      steps: [
        "Supabase → Authentication → URL Configuration → Redirect URLs",
        "បន្ថែម https://<ដែនរបស់អ្នក>/auth/callback និង http://localhost:3000/auth/callback",
        "បើសាកល្បងលើ Workers សូមបន្ថែម https://*.workers.dev/auth/callback ដែរ",
      ],
    },
  },
  {
    match: (m) => /provider is not enabled|unsupported provider|provider.*disabled/i.test(m),
    help: {
      message: "Google provider មិនទាន់បើកនៅក្នុង Supabase ទេ។",
      steps: [
        "Supabase → Authentication → Providers → Google",
        "បើក (Enable) ហើយបញ្ចូល Client ID និង Client Secret",
        "Save ហើយសាកល្បងម្តងទៀត",
      ],
    },
  },
  {
    match: (m) => /missing.*code|code.?verifier/i.test(m),
    help: {
      message:
        "ដំណើរការចូលខូច (ខ្វះ code verifier)។ ជាធម្មតាបណ្តាលមកពី cookie ត្រូវបានទប់ស្កាត់ ឬបើកចូលពីដែនខុសគ្នា។",
      steps: [
        "សាកល្បងក្នុងរបៀប Incognito ដើម្បីបិទ cookie ចាស់",
        "ត្រូវចាប់ផ្តើមចូល និងត្រឡប់មកវិញនៅលើដែនតែមួយ (កុំលាយ localhost និង workers.dev)",
        "ពិនិត្យថា browser មិនបានបិទ cookie សម្រាប់គេហទំព័រនេះ",
      ],
    },
  },
  {
    match: (m) => /access_denied/i.test(m),
    help: {
      message: "អ្នកបានបោះបង់ការចូល ឬគណនីនេះមិនត្រូវបានអនុញ្ញាត។",
      steps: [
        "បើ OAuth consent screen នៅជា Testing សូមបន្ថែមអ៊ីមែលរបស់អ្នកក្នុង Test users",
        "សាកល្បងម្តងទៀត ហើយជ្រើសរើសគណនី Google ដែលបានអនុញ្ញាត",
      ],
    },
  },
];

const GENERIC: AuthErrorHelp = {
  message: "ការចូលមិនបានជោគជ័យទេ។",
  steps: [
    "ពិនិត្យថា Google provider បើកក្នុង Supabase ហើយ Client ID/Secret ត្រឹមត្រូវ",
    "ពិនិត្យ Redirect URLs ក្នុង Supabase និង Google Cloud",
    "រត់ npm run check:auth ដើម្បីផ្ទៀងផ្ទាត់ការកំណត់",
  ],
};

export function explainAuthError(raw: string | undefined | null): AuthErrorHelp {
  if (!raw) return GENERIC;
  const decoded = (() => {
    try {
      return decodeURIComponent(raw);
    } catch {
      return raw;
    }
  })();
  return HELP.find((h) => h.match(decoded))?.help ?? GENERIC;
}
