/* Ofoq Billets — agence de billets d'avion fictive (démonstration). Données et textes FR / EN / AR. */
window.D = {
  wa: "213550284873",
  rates: { DZD: 1, EUR: 1 / 150, USD: 1 / 132 },
  phones: [["+213", "DZ"], ["+33", "FR"], ["+34", "ES"], ["+39", "IT"], ["+32", "BE"], ["+41", "CH"], ["+44", "GB"], ["+49", "DE"], ["+1", "CA/US"], ["+216", "TN"], ["+212", "MA"], ["+90", "TR"], ["+971", "AE"], ["+974", "QA"], ["+966", "SA"]],
  from: [["ALG", { fr: "Alger", en: "Algiers", ar: "الجزائر" }], ["ORN", { fr: "Oran", en: "Oran", ar: "وهران" }], ["CZL", { fr: "Constantine", en: "Constantine", ar: "قسنطينة" }], ["AAE", { fr: "Annaba", en: "Annaba", ar: "عنابة" }], ["TLM", { fr: "Tlemcen", en: "Tlemcen", ar: "تلمسان" }], ["BLJ", { fr: "Batna", en: "Batna", ar: "باتنة" }]],
  /* destinations : prix aller-retour de base en DA, durée de vol, code vol, heure de départ */
  to: [
    { id: "CDG", c: { fr: "Paris", en: "Paris", ar: "باريس" }, k: { fr: "France", en: "France", ar: "فرنسا" }, p: 58000, h: "2 h 10", f: "OF 301", t: "07:40", img: "dest/paris.webp", pos: "50% 30%" },
    { id: "MRS", c: { fr: "Marseille", en: "Marseille", ar: "مرسيليا" }, k: { fr: "France", en: "France", ar: "فرنسا" }, p: 49000, h: "1 h 45", f: "OF 118", t: "09:15" },
    { id: "LYS", c: { fr: "Lyon", en: "Lyon", ar: "ليون" }, k: { fr: "France", en: "France", ar: "فرنسا" }, p: 52000, h: "2 h 05", f: "OF 224", t: "11:50" },
    { id: "MAD", c: { fr: "Madrid", en: "Madrid", ar: "مدريد" }, k: { fr: "Espagne", en: "Spain", ar: "إسبانيا" }, p: 54000, h: "1 h 40", f: "OF 507", t: "13:20" },
    { id: "IST", c: { fr: "Istanbul", en: "Istanbul", ar: "إسطنبول" }, k: { fr: "Turquie", en: "Türkiye", ar: "تركيا" }, p: 61000, h: "3 h 15", f: "OF 642", t: "15:05" },
    { id: "LHR", c: { fr: "Londres", en: "London", ar: "لندن" }, k: { fr: "Royaume-Uni", en: "United Kingdom", ar: "المملكة المتحدة" }, p: 78000, h: "3 h 00", f: "OF 733", t: "16:40" },
    { id: "DXB", c: { fr: "Dubaï", en: "Dubai", ar: "دبي" }, k: { fr: "Émirats arabes unis", en: "United Arab Emirates", ar: "الإمارات" }, p: 96000, h: "6 h 40", f: "OF 810", t: "19:30" },
    { id: "YUL", c: { fr: "Montréal", en: "Montréal", ar: "مونتريال" }, k: { fr: "Canada", en: "Canada", ar: "كندا" }, p: 142000, h: "8 h 30", f: "OF 905", t: "21:10", img: "dest/montreal.webp", pos: "50% 50%" }
  ],
  /* coefficient de prix par mois, de janvier à décembre */
  season: [0.86, 0.82, 0.88, 0.95, 0.92, 1.12, 1.45, 1.5, 1.05, 0.9, 0.84, 1.18],
  fares: [
    { id: "eco", add: 0, n: { fr: "Éco", en: "Basic", ar: "اقتصادي" }, d: { fr: "Bagage cabine seulement.", en: "Cabin bag only.", ar: "حقيبة اليد فقط." } },
    { id: "bag", add: 5500, n: { fr: "Éco et valise", en: "Basic plus bag", ar: "اقتصادي مع حقيبة" }, d: { fr: "Une valise de 23 kg par voyageur.", en: "One 23 kg suitcase per traveller.", ar: "حقيبة 23 كغ لكل مسافر." } },
    { id: "flex", add: 12000, n: { fr: "Flex", en: "Flex", ar: "مرن" }, d: { fr: "Valise et changement de date sans frais d'agence.", en: "Suitcase and date change with no agency fee.", ar: "حقيبة وتغيير التاريخ دون رسوم الوكالة." } }
  ],
  visa: [
    { id: "fr", c: { fr: "France", en: "France", ar: "فرنسا" }, n: { fr: "Visa Schengen court séjour", en: "Schengen short stay visa", ar: "تأشيرة شنغن قصيرة الإقامة" }, p: 8000, d: { fr: "Dossier vérifié, prise de rendez-vous, lettre de motivation et suivi.", en: "File check, appointment booking, cover letter and follow-up.", ar: "مراجعة الملف وحجز الموعد ورسالة التحفيز والمتابعة." } },
    { id: "es", c: { fr: "Espagne", en: "Spain", ar: "إسبانيا" }, n: { fr: "Visa Schengen Espagne", en: "Spain Schengen visa", ar: "تأشيرة شنغن إسبانيا" }, p: 8000, d: { fr: "Dossier vérifié et rendez-vous à Alger ou Oran.", en: "File check and appointment in Algiers or Oran.", ar: "مراجعة الملف وموعد في الجزائر أو وهران." } },
    { id: "tr", c: { fr: "Turquie", en: "Türkiye", ar: "تركيا" }, n: { fr: "e-Visa Turquie", en: "Türkiye e-Visa", ar: "تأشيرة تركيا الإلكترونية" }, p: 4000, d: { fr: "Formulaire rempli avec vous et envoyé le jour même.", en: "Form completed with you and sent the same day.", ar: "نملأ الاستمارة معك ونرسلها في اليوم نفسه." } },
    { id: "ca", c: { fr: "Canada", en: "Canada", ar: "كندا" }, n: { fr: "Visiteur Canada", en: "Canada visitor visa", ar: "تأشيرة زائر كندا" }, p: 15000, d: { fr: "Dossier complet en ligne, biométrie et suivi du dossier.", en: "Complete online file, biometrics and file follow-up.", ar: "ملف كامل عبر الإنترنت وبصمات ومتابعة." } }
  ]
};

window.T = {
  fr: {
    dir: "ltr", title: "Ofoq Billets, billets d'avion depuis l'Algérie",
    nav: ["Les départs", "Calendrier des prix", "Formules", "Visas", "Mon billet", "Questions"],
    book: "Réserver un billet", bookShort: "Réserver", demo: "Site de démonstration, agence fictive",
    heroH: "Partez quand le prix est bas.", heroP: "Billets d'avion depuis Alger, Oran, Constantine et d'autres villes. Le prix vous est confirmé avant de payer.",
    heroCta: "Voir les départs", scroll: "Faites défiler",
    ph: [
      { t: "17 h 40", n: "Embarquement", s: "Vous choisissez la ville, la date et les voyageurs. Nous vous répondons avec un prix ferme." },
      { t: "22 h 15", n: "En vol", s: "Un changement de date est possible avec la formule Flex, sans frais d'agence." },
      { t: "06 h 05", n: "Arrivée", s: "Votre billet vous est envoyé sur WhatsApp, avec le numéro de dossier pour le suivre." }
    ],
    depH: "Les départs de la semaine", depP: "Prix aller-retour par personne, au départ d'Alger. Touchez un vol pour le réserver.",
    from: "dès", pp: "par personne", dur: "Durée", flight: "Vol", dep: "Départ", price: "Prix",
    calH: "Quand partir, pour payer moins", calP: "Choisissez une destination. Les barres montrent le prix moyen de chaque mois.", calBest: "Mois le moins cher", calHigh: "Mois le plus cher",
    farH: "Trois formules, un seul prix clair", farP: "Le supplément est le même pour tous les vols.", perPax: "par voyageur",
    visaH: "Un billet, mais aussi le visa", visaP: "Nous préparons votre dossier en même temps que votre vol.", visaBtn: "Demander ce visa", visaFrom: "Service dès",
    trkH: "Où en est mon billet", trkP: "Entrez le numéro reçu sur WhatsApp. Essayez OFQ-52107.", trkIn: "Numéro, par exemple OFQ-52107", trkBtn: "Voir", trkNo: "Numéro introuvable. Vérifiez les lettres et les chiffres, par exemple OFQ-52107.",
    steps: ["Demande reçue", "Prix confirmé", "Paiement reçu", "Billet envoyé"],
    faqH: "Questions fréquentes",
    faq: [
      ["Le prix affiché est-il définitif ?", "C'est un prix estimé selon le mois et les voyageurs. Nous le confirmons sur WhatsApp avant tout paiement, et il ne change plus ensuite."],
      ["Comment payer ?", "En espèces ou par virement à l'agence, ou par carte. Pour un billet cher, un acompte bloque le tarif."],
      ["Puis-je changer la date ?", "Avec la formule Flex, oui, sans frais d'agence. Avec les autres, la compagnie applique ses propres conditions, que nous vous indiquons avant l'achat."],
      ["Réservez-vous pour les enfants et les bébés ?", "Oui. Un enfant de 2 à 11 ans paie environ 75 % du tarif, un bébé de moins de 2 ans 10 %."],
      ["Combien de temps pour recevoir le billet ?", "En général, dans l'heure qui suit le paiement, pendant nos heures d'ouverture."]
    ],
    footH: "Bon vol.", addr: "Alger, adresse communiquée à la confirmation", hours: "Dimanche à jeudi, 9 h à 18 h",
    bkH: "Votre billet", b1: "Le trajet", b2: "Les dates", b3: "Les voyageurs", b4: "La formule", b5: "Vos coordonnées",
    rt: "Aller-retour", ow: "Aller simple", fromL: "Ville de départ", toL: "Destination", d1: "Départ", d2: "Retour", ad: "Adultes", ch: "Enfants (2 à 11 ans)", inf: "Bébés (moins de 2 ans)",
    name: "Nom et prénom (comme sur le passeport)", phone: "Téléphone", note: "Une précision ? (bagage, horaire préféré…)",
    needDate: "Choisissez les dates du voyage.", needRet: "La date de retour doit suivre la date de départ.", needName: "Indiquez votre nom et votre téléphone.",
    est: "Prix estimé", tot: "Total", send: "Envoyer sur WhatsApp", sendNote: "Votre demande s'ouvre dans WhatsApp. Rien n'est payé maintenant, le prix est confirmé avant.",
    okH: "Demande prête", okP: "Envoyez le message dans WhatsApp. Gardez ce numéro :", track: "Suivre mon billet", close: "Fermer",
    waHead: "Bonjour, je souhaite réserver un billet d'avion chez Ofoq Billets.", waCode: "Dossier", waTrip: "Trajet", waDates: "Dates", waPax: "Voyageurs", waFare: "Formule", waName: "Nom", waPhone: "Téléphone", waTotal: "Prix estimé", waNote: "Remarque", waVisa: "Demande de visa", waRT: "Aller-retour", waOW: "Aller simple", waAd: "adulte(s)", waCh: "enfant(s)", waInf: "bébé(s)"
  },
  en: {
    dir: "ltr", title: "Ofoq Billets, flight tickets from Algeria",
    nav: ["Departures", "Price calendar", "Fares", "Visas", "My ticket", "Questions"],
    book: "Book a ticket", bookShort: "Book", demo: "Demo site, fictional agency",
    heroH: "Fly when the price is low.", heroP: "Flight tickets from Algiers, Oran, Constantine and more. The price is confirmed to you before you pay.",
    heroCta: "See departures", scroll: "Scroll",
    ph: [
      { t: "5:40 pm", n: "Boarding", s: "You choose the city, the date and the travellers. We reply with a firm price." },
      { t: "10:15 pm", n: "In flight", s: "A date change is possible with the Flex fare, with no agency fee." },
      { t: "6:05 am", n: "Arrival", s: "Your ticket is sent on WhatsApp, with a file number to follow it." }
    ],
    depH: "This week's departures", depP: "Return price per person, from Algiers. Tap a flight to book it.",
    from: "from", pp: "per person", dur: "Duration", flight: "Flight", dep: "Departs", price: "Price",
    calH: "When to go to pay less", calP: "Pick a destination. The bars show the average price of each month.", calBest: "Cheapest month", calHigh: "Most expensive month",
    farH: "Three fares, one clear price", farP: "The extra is the same for every flight.", perPax: "per traveller",
    visaH: "A ticket, and the visa too", visaP: "We prepare your file at the same time as your flight.", visaBtn: "Ask for this visa", visaFrom: "Service from",
    trkH: "Where is my ticket", trkP: "Enter the number you got on WhatsApp. Try OFQ-52107.", trkIn: "Number, for example OFQ-52107", trkBtn: "Check", trkNo: "Number not found. Check the letters and digits, for example OFQ-52107.",
    steps: ["Request received", "Price confirmed", "Payment received", "Ticket sent"],
    faqH: "Frequently asked questions",
    faq: [
      ["Is the displayed price final?", "It is an estimate based on the month and the travellers. We confirm it on WhatsApp before any payment, and it no longer changes after that."],
      ["How do I pay?", "Cash or bank transfer at the agency, or by card. For an expensive ticket, a deposit holds the fare."],
      ["Can I change the date?", "With the Flex fare, yes, with no agency fee. With the others, the airline applies its own conditions, which we tell you before you buy."],
      ["Do you book for children and babies?", "Yes. A child aged 2 to 11 pays about 75% of the fare, a baby under 2 pays 10%."],
      ["How long until I get the ticket?", "Usually within the hour after payment, during opening hours."]
    ],
    footH: "Have a good flight.", addr: "Algiers, address sent with your confirmation", hours: "Sunday to Thursday, 9 am to 6 pm",
    bkH: "Your ticket", b1: "The route", b2: "The dates", b3: "The travellers", b4: "The fare", b5: "Your details",
    rt: "Return", ow: "One way", fromL: "Departure city", toL: "Destination", d1: "Departure", d2: "Return", ad: "Adults", ch: "Children (2 to 11)", inf: "Babies (under 2)",
    name: "Full name (as on the passport)", phone: "Phone", note: "Anything to add? (luggage, preferred time…)",
    needDate: "Choose the travel dates.", needRet: "The return date must come after the departure date.", needName: "Enter your name and phone number.",
    est: "Estimated price", tot: "Total", send: "Send on WhatsApp", sendNote: "Your request opens in WhatsApp. Nothing is paid now, the price is confirmed first.",
    okH: "Request ready", okP: "Send the message in WhatsApp. Keep this number:", track: "Track my ticket", close: "Close",
    waHead: "Bonjour, je souhaite réserver un billet d'avion chez Ofoq Billets.", waCode: "Dossier", waTrip: "Trajet", waDates: "Dates", waPax: "Voyageurs", waFare: "Formule", waName: "Nom", waPhone: "Téléphone", waTotal: "Prix estimé", waNote: "Remarque", waVisa: "Demande de visa", waRT: "Aller-retour", waOW: "Aller simple", waAd: "adulte(s)", waCh: "enfant(s)", waInf: "bébé(s)"
  },
  ar: {
    dir: "rtl", title: "أفق للتذاكر، تذاكر طيران من الجزائر",
    nav: ["الرحلات", "تقويم الأسعار", "الباقات", "التأشيرات", "تذكرتي", "أسئلة"],
    book: "احجز تذكرة", bookShort: "احجز", demo: "موقع تجريبي، وكالة خيالية",
    heroH: "سافر حين ينخفض السعر.", heroP: "تذاكر طيران من الجزائر ووهران وقسنطينة ومدن أخرى. نؤكد لك السعر قبل أن تدفع.",
    heroCta: "شاهد الرحلات", scroll: "مرّر للأسفل",
    ph: [
      { t: "5:40 م", n: "الصعود إلى الطائرة", s: "تختار المدينة والتاريخ والمسافرين، ونردّ عليك بسعر نهائي." },
      { t: "10:15 م", n: "في الجو", s: "يمكن تغيير التاريخ مع باقة المرونة دون رسوم الوكالة." },
      { t: "6:05 ص", n: "الوصول", s: "تصلك تذكرتك على واتساب مع رقم ملف لتتبّعها." }
    ],
    depH: "رحلات هذا الأسبوع", depP: "سعر الذهاب والإياب للشخص، من الجزائر العاصمة. اضغط على رحلة لحجزها.",
    from: "ابتداءً من", pp: "للشخص", dur: "المدة", flight: "الرحلة", dep: "الإقلاع", price: "السعر",
    calH: "متى تسافر لتدفع أقل", calP: "اختر وجهة. تُظهر الأعمدة متوسط سعر كل شهر.", calBest: "أرخص شهر", calHigh: "أغلى شهر",
    farH: "ثلاث باقات وسعر واضح", farP: "الفرق نفسه لكل الرحلات.", perPax: "للمسافر",
    visaH: "تذكرة وتأشيرة أيضًا", visaP: "نجهّز ملفك في الوقت نفسه الذي نحجز فيه رحلتك.", visaBtn: "اطلب هذه التأشيرة", visaFrom: "الخدمة ابتداءً من",
    trkH: "أين وصلت تذكرتي", trkP: "أدخل الرقم الذي وصلك على واتساب. جرّب OFQ-52107.", trkIn: "الرقم، مثلًا OFQ-52107", trkBtn: "عرض", trkNo: "الرقم غير موجود. تأكد من الحروف والأرقام، مثلًا OFQ-52107.",
    steps: ["تم استلام الطلب", "تأكد السعر", "تم استلام الدفع", "أُرسلت التذكرة"],
    faqH: "أسئلة شائعة",
    faq: [
      ["هل السعر المعروض نهائي؟", "هو سعر تقديري حسب الشهر والمسافرين. نؤكده لك على واتساب قبل أي دفع ولا يتغير بعد ذلك."],
      ["كيف أدفع؟", "نقدًا أو بتحويل بنكي في الوكالة أو بالبطاقة. للتذاكر الغالية يثبّت عربون السعر."],
      ["هل يمكنني تغيير التاريخ؟", "مع باقة المرونة نعم دون رسوم الوكالة. مع الباقات الأخرى تطبّق شركة الطيران شروطها ونخبرك بها قبل الشراء."],
      ["هل تحجزون للأطفال والرضّع؟", "نعم. يدفع الطفل من 2 إلى 11 سنة نحو 75% من السعر والرضيع دون سنتين 10%."],
      ["كم تستغرق التذكرة لتصلني؟", "عادةً خلال ساعة بعد الدفع في أوقات العمل."]
    ],
    footH: "رحلة سعيدة.", addr: "الجزائر العاصمة، يُرسل العنوان مع التأكيد", hours: "من الأحد إلى الخميس، 9 صباحًا إلى 6 مساءً",
    bkH: "تذكرتك", b1: "المسار", b2: "التواريخ", b3: "المسافرون", b4: "الباقة", b5: "بياناتك",
    rt: "ذهاب وإياب", ow: "ذهاب فقط", fromL: "مدينة المغادرة", toL: "الوجهة", d1: "المغادرة", d2: "العودة", ad: "بالغون", ch: "أطفال (من 2 إلى 11)", inf: "رضّع (أقل من سنتين)",
    name: "الاسم الكامل (كما في جواز السفر)", phone: "الهاتف", note: "هل من توضيح؟ (الأمتعة، الوقت المفضّل…)",
    needDate: "اختر تواريخ السفر.", needRet: "يجب أن يكون تاريخ العودة بعد تاريخ المغادرة.", needName: "أدخل اسمك ورقم هاتفك.",
    est: "السعر التقديري", tot: "المجموع", send: "أرسل عبر واتساب", sendNote: "يُفتح طلبك في واتساب. لا يُدفع شيء الآن ويُؤكَّد السعر أولًا.",
    okH: "الطلب جاهز", okP: "أرسل الرسالة في واتساب واحتفظ بهذا الرقم:", track: "تتبّع تذكرتي", close: "إغلاق",
    waHead: "Bonjour, je souhaite réserver un billet d'avion chez Ofoq Billets.", waCode: "Dossier", waTrip: "Trajet", waDates: "Dates", waPax: "Voyageurs", waFare: "Formule", waName: "Nom", waPhone: "Téléphone", waTotal: "Prix estimé", waNote: "Remarque", waVisa: "Demande de visa", waRT: "Aller-retour", waOW: "Aller simple", waAd: "adulte(s)", waCh: "enfant(s)", waInf: "bébé(s)"
  }
};
