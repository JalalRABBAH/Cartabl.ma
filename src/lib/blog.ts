import type { Locale } from "./i18n";

export type BlogBlock =
  | { type: "p"; text: string }
  | { type: "h2"; text: string }
  | { type: "h3"; text: string }
  | { type: "ul"; items: string[] }
  | { type: "quote"; text: string };

export type RubriqueSlug =
  | "cartables"
  | "sacs-a-dos"
  | "sacs-ordinateur"
  | "sacs-voyage"
  | "accessoires"
  | "guides";

type ProductCat = "CLASSIQUE" | "DOS" | "ROULETTES" | "COLLEGE" | "PC" | "TROUSSE" | "ACCESSOIRE";

export type BlogRubrique = {
  slug: RubriqueSlug;
  emoji: string;
  productCat?: ProductCat;
  fr: { name: string; desc: string };
  ar: { name: string; desc: string };
};

export type BlogPost = {
  slug: string;
  rubrique: RubriqueSlug;
  featured?: boolean;
  date: string;
  updated?: string;
  readTime: number;
  faq?: { fr: { q: string; a: string }[]; ar: { q: string; a: string }[] };
  fr: { title: string; excerpt: string; body: BlogBlock[] };
  ar: { title: string; excerpt: string; body: BlogBlock[] };
};

export const BLOG_RUBRIQUES: BlogRubrique[] = [
  {
    slug: "cartables",
    emoji: "🎒",
    productCat: "CLASSIQUE",
    fr: { name: "Cartables & rentrée", desc: "Sacs scolaires, cartables à roulettes et conseils pour chaque niveau." },
    ar: { name: "الحقائب المدرسية والدخول", desc: "حقائب مدرسية وحقائب بعجلات ونصائح لكل مستوى." },
  },
  {
    slug: "sacs-a-dos",
    emoji: "🎽",
    productCat: "DOS",
    fr: { name: "Sacs à dos", desc: "Guides d'achat, confort, capacités et utilisation." },
    ar: { name: "حقائب الظهر", desc: "أدلة الشراء، الراحة، السعة والاستعمال." },
  },
  {
    slug: "sacs-ordinateur",
    emoji: "💻",
    productCat: "PC",
    fr: { name: "Sacs ordinateur", desc: "Protéger votre PC portable au quotidien." },
    ar: { name: "حقائب الحواسيب", desc: "احمِ حاسوبك المحمول يومياً." },
  },
  {
    slug: "sacs-voyage",
    emoji: "🧳",
    productCat: "ROULETTES",
    fr: { name: "Sacs de voyage", desc: "Week-end, bagages cabine et organisation du départ." },
    ar: { name: "حقائب السفر", desc: "عطلة نهاية الأسبوع، حقائب المطار والتنظيم." },
  },
  {
    slug: "accessoires",
    emoji: "✏️",
    productCat: "TROUSSE",
    fr: { name: "Trousses & accessoires", desc: "Trousses garnies, fournitures et petits indispensables." },
    ar: { name: "المقالم والمستلزمات", desc: "مقالم كاملة، لوازم مدرسية وضروريات صغيرة." },
  },
  {
    slug: "guides",
    emoji: "📘",
    fr: { name: "Conseils & guides", desc: "Tendances, entretien et bons réflexes d'acheteur." },
    ar: { name: "نصائح وأدلة", desc: "صيحات، صيانة وعادات شراء ذكية." },
  },
];

function rub(slug: RubriqueSlug): BlogRubrique {
  return BLOG_RUBRIQUES.find((r) => r.slug === slug)!;
}

export function rubriqueFor(rubrique: RubriqueSlug, locale: Locale) {
  const r = rub(rubrique);
  return locale === "ar" ? r.ar.name : r.fr.name;
}

export const BLOG_POSTS: BlogPost[] = [
  {
    slug: "choisir-cartable-rentree",
    rubrique: "cartables",
    featured: true,
    date: "2026-08-10",
    updated: "2026-08-25",
    readTime: 6,
    faq: {
      fr: [
        { q: "Quel cartable choisir en primaire ?", a: "Un cartable léger (moins de 1 kg à vide), à large bretelles rembourrées et dos renforcé, taille ajustée au dos de l'enfant." },
        { q: "À partir de quel âge passe-t-on au collège ?", a: "Vers 11-12 ans, un sac à dos ou un sac à roulettes plus grand (25-30 L) est adapté aux manuels et cahiers plus nombreux." },
        { q: "Les cartables à roulettes sont-ils recommandés ?", a: "Oui pour les enfants qui portent beaucoup de livres, à condition que le chemin de l'école soit adapté. Ils évitent les douleurs de dos." },
      ],
      ar: [
        { q: "أي حقيبة أنسب للابتدائي؟", a: "حقيبة خفيفة (أقل من كيلو فارغة)، بأشرطة عريضة مبطنة وظهر مقوّى، بمقاس يناسب ظهر الطفل." },
        { q: "في أي سن ننتقل إلى الإعدادي؟", a: "نحو 11-12 سنة، حقيبة ظهر أو حقيبة بعجلات أكبر (25-30 لتراً) تناسب الكتب والدفاتر الأكثر." },
        { q: "هل تنصحون بالحقائب بعجلات؟", a: "نعم لمن يحمل كتباً كثيرة، بشرط أن يكون طريق المدرسة مناسباً. فهي تحمي الظهر من الألم." },
      ],
    },
    fr: {
      title: "Comment choisir le bon cartable pour la rentrée selon le niveau ?",
      excerpt:
        "Primaire, collège, lycée : la taille, la capacité et la solidité ne se choisissent pas au hasard. Notre guide pour un cartable adapté au dos de votre enfant.",
      body: [
        { type: "p", text: "Chaque année, le même casse-tête revient : quel cartable choisir pour que l'enfant soit confortable, bien équipé et sans douleurs de dos ? La réponse dépend avant tout du niveau scolaire et du poids des affaires à transporter." },
        { type: "h2", text: "En primaire : la légèreté avant tout" },
        { type: "p", text: "Au primaire, l'enfant porte peu d'affaires mais grandit vite. Privilégiez un cartable léger à vide (moins d'un kilogramme), avec un dos renforcé, des bretelles larges et rembourrées, et une poche poitrine pour répartir le poids." },
        { type: "ul", items: ["Capacité idéale : 15 à 20 litres", "Bretelles rembourrées réglables", "Bandes réfléchissantes pour la sécurité", "Compartiments garnis : goûter, cahiers, trousse"] },
        { type: "p", text: "Vérifiez aussi le fond : il doit être rigide pour éviter que les cahiers ne plient. Retrouvez notre sélection dans la catégorie Cartables classiques." },
        { type: "h2", text: "Au collège et au lycée : la capacité et l'organisation comptent" },
        { type: "p", text: "Avec les manuels, l'ordinateur et de multiples cahiers, le collégien a besoin d'un sac de 25 à 30 litres, à plusieurs compartiments. Un sac à dos bien rembourré protège le dos et les livres." },
        { type: "ul", items: ["Compartiment ordinateur rembourré jusqu'à 15,6 pouces", "Poche anti-vol au dos", "Boussole : fermetures renforcées et coutures triples", "Sangles de compression pour stabiliser la charge"] },
        { type: "h2", text: "Cartables à roulettes : la solution anti-dos" },
        { type: "p", text: "Pour les enfants qui transportent beaucoup de livres, le cartable à roulettes évite de porter le poids. C'est le choix idéal quand le trajet est plat et goudronné. Assurez-vous que la poignée soit télescopique et réglable à la taille de l'enfant." },
        { type: "quote", text: "La règle d'or : le poids du cartable plein ne doit jamais dépasser 10 % du poids de l'enfant." },
        { type: "h2", text: "Les critères de qualité à vérifier avant d'acheter" },
        { type: "ul", items: ["Zips et fermetures de marque, coulissants", "Fond et angles renforcés", "Matériau déperlant pour les jours de pluie", "Coutures triples sur les zones de tension", "Garantie et possibilité de retour sous 7 jours"] },
        { type: "p", text: "Vous cherchez l'étape d'après ? Notre guide sur les sacs à dos vous aidera à comparer les modèles. Et pour compléter la trousse, consultez notre article sur les trousses garnies." },
      ],
    },
    ar: {
      title: "كيف تختار الحقيبة المدرسية المناسبة حسب المستوى؟",
      excerpt:
        "الابتدائي، الإعدادي، الثانوي: الحجم والسعة والمتانة لا تُختار عشوائياً. دليلنا لحقيبة مناسبة لظهر طفلك.",
      body: [
        { type: "p", text: "كل سنة يعود السؤال نفسه: أي حقيبة اختيار حتى يكون الطفل مرتاحاً، مجهّزاً ودون آلام في الظهر؟ الجواب يعتمد أساساً على المستوى الدراسي ووزن ما يحمله." },
        { type: "h2", text: "في الابتدائي: الخفة أولاً" },
        { type: "p", text: "في الابتدائي يقلّ ما يحمله الطفل لكنه يكبر بسرعة. اختاروا حقيبة خفيفة فارغة (أقل من كيلوغرام)، بظهر مقوّى وأشرطة عريضة مبطنة وجيب أمامي لتوزيع الوزن." },
        { type: "ul", items: ["السعة المثالية: 15 إلى 20 لتراً", "أشرطة مبطنة قابلة للتعديل", "شرائط عاكسة للسلامة", "جيوب منظَّمة: وجبة، دفاتر، مقلمة"] },
        { type: "p", text: "افحصوا الأسفل: يجب أن يكون صلباً حتى لا تنثني الدفاتر. شاهدوا تشكيلتنا في فئة الحقائب الكلاسيكية." },
        { type: "h2", text: "في الإعدادي والثانوي: السعة والتنظيم" },
        { type: "p", text: "مع الكتب والحاسوب والدفاتر الكثيرة، يحتاج التلميذ إلى حقيبة من 25 إلى 30 لتراً بعدة أقسام. الحقيبة المبطنة تحمي الظهر والكتب." },
        { type: "ul", items: ["جيب حاسوب مبطن حتى 15.6 بوصة", "جيب خلفي آمن", "سحابات مقوّاة وخياطة ثلاثية", "أحزمة ضغط لتثبيت الحمل"] },
        { type: "h2", text: "الحقائب بعجلات: حلّ يحمي الظهر" },
        { type: "p", text: "لمن يحملون كتباً كثيرة، تتيح الحقيبة بعجلات عدم حمل الوزن. إنها الخيار المثالي عندما يكون الطريق مستوياً. تأكدوا أن المقبض قابل للتلسكوب وبطول يناسب الطفل." },
        { type: "quote", text: "القاعدة الذهبية: ألا يتجاوز وزن الحقيبة الممتلئة 10% من وزن الطفل." },
        { type: "h2", text: "معايير الجودة قبل الشراء" },
        { type: "ul", items: ["سحابات بعلامة تجارية وتنزلق بسلاسة", "أسفل وزوايا مقوّاة", "مادة مقاومة للماء", "خياطة ثلاثية في مناطق الشد", "ضمان وإمكانية الإرجاع خلال 7 أيام"] },
        { type: "p", text: "تبحثون عن الخطوة التالية؟ دليل حقائب الظهر يساعدكم على المقارنة. ولإكمال المقلمة، اقرأوا مقالنا عن المقالم الكاملة." },
      ],
    },
  },
  {
    slug: "guide-sacs-a-dos",
    rubrique: "sacs-a-dos",
    featured: true,
    date: "2026-08-12",
    updated: "2026-08-26",
    readTime: 5,
    faq: {
      fr: [
        { q: "Quelle capacité choisir pour un sac à dos adulte ?", a: "20-25 L pour le quotidien et le travail, 30 L pour le sport, 40-70 L pour la randonnée ou le voyage." },
        { q: "Comment éviter les douleurs d'épaules ?", a: "Répartissez la charge, réglez les bretelles, portez le sac sur les deux épaules et serrez les sangles de poitrine et de hanche." },
      ],
      ar: [
        { q: "ما السعة المناسبة لحقيبة ظهر للكبار؟", a: "20-25 لتراً للاستعمال اليومي والعمل، 30 لتراً للرياضة، و40-70 لتراً للتنزه أو السفر." },
        { q: "كيف أتجنب آلام الكتفين؟", a: "وزّعوا الحمل، اضبطوا الأشرطة، احملوا الحقيبة على الكتفين معاً وشدّوا أحزمة الصدر والحوض." },
      ],
    },
    fr: {
      title: "Sac à dos : comment bien le choisir (capacité, confort, usage)",
      excerpt:
        "Quotidien, travail, sport ou voyage : la capacité, le dos, les bretelles et les compartiments changent tout. Guide complet pour ne pas se tromper.",
      body: [
        { type: "p", text: "Le sac à dos est devenu l'indispensable de la vie quotidienne : école, travail, université, déplacements, randonnée. Mais un mauvais choix peut vite se transformer en douleurs d'épaules ou de dos." },
        { type: "h2", text: "La capacité selon l'usage" },
        { type: "ul", items: ["10 à 15 L : cartable d'enfant, sac à main léger", "20 à 25 L : quotidien, travail, PC portable", "30 L : sport, piscine, week-end court", "40 à 70 L : randonnée, voyage et grandes escapades"] },
        { type: "h2", text: "Le dos et les bretelles, critères n°1" },
        { type: "p", text: "Un bon sac à dos possède un dos rembourré et ventilé ainsi que des bretelles larges et mousseuses. Les sangles de poitrine et de hanche répartissent la charge et soulagent les épaules dès 15-20 litres." },
        { type: "ul", items: ["Dos moulé et aéré (mesh)", "Bretelles en mousse à mémoire de forme", "Sangle de poitrine et ceinture de hanche", "Platine dorsale pour un maintien absolu"] },
        { type: "h2", text: "Les compartiments indispensables" },
        { type: "p", text: "Un compartiment dédié à l'ordinateur (jusqu'à 15,6 pouces), une pochette zippée pour les documents, un port USB intégré et une poche extérieure pour la bouteille : voilà le trio gagnant pour le travail comme pour les études." },
        { type: "quote", text: "Prévoyez toujours 20 % de volume libre au-delà de vos besoins réels." },
        { type: "p", text: "Vous cherchez aussi une solution pour transporter votre ordinateur en toute sécurité ? Lisez notre guide des sacs ordinateur, ou découvrez directement les modèles de la catégorie Sacs à dos." },
      ],
    },
    ar: {
      title: "حقيبة الظهر: كيف تختارها جيداً (السعة، الراحة، الاستعمال)",
      excerpt:
        "يومياً، للعمل، للرياضة أو للسفر: السعة والظهر والأشرطة والأقسام تغيّر كل شيء. دليل كامل حتى لا تخطئ.",
      body: [
        { type: "p", text: "أصبحت حقيبة الظهر ضرورة يومية: دراسية، عمل، جامعة، تنقلات، تنزه. لكن الاختيار الخاطئ يتحول سريعاً إلى آلام كتف أو ظهر." },
        { type: "h2", text: "السعة حسب الاستعمال" },
        { type: "ul", items: ["10 إلى 15 لتراً: حقيبة طفل، حقيبة خفيفة", "20 إلى 25 لتراً: يومياً، عمل، حاسوب محمول", "30 لتراً: رياضة، مسبح، نهاية أسبوع قصيرة", "40 إلى 70 لتراً: تنزه، سفر ومغامرات"] },
        { type: "h2", text: "الظهر والأشرطة: المعيار الأول" },
        { type: "p", text: "الحقيبة الجيدة لها ظهر مبطن ومهوّى وأشرطة عريضة إسفنجية. أحزمة الصدر والحوض توزّع الوزن وتريح الكتفين ابتداءً من 15-20 لتراً." },
        { type: "ul", items: ["ظهر مقوّى مهوّى", "أشرطة إسفنجية", "حزام صدر وحزام حوض", "لوحة ظهرية لتثبيت تام"] },
        { type: "h2", text: "الأقسام الضرورية" },
        { type: "p", text: "قسم مخصص للحاسوب (حتى 15.6 بوصة)، جيب بسحاب للمستندات، منفذ USB، وجيب خارجي للقارورة: هذا هو الثالوث الرابح للعمل والدراسة." },
        { type: "quote", text: "احجزوا دائماً 20% من المساحة فوق حاجتكم الفعلية." },
        { type: "p", text: "تبحثون أيضاً عن حلّ لنقل حاسوبكم بأمان؟ اقرأوا دليل حقائب الحواسيب، أو اطلعوا مباشرة على فئة حقائب الظهر." },
      ],
    },
  },
  {
    slug: "chok-sac-ordinateur-portable",
    rubrique: "sacs-ordinateur",
    date: "2026-08-14",
    readTime: 4,
    fr: {
      title: "Choisir un sac ordinateur portable : gabarit, protection, style",
      excerpt:
        "15,6 pouces ou 13 ? Dos rembourré, poche renforcée, port USB… Ce qu'il faut vérifier pour protéger un ordinateur au quotidien.",
      body: [
        { type: "p", text: "Entre le travail, l'université et les déplacements, un ordinateur portable voyage partout. Un mauvais transport est la première cause de chocs, rayures et pannes d'écran." },
        { type: "h2", text: "Le gabarit : première chose à vérifier" },
        { type: "p", text: "Mesurez la diagonale de votre écran (13,3 / 14 / 15,6 / 17,3 pouces). Le compartiment doit être légèrement plus grand que l'ordinateur : trop juste, il force sur les zips ; trop grand, l'ordinateur bouge." },
        { type: "ul", items: ["Sac 13 - 14 pouces : ultraportables et Chromebook", "Sac 15,6 pouces : les modèles les plus courants", "Sac 17,3 pouces : stations de travail et gaming", "Poche rembourrée séparée en fond de sac"] },
        { type: "h2", text: "La protection : 3 zones critiques" },
        { type: "ul", items: ["Fond rembourré et surélevé pour absorber les chocs", "Doublure épaisse (mousse EVA) sur les 4 côtés", "Fermetures verrouillables pour le voyage", "Déperlance : votre alliée les jours de pluie"] },
        { type: "h2", text: "Le confort au quotidien" },
        { type: "p", text: "Pensez au poids : un ordinateur de 2 kg demande un sac ergonomique à dos aéré. Les modèles avec port USB et poche anti-vol au dos facilitent la vie : chargez votre téléphone sans sortir l'ordinateur." },
        { type: "quote", text: "N'achetez jamais un sac dédié PC sans vérifier la taille réelle de votre ordinateur." },
        { type: "p", text: "La catégorie Sacs ordinateur regroupe des modèles adaptés à tous les gabarits. Et si vous cherchez un sac polyvalent travail-cours, le guide des sacs à dos vous sera utile." },
      ],
    },
    ar: {
      title: "اختيار حقيبة الحاسوب المحمول: المقاس، الحماية، الأناقة",
      excerpt:
        "15.6 بوصة أم 13؟ ظهر مبطن، جيب مقوّى، منفذ USB… ما يجب التحقق منه لحماية حواسبكم يومياً.",
      body: [
        { type: "p", text: "بين العمل والجامعة والتنقلات، يسافر الحاسوب المحمول في كل مكان. النقل السيئ هو السبب الأول للصدمات والخدوش وأعطال الشاشة." },
        { type: "h2", text: "المقاس: أول شيء يجب التحقق منه" },
        { type: "p", text: "قاسوا قطر شاشتكم (13.3 / 14 / 15.6 / 17.3 بوصة). يجب أن يكون الجيب أكبر قليلاً من الحاسوب: ضيق جداً يضغط على السحاب، واسع جداً يتحرك فيه الحاسوب." },
        { type: "ul", items: ["حقيبة 13 - 14 بوصة: أجهزة فائقة الخفة", "حقيبة 15.6 بوصة: الأكثر شيوعاً", "حقيبة 17.3 بوصة: محطات العمل والألعاب", "جيب مبطن منفصل أسفل الحقيبة"] },
        { type: "h2", text: "الحماية: 3 مناطق حرجة" },
        { type: "ul", items: ["أسفل مبطن ومرتفع لامتصاص الصدمات", "بطانة سميكة من الإسفنج على 4 جهات", "سحابات قابلة للقفل للسفر", "مقاومة الماء: حليفتكم في الأيام الممطرة"] },
        { type: "h2", text: "الراحة اليومية" },
        { type: "p", text: "فكروا في الوزن: حاسوب بوزن 2 كغ يتطلب حقيبة مريحة بظهر مهوّى. الموديلات ذات منفذ USB والجيب الخلفي الآمن تجعل الحياة أسهل: اشتحوا هاتفكم دون إخراج الحاسوب." },
        { type: "quote", text: "لا تشتروا حقيبة حواسيب أبداً دون التحقق من المقاس الحقيقي لحاسوبكم." },
        { type: "p", text: "فئة حقائب الحواسيب تضم موديلات لكل المقاسات. وإذا أردتم حقيبة متعددة الاستعمالات، فدليل حقائب الظهر سيفيدكم." },
      ],
    },
  },
  {
    slug: "sac-week-end-voyage",
    rubrique: "sacs-voyage",
    date: "2026-08-16",
    readTime: 4,
    fr: {
      title: "Sac de voyage et week-end : bien préparer son départ",
      excerpt:
        "Cabine, week-end ou escapade de 3 jours : quel sac, quelle capacité, comment organiser ses affaires sans se surcharger.",
      body: [
        { type: "p", text: "Fini la valise surdimensionnée pour un simple week-end ! Le sac de voyage bien choisi se glisse partout : train, voiture, coffre, cabine d'avion." },
        { type: "h2", text: "Quelle capacité pour quel séjour ?" },
        { type: "ul", items: ["10-15 L : la journée (plage, piscine, randonnée)", "20-35 L : 2 à 3 jours, cabine avion", "35-50 L : 4 à 7 jours, week-end prolongé", "60 L et plus : grande expédition, famille"] },
        { type: "h2", text: "Les points à vérifier sur un sac de voyage" },
        { type: "ul", items: ["Dos ergonomique pour transporter en marchant", "Compression par sangles pour stabiliser la charge", "Poches multiples : ordinateur, documents, bouteille", "Gaine ou housse de protection pour le transport", "Roulettes et poignée télescopique selon usage"] },
        { type: "h2", text: "Les 3 astuces qui changent tout" },
        { type: "ul", items: ["Roulez les vêtements : deux fois plus de place", "Remplissez les chaussures avec les objets fragiles", "Gardez les liquides dans un sachet transparent accessibles"] },
        { type: "quote", text: "Un voyage réussi se prépare la veille : sac prêt, affaires essentielles dans la poche du dessus." },
        { type: "p", text: "Les modèles à roulettes sont parfaits pour allier confort et capacité : consultez la catégorie Cartables à roulettes et accessoires de voyage sur notre boutique." },
      ],
    },
    ar: {
      title: "حقيبة السفر وعطلة نهاية الأسبوع: استعدوا جيداً للانطلاق",
      excerpt:
        "مقصورة أم نهاية أسبوع أم 3 أيام: أي حقيبة، أي سعة، وكيف ننظم أغراضنا دون حمل زائد.",
      body: [
        { type: "p", text: "انتهى زمن الحقيبة الضخمة لعطلة نهاية أسبوع بسيطة! الحقيبة المختارة جيداً تناسب كل مكان: قطار، سيارة، صندوق السيارة، مقصورة الطائرة." },
        { type: "h2", text: "ما السعة المناسبة لكل رحلة؟" },
        { type: "ul", items: ["10-15 لتراً: يوم واحد (شاطئ، مسبح، تنزّه)", "20-35 لتراً: 2-3 أيام، مقصورة الطائرة", "35-50 لتراً: 4-7 أيام، عطلة مطوّلة", "60 لتراً فأكثر: مغامرة كبيرة أو عائلة"] },
        { type: "h2", text: "نقاط يجب فحصها في حقيبة السفر" },
        { type: "ul", items: ["ظهر مريح للحمل أثناء المشي", "ضغط بالأحزمة لتثبيت الحمل", "جيوب متعددة: حاسوب، مستندات، قارورة", "غطاء حماية للنقل", "عجلات ومقبض حسب الاستعمال"] },
        { type: "h2", text: "3 نصائح تغيّر كل شيء" },
        { type: "ul", items: ["لفّوا الملابس: مساحة مضاعفة", "املأوا الأحذية بالأشياء الهشة", "ضعوا السوائل في كيس شفاف وواضح"] },
        { type: "quote", text: "الرحلة الناجحة تُحضّر في المساء: حقيبة جاهزة وضروريات في الجيب العلوي." },
        { type: "p", text: "الموديلات بعجلات مثالية للجمع بين الراحة والسعة: اطلعوا على فئة الحقائب بعجلات ومستلزمات السفر في متجرنا." },
      ],
    },
  },
  {
    slug: "trousses-garnies-rentree",
    rubrique: "accessoires",
    date: "2026-08-18",
    readTime: 3,
    fr: {
      title: "Trousse garnie : le contenu idéal pour une rentrée sans stress",
      excerpt:
        "Ce que doit contenir une trousse par classe : stylos, ciseaux, colle, calculatrice… L'inventaire complet pour primaire et collège.",
      body: [
        { type: "p", text: "La trousse est souvent oubliée dans la course à la rentrée. Pourtant, une trousse garnie et complète évite les mauvaises surprises en classe dès le premier jour." },
        { type: "h2", text: "Trousse de primaire" },
        { type: "ul", items: ["2 crayons à papier + taille-crayon", "1 stylo rouge et 1 bleu", "1 gomme qui n'abîme pas", "1 colle bâton et 1 tube", "1 paire de ciseaux à bouts ronds", "1 règle 15-20 cm et crayons de couleur"] },
        { type: "h2", text: "Trousse de collège et lycée" },
        { type: "ul", items: ["Stylos bleus, noirs, rouges (plusieurs)", "Surligneurs et feutres fins", "Calculatrice scientifique à partir de la 4e", "Correcteur ruban ou liquide", "Trousse à compartiments zippée", "Un kit de surlignage par matière"] },
        { type: "h2", text: "Les accessoires qui complètent" },
        { type: "p", text: "Gourde isotherme, protège-cahier, étui à lunettes ou boîte à goûter : les petits accessoires font aussi partie de la rentrée. Ils s'achètent une fois et durent des années." },
        { type: "quote", text: "Préparez deux trousses : une pour la classe, une à la maison pour les devoirs." },
        { type: "p", text: "Découvrez les trousses garnies et tous les accessoires dans la catégorie Trousses et accessoires. Et pour le cartable de votre enfant, relisez notre guide cartable par niveau." },
      ],
    },
    ar: {
      title: "المقلمة الكاملة: المحتوى المثالي لدخول بدون إجهاد",
      excerpt:
        "ماذا يجب أن تحتوي المقلمة حسب القسم: أقلام، مقص، صمغ، آلة حاسبة… قائمة كاملة للابتدائي والإعدادي.",
      body: [
        { type: "p", text: "غالباً ما تُنسى المقلمة في سباق العودة المدرسية. ومع ذلك، فإن مقلمة كاملة ومنظمة تفاديك مفاجآت سيئة داخل القسم من اليوم الأول." },
        { type: "h2", text: "مقلمة الابتدائي" },
        { type: "ul", items: ["قلمان رصاص ومبراة", "قلم أحمر وآخر أزرق", "ممحاة لا تتلف", "صمغ عصوي وأنبوب", "مقص بأطراف دائرية", "مسطرة 15-20 سم وأقلام ملونة"] },
        { type: "h2", text: "مقلمة الإعدادي والثانوي" },
        { type: "ul", items: ["أقلام زرقاء وسوداء وحمراء (بأعداد)", "أقلام تظليل وأقلام رفيعة", "آلة حاسبة منذ السنة الرابعة", "مصحح", "مقلمة بأقسام بسحاب", "مجموعة تظليل لكل مادة"] },
        { type: "h2", text: "المستلزمات المكملة" },
        { type: "p", text: "قارورة حرارية، غلاف دفاتر، حقيبة نظارات أو علبة وجبات: المستلزمات الصغيرة جزء من الدخول المدرسي أيضاً. تُشترى مرة وتدوم لسنوات." },
        { type: "quote", text: "حضّروا مقلمتين: واحدة للقسم وواحدة في البيت للواجبات." },
        { type: "p", text: "اكتشفوا المقالم الكاملة وكل المستلزمات في فئة المقالم والمستلزمات. ولحقيبة طفلكم، أعدوا قراءة دليل الحقائب حسب المستوى." },
      ],
    },
  },
  {
    slug: "tendances-sacs-2026",
    rubrique: "guides",
    date: "2026-08-20",
    updated: "2026-08-27",
    readTime: 4,
    fr: {
      title: "Tendances sacs 2026 au Maroc : couleurs, matières et formats",
      excerpt:
        "Pastels, couleurs vives, matériaux recyclés, formats compacts : ce qui se porte cette saison dans les cours d'école comme à la ville.",
      body: [
        { type: "p", text: "Chaque rentrée apporte son lot de nouveautés. En 2026, les sacs marocains oscillent entre le pratique et le tendance : on retrouve les couleurs vives, les pastels doux et surtout des matières toujours plus solides." },
        { type: "h2", text: "Les couleurs de la saison" },
        { type: "ul", items: ["Pastels (mauve, menthe, rose poudré) pour les filles", "Tons néon et contrastes pour le collège", "Le gris anthracite et le navy, valeurs sûres", "Imprimés : géométriques et motifs zellige marocains"] },
        { type: "h2", text: "Les matières qui comptent" },
        { type: "p", text: "Polyester recyclé, tissu Oxford 600 deniers, ou encore coton enduit : les matières techniques remplacent peu à peu le simple tissu. Elles résistent à l'usure, se nettoient facilement et déperlent." },
        { type: "h2", text: "Des formats plus malins" },
        { type: "ul", items: ["Sacs multifonctions : pochette ordinateur rabattable", "Cartables à ouverture cloche pour accès rapide", "Sac à dos version mini pour les parents", "Compressions laterales ajustables aux charges"] },
        { type: "h2", text: "Pourquoi c'est le bon moment d'acheter" },
        { type: "p", text: "Acheter les sacs de la saison dans les premières semaines de la rentrée permet de profiter des meilleurs prix et des stocks complets, avec livraison rapide et paiement à la livraison dans les grandes villes marocaines." },
        { type: "quote", text: "Le sac parfait allie trois choses : l'ergonomie, la solidité et le style que l'enfant aime porter." },
        { type: "p", text: "Parcourez toute la collection : cartables, sacs à dos, sacs ordinateur et accessoires sur Mbag.ma." },
      ],
    },
    ar: {
      title: "صيحات الحقائب 2026 في المغرب: ألوان وخامات ومقاسات",
      excerpt:
        "ألوان باستيلية، ألوان زاهية، خامات معاد تدويرها، مقاسات مضغوطة: ما يُلبس هذا الموسم في المدارس والمدينة.",
      body: [
        { type: "p", text: "كل دخول مدرسي يحمل جديداً. في 2026، توازن الحقائب المغربية بين العملي والموضة: ألوان زاهية، باستيل ناعم، وخامات أكثر متانة من أي وقت مضى." },
        { type: "h2", text: "ألوان الموسم" },
        { type: "ul", items: ["باستيل (بنفسجي، نعناعي، وردي بودرة) للبنات", "ألوان نيون وتباينات للإعدادي", "الرمادي الفحمي والأزرق الملكي بقيم ثابتة", "طبعات هندسية وزليج مغربي"] },
        { type: "h2", text: "الخامات المهمة" },
        { type: "p", text: "بوليستر معاد تدويره، قماش أكسفورد 600 دنير، أو قطن مطلي: تساعد الخامات التقنية القماش البسيط. إنها تقاوم التآكل، تُنظف بسهولة وتقاوم الماء." },
        { type: "h2", text: "مقاسات أذكى" },
        { type: "ul", items: ["حقائب متعددة الوظائف: جيب حاسوب قابل للطي", "حقائب بفتح كامل للوصول السريع", "حقائب ظهر صغيرة للوالدين", "ضغط جانبي قابل للتعديل"] },
        { type: "h2", text: "لماذا هذا هو الوقت المناسب للشراء" },
        { type: "p", text: "شراء حقائب الموسم في الأسابيع الأولى من الدخول يتيح الاستفادة من أفضل الأسعار واكتمال المخزون، مع توصيل سريع ودفع عند الاستلام في كبريات المدن المغربية." },
        { type: "quote", text: "الحقيبة المثالية تجمع ثلاثة أشياء: الراحة والمتانة والأناقة التي يحبها الطفل." },
        { type: "p", text: "تصفحوا كل التشكيلة: حقائب مدرسية، حقائب ظهر، حقائب حواسيب ومستلزمات على Mbag.ma." },
      ],
    },
  },
];

export function getPost(slug: string): BlogPost | undefined {
  return BLOG_POSTS.find((p) => p.slug === slug);
}

export function postsByRubrique(rubrique: RubriqueSlug): BlogPost[] {
  return BLOG_POSTS.filter((p) => p.rubrique === rubrique);
}

export function latestPosts(locale: Locale, limit?: number): BlogPost[] {
  const sorted = [...BLOG_POSTS].sort((a, b) => b.date.localeCompare(a.date));
  return limit ? sorted.slice(0, limit) : sorted;
}

export function relatedPosts(post: BlogPost, limit = 3): BlogPost[] {
  return BLOG_POSTS.filter((p) => p.slug !== post.slug && p.rubrique === post.rubrique)
    .concat(BLOG_POSTS.filter((p) => p.slug !== post.slug && p.rubrique !== post.rubrique))
    .slice(0, limit);
}

export const SITE_URL = (process.env.APP_URL || "https://mbag.ma").replace(/\/$/, "");