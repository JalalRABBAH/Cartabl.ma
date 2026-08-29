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
  {
    slug: "premier-cartable-maternelle",
    rubrique: "cartables",
    date: "2026-08-21",
    readTime: 4,
    faq: {
      fr: [
        { q: "Quelle taille de cartable pour la maternelle ?", a: "Une capacité de 10 à 12 litres suffit largement : l'enfant ne transporte ni cahiers ni livres à cet âge." },
        { q: "Quand acheter le premier cartable ?", a: "Idéalement entre la grande section et le CP, ou dès l'inscription si l'école exige un cartable pour les sorties." },
        { q: "Faut-il un cartable à personnage ?", a: "Oui si cela motive l'enfant, mais vérifiez d'abord le poids, la poignée et la simplicité des fermetures." },
      ],
      ar: [
        { q: "ما حجم حقيبة الروض المناسب؟", a: "سعة 10 إلى 12 لتراً تكفي تماماً: الطفل لا يحمل دفاتر ولا كتباً في هذه السن." },
        { q: "متى نشتري الحقيبة الأولى؟", a: "يفضل بين القسم الأخير من الروض والسنة الأولى، أو عند التسجيل إذا طلبت المدرسة حقيبة للخروجات." },
        { q: "هل نشتري حقيبة بشخصية كرتونية؟", a: "نعم إن كانت تحفز الطفل، لكن تحققوا أولاً من الوزن والمقبض وسهولة السحابات." },
      ],
    },
    fr: {
      title: "Premier cartable de maternelle : petit, léger et surtout malin",
      excerpt:
        "10 litres, moins de 400 g, bretelles courtes et fermetures simples : comment choisir le tout premier cartable sans suréquiper.",
      body: [
        { type: "p", text: "À la maternelle, l'enfant n'a presque rien à transporter : un goûter, parfois un change et un doudou ou un cahier de liaison. Le cartable idéal est donc très petit, très léger et très simple à ouvrir." },
        { type: "h2", text: "Ce qu'il faut viser à la maternelle" },
        { type: "ul", items: ["Capacité de 10 à 12 litres, pas plus", "Poids à vide inférieur à 400 grammes", "Bretelles courtes adaptées à un petit dos", "Poignée haute pour le moment où l'adulte l'aide", "Une seule grande poche, pas de compartiments complexes"] },
        { type: "p", text: "L'enfant doit pouvoir porter et attraper son cartable lui-même : s'il est trop grand, il bascule vers l'arrière et déséquilibre la marche." },
        { type: "h2", text: "Fermetures et prise en main" },
        { type: "ul", items: ["Grande ouverture qui se voit sans chercher", "Système aimanté ou bande auto-agrippante plutôt que zip fin", "Mousquetons de poitrine réglables", "Fond plat pour se tenir debout seul"] },
        { type: "h2", text: "La question des fournitures" },
        { type: "p", text: "En maternelle, on laisse les fournitures à l'école : pas besoin d'une trousse garnie ni d'un protège-cahier. Gardez le cartable presque vide, et réservez le sac complet pour le CP." },
        { type: "quote", text: "À la maternelle, moins c'est plus : le bon cartable se porte seul, s'ouvre facilement et se range dans un casier." },
        { type: "p", text: "Ce premier cartable passé, notre guide pour choisir un cartable selon le niveau vous aidera à sélectionner le modèle du CP au lycée. Les modèles adaptés aux plus petits sont dans la catégorie Cartables classiques." },
      ],
    },
    ar: {
      title: "أول حقيبة للروض: صغيرة، خفيفة وذكية",
      excerpt:
        "10 لترات، أقل من 400 غرام، أشرطة قصيرة وسحابات بسيطة: كيف نختار أول حقيبة دون تجهيز زائد.",
      body: [
        { type: "p", text: "في الروض، لا يحمل الطفل شيئاً تقريباً: وجبة، وأحياناً ملابس احتياطية ودبدوب أو دفتر تواصل. الحقيبة المثالية إذن صغيرة جداً وخفيفة جداً وسهلة الفتح." },
        { type: "h2", text: "ما المطلوب في الروض" },
        { type: "ul", items: ["سعة 10 إلى 12 لتراً لا أكثر", "وزن فارغ أقل من 400 غرام", "أشرطة قصيرة مناسبة لظهر صغير", "مقبض علوي حين يساعده الكبار", "جيب كبير واحد، دون أقسام معقدة"] },
        { type: "p", text: "يجب أن يحمل الطفل حقيبته بنفسه ويمسكها: إن كانت كبيرة جداً تميل إلى الخلف وتخل بتوازن المشي." },
        { type: "h2", text: "السحابات وقبضة اليد" },
        { type: "ul", items: ["فتحة كبيرة واضحة دون بحث", "نظام مغناطيسي أو شريط بدل سحاب رفيع", "مشبك صدر قابل للتعديل", "أسفل مسطح يقف وحده"] },
        { type: "h2", text: "مسألة اللوازم" },
        { type: "p", text: "في الروض تُترك اللوازم في المدرسة: لا حاجة لمقلمة كاملة ولا غلاف دفاتر. أبقوا الحقيبة فارغة تقريباً، واحتفظوا بالحقيبة الكاملة للسنة الأولى." },
        { type: "quote", text: "في الروض، الأقل أفضل: الحقيبة الجيدة تُحمل وحدها، تُفتح بسهولة وتُوضع في الخزانة." },
        { type: "p", text: "بعد هذه الحقيبة الأولى، سيساعدكم دليلنا لاختيار الحقيبة حسب المستوى على اختيار النموذج من السنة الأولى إلى الثانوي. النماذج الملائمة للصغار موجودة في فئة الحقائب الكلاسيكية." },
      ],
    },
  },
  {
    slug: "cartables-roulettes-guide",
    rubrique: "cartables",
    date: "2026-08-22",
    readTime: 4,
    faq: {
      fr: [
        { q: "Deux ou quatre roues, que choisir ?", a: "Quatre roues pour plus de stabilité dans les escaliers, deux roues pour un poids plus léger. C'est un vrai choix selon la classe et le trajet." },
        { q: "Un cartable à roulettes passe-t-il sous le bureau ?", a: "Beaucoup de modèles s'ouvrent sur le dessus et se glissent sous le bureau. Vérifiez la hauteur et la présence d'une poignée porte-documents." },
        { q: "Faut-il l'interdire en préparation scolaire ?", a: "Renseignez-vous auprès de l'école : certains établissements les autorisent seulement à partir du primaire avancé." },
      ],
      ar: [
        { q: "عجلتان أم أربع، ماذا نختار؟", a: "أربع عجلات لثبات أكبر في الدرج، وعجلتان لوزن أخف. إنه خيار حقيقي حسب القسم والطريق." },
        { q: "هل تدخل الحقيبة بعجلات تحت المكتب؟", a: "كثير من النماذج تفتح من الأعلى وتُوضع تحت المكتب. تحققوا من الارتفاع ووجود مقبض جانبي." },
        { q: "هل يُمنع استعمالها في الروض؟", a: "استفسروا من المدرسة: بعض المؤسسات لا تسمح بها إلا من الصفوف المتقدمة." },
      ],
    },
    fr: {
      title: "Cartable à roulettes : lesquels choisir sans souci en classe",
      excerpt:
        "Deux ou quatre roues, rangement sous le bureau, poids, poignée : le guide pour un cartable à roulettes réellement pratique.",
      body: [
        { type: "p", text: "Le cartable à roulettes séduit les enfants qui portent beaucoup de livres, mais tout dépend du modèle : un mauvais choix devient vite un cartable impossible à ranger et fragile dans les escaliers." },
        { type: "h2", text: "La capacité et le poids à vide" },
        { type: "ul", items: ["20 à 30 litres pour le primaire et le collège", "Moins de 2,5 kg à vide pour rester manipulable", "Châssis rigide qui ne déforme pas le sac", "Tiroir ou rabat postal pour les cahiers"] },
        { type: "h2", text: "Deux roues ou quatre roues ?" },
        { type: "p", text: "Quatre roues : plus stables dans les marches, idéales à l'école. Deux roues : plus légères et silencieuses, faciles à tracter. Choisissez surtout des roues larges et silencieuses, avec une poignée télescopique au bon niveau." },
        { type: "h2", text: "Pour une salle de classe sans conflit" },
        { type: "ul", items: ["Modèle avec ouverture par le haut qui se range sous le bureau", "Poignée porte-documents pour le porter à la main", "Rails de tirage discrète, moins de bruit pendant la classe", "Poche avant pour la gourde et la trousse"] },
        { type: "quote", text: "Un bon cartable à roulettes se tient sur un plan incliné sans glisser et reste stable même rempli." },
        { type: "p", text: "Pour le bon format selon le niveau, relisez notre guide pour choisir un cartable selon la classe. Tous les modèles à roulettes de la collection Cartables à roulettes ont été testés pour la stabilité dans le coffre et sous le bureau." },
      ],
    },
    ar: {
      title: "الحقيبة بعجلات: أيها تختارون دون مشاكل في القسم",
      excerpt:
        "عجلتان أم أربع، وضعها تحت المكتب، الوزن، المقبض: دليل لحقيبة بعجلات عملية فعلاً.",
      body: [
        { type: "p", text: "تغري الحقيبة بعجلات الأطفال الذين يحملون كتباً كثيرة، لكن كل شيء يعتمد على النموذج: الخيار السيئ يصير سريعاً حقيبة صعبة الترتيب وهشة في السلالم." },
        { type: "h2", text: "السعة والوزن الفارغ" },
        { type: "ul", items: ["20 إلى 30 لتراً للابتدائي والإعدادي", "أقل من 2.5 كغ فارغة لتُحمل بسهولة", "هيكل صلب لا يشوه الحقيبة", "درج داخلي للملفات"] },
        { type: "h2", text: "عجلتان أم أربع عجلات؟" },
        { type: "p", text: "أربع عجلات: أكثر ثباتاً في الدرج، مثالية للمدرسة. عجلتان: أخف وأهدأ، سهلة السحب. اختاروا خصوصاً عجلات عريضة وهادئة ومقبضاً تلسكوبياً بالطول المناسب." },
        { type: "h2", text: "من أجل قسم بلا صراع" },
        { type: "ul", items: ["نموذج بفتح من الأعلى يوضع تحت المكتب", "مقبض جانبي لحملها باليد", "عجلات هادئة تقل الضجة أثناء الدرس", "جيب أمامي للقارورة والمقلمة"] },
        { type: "quote", text: "الحقيبة الجيدة بعجلات تقف على سطح مائل دون انزلاق وتبقى ثابتة حتى ممتلئة." },
        { type: "p", text: "للقياس المناسب حسب المستوى، أعدوا قراءة دليلنا لاختيار الحقيبة حسب القسم. كل موديلات فئة الحقائب بعجلات خضعت لاختبارات الثبات في السيارة وتحت المكتب." },
      ],
    },
  },
  {
    slug: "sac-dos-universitaire",
    rubrique: "sacs-a-dos",
    date: "2026-08-23",
    readTime: 4,
    faq: {
      fr: [
        { q: "Quelle capacité pour un sac d'étudiant ?", a: "20 à 30 litres, avec un compartiment ordinateur séparé. Assez pour les cours, la bibliothèque et l'ordinateur." },
        { q: "Faut-il un compartiment ordinateur dans le sac d'étudiant ?", a: "Oui, dès la première année : l'ordinateur voyage chaque jour entre le domicile et la fac, il faut un fond renforcé et une poche dédiée." },
      ],
      ar: [
        { q: "ما السعة المناسبة لحقيبة الجامعة؟", a: "20 إلى 30 لتراً، مع جيب منفصل للحاسوب. تكفي للدروس والمكتبة والحاسوب." },
        { q: "هل يتطلب الأمر جيب حاسوب في حقيبة الطالب؟", a: "نعم من السنة الأولى: يسافر الحاسوب كل يوم بين البيت والجامعة، فيجب أسفل مقوّى وجيب مخصص." },
      ],
    },
    fr: {
      title: "Le sac à dos d'étudiant : capacité, ordinateur et organisation",
      excerpt:
        "Cours, bibliothèque, ordinateur portable et cahiers : la configuration idéale d'un sac pour la fac, pas trop grand mais bien pensé.",
      body: [
        { type: "p", text: "En études supérieures, le sac à dos accompagne chaque trajet : cours, travail en groupe, bibliothèque, parfois même le petit boulot. Il doit être assez organisé pour tout retrouver sans vider entièrement le sac." },
        { type: "h2", text: "La capacité idéale : 20 à 30 litres" },
        { type: "p", text: "Un sac trop grand pèse inutilement dans les couloirs, un sac trop petit force à tout transporter à la main. 20 à 30 litres avec un compartiment ordinateur séparé couvre 90 % des journées d'étudiant." },
        { type: "h2", text: "Protéger l'ordinateur et les documents" },
        { type: "ul", items: ["Compartiment ordinateur rembourré jusqu'à 15,6 pouces", "Fond surélevé qui amortit les chocs", "Poche documents à zip à l'avant", "Pochette protège-câble et chargeur"] },
        { type: "h2", text: "Les détails utiles chaque jour" },
        { type: "ul", items: ["Port USB pour charger son téléphone en route", "Poche bouteille et poche à gourde latérale", "Trousse ou organiseur suspendu", "Bretelles ergonomiques et dos aéré pour les longues marches"] },
        { type: "quote", text: "Un bon sac d'étudiant se vide en 10 secondes : tout a sa place, de la carte à l'ordinateur." },
        { type: "p", text: "Si vous hésitez encore entre sacoche et sac à dos, notre comparatif vous aidera à trancher. Et pour les bases du choix, lisez le guide des sacs à dos et parcourez la catégorie Sacs à dos." },
      ],
    },
    ar: {
      title: "حقيبة ظهر الطالب: السعة والحاسوب والتنظيم",
      excerpt:
        "دروس، مكتبة، حاسوب محمول ودفاتر: التشكيل المثالي لحقيبة الجامعة، ليست كبيرة جداً لكنها محكمة التفكير.",
      body: [
        { type: "p", text: "في التعليم العالي، ترافق حقيبة الظهر كل تنقل: دروس، عمل جماعي، مكتبة، وأحياناً عمل صغير. يجب أن تكون منظمة بما يكفي للعثور على كل شيء دون تفريغها كاملة." },
        { type: "h2", text: "السعة المثالية: 20 إلى 30 لتراً" },
        { type: "p", text: "الحقيبة الكبيرة جداً أثقل في الممرات، والصغيرة جداً تجبركم على حمل كل شيء باليد. إن 20 إلى 30 لتراً مع جيب حاسوب منفصل تغطي 90% من أيام الطالب." },
        { type: "h2", text: "حماية الحاسوب والمستندات" },
        { type: "ul", items: ["جيب حاسوب مبطن حتى 15.6 بوصة", "أسفل مرتفع يمتص الصدمات", "جيب مستندات بسحاب في الأمام", "جيب للكابل والشاحن"] },
        { type: "h2", text: "تفاصيل مفيدة كل يوم" },
        { type: "ul", items: ["منفذ USB لشحن الهاتف أثناء الطريق", "جيب جانبي للقارورة", "مقلمة أو منظم داخلي", "أشرطة مريحة وظهر مهوّى للمشي الطويل"] },
        { type: "quote", text: "حقيبة طالب جيدة تُفرغ في 10 ثوانٍ: كل شيء في مكانه، من البطاقة إلى الحاسوب." },
        { type: "p", text: "إن كنتم ما زلتم تترددون بين الحقيبة الجانبية وحقيبة الظهر، فمقارنتنا ستساعدكم على الحسم. ولأساسيات الاختيار، اقرأوا دليل حقائب الظهر وتصفحوا فئة حقائب الظهر." },
      ],
    },
  },
  {
    slug: "sacoche-ou-sac-dos-pc",
    rubrique: "sacs-ordinateur",
    date: "2026-08-24",
    readTime: 3,
    faq: {
      fr: [
        { q: "Sacoche ou sac à dos pour un trajet en voiture ?", a: "La sacoche suffit largement et protège mieux l'ordinateur des vibrations du coffre. Le sac à dos reste préférable pour les trajets à pied ou en transport." },
        { q: "Peut-on mettre une sacoche dans un sac à dos ?", a: "Oui, une sacoche fine à poignée renforcée se glisse dans un compartiment dédié et complète le sac à dos des jours de grand transport." },
      ],
      ar: [
        { q: "الحقيبة الجانبية أم حقيبة الظهر للتنقل بالسيارة؟", a: "الحقيبة الجانبية تكفي تماماً وتحمي الحاسوب من اهتزازات الصندوق. أما حقيبة الظهر فتبقى أفضل للمشي أو النقل العمومي." },
        { q: "هل يمكن وضع الحقيبة الجانبية داخل حقيبة الظهر؟", a: "نعم، حقيبة جانبية رفيعة بمقبض مقوّى تُوضع في جيب مخصص وتكمل حقيبة الظهر في أيام التنقل الكبير." },
      ],
    },
    fr: {
      title: "Sacoche ou sac à dos pour votre ordinateur ? Le match",
      excerpt:
        "Accès rapide et sobriété contre confort et capacité : comment choisir entre sacoche et sac à dos dédié à votre portable.",
      body: [
        { type: "p", text: "Deux écoles s'affrontent pour transporter un ordinateur portable : la sacoche, rapide et élégante, et le sac à dos, confortable et spacieux. Le bon choix dépend de votre trajet et de ce que vous transportez en plus." },
        { type: "h2", text: "Sacoche : élégance et accès rapide" },
        { type: "ul", items: ["Ouverture immédiate pour les aéroports et contrôles", "Format fin qui passe sous le siège ou dans une mallette", "Poignée renforcée et sangle amovible", "Protection ciblée du gabarit réel de l'ordinateur"] },
        { type: "h2", text: "Sac à dos : confort et volume" },
        { type: "ul", items: ["Charge répartie sur les deux épaules", "Place pour documents, chargeur, bouteille et petite affaire", "Compartiment ordinateur rembourré et surélevé", "Dos ergonomique pour une marche en ville"] },
        { type: "h2", text: "Comment trancher" },
        { type: "p", text: "Si vous marchez plus de 15 minutes ou transportez souvent des documents en plus, le sac à dos s'impose. Si l'ordinateur est votre seule vraie charge et que vous cherchez la sobriété, la sacoche est parfaite pour le travail et les rendez-vous." },
        { type: "quote", text: "Le bon contenant protège l'ordinateur, mais c'est le bon usage qui le préserve : toujours poser le sac du côté du corps." },
        { type: "p", text: "Dans les deux cas, vérifiez la protection en trois zones détaillée dans notre article pour choisir un sac ordinateur. Les modèles des catégories Sacs ordinateur et Sacs à dos couvrent tous les gabarits." },
      ],
    },
    ar: {
      title: "الحقيبة الجانبية أم حقيبة الظهر لحاسوبك؟ المقارنة",
      excerpt:
        "وصول سريع وأناقة أم راحة وسعة: كيف نختار بين الحقيبة الجانبية وحقيبة الظهر المخصصة لحاسوبك المحمول.",
      body: [
        { type: "p", text: "مدرستان تتنافسان لنقل الحاسوب المحمول: الجانبية السريعة الأنيقة، وحقيبة الظهر المريحة الواسعة. الخيار الصحيح يعتمد على طريقك وما تحمله أيضاً." },
        { type: "h2", text: "الحقيبة الجانبية: أناقة ووصول سريع" },
        { type: "ul", items: ["فتح فوري للمطارات والمراقبة", "شكل رفيع يمر تحت المقعد أو داخل حقيبة", "مقبض مقوّى وحزام قابل للفصل", "حماية موجهة للمقاس الحقيقي للحاسوب"] },
        { type: "h2", text: "حقيبة الظهر: راحة وسعة" },
        { type: "ul", items: ["توزيع الحمل على الكتفين", "مكان للمستندات والشاحن والقارورة", "جيب حاسوب مبطن ومرتفع", "ظهر مريح للتنقل في المدينة"] },
        { type: "h2", text: "كيف نحسم" },
        { type: "p", text: "إن مشيتم أكثر من 15 دقيقة أو حملتم أحياناً وثائق إضافية، فحقيبة الظهر هي الخيار. أما إن كان الحاسوب حِملَك الوحيد وتبحثون عن الهدوء، فالحقيبة الجانبية مثالية للعمل والمواعيد." },
        { type: "quote", text: "الحاوية الجيدة تحمي الحاسوب، لكن الاستعمال الجيد يحافظ عليه: ضعوا الحقيبة دائماً بجانب الجسم." },
        { type: "p", text: "في الحالتين، تحققوا من الحماية في ثلاث مناطق كما شرحنا في مقال اختيار حقيبة الحاسوب. نماذج فئتي حقائب الحواسيب وحقائب الظهر تغطي كل المقاسات." },
      ],
    },
  },
  {
    slug: "bagage-cabine-avion",
    rubrique: "sacs-voyage",
    date: "2026-08-25",
    readTime: 4,
    faq: {
      fr: [
        { q: "Quelles dimensions pour un bagage en cabine ?", a: "55 x 40 x 20 cm en standard, 40 x 30 x 20 cm sur la plupart des compagnies low-cost. Vérifiez toujours votre billet." },
        { q: "Peut-on prendre un sac à dos de 30 litres en cabine ?", a: "Oui s'il respecte les dimensions totales. Un sac souple se comprime pour passer dans le gabarit de contrôle." },
      ],
      ar: [
        { q: "ما مقاسات حقيبة المقصورة؟", a: "55×40×20 سم عادة، و40×30×20 سم لدى معظم شركات الطيران منخفضة التكلفة. تحققوا دائماً من تذكرتكم." },
        { q: "هل يمكن أخذ حقيبة ظهر بسعة 30 لتراً إلى المقصورة؟", a: "نعم إذا التزمت بالمقاسات الكلية. الحقيبة المرنة تُضغط لتمريرها في قوالب المراقبة." },
      ],
    },
    fr: {
      title: "Bagage en cabine 2026 : dimensions, poids et organisation",
      excerpt:
        "55 x 40 x 20 ou 40 x 30 x 20 ? Liquides, électronique, pesée : tout ce qu'il faut savoir avant d'embarquer avec son sac de voyage.",
      body: [
        { type: "p", text: "Le bagage en cabine fait gagner un temps précieux : pas d'attente au tapis, et une place réservée juste au-dessus de vous. Encore faut-il un sac aux bonnes dimensions et bien organisé." },
        { type: "h2", text: "Les dimensions qui passent partout" },
        { type: "ul", items: ["Standard : 55 x 40 x 20 cm, poids libre ou 10 kg selon la compagnie", "Low-cost : souvent 40 x 30 x 20 cm, plus strict", "Sac souple : comprimable dans le gabarit de contrôle", "Toujours vérifier les conditions de son billet PDF"] },
        { type: "h2", text: "Organiser le sac de cabine" },
        { type: "ul", items: ["Liquides en contenants de 100 ml dans un sachet transparent", "Électronique au-dessus : ordinateur et tablettes accessibles", "Médicaments et documents en poche séparée", "Chargeur et câbles dans une pochette unique"] },
        { type: "h2", text: "Éviter la pesée surprise" },
        { type: "p", text: "Pesez votre sac avec des vêtements roulés et des affaires réparties, jamais concentrées dans une seule poche. Un sac muni d'une sangle de poitrine soulage aussi les épaules pendant l'attente à l'embarquement." },
        { type: "quote", text: "Un sac de cabine bien rangé se fouille en 30 secondes et s'embarque sans discussion." },
        { type: "p", text: "Pour structurer les 3 à 7 jours suivants dans un sac plus grand, consultez notre article sur le sac de voyage et week-end, et découvrez les modèles de la catégorie Sacs de voyage." },
      ],
    },
    ar: {
      title: "حقيبة المقصورة 2026: المقاسات والوزن والتنظيم",
      excerpt:
        "55×40×20 أم 40×30×20؟ سوائل، إلكترونيات، وزن: كل ما يجب معرفته قبل الصعود بحقيبة السفر.",
      body: [
        { type: "p", text: "توفر حقيبة المقصورة وقتاً ثميناً: لا انتظار عند الأحزمة، ومكان مضمون فوقكم. شرط أن تكون الحقيبة بالمقاسات الصحيحة ومنظمة جيداً." },
        { type: "h2", text: "المقاسات التي تمر في كل مكان" },
        { type: "ul", items: ["قياسي: 55×40×20 سم، وزن حر أو 10 كغ حسب الشركة", "منخفضة التكلفة: غالباً 40×30×20 سم وأشد صرامة", "حقيبة مرنة: تُضغط في قوالب المراقبة", "تحققوا دائماً من شروط تذكرتكم"] },
        { type: "h2", text: "تنظيم حقيبة المقصورة" },
        { type: "ul", items: ["سوائل بعبوات 100 مل في كيس شفاف", "إلكترونيات في الأعلى: حاسوب وأجهزة لوحية متاحة", "أدوية ووثائق في جيب منفصل", "شاحن وكابلات في جيب واحد"] },
        { type: "h2", text: "تجنب مفاجأة الوزن" },
        { type: "p", text: "زنوا حقيبتكم بملابس ملفوفة وأغراض موزعة، وليس مركزة في جيب واحد. كما أن حزام الصدر يريح الكتفين أثناء انتظار الصعود." },
        { type: "quote", text: "حقيبة مقصورة منظّمة تُفتح في 30 ثانية وتُصعد دون نقاش." },
        { type: "p", text: "لتنظيم الأيام الثلاثة إلى السبعة التالية في حقيبة أكبر، اقرأوا مقالنا عن حقيبة السفر وعطلة نهاية الأسبوع، واكتشفوا نماذج فئة حقائب السفر." },
      ],
    },
  },
  {
    slug: "etiquettes-affaires-scolaires",
    rubrique: "accessoires",
    date: "2026-08-26",
    readTime: 3,
    faq: {
      fr: [
        { q: "Quelles affaires marquer à l'école ?", a: "Cartable, trousse, gourde, blouse, vêtements de sport, cahiers principales et matériel qui se ressemble. Le marquage évite les échanges malheureux." },
        { q: "Étiquettes autocollantes ou marquage permanent ?", a: "L'autocollant suffit pour les affaires personnelles. Le marquage permanent (texte ou motif brodé) reste pour 10 ans sur les cartables et blouses." },
      ],
      ar: [
        { q: "ما الأغراض التي تُعلَّم في المدرسة؟", a: "حقيبة، مقلمة، قارورة، رداء، ملابس رياضة، دفاتر ومواد متشابهة. التعلّم يمنع التبادلات السيئة." },
        { q: "ملصقات أم تعلِيم دائم؟", a: "تكفي الملصقات للأغراض الشخصية. أما التعليم الدائم فيبقى 10 سنوات على الحقائب والأروقة." },
      ],
    },
    fr: {
      title: "Étiquettes et marquage : ne plus perdre ses affaires à l'école",
      excerpt:
        "Cartable, trousse, gourde, blouse : les repères de marquage qui évitent les échanges malheureux dès la première semaine.",
      body: [
        { type: "p", text: "La première semaine de classe, le cartable se ressemble, la trousse aussi. Sans marquage, les échanges malheureux sont garantis. Quelques repères simples suffisent pour tout retrouver." },
        { type: "h2", text: "Les repères à marquer en priorité" },
        { type: "ul", items: ["Cartable : prénom sur le panneau dorsale, invisible sous la housse", "Trousse : étiquette à l'intérieur ou sur la fermeture", "Gourde et boîte à goûter : marquage lavable", "Blouse et vêtements de sport : marquage permanent sur la couture"] },
        { type: "h2", text: "Autocollants, feutre ou motif brodé ?" },
        { type: "p", text: "Le marquage autocollant est rapide pour les affaires personnelles. Le marquage permanent (feutre textile ou motif brodé) tient des années sur les cartables et les blouses. Pour les cahiers, écrivez toujours dessus le prénom et la classe en première page." },
        { type: "h2", text: "L'organisation qui évite tout" },
        { type: "ul", items: ["Un seul lieu à la maison pour renouveler les étiquettes", "Un code couleur par enfant ou par matière", "Refaire les étiquettes effacées toutes les vacances", "Un inventaire des affaires marquées au début de chaque année"] },
        { type: "quote", text: "Les affaires marquées reviennent ; les autres se retrouvent souvent dans la caisse des objets perdus." },
        { type: "p", text: "Ce marquage fait partie de la panoplie de rentrée : complétez avec le contenu de la trousse idéale dans notre article sur les trousses garnies, et retrouvez tout l'équipement dans la catégorie Trousses et accessoires." },
      ],
    },
    ar: {
      title: "الملصقات والتعلِيم: لا تفقدوا أغراضكم بعد اليوم",
      excerpt:
        "حقيبة، مقلمة، قارورة، رداء: علامات التعلِيم التي تمنع التبادلات السيئة منذ الأسبوع الأول.",
      body: [
        { type: "p", text: "في الأسبوع الأول من الدراسة تتشابه الحقائب وتتشابه المقالم. دون تعلِيم، التبادلات الحزينة مضمونة. علامات بسيطة تكفي لإيجاد كل شيء." },
        { type: "h2", text: "العلامات ذات الأولوية" },
        { type: "ul", items: ["حقيبة الظهر: الاسم على اللوحة الخلفية", "مقلمة: ملصق من الداخل أو على السحاب", "قارورة وعلبة وجبات: تعليم قابل للغسل", "رداء وملابس رياضة: تعليم دائم على الخياطة"] },
        { type: "h2", text: "ملصقات أم قلم أم تطريز؟" },
        { type: "p", text: "المُلصق سريع للأغراض الشخصية. أما التعليم الدائم (قلم قماش أو تطريز) فيبقى سنوات على الحقائب والأروقة. وبالنسبة للدفاتر، اكتبوا الاسم والقسم في الصفحة الأولى." },
        { type: "h2", text: "التنظيم الذي يمنع كل شيء" },
        { type: "ul", items: ["مكان واحد في البيت لتجديد الملصقات", "لون لكل طفل أو لكل مادة", "تجديد الملصقات المتلاشية كل عطلة", "جرد الأغراض المعلَّمة في بداية كل سنة"] },
        { type: "quote", text: "الأغراض المعلَّمة تعود؛ وغيرها كثيراً ما ينتهي في صندوق الأغراض المفقودة." },
        { type: "p", text: "هذا التعلِيم جزء من عدة الدخول: أكملوها بمحتوى المقلمة المثالية في مقالنا عن المقالم الكاملة، وجدوا كل المعدات في فئة المقالم والمستلزمات." },
      ],
    },
  },
  {
    slug: "liste-fournitures-rentree-maroc",
    rubrique: "guides",
    date: "2026-08-27",
    readTime: 5,
    faq: {
      fr: [
        { q: "Quand préparer la liste de fournitures ?", a: "Entre mi-août et début septembre : les tarifs sont au plus bas et les rayons complets. Évitez la semaine précédant la rentrée." },
        { q: "Combien coûte le cartable moyen au Maroc ?", a: "Selon la qualité : 200 à 350 DH pour les cartables classiques, davantage pour les marques et les modèles à roulettes robustes." },
      ],
      ar: [
        { q: "متى نحضّر قائمة اللوازم؟", a: "بين منتصف غشت وبداية شتنبر: الأسعار في أدناها والمخازن ممتلئة. تجنبوا الأسبوع الذي يسبق الدخول." },
        { q: "كم يكلف متوسط الحقيبة المدرسية في المغرب؟", a: "حسب الجودة: 200 إلى 350 درهماً للحقائب الكلاسيكية، وأكثر للعلامات التجارية وموديلات العجلات القوية." },
      ],
    },
    fr: {
      title: "Fournitures scolaires au Maroc : la liste complète par niveau",
      excerpt:
        "Primaire, collège, lycée : l'inventaire raisonnable des fournitures, du cartable à la trousse, avec les bons réflexes pour ne pas surdépenser.",
      body: [
        { type: "p", text: "Chaque niveau scolaire a ses exigences, et la liste de fournitures officielle s'allonge chaque année. Voici l'inventaire raisonnable, niveau par niveau, pour acheter juste sans céder au superflu." },
        { type: "h2", text: "Primaire : le nécessaire sans excès" },
        { type: "ul", items: ["Cartable léger 15 à 20 litres adapté à la taille de l'enfant", "Trousse simple : crayons, gomme, règle, ciseaux à bouts ronds, colle", "Protège-cahiers et cahiers quotidiens selon la liste de l'école", "Gourde isotherme et boîte à goûter", "Étiquettes et marquage des affaires"] },
        { type: "h2", text: "Collège : le cartable se complète" },
        { type: "ul", items: ["Cartable ou sac à dos 25 à 30 litres, compartiment ordinateur", "Trousse à compartiments : surligneurs, feutres fins, correcteur", "Calculatrice scientifique à partir de la 4e", "Cahiers par matière et intercalaires", "Sac de sport ou poche dédiée"] },
        { type: "h2", text: "Lycée et études supérieures" },
        { type: "ul", items: ["Sac à dos 20 à 30 litres avec compartiment PC renforcé", "Trousse professionnelle et pochette à documents", "Calculatrice conforme aux règles de l'examen", "Ordinateur portable et housse de protection", "Organiseur ou trousse à câbles"] },
        { type: "h2", text: "Les bons réflexes d'achat" },
        { type: "p", text: "Achetez entre mi-août et début septembre : seul le cartable mérite d'être neuf chaque année. Réutilisez gommes, règles, ciseaux et trousses encore en bon état pour maîtriser le budget fournitures." },
        { type: "quote", text: "La fourniture parfaite : pas la plus chère, mais celle qui sert chaque jour et dure jusqu'en juillet." },
        { type: "p", text: "Pour compléter la trousse idéale, lisez notre article sur les trousses garnies, et découvrez les couleurs de la saison dans notre article sur les tendances sacs 2026 avant de commander votre cartable." },
      ],
    },
    ar: {
      title: "اللوازم المدرسية في المغرب: القائمة الكاملة حسب المستوى",
      excerpt:
        "ابتدائي، إعدادي، ثانوي: جرد معقول من الحقيبة إلى المقلمة، مع العادات الصحيحة لتجنب الإسراف.",
      body: [
        { type: "p", text: "لكل مستوى دراسي متطلباته، وتطول القائمة الرسمية كل سنة. هذه قائمة معقولة حسب المستوى، لنشتري المقصود دون إسراف." },
        { type: "h2", text: "الابتدائي: الضروري دون إفراط" },
        { type: "ul", items: ["حقيبة خفيفة من 15 إلى 20 لتراً تناسب حجم الطفل", "مقلمة بسيطة: أقلام، ممحاة، مسطرة، مقص بأطراف دائرية، صمغ", "غلف دفاتر ودفاتر حسب قائمة المدرسة", "قارورة حرارية وعلبة وجبات", "ملصقات وعلامات للأغراض"] },
        { type: "h2", text: "الإعدادي: تكتمل الحقيبة" },
        { type: "ul", items: ["حقيبة من 25 إلى 30 لتراً مع جيب حاسوب", "مقلمة بأقسام: تظليل، أقلام رفيعة، مصحح", "آلة حاسبة منذ السنة الرابعة", "دفاتر لكل مادة وفواصل", "حقيبة رياضة أو جيب مخصص"] },
        { type: "h2", text: "الثانوي والتعليم العالي" },
        { type: "ul", items: ["حقيبة من 20 إلى 30 لتراً مع جيب حاسوب مقوّى", "مقلمة مهنية وجيب مستندات", "آلة حاسبة حسب قواعد الامتحان", "حاسوب محمول وغطاء حماية", "منظم أو كيس كابلات"] },
        { type: "h2", text: "عادات شراء صحيحة" },
        { type: "p", text: "اشتروا بين منتصف غشت وبداية شتنبر: فقط الحقيبة تستحق أن تكون جديدة كل سنة. أعيدوا استعمال الممحاة والمسطرة والمقص والمقلمات السليمة للتحكم في الميزانية." },
        { type: "quote", text: "المادة المثالية: ليست الأغلى، بل التي تُستعمل كل يوم وتدوم حتى يوليوز." },
        { type: "p", text: "لإكمال المقلمة المثالية، اقرأوا مقالنا عن المقالم الكاملة، واكتشفوا ألوان الموسم في مقالنا عن صيحات الحقائب 2026 قبل طلب حقيبتكم." },
      ],
    },
  },
  {
    slug: "cartable-cp-premiere-annee",
    rubrique: "cartables",
    date: "2026-08-28",
    readTime: 4,
    faq: {
      fr: [
        { q: "Quel cartable pour le CP ?", a: "Un modèle de 15 à 20 litres, léger à vide, à dos renforcé et avec une poche poitrine : la taille à partir de laquelle le cartable devient scolaire." },
        { q: "Faut-il réutiliser le cartable de maternelle en CP ?", a: "Si le volume est suffisant et le dos en bon état, oui. Sinon, priorité à un modèle adapté aux cahiers du CP." },
      ],
      ar: [
        { q: "أي حقيبة للسنة الأولى؟", a: "نموذج من 15 إلى 20 لتراً، خفيفاً فارغاً، بظهر مقوّى وجيب أمامي: الحجم الذي تصبح فيه الحقيبة مدرسية." },
        { q: "هل نعيد استعمال حقيبة الروض في السنة الأولى؟", a: "إن كانت السعة كافية والظهر بحالة جيدة، نعم. وإلا فالأولوية لنموذج يناسب دفاتر السنة الأولى." },
      ],
    },
    fr: {
      title: "Cartable de CP : le grand saut de la maternelle au cours préparatoire",
      excerpt:
        "Premiers cahiers, premières leçons, premier vrai cartable : les critères pour accompagner l'entrée au CP sans surcharger le dos.",
      body: [
        { type: "p", text: "Le CP marque le passage à la vie scolaire : l'enfant rapporte des cahiers, un livret, parfois un livre. C'est le moment de passer du petit cartable de maternelle à un vrai modèle, sans pour autant le surcharger." },
        { type: "h2", text: "Le bon volume au CP" },
        { type: "ul", items: ["15 à 20 litres, le format officiel du cours préparatoire", "Moins d'1 kg à vide", "Poche poitrine pour répartir le poids", "Ouverture large pour le cartable qui se pose par terre"] },
        { type: "h2", text: "Ce qu'il transporte réellement" },
        { type: "p", text: "Au CP, la consigne d'école est souvent claire : un cahier de liaison, des cahiers du jour, quelques fichiers. Le sac reste léger si on choisit un modèle sans ardoise, sans table d'appoint ni farde à roulettes inutile." },
        { type: "h2", text: "Les détails qui font la différence" },
        { type: "ul", items: ["Dos et bretelles rembourrés dès ce niveau", "Fermeture facile pour un enfant de 6 ans", "Fond rigide et angles protégés", "Sangle de poitrine pour éviter les bretelles qui glissent"] },
        { type: "quote", text: "En CP, le cartable se choisit comme une paire de chaussures : sur la bonne taille, jamais avec une année d'avance." },
        { type: "p", text: "Tous les niveaux du primaire suivent la même logique décrite dans notre guide pour choisir un cartable selon la classe. Les modèles adaptés sont dans la catégorie Cartables classiques." },
      ],
    },
    ar: {
      title: "حقيبة السنة الأولى: القفزة الكبرى من الروض إلى القسم الأول",
      excerpt:
        "دفاتر أولى، دروس أولى، حقيبة حقيقية أولى: معايير مرافقة الدخول إلى السنة الأولى دون إثقال الظهر.",
      body: [
        { type: "p", text: "تعلن السنة الأولى الانتقال إلى الحياة المدرسية: يعيد الطفل دفاتر وسجل تتبع وأحياناً كتاباً. هذا هو الوقت المناسب للانتقال من حقيبة الروض الصغيرة إلى نموذج حقيقي، دون إثقالها." },
        { type: "h2", text: "الحجم المناسب في السنة الأولى" },
        { type: "ul", items: ["15 إلى 20 لتراً، القياس الرسمي للسنة الأولى", "أقل من 1 كغ فارغة", "جيب أمامي لتوزيع الوزن", "فتحة واسعة لأن الحقيبة توضع أرضاً"] },
        { type: "h2", text: "ما الذي يحمله فعلاً" },
        { type: "p", text: "في السنة الأولى تكون تعليمات المدرسة واضحة: دفتر تواصل، دفاتر يومية، وبعض الملفات. تبقى الحقيبة خفيفة إذا اخترنا نموذجاً دون سبورة أو مائدة مساعدة أو حقيبة عجلات لا داعي لها." },
        { type: "h2", text: "تفاصيل تصنع الفرق" },
        { type: "ul", items: ["ظهر وأشرطة مبطنة منذ هذا المستوى", "سحاب سهل لطفل في 6 سنوات", "أسفل صلب وزوايا محمية", "حزام صدر يمنع انزلاق الأشرطة"] },
        { type: "quote", text: "في السنة الأولى، تُختار الحقيبة كحذاء: بالقياس الصحيح، دون سنة تقدماً." },
        { type: "p", text: "تتبع مستويات الابتدائي كلها نفس المنطق في دليلنا لاختيار الحقيبة حسب القسم. النماذج المناسبة موجودة في فئة الحقائب الكلاسيكية." },
      ],
    },
  },
  {
    slug: "sac-a-dos-ou-cartable-primaire",
    rubrique: "cartables",
    date: "2026-08-28",
    readTime: 4,
    faq: {
      fr: [
        { q: "Sac à dos ou cartable en primaire ?", a: "Le sac à dos devient préférable dès qu'on transporte plus de cahiers, vers 8-9 ans. Le cartable classique reste une alternative à poignée pour les plus jeunes." },
        { q: "Le cartable à roulettes remplace-t-il le sac à dos ?", a: "Non, il complète : idéal pour les trajets lourds, il doit rester stable dans les escaliers et sous le bureau." },
      ],
      ar: [
        { q: "حقيبة ظهر أم حقيبة مدرسية في الابتدائي؟", a: "حقيبة الظهر هي المفضلة منذ أن ننقل دفاتر أكثر، نحو 8-9 سنوات. أما الحقيبة الكلاسيكية بمقبض فتبقى خياراً للصغار." },
        { q: "هل تعوّض الحقيبة بعجلات حقيبة الظهر؟", a: "لا، بل تكملها: مثالية للطريق الثقيل، شرط أن تبقى ثابتة في الدرج وتحت المكتب." },
      ],
    },
    fr: {
      title: "Sac à dos ou cartable en primaire : que choisir ?",
      excerpt:
        "Cartable à poignée, sac à dos ou modèle à roulettes : le bon format selon l'âge de l'enfant et le nombre de cahiers transportés.",
      body: [
        { type: "p", text: "La question revient à chaque rentrée du primaire : cartable classique, sac à dos ou roulettes ? Il n'y a pas de bonne réponse universelle, mais une règle simple fondée sur l'âge et le volume transporté." },
        { type: "h2", text: "Le cartable à poignée : pour les plus jeunes" },
        { type: "p", text: "Jusqu'à 7-8 ans, l'enfant porte peu d'affaires et a besoin d'un format qu'il identifie facilement. Le cartable classique avec poignée et ouverture cloche convient, à condition de rester très léger." },
        { type: "h2", text: "Le sac à dos : le standard du primaire" },
        { type: "ul", items: ["Charge répartie sur les deux épaules", "Dès que les cahiers s'accumulent vers 8-9 ans", "Dos et bretelles rembourrés indispensables", "Modèles 20-25 litres pour rester maniable"] },
        { type: "h2", text: "Les roulettes pour cas particuliers" },
        { type: "p", text: "Le cartable à roulettes est utile quand l'école est loin du domicile et le chemin adapté. Pensez aux escaliers et au rangement sous le bureau, détaillés dans notre guide des cartables à roulettes." },
        { type: "quote", text: "Le meilleur format est celui que l'enfant porte seul, sans aide et sans douleur, du portail à la classe." },
        { type: "p", text: "Pour choisir la bonne capacité et la bonne taille selon l'âge, consultez notre tableau par âge et les modèles des catégories Cartables classiques, Sacs à dos et Cartables à roulettes." },
      ],
    },
    ar: {
      title: "حقيبة ظهر أم حقيبة مدرسية في الابتدائي: ماذا نختار؟",
      excerpt:
        "حقيبة بمقبض، حقيبة ظهر أم حقيبة بعجلات: المنسق المناسب حسب سن الطفل وعدد الدفاتر.",
      body: [
        { type: "p", text: "يعود السؤال في كل دخول مدرسي بالابتدائي: حقيبة كلاسيكية، حقيبة ظهر أم عجلات؟ لا جواب صحيح واحد، لكن قاعدة بسيطة حسب السن والحجم المنقول." },
        { type: "h2", text: "الحقيبة بمقبض: للصغار" },
        { type: "p", text: "حتى 7-8 سنوات، يحمل الطفل قليلاً ويحتاج إلى شكل يميزه بسهولة. الحقيبة الكلاسيكية بمقبض وفتحة كاملة تناسب إذا بقيت خفيفة جداً." },
        { type: "h2", text: "حقيبة الظهر: المعيار في الابتدائي" },
        { type: "ul", items: ["توزيع الحمل على الكتفين", "منذ أن تتكدس الدفاتر نحو 8-9 سنوات", "ظهر وأشرطة مبطنة ضروريان", "نماذج 20-25 لتراً لتبقى سهلة الحمل"] },
        { type: "h2", text: "العجلات لحالات خاصة" },
        { type: "p", text: "الحقيبة بعجلات مفيدة حين تكون المدرسة بعيدة من البيت والطريق مناسباً. فكروا في السلالم والترتيب تحت المكتب كما في دليلنا عن الحقائب بعجلات." },
        { type: "quote", text: "أفضل شكل هو ما يحمله الطفل وحده، دون مساعدة ودون ألم، من البوابة إلى القسم." },
        { type: "p", text: "لاختيار السعة والحجم المناسبين حسب السن، راجعوا جدولنا حسب العمر ونماذج فئات الحقائب الكلاسيكية، حقائب الظهر والحقائب بعجلات." },
      ],
    },
  },
  {
    slug: "cartable-deperlant-pluie",
    rubrique: "cartables",
    date: "2026-08-29",
    readTime: 3,
    fr: {
      title: "Cartable imperméable et déperlant : protéger les cahiers les jours de pluie",
      excerpt:
        "Entre décembre et février, la pluie teste les cartables. Déperlance, housse, double fond : comment éviter les cahiers trempés.",
      body: [
        { type: "p", text: "Un cartable qui laisse passer l'eau, c'est une trousse mouillée, des livres abîmés et un enfant mécontent. Au Maroc, la pluie des mois d'hiver met vraiment les sacs à l'épreuve." },
        { type: "h2", text: "Déperlant ou imperméable ?" },
        { type: "ul", items: ["Déperlant : l'eau glisse sur le tissu, suffisant pour une averse", "Imperméable : résiste à une forte pluie prolongée", "Coutures thermosoudées pour une vraie étanchéité", "Fond renforcé qui ne s'imbibe pas quand on pose le sac"] },
        { type: "h2", text: "Les gestes simples pour tout protéger" },
        { type: "p", text: "Rangez les documents importants côté dos, utilisez une housse de pluie quand elle est prévue et séchez le cartable à l'air libre le soir. Le feutre textile déperlant en spray ravive aussi une vieille toile." },
        { type: "h2", text: "Que vérifier avant l'achat" },
        { type: "ul", items: ["Tissus techniques : Oxford 600 D, polyester enduit, coton déperlant", "Zips avec protection contre l'eau", "Fond doublé ou surélevé", "Poches latérales solides pour la bouteille"] },
        { type: "quote", text: "Le bon réflexe pluie : moins d'affaires dans le sac, et les plus précieuses toujours au centre, protégées par les côtés rembourrés." },
        { type: "p", text: "Les matières techniques sont aussi au cœur de nos tendances sacs 2026. Retrouvez les modèles déperlants dans les catégories Cartables classiques et Sacs à dos." },
      ],
    },
    ar: {
      title: "حقيبة مقاومة للماء: حماية الدفاتر في أيام المطر",
      excerpt:
        "بين دجنبر وفبراير، يمتحن المطر الحقائب. مقاومة الماء، غطاء، أسفل مزدوج: كيف تتفادون دفاتر مبتلة.",
      body: [
        { type: "p", text: "حقيبة تتسرب إليها المياه تعني مقلمة مبللة وكتباً تالفة وطفلاً غير راضٍ. في المغرب، يضع مطر الشتاء الحقائب فعلاً على المحك." },
        { type: "h2", text: "طارئ أم مقاوم للماء؟" },
        { type: "ul", items: ["طارئ: ينزلق الماء على القماش، يكفي لزخة مطر", "مقاوم: يصمد أمام مطر قوي طويل", "خياطة حرارية لإحكام حقيقي", "أسفل مقوّى لا يتشبع عند وضع الحقيبة"] },
        { type: "h2", text: "حركات بسيطة تحمي كل شيء" },
        { type: "p", text: "ضعوا الوثائق المهمة جهة الظهر، استعملوا غطاء المطر إن وُجد، وجففوا الحقيبة في الهواء مساءً. كما أن بخاخ القماش الطارد يجدّد قماشاً قديماً." },
        { type: "h2", text: "ما يجب التحقق منه قبل الشراء" },
        { type: "ul", items: ["خامات تقنية: أكسفورد 600 دنير، بوليستر مطلي، قطن طارد", "سحابات محمية من الماء", "أسفل مبطن أو مرتفع", "جيوب جانبية صلبة للقارورة"] },
        { type: "quote", text: "الاستعداد الصحيح للمطر: أغراض أقل في الحقيبة، والأثمن دائماً في المنتصف محمياً بالجوانب المبطنة." },
        { type: "p", text: "الخامات التقنية حاضرة أيضاً في صيحات الحقائب 2026. اطلعوا على نماذج مقاومة الماء في فئتي الحقائب الكلاسيكية وحقائب الظهر." },
      ],
    },
  },
  {
    slug: "choisir-taille-cartable-enfant",
    rubrique: "cartables",
    date: "2026-08-29",
    readTime: 4,
    fr: {
      title: "Quelle taille de cartable pour mon enfant ? Le tableau par âge",
      excerpt:
        "Hauteur, largeur, capacité : un tableau simple pour adapter le cartable à la silhouette de l'enfant, du primaire au lycée.",
      body: [
        { type: "p", text: "Un cartable trop grand face à un petit dos provoque des bascules et des douleurs ; un sac trop petit force à transporter des affaires à la main. Voici les repères pour chaque tranche d'âge." },
        { type: "h2", text: "Le tableau taille / capacité" },
        { type: "ul", items: ["5-7 ans (maternelle-CP) : 10-15 L, hauteur sac 35-40 cm", "8-10 ans (CE1-CM1) : 15-20 L, hauteur 40-45 cm", "11-12 ans (CM2-6e) : 20-25 L, hauteur 45-50 cm", "13 ans et plus : 25-32 L, hauteur 45-55 cm"] },
        { type: "h2", text: "La règle d'or : le cartable ne dépasse pas le torse" },
        { type: "p", text: "Posé sur le dos, le sac doit tenir entre les épaules et le haut des hanches. S'il dépasse la poitrine ou descend sous les fesses, changez de taille même si la capacité semble convenable." },
        { type: "h2", text: "Les réglages qui sauvent le dos" },
        { type: "ul", items: ["Bretelles réglables jusqu'au bon niveau", "Sangle de poitrine à la hauteur des aisselles", "Charge placée dans le bas du sac, jamais sur le dessus", "Poids total < 10 % du poids de l'enfant"] },
        { type: "quote", text: "La bonne taille se vérifie en un regard : le cartable suit le dos, ne le dépasse ni sur les côtés ni en hauteur." },
        { type: "p", text: "Pour affiner par niveau scolaire, relisez notre guide du cartable selon la classe ainsi que notre article sur le sac à dos d'enfant qui grandit." },
      ],
    },
    ar: {
      title: "ما حجم حقيبة طفلي المناسب؟ جدول حسب العمر",
      excerpt:
        "الطول والعرض والسعة: جدول بسيط لتكييف الحقيبة مع قامة الطفل، من الابتدائي إلى الثانوي.",
      body: [
        { type: "p", text: "حقيبة كبيرة جداً أمام ظهر صغير تسبب الميل والألم؛ وحقيبة صغيرة جداً تجبر على حمل الأغراض باليد. هذه هي المعايير لكل فئة عمرية." },
        { type: "h2", text: "جدول الطول / السعة" },
        { type: "ul", items: ["5-7 سنوات (روض-سنة أولى): 10-15 لتراً، ارتفاع 35-40 سم", "8-10 سنوات: 15-20 لتراً، ارتفاع 40-45 سم", "11-12 سنة: 20-25 لتراً، ارتفاع 45-50 سم", "13 سنة فأكثر: 25-32 لتراً، ارتفاع 45-55 سم"] },
        { type: "h2", text: "القاعدة الذهبية: لا تتجاوز الحقيبة الجذع" },
        { type: "p", text: "موضوعة على الظهر، يجب أن تبقى بين الكتفين وأعلى الوركين. إن تجاوزت الصدر أو نزلت تحت الأرداف، فغيروا الحجم حتى لو بدت السعة مناسبة." },
        { type: "h2", text: "التعديلات التي تحمي الظهر" },
        { type: "ul", items: ["أشرطة قابلة للتعديل إلى المستوى الصحيح", "حزام صدر عند مستوى الإبطين", "الحمل في أسفل الحقيبة لا في أعلاها", "الوزن الكلي أقل من 10% من وزن الطفل"] },
        { type: "quote", text: "الحجم الصحيح يُعرف بنظرة واحدة: الحقيبة تتبع الظهر ولا تتجاوزه لا جانباً ولا ارتفاعاً." },
        { type: "p", text: "للتحديد حسب المستوى الدراسي، أعدوا قراءة دليل الحقيبة حسب القسم ومقالنا عن حقيبة الطفل الذي يكبر." },
      ],
    },
  },
  {
    slug: "sac-dos-ecole-enfant",
    rubrique: "sacs-a-dos",
    date: "2026-08-29",
    readTime: 4,
    fr: {
      title: "Le sac à dos d'enfant : s'adapter à une taille qui grandit",
      excerpt:
        "Bretelles, dos, sangle de poitrine : les réglages à revoir plusieurs fois par an pour que le sac suive l'enfant dans sa croissance.",
      body: [
        { type: "p", text: "Un sac à dos n'est pas un objet figé : entre le primaire et l'entrée au collège, un enfant grandit de plusieurs centimètres par an. Le même modèle bien réglé convient longtemps si on prend la peine de l'ajuster." },
        { type: "h2", text: "Les réglages à faire et refaire" },
        { type: "ul", items: ["Allonger les bretelles à chaque début d'année", "Garder la sangle de poitrine à la hauteur des aisselles", "Repositionner les sangles de compression si le volume change", "Vérifier que le sac ne descend pas sous les hanches"] },
        { type: "h2", text: "Les signes que le sac est trop petit" },
        { type: "p", text: "Dos déformé, fond qui remonte, cahiers qui se plient, bretelles au maximum : autant de signaux qu'il est temps de passer au volume supérieur, en suivant le tableau des tailles par âge." },
        { type: "h2", text: "Choisir un modèle qui dure" },
        { type: "ul", items: ["Réglage large des bretelles (grande amplitude)", "Dos et fond vraiment rigides", "Fermetures renforcées pour l'usage quotidien", "Tissu déperlant et coutures triples"] },
        { type: "quote", text: "Un bon sac d'enfant grandit avec lui : plus de réglages réels, plus de chances qu'il survive à plusieurs rentrées." },
        { type: "p", text: "Repérez un sac qui durera plusieurs étapes scolaires dans la catégorie Sacs à dos, et complétez avec notre tableau des tailles par âge pour un ajustement parfait." },
      ],
    },
    ar: {
      title: "حقيبة ظهر الطفل: مواكبة قامة تكبر",
      excerpt:
        "أشرطة، ظهر، حزام صدر: تعديلات يجب إعادتها عدة مرات في السنة ليتبعها الطفل في نموه.",
      body: [
        { type: "p", text: "حقيبة الظهر ليست شيئاً ثابتاً: بين الابتدائي والدخول إلى الإعدادي، يكبر الطفل عدة سنتمترات كل سنة. النموذج نفسه المضبوط جيداً يصلح طويلاً إذا أخذنا الوقت لضبطه." },
        { type: "h2", text: "تعديلات نعيدها كلما لزم" },
        { type: "ul", items: ["إطالة الأشرطة في بداية كل سنة", "إبقاء حزام الصدر عند مستوى الإبطين", "إعادة وضع أحزمة الضغط إذا تغير الحجم", "التأكد ألا تنزل الحقيبة تحت الوركين"] },
        { type: "h2", text: "علامات أَن الحقيبة صغيرة جداً" },
        { type: "p", text: "ظهر ملتوٍ، أسفل مرتفع، دفاتر تنثني، أشرطة في أقصاها: إشارات تدل أن الوقت حان للانتقال إلى حجم أكبر، متبعين جدول الأحجام حسب العمر." },
        { type: "h2", text: "اختيار نموذج يدوم" },
        { type: "ul", items: ["مدي تعديل واسع للأشرطة", "ظهر وأسفل صلبان فعلاً", "سحابات مقوّاة للاستعمال اليومي", "قماش طارد وخياطة ثلاثية"] },
        { type: "quote", text: "حقيبة الطفل الجيدة تكبر معه: تعديلات حقيقية أكثر، فرص بقائها لدخولات عديدة أكبر." },
        { type: "p", text: "ابحثوا عن حقيبة تصمد لمراحل مدرسية عدة في فئة حقائب الظهر، وأكملوا بجدولنا للأحجام حسب العمر لضبط مثالي." },
      ],
    },
  },
  {
    slug: "sac-dos-sport-gym",
    rubrique: "sacs-a-dos",
    date: "2026-08-29",
    readTime: 3,
    faq: {
      fr: [
        { q: "Quelle capacité pour un sac de sport ?", a: "20 à 30 litres suffisent : maillot, serviette, chaussures dans un compartiment séparé et gourde. Au-delà, le sac devient trop lourd à porter pour rien." },
        { q: "Où ranger les chaussures dans le sac ?", a: "Dans un compartiment ou sachet séparé, fermé hermétiquement pour éviter les odeurs et la saleté." },
      ],
      ar: [
        { q: "ما سعة حقيبة الرياضة؟", a: "من 20 إلى 30 لتراً تكفي: تي شيرت، منشفة، حذاء في قسم منفصل وقارورة. فوق ذلك تصبح الحقيبة ثقيلة بلا داعٍ." },
        { q: "أين نضع الحذاء في الحقيبة؟", a: "في قسم أو كيس منفصل مغلق بإحكام تفادياً للروائح والاتساخ." },
      ],
    },
    fr: {
      title: "Sac de sport : le compagnon du vestiaire",
      excerpt:
        "Maillot, serviette, chaussures, gourde : comment choisir un sac de sport pratique, facile à transporter et à nettoyer.",
      body: [
        { type: "p", text: "Le sac de sport accompagne les séances de gym, le foot du week-end et l'éducation physique au collège. Un bon modèle résiste aux chocs, se nettoie vite et garde les chaussures à part." },
        { type: "h2", text: "Les compartiments qui changent tout" },
        { type: "ul", items: ["Compartiment séparé pour les chaussures", "Poche à serviette ou poche humide", "Poche extérieure pour la gourde", "Petit compartiment pour téléphone et clés"] },
        { type: "h2", text: "Les matières à privilégier" },
        { type: "ul", items: ["Tissu déperlant et lavable en machine", "Fond renforcé qui ne s'abîme pas posé au sol", "Zips solides, sangle de transport pratique", "Sangle de poitrine pour la course avec le sac"] },
        { type: "p", text: "Si le sac doit aussi transporter un cahier ou un ordinateur pour l'école, orientez-vous vers un modèle hybride du type de ceux des catégories Sacs à dos, qui combine compartiment sport et poche PC." },
        { type: "quote", text: "Le bon sac de sport ne se juge pas à sa taille, mais à son organisation : chaque affaire à sa place, même mouillée." },
      ],
    },
    ar: {
      title: "حقيبة الرياضة: رفيق غرفة الملابس",
      excerpt:
        "تي شيرت، منشفة، حذاء، قارورة: كيف نختار حقيبة رياضة عملية وسهلة النقل والتنظيف.",
      body: [
        { type: "p", text: "ترافق حقيبة الرياضة حصص الجمباز وكرة قدم نهاية الأسبوع والتربية البدنية في الإعدادي. النموذج الجيد يقاوم الصدمات ويُغسل بسرعة ويبقي الحذاء منفصلاً." },
        { type: "h2", text: "الأقسام التي تغيّر كل شيء" },
        { type: "ul", items: ["قسم منفصل للحذاء", "جيب للمنشفة أو للملابس الرطبة", "جيب خارجي للقارورة", "جيب صغير للهاتف والمفاتيح"] },
        { type: "h2", text: "الخامات المفضلة" },
        { type: "ul", items: ["قماش طارد ويُغسل في الغسالة", "أسفل مقوّى لا يتلف عند وضعه أرضاً", "سحابات قوية وحزام حمل عملي", "حزام صدر للجري بالحقيبة"] },
        { type: "p", text: "إن رافقت الحقيبة دفتراً أو حاسوباً خلال الدراسة، فتوجهوا نحو نموذج هجين من فئة حقائب الظهر يجمع بين قسم الرياضة وجيب الحاسوب." },
        { type: "quote", text: "حقيبة الرياضة الجيدة لا تُقاس بحجمها بل بتنظيمها: كل أغراض في مكانها حتى المبتلة." },
      ],
    },
  },
  {
    slug: "sac-dos-minimaliste",
    rubrique: "sacs-a-dos",
    date: "2026-08-29",
    readTime: 3,
    fr: {
      title: "Le sac à dos minimaliste : le strict nécessaire pour l'essentiel",
      excerpt:
        "Moins de poches, moins de poids : le sac minimaliste pour la ville, le travail et les trajets légers, bien pensé et durable.",
      body: [
        { type: "p", text: "Le minimalisme appliqué au sac à dos, c'est choisir un volume juste, des poches pensées et des matières qui renvoient de vieux sacs à l'oubli. Une philosophie qui séduit autant les étudiants que les actifs." },
        { type: "h2", text: "Les volumes d'un sac minimaliste" },
        { type: "ul", items: ["15-20 L : trajets quotidiens, ordinateur seul", "20-25 L : travail plus documents", "25 L : le grand format d'un sac assumé"] },
        { type: "h2", text: "La règle des trois poches" },
        { type: "p", text: "Une grande poche centrale pour l'ordinateur, une poche plate pour les documents, une poche zippée pour le téléphone et les clés : pas besoin de plus. C'est ce qui force à trier et à ne garder que l'essentiel." },
        { type: "h2", text: "Des matériaux qui durent" },
        { type: "ul", items: ["Tissu technique résistant à l'usage quotidien", "Coutures renforcées au niveau des poignées", "Fond imperméable, zips durables", "Couleurs sobres qui restent élégantes plusieurs années"] },
        { type: "quote", text: "Un sac minimaliste ne se remplit pas : il se choisit, et c'est son volume modeste qui vous rappelle de ne transporter que l'utile." },
        { type: "p", text: "Les sacs à dos les plus durables et bien dessinés se trouvent dans la catégorie Sacs à dos. Pour un accès rapide à l'ordinateur, associez-le à votre choix de sacoche ou de sac à dos PC." },
      ],
    },
    ar: {
      title: "حقيبة ظهر بسيطة: الضروري فقط للأساسي",
      excerpt:
        "جيوب أقل، وزن أقل: الحقيبة البسيطة للمدينة والعمل والتنقلات الخفيفة، مدروسة ومتينة.",
      body: [
        { type: "p", text: "البساطة المطبقة على حقيبة الظهر تعني اختيار حجم عادل وجيوب مدروسة وخامات تُنسي الحقائب القديمة. فلسفة يجذبها الطلاب والموظفون على حدٍّ سواء." },
        { type: "h2", text: "أحجام الحقيبة البسيطة" },
        { type: "ul", items: ["15-20 لتراً: تنقلات يومية، حاسوب فقط", "20-25 لتراً: عمل مع وثائق", "25 لتراً: الحجم الأكبر للحقيبة الواضحة"] },
        { type: "h2", text: "قاعدة الجيوب الثلاثة" },
        { type: "p", text: "جيب كبير مركزي للحاسوب، جيب مسطح للمستندات، جيب بسحاب للهاتف والمفاتيح: لا حاجة لأكثر. هذا ما يفرض الغربلة والاكتفاء بالأساسي." },
        { type: "h2", text: "خامات تدوم" },
        { type: "ul", items: ["قماش تقني يقاوم الاستعمال اليومي", "خياطة مقوّاة عند المقابض", "أسفل مقاوم للماء وسحابات متينة", "ألوان هادئة تبقى أنيقة سنوات"] },
        { type: "quote", text: "الحقيبة البسيطة لا تُملأ، بل تُختار، وحجمها المتواضع يذكرك ألا تحمل إلا المفيد." },
        { type: "p", text: "أكثر حقائب الظهر متانة وجمالاً تجدونها في فئة حقائب الظهر. ولوصول سريع للحاسوب، اربطوها باختياركم بين الحقيبة الجانبية وحقيبة الظهر." },
      ],
    },
  },
  {
    slug: "sac-pc-gaming-17",
    rubrique: "sacs-ordinateur",
    date: "2026-08-29",
    readTime: 4,
    fr: {
      title: "Sac PC gamer : transporter un 17 pouces et ses accessoires",
      excerpt:
        "Grande diagonale, protection renforcée, place pour casque et périphériques : le sac pensé pour les gamers en déplacement.",
      body: [
        { type: "p", text: "Un ordinateur gamer pèse souvent plus de 2,5 kg, et il voyage rarement seul : casque, souris, chargeur, manette. Le sac doit donc allier protection renforcée et vraie capacité de rangement." },
        { type: "h2", text: "Vérifier le gabarit avant tout" },
        { type: "ul", items: ["Compartiment dimensionné pour 15,6 / 17,3 pouces réels", "Doublure épaisse qui absorbe les chocs", "Poche surélevée : l'ordinateur ne touche jamais le sol", "Vérifier le mètre du sac avec votre modèle en main"] },
        { type: "h2", text: "L'espace pour les périphériques" },
        { type: "ul", items: ["Poche molletonnée pour le casque", "Sachet ou compartiment pour le chargeur et les câbles", "Compartment souris et manette", "Poche avant pour documents et cartes"] },
        { type: "h2", text: "Le confort du transport" },
        { type: "p", text: "Avec deux à trois kilos d'équipement, les bretelles rembourrées, le dos ventilé et la sangle de poitrine deviennent indispensables. Un sac trop léger concentre tout le poids sur les épaules." },
        { type: "quote", text: "Un sac gamer solide préférera toujours la barre de coffre au vestiaire de l'école, et votre dos vous en remerciera." },
        { type: "p", text: "La catégorie Sacs ordinateur regroupe des modèles pour tous les gabarits. Pour les bases de la protection, relisez notre article pour choisir un sac ordinateur portable." },
      ],
    },
    ar: {
      title: "حقيبة حواسيب الألعاب: نقل شاشة 17 بوصة وملحقاتها",
      excerpt:
        "شاشة كبيرة، حماية معززة، مكان للسماعات والأجهزة الطرفية: حقيبة مصممة للاعبين المتنقلين.",
      body: [
        { type: "p", text: "يزن حاسوب الألعاب غالباً أكثر من 2.5 كغ، ونادراً ما يسافر وحده: سماعات، فأرة، شاحن، مقبض. لذا يجب أن تجمع الحقيبة بين الحماية المعززة وسعة تنظيم حقيقية." },
        { type: "h2", text: "التحقق من المقاس أولاً" },
        { type: "ul", items: ["قسم بمقاس 15.6 / 17.3 بوصة الفعلي", "بطانة سميكة تمتص الصدمات", "جيب مرتفع: لا يلامس الحاسوب الأرض أبداً", "قياس الحقيبة بجهازكم الموجود في اليد"] },
        { type: "h2", text: "مساحة الأجهزة الطرفية" },
        { type: "ul", items: ["جيب مبطن للسماعات", "كيس أو قسم للشاحن والكابلات", "قسم للفأرة والمقبض", "جيب أمامي للوثائق والبطاقات"] },
        { type: "h2", text: "راحة النقل" },
        { type: "p", text: "مع كيلوغرامين أو ثلاثة من العدة، تصبح الأشرطة المبطنة والظهر المهوّى وحزام الصدر ضرورية. الحقيبة الخفيفة جداً تركز الثقل كله على الكتفين." },
        { type: "quote", text: "حقيبة ألعاب متينة تفضل جذع السيارة على غرفة الملابس المدرسية، وسيشكرك ظهرك." },
        { type: "p", text: "تضم فئة حقائب الحواسيب نماذج لكل المقاسات. لأساسيات الحماية، أعيدوا قراءة مقالنا لاختيار حقيبة الحاسوب المحمول." },
      ],
    },
  },
  {
    slug: "housse-ou-sac-pc",
    rubrique: "sacs-ordinateur",
    date: "2026-08-28",
    readTime: 3,
    fr: {
      title: "Housse ou sac dédié : quelle protection pour son ordinateur ?",
      excerpt:
        "Housse fine, étui moussu ou sac à compartiment : quel niveau de protection selon la manière dont vous transportez votre ordinateur.",
      body: [
        { type: "p", text: "La housse d'ordinateur se glisse dans un autre sac ; le sac dédié protège seul. Le bon choix dépend de votre trajet et de ce que vous transportez en plus. Voici comment trancher." },
        { type: "h2", text: "La housse : protection ciblée" },
        { type: "ul", items: ["Étui fin pour le quotidien dans un sac déjà existant", "Gabarit exact de votre écran, pas de jeu", "Bord rembourré sur les 4 côtés", "Idéale pour protéger un ordinateur déjà partout chez vous"] },
        { type: "h2", text: "Le sac dédié : protection et organisation" },
        { type: "ul", items: ["Compartiment surélevé qui amortit les chocs au sol", "Place pour chargeur, documents et petite affaire", "Dos et bretelles ergonomiques", "Un seul objet à porter pour l'ordinateur et son univers"] },
        { type: "h2", text: "Le critère décisif" },
        { type: "p", text: "Si vous faites moins de 15 minutes à pied et gardez un sac de tous les jours, la housse suffit largement. Dès que l'ordinateur est votre seule charge ou que vous prenez les transports, un sac dédié vous protège le dos et le matériel." },
        { type: "quote", text: "La protection ne se mesure pas à l'épaisseur de la housse, mais au fait que l'ordinateur ne bouge jamais dans son compartiment." },
        { type: "p", text: "Entre sacoche et sac à dos, notre comparatif vous aidera sur le style de transport. Les protections et compartiments sont détaillés dans notre guide des sacs ordinateur, et les modèles dans les catégories Sacs ordinateur et Sacs à dos." },
      ],
    },
    ar: {
      title: "غطاء أم حقيبة مخصصة: أيهما يحمي حاسوبك؟",
      excerpt:
        "غطاء رفيع، علبة إسفنجية أم حقيبة بقسم: أي مستوى حماية حسب طريقة نقل حاسوبك.",
      body: [
        { type: "p", text: "غطاء الحاسوب يُوضع في حقيبة أخرى؛ والحقيبة المخصصة تحمي وحدها. الخيار الصحيح يعتمد على طريقك وما تحمله أيضاً. إليك كيف تحسم." },
        { type: "h2", text: "الغطاء: حماية موجَّهة" },
        { type: "ul", items: ["علبة رفيعة للاستعمال اليومي داخل حقيبة موجودة", "مقاس شاشتك بالضبط دون فراغ", "حافة مبطنة من الجوانب الأربعة", "مثالي لحماية حاسوب يتواجد في كل مكان"] },
        { type: "h2", text: "الحقيبة المخصصة: حماية وتنظيم" },
        { type: "ul", items: ["قسم مرتفع يمتص الصدمات أرضاً", "مكان للشاحن والمستندات والأغراض الصغيرة", "ظهر وأشرطة مريحة", "شيء واحد يحمل الحاسوب وعالمه"] },
        { type: "h2", text: "المعيار الحاسم" },
        { type: "p", text: "إن مشيتم أقل من 15 دقيقة وتحتفظون بحقيبة يومية، فالغطاء يكفي تماماً. ومع أن يصبح الحاسوب حملك الوحيد أو تستعملون النقل العمومي، فالحقيبة المخصصة تحمي ظهركم وعدّتكم." },
        { type: "quote", text: "الحماية لا تقاس بسمك الغطاء، بل بأن الحاسوب لا يتحرك أبداً داخل قسمه." },
        { type: "p", text: "بين الحقيبة الجانبية وحقيبة الظهر، ستساعدكم مقارنتنا في أسلوب النقل. الحماية والأقسام مفصلة في دليل حقائب الحواسيب، والنماذج في فئتي حقائب الحواسيب وحقائب الظهر." },
      ],
    },
  },
  {
    slug: "sac-pc-anti-vol",
    rubrique: "sacs-ordinateur",
    date: "2026-08-28",
    readTime: 3,
    fr: {
      title: "Sac ordinateur anti-vol : poche cachée et fermetures sécurisées",
      excerpt:
        "Poche arrière invisible, zips verrouillables, anneau à câble : les dispositifs simples pour transporter son portable sans stress.",
      body: [
        { type: "p", text: "Dans les transports et les lieux publics, l'ordinateur portable reste une cible privilégiée. Quelques dispositifs bien choisis réduisent considérablement les risques, sans transformer le sac en coffre-fort." },
        { type: "h2", text: "Les protections à rechercher" },
        { type: "ul", items: ["Poche arrière invisible collée au dos, impossible à ouvrir par derrière", "Zips verrouillables qui se fixent ensemble", "Anneau et câble de verrouillage pour accrocher le sac", "Doublure anti-coupe au niveau des poches principales"] },
        { type: "h2", text: "Les bonnes habitudes" },
        { type: "p", text: "L'ordinateur côté dos, jamais côté poche extérieure. Dans un café, posez le sac entre vos pieds et non sur une chaise voisine. Dans les transports, gardez la sangle épaule en travers du corps." },
        { type: "h2", text: "Que choisir selon l'usage" },
        { type: "ul", items: ["Sac à dos anti-vol pour le quotidien urbain", "Sacoche à sangles verrouillables pour les rendez-vous", "Modèles hybrides avec poche cache pour documents sensibles"] },
        { type: "quote", text: "Le vol est rarement l'œuvre d'un coupe-fil : c'est en général une poche ouverte et un moment d'inattention qu'il faut empêcher." },
        { type: "p", text: "La catégorie Sacs ordinateur emploie ces dispositifs sur la gamme complète. Pour le gabarit exact, relisez notre article pour choisir un sac ordinateur portable avant de commander." },
      ],
    },
    ar: {
      title: "حقيبة حاسوب ضد السرقة: جيب خفي وسحابات مؤمنة",
      excerpt:
        "جيب خلفي غير مرئي، سحابات قابلة للقفل، حلقة للكابل: وسائل بسيطة لنقل حاسوبكم بلا قلق.",
      body: [
        { type: "p", text: "في النقل العمومي والأماكن العامة، يظل الحاسوب المحمول هدفاً أساسياً. وسائل قليلة مختارة جيداً تخفف المخاطر كثيراً دون تحويل الحقيبة إلى خزنة." },
        { type: "h2", text: "حماية يجب البحث عنها" },
        { type: "ul", items: ["جيب خلفي غير مرئي ملاصق للظهر لا يُفتح من الخلف", "سحابات قابلة للقفل تُثبت معاً", "حلقة وكابل قفل لتعليق الحقيبة", "بطانة مضادة للقطع عند الجيوب الرئيسية"] },
        { type: "h2", text: "عادات جيدة" },
        { type: "p", text: "الحاسوب جهة الظهر لا جهة الجيب الخارجي. في المقهى، ضعوا الحقيبة بين أقدامكم لا على كرسي مجاور. وفي النقل، أبقوا الحزام على الصدر." },
        { type: "h2", text: "ماذا نختار حسب الاستعمال" },
        { type: "ul", items: ["حقيبة ظهر ضد السرقة للحياة اليومية الحضرية", "حقيبة جانبية بسحابات قابلة للقفل للمواعيد", "نماذج هجينة بها جيب استتار للمستندات الحساسة"] },
        { type: "quote", text: "السرقة نادراً ما تكون بعمل قاطع خيوط: إنها عادة جيب مفتوح ولحظة غفلة يجب منعها." },
        { type: "p", text: "توظف فئة حقائب الحواسيب هذه الوسائل في التشكيلة كاملة. للمقاس الدقيق، أعيدوا قراءة مقالنا لاختيار حقيبة الحاسوب المحمول قبل الطلب." },
      ],
    },
  },
  {
    slug: "valise-ou-sac-voyage",
    rubrique: "sacs-voyage",
    date: "2026-08-29",
    readTime: 4,
    faq: {
      fr: [
        { q: "Valise à roulettes ou sac de voyage ?", a: "La valise pour le transport roulé, le sac pour la marche et l'organisation. Au-delà d'un week-end, la valise s'impose ; en dessous, le sac gagne." },
        { q: "Peut-on prendre un sac en cabine ?", a: "Oui, s'il respecte les dimensions de cabine. Un sac souple se comprime et passe les contrôles plus facilement qu'une valise rigide." },
      ],
      ar: [
        { q: "حقيبة بعجلات أم حقيبة سفر؟", a: "الحقيبة بعجلات للنقل المدحرج، وحقيبة الظهر للمشي والتنظيم. بعد نهاية أسبوع يستحق الجول غير المطوي؛ وتحتها تفوز الحقيبة." },
        { q: "هل يمكن أخذ حقيبة إلى المقصورة؟", a: "نعم إذا التزمت بمقاسات المقصورة. الحقيبة المرنة تضغط وتعبر المراقبة أسهل من حقيبة صلبة." },
      ],
    },
    fr: {
      title: "Valise ou sac de voyage : comment choisir selon le séjour",
      excerpt:
        "Week-end, semaine ou grand voyage : les critères pour trancher entre valise à roulettes, sac de voyage et sac à dos avant de partir.",
      body: [
        { type: "p", text: "La valise roule, le sac se porte : la question n'est pas la mode, mais la géographie de votre voyage. Escaliers, trottoirs difficilement accessibles et transports en commun changent tout." },
        { type: "h2", text: "Du week-end à la semaine" },
        { type: "ul", items: ["1-3 jours : sac de voyage 20-35 L toujours suffisant", "4-7 jours : valise 55-70 L ou sac 35-50 L selon le déplacement", "Plus d'une semaine : la roulette devient indispensable"] },
        { type: "h2", text: "Quand le sac l'emporte" },
        { type: "p", text: "Escalier, métro, marche prolongée, train régional : le sac à dos répartit le poids et libère les mains. Il remplace la valise dès que la marche représente plus de 10 minutes du trajet." },
        { type: "h2", text: "Quand la valise s'impose" },
        { type: "ul", items: ["Transports par taxi ou voiture porte à porte", "Grande quantité de vêtements ou matériel volumineux", "Déplacement professionnel avec costume à l'abri des plis", "Coffre et rangement hôtelier plus faciles"] },
        { type: "quote", text: "Le bon contenant suit le parcours : on choisit d'abord le trajet, ensuite la valise ou le sac." },
        { type: "p", text: "Pour les séjours courts, nos articles sur le sac de voyage et week-end et le bagage en cabine détaillent les bons volumes. Les modèles des catégories Sacs de voyage et Cartables à roulettes couvrent les deux usages." },
      ],
    },
    ar: {
      title: "حقيبة بعجلات أم حقيبة سفر: كيف نختار حسب الرحلة؟",
      excerpt:
        "نهاية أسبوع، أسبوع أم رحلة كبيرة: معايير الحسم بين الحقيبة بعجلات وحقيبة السفر وحقيبة الظهر قبل الانطلاق.",
      body: [
        { type: "p", text: "الحقيبة بعجلات تتدحرج والحقيبة تُحمل: السؤال ليس موضة بل جغرافية رحلتك. السلالم والأرصفة الصعبة والنقل العمومي يغيّرون كل شيء." },
        { type: "h2", text: "من نهاية الأسبوع إلى الأسبوع" },
        { type: "ul", items: ["1-3 أيام: حقيبة سفر من 20-35 لتراً تكفي دائماً", "4-7 أيام: حقيبة 55-70 لتراً أو حقيبة 35-50 حسب التنقل", "أكثر من أسبوع: تصبح العجلات ضرورية"] },
        { type: "h2", text: "متى تتفوق الحقيبة؟" },
        { type: "p", text: "سلالم، مترو، مشي طويل، قطار جهوي: توزع حقيبة الظهر الوزن وتريح اليدين. إنها تعوّض الحقيبة بعجلات متى تجاوز المشي 10 دقائق من الطريق." },
        { type: "h2", text: "متى تفرض الحقيبة بعجلات نفسها؟" },
        { type: "ul", items: ["نقل بسيارة أجرة أو بنفسك من بوابة إلى بوابة", "كمية كبيرة من الملابس أو معدات ضخمة", "تنقل مهني ببدلة محفوظة من الكسور", "تخزين أفندي أسهل"] },
        { type: "quote", text: "الحاوية الصحيحة تتبع المسار: اختاروا أولاً الطريق، ثم الحقيبة أو الجوال." },
        { type: "p", text: "للرحلات القصيرة، يشرح مقالا حقيبة السفر وعطلة نهاية الأسبوع وبقايا المقصورة الأجناس الصحيحة. نماذج فئتي حقائب السفر والحقائب بعجلات تغطي الاستعمالين." },
      ],
    },
  },
  {
    slug: "sac-plage-maroc",
    rubrique: "sacs-voyage",
    date: "2026-08-29",
    readTime: 3,
    fr: {
      title: "Le sac de plage idéal au Maroc : sable, serviette et durabilité",
      excerpt:
        "Fond qui se vide, poche fermée pour le téléphone, matière qui sèche vite : le vrai sac pour les plages d'Agadir à Tanger.",
      body: [
        { type: "p", text: "Entre Agadir, Casablanca et les plages du nord, le sac de plage affronte le sable, l'eau salée et le soleil. Un bon modèle se rince, se vide et protège le téléphone et les clés." },
        { type: "h2", text: "Les points qui font un bon sac de plage" },
        { type: "ul", items: ["Fond perforé ou ouvert qui laisse fuir le sable", "Matériau qui sèche vite (maillage, toile enduite)", "Poche zippée et étanche pour le téléphone", "Gourde ou poche à bouteille intégrée"] },
        { type: "h2", text: "Les contenances selon la journée" },
        { type: "ul", items: ["10-20 L : la journée seule avec serviette", "20-35 L : famille avec jeux et parasol", "Modèle rabattable : se plie dans la valise"] },
        { type: "p", text: "Pensez aussi à une poche pour les affaires mouillées (maillot, sandales) séparée du reste. Les maillages vivement colorés se repèrent facilement sur un sable bondé." },
        { type: "quote", text: "Un bon sac de plage se reconnaît à ce que le sable n'y reste jamais : il le laisse fuir au lieu de le stocker." },
        { type: "p", text: "La catégorie Sacs de voyage propose des options lavables et séchage rapide. Pour un format week-end qui accompagne aussi les escapades en ville, relisez notre guide du sac de voyage et week-end." },
      ],
    },
    ar: {
      title: "حقيبة الشاطئ المثالية في المغرب: رمل ومنشفة ومتانة",
      excerpt:
        "أسفل يتفرغ، جيب مغلق للهاتف، خامة تجف بسرعة: الحقيبة الحقيقية لشواطئ أكادير إلى طنجة.",
      body: [
        { type: "p", text: "بين أكادير والدار البيضاء وشواطئ الشمال، تواجه حقيبة الشاطئ الرمل والماء المالح والشمس. النموذج الجيد يُغسل ويُفرغ ويحمي الهاتف والمفاتيح." },
        { type: "h2", text: "نقاط تصنع حقيبة شاطئ جيدة" },
        { type: "ul", items: ["أسفل مثقوب أو مفتوح يطرد الرمل", "خامة تجف بسرعة (شبكة، قماش مطلي)", "جيب بسحاب ومقاوم للماء للهاتف", "قارورة أو جيب داخل القارورة"] },
        { type: "h2", text: "السعات حسب اليوم" },
        { type: "ul", items: ["10-20 لتراً: اليوم وحده مع منشفة", "20-35 لتراً: عائلة بلعب ومظلة", "نموذج قابل للطي: يُطوى داخل الحقيبة"] },
        { type: "p", text: "فكروا أيضاً في جيب للأغراض الرطبة (مايوه، صندل) منفصل عن البقية. والشبكات ذات الألوان الزاهية يسهل تمييزها على رمل مزدحم." },
        { type: "quote", text: "تُعرف حقيبة الشاطئ الجيدة بأن الرمل لا يبقى فيها أبداً: تتركه يتسرب بدل تخزينه." },
        { type: "p", text: "تقدم فئة حقائب السفر خيارات قابلة للغسيل والجفاف السريع. ولصيغة نهاية أسبوع ترافق أيضاً الخروج إلى المدينة، أعيدوا قراءة دليل حقيبة السفر وعطلة نهاية الأسبوع." },
      ],
    },
  },
  {
    slug: "sac-randonnee-sentiers",
    rubrique: "sacs-voyage",
    date: "2026-08-29",
    readTime: 4,
    fr: {
      title: "Sac de randonnée : volume, portage et organisation en rando",
      excerpt:
        "20 à 40 litres selon la sortie, dos ajustable, ceinture et accessoires externes : le sac de rando enfin bien choisi.",
      body: [
        { type: "p", text: "Randonnée à la journée dans l'Atlas ou bivouac de deux nuits : le sac se choisit en fonction du temps passé sur les sentiers, du poids transporté et du portage qu'il offre." },
        { type: "h2", text: "Le volume selon la sortie" },
        { type: "ul", items: ["15-25 L : randonnée à la journée, spectacle léger", "30-40 L : randonnée d'un ou deux jours, affaires complètes", "50 L et plus : bivouac et grandes traversées"] },
        { type: "h2", text: "Le portage abdominal et dorsal" },
        { type: "p", text: "Au-delà de 8 kg, une ceinture de hanche est indispensable pour transférer le poids vers les hanches. Un dos réglable en hauteur (platine déplaçable) ajuste le sac à votre buste, même sur les montées raides." },
        { type: "h2", text: "L'organisation sur le sentier" },
        { type: "ul", items: ["Poche du haut pour les accessoires de premier secours", "Poches latérales pour bouteilles que l'on attrape d'une main", "Points d'attache externes (bâtons, tapis, tente)", "Sangles de compression qui stabilisent à chaque charge"] },
        { type: "quote", text: "En randonnée, tout bonus de poids est payé en sueur : le sac idéal est celui que l'on n'a pas envie d'alléger aux deux tiers du chemin." },
        { type: "p", text: "La catégorie Sacs de voyage inclut ces modèles de randonnée. Pour les formats urbains et professionnels du même volume, notre article sur le sac à dos et notre guide des sacs à dos restent utiles." },
      ],
    },
    ar: {
      title: "حقيبة التنزه: الحجم والحمل والتنظيم في الرحلات",
      excerpt:
        "من 20 إلى 40 لتراً حسب الخروج، ظهر قابل للتعديل، حزام وأكسسوارات خارجية: حقيبة التنزه المختارة أخيراً جيداً.",
      body: [
        { type: "p", text: "تنزه يومي في الأطلس أم تخييم ليلتين: تُختار الحقيبة حسب الوقت على المسالك والوزن المنقول والحمل الذي تقدمه." },
        { type: "h2", text: "الحجم حسب الخروج" },
        { type: "ul", items: ["15-25 لتراً: خروج يومي، مشهد خفيف", "30-40 لتراً: خروج يوم أو يومين بأغراض كاملة", "50 لتراً فأكثر: تخييم ومسارات كبيرة"] },
        { type: "h2", text: "الحمل البطني والظهري" },
        { type: "p", text: "بعد 8 كغ، يلزم حزام حوض لنقل الوزن نحو الوركين. والظهر القابل للتعديل في الارتفاع (لوحة متحركة) يكيَّف الحقيبة مع جذعك حتى في الصعود الحاد." },
        { type: "h2", text: "التنظيم على المسلك" },
        { type: "ul", items: ["جيب علوي لمعدات الإسعافات الأولية", "جيوب جانبية لقوارير تُلتقط بيد واحدة", "نقاط ربط خارجية (عصي، حصيرة، خيمة)", "أحزمة ضغط تثبت عند كل تحميل"] },
        { type: "quote", text: "في التنزه، كل وزن زائد يدفع بعرق: الحقيبة المثالية هي التي لا تميل لتخفيفها في ثلثي الطريق." },
        { type: "p", text: "تضم فئة حقائب السفر هذه النماذج. ولأشكال المدن والعمل من نفس الحجم، يبقى مقالنا عن حقيبة الظهر ودليل حقائب الظهر مفيدين." },
      ],
    },
  },
  {
    slug: "gourde-ecole-isotherme",
    rubrique: "accessoires",
    date: "2026-08-29",
    readTime: 3,
    faq: {
      fr: [
        { q: "Quelle contenance pour la gourde d'école ?", a: "500 ml à 1 litre : 500 ml pour le primaire, 750 ml à 1 L pour le collège et le lycée. Plus, c'est du poids inutile dans le cartable." },
        { q: "Inox, plastique ou aluminium ?", a: "L'inox isole et dure, l'acier sans BPA convient aux petits, l'aluminium isotherme est léger. Évitez le plastique jetable." },
      ],
      ar: [
        { q: "ما سعة قارورة المدرسة؟", a: "من 500 مل إلى 1 لتر: 500 مل للابتدائي، و750 مل إلى 1 لتر للإعدادي والثانوي. أكثر من ذلك وزن زائد في الحقيبة." },
        { q: "خزن أم بلاستيك أم ألمنيوم؟", a: "الخزن يعزل ويدوم، والفولاذ الخالّ من BPA يناسب الصغار، والألمنيوم الحراري خفيف. تجنبوا البلاستيك الوصف." },
      ],
    },
    fr: {
      title: "Gourde d'école : quelle contenance, quel matériau, quelle marque",
      excerpt:
        "500 ml ou 1 litre, inox ou plastique sans BPA : les repères simples pour choisir la gourde qui accompagne l'enfant toute l'année.",
      body: [
        { type: "p", text: "La gourde remplace les bouteilles jetables et se glisse dans la poche latérale du cartable. Encore faut-il choisir une contenance, un matériau et une étanchéité adaptés à l'âge de l'enfant." },
        { type: "h2", text: "La contenance qui convient" },
        { type: "ul", items: ["Petite section-CE2 : 400 à 500 ml suffisent", "CM1-collège : 500 à 750 ml", "Lycée et sport : 750 ml à 1 litre"] },
        { type: "h2", text: "Le matériau de la gourde" },
        { type: "ul", items: ["Inox isotherme : boisson fraîche ou chaude des heures", "Acier et plastique sans BPA : léger et résistant", "Bec ouvre-fermant anti-fuite garanti par la marque", "Étanchéité à vérifier tête en bas dans un sac"] },
        { type: "p", text: "Privée de son emballage jetable, l'école accueille aussi de plus en plus de gourdes dans les salles de classe. Comptez aussi une poche latérale extérieure du cartable pour la tenir à la verticale, bien visible et sans fuite." },
        { type: "quote", text: "La bonne gourde ne se répare pas seulement à la chaleur : elle se lave facilement, fuit rarement et se repère au fond du cartable." },
        { type: "p", text: "La catégorie Trousses et accessoires inclut nos gourdes et boîtes à goûter assorties. Pour compléter le contenu du sac, suivez notre liste fournitures par niveau." },
      ],
    },
    ar: {
      title: "قارورة المدرسة: أي سعة وأي خامة وأي علامة",
      excerpt:
        "500 مل أم 1 لتر، خزن أم بلاستيك خالٍ من BPA: معايير بسيطة لاختيار القارورة التي ترافق الطفل طوال السنة.",
      body: [
        { type: "p", text: "تعوّض القارورة الزجاجات الوصفية وتوضع في الجيب الجانبي للحقيبة. ويجب اختيار سعة وخامة وإحكام يناسب سن الطفل." },
        { type: "h2", text: "السعة المناسبة" },
        { type: "ul", items: ["روض-سنة ثالثة: 400 إلى 500 مل تكفي", "سنة رابعة-إعدادي: 500 إلى 750 مل", "ثانوي ورياضة: 750 مل إلى 1 لتر"] },
        { type: "h2", text: "خامة القارورة" },
        { type: "ul", items: ["خزن حراري: مشروب بارد أو ساخن لساعات", "فولاذ وبلاستيك خالٍ من BPA: خفيف ومتين", "فوهة تفتح وتغلق مانعة للتسرب", "إحكام يُختبر مقلوباً داخل الحقيبة"] },
        { type: "p", text: "دون غلافها الوصفي، تستقبل المدارس قارورات أكثر في الأقسام. واحتسبوا أيضاً جيباً جانبياً خارجياً للحقيبة لتثبيتها عمودياً وظاهرة دون تسرب." },
        { type: "quote", text: "القارورة الجيدة لا تُصلح بالحرارة فقط: بل تُغسل بسهولة، نادراً ما تتسرب، وتظهر في قاع الحقيبة." },
        { type: "p", text: "تضم فئة المقالم والمستلزمات قاروراتنا وعلب الوجبات المتطابقة. ولإكمال محتوى الحقيبة، اتبعوا قائمتنا باللوازم حسب المستوى." },
      ],
    },
  },
  {
    slug: "boite-gouter-enfant",
    rubrique: "accessoires",
    date: "2026-08-29",
    readTime: 3,
    fr: {
      title: "Boîte à goûter : les bonnes portions et le contenant adapté",
      excerpt:
        "Dimensions du sac, étanchéité, compartiments : comment choisir la boîte qui protège le goûter sans alourdir le cartable.",
      body: [
        { type: "p", text: "La boîte à goûter doit entrer dans le cartable, rester étanche et ne pas ajouter de poids. Un choix réfléchi évite les paquets écrasés et les contenus répandus en classe." },
        { type: "h2", text: "Le bon format selon le goûter" },
        { type: "ul", items: ["Boîte plate simple : biscottes, fruits secs", "Boîte à compartiments : fruit, sandwich et goûter", "Petit bol isotherme : fromage blanc, soupe lors des sorties"] },
        { type: "h2", text: "Les critères à vérifier" },
        { type: "ul", items: ["Dimensions adaptées à la poche latérale du cartable", "Étanchéité garantie même retournée", "Ouverture facile pour des petites mains", "Matériau sans BPA, frais au plat ou au lave-vaisselle"] },
        { type: "p", text: "Répartir les portions dans plusieurs petites boîtes, c'est aussi répartir le poids dans le cartable et limiter les chocs. Une boîte trop grande se laisse écraser par les cahiers de l'après-midi." },
        { type: "quote", text: "Un goûter ne se mesure pas à la contenance de la boîte, mais à son contenant : adapté, il protège et se lave en un tour d'eau." },
        { type: "p", text: "Notre catégorie Trousses et accessoires propose boîtes à goûter et gourdes assorties. Pour la trousse complète, revoyez notre article sur les trousses garnies." },
      ],
    },
    ar: {
      title: "علبة وجبة الأطفال: الحصص الصحيحة والحاوية المناسبة",
      excerpt:
        "أبعاد الحقيبة، الإحكام، الأقسام: كيف نختار العلبة التي تحمي الوجبة دون إثقال الحقيبة.",
      body: [
        { type: "p", text: "يجب أن تدخل علبة الوجبة إلى الحقيبة، وتبقى محكمة، وألا تضيف وزناً. اختيار مدروس يتفادى الأكياس المضغوطة والحمولات المتناثرة داخل القسم." },
        { type: "h2", text: "الشكل المناسب حسب الوجبة" },
        { type: "ul", items: ["علبة مسطحة بسيطة: بسكويت، فواكه جافة", "علبة بأقسام: فواكه وساندويتش ووجبة", "وعاء حراري صغير: جبن، شوربة في الخروجات"] },
        { type: "h2", text: "معايير يجب التحقق منها" },
        { type: "ul", items: ["أبعاد مناسبة للجيب الجانبي للحقيبة", "إحكام مضمون حتى مقلوبة", "فتح سهل ليدين صغيرتين", "خامة خالية من BPA وقابلة للغسيل"] },
        { type: "p", text: "توزيع الحصص في علب صغيرة متعددة يوزع الوزن في الحقيبة ويحد من الصدمات. فالعلبة الكبيرة جداً تنضغط تحت دفاتر بعد الظهر." },
        { type: "quote", text: "لا تُقاس الوجبة بسعة العلبة، بل بحاويتها: مناسبة، تحمي وتُغسل بغسلة ماء." },
        { type: "p", text: "تقدم فئة المقالم والمستلزمات علب وجبات وقارورات متطابقة. وللمقلمة الكاملة، راجعوا مقالنا عن المقالم الكاملة." },
      ],
    },
  },
  {
    slug: "porte-cartable-reflechissant",
    rubrique: "accessoires",
    date: "2026-08-28",
    readTime: 3,
    fr: {
      title: "Porte-cartable réfléchissant : la sécurité de l'enfant sur la route",
      excerpt:
        "Bandes réfléchissantes, jambières de pouce et sangles : l'accessoire qui rend l'enfant visible avant même le lever du jour.",
      body: [
        { type: "p", text: "À l'aube d'hiver, quand les jours raccourcissent, l'enfant se rend à l'école à pied ou à vélo aux heures sombres. Le porte-cartable réfléchissant l'équipe en visibilité sans qu'il pense à quoi que ce soit." },
        { type: "h2", text: "Ce que la visibilité change" },
        { type: "ul", items: ["Un conducteur perçoit la bande réfléchissante jusqu'à 150 m", "Les couleurs vives (orange, jaune) marchent de jour comme de nuit", "Le mouvement des bras et des jambes renforce la détection", "L'enfant est visible par les côtés et par derrière"] },
        { type: "h2", text: "Comment ça fonctionne" },
        { type: "ul", items: ["Bandes à glisser sur les jambes ou les bras du vêtement", "Housses réfléchissantes pour le cartable lui-même", "Sangles de poitrine avec matériau rétroréfléchissant", "Attaches sur le vélo ou la trottinette selon l'usage"] },
        { type: "quote", text: "La meilleure protection du piéton, c'est d'abord d'être vu : un porte-cartable réfléchissant ne coûte rien et peut tout changer." },
        { type: "p", text: "Un accessoire qui complète le trousseau de l'enfant avec nos étiquettes et le reste des fournitures de la catégorie Trousses et accessoires." },
      ],
    },
    ar: {
      title: "حمالة حقيبة عاكسة: سلامة الطفل في الطريق",
      excerpt:
        "شرائط عاكسة، أرجل إبهام وأحزمة: الأكسسوار الذي يجعل الطفل مرئياً قبل شروق الشمس.",
      body: [
        { type: "p", text: "في فجر الشتاء حين تقصر الأيام، يتوجه الطفل إلى المدرسة مشياً أو بالدراجة في ساعات ضبابية. تجهزه حمالة الحقيبة العاكسة بالرؤية دون أن يفكر في شيء." },
        { type: "h2", text: "ما الذي تغيره الرؤية" },
        { type: "ul", items: ["يبصر السائق الشريط العاكس حتى 150 م", "الألوان الزاهية (برتقالي، أصفر) تصلح ليلاً ونهاراً", "حركة الذراعين والرجلين تقوي الاكتشاف", "الطفل مرئي من الجوانب ومن الخلف"] },
        { type: "h2", text: "كيف تعمل" },
        { type: "ul", items: ["شرائط تُوضع على الساقين أو الذراعين", "أغطية عاكسة للحقيبة نفسها", "أحزمة صدر بخامة راجعة للضوء", "مثبتات على الدراجة أو الدراجة البخارية حسب الاستعمال"] },
        { type: "quote", text: "أفضل حماية للمشاة هي أن يكون مرئياً أولاً: حمالة عاكسة لا تكلف شيئاً وقد تغير كل شيء." },
        { type: "p", text: "أكسسوار يكمل ملابس الطفل مع ملصقاتنا وبقية لوازم فئة المقالم والمستلزمات." },
      ],
    },
  },
  {
    slug: "protege-cahiers",
    rubrique: "accessoires",
    date: "2026-08-28",
    readTime: 3,
    fr: {
      title: "Protège-cahiers : l'allié discret des cartables bien tenus",
      excerpt:
        "Transparents, souples ou plastifiés : pourquoi et comment protéger les cahiers des cours pour qu'ils traversent l'année.",
      body: [
        { type: "p", text: "Le protège-cahier est souvent le premier accessoire de la liste de rentrée, et le premier à être abandonné en cours d'année. Correctement choisi, il préserve les copies et range les cours." },
        { type: "h2", text: "Les avantages d'un bon protège-cahier" },
        { type: "ul", items: ["Couvre-lettre qui ne prend pas la poussière et se nettoie", "Transparence pour identifier la matière sans ouvrir", "Renfort des coins, les premiers à s'abîmer", "Durée de vie : un protège par cahier, toute l'année"] },
        { type: "h2", text: "Les types à connaître" },
        { type: "ul", items: ["Souple (classeur PVC) : léger, s'adapte à tous les formats", "Plastifié fin et transparent : le plus courant", "Chemise à rabats pour les feuilles volantes", "Étiquette ou zone à écrire pour le nom et la matière"] },
        { type: "p", text: "Écrivez toujours le nom, la matière et la classe sur l'étiquette : avec les protège-cahiers, l'école où chacun range son ardoise s'anime et tout se retrouve plus vite." },
        { type: "quote", text: "Un cahier protégé dure une année ; un cahier protégé et étiqueté évite trois semaines de recherches en septembre." },
        { type: "p", text: "La catégorie Trousses et accessoires contient protège-cahiers, étiquettes et kits assortis. Pour le reste du contenu du cartable, suivez notre liste fournitures par niveau." },
      ],
    },
    ar: {
      title: "أغلفة الدفاتر: الحليف الصامت لحقائب منظمة",
      excerpt:
        "شفافة، مرنة أو مغلفة: لماذا وكيف نحمي دفاتر الدروس لتجتاز السنة.",
      body: [
        { type: "p", text: "غلاف الدفتر غالباً أول أكسسوار في قائمة الدخول، وأول ما يُهمل في منتصف السنة. مختار جيداً، يحفظ النسخ ويرتب الدروس." },
        { type: "h2", text: "مزايا غلاف جيد" },
        { type: "ul", items: ["غلاف لا يجمع الغبار ويُغسل", "شفافية لتمييز المادة دون فتح", "تعزيز الزوايا، وهي أول ما يتلف", "العمر: غلاف لكل دفتر طوال السنة"] },
        { type: "h2", text: "الأنواع المعروفة" },
        { type: "ul", items: ["مرن (PVC): خفيف ويناسب كل المقاسات", "مغلف رفيع شفاف: الأكثر شيوعاً", "حقيبة بأوشحة للأوراق الطائرة", "ملصق أو منطقة كتابة للاسم والمادة"] },
        { type: "p", text: "اكتبوا دائماً الاسم والمادة والقسم على الملصق: ومع الأغلفة، يجد الكل أغراضه أسرع." },
        { type: "quote", text: "دفتر مغلف يدوم سنة؛ ودفتر مغلف ومعلم يتفادى ثلاثة أسابيع من البحث في شتنبر." },
        { type: "p", text: "تحتوي فئة المقالم والمستلزمات على أغلفة وملصقات ومجموعات متطابقة. لبقية محتوى الحقيبة، اتبعوا قائمتنا باللوازم حسب المستوى." },
      ],
    },
  },
  {
    slug: "entretien-nettoyage-sac",
    rubrique: "guides",
    date: "2026-08-28",
    readTime: 4,
    faq: {
      fr: [
        { q: "Peut-on laver un sac à dos en machine ?", a: "Souvent oui, à basse température et en cycle doux, à condition de le mettre dans une housse ou un drap. Lisez toujours l'étiquette d'entretien." },
        { q: "Comment enlever une tache d'encre du cartable ?", a: "Tamponnez immédiatement avec un chiffon humide et de l'alcool à 90° sans frotter, puis rincez à l'eau claire." },
      ],
      ar: [
        { q: "هل تغسل حقيبة الظهر في الغسالة؟", a: "نعم غالباً، على حرارة منخفضة وببرنامج لطيف، بشرط وضعها في كيس أو شرشف غسيل. اقرأوا دائماً ملصق الصيانة." },
        { q: "كيف نزيل بقع الحبر من الحقيبة؟", a: "انبشوا فوراً بقطعة قماش مبللة وكحول 90 درجة دون فرك، ثم اشطفوا بماء نقي." },
      ],
    },
    fr: {
      title: "Entretenir et nettoyer son sac : mode d'emploi par matière",
      excerpt:
        "Toile, cuir, maillage, doublure : les bons gestes pour garder un sac propre et en bon état toute l'année scolaire.",
      body: [
        { type: "p", text: "Un sac bien entretenu garde son apparence et ses qualités techniques. La règle de base : adaptez toujours le nettoyage à la matière, jamais l'inverse." },
        { type: "h2", text: "Selon la matière" },
        { type: "ul", items: ["Toile synthétique et Oxford : lavage doux, séchage à l'air libre", "Coton enduit : chiffon humide, pas de machine", "Cuir ou similicuir : linge doux et savon spécial", "Maillage : rinçage à l'eau claire seulement"] },
        { type: "h2", text: "L'entretien régulier" },
        { type: "ul", items: ["Brosser le fond et les bretelles chaque semaine", "Vider le sac les vendredis et le secouer", "Réparer les coutures qui s'effilochent avant qu'elles ne cassent", "Nourrir le cuir deux fois par an"] },
        { type: "p", text: "Pour les taches tenaces, agissez vite : une tache fraîche se retire toujours mieux. Évitez le sèche-linge et le soleil brûlant, qui déforment les matières techniques et délavent les couleurs." },
        { type: "quote", text: "L'entretien d'un sac, c'est dix minutes par semaine qui évitent de le remplacer en cours d'année." },
        { type: "p", text: "Un doute sur la matière ? Consultez la fiche produit dans nos catégories Sacs à dos, Sacs ordinateur et Sacs de voyage, qui détaille les consignes d'entretien des modèles." },
      ],
    },
    ar: {
      title: "صيانة الحقيبة وتنظيفها: طريقة العمل حسب الخامة",
      excerpt:
        "قماش، جلد، شبكة، بطانة: الحركات الصحيحة لتبقى الحقيبة نظيفة بحالة جيدة طوال السنة الدراسية.",
      body: [
        { type: "p", text: "الحقيبة التي تُعتنى بها تحتفظ بمظهرها وخصائصها التقنية. القاعدة الأساسية: لئن تناسب التنظيف الخامة دائماً لا العكس." },
        { type: "h2", text: "حسب الخامة" },
        { type: "ul", items: ["قماش صناعي وأكسفورد: غسيل لطيف وتجفيف في الهواء", "قطن مطلي: قطعة مبللة، دون غسالة", "جلد أو جلد صناعي: قماش ناعم وصابون خاص", "شبكة: شطف بماء نقي فقط"] },
        { type: "h2", text: "الصيانة المنتظمة" },
        { type: "ul", items: ["فرشاة للأسفل والأشرطة كل أسبوع", "تفريغ الحقيبة أيام الجمعة ورجّها", "إصلاح الخياطة المتآكلة قبل القص", "تغذية الجلد مرتين في السنة"] },
        { type: "p", text: "لبقع عنيدة، تصرفوا بسرعة: البقع الحديثة تُزال دائماً أحسن. وتجنبوا المجفف والشمس الحارقة اللذين يشوهان الخامات التقنية ويبهتان الألوان." },
        { type: "quote", text: "صيانة الحقيبة عشر دقائق أسبوعياً تتفادى تعويضها في منتصف السنة." },
        { type: "p", text: "شك في الخامة؟ راجعوا بطاقة المنتج في فئات حقائب الظهر، حقائب الحواسيب وحقائب السفر التي تفصل تعليمات صيانة النماذج." },
      ],
    },
  },
  {
    slug: "acheter-sac-en-ligne-maroc",
    rubrique: "guides",
    date: "2026-08-29",
    readTime: 4,
    fr: {
      title: "Acheter son cartable en ligne au Maroc : livraison et paiement à la réception",
      excerpt:
        "Cod, livraison en ville et en région, échange : comment commander son sac en ligne sans risque depuis Rabat à Agadir.",
      body: [
        { type: "p", text: "Commander un cartable en ligne au Maroc demande trois vérifications : le paiement à la livraison, les délais et les conditions d'échange. Bien préparées, elles transforment l'achat en simple formalité." },
        { type: "h2", text: "Le paiement à la réception" },
        { type: "ul", items: ["Le paiement contre livraison (cod) reste le réflexe le plus rassurant", "Payez à la réception après avoir vérifié le produit", "Conservez le bon de livraison et la facture", "Aucun prépaiement demandé pour un simple sac"] },
        { type: "h2", text: "Livraison et délais" },
        { type: "ul", items: ["Casablanca, Rabat, Marrakech, Tanger : livraison sous 2-3 jours", "Agadir, Fès, Meknès, Oujda : 3-5 jours", "Lieux éloignés et villages : réseaux de coursiers et agences", "Suivi du colis par code sur la page dédiée"] },
        { type: "h2", text: "La bonne commande" },
        { type: "ul", items: ["Vérifier le gabarit et la capacité sur la fiche produit", "Relire la politique d'échange si la taille ne convient pas", "Comparer avec le tableau des tailles par âge", "Garder le cartable dans son emballage d'origine en cas d'échange"] },
        { type: "quote", text: "Le bon achat en ligne se joue avant le clic : taille vérifiée, paiement à la réception et politique d'échange lue." },
        { type: "p", text: "Toutes les fiches de nos catégories Cartables, Sacs à dos, Sacs ordinateur, Sacs de voyage et Trousses indiquent capacités, tailles et délais de livraison par ville au Maroc." },
      ],
    },
    ar: {
      title: "شراء الحقيبة أونلاين في المغرب: توصيل ودفع عند الاستلام",
      excerpt:
        "الدفع عند الاستلام، التوصيل في المدن والأقاليم، الإرجاع: كيف تطلبون حقيبتكم دون مخاطرة من الرباط إلى أكادير.",
      body: [
        { type: "p", text: "طلب حقيبة أونلاين في المغرب يتطلب ثلاث تحققات: الدفع عند الاستلام، المدة وشروط الإرجاع. منظمة جيداً، تتحول العملية إلى إجراء بسيط." },
        { type: "h2", text: "الدفع عند الاستلام" },
        { type: "ul", items: ["الدفع عند الاستلام يبقى أكثر العادات طمأنينة", "اذفعوا عند الاستلام بعد التحقق من المنتج", "احتفظوا بورقة التسليم والفاتورة", "لا دفعة مسبقة مطلوبة لحقيبة بسيطة"] },
        { type: "h2", text: "التوصيل والمدة" },
        { type: "ul", items: ["الدار البيضاء والرباط ومراكش وطنجة: توصيل 2-3 أيام", "أكادير وفاس ومكناس ووجدة: 3-5 أيام", "الأماكن النائية والقرى: شبكات السعاة والوكالات", "تتبع الطرد برمز في الصفحة المخصصة"] },
        { type: "h2", text: "الطلب الصحيح" },
        { type: "ul", items: ["التحقق من المقاس والسعة في بطاقة المنتج", "إعادة قراءة سياسة الإرجاع إن لم يناسب المقاس", "المقارنة بجدول الأحجام حسب العمر", "إبقاء الحقيبة في غلافها الأصلي للإرجاع"] },
        { type: "quote", text: "الشراء الجيد أونلاين يُحسم قبل النقر: مقاس متحقق منه، دفع عند الاستلام وسياسة إرجاع مقروءة." },
        { type: "p", text: "توضح كل بطاقات فئات الحقائب المدرسية، حقائب الظهر، حقائب الحواسيب، حقائب السفر والمقالم السعات والأحجام ومدة التوصيل حسب المدينة في المغرب." },
      ],
    },
  },
  {
    slug: "budget-fournitures-rentree",
    rubrique: "guides",
    date: "2026-08-29",
    readTime: 4,
    faq: {
      fr: [
        { q: "Quel budget fournitures pour une rentrée raisonnable ?", a: "Entre 800 et 1 500 DH selon le niveau : cartable, trousse, protège-cahiers et petites fournitures. Le gros poste reste souvent le cartable pour le primaire." },
        { q: "Comment réduire le budget fournitures ?", a: "Réutilisez gommes, règles, ciseaux et trousses en bon état, achetez tôt, et n'achetez le cartable neuf que s'il est réellement nécessaire." },
      ],
      ar: [
        { q: "ما ميزانية لوازم الدخول المعقولة؟", a: "بين 800 و1500 درهم حسب المستوى: حقيبة، مقلمة، أغلفة ولوازم صغيرة. ويظل القسط الأكبر الحقيبة في الابتدائي غالباً." },
        { q: "كيف نقلل ميزانية اللوازم؟", a: "أعيدوا استعمال الممحاة والمسطرة والمقص والمقلمات السليمة، واشتروا مبكراً، ولا تشتروا حقيبة جديدة إلا عند الحاجة الحقيقية." },
      ],
    },
    fr: {
      title: "Budget rentrée scolaire : maîtriser les dépenses du sac à la trousse",
      excerpt:
        "Où va l'argent de la rentrée, ce qui peut être réutilisé et ce qui mérite d'être neuf : un plan simple pour dépenser juste.",
      body: [
        { type: "p", text: "La rentrée pèse sur le budget familial, mais les dépenses ne sont pas toutes obligatoires. Quelques réflexes simples permettent de réserver le neuf à ce qui s'use vraiment : le cartable." },
        { type: "h2", text: "Ce qu'il faut acheter neuf" },
        { type: "ul", items: ["Cartable et sac à dos : la seule vraie dépense renouvelable", "Protège-cahiers et cahiers de l'année", "Chaussures et tenues scolaires", "Gourde si l'ancienne fuit ou est trop petite"] },
        { type: "h2", text: "Ce qui se réutilise sans souci" },
        { type: "ul", items: ["Gommes, règles, ciseaux, trousses en bon état", "Calculatrice et matériel technique", "Classeurs et reliures d'année en année", "Stylos et surligneurs non terminés"] },
        { type: "h2", text: "Le calendrier qui économise" },
        { type: "p", text: "Achetez le cartable en première quinzaine d'août, quand les stocks sont complets et les prix stables, et les fournitures en septembre une fois les promotions lancées. Évitez la semaine précédant la rentrée, la plus chère." },
        { type: "quote", text: "Le vrai budget malin n'est pas dans une petite dépense, mais dans la question de savoir ce qui mérite vraiment d'être neuf." },
        { type: "p", text: "La liste complète par niveau se trouve dans notre article sur les fournitures scolaires, avec le cartable neuf choisi dans nos catégories selon le tableau des tailles par âge." },
      ],
    },
    ar: {
      title: "ميزانية الدخول المدرسي: التحكم في النفقات من الحقيبة إلى المقلمة",
      excerpt:
        "أين تذهب أموال الدخول، ما الذي يُعاد استعماله وما الذي يستحق الجديد: خطة بسيطة لنفقة عادلة.",
      body: [
        { type: "p", text: "يثقل الدخول المدرسي ميزانية الأسرة، لكن ليست كل النفقات إلزامية. عادات بسيطة تكفي لحجز الجديد لما يهترئ حقاً: الحقيبة." },
        { type: "h2", text: "ما يجب شراؤه جديداً" },
        { type: "ul", items: ["الحقيبة المدرسية وحقيبة الظهر: النفقة الوحيدة المتجددة حقاً", "أغلفة الدفاتر ودفاتر السنة", "أحذية وملابس مدرسية", "قارورة إذا كانت القديمة تتسرب أو صغيرة"] },
        { type: "h2", text: "ما يُعاد استعماله دون قلق" },
        { type: "ul", items: ["ممحاة، مسطرة، مقص، مقلمات بحالة جيدة", "آلة حاسبة ومواد تقنية", "ملفات ومجلدات من سنة إلى أخرى", "أقلام وماركر غير منتهية"] },
        { type: "h2", text: "التقويم الذي يوفر" },
        { type: "p", text: "اشتروا الحقيبة في النصف الأول من غشت حين تكتمل المخازن وتستقر الأسعار، واللوازم في شتنبر بعد انطلاق التخفيضات. وتجنبوا الأسبوع الذي يسبق الدخول، وهو الأعلى سعراً." },
        { type: "quote", text: "الميزانية الذكية ليست في مصروف صغير، بل في سؤال: ما الذي يستحق حقاً أن يكون جديداً." },
        { type: "p", text: "القائمة الكاملة حسب المستوى موجودة في مقال اللوازم المدرسية، مع حقيبة جديدة من فئاتنا وفق جدول الأحجام حسب العمر." },
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