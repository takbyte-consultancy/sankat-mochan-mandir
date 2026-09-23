/* =====================================================================
   Sankat Mochan Mandir, Mirzapur — editable site content
   ---------------------------------------------------------------------
   Edit this file to change timings, sevaks, events and gallery.
   No HTML changes needed. Keep the commas and quotes as they are.
   Every value marked [REPLACE] is a placeholder — replace it with
   real information before going live.
   ===================================================================== */

window.SITE_DATA = {

  /* ---------- Darshan & Aarti timings ---------- */
  // Shown in the strip under the hero AND in the Visitor Info table.
  timings: [
    { label: "Morning Darshan",   labelHi: "प्रातः दर्शन",   time: "[REPLACE] 5:00 AM – 12:00 PM" },
    { label: "Afternoon Darshan", labelHi: "मध्याह्न दर्शन", time: "[REPLACE] 3:00 PM – 6:00 PM" },
    { label: "Evening Darshan",   labelHi: "सायं दर्शन",     time: "[REPLACE] 6:00 PM – 10:00 PM" }
  ],

  aartis: [
    { label: "Mangla Aarti",  labelHi: "मंगला आरती",  time: "[REPLACE] 5:00 AM" },
    { label: "Bhog Aarti",    labelHi: "भोग आरती",    time: "[REPLACE] 12:00 PM" },
    { label: "Sandhya Aarti", labelHi: "संध्या आरती", time: "[REPLACE] 7:00 PM" },
    { label: "Shayan Aarti",  labelHi: "शयन आरती",   time: "[REPLACE] 10:00 PM" }
  ],

  /* ---------- Temple family ---------- */
  mahant: {
    name: "Shree Yogendra Nath Tiwari",
    title: "Mahant",
    titleHi: "महंत",
    photo: "assets/images/mahant.jpg",
    note: "[REPLACE] A short line about the Mahant ji's seva at the temple."
  },

  sevaks: [
    { name: "Pt. Vibhav Kumar Upadhyay", photo: "assets/images/sevak-1.jpg" },
    { name: "Pt. Ankit Tiwari",          photo: "assets/images/sevak-2.jpg" },
    { name: "Pt. Arpit Tiwari",          photo: "assets/images/sevak-3.jpg" },
    { name: "Pt. Anubhav Upadhyay",      photo: "assets/images/sevak-4.jpg" }
  ],

  /* ---------- Upcoming events ----------
     date: "YYYY-MM-DD" (used for the gold date seal)
     Past events are hidden automatically. Set showPast: true to keep them. */
  showPastEvents: false,
  events: [
    {
      title: "Hanuman Jayanti",
      titleHi: "हनुमान जयंती",
      date: "2027-04-21",            // [REPLACE] confirm date
      image: "assets/images/event-1.jpg",
      description: "[REPLACE] Special shringar, Sundarkand path and bhandara on Hanuman Jayanti."
    },
    {
      title: "Ram Navami",
      titleHi: "राम नवमी",
      date: "2027-04-15",            // [REPLACE] confirm date
      image: "assets/images/event-2.jpg",
      description: "[REPLACE] Celebrations of Shri Ram's birth with bhajan, kirtan and aarti."
    },
    {
      title: "Sundarkand Path",
      titleHi: "सुंदरकांड पाठ",
      date: "2026-10-06",            // [REPLACE] confirm date
      image: "assets/images/event-3.jpg",
      description: "[REPLACE] Collective Sundarkand path. All devotees are welcome to join."
    }
  ],

  /* ---------- Gallery ----------
     category must be one of: shringar, festivals, temple, events */
  gallery: [
    { src: "assets/images/gallery-1.jpg", category: "shringar",  caption: "[REPLACE] Deity shringar" },
    { src: "assets/images/gallery-2.jpg", category: "temple",    caption: "[REPLACE] Temple entrance" },
    { src: "assets/images/gallery-3.jpg", category: "festivals", caption: "[REPLACE] Hanuman Jayanti" },
    { src: "assets/images/gallery-4.jpg", category: "events",    caption: "[REPLACE] Sundarkand path" },
    { src: "assets/images/gallery-5.jpg", category: "shringar",  caption: "[REPLACE] Tuesday shringar" },
    { src: "assets/images/gallery-6.jpg", category: "temple",    caption: "[REPLACE] Garbhagriha" },
    { src: "assets/images/gallery-7.jpg", category: "festivals", caption: "[REPLACE] Diwali deepotsav" },
    { src: "assets/images/gallery-8.jpg", category: "events",    caption: "[REPLACE] Bhandara" },
    { src: "assets/images/gallery-9.jpg", category: "temple",    caption: "[REPLACE] Evening aarti" }
  ],

  /* ---------- Donations ---------- */
  donation: {
    upiId: "[REPLACE]-upi-id@bank",
    qrImage: "assets/images/donation-qr.png",
    amounts: [101, 251, 501, 1100],
    purposes: ["General Seva", "Bhog/Prasad", "Festival", "Temple Development"]
  },

  /* ---------- Contact ---------- */
  contact: {
    address: "[REPLACE] Full temple address, Mirzapur, Uttar Pradesh – [PIN]",
    phoneDisplay: "[REPLACE] +91 XXXXX XXXXX",
    email: "[REPLACE]-email@example.com",
    // Google Maps → Share → Embed a map → copy only the src="..." URL
    mapEmbed: "https://www.google.com/maps?q=Mirzapur,+Uttar+Pradesh&output=embed"  // [REPLACE]
  },

  /* ---------- Trust ---------- */
  sansthanUrl: "https://SANSTHAN-URL-HERE"   // [REPLACE]
};
