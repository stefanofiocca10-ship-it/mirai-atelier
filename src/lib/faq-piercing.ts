/**
 * FAQ piercing — indicazioni operative in stile atelier, allineate all'approccio di Margot
 * (anatomia, materiali sicuri, calma, aftercare). Testi editabili in futuro se serve CMS.
 */

export type FaqItem = {
  id: string;
  question: string;
  answer: string[];
};

export const FAQ_INTRO = {
  eyebrow: "FAQ · Piercing",
  title: "Come lavoriamo al Mirai",
  lead:
    "Qui trovi le risposte più frequenti su come Margot esegue i piercing in atelier e su come prendersi cura del gioiello dopo la seduta. Sono indicazioni generali: ogni anatomia è diversa e in studio le affiniamo insieme.",
} as const;

export const FAQ_SECTIONS: {
  id: string;
  title: string;
  items: FaqItem[];
}[] = [
  {
    id: "in-atelier",
    title: "In atelier",
    items: [
      {
        id: "consulto",
        question: "Serve un consulto prima del piercing?",
        answer: [
          "Sì, anche breve. Prima di qualsiasi foro guardiamo anatomia, stile di vita, eventuali allergie e il tipo di gioiello più adatto. Non forziamo un piercing se la zona non è adatta: meglio un risultato preciso e duraturo.",
          "Puoi scriverci su WhatsApp o Instagram con una foto della zona: spesso già da lì possiamo orientarti.",
        ],
      },
      {
        id: "materiali",
        question: "Che materiali usate?",
        answer: [
          "Lavoriamo con materiali biocompatibili adatti al piercing (tipicamente titanio implant-grade o oro idoneo, a seconda del pezzo). Evitiamo materiali non adatti alla guarigione iniziale.",
          "Il primo gioiello resta in sede per tutto il tempo di guarigione, salvo indicazioni diverse date in atelier.",
        ],
      },
      {
        id: "igiene",
        question: "Come viene eseguito il piercing?",
        answer: [
          "Procedura sterile, ago monouso, campo di lavoro disinfettato. Margot valuta angolazione e spessore del tessuto: il foro non è «standard», è calibrato sulla tua anatomia.",
          "L'inserimento del gioiello avviene subito dopo, con calma. Spieghiamo ogni passaggio: niente fretta, niente sorprese.",
        ],
      },
      {
        id: "dolore",
        question: "Fa male?",
        answer: [
          "È un momento intenso ma breve. La sensazione dipende dalla zona (orecchio, naso, labbra…) e dalla sensibilità personale. Respirare e restare fermi aiuta molto.",
          "Dopo può esserci gonfiore o calore locale per qualche giorno: è tipico, non è necessariamente un problema.",
        ],
      },
      {
        id: "eta",
        question: "Ci sono limiti di età o documenti?",
        answer: [
          "Per i minorenni chiediamo consenso del genitore/tutore e documento. In atelier ti indichiamo cosa portare al momento della prenotazione.",
        ],
      },
    ],
  },
  {
    id: "aftercare",
    title: "Cura dopo il piercing",
    items: [
      {
        id: "pulizia",
        question: "Come lo pulisco nei primi giorni?",
        answer: [
          "Soluzione salina sterile (spray o lavaggio dedicato) 1–2 volte al giorno, o come indicato in atelier. Mani lavate prima di toccare la zona.",
          "Niente alcool, acqua ossigenata, creme profumate o «rimedi della nonna» aggressivi: irritano e rallentano la guarigione.",
        ],
      },
      {
        id: "toccare",
        question: "Posso muovere o cambiare il gioiello?",
        answer: [
          "No, durante la guarigione non torcere, non «girare» e non togliere il gioiello iniziale. Il movimento continuo irrita il canale.",
          "Il cambio del pezzo si fa in atelier, quando la zona è pronta — non a casa, non troppo presto.",
        ],
      },
      {
        id: "tempi",
        question: "Quanto tempo ci vuole a guarire?",
        answer: [
          "Dipende dalla zona: un lobo può stabilizzarsi in settimane, un cartilage (helix, conch, rook…) richiede mesi. Margot ti dà una stima realistica per il tuo piercing.",
          "«Guarito» non significa solo «non fa più male»: il tessuto interno continua a maturare. Meglio essere pazienti che forzare.",
        ],
      },
      {
        id: "segnali",
        question: "Quando devo preoccuparmi?",
        answer: [
          "Gonfiore lieve, linfa chiara e sensibilità sono comuni all'inizio. Contattaci se noti dolore forte crescente, pus abbondante, febbre, strisce rosse o il gioiello che sprofonda.",
          "Una foto su WhatsApp aiuta a capire se serve un controllo in studio.",
        ],
      },
      {
        id: "vita",
        question: "Doccia, sport, make-up, cuffie?",
        answer: [
          "Doccia ok: asciuga la zona tamponando, senza strofinare. Evita piscine e immersioni nelle prime fasi se te lo abbiamo sconsigliato.",
          "Attento a cuffie, mascherine, occhiali e make-up sulla zona: pressione e prodotti possono irritare. Sport di contatto: aspetta il via libera.",
        ],
      },
    ],
  },
  {
    id: "gioielli",
    title: "Gioielli e follow-up",
    items: [
      {
        id: "scelta",
        question: "Posso scegliere subito lo stile che voglio?",
        answer: [
          "Sì per il look, nei limiti di ciò che è sicuro per quella anatomia e per la guarigione. A volte il pezzo iniziale è più semplice e discreto; il pezzo «statement» arriva al cambio.",
        ],
      },
      {
        id: "controllo",
        question: "Serve un controllo?",
        answer: [
          "Ti diamo indicazioni chiare in uscita. Se qualcosa non ti convince, scrivici: preferiamo rivederti in atelier piuttosto che lasciarti con un dubbio.",
        ],
      },
    ],
  },
];
