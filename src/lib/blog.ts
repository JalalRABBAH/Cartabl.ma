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