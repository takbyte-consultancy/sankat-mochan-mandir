/* =====================================================================
   Sankat Mochan Mandir, Mirzapur — editable site content
   ---------------------------------------------------------------------
   Edit this file to change timings, sevaks, events, gallery, donation
   and contact details. No HTML changes needed.
   Keep the commas and quotes as they are.

   Anything marked [REPLACE] is a placeholder or a SAMPLE value —
   confirm it with the temple before going live.
   ===================================================================== */

window.SITE_DATA = {

  /* ---------- Hero announcement card ---------- */
  announcement: {
    title: "विशेष सूचना",
    titleEn: "Darshan Announcement",
    // [REPLACE] sample text — write the temple's current announcement
    text: "प्रत्येक मंगलवार एवं शनिवार को विशेष सुंदरकांड पाठ एवं महाआरती होती है। अनुष्ठान एवं चोला अर्पण हेतु पूर्व पंजीकरण कराएं।"
  },

  /* ---------- Daily schedule ----------
     start / end use 24-hour "HH:MM" (India time). They drive:
       • the "Darshan Open / Closed" badge in the top bar
       • the schedule table in Visitor Info
     closed: true  → the temple is closed during this slot
     highlight: true → shown in saffron (e.g. the main aarti)
     days: [0..6]  → only this weekday (0 = Sunday, 2 = Tuesday, 6 = Saturday).
                     Leave it out and the row applies every day. Every row still
                     shows in the table; days only decides which one counts as
                     "now" for the open/closed badge.
     [REPLACE] ALL TIMES BELOW ARE SAMPLES — confirm with the temple. */
  schedule: [
    { ritual: "कपाट उद्घाटन व मंगला आरती", ritualEn: "Doors open · Mangla Aarti", start: "05:30", end: "06:00", note: "निर्मल दर्शन" },
    { ritual: "प्रातः दर्शन व हनुमान चालीसा", ritualEn: "Morning darshan", start: "06:00", end: "12:00", note: "सामान्य दर्शन" },
    { ritual: "विश्राम", ritualEn: "Bhog Aarti · Rest", start: "12:00", end: "16:00", note: "कपाट बंद", closed: true },
    { ritual: "सायं दर्शन (अन्य दिन)", ritualEn: "Evening darshan", start: "16:00", end: "21:30", note: "दर्शन", days: [0, 1, 3, 4, 5] },
    { ritual: "सायं दर्शन (मंगलवार)", ritualEn: "Evening darshan · Tuesday", start: "16:00", end: "23:00", note: "दर्शन", days: [2] },
    { ritual: "सायं दर्शन (शनिवार)", ritualEn: "Evening darshan · Saturday", start: "16:00", end: "23:30", note: "दर्शन", days: [6] },
    { ritual: "सायं श्रृंगार", ritualEn: "Evening Shringar", start: "18:30", end: "19:00", note: "शृंगार दर्शन" },
    { ritual: "शयन आरती व कपाट बंद (अन्य दिन)", ritualEn: "Shayan Aarti · Doors close", start: "21:30", end: "22:00", note: "रात्रि विश्राम", days: [0, 1, 3, 4, 5] },
    { ritual: "शयन आरती व कपाट बंद (मंगलवार)", ritualEn: "Shayan Aarti · Tuesday", start: "23:00", end: "23:30", note: "रात्रि विश्राम", days: [2] },
    { ritual: "शयन आरती व कपाट बंद (शनिवार)", ritualEn: "Shayan Aarti · Saturday", start: "23:30", end: "00:00", note: "रात्रि विश्राम", days: [6] }
  ],
  scheduleNote: "विशेष पर्वों पर समय में परिवर्तन हो सकता है। विशेष दर्शन से पहले व्हाट्सएप पर पुष्टि करें।",

  /* Aarti tiles in the hero ("time" is 24-hour HH:MM). [REPLACE] sample times
     byDay: { 2: "23:00" } → a different time on that weekday (0 = Sunday). */
  aartis: [
    { label: "मंगला आरती", labelEn: "Mangla", time: "05:30" },
    // { label: "भोग आरती", labelEn: "Bhog", time: "12:00" },
    // { label: "संध्या महाआरती", labelEn: "Sandhya", time: "19:30" },
    { label: "शयन आरती", labelEn: "Shayan", time: "21:30", byDay: { 2: "23:00", 6: "23:30" } }
  ],

  /* ---------- Temple family ---------- */
  mahant: {
    name: "Shree Yogendra Nath Tiwari",
    nameHi: "श्री योगेंद्र नाथ तिवारी",
    title: "Mahant",
    titleHi: "महंत",
    photo: "assets/images/mahant.jpg",
    // [REPLACE] sample text
    note: "पूज्य महंत जी के सानिध्य में मंदिर की पूजा परंपरा, नित्य अनुष्ठान एवं सेवा कार्य संपन्न होते हैं।"
  },

  // role: shown as a small tag. Change "सेवक" to each person's actual seva if you wish.
  sevaks: [
    { name: "Pt. Vibhav Kumar Upadhyay", nameHi: "पं. विभव कुमार उपाध्याय", role: "सेवक", photo: "assets/images/sevak-1.jpg" },
    { name: "Pt. Ankit Tiwari", nameHi: "पं. अंकित तिवारी", role: "सेवक", photo: "assets/images/sevak-2.jpg" },
    { name: "Pt. Arpit Tiwari", nameHi: "पं. अर्पित तिवारी", role: "सेवक", photo: "assets/images/sevak-3.jpg" },
    { name: "Pt. Anubhav Upadhyay", nameHi: "पं. अनुभव उपाध्याय", role: "सेवक", photo: "assets/images/sevak-4.jpg" }
  ],

  /* ---------- Events ----------
     One-off event:  date: "YYYY-MM-DD"  (gold seal shows the date; hidden after it passes)
     Recurring:      recurring: "प्रत्येक मंगलवार व शनिवार"  (always shown)
     badge: short tag in the corner (e.g. वार्षिक / साप्ताहिक)
     image is optional. */
  showPastEvents: false,
  events: [
    {
      title: "Hanuman Jayanti Mahotsav", titleHi: "श्री हनुमान जयंती महोत्सव",
      tithi: "चैत्र पूर्णिमा", badge: "वार्षिक",
      date: "2027-04-21",                         // [REPLACE] confirm date
      location: "मुख्य मंदिर",
      image: "assets/images/event-1.jpg",
      description: "विशेष श्रृंगार, सुंदरकांड पाठ, महाआरती एवं भंडारा।"
    },
    {
      title: "Shri Ram Navami", titleHi: "श्री राम नवमी महोत्सव",
      tithi: "चैत्र शुक्ल नवमी", badge: "वार्षिक",
      date: "2027-04-15",                         // [REPLACE] confirm date
      location: "मुख्य मंदिर",
      image: "assets/images/event-2.jpg",
      description: "प्रभु श्री राम का प्राकट्योत्सव, रामचरितमानस पाठ एवं प्रसाद वितरण।"
    },
    {
      title: "Vijayadashami (Dussehra)", titleHi: "विजयादशमी (दशहरा)",
      tithi: "आश्विन शुक्ल दशमी", badge: "वार्षिक",
      recurring: "आश्विन शुक्ल दशमी",
      location: "मुख्य मंदिर"
      // [REPLACE] add the description once the temple confirms the day's programme
    },
    {
      title: "Shri Hanuman Janmotsav (Choti Diwali)", titleHi: "श्री हनुमान जन्मोत्सव (छोटी दीपावली)",
      tithi: "कार्तिक कृष्ण चतुर्दशी", badge: "वार्षिक",
      recurring: "नरक चतुर्दशी — दीपावली से एक दिन पूर्व",
      location: "मुख्य मंदिर",
      description: "हनुमानगढ़ी परंपरा अनुसार जन्मोत्सव का शुभारंभ। नरक चतुर्दशी की प्रातः अखंड श्री रामचरितमानस पाठ प्रारंभ होता है।"
    },
    {
      title: "Diwali · Janmotsav at Brahma Muhurat", titleHi: "दीपावली — ब्रह्म मुहूर्त जन्मोत्सव",
      tithi: "कार्तिक अमावस्या", badge: "वार्षिक",
      recurring: "कार्तिक अमावस्या (दीपावली)",
      location: "मुख्य मंदिर",
      description: "दीपावली की प्रातः ब्रह्म मुहूर्त में जन्मोत्सव। इस दिन कपाट पूरे दिन खुले रहते हैं, अखंड श्री रामचरितमानस पाठ का समापन एवं प्रसाद वितरण होता है।"
    },
    {
      title: "Annakut Shringar & Govardhan Puja", titleHi: "अन्नकूट श्रृंगार एवं गोवर्धन पूजा",
      tithi: "कार्तिक शुक्ल प्रतिपदा", badge: "वार्षिक",
      recurring: "दीपावली के अगले दिन",
      location: "मुख्य मंदिर",
      description: "अन्नकूट का श्रृंगार, छप्पन भोग अर्पण एवं गोवर्धन पूजा।"
    },
    {
      title: "Maha Shivratri", titleHi: "महाशिवरात्रि",
      tithi: "फाल्गुन कृष्ण चतुर्दशी", badge: "वार्षिक",
      recurring: "फाल्गुन कृष्ण चतुर्दशी",
      location: "मुख्य मंदिर"
      // [REPLACE] add the description once the temple confirms the day's programme
    },
    {
      title: "Sundarkand Path", titleHi: "सुंदरकांड पाठ",
      tithi: "साप्ताहिक", badge: "साप्ताहिक",
      recurring: "प्रत्येक मंगलवार व शनिवार",       // [REPLACE] confirm day/time
      location: "समय: सायं 05:00 बजे",
      image: "assets/images/event-3.jpg",
      description: "भक्तों द्वारा संगीतमय सुंदरकांड पाठ एवं आरती। सभी श्रद्धालु आमंत्रित हैं।"
    }
  ],

  /* ---------- Gallery ----------
     category must be one of: shringar, aarti, parisar, utsav */
  gallery: [
    { src: "assets/images/gallery-1.jpg", category: "shringar", tag: "श्रृंगार", caption: "मंगलवार श्रृंगार दर्शन" },
    { src: "assets/images/gallery-2.jpg", category: "parisar", tag: "परिसर", caption: "मंदिर प्रवेश द्वार" },
    { src: "assets/images/gallery-3.jpg", category: "aarti", tag: "आरती", caption: "संध्या महाआरती" },
    { src: "assets/images/gallery-4.jpg", category: "utsav", tag: "उत्सव", caption: "हनुमान जयंती" },
    { src: "assets/images/gallery-5.jpg", category: "shringar", tag: "श्रृंगार", caption: "सिंदूर चोला श्रृंगार" },
    { src: "assets/images/gallery-6.jpg", category: "parisar", tag: "परिसर", caption: "गर्भगृह" },
    { src: "assets/images/gallery-7.jpg", category: "utsav", tag: "उत्सव", caption: "दीपोत्सव" },
    { src: "assets/images/gallery-8.jpg", category: "aarti", tag: "आरती", caption: "अखंड दीप" },
    { src: "assets/images/gallery-9.jpg", category: "utsav", tag: "उत्सव", caption: "भंडारा" }
  ],

  /* ---------- Donations ---------- */
  donation: {
    upiId: "upi-id@bank",
    qrImage: "assets/images/donation-qr.png",
    amounts: [101, 251, 501, 1100, 2100, 5100],
    defaultAmount: 501,
    purposes: [
      "दिव्य दर्शन (Live Darshan)",
      "रुद्राभिषेक पूजा ऑनलाइन बुकिंग (Rudrabhishek Puja Booking)",
      "दर्शन बुकिंग (Darshan Booking)",
      "दिव्य-अर्पण एवं कर्मकाण्ड (Spiritual Offerings)",
      "भगवान् का भोग (Bhagvan Ka Bhog)",
      "दरिद्रनारायण भोज (Daridranarayan Bhoj)",
      "सिन्दूर श्रृंगार (Sindoor Shringar)",
      "साधुसेवा (Sadhu Seva)",
      "अखण्ड-ज्योति (Akhand-Jyoti)",
      "ध्वजारोहण (Dhvajarohan)",
      "पुष्प श्रृंगार (Pushp Shringar)",
      "पूजा-पाठ (Pooja-Path)",
      "नैवेद्यम/अर्पितम (Naivedyam/Arpitam)"
    ]
  },

  /* ---------- Trust ---------- */
  trust: {
    name: "संकट मोचन सेवा संस्थान",
    nameEn: "Sankat Mochan Seva Sansthan",
    // [REPLACE] describe the Sansthan
    description: "मंदिर का प्रबंधन एवं सेवा कार्य संकट मोचन सेवा संस्थान द्वारा संचालित किए जाते हैं। संस्थान के कार्यों का संक्षिप्त विवरण यहाँ लिखें।",
    activities: ["अन्नक्षेत्र", "उत्सव आयोजन", "श्रद्धालु सेवा"],
    url: "https://sankatmochansevasansthan.org",          // [REPLACE]
    registrationNo: ""                         // e.g. "Reg. No. ..." — leave "" to hide
  },

  /* ---------- Contact ---------- */
  contact: {
    addressLines: ["श्री संकट मोचन मंदिर", "वासलीगंज मार्ग", "मिर्ज़ापुर, उत्तर प्रदेश - 231001"],
    phones: [
      { label: "मंदिर कार्यालय", number: "+91 8874722227" }
    ],
    officeHours: "प्रतिदिन प्रातः 06:00 से रात्रि 09:00",
    emails: ["sankatmochansevamzp@gmail.com"],
    // Google Maps → Share → Embed a map → copy only the src="..." URL
    mapEmbed: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3611.559496346346!2d82.57221517538028!3d25.150579377740968!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x398fc1cdd0accadb%3A0x261496e7036d6200!2sSankat%20Mochan%20Mandir%2C%20Mirjapur!5e0!3m2!1sen!2sin!4v1790249160039!5m2!1sen!2sin", // [REPLACE]
    mapLink: "https://maps.app.goo.gl/gtMu5TyE5UXc6YkM8"                    // [REPLACE]
  }
};
