import type { LocalizedText } from './types';

/**
 * Longer copy for the committee and division pages (/committees/[slug], /divisions/[slug]).
 * Kept at the general IFMSA level on purpose: no local numbers, dates or names.
 * Review with each committee officer / division director before relying on it.
 */
export const unitContent: Record<string, { about: LocalizedText; audience: LocalizedText }> = {
  scome: {
    about: {
      en: 'SCOME works on the quality of medical education. Members run peer-teaching and clinical skills sessions, collect student feedback on the curriculum, and bring the student voice into education decisions, as part of IFMSA’s global medical education network.',
      ar: 'تعمل SCOME على جودة التعليم الطبي. ينظم الأعضاء جلسات التعليم بين الزملاء وورش المهارات الإكلينيكية، ويجمعون آراء الطلاب في المناهج، وينقلون صوت الطلاب إلى قرارات التعليم، كجزء من شبكة التعليم الطبي العالمية في IFMSA.',
    },
    audience: {
      en: 'For students who enjoy teaching, learning by doing, or improving how medicine is taught.',
      ar: 'لو بتحب تعلّم غيرك، أو تتعلم بالممارسة، أو تطوّر طريقة تدريس الطب.',
    },
  },
  scope: {
    about: {
      en: 'SCOPE runs IFMSA’s professional exchange program: clinical clerkships abroad for outgoing students, and a welcome program for incoming students hosted by the local committee. Members handle applications, preparation, and hosting.',
      ar: 'تدير SCOPE برنامج التبادل المهني في IFMSA: تدريب إكلينيكي بالخارج للطلاب المسافرين، وبرنامج استقبال للطلاب الأجانب اللي بتستضيفهم اللجنة المحلية. الأعضاء بيتابعوا التقديم والتجهيز والاستضافة.',
    },
    audience: {
      en: 'For students curious about other healthcare systems, or who want to host students from around the world.',
      ar: 'لو عندك فضول تشوف أنظمة صحية تانية، أو عايز تستضيف طلاب من كل العالم.',
    },
  },
  scoph: {
    about: {
      en: 'SCOPH turns medical knowledge into community impact: awareness campaigns, screening days, and health education with schools and local communities, in line with IFMSA’s public health priorities.',
      ar: 'تحوّل SCOPH المعرفة الطبية إلى أثر في المجتمع: حملات توعية، أيام فحص، وتثقيف صحي مع المدارس والمجتمع المحلي، بما يتماشى مع أولويات الصحة العامة في IFMSA.',
    },
    audience: {
      en: 'For students who want to work in the field and see the effect of their work on people’s health.',
      ar: 'لو عايز تشتغل في الميدان وتشوف أثر شغلك على صحة الناس.',
    },
  },
  scora: {
    about: {
      en: 'SCORA works on sexual and reproductive health and rights, including HIV and AIDS: evidence-based, youth-friendly health education, reducing stigma, and advocating for fair access to care.',
      ar: 'تعمل SCORA على الصحة والحقوق الجنسية والإنجابية بما يشمل HIV والإيدز: تثقيف صحي مبني على الدليل ومناسب للشباب، تقليل الوصمة، ومناصرة الوصول العادل للرعاية.',
    },
    audience: {
      en: 'For students who want to talk about sensitive health topics with accuracy and respect.',
      ar: 'لو عايز تتكلم في موضوعات صحية حساسة بدقة واحترام.',
    },
  },
  score: {
    about: {
      en: 'SCORE connects students with research: research exchanges abroad through IFMSA, plus local training in research methods, scientific writing, and critical reading of papers.',
      ar: 'تربط SCORE الطلاب بالبحث العلمي: تبادل بحثي بالخارج من خلال IFMSA، وتدريب محلي على منهجية البحث والكتابة العلمية والقراءة النقدية للأبحاث.',
    },
    audience: {
      en: 'For students who ask “why?” and want to take part in real research.',
      ar: 'لو دايماً بتسأل «ليه؟» وعايز تشارك في بحث حقيقي.',
    },
  },
  scorp: {
    about: {
      en: 'SCORP brings human rights and peace into medicine: medical ethics, health equity, refugee and migrant health, and advocacy for groups that are left behind.',
      ar: 'تُدخل SCORP حقوق الإنسان والسلام في الطب: أخلاقيات المهنة، العدالة الصحية، صحة اللاجئين والمهاجرين، والمناصرة للفئات الأكثر تهميشاً.',
    },
    audience: {
      en: 'For students who care about fairness and dignity in healthcare.',
      ar: 'لو بتهتم بالعدالة والكرامة في الرعاية الصحية.',
    },
  },
  cbsd: {
    about: {
      en: 'CBSD builds the skills of members and leaders: soft-skills and leadership trainings, preparing new trainers, and helping every committee run stronger activities.',
      ar: 'يبني CBSD مهارات الأعضاء والقادة: تدريبات المهارات الناعمة والقيادة، إعداد مدربين جدد، ومساعدة كل لجنة تنفذ أنشطة أقوى.',
    },
    audience: {
      en: 'For students who like training others and growing as leaders.',
      ar: 'لو بتحب تدرّب غيرك وتطوّر نفسك كقائد.',
    },
  },
  psd: {
    about: {
      en: 'PSD helps teams turn ideas into well-planned projects: project design, monitoring and evaluation, and measuring impact across BMSA’s committees.',
      ar: 'يساعد PSD الفرق تحوّل الأفكار إلى مشاريع مخططة كويس: تصميم المشاريع، المتابعة والتقييم، وقياس الأثر عبر لجان بمسا.',
    },
    audience: {
      en: 'For students who enjoy planning, organising, and making sure work gets results.',
      ar: 'لو بتحب التخطيط والتنظيم وتتأكد إن الشغل بيجيب نتيجة.',
    },
  },
  pnsd: {
    about: {
      en: 'PNSD is BMSA’s media and digital team: content, design, photography and video, publications, and the tools and website that keep members and the public informed.',
      ar: 'PNSD هو فريق الإعلام والتقنية في بمسا: المحتوى، التصميم، التصوير والفيديو، المنشورات، والأدوات والموقع اللي بيوصّلوا الأخبار للأعضاء والجمهور.',
    },
    audience: {
      en: 'For students who design, write, film, or build things online.',
      ar: 'لو بتصمم أو بتكتب أو بتصوّر أو بتبني حاجات أونلاين.',
    },
  },
  fsd: {
    about: {
      en: 'FSD keeps BMSA’s work sustainable: partnerships and sponsorships, fundraising campaigns, the merch store, and sound budgeting for projects.',
      ar: 'يحافظ FSD على استدامة شغل بمسا: الشراكات والرعايات، حملات جمع التبرعات، متجر بمسا، وميزانيات مضبوطة للمشاريع.',
    },
    audience: {
      en: 'For students who like negotiating, building relationships, and working with numbers.',
      ar: 'لو بتحب التفاوض وبناء العلاقات والشغل بالأرقام.',
    },
  },
  rsd: {
    about: {
      en: 'RSD supports scientific thinking across BMSA: research mentorship, evidence-based medicine sessions, and courses on research methods and open science.',
      ar: 'يدعم RSD التفكير العلمي في بمسا كلها: الإرشاد البحثي، جلسات الطب المبني على الدليل، ودورات في منهجية البحث والعلم المفتوح.',
    },
    audience: {
      en: 'For students who want to learn research properly and help others do the same.',
      ar: 'لو عايز تتعلم البحث العلمي صح وتساعد غيرك يتعلمه.',
    },
  },
};
